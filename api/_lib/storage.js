import { createClient } from 'redis';

const COMMAND_TIMEOUT_MS = 5000;

let redisClientPromise = null;

export function hasRedisStorage() {
  return Boolean(
    (getRestUrl() && getRestToken()) ||
    process.env.REDIS_URL
  );
}

export function storageMode() {
  if (getRestUrl() && getRestToken()) return 'rest';
  if (process.env.REDIS_URL) return 'url';
  return 'none';
}

export async function redisCommand(command, ...args) {
  if (getRestUrl() && getRestToken()) {
    return redisRestCommand(command, ...args);
  }

  if (process.env.REDIS_URL) {
    return redisUrlCommand(command, ...args);
  }

  throw new Error('STATE_STORAGE_NOT_CONFIGURED');
}

async function redisRestCommand(command, ...args) {
  const response = await fetch(getRestUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getRestToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([command, ...args]),
    signal: AbortSignal.timeout(COMMAND_TIMEOUT_MS)
  });

  if (!response.ok) {
    throw new Error(`Redis REST command failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function redisUrlCommand(command, ...args) {
  const client = await getRedisClient();

  try {
    return await client.sendCommand(
      [command, ...args.map(String)],
      { abortSignal: AbortSignal.timeout(COMMAND_TIMEOUT_MS) }
    );
  } catch (error) {
    resetRedisClient(client);
    throw error;
  }
}

async function getRedisClient() {
  if (!redisClientPromise) {
    const client = createClient({
      url: process.env.REDIS_URL,
      disableOfflineQueue: true,
      socket: {
        connectTimeout: COMMAND_TIMEOUT_MS,
        reconnectStrategy: false
      }
    });

    client.on('error', (error) => {
      console.error('Redis client error', safeError(error));
    });

    redisClientPromise = client.connect()
      .then(() => client)
      .catch((error) => {
        resetRedisClient(client);
        throw error;
      });
  }

  return redisClientPromise;
}

function resetRedisClient(client) {
  redisClientPromise = null;
  try {
    if (client?.isOpen) client.destroy();
  } catch {
    // The next invocation will create a fresh connection.
  }
}

function getRestUrl() {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
}

function getRestToken() {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
}

function safeError(error) {
  return {
    name: error?.name || 'Error',
    message: error?.message || String(error),
    mode: storageMode()
  };
}
