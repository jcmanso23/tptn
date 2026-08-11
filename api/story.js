import crypto from 'node:crypto';
import { hasRedisStorage, redisCommand, storageMode } from './_lib/storage.js';

const STORY_KEY = 'topotino:story:live:v1';
const SESSION_COOKIE = 'topotino_story_admin';
const SESSION_SECONDS = 14 * 24 * 60 * 60;
const MAX_EPISODE_CHARS = 80000;
const MAX_BROADCAST_CHARS = 600;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const action = String(req.body?.action || '');

  if (req.method === 'POST' && action === 'login') {
    return login(req, res);
  }

  if (req.method === 'POST' && action === 'logout') {
    clearSessionCookie(req, res);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    const wantsAdmin = String(req.query?.admin || '') === '1';
    if (wantsAdmin && !hasValidSession(req)) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    try {
      const story = await loadStory();
      return res.status(200).json({
        ...story,
        authenticated: wantsAdmin ? true : undefined
      });
    } catch (error) {
      return storageFailure(res, error);
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!hasValidSession(req)) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  try {
    if (action === 'saveEpisode') return await saveEpisode(req.body, res);
    if (action === 'removeEpisode') return await removeEpisode(req.body, res);
    if (action === 'broadcast') return await createBroadcast(req.body, res);

    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    if (error?.code === 'INVALID_STORY') {
      return res.status(400).json({ error: 'INVALID_STORY', message: error.message });
    }
    return storageFailure(res, error);
  }
}

function login(req, res) {
  if (!process.env.STORY_ADMIN_PASSWORD || !process.env.STORY_ADMIN_SECRET) {
    return res.status(503).json({ error: 'ADMIN_NOT_CONFIGURED' });
  }

  const password = String(req.body?.password || '');
  if (!safeEqual(password, process.env.STORY_ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'INVALID_PASSWORD' });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const value = `${expiresAt}.${sign(String(expiresAt))}`;
  const secure = process.env.VERCEL || req.headers['x-forwarded-proto'] === 'https';
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    'Path=/',
    `Max-Age=${SESSION_SECONDS}`,
    'HttpOnly',
    'SameSite=Strict'
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
  return res.status(200).json({ ok: true });
}

function clearSessionCookie(req, res) {
  const secure = process.env.VERCEL || req.headers['x-forwarded-proto'] === 'https';
  const parts = [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Strict'
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function hasValidSession(req) {
  if (!process.env.STORY_ADMIN_SECRET) return false;
  const value = readCookie(req, SESSION_COOKIE);
  const [expiresRaw, signature] = String(value || '').split('.');
  const expiresAt = Number(expiresRaw);
  if (!expiresAt || expiresAt <= Math.floor(Date.now() / 1000) || !signature) return false;
  return safeEqual(signature, sign(expiresRaw));
}

async function saveEpisode(body, res) {
  const episodeId = normalizeEpisodeId(body?.episodeId);
  const markdown = String(body?.markdown || '');
  validateEpisodeMarkdown(episodeId, markdown);

  const story = await loadStory();
  const nextEpisode = {
    id: episodeId,
    markdown,
    updatedAt: new Date().toISOString()
  };
  story.episodes = story.episodes.filter((episode) => episode.id !== episodeId);
  story.episodes.push(nextEpisode);
  touchStory(story);
  await saveStory(story);
  return res.status(200).json(story);
}

async function removeEpisode(body, res) {
  const episodeId = normalizeEpisodeId(body?.episodeId);
  const story = await loadStory();
  story.episodes = story.episodes.filter((episode) => episode.id !== episodeId);
  touchStory(story);
  await saveStory(story);
  return res.status(200).json(story);
}

async function createBroadcast(body, res) {
  const text = String(body?.text || '').trim();
  if (!text || text.length > MAX_BROADCAST_CHARS) {
    throw invalidStory(`El mensaje debe tener entre 1 y ${MAX_BROADCAST_CHARS} caracteres.`);
  }

  const story = await loadStory();
  story.broadcasts.push({
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString()
  });
  story.broadcasts = story.broadcasts.slice(-20);
  touchStory(story);
  await saveStory(story);
  return res.status(200).json(story);
}

async function loadStory() {
  if (!hasRedisStorage()) throw new Error('STORY_STORAGE_NOT_CONFIGURED');
  const raw = await redisCommand('GET', STORY_KEY);
  if (!raw) return emptyStory();

  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return {
    version: Number(parsed.version) || 0,
    updatedAt: parsed.updatedAt || null,
    episodes: Array.isArray(parsed.episodes) ? parsed.episodes : [],
    broadcasts: Array.isArray(parsed.broadcasts) ? parsed.broadcasts : []
  };
}

async function saveStory(story) {
  await redisCommand('SET', STORY_KEY, JSON.stringify(story));
}

function emptyStory() {
  return { version: 0, updatedAt: null, episodes: [], broadcasts: [] };
}

function touchStory(story) {
  story.version = Number(story.version || 0) + 1;
  story.updatedAt = new Date().toISOString();
}

function validateEpisodeMarkdown(episodeId, markdown) {
  if (!markdown || markdown.length > MAX_EPISODE_CHARS) {
    throw invalidStory(`El capítulo está vacío o supera ${MAX_EPISODE_CHARS} caracteres.`);
  }

  const frontmatter = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (!frontmatter) throw invalidStory('Falta el bloque JSON inicial entre --- y ---.');

  let meta;
  try {
    meta = JSON.parse(frontmatter[1]);
  } catch (error) {
    throw invalidStory(`El JSON inicial no es válido: ${error.message}`);
  }

  if (meta.id !== episodeId) {
    throw invalidStory(`El id del capítulo debe ser “${episodeId}”.`);
  }

  const requiredHeadings = [
    '# Contexto narrativo',
    '## Mensajes iniciales',
    '## Respuestas guiadas',
    '## Respuestas suaves si fallan',
    '## Contexto para IA'
  ];
  const missing = requiredHeadings.filter((heading) => !markdown.includes(heading));
  if (missing.length) throw invalidStory(`Faltan secciones: ${missing.join(', ')}.`);

  for (const match of markdown.matchAll(/```json\s*([\s\S]*?)\s*```/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      throw invalidStory(`Hay un bloque JSON inválido: ${error.message}`);
    }
  }
}

function normalizeEpisodeId(value) {
  const id = String(value || '').trim();
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(id)) {
    throw invalidStory('El identificador solo puede contener minúsculas, números y guiones.');
  }
  return id;
}

function invalidStory(message) {
  const error = new Error(message);
  error.code = 'INVALID_STORY';
  return error;
}

function readCookie(req, name) {
  const cookies = String(req.headers.cookie || '').split(';');
  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split('=');
    if (key === name) return value.join('=');
  }
  return '';
}

function sign(value) {
  return crypto
    .createHmac('sha256', process.env.STORY_ADMIN_SECRET || '')
    .update(String(value))
    .digest('hex');
}

function safeEqual(left, right) {
  const leftHash = crypto.createHash('sha256').update(String(left)).digest();
  const rightHash = crypto.createHash('sha256').update(String(right)).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function storageFailure(res, error) {
  console.error('Story storage failed', {
    storageMode: storageMode(),
    name: error?.name,
    message: error?.message
  });
  return res.status(503).json({ error: 'STORY_STORAGE_UNAVAILABLE' });
}
