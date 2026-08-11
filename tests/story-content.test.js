import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseEpisode(markdown, source) {
  const frontmatter = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  assert.ok(frontmatter, `${source}: falta el frontmatter`);
  const meta = JSON.parse(frontmatter[1]);
  const sections = {};

  for (const heading of [
    'Mensajes iniciales',
    'Respuestas guiadas',
    'Respuestas suaves si fallan',
    'Pistas progresivas'
  ]) {
    const start = markdown.indexOf(`## ${heading}`);
    if (start === -1) {
      sections[heading] = [];
      continue;
    }
    const block = markdown.slice(start).match(/```json\s*([\s\S]*?)\s*```/);
    assert.ok(block, `${source}: ${heading} no contiene JSON`);
    sections[heading] = JSON.parse(block[1]);
  }

  return { meta, sections };
}

test('todos los capítulos publicados tienen estructura y referencias válidas', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'content/episodes.json'), 'utf8'));
  const ids = new Set();
  const responseIds = new Set();
  const parsed = [];

  for (const item of manifest) {
    assert.ok(!ids.has(item.id), `id de capítulo duplicado: ${item.id}`);
    ids.add(item.id);
    const relativeFile = item.file.replace(/\?.*$/, '');
    const markdown = await readFile(join(root, relativeFile), 'utf8');
    const episode = parseEpisode(markdown, relativeFile);
    assert.equal(episode.meta.id, item.id, `${relativeFile}: id distinto al manifiesto`);
    parsed.push(episode);

    for (const response of episode.sections['Respuestas guiadas']) {
      assert.ok(response.id, `${relativeFile}: respuesta sin id`);
      assert.ok(!responseIds.has(response.id), `id de respuesta duplicado: ${response.id}`);
      responseIds.add(response.id);
      assert.ok(
        response.match || response.containsAny || response.containsAll || response.containsAnyGroups || response.openAnswer,
        `${relativeFile}: ${response.id} no tiene criterio de respuesta`
      );
      if (response.containsAnyGroups) {
        assert.ok(
          response.containsAnyGroups.every((group) => Array.isArray(group) && group.length),
          `${relativeFile}: ${response.id} contiene un grupo de evidencias vacío`
        );
      }
    }
  }

  for (const episode of parsed) {
    for (const response of episode.sections['Respuestas guiadas']) {
      if (response.nextEpisode) {
        assert.ok(ids.has(response.nextEpisode), `nextEpisode inexistente: ${response.nextEpisode}`);
      }
    }
  }
});

test('Amarante se descubre antes de revelar la fecha', async () => {
  const source = 'content/episodes/004b-rumbo-amarante.md';
  const markdown = await readFile(join(root, source), 'utf8');
  const episode = parseEpisode(markdown, source);
  const initialText = episode.sections['Mensajes iniciales'].map((message) => message.text).join(' ');
  const correct = episode.sections['Respuestas guiadas']
    .find((response) => response.id === 'amarante-descubierto-antes-del-viaje');

  assert.doesNotMatch(initialText, /13 de agosto|por la tarde/i);
  assert.ok(correct, 'falta la respuesta correcta de Amarante');
  assert.match(correct.messages.map((message) => message.text).join(' '), /13 de agosto · por la tarde/);
});

test('el eclipse activa la amnesia, el cuaderno y una memoria nueva estable', async () => {
  const eclipse = await readFile(join(root, 'content/episodes/003-eclipse-amnesia.md'), 'utf8');
  const episode = parseEpisode(eclipse, 'content/episodes/003-eclipse-amnesia.md');

  assert.match(eclipse, /"dateTime": \{ "from": "2026-08-12T20:35:00\+02:00" \}/);
  assert.match(eclipse, /Cuaderno de la Memoria/);
  assert.match(eclipse, /exigencia aproximada de diez años/);
  assert.match(eclipse, /no os pediré que me enseñéis, describáis ni copiéis sus páginas/);
  assert.match(eclipse, /Desde ahora recuerda con normalidad todo lo nuevo/);
  assert.ok(
    episode.sections['Respuestas guiadas']
      .some((response) => response.id === 'diario-dos-memorias-preparado')
  );
});

test('los días 13 y 14 conservan su cadena narrativa y adaptan solo tras un impedimento', async () => {
  const amarante = await readFile(join(root, 'content/episodes/005-amarante-puente.md'), 'utf8');
  const dayTwo = await readFile(join(root, 'content/episodes/006-magikland-curia.md'), 'utf8');
  const amaranteEpisode = parseEpisode(amarante, 'content/episodes/005-amarante-puente.md');
  const dayTwoEpisode = parseEpisode(dayTwo, 'content/episodes/006-magikland-curia.md');

  assert.match(amarante, /"from": "2026-08-13T17:00:00\+02:00"/);
  assert.match(amarante, /"to": "2026-08-13T23:59:59\+02:00"/);
  assert.match(amarante, /"water": "Agua del Puente"/);
  assert.match(amarante, /"formulaWord": "COMIENZO"/);
  assert.match(amarante, /No recojáis agua del Tâmega/);
  assert.match(amarante, /tradición/);
  assert.match(amarante, /diario_amarante/);
  assert.match(amarante, /amarante_posicion_razonada/);
  assert.match(amarante, /cuatro balcones semicirculares/i);
  assert.match(amarante, /"remember":/);
  assert.doesNotMatch(
    amaranteEpisode.sections['Mensajes iniciales'].map((message) => message.text).join(' '),
    /llueve|cerrado|cansad|si no podéis/i
  );
  assert.ok(
    amaranteEpisode.sections['Respuestas guiadas']
      .some((response) => response.id === 'amarante-alternativa-lluvia')
  );

  assert.match(dayTwo, /"date": \{ "on": "2026-08-14" \}/);
  assert.match(dayTwo, /"water": "Agua de la Risa"/);
  assert.match(dayTwo, /"formulaWord": "RIO"/);
  assert.match(dayTwo, /diario_magikland_curia/);
  assert.match(dayTwo, /magikland_prediccion_movimiento/);
  assert.match(dayTwo, /curia_paisaje_razonado/);
  assert.match(dayTwo, /rotación alrededor de un eje/i);
  assert.match(dayTwo, /No uséis agua del parque, del lago ni de la piscina/);
  assert.doesNotMatch(
    dayTwoEpisode.sections['Mensajes iniciales'].map((message) => message.text).join(' '),
    /cerrado|miedo|cansad|cambio de plan/i
  );
  assert.ok(
    dayTwoEpisode.sections['Respuestas guiadas']
      .some((response) => response.id === 'curia-alternativa-cambio-plan')
  );

  const dayTwoInitial = dayTwoEpisode.sections['Mensajes iniciales'];
  assert.ok(dayTwoInitial.some((message) => message.requiredFlags?.includes('completado_amarante')));
  assert.ok(dayTwoInitial.some((message) => message.blockedFlags?.includes('completado_amarante')));

  const childFacingText = [amaranteEpisode, dayTwoEpisode].flatMap((episode) => [
    ...episode.sections['Mensajes iniciales'].map((message) => message.text),
    ...episode.sections['Respuestas guiadas']
      .flatMap((response) => (response.messages || []).map((message) => message.text))
  ]).join(' ');
  assert.doesNotMatch(childFacingText, /Museo Topoloco de Recuerdos Exclusivos/i);
  assert.doesNotMatch(childFacingText, /Su palabra es (COMIENZO|RÍO)/i);
  assert.doesNotMatch(childFacingText, /contadme.{0,80}(qué|que).{0,40}(cuaderno|diario)/i);
  assert.doesNotMatch(childFacingText, /(foto|fotografía).{0,30}(cuaderno|diario)/i);
});
