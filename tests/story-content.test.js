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
        response.match || response.containsAny || response.containsAll || response.openAnswer,
        `${relativeFile}: ${response.id} no tiene criterio de respuesta`
      );
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
test('los días 13 y 14 conservan su cadena narrativa y sus salidas seguras', async () => {
  const amarante = await readFile(join(root, 'content/episodes/005-amarante-puente.md'), 'utf8');
  const dayTwo = await readFile(join(root, 'content/episodes/006-magikland-curia.md'), 'utf8');

  assert.match(amarante, /"date": \{ "on": "2026-08-13" \}/);
  assert.match(amarante, /"water": "Agua del Puente"/);
  assert.match(amarante, /"formulaWord": "COMIENZO"/);
  assert.match(amarante, /Nunca agua del río/);

  assert.match(dayTwo, /"date": \{ "on": "2026-08-14" \}/);
  assert.match(dayTwo, /"water": "Agua de la Risa"/);
  assert.match(dayTwo, /"formulaWord": "RIO"/);
  assert.match(dayTwo, /escribid DESCANSO/);
  assert.match(dayTwo, /No toquéis ni recojáis agua del lago o de la piscina/);
});
