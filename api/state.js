import crypto from 'node:crypto';
import { createClient } from 'redis';

const CHANNEL_PREFIX = 'topotino:channel:';
const RECOVERY_PREFIX = 'topotino:recovery:';

let redisClientPromise = null;

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
    console.error('State API failed', error);
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

async function syncChannel(body, res) {
  const channelId = String(body.channelId || '');
  const recoveryCode = String(body.recoveryCode || '').trim().toUpperCase();
  const revision = Number(body.revision) || 0;

  if (!channelId || !recoveryCode || !revision) {
    return res.status(400).json({ error: 'Missing sync fields' });
  }

  const record = await getChannel(channelId);
  if (!record || record.recoveryHash !== sha256(recoveryCode)) {
    return res.status(403).json({ error: 'Invalid recovery code' });
  }

  if (Number(record.revision || 0) > revision) {
    return res.status(409).json({
      error: 'Remote state is newer',
      remote: publicRecord(record)
    });
  }

  const updatedRecord = {
    ...record,
    state: sanitizeState(body.state || {}),
    revision,
    updatedAt: new Date().toISOString()
  };

  await redisCommand('SET', channelKey(channelId), JSON.stringify(updatedRecord));

  return res.status(200).json(publicRecord(updatedRecord));
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

async function redisCommand(command, ...args) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return redisRestCommand(command, ...args);
  }

  return redisUrlCommand(command, ...args);
}

async function redisRestCommand(command, ...args) {
  const response = await fetch(process.env.KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([command, ...args])
  });

  if (!response.ok) {
    throw new Error(`Redis command failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function redisUrlCommand(command, ...args) {
  const client = await getRedisClient();
  return client.sendCommand([command, ...args.map(String)]);
}

async function getRedisClient() {
  if (!redisClientPromise) {
    const client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (error) => {
      console.error('Redis client error', error);
    });
    redisClientPromise = client.connect().then(() => client);
  }

  return redisClientPromise;
}

function hasRedisStorage() {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    process.env.REDIS_URL
  );
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
