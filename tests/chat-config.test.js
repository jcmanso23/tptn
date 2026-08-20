import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();

test('la conversación libre usa Luna y conserva los turnos con sus roles', async () => {
  const source = await readFile(join(root, 'api/chat.js'), 'utf8');

  assert.match(source, /openai\/gpt-5\.6-luna/);
  assert.match(source, /messages: recentMessages/);
  assert.match(source, /Mensaje actual que debes responder ahora/);
  assert.match(source, /findLastIndex/);
  assert.match(source, /historyBeforeCurrent/);
  assert.match(source, /suppliedMessages\.slice\(0, currentMessageIndex\)/);
  assert.match(source, /role: message\.from === 'user' \? 'user' : 'assistant'/);
  assert.match(source, /String\(process\.env\.OPENAI_API_KEY \|\| ''\)\.trim\(\)/);
  assert.match(source, /provider = openAIKey \? 'openai-direct' : 'vercel-ai-gateway'/);
  assert.match(source, /reasoningEffort: 'none'/);
  assert.match(source, /output: Output\.object\(\{ schema: chatResponseSchema \}\)/);
  assert.match(source, /maxOutputTokens: 600/);
  assert.match(source, /CHARACTER_PERSONALITIES/);
  assert.match(source, /allowedSpeakers/);
  assert.match(source, /turnId/);
  assert.match(source, /Escribe siempre en texto plano/);
  assert.match(source, /Cuaderno de la Memoria/);
  assert.match(source, /No infantilizas a Paula y Hugo/);
  assert.match(source, /exigencia intelectual aproximada de diez años/);
  assert.match(source, /No pidas que enseñen, describan, fotografíen o transcriban sus páginas/);
  assert.match(source, /memoria de viaje persistente/);
  assert.match(source, /memoriaDeViaje:/);
  assert.match(source, /desafioActual:/);
  assert.match(source, /esperaDeLlegada:/);
  assert.match(source, /Nunca enumeres el plan del día ni varias paradas futuras/);
  assert.match(source, /Regla cerrada del día 15/);
  assert.match(source, /No nombres Fátima allí/);
  assert.match(source, /contradicción entre 1385 y la clave 3 · 13 · 1917/);
  assert.match(source, /Recuerdas con normalidad todo lo sucedido desde que despertaste/);
  assert.match(source, /agradécelo de forma concreta/);
  assert.match(source, /interpreta a Topoloco como inteligente, huidizo/);
  assert.match(source, /Topotino no los recuerda ni los afirma/);
  assert.match(source, /Topoloco nunca es amigo, compañero ni aliado/);
  assert.match(source, /no rellena ese vacío con una relación inventada/);
  assert.match(source, /maxDuration: 30/);
  assert.doesNotMatch(source, /contextoNarrativo:|narrativeContext/);
});

test('las respuestas conversacionales usan silencios naturales y pueden no contestar', async () => {
  const source = await readFile(join(root, 'app.js'), 'utf8');

  assert.match(source, /deliverTopotinoMessages\(responsePromise, \{ mode: 'conversation' \}\)/);
  assert.match(source, /if \(mode === 'conversation'\)/);
  assert.match(source, /shouldTopotinoStaySilent\(text\)/);
  assert.match(source, /LONG_REPLY_CHANCE/);
  assert.match(source, /LONG_REPLY_MIN_MS = 60000/);
  assert.match(source, /nextTypingMin: 2500/);
  assert.match(source, /activeEpisodes: \[activeEpisode\]\.map/);
  assert.match(source, /storyMemory: state\.storyMemory\.slice\(-36\)/);
  assert.match(source, /currentChallenge: summarizeChallengeForAi/);
  assert.match(source, /pendingArrival: summarizeArrivalForAi/);
  assert.match(source, /function recordStoryMemory/);
  assert.match(source, /function eligibleMessages/);
  assert.match(source, /toTopotinoMessages\(pack\.openingMessages\)/);
  assert.match(source, /const episode = getActiveEpisode\(\)/);
  assert.match(source, /isEpisodeCompleted\(episode\)/);
  assert.match(source, /recentMessagesForEpisode\(activeEpisode\.meta\.id\)/);
  assert.match(source, /data\.turnId !== turnId/);
  assert.match(source, /data\.episodeId !== requestedEpisodeId/);
  assert.match(source, /isExplicitHintRequest\(text\) \? nextProgressiveHint/);
  assert.doesNotMatch(source, /const soft = activeEpisode/);
  assert.match(source, /if \(!activeEpisode \|\| isEpisodeCompleted\(activeEpisode\)\) return null/);
  assert.doesNotMatch(source, /const available = getUnlockedEpisodes\(\)\.slice\(\)\.reverse\(\)/);
  assert.match(source, /storyMemory: normalizeStoryMemory\(saved\.storyMemory\)/);
  assert.match(source, /await refreshLocationForPendingActivations\(\)/);
  assert.match(source, /LOCATION_REFRESH_COOLDOWN_MS/);
  assert.match(source, /window\.addEventListener\('focus'/);
  assert.match(source, /accuracyMargin/);
});

test('Luna valida respuestas escritas con un veredicto estructurado sin controlar el progreso', async () => {
  const api = await readFile(join(root, 'api/chat.js'), 'utf8');
  const app = await readFile(join(root, 'app.js'), 'utf8');

  assert.match(api, /Output\.object\(\{ schema: challengeVerdictSchema \}\)/);
  assert.match(api, /validate-challenge/);
  assert.match(api, /\['correct', 'partial', 'incorrect', 'clarify'\]/);
  assert.match(api, /La aplicación, no tú, decide el avance/);
  assert.match(app, /function completeChallenge/);
  assert.match(app, /result\.verdict \|\| \{\}/);
  assert.match(app, /No cuenta como error/);
});
