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
  for (const pack of Object.values(CHALLENGE_PACKS)) {
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
  for (const episodeId of futureEpisodeIds.slice(1, -2)) {
    const pack = CHALLENGE_PACKS[episodeId];
    if (episodeId !== '006-magikland-curia') {
      assert.match(pack.openingMessages.map(messageText).join(' '), /Buenos días/i, `${episodeId}: falta recordatorio de mañana`);
    }
    assert.ok(pack.steps.some((step) => step.kind === 'daily-recovery'), `${episodeId}: falta recuperación diaria`);
    const route = pack.steps.find((step) => step.id.startsWith('ruta-dia'));
    assert.ok(route, `${episodeId}: falta ruta del día siguiente`);
    assert.match(route.successMessages.map(messageText).join(' '), /preparad|tened|llevad/i, `${episodeId}: falta preparación`);
    assert.match(route.successMessages.map(messageText).join(' '), /descansad|guardad energía/i, `${episodeId}: falta cierre del día`);
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
    'oceanario-q1', 'tejo-expedicion',
    'alfama-q1', 'belem-expedicion',
    'lagos-q1', 'sagres-q1',
    'algar-q1', 'jaima-expedicion',
    'sevilla-plaza-q1',
    'catedral-q1', 'alhambra-expedicion'
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

test('Louri se insinúa el 16, entra y se despide definitivamente el 17', () => {
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
  assert.equal(laterMessages.some((message) => message?.from === 'louri'), false);
  assert.doesNotMatch(laterMessages.map(messageText).join(' '), /Louri está escribiendo|Louri se ha unido/i);
});

test('cada cambio de destino desde el día 17 tiene antes un diálogo narrativo', () => {
  const destinationIds = new Set([
    'dia17-pista-lisboa', 'ruta-dia18', 'dia18-pista-oceanario', 'dia18-pista-tejo',
    'ruta-dia19', 'dia19-pista-alfama', 'dia19-pista-belem', 'ruta-dia20',
    'dia20-pista-lagos', 'ruta-dia21', 'dia21-pista-sagres', 'ruta-dia22',
    'dia22-pista-algar', 'dia22-pista-jaima', 'ruta-dia23', 'ruta-dia24',
    'dia24-pista-sevilla', 'ruta-dia25', 'ruta-dia26', 'dia26-pista-catedral',
    'dia26-pista-alhambra'
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

test('el arco posterior encadena acciones de Topoloco y revela la Alhambra en Isla Mágica', () => {
  const causalChecks = [
    ['010-lisboa-ciencia-oceanario', /módulo.*separar causas|separar causas.*módulo/is],
    ['011-lisboa-historia-belem', /archivo histórico.*Lisboa|Lisboa.*archivo histórico/is],
    ['012-badoca-lagos', /receptor.*Badoca|Badoca.*receptor/is],
    ['013-delfines-benagil-sagres', /receptor.*embarcación|embarcación.*receptor/is],
    ['014-piedade-algar-jaima', /Eco.*copiando la voz|voz.*Eco/is],
    ['015-zoomarine', /Eco.*Cuaderno|Cuaderno.*Eco/is],
    ['016-tavira-sevilla', /Borrón.*puente|puente.*Borrón/is],
    ['017-isla-magica', /firma gemela.*Magikland|Magikland.*firma gemela/is]
  ];

  for (const [id, pattern] of causalChecks) {
    assert.match(CHALLENGE_PACKS[id].openingMessages.map(messageText).join(' '), pattern, `${id}: apertura sin causa narrativa`);
  }

  const islandRoute = CHALLENGE_PACKS['017-isla-magica'].steps.find((step) => step.id === 'ruta-dia26');
  const cathedralRoute = CHALLENGE_PACKS['018-sevilla-alhambra-noche'].steps.find((step) => step.id === 'dia26-pista-alhambra');
  assert.match(islandRoute.prompt, /Alhambra de noche/i);
  assert.doesNotMatch(cathedralRoute.successMessages.map(messageText).join(' '), /primera vez|no sabíamos|acabamos de descubrir/i);
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
    '010-lisboa-ciencia-oceanario': ['dia18-pista-oceanario', 'dia18-pista-tejo'],
    '011-lisboa-historia-belem': ['dia19-pista-alfama', 'dia19-pista-belem'],
    '012-badoca-lagos': ['dia20-pista-lagos'],
    '013-delfines-benagil-sagres': ['dia21-pista-sagres'],
    '014-piedade-algar-jaima': ['dia22-pista-algar', 'dia22-pista-jaima'],
    '016-tavira-sevilla': ['dia24-pista-sevilla'],
    '018-sevilla-alhambra-noche': ['dia26-pista-catedral', 'dia26-pista-alhambra']
  };
  for (const [episodeId, ids] of Object.entries(expectedTransitions)) {
    const steps = CHALLENGE_PACKS[episodeId].steps.map((step) => step.id);
    for (const id of ids) assert.ok(steps.includes(id), `${episodeId}: falta ${id}`);
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
