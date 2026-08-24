import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CHALLENGE_PACKS, displayChallengeOptions } from '../content/challenges.js';

const root = process.cwd();
const messageText = (message) => typeof message === 'string' ? message : message?.text || '';
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
  '017-isla-magica'
];

test('todo el viaje futuro tiene un paquete de retos completo y sin ids duplicados', () => {
  const ids = new Set();

  for (const episodeId of futureEpisodeIds) {
    const pack = CHALLENGE_PACKS[episodeId];
    assert.ok(Array.isArray(pack.openingMessages), `${episodeId}: faltan mensajes de mañana`);
    assert.ok(Array.isArray(pack.steps) && pack.steps.length, `${episodeId}: no tiene retos`);

    for (const step of pack.steps) {
      assert.ok(step.id, `${episodeId}: reto sin id`);
      assert.equal(ids.has(step.id), false, `id de reto duplicado: ${step.id}`);
      ids.add(step.id);

      if (step.kind === 'expedition' || step.kind === 'ending') {
        assert.ok(step.actions.length >= 2 && step.actions.length <= 4, `${step.id}: la expedición debe tener de 2 a 4 acciones`);
      } else if (step.kind === 'conversation') {
        assert.ok(step.promptMessages?.length, `${step.id}: falta la pregunta del diálogo`);
        assert.ok(step.replyMessages?.length, `${step.id}: falta la reacción del personaje`);
      } else {
        assert.ok(['choice', 'destination', 'daily-recovery'].includes(step.kind), `${step.id}: tipo desconocido`);
        assert.ok(step.options.length >= 3 && step.options.length <= 4, `${step.id}: opciones fuera de rango`);
        assert.ok(step.options.some((option) => option.id === step.correctOptionId), `${step.id}: respuesta correcta inexistente`);
      }
    }
  }
});

test('las respuestas correctas se reparten de forma estable entre las posiciones', () => {
  const positions = [];
  for (const pack of futureEpisodeIds.map((id) => CHALLENGE_PACKS[id])) {
    for (const challenge of pack.steps) {
      if (!challenge.options) continue;
      const firstOrder = displayChallengeOptions(challenge);
      const secondOrder = displayChallengeOptions(challenge);
      assert.deepEqual(secondOrder, firstOrder, `${challenge.id}: el orden cambia al volver a renderizar`);
      positions.push(firstOrder.findIndex((option) => option.id === challenge.correctOptionId));
    }
  }

  const counts = positions.reduce((total, position) => {
    total[position] = (total[position] || 0) + 1;
    return total;
  }, {});
  assert.ok(counts[0] >= 20 && counts[1] >= 20 && counts[2] >= 20, `reparto desequilibrado: ${JSON.stringify(counts)}`);
});

test('cada jornada recuerda la ruta, permite recuperar Sombra y prepara el día siguiente', () => {
  for (const episodeId of futureEpisodeIds.slice(1, -1)) {
    const pack = CHALLENGE_PACKS[episodeId];
    if (episodeId === '012-badoca-lagos') {
      assert.deepEqual(pack.openingMessages, []);
      assert.ok(pack.steps.some((step) => step.id === 'topoloco-ruta-lagos'));
      continue;
    }
    if (episodeId !== '006-magikland-curia') {
      assert.match(pack.openingMessages.map(messageText).join(' '), /Buenos días/i, `${episodeId}: falta recordatorio de mañana`);
    }
    assert.ok(pack.steps.some((step) => step.kind === 'daily-recovery'), `${episodeId}: falta recuperación diaria`);
    const route = pack.steps.find((step) => step.id.startsWith('ruta-dia'));
    assert.ok(route, `${episodeId}: falta ruta del día siguiente`);
    assert.match(route.successMessages.map(messageText).join(' '), /preparad|tened|llevad/i, `${episodeId}: falta preparación`);
    const routeText = [route.prompt, ...route.successMessages.map(messageText)].join(' ');
    if (/mañana/i.test(routeText)) {
      assert.match(routeText, /descansad|guardad energía/i, `${episodeId}: falta cierre del día`);
    }
  }
});

test('el día 14 revela Magikland antes que Curia y conserva la continuidad', () => {
  const amarante = CHALLENGE_PACKS['005-amarante-puente'];
  const day14 = CHALLENGE_PACKS['006-magikland-curia'];
  const firstRoute = amarante.steps.find((step) => step.id === 'ruta-dia14');
  const magiklandEnd = day14.steps.findIndex((step) => step.id === 'magikland-q2');
  const curiaRoute = day14.steps.findIndex((step) => step.id === 'curia-ruta-descubierta');
  const curiaExpedition = day14.steps.findIndex((step) => step.id === 'curia-expedicion');
  const curiaEnd = day14.steps.findIndex((step) => step.id === 'curia-q2');
  const bucacoRoute = day14.steps.findIndex((step) => step.id === 'bucaco-hoy-ruta');
  const bucacoExpedition = day14.steps.findIndex((step) => step.id === 'bucaco-expedicion');
  const tomorrowRoute = day14.steps.find((step) => step.id === 'ruta-dia15');

  assert.equal(firstRoute.title, 'Descubrid la primera parada');
  assert.deepEqual(firstRoute.options.map((option) => option.text), ['Magikland', 'Parque da Cidade do Porto', 'Castillo de Guimarães']);
  assert.doesNotMatch([firstRoute.prompt, ...firstRoute.successMessages, ...day14.openingMessages].join(' '), /Curia|Hotel do Parque/i);
  assert.ok(magiklandEnd >= 0 && magiklandEnd < curiaRoute);
  assert.ok(curiaRoute < curiaExpedition);
  assert.ok(curiaExpedition < curiaEnd && curiaEnd < bucacoRoute && bucacoRoute < bucacoExpedition);
  assert.match(day14.steps[curiaRoute].successMessages.map(messageText).join(' '), /Curia|Hotel do Parque/i);
  assert.match(day14.steps[bucacoRoute].successMessages.map(messageText).join(' '), /Topotina|19:00|orden/i);
  assert.deepEqual(tomorrowRoute.options.map((option) => option.text), [
    'Portugal dos Pequenitos',
    'Mini-Europe de Bruselas',
    'Castillo de Guimarães'
  ]);

  const topotinaEntrance = day14.steps.find((step) => step.id === 'magikland-q2').successMessages;
  assert.equal(topotinaEntrance.findIndex((message) => message?.from === 'system'), 2);
  assert.ok(topotinaEntrance.filter((message) => message?.from === 'topotina').length >= 4);
  assert.ok(topotinaEntrance.some((message) => message?.from === 'topotino' && /técnica misteriosa/.test(message.text)));
  assert.ok(topotinaEntrance.some((message) => message?.from === 'topotina' && /No necesito que me recuerdes/.test(message.text)));

  const curiaArrival = day14.steps.find((step) => step.id === 'curia-expedicion');
  assert.equal(curiaArrival.location.radiusMeters, 5000);
  assert.ok(curiaArrival.arrivalMessages.some((message) => message?.from === 'topotina'));
  assert.match(curiaArrival.arrivalMessages.map(messageText).join(' '), /no se ha abierto hasta vuestra llegada/i);
  assert.doesNotMatch([
    curiaArrival.intro,
    ...(curiaArrival.actions || []),
    ...day14.steps.find((step) => step.id === 'curia-q2').successMessages.map(messageText)
  ].join(' '), /piscina/i);

  const visibleDay14Text = [
    ...day14.openingMessages,
    ...day14.steps.flatMap((step) => [
      step.prompt,
      step.title,
      step.intro,
      ...(step.actions || []),
      ...(step.successMessages || []).map(messageText),
      ...(step.doneMessages || []).map(messageText),
      ...(step.options || []).map((option) => option.text)
    ])
  ].filter(Boolean).join(' ');
  assert.doesNotMatch(visibleDay14Text, /el significado pesa|conserva tiempo|expulsar una reserva|relacionar experiencia y cambio/i);
});

test('cada cambio de lugar futuro espera la llegada física antes de mostrar su primera prueba', () => {
  const gatedFirstSteps = [
    'curia-expedicion',
    'bucaco-expedicion', 'portugal-pequenitos-expedicion',
    'batalha-q1', 'fatima-expedicion',
    'mira-q1', 'obidos-expedicion',
    'lisboa-llegada-q1',
    'pavilhao-expedicion',
    'oceanario-q1',
    'alfama-visita-expedicion', 'belem-expedicion',
    'albufeira-expedicion', 'refugio-llegada-dia22'
  ];
  const allSteps = Object.values(CHALLENGE_PACKS).flatMap((pack) => pack.steps);
  const markers = new Set();

  for (const id of gatedFirstSteps) {
    const step = allSteps.find((candidate) => candidate.id === id);
    assert.ok(step, `${id}: no existe`);
    assert.ok(step.location?.lat && step.location?.lng, `${id}: falta coordenada de llegada`);
    assert.ok(step.location.radiusMeters <= 5000, `${id}: radio demasiado amplio`);
    assert.ok(step.arrivalMarker, `${id}: la llegada no queda guardada`);
    assert.equal(markers.has(step.arrivalMarker), false, `${id}: marcador de llegada repetido`);
    markers.add(step.arrivalMarker);
    assert.ok(step.arrivalMessages?.length >= 2, `${id}: falta transición narrativa al llegar`);
    assert.match(step.arrivalMessages.map(messageText).join(' '), /llegada|llegado|llegado|estáis|estais/i, `${id}: el aviso no confirma la llegada`);
  }
});

test('el cambio real mueve Buçaco al día 14 y abre el día 15 en Portugal dos Pequenitos', () => {
  const day14 = CHALLENGE_PACKS['006-magikland-curia'];
  const day15 = CHALLENGE_PACKS['007-bucaco-batalha-fatima'];
  const day14Ids = day14.steps.map((step) => step.id);
  const day15Ids = day15.steps.map((step) => step.id);

  assert.ok(day14Ids.includes('bucaco-expedicion'));
  assert.ok(day14Ids.includes('bucaco-q1'));
  assert.ok(day14Ids.includes('bucaco-q2'));
  assert.equal(day15Ids.some((id) => id.startsWith('bucaco-')), false);
  assert.deepEqual(day15Ids.slice(0, 5), [
    'portugal-pequenitos-expedicion',
    'portugal-pequenitos-q1',
    'portugal-pequenitos-q2',
    'portugal-pequenitos-q3',
    'portugal-pequenitos-q4'
  ]);
  assert.match(day15.openingMessages.map(messageText).join(' '), /eclipse.*Amarante.*Magikland.*Topotino.*Hotel do Parque.*Buçaco/is);
  assert.ok(day15.openingMessages.filter((message) => message?.from === 'topotina').length >= 2);
  assert.match(messageText(day15.openingMessages.at(-1)), /única pista.*Portugal dos Pequenitos/i);
  assert.ok(day15Ids.indexOf('portugal-pequenitos-q4') < day15Ids.indexOf('dia15-pista-batalha'));
  assert.ok(day15Ids.indexOf('dia15-pista-batalha') < day15Ids.indexOf('batalha-q1'));
  assert.ok(day15Ids.indexOf('batalha-q2') < day15Ids.indexOf('dia15-pista-fatima'));
  assert.ok(day15Ids.indexOf('dia15-pista-fatima') < day15Ids.indexOf('fatima-expedicion'));

  const portugalExpedition = day15.steps.find((step) => step.id === 'portugal-pequenitos-expedicion');
  const portugalQ3 = day15.steps.find((step) => step.id === 'portugal-pequenitos-q3');
  const portugalQ4 = day15.steps.find((step) => step.id === 'portugal-pequenitos-q4');
  const batalhaRoute = day15.steps.find((step) => step.id === 'dia15-pista-batalha');
  const fatimaRoute = day15.steps.find((step) => step.id === 'dia15-pista-fatima');

  assert.match(portugalExpedition.actions.join(' '), /arcos apuntados.*piedra tallada.*placa/is);
  assert.doesNotMatch([
    ...portugalExpedition.actions,
    ...portugalExpedition.doneMessages.map(messageText),
    portugalQ3.prompt
  ].join(' '), /Batalha|Fátima/i);
  assert.match(portugalQ3.prompt, /rasgo visible.*representación/i);
  assert.match(portugalQ4.prompt, /nombre.*placa.*representación/i);
  assert.match(portugalQ4.successMessages.map(messageText).join(' '), /Monasterio de Batalha.*PROMESA.*1385/is);
  assert.doesNotMatch(portugalQ4.successMessages.map(messageText).join(' '), /Fátima/i);
  assert.match(batalhaRoute.successMessages.map(messageText).join(' '), /arquitectura.*placa.*única coordenada/is);

  const batalhaExpedition = day15.steps.find((step) => step.id === 'batalha-expedicion');
  const beforeFatima = day15.steps.slice(0, day15.steps.indexOf(fatimaRoute)).flatMap((step) => [
    step.prompt,
    ...(step.successMessages || []).map(messageText),
    ...(step.doneMessages || []).map(messageText)
  ]).filter(Boolean).join(' ');
  assert.doesNotMatch(beforeFatima, /Fátima/i);
  assert.match(batalhaExpedition.doneMessages.map(messageText).join(' '), /3 · 13 · 1917.*rey.*1385.*Topoloco cambió el destino/is);
  assert.match(fatimaRoute.prompt, /1917.*tres niños pastores.*Virgen/i);
  assert.match(fatimaRoute.successMessages.map(messageText).join(' '), /señala Fátima.*coordenada de Fátima/is);
});

test('Gotas se anuncia después de las huellas y solo entra al llegar a Mira de Aire', () => {
  const day16 = CHALLENGE_PACKS['008-huellas-mira-obidos'];
  const routeToMira = day16.steps.find((step) => step.id === 'dia16-pista-mira');
  const miraArrival = day16.steps.find((step) => step.id === 'mira-q1');
  const miraExpedition = day16.steps.find((step) => step.id === 'mira-expedicion');
  const openingText = day16.openingMessages.map(messageText).join(' ');

  assert.doesNotMatch(openingText, /Gotas/i);
  assert.ok(routeToMira.successMessages.some((message) => message?.from === 'topotina' && /firma aliada: GOTAS/i.test(message.text)));
  assert.equal(routeToMira.successMessages.some((message) => message?.from === 'gotas'), false);
  assert.ok(miraArrival.location, 'la entrada de Gotas debe esperar la llegada física');
  assert.ok(miraArrival.arrivalMessages.some((message) => message?.from === 'system' && /Gotas se ha unido/i.test(message.text)));
  assert.ok(miraArrival.arrivalMessages.filter((message) => message?.from === 'gotas').length >= 2);
  assert.ok(miraArrival.arrivalMessages.some((message) => message?.from === 'topotino' && /cualquiera.*CHAT SECRETO/i.test(message.text)));
  assert.ok(miraArrival.arrivalMessages.some((message) => message?.from === 'topotina' && /invitación de un solo uso.*firmada por ti/i.test(message.text)));
  assert.ok(miraArrival.arrivalMessages.some((message) => message?.from === 'topotina' && /Firma verificada/i.test(message.text)));
  assert.ok(miraExpedition.doneMessages.some((message) => message?.from === 'gotas'));
});

test('Louri se insinúa el 16, se revela el 17 y sus conexiones posteriores están justificadas y cerradas', async () => {
  const day16 = CHALLENGE_PACKS['008-huellas-mira-obidos'];
  const day17 = CHALLENGE_PACKS['009-dinoparque-lisboa'];
  const laterMessages = futureEpisodeIds.slice(futureEpisodeIds.indexOf('010-lisboa-ciencia-oceanario'))
    .flatMap((id) => [
      ...CHALLENGE_PACKS[id].openingMessages,
      ...CHALLENGE_PACKS[id].steps.flatMap((step) => [
        ...(step.successMessages || []),
        ...(step.doneMessages || []),
        ...(step.arrivalMessages || []),
        ...(step.promptMessages || []),
        ...(step.replyMessages || [])
      ])
    ]);

  const day16Text = [
    ...day16.openingMessages.map(messageText),
    ...day16.steps.flatMap((step) => [step.prompt, ...(step.doneMessages || []).map(messageText)])
  ].join(' ');
  assert.match(day16Text, /espía.*dinosaurio|dinosaurio.*espía/is);
  assert.doesNotMatch(day16Text, /Burger King|Soy Louri/i);

  const entrance = day17.steps.find((step) => step.id === 'dinoparque-q1').successMessages;
  const crisis = day17.steps.find((step) => step.id === 'dinoparque-q2').successMessages;
  const farewell = day17.steps.find((step) => step.id === 'dialogo-dia17-pista-lisboa').replyMessages;
  assert.ok(entrance.some((message) => message?.from === 'system' && /LOURI/i.test(message.text)));
  assert.ok(entrance.some((message) => message?.from === 'louri' && /Burger King/i.test(message.text)));
  assert.ok(crisis.some((message) => /defectuosa/i.test(messageText(message))));
  assert.ok(farewell.some((message) => message?.from === 'system' && /ha salido del canal/i.test(message.text)));
  assert.ok(farewell.some((message) => message?.from === 'topotina' && /cerrado definitivamente/i.test(message.text)));
  const laterLouriMessages = laterMessages.filter((message) => message?.from === 'louri');
  assert.ok(laterLouriMessages.some((message) => /37\.106434, -8\.253350/.test(messageText(message))));
  const app = await readFile(join(root, 'app.js'), 'utf8');
  assert.match(app, /El safari era un señuelo/);
  const day22 = CHALLENGE_PACKS['014-piedade-algar-jaima'];
  const finalConnection = day22.steps.find((step) => step.id === 'louri-refugio-dia22');
  assert.deepEqual(finalConnection.notBefore, { date: '2026-08-22', time: '13:00' });
  assert.match(finalConnection.alwaysMessages.map(messageText).join(' '), /cerrado definitivamente/i);
  const afterDay22 = futureEpisodeIds.slice(futureEpisodeIds.indexOf('015-zoomarine'))
    .flatMap((id) => CHALLENGE_PACKS[id].steps)
    .flatMap((step) => [...(step.successMessages || []), ...(step.doneMessages || []), ...(step.promptMessages || []), ...(step.replyMessages || [])]);
  assert.ok(afterDay22.some((message) => message?.from === 'louri' && /autopista de agua/i.test(messageText(message))));
  const finalDayMessages = CHALLENGE_PACKS['017-isla-magica'].steps
    .flatMap((step) => [...(step.successMessages || []), ...(step.doneMessages || []), ...(step.promptMessages || []), ...(step.replyMessages || [])]);
  assert.equal(finalDayMessages.some((message) => message?.from === 'louri'), false);
});

test('cada cambio de destino desde el día 17 tiene antes un diálogo narrativo', () => {
  const destinationIds = new Set([
    'dia17-pista-lisboa', 'ruta-dia18', 'dia18-pista-oceanario', 'dia18-pista-tejo',
    'ruta-dia19', 'dia19-pista-alfama', 'dia19-pista-belem', 'ruta-dia20',
    'dia20-pista-lagos', 'ruta-dia21', 'ruta-dia22',
    'dia22-pista-albufeira', 'ruta-dia23', 'ruta-dia24',
    'dia24-pista-sevilla', 'ruta-dia25'
  ]);

  for (const episodeId of futureEpisodeIds.slice(futureEpisodeIds.indexOf('009-dinoparque-lisboa'))) {
    const steps = CHALLENGE_PACKS[episodeId].steps;
    for (let index = 0; index < steps.length; index += 1) {
      if (!destinationIds.has(steps[index].id)) continue;
      const bridge = steps[index - 1];
      assert.equal(bridge?.kind, 'conversation', `${steps[index].id}: falta diálogo anterior`);
      assert.equal(bridge.id, `dialogo-${steps[index].id}`);
      assert.ok(bridge.promptMessages.some((message) => /\?/.test(messageText(message))), `${bridge.id}: falta pregunta humana`);
      assert.ok(bridge.replyMessages.length, `${bridge.id}: falta reacción narrativa`);
    }
  }

  const today = CHALLENGE_PACKS['009-dinoparque-lisboa'].steps
    .find((step) => step.id === 'dialogo-dia17-pista-lisboa');
  const prompt = today.promptMessages.map(messageText).join(' ');
  const reply = today.replyMessages.map(messageText).join(' ');
  assert.match(prompt, /Hugo.*actuación.*plaza/is);
  assert.match(prompt, /Paula.*te orientabas.*Óbidos/is);
  assert.match(prompt, /escribiendo.*dibujando.*Cuaderno de la Memoria/is);
  assert.match(prompt, /comunicador.*cámara.*otro lado/is);
  assert.match(reply, /No quiero verlo.*Cuaderno es vuestro/is);
});

test('el día 21 funciona sin cobertura, elimina Sagres y prepara Ponta por la tarde', () => {
  const day21 = CHALLENGE_PACKS['013-delfines-benagil-sagres'];
  const ids = day21.steps.map((step) => step.id);
  const expedition = day21.steps.find((step) => step.id === 'barco-expedicion');
  const returnConversation = day21.steps.find((step) => step.id === 'dialogo-regreso-puerto-dia21');
  const afternoonConversation = day21.steps.find((step) => step.id === 'dialogo-ruta-dia22');
  const route = day21.steps.find((step) => step.id === 'ruta-dia22');
  const visible = [
    ...day21.openingMessages.map(messageText),
    ...day21.steps.flatMap((step) => [
      step.place,
      step.prompt,
      step.intro,
      ...(step.actions || []),
      ...(step.successMessages || []).map(messageText),
      ...(step.doneMessages || []).map(messageText),
      ...(step.promptMessages || []).map(messageText),
      ...(step.replyMessages || []).map(messageText),
      ...(step.alwaysMessages || []).map(messageText)
    ])
  ].filter(Boolean).join(' ');

  assert.equal(expedition.completionLabel, 'Ya hemos vuelto al puerto');
  assert.ok(ids.indexOf('barco-expedicion') < ids.indexOf('barco-q1'));
  assert.ok(ids.indexOf('barco-q1') < ids.indexOf('barco-q2'));
  assert.ok(ids.indexOf('barco-q2') < ids.indexOf('barco-q3'));
  assert.ok(ids.indexOf('barco-q3') < ids.indexOf('dialogo-regreso-puerto-dia21'));
  assert.match(returnConversation.alwaysMessages.map(messageText).join(' '), /Calibrador Marino.*bloqueado|bloqueado.*Calibrador Marino/is);
  assert.deepEqual(returnConversation.effects.setFlags, ['calibrador_marino_bloqueado']);
  assert.deepEqual(afternoonConversation.notBefore, { date: '2026-08-21', time: '17:30' });
  assert.deepEqual(afternoonConversation.effects.setFlags, ['tarde_lagos_lista']);
  assert.deepEqual(route.notBefore, { date: '2026-08-21', time: '17:30' });
  assert.match(route.successMessages.map(messageText).join(' '), /maletas.*este del Algarve|este del Algarve.*maletas/is);
  assert.match(visible, /sin cobertura|no tendréis cobertura/i);
  assert.doesNotMatch(visible, /Sagres|Cabo de São Vicente|Corvinho/i);
});

test('el arco posterior encadena el Corrector de Topoloco y termina únicamente en Isla Mágica', async () => {
  const causalChecks = [
    ['010-lisboa-ciencia-oceanario', /módulo.*separar causas|separar causas.*módulo/is],
    ['011-lisboa-historia-belem', /archivo histórico.*Lisboa|Lisboa.*archivo histórico/is],
    ['013-delfines-benagil-sagres', /Louri.*embarcación|embarcación.*Lagos|Corrector/is],
    ['014-piedade-algar-jaima', /Eco.*escucha.*recorta.*repite/is],
    ['015-zoomarine', /Albufeira.*Refugio de Lona|Refugio de Lona.*Albufeira/is],
    ['016-tavira-sevilla', /alguien.*ROMANO.*puente|alteración.*puente/is],
    ['017-isla-magica', /isla.*barcos.*Sevilla|Topoloco.*una sola versión/is]
  ];

  for (const [id, pattern] of causalChecks) {
    assert.match(CHALLENGE_PACKS[id].openingMessages.map(messageText).join(' '), pattern, `${id}: apertura sin causa narrativa`);
  }

  const app = await readFile(join(root, 'app.js'), 'utf8');
  assert.match(app, /Corrector Definitivo de la Historia/);
  assert.match(app, /El safari era un señuelo/);
  assert.match(app, /Delfines salvajes\. Cuevas marinas/);

  const sevilleFinal = CHALLENGE_PACKS['017-isla-magica'].steps.find((step) => step.id === 'final-sevilla-noche');
  assert.match(sevilleFinal.place, /Isla Mágica.*lago/i);
  assert.deepEqual(sevilleFinal.effects.setFlags, [
    'completado_isla_magica', 'completado_sevilla_alhambra_noche', 'topoloco_derrotado', 'doce_aguas_reunidas'
  ]);
  assert.doesNotMatch([
    sevilleFinal.place,
    sevilleFinal.title,
    sevilleFinal.intro,
    ...(sevilleFinal.actions || []),
    ...(sevilleFinal.doneMessages || [])
  ].join(' '), /Granada|Alhambra/i);
  assert.match(app, /DEFAULT_FINAL_ROUTE = 'sevilla-night'/);
  assert.match(app, /Granada y la Alhambra ya no forman parte|RETIRED_FINAL_EPISODE_IDS/);
});

test('el día 18 explica el sabotaje, abre solo el encargo y espera la llegada al Pavilhão', () => {
  const day18 = CHALLENGE_PACKS['010-lisboa-ciencia-oceanario'];
  const opening = day18.openingMessages.map(messageText).join(' ');
  const firstStep = day18.steps[0];
  const day19 = CHALLENGE_PACKS['011-lisboa-historia-belem'];

  assert.match(opening, /Topoloco.*rompi[oó].*chat|rompi[oó].*chat.*Topoloco/is);
  assert.match(opening, /enfad.*Louri|Louri.*enfad/is);
  assert.match(opening, /reparado|bloqueado.*transmisi/is);
  assert.match(opening, /Pavilhão do Conhecimento/i);
  assert.match(opening, /módulo.*Máquina de los Recuerdos|Máquina de los Recuerdos.*módulo/is);
  assert.match(opening, /actualizar la señal/i);
  assert.doesNotMatch(opening, /Oceanário|Tajo|Tejo/i);

  assert.equal(firstStep.id, 'pavilhao-expedicion');
  assert.equal(firstStep.location.label, 'Pavilhão do Conhecimento, Lisboa');
  assert.ok(firstStep.arrivalMarker);
  assert.match(firstStep.arrivalMessages.map(messageText).join(' '), /Llegada confirmada.*módulo/is);
  assert.match(day19.openingMessages.map(messageText).join(' '), /cerramos el ataque.*estropeamos el módulo/is);
});

test('cada lugar revela solo el paso accionable siguiente y nunca el itinerario completo', () => {
  const forbidden = [
    'Portugal dos Pequenitos, Batalha y Fátima',
    'Pegadas de Dinossáurios, Mira de Aire y Óbidos',
    'Dino Parque Lourinhã y después Lisboa',
    'Pavilhão do Conhecimento, Oceanário y Tajo',
    'Castelo de São Jorge, Alfama y Baixa, y después Belém',
    'Badoca y después Lagos',
    'Ponta da Piedade, Algar Seco y la jaima',
    'Real Alcázar, Catedral y Alhambra'
  ];
  const visibleText = Object.values(CHALLENGE_PACKS).flatMap((pack) => [
    ...pack.openingMessages.map(messageText),
    ...pack.steps.flatMap((step) => [
      step.prompt,
      ...(step.successMessages || []).map(messageText)
    ])
  ]).filter(Boolean).join(' ');

  for (const phrase of forbidden) assert.doesNotMatch(visibleText, new RegExp(phrase, 'i'));

  const expectedTransitions = {
    '007-bucaco-batalha-fatima': ['dia15-pista-batalha', 'dia15-pista-fatima'],
    '008-huellas-mira-obidos': ['dia16-pista-mira', 'dia16-pista-obidos'],
    '009-dinoparque-lisboa': ['dia17-pista-lisboa'],
    '010-lisboa-ciencia-oceanario': ['dia18-pista-oceanario'],
    '011-lisboa-historia-belem': ['dia19-pista-belem'],
    '012-badoca-lagos': ['topoloco-ruta-lagos'],
    '013-delfines-benagil-sagres': ['ruta-dia22'],
    '014-piedade-algar-jaima': ['dia22-pista-albufeira', 'louri-refugio-dia22'],
    '016-tavira-sevilla': ['dia24-pista-sevilla'],
    '017-isla-magica': ['dialogo-final-isla']
  };
  for (const [episodeId, ids] of Object.entries(expectedTransitions)) {
    const steps = CHALLENGE_PACKS[episodeId].steps.map((step) => step.id);
    for (const id of ids) assert.ok(steps.includes(id), `${episodeId}: falta ${id}`);
  }
});

test('las pruebas son breves, físicas y enseñan después de elegir', () => {
  for (const pack of futureEpisodeIds.map((id) => CHALLENGE_PACKS[id])) {
    for (const step of pack.steps) {
      const childTexts = [
        step.prompt,
        step.title,
        step.intro,
        ...(step.actions || []),
        ...(step.successMessages || []).map(messageText),
        ...(step.doneMessages || []).map(messageText),
        ...(step.promptMessages || []).map(messageText),
        ...(step.replyMessages || []).map(messageText),
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

test('los diálogos críticos del final reaccionan con IA y conservan después su cierre canónico', async () => {
  const day24 = CHALLENGE_PACKS['016-tavira-sevilla'];
  const day25 = CHALLENGE_PACKS['017-isla-magica'];
  const byId = new Map([...day24.steps, ...day25.steps].map((step) => [step.id, step]));

  for (const id of ['dialogo-dia24-pista-sevilla', 'dialogo-ruta-dia25', 'dialogo-isla-q1', 'dialogo-final-isla']) {
    const dialogue = byId.get(id);
    assert.ok(dialogue, `falta ${id}`);
    assert.equal(dialogue.kind, 'conversation');
    assert.equal(dialogue.scriptedReply, true);
    assert.ok(dialogue.allowedSpeakers?.length, `${id}: faltan remitentes exactos`);
  }

  assert.equal(byId.get('dialogo-dia24-pista-sevilla').allowClosedSpeaker, 'louri');
  assert.deepEqual(byId.get('dialogo-isla-q1').allowedSpeakers, ['topotino', 'topotina', 'capitan_pico']);

  const visibleMessages = [...day24.steps, ...day25.steps].flatMap((step) => [
    ...(step.promptMessages || []),
    ...(step.replyMessages || []),
    ...(step.successMessages || []),
    ...(step.doneMessages || []),
    ...(step.arrivalMessages || [])
  ]);
  assert.equal(visibleMessages.some((message) => message?.from === 'america'), false);

  const app = await readFile(join(root, 'app.js'), 'utf8');
  const api = await readFile(join(root, 'api/chat.js'), 'utf8');
  assert.match(app, /hasScriptedReply[\s\S]*askAiFallback[\s\S]*deliverTopotinoMessages\(toTopotinoMessages\(challenge\.replyMessages\)/);
  assert.match(app, /speakerMode: options\.conversationChallenge\?\.allowedSpeakers \? 'exact'/);
  assert.match(api, /EXACT_STORY_CONVERSATIONS/);
  assert.match(api, /authorizedLouriReturn/);
  assert.match(api, /América puede estar presente[\s\S]*no escribe en el chat/);
});

test('la tarde de Sevilla recupera once testigos en orden sin anunciar el recorrido completo', () => {
  const day24 = CHALLENGE_PACKS['016-tavira-sevilla'];
  const ids = day24.steps.map((step) => step.id);
  const ordered = [
    'sevilla-ruta-setas', 'sevilla-setas-expedicion', 'sevilla-setas-q1',
    'sevilla-ruta-sierpes', 'sevilla-centro-expedicion', 'sevilla-centro-q1',
    'sevilla-ruta-constitucion', 'sevilla-monumental-expedicion', 'dialogo-capitan-pico-sevilla', 'sevilla-monumental-q1',
    'sevilla-ruta-santa-cruz', 'sevilla-santa-cruz-expedicion', 'sevilla-santa-cruz-q1',
    'sevilla-ruta-fabrica', 'sevilla-fabrica-expedicion', 'sevilla-fabrica-q1',
    'sevilla-ruta-parque', 'sevilla-parque-expedicion', 'sevilla-parque-q1', 'sevilla-parque-q2',
    'dialogo-sevilla-cierre', 'dialogo-ruta-dia25', 'ruta-dia25'
  ];

  for (const id of ordered) assert.ok(ids.includes(id), `falta ${id}`);
  for (let index = 1; index < ordered.length; index += 1) {
    assert.ok(ids.indexOf(ordered[index - 1]) < ids.indexOf(ordered[index]), `${ordered[index]} aparece fuera de orden`);
  }

  const setas = day24.steps.find((step) => step.id === 'sevilla-setas-expedicion');
  assert.ok(setas.location, 'la primera misión sevillana debe esperar a Las Setas');
  assert.match(setas.location.label, /Setas de Sevilla/);

  const allText = day24.steps.flatMap((step) => [
    step.prompt, ...(step.actions || []),
    ...(step.promptMessages || []).map(messageText),
    ...(step.replyMessages || []).map(messageText),
    ...(step.successMessages || []).map(messageText),
    ...(step.doneMessages || []).map(messageText)
  ]).filter(Boolean).join(' ');
  for (const place of ['Setas', 'Sierpes', 'San Francisco', 'Plaza Nueva', 'Constitución', 'Giralda', 'Archivo de Indias', 'Santa Cruz', 'Fábrica de Tabacos', 'María Luisa', 'Plaza de España']) {
    assert.match(allText, new RegExp(place, 'i'), `falta el testigo ${place}`);
  }

  const captainEntrance = day24.steps.find((step) => step.id === 'dialogo-capitan-pico-sevilla');
  assert.ok(captainEntrance.promptMessages.some((message) => message?.from === 'system' && /se ha unido/.test(message.text)));
  assert.ok(captainEntrance.promptMessages.some((message) => message?.from === 'capitan_pico' && /América/.test(message.text)));
  assert.equal(day24.steps.flatMap((step) => [...(step.promptMessages || []), ...(step.replyMessages || [])]).some((message) => message?.from === 'america'), false);
  assert.ok(ids.indexOf('dialogo-capitan-pico-sevilla') > ids.indexOf('sevilla-monumental-expedicion'));
  assert.ok(ids.indexOf('dialogo-capitan-pico-sevilla') < ids.indexOf('sevilla-ruta-santa-cruz'));
});

test('una partida T-24A0 que ya descubrió Sevilla continúa en el primer testigo sin repetir Tavira', () => {
  const steps = CHALLENGE_PACKS['016-tavira-sevilla'].steps;
  const oldCompleted = new Set([
    'tavira-expedicion', 'tavira-q1', 'tavira-q2',
    'dialogo-dia24-pista-sevilla', 'dia24-pista-sevilla',
    'recuperacion-dia24', 'dialogo-ruta-dia25', 'ruta-dia25'
  ]);
  const next = steps.find((step) => !oldCompleted.has(step.id));

  assert.equal(next?.id, 'dialogo-sevilla-arranque');
  assert.ok(steps.indexOf(next) > steps.findIndex((step) => step.id === 'dia24-pista-sevilla'));
  assert.ok(steps.indexOf(next) < steps.findIndex((step) => step.id === 'ruta-dia25'));
});

test('la reparación T-24A2 convierte la pantalla de Tavira en la misión de Sierpes ya alcanzada', () => {
  const steps = CHALLENGE_PACKS['016-tavira-sevilla'].steps;
  const sierpesIndex = steps.findIndex((step) => step.id === 'sevilla-ruta-sierpes');
  const rescued = new Set(steps.slice(0, sierpesIndex + 1).map((step) => step.id));
  const next = steps.find((step) => !rescued.has(step.id));

  assert.ok(rescued.has('tavira-expedicion'));
  assert.ok(rescued.has('sevilla-ruta-sierpes'));
  assert.equal(next?.id, 'sevilla-centro-expedicion');
  assert.equal(next?.place, 'Sierpes, San Francisco y Plaza Nueva');
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
  assert.match(app, /VICTORIA: LAS DOCE AGUAS RECUPERADAS/);
  assert.match(app, /lo hemos conseguido/);
  assert.match(app, /Algunos recuerdos tardarán más en ordenarse/);
});
