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

  assert.match(eclipse, /"dateTime": \{ "from": "2026-08-12T20:31:00\+02:00" \}/);
  assert.match(eclipse, /Cuaderno de la Memoria/);
  assert.match(eclipse, /exigencia aproximada de diez años/);
  assert.match(eclipse, /no os pediré que me enseñéis, describáis, fotografiéis ni copiéis sus páginas/);
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
  assert.match(dayTwo, /Hotel do Parque/);
  assert.match(dayTwo, /abrió en 1922/);
  assert.match(dayTwo, /jardín cuidado/);
  assert.match(dayTwo, /bañador, toalla, protector solar/);
  assert.ok(
    dayTwoEpisode.sections['Respuestas guiadas']
      .some((response) => response.id === 'magikland-solucion-ayudada' && response.setFlags?.includes('magikland_identificado'))
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

test('la edición T-12A8 usa caché nueva, mensajes breves y rescates de destino', async () => {
  const files = ['index.html', 'app.js', 'admin.js', 'content/episodes/001-reconexion.md'];
  const combined = (await Promise.all(files.map((file) => readFile(join(root, file), 'utf8')))).join('\n');
  const app = await readFile(join(root, 'app.js'), 'utf8');
  const serviceWorker = await readFile(join(root, 'service-worker.js'), 'utf8');
  const ai = await readFile(join(root, 'api/chat.js'), 'utf8');
  const reconnection = parseEpisode(
    await readFile(join(root, 'content/episodes/001-reconexion.md'), 'utf8'),
    'content/episodes/001-reconexion.md'
  );

  assert.match(combined, /T-12A8/);
  assert.doesNotMatch(combined, /T-12A7/);
  assert.match(app, /splitTopotinoMessages/);
  assert.match(app, /els\.channelCode\.textContent = APP_VERSION_CODE/);
  assert.match(serviceWorker, /topotino-offline-v10/);
  assert.match(serviceWorker, /chat-format\.js\?v=memory-v24/);
  assert.match(ai, /Escribe como en WhatsApp/);
  assert.ok(
    reconnection.sections['Respuestas guiadas']
      .some((response) => response.id === 'luanco-solucion-ayudada' && response.setFlags?.includes('luanco_identificado'))
  );
});

test('el viaje completo del 15 al 27 está publicado, enlazado y termina de noche en la Alhambra', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'content/episodes.json'), 'utf8'));
  const expected = [
    ['007-bucaco-batalha-fatima', '2026-08-15'], ['008-huellas-mira-obidos', '2026-08-16'],
    ['009-dinoparque-lisboa', '2026-08-17'], ['010-lisboa-ciencia-oceanario', '2026-08-18'],
    ['011-lisboa-historia-belem', '2026-08-19'], ['012-badoca-lagos', '2026-08-20'],
    ['013-delfines-benagil-sagres', '2026-08-21'], ['014-piedade-algar-jaima', '2026-08-22'],
    ['015-zoomarine', '2026-08-23'], ['016-tavira-sevilla', '2026-08-24'],
    ['017-isla-magica', '2026-08-25'], ['018-sevilla-alhambra-noche', '2026-08-26'],
    ['019-epilogo-generalife', '2026-08-27']
  ];
  const allChildText = [];

  for (const [id, date] of expected) {
    const item = manifest.find((entry) => entry.id === id);
    assert.ok(item, `falta ${id} en el manifiesto`);
    const source = item.file.replace(/\?.*$/, '');
    const markdown = await readFile(join(root, source), 'utf8');
    const episode = parseEpisode(markdown, source);
    assert.equal(episode.meta.activation.date.on, date, `${id}: fecha incorrecta`);
    assert.ok(episode.sections['Respuestas guiadas'].length >= 2, `${id}: aventura demasiado vacía`);
    allChildText.push(...episode.sections['Mensajes iniciales'].map((message) => message.text));
    allChildText.push(...episode.sections['Respuestas guiadas']
      .flatMap((response) => (response.messages || []).map((message) => message.text)));
  }

  const finalEpisode = await readFile(join(root, 'content/episodes/018-sevilla-alhambra-noche.md'), 'utf8');
  assert.match(finalEpisode, /A las 22:00/);
  assert.match(finalEpisode, /Patio de los Leones/);
  assert.match(finalEpisode, /doce_aguas_reunidas/);
  assert.match(finalEpisode, /Topoloco provocó el eclipse de mi memoria/);
  assert.match(finalEpisode, /La aventura principal termina aquí, en la Alhambra de noche/);

  const text = allChildText.join(' ');
  assert.match(text, /jamás os pediría la marca, una foto ni el contenido del cuaderno/i);
  assert.match(text, /Enviad únicamente la conclusión y una razón; ninguna página/i);
  assert.match(text, /descansad/i);
});

test('las pruebas nuevas exigen evidencia física, variedad y personajes reales sin regalar alternativas', async () => {
  const sources = [
    '007-bucaco-batalha-fatima.md', '008-huellas-mira-obidos.md', '009-dinoparque-lisboa.md',
    '010-lisboa-ciencia-oceanario.md', '011-lisboa-historia-belem.md', '012-badoca-lagos.md',
    '013-delfines-benagil-sagres.md', '014-piedade-algar-jaima.md', '015-zoomarine.md',
    '016-tavira-sevilla.md', '017-isla-magica.md', '018-sevilla-alhambra-noche.md'
  ];
  const combined = [];

  for (const file of sources) {
    const source = `content/episodes/${file}`;
    const markdown = await readFile(join(root, source), 'utf8');
    const episode = parseEpisode(markdown, source);
    const initial = episode.sections['Mensajes iniciales'].map((message) => message.text).join(' ');
    assert.doesNotMatch(initial, /si no podéis|si está cerrado|alternativa/i, `${file}: adelanta alternativa`);
    combined.push(markdown);
  }

  const text = combined.join('\n');
  for (const concept of ['predicción', 'hipótesis', 'comparad', 'evidencia', 'interpretación', 'Vasco', 'Gotas', 'Corvinho', 'Capitán Pico', 'América']) {
    assert.match(text, new RegExp(concept, 'i'), `falta variedad o personaje: ${concept}`);
  }
  assert.match(text, /No uséis|No toquéis|no lo alimentéis|no se garantiza/i);
});

test('la secuencia principal puede recorrerse y reúne exactamente las doce aguas', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'content/episodes.json'), 'utf8'));
  const waters = new Set();
  const completionFlags = new Set();

  for (const item of manifest) {
    const source = item.file.replace(/\?.*$/, '');
    const episode = parseEpisode(await readFile(join(root, source), 'utf8'), source);
    if (episode.meta.water) waters.add(episode.meta.water);
    for (const response of episode.sections['Respuestas guiadas']) {
      if (response.water) waters.add(response.water);
      for (const flag of response.setFlags || []) {
        if (flag.startsWith('completado_')) completionFlags.add(flag);
      }
    }
  }

  assert.deepEqual([...waters], [
    'Agua del Norte',
    'Agua del Puente',
    'Agua de la Risa',
    'Agua de la Promesa',
    'Agua del Tiempo Profundo',
    'Agua del Océano Único',
    'Agua de la Ciudad que Regresa',
    'Agua del Horizonte',
    'Agua de la Piedra',
    'Agua del Cuidado',
    'Agua de las Dos Orillas',
    'Agua Clara de la Noche'
  ]);
  for (const flag of [
    'completado_bucaco_batalha_fatima', 'completado_huellas_mira_obidos',
    'completado_dinoparque_lisboa', 'completado_lisboa_ciencia_oceanario',
    'completado_lisboa_historia_belem', 'completado_badoca_lagos',
    'completado_delfines_benagil_sagres', 'completado_piedade_algar_jaima',
    'completado_zoomarine', 'completado_tavira_sevilla', 'completado_isla_magica',
    'completado_sevilla_alhambra_noche'
  ]) {
    assert.ok(completionFlags.has(flag), `falta la salida principal ${flag}`);
  }
});
