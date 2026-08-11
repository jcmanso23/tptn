import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();

test('la conversación libre usa Luna y conserva los turnos con sus roles', async () => {
  const source = await readFile(join(root, 'api/chat.js'), 'utf8');

  assert.match(source, /openai\/gpt-5\.6-luna/);
  assert.match(source, /messages: recentMessages/);
  assert.match(source, /role: message\.from === 'user' \? 'user' : 'assistant'/);
  assert.match(source, /String\(process\.env\.OPENAI_API_KEY \|\| ''\)\.trim\(\)/);
  assert.match(source, /provider = openAIKey \? 'openai-direct' : 'vercel-ai-gateway'/);
  assert.match(source, /reasoningEffort: 'none'/);
  assert.match(source, /maxOutputTokens: 480/);
  assert.match(source, /Escribe siempre en texto plano/);
  assert.match(source, /Cuaderno de la Memoria/);
  assert.match(source, /Hugo tiene seis años/);
  assert.match(source, /Recuerdas con normalidad todo lo sucedido desde que despertaste/);
  assert.match(source, /agradécelo de forma concreta/);
  assert.match(source, /interpreta a Topoloco como inteligente, huidizo/);
  assert.match(source, /Topotino no los recuerda ni los afirma/);
  assert.match(source, /Topoloco nunca es amigo, compañero ni aliado/);
  assert.match(source, /no rellena ese vacío con una relación inventada/);
  assert.match(source, /maxDuration: 30/);
  assert.doesNotMatch(source, /contextoNarrativo:|narrativeContext/);
});

test('las respuestas conversacionales no usan la espera larga de las misiones', async () => {
  const source = await readFile(join(root, 'app.js'), 'utf8');

  assert.match(source, /deliverTopotinoMessages\(responsePromise, \{ mode: 'conversation' \}\)/);
  assert.match(source, /if \(mode === 'conversation'\)/);
  assert.match(source, /activeEpisodes: \[activeEpisode\]\.map/);
});
