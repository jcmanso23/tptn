import assert from 'node:assert/strict';
import test from 'node:test';
import storyHandler from '../api/story.js';

const originalFetch = global.fetch;
const originalEnv = { ...process.env };

test.beforeEach(() => {
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  process.env.tptn_KV_REST_API_URL = 'https://redis.test';
  process.env.tptn_KV_REST_API_TOKEN = 'test-token';
  process.env.STORY_ADMIN_PASSWORD = 'travel-secret';
  process.env.STORY_ADMIN_SECRET = 'a-long-random-session-secret';
  delete process.env.REDIS_URL;

  const store = new Map();
  global.fetch = async (_url, options) => {
    const [command, ...args] = JSON.parse(options.body);
    let result = null;
    if (command === 'GET') result = store.get(args[0]) ?? null;
    if (command === 'SET') {
      store.set(args[0], args[1]);
      result = 'OK';
    }
    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };
});

test.afterEach(() => {
  global.fetch = originalFetch;
  process.env = { ...originalEnv };
});

test('authenticates, publishes an episode and sends a broadcast', async () => {
  const login = await call({
    method: 'POST',
    body: { action: 'login', password: 'travel-secret' }
  });
  assert.equal(login.statusCode, 200);
  const cookie = login.headers['Set-Cookie'].split(';')[0];

  const markdown = episodeMarkdown('005-cambio-de-ruta');
  const saved = await call({
    method: 'POST',
    headers: { cookie },
    body: { action: 'saveEpisode', episodeId: '005-cambio-de-ruta', markdown }
  });
  assert.equal(saved.statusCode, 200);
  assert.equal(saved.body.episodes[0].id, '005-cambio-de-ruta');

  const broadcast = await call({
    method: 'POST',
    headers: { cookie },
    body: { action: 'broadcast', text: 'Amigos, la señal ha cambiado de camino.' }
  });
  assert.equal(broadcast.statusCode, 200);
  assert.equal(broadcast.body.broadcasts.length, 1);

  const publicStory = await call({ method: 'GET' });
  assert.equal(publicStory.statusCode, 200);
  assert.equal(publicStory.body.episodes[0].markdown, markdown);
  assert.equal(publicStory.body.broadcasts[0].text, 'Amigos, la señal ha cambiado de camino.');
});

test('rejects unauthenticated writes and malformed chapters', async () => {
  const unauthorized = await call({
    method: 'POST',
    body: { action: 'broadcast', text: 'No debería publicarse.' }
  });
  assert.equal(unauthorized.statusCode, 401);

  const login = await call({
    method: 'POST',
    body: { action: 'login', password: 'travel-secret' }
  });
  const cookie = login.headers['Set-Cookie'].split(';')[0];
  const invalid = await call({
    method: 'POST',
    headers: { cookie },
    body: { action: 'saveEpisode', episodeId: '005-roto', markdown: 'sin frontmatter' }
  });
  assert.equal(invalid.statusCode, 400);
  assert.equal(invalid.body.error, 'INVALID_STORY');
});

async function call(overrides) {
  const req = {
    method: 'GET',
    body: {},
    query: {},
    headers: {},
    ...overrides
  };
  const response = createResponse();
  await storyHandler(req, response);
  return response;
}

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    }
  };
}

function episodeMarkdown(id) {
  return `---
{"id":"${id}","order":5,"title":"Cambio","activation":{"required":["ready"]},"ai":{"enabled":true}}
---

# Contexto narrativo
Un cambio de ruta.

## Mensajes iniciales
\`\`\`json
[]
\`\`\`

## Respuestas guiadas
\`\`\`json
[]
\`\`\`

## Respuestas suaves si fallan
\`\`\`json
[]
\`\`\`

## Contexto para IA
No revelar destinos futuros.
`;
}
