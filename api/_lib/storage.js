import { createClient } from 'redis';

const COMMAND_TIMEOUT_MS = 5000;

let redisClientPromise = null;

export function hasRedisStorage() {
  const rest = getRestCredentials();
  return Boolean(
    (rest.url && rest.token) ||
    process.env.REDIS_URL
  );
}

export function storageMode() {
  const rest = getRestCredentials();
  if (rest.url && rest.token) return 'rest';
  if (process.env.REDIS_URL) return 'url';
  return 'none';
}

export async function redisCommand(command, ...args) {
  const rest = getRestCredentials();
  if (rest.url && rest.token) {
    return redisRestCommand(rest, command, ...args);
  }

  if (process.env.REDIS_URL) {
    return redisUrlCommand(command, ...args);
  }

  throw new Error('STATE_STORAGE_NOT_CONFIGURED');
}

async function redisRestCommand(rest, command, ...args) {
  const response = await fetch(rest.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${rest.token}`,
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

function getRestCredentials() {
  const knownPairs = [
    ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
    ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']
  ];

  for (const [urlKey, tokenKey] of knownPairs) {
    if (process.env[urlKey] && process.env[tokenKey]) {
      return { url: process.env[urlKey], token: process.env[tokenKey] };
    }
  }

  for (const key of Object.keys(process.env)) {
    if (!key.endsWith('_KV_REST_API_URL')) continue;
    const prefix = key.slice(0, -'_KV_REST_API_URL'.length);
    const token = process.env[`${prefix}_KV_REST_API_TOKEN`];
    if (process.env[key] && token) return { url: process.env[key], token };
  }

  return { url: '', token: '' };
}

function safeError(error) {
  return {
    name: error?.name || 'Error',
    message: error?.message || String(error),
    mode: storageMode()
  };
}
