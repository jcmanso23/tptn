import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CHALLENGE_PACKS } from '../content/challenges.js';

const root = process.cwd();
const futureEpisodeIds = [
  '005-amarante-puente',
  '006-magikland-curia',
  '007-bucaco-batalha-fatima',
  '008-huellas-mira-obidos',
  '009-dinoparque-lisboa',
  '010-lisboa-ciencia-oceanario',
  '011-lisboa-historia-belem',
  '012-badoca-lagos',
  '013-delfines-benagil-sagres',
  '014-piedade-algar-jaima',
  '015-zoomarine',
  '016-tavira-sevilla',
  '017-isla-magica',
  '018-sevilla-alhambra-noche',
  '019-epilogo-generalife'
];

test('todo el viaje futuro tiene un paquete de retos completo y sin ids duplicados', () => {
  assert.deepEqual(Object.keys(CHALLENGE_PACKS), futureEpisodeIds);
  const ids = new Set();

  for (const [episodeId, pack] of Object.entries(CHALLENGE_PACKS)) {
    assert.ok(Array.isArray(pack.openingMessages), `${episodeId}: faltan mensajes de mañana`);
    assert.ok(Array.isArray(pack.steps) && pack.steps.length, `${episodeId}: no tiene retos`);

    for (const step of pack.steps) {
      assert.ok(step.id, `${episodeId}: reto sin id`);
      assert.equal(ids.has(step.id), false, `id de reto duplicado: ${step.id}`);
      ids.add(step.id);

      if (step.kind === 'expedition' || step.kind === 'ending') {
        assert.ok(step.actions.length >= 2 && step.actions.length <= 4, `${step.id}: la expedición debe tener de 2 a 4 acciones`);
      } else {
        assert.ok(['choice', 'destination', 'daily-recovery'].includes(step.kind), `${step.id}: tipo desconocido`);
        assert.ok(step.options.length >= 3 && step.options.length <= 4, `${step.id}: opciones fuera de rango`);
        assert.ok(step.options.some((option) => option.id === step.correctOptionId), `${step.id}: respuesta correcta inexistente`);
      }
    }
  }
});

test('cada jornada recuerda la ruta, permite recuperar Sombra y prepara el día siguiente', () => {
  for (const episodeId of futureEpisodeIds.slice(1, -2)) {
    const pack = CHALLENGE_PACKS[episodeId];
    assert.match(pack.openingMessages.join(' '), /Buenos días/i, `${episodeId}: falta recordatorio de mañana`);
    assert.ok(pack.steps.some((step) => step.kind === 'daily-recovery'), `${episodeId}: falta recuperación diaria`);
    const route = pack.steps.find((step) => step.kind === 'destination');
    assert.ok(route, `${episodeId}: falta ruta del día siguiente`);
    assert.match(route.successMessages.join(' '), /preparad|tened|llevad/i, `${episodeId}: falta preparación`);
    assert.match(route.successMessages.join(' '), /descansad|guardad energía/i, `${episodeId}: falta cierre del día`);
  }
});

test('las pruebas son breves, físicas y enseñan después de elegir', () => {
  for (const pack of Object.values(CHALLENGE_PACKS)) {
    for (const step of pack.steps) {
      const childTexts = [
        step.prompt,
        step.title,
        step.intro,
        ...(step.actions || []),
        ...(step.successMessages || []),
        ...(step.doneMessages || []),
        ...(step.options || []).map((option) => option.text)
      ].filter(Boolean);
      assert.ok(childTexts.every((text) => text.length <= 220), `${step.id}: mensaje demasiado largo`);

      if (step.kind === 'choice') {
        assert.ok(step.successMessages.length >= 2, `${step.id}: falta ampliación educativa`);
        assert.ok(step.recovery?.actions?.length >= 2, `${step.id}: falta comprobación física tras dos intentos`);
      }
    }
  }
});

test('la app conserva Memoria, Sombra y tres variantes de victoria', async () => {
  const app = await readFile(join(root, 'app.js'), 'utf8');
  const index = await readFile(join(root, 'index.html'), 'utf8');

  assert.match(index, /id="memory-score"/);
  assert.match(index, /id="shadow-score"/);
  assert.match(index, /id="challenge-panel"/);
  assert.match(app, /state\.shadowScore \+= 1/);
  assert.match(app, /state\.recoveredShadow \+= 1/);
  assert.match(app, /normalizeText\(option\.text\) === normalizeText\(text\)/);
  assert.match(app, /no lo hemos hecho/);
  assert.match(app, /return 'clean'/);
  assert.match(app, /return 'close'/);
  assert.match(app, /return 'incomplete'/);
  assert.match(app, /Victoria limpia/);
  assert.match(app, /Victoria ajustada/);
  assert.match(app, /Victoria incompleta/);
});
