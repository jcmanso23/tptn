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

test('el asalto del día 20 aísla personajes y Louri solo usa transmisiones escritas por la aplicación', async () => {
  const api = await readFile(join(root, 'api/chat.js'), 'utf8');
  const app = await readFile(join(root, 'app.js'), 'utf8');

  assert.match(api, /'louri', 'topoloco'/);
  assert.match(api, /speakerMode === 'exact'/);
  assert.match(api, /estadoNarrativoEspecial/);
  assert.match(api, /tres transmisiones excepcionales ya escritas/i);
  assert.match(api, /una última pista verificada del 24/i);
  for (const dialogueId of [
    'dialogo-sevilla-arranque', 'dialogo-sevilla-setas', 'dialogo-sevilla-centro',
    'dialogo-capitan-pico-sevilla', 'dialogo-sevilla-triunfo',
    'dialogo-sevilla-santa-cruz', 'dialogo-sevilla-fabrica', 'dialogo-sevilla-cierre',
    'dialogo-isla-cartuja-pista', 'dialogo-final-isla', 'dialogo-corral-rey'
  ]) {
    assert.match(api, new RegExp(dialogueId));
  }
  assert.match(app, /TOPOLOCO_SCENE_ID/);
  assert.match(app, /function initializeTopolocoScene/);
  assert.match(app, /function runNarrativeScene/);
  assert.match(app, /function askNarrativeSceneAi/);
  assert.match(app, /allowedSpeakers: \['topoloco'\]/);
  assert.match(app, /state\.narrativeScene\.stage = 'takeover'/);
  assert.match(app, /Canal de emergencia cerrado definitivamente/);
  assert.match(app, /finalRouteLocked/);
  assert.match(app, /DEFAULT_FINAL_ROUTE = 'sevilla-night'/);
  assert.match(app, /DAY22_FINALE_MIGRATION_FLAG/);
});

test('Doctora Tecla entra por la tarde, conversa varios turnos y se marcha sin adelantar la ruta', async () => {
  const api = await readFile(join(root, 'api/chat.js'), 'utf8');
  const app = await readFile(join(root, 'app.js'), 'utf8');
  const styles = await readFile(join(root, 'styles.css'), 'utf8');
  const episode = await readFile(join(root, 'content/episodes/012-badoca-lagos.md'), 'utf8');

  assert.match(api, /'doctora_tecla'/);
  assert.match(api, /Doctora Tecla: mujer de Topoloco y hacker excepcional/);
  assert.match(app, /const TECLA_SCENE_HOUR = 16/);
  assert.match(app, /const TECLA_SCENE_TURNS = 3/);
  assert.match(app, /function startDoctoraTeclaScene/);
  assert.match(app, /function finishDoctoraTeclaScene/);
  assert.match(app, /allowedSpeakers: \['topoloco', 'doctora_tecla'\]/);
  assert.match(app, /teclaInteractionCount/);
  assert.match(app, /Diecisiete mensajes y tres audios diciendo «porfi»/);
  assert.match(app, /Doctora Tecla ha abandonado el canal y ha revocado su acceso/);
  assert.match(styles, /\.sender-doctora_tecla/);
  assert.match(episode, /no revela futuras paradas/i);
});

test('el día 21 Topotina recupera el canal con la última discusión de Tecla', async () => {
  const app = await readFile(join(root, 'app.js'), 'utf8');

  assert.match(app, /TOPOLOCO_RECOVERY_TECLA_FLAG/);
  assert.match(app, /stage: 'recovery-tecla'/);
  assert.match(app, /¿Quién está desmontando mi código\?/);
  assert.match(app, /Calibrador Marino/);
  assert.match(app, /Doctora Tecla ha abandonado el canal definitivamente/);
  assert.match(app, /Doctor Topoloco ha sido expulsado del canal/);
  assert.match(app, /En el mar no tendréis cobertura/);
  assert.match(app, /runActivationCheck\('canal-recuperado-dia21'\)/);
});
