import crypto from 'node:crypto';
import { hasRedisStorage, redisCommand, storageMode } from './_lib/storage.js';

const CHANNEL_PREFIX = 'topotino:channel:';
const RECOVERY_PREFIX = 'topotino:recovery:';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!hasRedisStorage()) {
    return res.status(503).json({ error: 'STATE_STORAGE_NOT_CONFIGURED' });
  }

  const body = req.body || {};
  const action = String(body.action || '');

  try {
    if (action === 'init') return await initChannel(body, res);
    if (action === 'sync') return await syncChannel(body, res);
    if (action === 'restore') return await restoreChannel(body, res);

    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    console.error('State API failed', {
      action,
      storageMode: storageMode(),
      name: error?.name,
      message: error?.message
    });
    return res.status(500).json({ error: 'State API failed' });
  }
}

async function initChannel(body, res) {
  const channelId = crypto.randomUUID();
  const recoveryCode = makeRecoveryCode();
  const recoveryHash = sha256(recoveryCode);
  const now = new Date().toISOString();
  const revision = Number(body.revision) || 1;

  const record = {
    channelId,
    recoveryHash,
    state: sanitizeState(body.state || {}),
    revision,
    createdAt: now,
    updatedAt: now
  };

  await redisCommand('SET', channelKey(channelId), JSON.stringify(record));
  await redisCommand('SET', recoveryKey(recoveryHash), channelId);

  return res.status(200).json({
    channelId,
    recoveryCode,
    revision,
    updatedAt: now
  });
}

// Compare and update in one Redis operation for REST and direct connections.
const SYNC_SCRIPT = `
local raw = redis.call('GET', KEYS[1])
if not raw then return cjson.encode({status=403}) end
local record = cjson.decode(raw)
if record.recoveryHash ~= ARGV[1] then return cjson.encode({status=403}) end
if record.lastOperationId == ARGV[3] and record.lastOperationHash == ARGV[4] then
  return cjson.encode({status=200,recordJSON=raw})
end
if tonumber(record.revision) ~= tonumber(ARGV[2]) then
  return cjson.encode({status=409,recordJSON=raw})
end
-- Keep the JS-serialized record verbatim: cjson would turn empty arrays into
-- objects, corrupting messages, flags and the campaign outbox on restore.
redis.call('SET', KEYS[1], ARGV[5])
return cjson.encode({status=200,recordJSON=ARGV[5]})
`;

async function syncChannel(body, res) {
  const channelId = String(body.channelId || '');
  const recoveryCode = String(body.recoveryCode || '').trim().toUpperCase();
  const baseRevision = Number(body.baseRevision);
  const operationId = String(body.operationId || '');
  if (!channelId || !recoveryCode) return res.status(400).json({ error: 'Missing sync fields' });
  // Older clients must refresh rather than overwrite a newer device silently.
  if (body.baseRevision == null || !Number.isSafeInteger(baseRevision) || baseRevision < 1 || !operationId || operationId.length > 120) {
    return res.status(409).json({ error: 'Refresh the app before synchronizing' });
  }
  const record = await getChannel(channelId);
  if (!record) return res.status(403).json({ error: 'Invalid recovery code' });
  const payload = JSON.stringify(sanitizeState(body.state || {}));
  const operationHash = sha256(`${baseRevision}:${payload}`);
  const candidate = JSON.stringify({
    ...record, state: JSON.parse(payload), revision: baseRevision + 1,
    updatedAt: new Date().toISOString(), lastOperationId: operationId, lastOperationHash: operationHash
  });
  const resultRaw = await redisCommand('EVAL', SYNC_SCRIPT, '1', channelKey(channelId),
    sha256(recoveryCode), String(baseRevision), operationId, operationHash, candidate);
  const result = typeof resultRaw === 'string' ? JSON.parse(resultRaw) : resultRaw;
  if (result.status === 403) return res.status(403).json({ error: 'Invalid recovery code' });
  const savedRecord = JSON.parse(result.recordJSON);
  if (result.status === 409) return res.status(409).json({ error: 'Remote state changed', remote: publicRecord(savedRecord) });
  return res.status(200).json(publicRecord(savedRecord));
}

async function restoreChannel(body, res) {
  const recoveryCode = String(body.recoveryCode || '').trim().toUpperCase();
  if (!recoveryCode) {
    return res.status(400).json({ error: 'Missing recovery code' });
  }

  const recoveryHash = sha256(recoveryCode);
  const channelId = await redisCommand('GET', recoveryKey(recoveryHash));
  if (!channelId) {
    return res.status(404).json({ error: 'Recovery code not found' });
  }

  const record = await getChannel(String(channelId));
  if (!record || record.recoveryHash !== recoveryHash) {
    return res.status(404).json({ error: 'Recovery code not found' });
  }

  return res.status(200).json(publicRecord(record));
}

async function getChannel(channelId) {
  const raw = await redisCommand('GET', channelKey(channelId));
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

function publicRecord(record) {
  return {
    channelId: record.channelId,
    state: record.state || {},
    revision: Number(record.revision) || 0,
    updatedAt: record.updatedAt || null
  };
}

function sanitizeState(value) {
  const state = { ...(value || {}) };
  delete state.recoveryCode;
  delete state.syncStatus;
  delete state.syncError;
  delete state.syncConflict;
  delete state.serverRevision;
  return state;
}

function channelKey(channelId) {
  return `${CHANNEL_PREFIX}${channelId}`;
}

function recoveryKey(hash) {
  return `${RECOVERY_PREFIX}${hash}`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function makeRecoveryCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  const chars = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]);
  return `TOPO-${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}`;
}
