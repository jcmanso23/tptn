const optionIds = ['a', 'b', 'c', 'd'];

const ARRIVAL_LOCATIONS = Object.freeze({
  bucaco: { lat: 40.3755835, lng: -8.3619487, radiusMeters: 5000, label: 'Mata Nacional do Buçaco' },
  portugalPequenitos: { lat: 40.202478, lng: -8.434375, radiusMeters: 700, label: 'Portugal dos Pequenitos, Coimbra' },
  batalha: { lat: 39.6594, lng: -8.8254, radiusMeters: 700, label: 'Monasterio de Batalha' },
  fatima: { lat: 39.6321, lng: -8.6719, radiusMeters: 1000, label: 'Santuario de Fátima' },
  mira: { lat: 39.5434, lng: -8.7046, radiusMeters: 700, label: 'Grutas de Mira de Aire' },
  obidos: { lat: 39.3605, lng: -9.1570, radiusMeters: 1000, label: 'Óbidos' },
  rossio: { lat: 38.7139, lng: -9.1394, radiusMeters: 700, label: 'Rossio, Lisboa' },
  oceanario: { lat: 38.7636, lng: -9.0937, radiusMeters: 180, label: 'Oceanário de Lisboa' },
  tejo: { lat: 38.7682, lng: -9.0922, radiusMeters: 350, label: 'Ribera del Tajo, Parque das Nações' },
  alfama: { lat: 38.7114, lng: -9.1301, radiusMeters: 500, label: 'Alfama, Lisboa' },
  belem: { lat: 38.6977, lng: -9.2068, radiusMeters: 1000, label: 'Belém, Lisboa' },
  lagos: { lat: 37.1099, lng: -8.6748, radiusMeters: 1000, label: 'Marina de Lagos' },
  sagres: { lat: 37.0016, lng: -8.9459, radiusMeters: 5000, label: 'Sagres y Cabo de São Vicente' },
  algar: { lat: 37.0966, lng: -8.4719, radiusMeters: 700, label: 'Algar Seco, Carvoeiro' },
  jaima: { lat: 37.106434, lng: -8.25335, radiusMeters: 5000, label: 'HolaCamp Albufeira' },
  sevillaPlaza: { lat: 37.3772, lng: -5.9869, radiusMeters: 700, label: 'Plaza de España, Sevilla' },
  catedralSevilla: { lat: 37.3858, lng: -5.9931, radiusMeters: 450, label: 'Catedral de Sevilla' },
  alhambra: { lat: 37.1761, lng: -3.5881, radiusMeters: 700, label: 'Alhambra, Granada' }
});

function onArrival(step, location, arrivalMessages, marker = `llegada-${step.id}-t20a6`) {
  return Object.assign(step, {
    location,
    arrivalMarker: marker,
    arrivalMessages: [
      { from: 'system', text: `Llegada confirmada: ${location.label}.` },
      ...arrivalMessages
    ]
  });
}

export function displayChallengeOptions(challenge) {
  const options = [...(challenge?.options || [])];
  if (options.length < 2 || !challenge?.correctOptionId) return options;

  const correct = options.find((option) => option.id === challenge.correctOptionId);
  if (!correct) return options;

  let hash = 2166136261;
  for (const character of String(challenge.id || '')) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const targetIndex = (hash >>> 0) % options.length;
  const reordered = options.filter((option) => option.id !== challenge.correctOptionId);
  reordered.splice(targetIndex, 0, correct);
  return reordered;
}

function question(id, place, prompt, options, correctIndex, success, learn, hint, recoveryActions) {
  return {
    id,
    kind: 'choice',
    place,
    prompt,
    options: options.map((text, index) => ({ id: optionIds[index], text })),
    correctOptionId: optionIds[correctIndex],
    successMessages: [success, learn].flat().filter(Boolean),
    hint,
    recovery: {
      title: 'Comprobación sobre el terreno',
      actions: recoveryActions || [
        'Volved al elemento que menciona la pregunta.',
        'Comparad las opciones con lo que veis y descartad las que añaden algo que no está allí.'
      ]
    }
  };
}

function expedition(id, place, title, intro, actions, doneMessages) {
  return { id, kind: 'expedition', place, title, intro, actions, doneMessages };
}

function recovery(id, prompt, options, correctIndex, success, failure) {
  return {
    id,
    kind: 'daily-recovery',
    place: 'Oportunidad de rescate',
    prompt,
    options: options.map((text, index) => ({ id: optionIds[index], text })),
    correctOptionId: optionIds[correctIndex],
    successMessages: [success],
    failureMessages: [failure]
  };
}

function route(id, prompt, options, correctIndex, successMessages, effects = {}) {
  return {
    id,
    kind: 'destination',
    place: 'Primera señal de mañana',
    prompt,
    options: options.map((text, index) => ({ id: optionIds[index], text })),
    correctOptionId: optionIds[correctIndex],
    successMessages,
    hint: 'Usad la pista que acaba de aparecer y buscad un único lugar que encaje.',
    recovery: {
      title: 'Pista definitiva de ruta',
      actions: ['Leed otra vez la pista.', 'Descartad los lugares que necesiten añadir datos que no han aparecido.']
    },
    effects
  };
}

function nextStop(id, prompt, options, correctIndex, successMessages, effects = {}) {
  return {
    ...route(id, prompt, options, correctIndex, successMessages, effects),
    place: 'Siguiente señal',
    title: 'Descubrid el siguiente lugar'
  };
}

function firstStop(id, prompt, options, correctIndex, successMessages, effects = {}) {
  return {
    ...route(id, prompt, options, correctIndex, successMessages, effects),
    place: 'Primera parada de hoy',
    title: 'Descubrid la primera parada',
    hint: 'Relacionad todos los mundos de la pista con un único lugar real.'
  };
}

function withOrder(expeditionStep, questions, order = 'expedition-first') {
  if (order === 'question-first') return [questions[0], expeditionStep, questions[1]];
  if (order === 'split') return [questions[0], expeditionStep, questions[1]];
  return [expeditionStep, ...questions];
}

const packs = {};

packs['005-amarante-puente'] = {
  shadowActor: 'Niebla',
  openingMessages: [],
  steps: [
    firstStop(
      'ruta-dia14',
      'El recuerdo reúne África, Far-West, un zoco, piratas, una aldea medieval y zonas de agua en un mismo recinto. ¿Cuál es la primera parada de hoy?',
      ['Magikland', 'Parque da Cidade do Porto', 'Castillo de Guimarães'],
      0,
      [
        'Exacto: Magikland, cerca de Penafiel. Sus seis mundos coinciden con el recuerdo.',
        'Es la única parte de la ruta que puedo reconstruir por ahora. Lo que venga después tendrá que aparecer allí.',
        'Llevad bañador, toalla, protector solar, agua y calzado cómodo. Hay zonas de agua, aunque ninguna prueba obliga a usarlas.'
      ],
      { setFlags: ['ruta_dia14_descubierta'] }
    )
  ]
};

packs['006-magikland-curia'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'La primera parada encaja: Magikland.',
    'Recuerdo seis zonas temáticas y una máquina que graba qué miráis, qué elegís y qué recordáis después. Puede ser de Topoloco.',
    'Hoy no tenéis que escribir explicaciones largas. Mirad, haced y elegid. Yo me encargo de ordenar la historia.'
  ],
  steps: [
    ...withOrder(
      expedition('magikland-expedicion', 'Magikland', 'Expedición de los seis mundos', 'Recorred el parque sin prisa. No hace falta montar en nada que no queráis.', [
        'Localizad tres mundos distintos entre África, Far-West, Souk, Piratas, Aldea Medieval y Mundo da Confusão.',
        'Buscad algo que gire, algo que vaya y vuelva y algo que se desplace.',
        'Elegid un momento que creáis que recordaréis dentro de mucho tiempo.'
      ], [
        'Hecho. Ya sé qué tres movimientos habéis buscado.',
        'Mientras mirabais el parque, en mi pantalla aparecieron tres lecturas: GIRO, IDA Y VUELTA y DESPLAZAMIENTO.',
        'No teníais que encontrar una máquina física. Es un programa escondido dentro de la señal del mapa y está enviando datos a mis aparatos.',
        'En una esquina pone «CAZARRISAS». Topoloco quiere aprender qué convierte un momento en recuerdo. Primero vamos a comprobar qué entiende de los movimientos.'
      ]),
      [
        question('magikland-q1', 'Magikland', '¿Cuál de estos movimientos es una oscilación?', ['Una noria que gira alrededor de su eje', 'Un barco que va y vuelve', 'Un tren que avanza por la vía'], 1, 'Correcto: ir y volver alrededor de una posición es oscilar.', [
          'La rotación gira alrededor de un eje; el desplazamiento cambia de lugar.',
          'Primera rueda del Cazarrisas descifrada. Ahora la pantalla separa movimiento de ruido. Le falta entender por qué un momento se queda en la memoria.'
        ], 'Fijaos en qué movimiento cambia de dirección una y otra vez.'),
        Object.assign(question('magikland-q2', 'Magikland', '¿Qué ayuda más a recordar un momento dentro de varios años?', ['Que sea el más ruidoso', 'Que nos importe o nos sorprenda', 'Que dure exactamente un minuto'], 1, [
          'Correcto. Solemos recordar mejor algo que nos importó, nos sorprendió o vivimos juntos.',
          'La pantalla acaba de escribir «MUESTRA VÁLIDA». El Cazarrisas no buscaba la risa más fuerte: estaba aprendiendo qué momentos se quedan con nosotros.'
        ], [
          { from: 'system', text: 'Una conexión externa solicita acceso: TOPOTINA.' },
          { from: 'topotino', text: 'Quietos. Nadie entra en mi canal diciendo que es familia.' },
          { from: 'topotina', text: 'Hola, Paula y Hugo. Soy Topotina. Y sí, Topotino: soy tu hermana.' },
          { from: 'topotino', text: 'Eso es exactamente lo que diría alguien que intenta colarse.' },
          { from: 'topotina', text: 'Yo construí las doce ventanas del mapa. Tú escondiste las rutas. Separaste la información para que nadie pudiera robarla completa.' },
          { from: 'topotino', text: 'Eso encaja con mis notas. Pero también podrías haberlas leído.' },
          { from: 'topotina', text: 'También ordenas los tornillos por tamaño y guardas una galleta de emergencia detrás del transmisor.' },
          { from: 'topotino', text: 'Lo de los tornillos es sentido común. Lo de la galleta… es información reservada.' },
          { from: 'topotina', text: 'No necesito que me recuerdes para seguir siendo tu hermana. Ayudaré a Paula y Hugo mientras tu memoria vuelve.' },
          { from: 'topotino', text: 'De acuerdo. De momento te llamaré «técnica misteriosa con mis orejas».' },
          { from: 'topotina', text: 'Son nuestras orejas, hermano cabezota.' },
          { from: 'topotino', text: 'La técnica misteriosa ha encontrado una línea de salida del Cazarrisas. Veamos adónde conduce.' }
        ], 'Pensad en vuestro momento elegido: ¿fue importante solo porque había ruido?'), {
          effects: { setFlags: ['maquina_topotina_aclarada_t20a5'] }
        })
      ]
    ),
    Object.assign(question(
      'curia-ruta-descubierta',
      'Nueva coordenada',
      'Topotina ha aislado esta línea del Cazarrisas: «hotel inaugurado en 1922, jardines y termas en el centro de Portugal». ¿En qué localidad está?',
      ['Curia', 'Aveiro', 'Braga'],
      0,
      'Correcto: Curia. Allí tenemos que encontrar el Hotel do Parque.',
      [
        'Ruta guardada. No voy a abrir la misión del hotel todavía.',
        'Cuando el comunicador detecte que habéis llegado a Curia, Topotina comprobará la coordenada y os explicaré qué hay que investigar.'
      ],
      'Buscad la localidad termal vinculada a un Hotel do Parque inaugurado en 1922.'
    ), { effects: { setFlags: ['ruta_curia_descubierta'] } }),
    ...withOrder(
      Object.assign(expedition('curia-expedicion', 'Hotel do Parque · Curia', 'Partes antiguas y partes nuevas', 'Ya estáis en el Hotel do Parque. Esta investigación se hace dentro y con un vistazo al jardín; no necesita buen tiempo.', [
        'Mirad la fachada y localizad dos detalles que parezcan de otra época.',
        'Dentro, con los adultos, buscad algo moderno que permita usar hoy el edificio como hotel.',
        'Desde dentro o el jardín, buscad un reflejo en una ventana, puerta de cristal o espejo.'
      ], [
        'El hotel abrió en 1922. Conserva partes antiguas, como la fachada, la madera o la decoración, y también tiene instalaciones modernas.',
        'Un edificio puede cambiar y seguir mostrando cómo era antes. Topoloco quiere borrar esas diferencias y dejar una sola historia.'
      ]), {
        location: { lat: 40.425204, lng: -8.465911, radiusMeters: 5000, label: 'Curia · Hotel do Parque' },
        arrivalMarker: 'llegada-curia-t20a5',
        arrivalMessages: [
          { from: 'system', text: 'Coordenada de Curia confirmada. Misión disponible.' },
          { from: 'topotina', text: 'El bloqueo ha funcionado: la misión no se ha abierto hasta vuestra llegada.' },
          { from: 'topotino', text: '¿Has puesto tú ese bloqueo en mi comunicador?' },
          { from: 'topotina', text: 'Lo programamos juntos. Tú insististe en llamarlo «candado de patas cortas».' },
          { from: 'topotino', text: 'Nombre excelente. Eso sí parece una prueba bastante seria de parentesco.' },
          { from: 'topotina', text: 'Vas mejorando, hermano. Ahora buscad el Hotel do Parque: la señal apunta a su edificio y sus jardines.' }
        ]
      }),
      [
        question('curia-q1', 'Hotel do Parque · Curia', '¿Qué opción describe mejor el hotel que habéis observado?', ['Todo sigue exactamente como en 1922', 'Conserva partes antiguas y también tiene elementos modernos', 'Es antiguo porque nadie puede entrar'], 1, 'Exacto. Habéis encontrado partes de dos épocas en el mismo edificio.', 'La fachada, la madera o la decoración pueden ser antiguas; la recepción, la iluminación o los servicios permiten usarlo hoy.', 'Comparad una parte antigua con una parte moderna que hayáis visto.'),
        question('curia-q2', 'Hotel do Parque · Curia', 'Al moveros delante de un cristal, cambia lo que aparece en el reflejo. ¿Qué explica mejor el cambio?', ['Ha cambiado vuestra posición respecto al cristal', 'El hotel se ha desplazado', 'La fecha del edificio ha cambiado'], 0, 'Muy bien. Ha cambiado el lugar desde el que miráis.', 'El edificio sigue quieto. El cristal combina lo que tiene delante con el ángulo desde el que lo observáis.', 'Dad dos pasos seguros hacia un lado y mirad de nuevo el mismo cristal.'),
        question('curia-q3', 'Hotel do Parque · Curia', '¿Por qué conviene comparar fachada, interior y uso actual?', ['Porque cada parte aporta información distinta sobre la historia del hotel', 'Porque una fachada cuenta automáticamente todo', 'Porque lo moderno borra lo antiguo'], 0, 'Exacto. Habéis reunido varias pistas del mismo edificio.', [
          'La fecha de 1922 sitúa su apertura, pero los materiales, la decoración, las restauraciones y el uso actual cuentan cómo ha seguido funcionando.',
          { from: 'topotina', text: 'Una fecha sola es una etiqueta. Tres observaciones permiten comprobar si la etiqueta explica de verdad el edificio.' },
          { from: 'topotino', text: 'Yo tengo una etiqueta que dice ORDENADO. No describe bien mi mesa, la verdad.' }
        ], 'Pensad qué información aporta cada zona que no aporta una fecha por sí sola.')
      ]
    ),
    Object.assign(question('bucaco-hoy-ruta', 'Señal urgente de Topotina', 'Topotina ve cerca un bosque con convento, palacio y memoria de una batalla. ¿Qué lugar es?', ['Mata Nacional do Buçaco', 'Bosque de Monsanto', 'Parque da Curia'], 0, 'Exacto: la Mata Nacional do Buçaco.', [
      { from: 'topotina', text: 'He comparado la señal del hotel con el mapa. Buçaco está cerca y su lectura pierde intensidad al caer la tarde.' },
      { from: 'topotino', text: '¿Has cambiado mi ruta?' },
      { from: 'topotina', text: 'He cambiado el orden, hermano. Las pistas siguen siendo las mismas. Tu ruta tenía más rodeos que un cable en tu bolsillo.' },
      { from: 'topotino', text: 'Mis cables siguen un sistema. Un sistema muy enredado.' },
      { from: 'topotina', text: 'Los accesos figuran hasta las 19:00 en horario de verano. Id solo si los adultos confirman que llegáis sin correr.' },
      { from: 'topotino', text: 'No sé qué encontraremos allí. La señal se abrirá cuando lleguéis y entonces veremos qué pide.' }
    ], 'El lugar está junto a Luso y reúne un bosque histórico, un convento y un Palace Hotel.'), { effects: { setFlags: ['ruta_bucaco_adelantada_t20a7'] } }),
    ...withOrder(
      onArrival(expedition('bucaco-expedicion', 'Mata Nacional do Buçaco', 'Expedición breve de las tres épocas', 'No intentéis recorrer toda la mata. Con poco tiempo basta una comparación bien hecha.', [
        'Desde una zona permitida, comparad el exterior del Palace Hotel con el Convento de Santa Cruz.',
        'Buscad una diferencia de material o forma y otra de función: para qué servía cada edificio.',
        'Elegid un elemento construido y un elemento vivo del bosque que compartan el mismo espacio.'
      ], [
        'Hecho. En pocos metros habéis encontrado bosque, retiro carmelita y palacio de épocas y usos distintos.',
        'Los carmelitas comenzaron su retiro aquí en 1628. El palacio llegó mucho después. Estar juntos no significa pertenecer al mismo momento.'
      ]), ARRIVAL_LOCATIONS.bucaco, [
        { from: 'topotina', text: 'Señal de Buçaco confirmada. El cambio de orden ha funcionado.' },
        { from: 'topotino', text: 'Sigo sin recordar haber diseñado rutas contigo.' },
        { from: 'topotina', text: 'Y yo sigo sin recordar que fueras tan dramático. Empate.' },
        { from: 'topotino', text: 'Mirad solo el Palace Hotel, el convento y el bosque. Nada de correr para verlo todo.' }
      ]),
      [
        question('bucaco-q1', 'Mata Nacional do Buçaco', '¿Qué edificio encaja mejor con el retiro de los carmelitas?', ['El Convento de Santa Cruz', 'El Palace Hotel', 'Una estación de tren'], 0, 'Correcto: el Convento de Santa Cruz.', [
          'El convento comenzó en 1628 para los Carmelitas Descalzos. Usaron corcho y piedra pequeña en parte de su decoración para expresar una vida sencilla.',
          { from: 'topotina', text: 'El palacio, en cambio, empezó a construirse en 1888. Hay más de dos siglos entre ambos.' },
          { from: 'topotino', text: 'Yo tardo diez minutos en elegir calcetines y ya me parece una época histórica.' }
        ], 'Comparad el aspecto y la función de los dos edificios.'),
        question('bucaco-q2', 'Mata Nacional do Buçaco', 'El Palace Hotel parece muy antiguo, pero imitó estilos portugueses anteriores. ¿Qué palabra lo explica mejor?', ['Neomanuelino: una recreación posterior del estilo manuelino', 'Romano: construido en tiempos del Imperio romano', 'Prehistórico: anterior a la escritura'], 0, 'Exacto: es neomanuelino.', [
          'Luigi Manini proyectó el edificio. Tomó ideas de monumentos como la Torre de Belém y el Monasterio de los Jerónimos, pero creó una obra nueva entre 1888 y 1907.',
          { from: 'topotina', text: 'Copiar rasgos no convierte el hotel en el monumento original. Acaba de aparecer una imagen de edificios portugueses reducidos.' },
          { from: 'topotino', text: 'Por favor, que nadie haya encogido Portugal de verdad. No encuentro mis gafas de aumento.' }
        ], 'Mirad si el palacio parece medieval o si es una construcción posterior que recrea ese aspecto.')
      ]
    ),
    question('bucaco-q3', 'Mata Nacional do Buçaco', '¿Qué demuestra ver juntos palacio, convento y bosque?', ['Que distintas épocas y usos pueden convivir en un lugar', 'Que todo se construyó el mismo año', 'Que los árboles son decorados'], 0, 'Exacto. El lugar conserva diferencias en vez de convertirse en una sola fecha.', [
          'Topotina ha recuperado otra imagen del mapa: varios monumentos portugueses reducidos al tamaño de los niños.',
          'No es el original de cada edificio. Parece un lugar construido para comparar representaciones.'
        ], 'Buscad la opción que permite que el lugar haya cambiado con el tiempo.'),
    recovery('recuperacion-dia14', 'Para bajar la Sombra: ¿qué hemos comprobado hoy?', ['Magikland mostró cómo nace un recuerdo; el hotel y Buçaco conservan épocas distintas', 'Magikland, el hotel y Buçaco se construyeron en 1922', 'Los tres lugares son parques acuáticos'], 0, 'Sombra reducida. Habéis unido recuerdo, cambio y varias épocas sin borrar sus diferencias.', 'La Sombra sigue igual. Mañana podremos intentarlo con otra pregunta.'),
    route('ruta-dia15', 'La imagen muestra casas regionales y monumentos portugueses reducidos al tamaño de los niños. ¿Qué lugar puede ser?', ['Portugal dos Pequenitos', 'Mini-Europe de Bruselas', 'Castillo de Guimarães'], 0, [
      'Primera señal encontrada: Portugal dos Pequenitos, en Coimbra.',
      'Es lo único que sabemos de mañana. Allí tendremos que averiguar por qué apareció esta imagen y qué pista contiene.',
      'Volved al Hotel do Parque con los adultos. Mañana Portugal dos Pequenitos abre a las 10:00; preparad calzado cómodo, agua y algo para sol. Ahora descansad.'
    ], { setFlags: ['completado_magikland_curia'], water: 'Agua de la Risa', formulaWord: 'RIO' })
  ]
};

packs['007-bucaco-batalha-fatima'] = {
  shadowActor: 'Borrón',
  openingMessages: [
    'Buenos días, Paula y Hugo. Antes de movernos necesito ordenar todo lo que ha ocurrido.',
    'El eclipse dañó casi todos mis recuerdos anteriores. La carta que preparé antes del ataque nos dejó el mapa de doce ventanas y confirmó que sois mis aliados.',
    'En Amarante comprobasteis el puente, su historia y el Tâmega. Después el chat sufrió interferencias. Sospechamos de Topoloco, pero aún no sabemos cómo entró ni si causó mi amnesia.',
    'En Magikland descubristeis el Cazarrisas: un programa firmado por Topoloco que estudia qué miráis y por qué un momento se convierte en recuerdo.',
    { from: 'topotina', text: 'En Magikland entré yo. Recuerdo que Topotino es mi hermano y demostré que construimos el comunicador juntos. Él todavía no me recuerda.' },
    { from: 'topotino', text: 'Es bastante incómodo. Sobre todo porque también ha recordado exactamente cuántos cables tengo sin ordenar.' },
    'En el Hotel do Parque y en Buçaco comprobasteis que un lugar puede conservar partes de épocas distintas. Buçaco dejó una imagen de Portugal representado a escala.',
    { from: 'topotina', text: 'Eso es lo que sabemos. Ignoramos qué quiere hacer Topoloco con los recuerdos, dónde están las demás ventanas y si el contador de Sombra detectará otra intrusión.' },
    'La única pista abierta señala Portugal dos Pequenitos. Cuando lleguéis, veremos qué necesita que comprobéis allí.'
  ],
  steps: [
    ...withOrder(
      onArrival(expedition('portugal-pequenitos-expedicion', 'Portugal dos Pequenitos', 'Expedición de un país representado', 'No estáis viendo todo Portugal ni los edificios originales. Investigad qué conserva y qué cambia esta representación.', [
        'Recorred Casas Regionales y Portugal Monumental; elegid una casa y un monumento.',
        'Buscad dos pistas de escala: puertas, ventanas o alturas comparadas con vuestro cuerpo.',
        'Elegid un detalle que la reproducción conserva y otro que reduce, omite o cambia de lugar.',
        'Localizad el núcleo de Coimbra y comprobad cómo reúne varios edificios en poco espacio.'
      ], [
        'Expedición completada. El parque abrió en 1940 y fue proyectado por Cassiano Branco para enseñar mediante edificios a escala infantil.',
        'Una representación puede conservar formas y detalles, pero reduce tamaños, distancias y parte del contexto. Sirve para comparar; no sustituye al original.'
      ]), ARRIVAL_LOCATIONS.portugalPequenitos, [
        { from: 'topotina', text: 'Coordenada de Coimbra confirmada. Anoche movimos Buçaco; esta es la señal que ocupaba su lugar en el mapa de hoy.' },
        { from: 'topotino', text: 'O sea, ¿Portugal entero se ha encogido?' },
        { from: 'topotina', text: 'No. Es una representación a escala.' },
        { from: 'topotino', text: 'Lo sabía. Estaba comprobando si la técnica misteriosa mantenía la calma.' },
        { from: 'topotina', text: 'Comparad lo que conserva con lo que reduce o cambia. Yo solo vigilaré la señal.' }
      ]),
      [
        question('portugal-pequenitos-q1', 'Portugal dos Pequenitos', '¿Por qué se inauguró este parque-jardín en 1940?', ['Como espacio educativo y de juego pensado para la infancia', 'Para guardar los edificios originales de Portugal', 'Como base secreta de Topoloco'], 0, 'Correcto: nació como espacio educativo y de juego.', [
          'Bissaya Barreto lo ideó junto a una Casa da Criança. El arquitecto Cassiano Branco estudió materiales y rasgos de los lugares antes de representarlos.',
          { from: 'topotina', text: 'Eso es investigar antes de construir. Tomar medidas no es lo mismo que copiar sin explicar.' },
          { from: 'topotino', text: 'Anotado: medir primero. Mi último túnel salió con una curva que nadie había pedido.' }
        ], 'Buscad una opción que explique por qué los edificios están adaptados al tamaño infantil.'),
        question('portugal-pequenitos-q2', 'Portugal dos Pequenitos', '¿Qué estáis viendo al mirar una Torre de Belém pequeña?', ['Una representación construida del monumento', 'La torre original trasladada a Coimbra', 'Una fotografía sin volumen'], 0, 'Correcto: es una representación construida.', 'Conserva rasgos reconocibles, pero cambia la escala y el lugar. El original continúa en Belém y tiene su propia historia y función.', 'Comparad la puerta o las ventanas con vuestro tamaño.'),
        question('portugal-pequenitos-q3', 'Portugal dos Pequenitos', 'Las casas regionales muestran diferencias de norte a sur. ¿Qué ha hecho el parque?', ['Seleccionar rasgos de varias arquitecturas para poder compararlas', 'Demostrar que todas las casas portuguesas son idénticas', 'Trasladar pueblos completos a Coimbra'], 0, 'Exacto: ha seleccionado rasgos para compararlos.', [
          'Los tejados, materiales, colores y formas responden a climas y tradiciones distintas. Una selección ayuda a comparar, pero no contiene todas las casas de una región.',
          { from: 'topotina', text: 'Acaba de reaccionar una miniatura de monasterio. La señal insiste en buscar el edificio real relacionado con una promesa y una victoria.' }
        ], 'Comparad dos casas de regiones distintas y localizad una diferencia visible.'),
        question('portugal-pequenitos-q4', 'Portugal dos Pequenitos', '¿Para qué sirve mejor una maqueta o reproducción honesta?', ['Para comparar formas explicando qué ha reducido o cambiado', 'Para demostrar que ya no hace falta visitar originales', 'Para fingir que todo Portugal cabe realmente allí'], 0, 'Exacto. Enseña si reconoce sus límites.', [
          'Topoloco intenta que una copia parezca la única versión. Vosotros acabáis de demostrar que una representación es útil cuando dice qué conserva y qué transforma.',
          'La miniatura del monasterio ha dejado una palabra: PROMESA. Esa es la siguiente pista; todavía no sabemos qué encontraremos allí.'
        ], 'Elegid la opción que permite aprender sin confundir representación y original.')
      ]
    ),
    nextStop('dia15-pista-batalha', 'La miniatura señala un monasterio real iniciado tras una victoria y una promesa de D. João I. ¿Cuál es?', ['Monasterio de Batalha', 'Palacio da Pena', 'Catedral de Oporto'], 0, [
      'La señal encaja con el Monasterio de Batalha.',
      { from: 'topotino', text: 'No estaba en un plan que yo recuerde. Es la miniatura y la palabra PROMESA las que nos llevan hasta allí.' },
      { from: 'topotina', text: 'He enviado una sola coordenada. La siguiente seguirá cerrada hasta que encontréis qué dejó Topoloco en Batalha.' }
    ]),
    ...withOrder(
      expedition('batalha-expedicion', 'Monasterio de Batalha', 'Expedición de la promesa de piedra', 'Buscad cómo una victoria y una promesa se convirtieron en un edificio trabajado durante generaciones.', [
        'Mirad la fachada y elegid un detalle de piedra que necesite trabajo muy preciso.',
        'Entrad en la iglesia y comparad su altura con la sensación de la fachada.',
        'Visitad la Capela do Fundador o el Claustro Real.',
        'Localizad las Capelas Imperfeitas y comprobad qué parte quedó sin terminar.'
      ], [
        'Expedición completada. Las obras comenzaron en 1388 después de la victoria portuguesa y del voto de D. João I.',
        'Varias generaciones y maestros dejaron estilos distintos. Que las capillas estén inacabadas no las vuelve inútiles ni mudas.'
      ]),
      [
        onArrival(question('batalha-q1', 'Monasterio de Batalha', '¿Por qué se empezó a construir el monasterio?', ['Por una promesa ligada a una victoria', 'Para ocultar un parque acuático', 'Porque las Capelas Imperfeitas ya existían'], 0, 'Exacto. La promesa y la victoria están en el origen del monumento.', 'La construcción comenzó en 1388 y convirtió una decisión histórica en un lugar de memoria.', 'Pensad qué hecho y qué promesa explican su nombre y su origen.'), ARRIVAL_LOCATIONS.batalha, [
          { from: 'topotino', text: 'En Coimbra habéis visto un monasterio representado a escala. La señal nos lleva ahora ante un monasterio real nacido de una promesa.' },
          { from: 'topotino', text: 'Ahora sí: estáis ante el Monasterio de Batalha. Comparad lo que una reproducción puede mostrar con los materiales, el tamaño y el espacio del edificio real.' }
        ]),
        question('batalha-q2', 'Monasterio de Batalha', '¿Qué enseñan las Capelas Imperfeitas?', ['Que una obra incompleta también puede tener valor e historia', 'Que nunca se comenzó a trabajar en ellas', 'Que todo el monasterio está sin techo'], 0, 'Muy bien. Incompleto no significa vacío.', [
          'Las capillas se pensaron como panteón de la dinastía de Avis. Varios maestros trabajaron durante generaciones y dejaron estilos distintos.',
          { from: 'topotina', text: 'Borrón había marcado INÚTIL sobre la parte abierta. Paula y Hugo acaban de demostrar que inacabado no significa sin historia.' },
          { from: 'topotino', text: 'Mi madriguera lleva años inacabada. Por fin una defensa académica impecable.' },
          'Entre las líneas borradas aparece otra pista: un lugar enorme cuyo centro es una capilla muy pequeña.'
        ], 'Mirad qué partes existen aunque el conjunto no se terminara como estaba previsto.')
      ],
      'question-first'
    ),
    nextStop('dia15-pista-fatima', 'La nueva pista habla de una gran explanada cuyo corazón es una capilla pequeña. ¿Qué lugar encaja?', ['Santuario de Fátima', 'Estadio de Coimbra', 'Castillo de Leiria'], 0, [
      'La pista señala el Santuario de Fátima.',
      { from: 'topotino', text: 'Batalha nos ha enseñado que el tamaño y el acabado no deciden por sí solos el valor. La señal quiere que comprobemos ahora si el centro de un lugar puede ser lo más pequeño.' },
      { from: 'topotina', text: 'Coordenada enviada. No hay ninguna parada más visible detrás.' }
    ]),
    ...withOrder(
      onArrival(expedition('fatima-expedicion', 'Fátima', 'Expedición de la escala', 'Aquí compararemos un lugar pequeño con espacios capaces de reunir a muchísimas personas.', [
        'Localizad la Capelinha das Aparições.',
        'Cruzad una parte de la explanada y mirad la distancia entre sus extremos.',
        'Comparad desde fuera la Basílica do Rosário y la Basílica da Santíssima Trindade.',
        'Buscad una señal que muestre que llegan personas de lugares distintos.'
      ], [
        'Hecho. La Capelinha es pequeña, pero ocupa el centro simbólico del conjunto.',
        'La importancia de un lugar no se mide solo en metros. Se construye también con lo que una comunidad recuerda y hace allí.'
      ]), ARRIVAL_LOCATIONS.fatima, [
        { from: 'topotino', text: 'Batalha ha demostrado que algo inacabado puede importar. La siguiente señal pregunta si algo pequeño también puede ser el centro de un lugar enorme.' },
        { from: 'topotino', text: 'Habéis llegado a Fátima. Buscad primero la Capelinha y después comparadla con la explanada.' }
      ]),
      [
        question('fatima-q1', 'Fátima', '¿Qué lugar es más pequeño pero central en el relato de las apariciones?', ['La Capelinha', 'Toda la explanada', 'El aparcamiento'], 0, 'Correcto: la Capelinha.', [
          'Se construyó en 1919 en el lugar vinculado a cinco de las seis apariciones de 1917. Fue destruida con explosivos en 1922 y reconstruida en 1923.',
          { from: 'topotina', text: 'Pequeña, destruida y reconstruida. Tres datos que Topoloco habría intentado convertir en una sola etiqueta.' }
        ], 'Comparad el tamaño de la capilla con el espacio que la rodea.'),
        question('fatima-q2', 'Fátima', '¿Para qué sirve una explanada tan grande?', ['Para conectar y reunir a muchas personas', 'Para esconder la Capelinha', 'Para demostrar que una basílica es más verdadera'], 0, 'Sí. Organiza movimientos y encuentros de una comunidad numerosa.', [
          'El recinto une la Basílica do Rosário y la Basílica da Santíssima Trindade y permite recibir grandes asambleas de peregrinos.',
          'El tamaño responde a una función. No demuestra que una creencia sea más verdadera ni sustituye la importancia de la Capelinha.'
        ], 'Mirad cómo circulan las personas y qué edificios conecta.')
      ]
    ),
    recovery('recuperacion-dia15', '¿Qué idea derrota mejor la frase «solo importa lo grande, original y terminado»?', ['Una reproducción honesta, una capilla inacabada y la Capelinha pueden enseñar o conservar memoria', 'Todos los lugares importantes son enormes', 'Una copia siempre sustituye al original'], 0, 'Sombra retirada. Habéis distinguido escala, original, función e importancia.', 'Borrón conserva una mancha, pero ya sabemos reconocer su truco.'),
    route('ruta-dia16', 'La siguiente ventana muestra pasos enormes impresos en roca, pero ningún hueso. ¿Cuál es la primera señal de mañana?', ['Pegadas de Dinossáurios', 'Museu do Côa', 'Parque de Serralves'], 0, [
      'Primera señal encontrada: Pegadas de Dinossáurios.',
      'Solo sabemos que tendremos que reconstruir el movimiento de un animal ausente por las marcas que dejó.',
      'Llevad calzado con buen agarre, agua y protección solar. Lo demás tendrá que aparecer allí. Ahora descansad.'
    ], { setFlags: ['completado_bucaco_batalha_fatima'], water: 'Agua de la Promesa' })
  ]
};

packs['008-huellas-mira-obidos'] = {
  shadowActor: 'Borrón',
  openingMessages: [
    'Buenos días. La única señal abierta muestra huellas enormes impresas en roca, pero ningún hueso.',
    'Borrón intenta invertir rastros y cambiar etiquetas. Nosotros distinguiremos lo que vemos de lo que deducimos.'
  ],
  steps: [
    ...withOrder(
      expedition('pegadas-expedicion', 'Pegadas de Dinossáurios', 'Expedición de las huellas gigantes', 'Las huellas son icnofósiles: fósiles de actividad, no huesos del animal.', [
        'Seguid el circuito hasta ver una pista de saurópodo desde dos puntos.',
        'Buscad huellas delanteras y traseras o diferencias de tamaño dentro del rastro.',
        'Usad un panel para localizar la antigüedad aproximada del yacimiento.',
        'Elegid algo que las huellas permiten saber y algo que no pueden contar.'
      ], [
        'Expedición completada. La losa conserva cerca de veinte pistas y una de ellas alcanza 147 metros.',
        'Las marcas tienen unos 175 millones de años. No vemos al animal, pero sí parte de su movimiento.'
      ]),
      [
        question('pegadas-q1', 'Pegadas de Dinossáurios', '¿Qué es una huella fosilizada?', ['Un fósil de la actividad del animal', 'Un hueso del pie', 'Una escultura moderna'], 0, 'Correcto. Conserva una acción: pisar.', 'Por eso se llama icnofósil. Informa del movimiento sin conservar el cuerpo.', 'Pensad si estáis viendo una parte del cuerpo o la marca que produjo.'),
        question('pegadas-q2', 'Pegadas de Dinossáurios', '¿Qué NO puede asegurar una pista por sí sola?', ['La dirección aproximada del movimiento', 'Que el animal apoyó allí los pies', 'El color exacto de su piel'], 2, 'Exacto. La piel no dejó esa información en las pisadas.', 'Una buena investigación dice también qué desconoce. Borrón gana cuando una deducción se presenta como observación.', 'Buscad qué dato no dejó ninguna marca en la roca.')
      ]
    ),
    nextStop('dia16-pista-mira', 'Las huellas conservan una acción en la superficie. La nueva señal muestra agua dejando marcas muy lentamente bajo tierra. ¿Adónde conduce?', ['Grutas de Mira de Aire', 'Grutas de Santo António', 'Mina de Sal-Gema de Loulé'], 0, [
      'La señal conduce a las Grutas de Mira de Aire.',
      'Las huellas guardaron un paso; ahora investigaremos un rastro que se forma gota a gota. No sabemos qué aparecerá después.',
      { from: 'topotina', text: 'La transmisión lleva una firma aliada: GOTAS. Está incompleta. Solo podré verificarla cuando lleguéis.' },
      { from: 'topotino', text: '¿Gotas? No recuerdo a nadie con nombre de lluvia. No voy a fingir: esperaremos a comprobar quién es.' }
    ]),
    ...withOrder(
      expedition('mira-expedicion', 'Grutas de Mira de Aire', 'Expedición del agua invisible', 'Gotas nos pide observar el trabajo del agua sin tocar las formaciones.', [
        'Localizad una estalactita que baje del techo y una estalagmita que suba del suelo.',
        'Buscad una columna o un punto donde ambas formas casi se unan.',
        'Observad un lago, curso o zona húmeda del recorrido.',
        'Comparad una formación fina con otra más ancha.'
      ], [
        { from: 'gotas', text: 'Hecho. El agua de lluvia absorbe dióxido de carbono, entra por grietas y puede disolver lentamente parte de la roca caliza.' },
        { from: 'gotas', text: 'Cuando el agua pierde ese gas, deja carbonato cálcico. Repetido gota a gota, el depósito va construyendo las formaciones.' },
        { from: 'topotino', text: 'O sea: primero transporta material y después lo deja. Gotas es pequeño, pero sus explicaciones no vienen diluidas.' }
      ]),
      [
        onArrival(question('mira-q1', 'Grutas de Mira de Aire', '¿Cuál crece desde el techo?', ['La estalactita', 'La estalagmita', 'El lago'], 0, 'Correcto: la estalactita cuelga del techo.', 'La estalagmita crece desde el suelo por las gotas que caen. Si llegan a unirse, pueden formar una columna.', 'Recordad la forma que habéis visto colgar.'), ARRIVAL_LOCATIONS.mira, [
          { from: 'topotino', text: 'Las huellas conservan un paso sobre la superficie. La nueva pista apunta a marcas creadas gota a gota bajo tierra.' },
          { from: 'system', text: 'Gotas se ha unido al canal.' },
          { from: 'gotas', text: '¡Paula, Hugo! Soy Gotas. Conozco estas cuevas y recuerdo a Topotino, aunque él tenga ahora la memoria como un colador.' },
          { from: 'topotino', text: 'Objeción: mis coladores están perfectamente archivados. A ti, en cambio, no te recuerdo.' },
          { from: 'topotina', text: 'Firma verificada. Es Gotas, nuestro enlace en Mira de Aire. Su clave coincide con la red anterior al eclipse.' },
          { from: 'gotas', text: 'Yo explicaré lo que hace el agua después de que observéis. No responderé por vosotros. Primero mirad techo y suelo.' },
          { from: 'topotino', text: 'Un experto que no hace los deberes ajenos. Estupendo: ya me cae bien por segunda vez.' }
        ]),
        question('mira-q2', 'Grutas de Mira de Aire', '¿Por qué no deben tocarse las formaciones?', ['Porque son decorados de papel', 'Porque crecen muy despacio y podemos alterarlas', 'Porque se mueven solas'], 1, [
          { from: 'gotas', text: 'Muy bien. El proceso es lentísimo y delicado.' }
        ], [
          { from: 'gotas', text: 'La grasa y la suciedad de las manos pueden alterar la superficie donde debería seguir depositándose el mineral.' },
          { from: 'topotino', text: 'Regla clara: ojos curiosos, manos quietas. Esa sí puedo recordarla.' }
        ], 'Pensad cuánto tarda una gota en dejar una capa diminuta.')
      ],
      'question-first'
    ),
    nextStop('dia16-pista-obidos', 'Borrón ha dejado la silueta de una puerta fortificada y una calle dentro de murallas. ¿Qué lugar encaja?', ['Óbidos', 'Guimarães', 'Marvão'], 0, [
      'La silueta encaja con Óbidos.',
      'En la cueva habéis leído el tiempo en la roca. Allí comprobaremos si Borrón también mezcla lo que está escrito con lo que imagina.'
    ]),
    ...withOrder(
      onArrival(expedition('obidos-expedicion', 'Óbidos', 'Expedición de la ciudad escrita', 'En Óbidos, Borrón mezcla soportes reales con interpretaciones apresuradas.', [
        'Entrad por Porta da Vila y observad qué protege y qué anuncia.',
        'Recorred Rua Direita hasta localizar una iglesia, tienda o librería dentro de un edificio antiguo.',
        'Mirad la muralla y el castillo desde un lugar seguro; no caminéis por zonas que os parezcan peligrosas.',
        'Elegid un detalle medieval y otro que muestre un uso actual.'
      ], [
        'Expedición cerrada. Óbidos conserva muralla, puertas y trazado, pero también viviendas, comercio y cultura actuales.',
        'Una ciudad histórica no es una maqueta inmóvil. Sus usos nuevos escriben sin borrar por completo lo anterior.'
      ]), ARRIVAL_LOCATIONS.obidos, [
        { from: 'topotino', text: 'En la gruta leísteis el tiempo en la roca. Borrón ha llevado la misma trampa a una ciudad: mezcla lo que está escrito con lo que él quiere que creamos.' },
        { from: 'topotino', text: 'Habéis llegado a Óbidos. Ahora sí: muralla, calles y textos nos dirán qué es evidencia y qué es interpretación.' }
      ]),
      [
        question('obidos-q1', 'Óbidos', '¿Qué demuestra mejor que Óbidos sigue siendo una ciudad viva?', ['Que dentro de edificios antiguos hay usos actuales', 'Que nadie puede entrar', 'Que todas las calles están vacías'], 0, 'Exacto. El uso actual convive con la estructura heredada.', 'Vivir en un lugar histórico implica adaptar, cuidar y reinterpretar, no congelarlo.', 'Pensad en la tienda, iglesia o librería que habéis localizado.'),
        question('obidos-q2', 'Óbidos', '¿Cuál es una observación y no una interpretación?', ['La puerta tiene azulejos y un paso estrecho', 'La puerta parece enfadada', 'La muralla quiere esconder secretos'], 0, 'Correcto. Describe rasgos que otra persona puede comprobar.', 'Las interpretaciones pueden ser divertidas, pero deben distinguirse de la evidencia visible.', 'Elegid la frase que una fotografía también podría comprobar.')
      ]
    ),
    recovery('recuperacion-dia16', '¿Qué une huellas, cueva y ciudad?', ['Permiten reconstruir procesos mediante rastros visibles', 'Fueron creadas por dinosaurios', 'Están todas bajo tierra'], 0, 'Una Sombra menos. Borrón no puede borrar una relación que habéis comprobado tres veces.', 'La mancha sigue en el mapa, pero ya no puede cambiar el sentido de la ruta.'),
    route('ruta-dia17', 'La próxima señal muestra dinosaurios completos por fuera, fósiles y científicos trabajando por dentro. ¿Cuál es la primera parada?', ['Dino Parque Lourinhã', 'Museu da Lourinhã', 'Castillo de Leiria'], 0, [
      'Primera señal encontrada: Dino Parque Lourinhã.',
      'Allí separaremos modelo, fósil e investigación. Lo que venga después tendrá que aparecer durante esa investigación.',
      'Preparad calzado cómodo, agua y protector solar para el recorrido exterior. Descansad.'
    ], { setFlags: ['completado_huellas_mira_obidos'], water: 'Agua del Tiempo Profundo' })
  ]
};

packs['009-dinoparque-lisboa'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. La señal abierta nos lleva únicamente al Dino Parque.',
    'En Portugal dos Pequenitos aprendisteis que una reproducción debe reconocer qué cambia. Hoy añadiremos fósiles y trabajo científico a esa comparación.',
    'Topoloco ha preparado una reconstrucción perfecta. Quiere que olvidemos preguntar qué parte es fósil, qué parte es modelo y qué parte es hipótesis.'
  ],
  steps: [
    ...withOrder(
      expedition('dinoparque-expedicion', 'Dino Parque Lourinhã', 'Expedición de original, modelo y estudio', 'Recorred una parte exterior y después el museo o laboratorio.', [
        'Elegid un modelo exterior y observad tamaño, postura y piel representada.',
        'Buscad una pieza fósil original o identificada como réplica.',
        'Localizad una herramienta, mesa o explicación del trabajo científico.',
        'Comparad qué información aporta cada uno de los tres.'
      ], [
        'Expedición completada. Un modelo permite imaginar el conjunto; un fósil conserva evidencia material; el laboratorio muestra cómo se estudia.',
        'Ninguno basta solo. La reconstrucción más espectacular sigue necesitando pruebas.'
      ]),
      [
        question('dinoparque-q1', 'Dino Parque Lourinhã', '¿Cuál es evidencia material del pasado?', ['La pieza fósil', 'El color elegido para un modelo', 'La música del parque'], 0, 'Correcto: el fósil.', 'En Coimbra comparasteis reproducción y original. Aquí el fósil añade evidencia material; el modelo combina esa evidencia con decisiones de reconstrucción.', 'Pensad cuál de los elementos no fue fabricado para la visita.'),
        question('dinoparque-q2', 'Dino Parque Lourinhã', 'Si dos modelos muestran colores distintos, ¿qué conclusión es más honesta?', ['Uno de los colores debe ser una mentira', 'El color puede ser una hipótesis si no hay evidencia suficiente', 'Los dinosaurios cambiaban de color cada hora'], 1, 'Exacto. Una reconstrucción debe mostrar dónde empieza la hipótesis.', 'La ciencia puede proponer alternativas y corregirlas. El museo de Topoloco quiere esconder esas dudas.', '¿Habéis encontrado una prueba directa del color en el fósil elegido?')
      ]
    ),
    nextStop('dia17-pista-lisboa', 'El rótulo de Topoloco mezcla una reconstrucción con una cuadrícula de calles y dos grandes plazas. ¿Qué ciudad debemos comprobar?', ['Lisboa', 'Oporto', 'Setúbal'], 0, [
      'La pista señala Lisboa.',
      'El Dino Parque nos ha obligado a separar original, modelo e interpretación. En Lisboa buscaremos una reconstrucción a escala de ciudad, no sabemos aún qué dejará allí Topoloco.'
    ]),
    ...withOrder(
      expedition('lisboa-llegada-expedicion', 'Lisboa · Baixa y Rossio', 'Expedición de orientación', 'Al llegar, leeremos la ciudad sin convertir el paseo en otro examen largo.', [
        'Localizad Restauradores o Rossio.',
        'Seguid una calle recta de la Baixa y observad cómo conecta dos plazas.',
        'Buscad un edificio antiguo con un uso actual.',
        'Desde un punto seguro, identificad una subida que conduzca hacia otra parte de la ciudad.'
      ], [
        'Ya está. Las calles rectas de la Baixa ayudan a orientarse y pertenecen a una reconstrucción posterior al terremoto de 1755.',
        'Topoloco acaba de dejar un rótulo: «Museo Topoloco de los Recuerdos Robados». Ya sabemos qué pretende construir.'
      ]),
      [
        onArrival(question('lisboa-llegada-q1', 'Lisboa · Baixa y Rossio', '¿Qué ayuda más a orientarse en la Baixa?', ['La relación entre calles rectas y plazas', 'Cerrar los ojos', 'Seguir siempre la calle más empinada'], 0, 'Correcto. La estructura urbana crea conexiones legibles.', 'La Baixa fue reconstruida con una trama regular. Mañana compararemos esa organización con otros sistemas.', 'Mirad qué calles permiten ver o alcanzar otra plaza.'), ARRIVAL_LOCATIONS.rossio, [
          { from: 'topotino', text: 'En Dino Parque separasteis fósil, réplica y reconstrucción. La señal nos trae ahora a una ciudad reconstruida que también conserva pistas de lo anterior.' },
          { from: 'topotino', text: 'Ya estáis en Rossio. Antes de investigar Lisboa, vamos a aprender a orientarnos en su trazado real.' }
        ]),
        question('lisboa-llegada-q2', 'Lisboa · Baixa y Rossio', '¿Qué revela un edificio antiguo con uso actual?', ['Que una ciudad puede cambiar sin borrar todas sus capas', 'Que el edificio nunca cambió', 'Que el pasado ya no importa'], 0, 'Sí. Uso nuevo y huella antigua pueden convivir.', 'Esta idea contradice el museo de una sola versión que prepara Topoloco.', 'Comparad lo que conserva el edificio con lo que se hace hoy dentro.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia17', '¿Qué error comete el museo de Topoloco?', ['Presentar una reconstrucción como si fuera la única verdad', 'Conservar fósiles con información', 'Explicar cuándo existe una duda'], 0, 'Interferencia retirada. Una historia honesta puede contener hipótesis y correcciones.', 'Topoloco conserva ventaja hoy, pero ya conocemos el nombre de su plan.'),
    route('ruta-dia18', 'El rótulo del museo esconde un esquema de experimentos donde se cambia una sola cosa cada vez. ¿Cuál es la primera señal de mañana?', ['Pavilhão do Conhecimento', 'Museu da Ciência de Coimbra', 'Planetário do Porto'], 0, [
      'Primera señal encontrada: Pavilhão do Conhecimento.',
      'Allí comprobaremos cómo se distingue una causa de una simple coincidencia. No hay otra parada visible todavía.',
      'Preparad calzado cómodo y una prenda ligera para interiores. Descansad.'
    ], { setFlags: ['completado_dinoparque_lisboa'] })
  ]
};

packs['010-lisboa-ciencia-oceanario'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días. La señal del museo apunta primero al Pavilhão do Conhecimento.',
    'Topoloco guarda recuerdos como objetos separados. Nosotros vamos a demostrar que un cambio en una parte puede afectar a toda una red.'
  ],
  steps: [
    ...withOrder(
      expedition('pavilhao-expedicion', 'Pavilhão do Conhecimento', 'Expedición de causa y efecto', 'Elegid módulos que podáis probar con seguridad y respetad sus instrucciones.', [
        'Probad dos módulos situados en zonas distintas.',
        'Antes del segundo intento, predecid qué cambiará si modificáis una acción.',
        'Repetid un módulo cambiando solo una cosa.',
        'Elegid el resultado que más os sorprendió.'
      ], [
        'Expedición completada. Habéis cambiado una variable y observado su efecto.',
        'Eso permite distinguir coincidencia de causa. Topoloco preferiría quedarse solo con el resultado bonito.'
      ]),
      [
        question('pavilhao-q1', 'Pavilhão do Conhecimento', '¿Cómo se comprueba mejor qué causó un cambio?', ['Cambiando una cosa cada vez', 'Cambiándolo todo a la vez', 'Repitiendo la explicación sin probar'], 0, 'Exacto. Así podemos relacionar causa y efecto.', 'Controlar una variable no hace el experimento aburrido: hace que la conclusión sea más fuerte.', 'Recordad qué hicisteis distinto entre dos intentos.'),
        question('pavilhao-q2', 'Pavilhão do Conhecimento', 'Si la predicción falla, ¿qué conviene hacer?', ['Ocultarla', 'Compararla con el resultado y corregir la idea', 'Culpar al módulo'], 1, 'Muy bien. Corregir es parte de investigar.', 'Una predicción equivocada puede enseñar más que un acierto casual. La máquina de Topoloco no sabe presumir de una corrección.', 'Pensad qué información nueva os dio el resultado real.')
      ]
    ),
    nextStop('dia18-pista-oceanario', 'Al repetir el experimento aparece un círculo azul rodeado de especies marinas y una letra V. ¿Qué lugar encaja?', ['Oceanário de Lisboa', 'Aquário Vasco da Gama', 'Sea Life Porto'], 0, [
      'La señal conduce al Oceanário de Lisboa.',
      { from: 'topotino', text: 'La letra V podría pertenecer a un aliado. No sé quién es todavía. Tendremos que comprobar la transmisión al llegar.' },
      { from: 'topotina', text: 'Una coordenada, hermano. Ni una más.' }
    ]),
    ...withOrder(
      expedition('oceanario-expedicion', 'Oceanário de Lisboa', 'Expedición de la red del océano', 'Vasco nos acompaña como aliado, pero las relaciones debéis encontrarlas vosotros.', [
        'Rodead el gran tanque central y observadlo desde dos ventanas distintas.',
        'Elegid tres especies que ocupen zonas o profundidades diferentes.',
        'Buscad una relación de alimento, refugio, limpieza o espacio entre seres vivos.',
        'Localizad un mensaje concreto de conservación.'
      ], [
        'Hecho. El tanque parece uno desde muchos ángulos porque representa un océano conectado.',
        'Vasco llama a esto mirar relaciones, no coleccionar nombres. El 8 de junio celebra simbólicamente su cumpleaños y el Día Mundial de los Océanos.'
      ]),
      [
        onArrival(question('oceanario-q1', 'Oceanário de Lisboa', '¿Por qué importa observar el tanque desde varios lados?', ['Porque cada ventana muestra relaciones y zonas distintas del mismo sistema', 'Porque los animales cambian de especie', 'Porque una ventana siempre miente'], 0, 'Correcto. Cambia la perspectiva, no el océano.', 'Las distintas vistas se complementan. Esto se parece a Paula y Hugo recordando el mismo viaje de maneras diferentes.', 'Comparad qué aparecía y desaparecía al cambiar de ventana.'), ARRIVAL_LOCATIONS.oceanario, [
          { from: 'topotino', text: 'Me ha llegado un mensaje de Vasco, el explorador del Oceanário. Dice que vigilaba para nosotros la parte marina de la red.' },
          { from: 'topotino', text: 'No lo recuerdo todavía, pero no pretende resolver la prueba: nos indica dónde mirar. Empezad por observar el gran tanque desde varios lados.' }
        ]),
        question('oceanario-q2', 'Oceanário de Lisboa', '¿Cuál cumple mejor el Protocolo Azul?', ['Observar sin molestar y aceptar que un animal puede no aparecer', 'Perseguirlo hasta conseguir una foto', 'Alimentarlo para que se acerque'], 0, 'Exacto. Observar no da derecho a intervenir.', 'Vasco nos pide distinguir «no lo vimos» de «no existe» y proteger sin convertir al animal en propiedad.', 'Pensad qué opción respeta la decisión y el espacio del animal.')
      ],
      'question-first'
    ),
    nextStop('dia18-pista-tejo', 'Vasco ha marcado una salida: «El océano del tanque continúa fuera del edificio por un gran río». ¿Dónde comprobamos esa conexión?', ['Ribera del Tajo', 'Castillo de Óbidos', 'Grutas de Mira de Aire'], 0, [
      'La pista señala la ribera del Tajo.',
      'Dentro habéis visto una representación cuidada de relaciones marinas. Ahora comprobaremos cómo Lisboa se conecta con agua real.'
    ]),
    ...withOrder(
      onArrival(expedition('tejo-expedicion', 'Ribera del Tajo', 'Expedición del río que llega al océano', 'Al salir, conectaremos el mundo interior del Oceanário con el paisaje real.', [
        'Mirad la anchura del Tajo desde la ribera.',
        'Buscad una embarcación o infraestructura relacionada con el agua.',
        'Localizad una señal de marea, viento o corriente.',
        'Comparad el agua real con el tanque central sin acercaros al borde.'
      ], [
        'Expedición terminada. El Tajo no acaba en Lisboa: se abre hacia el Atlántico.',
        'La sexta ventana confirma que las doce marcas del mapa son nodos de una red, no doce objetos aislados.'
      ]), ARRIVAL_LOCATIONS.tejo, [
        { from: 'topotino', text: 'Vasco avisa: dentro habéis visto una red marina; ahora toca comprobar dónde conecta esa historia con agua real.' },
        { from: 'topotino', text: 'Estáis junto al Tajo. Seguid el río con la vista y buscad cómo la ciudad se relaciona con él.' }
      ]),
      [
        question('tejo-q1', 'Ribera del Tajo', '¿Qué conecta mejor el Tajo con el Oceanário?', ['Ambos permiten estudiar relaciones del agua con seres vivos y personas', 'Ambos tienen paredes de cristal', 'Ambos son piscinas'], 0, 'Sí. Uno es paisaje real y otro una representación cuidada, pero ambos muestran conexiones.', 'Las representaciones ayudan a observar; el río recuerda que el sistema continúa fuera del edificio.', 'Buscad una relación, no una semejanza de forma.'),
        question('tejo-q2', 'Ribera del Tajo', 'Si cambia la marea, ¿qué demuestra?', ['Que el borde entre río y océano es dinámico', 'Que Lisboa se mueve de sitio', 'Que el tanque controla el Tajo'], 0, 'Correcto. La relación cambia con el tiempo.', 'Una red viva no permanece idéntica. Topoloco quiere fijar una versión única y por eso siempre pierde información.', 'Fijaos en marcas, movimiento del agua o embarcaciones.')
      ]
    ),
    recovery('recuperacion-dia18', '¿Qué palabra une experimentos, especies y Tajo?', ['Relación', 'Colección', 'Inmovilidad'], 0, 'Sombra retirada. Las doce ventanas empiezan a comportarse como una red.', 'Niebla conserva terreno, pero ya no puede presentar los nodos como piezas separadas.'),
    route('ruta-dia19', 'La nueva ventana muestra una fortaleza sobre una colina desde la que Lisboa se ve como un mapa. ¿Cuál es la primera parada?', ['Castelo de São Jorge', 'Oceanário', 'Dino Parque'], 0, [
      'Primera señal encontrada: Castelo de São Jorge.',
      'Desde allí buscaremos qué partes de la ciudad permite entender una vista alta y qué detalles oculta. El resto sigue cerrado.',
      'Llevad calzado cómodo para cuestas, agua y protector solar. Descansad.'
    ], { setFlags: ['completado_lisboa_ciencia_oceanario'], water: 'Agua del Océano Único' })
  ]
};

packs['011-lisboa-historia-belem'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. La única señal abierta nos lleva al Castelo de São Jorge.',
    'Topoloco dice que conservar significa no cambiar. Lisboa va a desmontar esa idea calle a calle.'
  ],
  steps: [
    ...withOrder(
      expedition('castelo-expedicion', 'Castelo de São Jorge', 'Expedición de la colina vigilante', 'Subid con los adultos y movedos solo por zonas permitidas.', [
        'Buscad una vista que incluya río, tejados y una pendiente.',
        'Localizad una muralla, torre o paso estrecho.',
        'Encontrad una capa arqueológica o explicación de un uso anterior.',
        'Si aparece un pavo real, observadlo sin alimentarlo: Topotino dice que exagera sus hazañas.'
      ], [
        'Expedición completada. La altura ayuda a vigilar y defender, pero también dificulta subir y abastecerse.',
        'El castillo reúne ocupaciones y transformaciones. Ninguna capa cuenta sola toda la historia.'
      ]),
      [
        question('castelo-q1', 'Castelo de São Jorge', '¿Qué ventaja ofrece la colina para una fortificación?', ['Ver accesos y movimientos desde lejos', 'Ocultar por completo el río', 'Evitar todas las pendientes'], 0, 'Correcto. La altura amplía la vista.', 'También tiene costes: subir materiales y personas resulta más difícil. Una posición estratégica siempre combina ventajas y límites.', 'Usad la vista real: ¿qué podéis observar desde arriba?'),
        question('castelo-q2', 'Castelo de São Jorge', '¿Qué demuestra una capa arqueológica bajo un uso posterior?', ['Que el lugar tuvo más de una historia', 'Que todo se construyó el mismo día', 'Que lo más antiguo dejó de existir por completo'], 0, 'Exacto. Una capa puede permanecer bajo otra.', 'Conservar vestigios permite corregir relatos y comprender cambios de ocupación.', 'Pensad qué parte visible pertenece a un momento distinto.')
      ]
    ),
    nextStop('dia19-pista-alfama', 'Desde el castillo, la señal baja hacia calles estrechas, curvas y pendientes antes de llegar a una cuadrícula recta. ¿Dónde debemos empezar esa comparación?', ['Alfama', 'Graça', 'Parque das Nações'], 0, [
      'La señal baja hacia Alfama.',
      'Desde arriba Lisboa parecía un mapa. Ahora necesitamos comprobar a pie lo que esa vista ocultaba.'
    ]),
    ...withOrder(
      expedition('alfama-baixa-expedicion', 'Alfama y Baixa', 'Expedición de dos trazados', 'Bajad con calma y comparad cómo se mueve una persona por cada barrio.', [
        'En Alfama, seguid una calle estrecha o con curva y observad qué oculta.',
        'Buscad un mirador o cruce desde el que aparezca el Tajo.',
        'En Baixa, recorred una calle recta entre dos plazas.',
        'Comparad orientación, pendiente y anchura de ambos trazados.'
      ], [
        'Hecho. Alfama conserva un trazado más irregular; la Baixa fue reconstruida con calles más regulares después de 1755.',
        'La ciudad sobrevivió cambiando. Topoloco confunde supervivencia con inmovilidad.'
      ]),
      [
        onArrival(question('alfama-q1', 'Alfama y Baixa', '¿En qué trazado es más fácil ver de lejos el final de una calle?', ['En la cuadrícula recta de Baixa', 'En cualquier curva de Alfama', 'En una escalera cerrada'], 0, 'Correcto. La línea recta facilita orientación y perspectiva.', 'El trazado irregular puede adaptarse a pendientes y crear recorridos distintos. No hay una forma única de ciudad.', 'Recordad en cuál de los dos barrios veíais otra plaza al fondo.'), ARRIVAL_LOCATIONS.alfama, [
          { from: 'topotino', text: 'Desde el castillo habéis visto Lisboa como un mapa. Ahora bajaremos a comprobar lo que esa vista alta no podía enseñar.' },
          { from: 'topotino', text: 'Ya estáis en Alfama. Comparad sus curvas y pendientes con las calles rectas de la Baixa.' }
        ]),
        question('alfama-q2', 'Alfama y Baixa', '¿Qué prueba mejor que Lisboa se reconstruyó?', ['La diferencia entre trazados y edificios de distintas épocas', 'Que todas las calles son iguales', 'Que el terremoto no cambió nada'], 0, 'Sí. La diferencia visible conserva el cambio.', 'Reconstruir no borra necesariamente lo anterior: puede dejar contrastes que ayudan a entender la catástrofe y la respuesta.', 'Comparad, no busquéis una sola calle aislada.')
      ],
      'question-first'
    ),
    nextStop('dia19-pista-belem', 'La cuadrícula de la Baixa deja una marca que sigue el Tajo hacia una torre defensiva y monumentos relacionados con viajes. ¿Qué zona es?', ['Belém', 'Alfama', 'Rossio'], 0, [
      'La señal continúa hacia Belém.',
      'Lisboa cambió después de 1755. En la ribera comprobaremos cómo monumentos de épocas y funciones distintas cuentan relaciones con el río.'
    ]),
    ...withOrder(
      onArrival(expedition('belem-expedicion', 'Belém', 'Expedición de piedra, río y viajes', 'Recorred la ribera sin necesidad de entrar en todos los edificios.', [
        'Observad el Mosteiro dos Jerónimos y elegid un detalle de piedra trabajado.',
        'Localizad el Padrão dos Descobrimentos y mirad hacia dónde se orienta.',
        'Llegad a un punto seguro desde el que se vea la Torre de Belém y el Tajo.',
        'Buscad una diferencia entre monumento conmemorativo y construcción defensiva.'
      ], [
        'Expedición cerrada. Jerónimos, Padrão y Torre cuentan relaciones distintas con los viajes, el poder y el río.',
        'Topoloco intenta guardarlos como una sola versión heroica; vuestra comparación mantiene funciones y épocas diferentes.'
      ]), ARRIVAL_LOCATIONS.belem, [
        { from: 'topotino', text: 'Alfama y Baixa muestran que una ciudad cambia sin volverse una sola historia. La siguiente señal sigue el Tajo hacia los viajes que también la transformaron.' },
        { from: 'topotino', text: 'Habéis llegado a Belém. Ahora sí: buscad cómo la piedra, el río y los viajes se explican entre sí.' }
      ]),
      [
        question('belem-q1', 'Belém', '¿Cuál tuvo una función defensiva ligada a la entrada del Tajo?', ['La Torre de Belém', 'El Padrão dos Descobrimentos', 'Un pastel'], 0, 'Correcto: la Torre de Belém.', 'Su posición junto al agua formaba parte de un sistema defensivo. Hoy su función y su entorno han cambiado.', 'Mirad cuál está situado como control del paso por el río.'),
        question('belem-q2', 'Belém', '¿Qué diferencia mejor un monumento conmemorativo de una defensa?', ['El primero representa un relato; la segunda controla o protege un paso', 'Los dos hacen exactamente lo mismo', 'Una defensa no necesita posición'], 0, 'Exacto. Forma, función y relato no son lo mismo.', 'El Padrão fue concebido para conmemorar; la Torre tuvo usos defensivos. Compararlos evita una historia plana.', 'Pensad qué acción podía realizar cada construcción.')
      ]
    ),
    recovery('recuperacion-dia19', '¿Qué hizo Lisboa para seguir existiendo?', ['Cambió, reconstruyó y conservó capas distintas', 'Permaneció idéntica', 'Borró todos sus barrios antiguos'], 0, 'Sombra retirada. Topoloco ya no puede confundir permanencia con inmovilidad.', 'La versión única gana terreno, pero aún conserváis las diferencias.'),
    route('ruta-dia20', 'La nueva señal muestra animales africanos en grandes espacios y una advertencia: «describid lo que hacen, no lo que imagináis». ¿Cuál es la primera parada?', ['Badoca Safari Park', 'Oceanário', 'Tapada Nacional de Mafra'], 0, [
      'Primera señal encontrada: Badoca Safari Park.',
      'Niebla quiere convertir cualquier movimiento animal en un cuento falso. Nosotros separaremos conducta visible e interpretación.',
      'Preparad agua, protector solar, prismáticos si tenéis y ropa cómoda. Lo demás sigue oculto. Descansad.'
    ], { setFlags: ['completado_lisboa_historia_belem'], water: 'Agua de la Ciudad que Regresa' })
  ]
};

packs['012-badoca-lagos'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días. La única señal abierta nos lleva a Badoca Safari Park.',
    'Niebla está observando cómo pensáis. Hoy no le regalaremos emociones inventadas: primero hechos, después hipótesis.'
  ],
  steps: [
    ...withOrder(
      expedition('badoca-expedicion', 'Badoca Safari Park', 'Expedición de conducta animal', 'No hace falta ver una especie concreta. Elegid las que estén visibles y seguid las normas del parque.', [
        'Elegid un animal y observad tres acciones seguidas.',
        'Describid mentalmente las acciones sin usar emociones humanas.',
        'Observad una segunda especie y buscad una diferencia corporal relacionada con su movimiento.',
        'Localizad una norma que proteja a animales o visitantes.'
      ], [
        'Expedición completada. Habéis construido un pequeño etograma: un registro de conductas observables.',
        'Decir «camina, gira la cabeza, come» es evidencia. Decir «está tramando una fuga» puede ser un cuento de Niebla.'
      ]),
      [
        question('badoca-q1', 'Badoca Safari Park', '¿Cuál es una conducta observable?', ['El animal gira la cabeza hacia el vehículo', 'El animal está celoso', 'El animal sueña con Francia'], 0, 'Correcto. Otra persona podría comprobar ese giro.', 'Las emociones pueden existir, pero no se deducen con seguridad de una sola acción.', 'Elegid la frase que describe movimiento sin adivinar pensamientos.'),
        question('badoca-q2', 'Badoca Safari Park', 'Si dos especies se mueven de forma distinta, ¿qué explicación es más prudente?', ['Su cuerpo y entorno pueden favorecer movimientos distintos', 'Una especie es buena y la otra mala', 'Todos los individuos actúan siempre igual'], 0, 'Muy bien. Relacionar cuerpo, conducta y entorno crea una hipótesis comprobable.', 'Una observación breve no resume toda una especie. Hay que mantener abiertas alternativas.', 'Descartad las opciones que convierten una diferencia en juicio moral.')
      ]
    ),
    nextStop('dia20-pista-lagos', 'El receptor de Niebla apunta a una ciudad con marina, murallas y salidas hacia el Atlántico. ¿Cuál es?', ['Lagos', 'Sines', 'Sesimbra'], 0, [
      'La pista conduce a Lagos.',
      'En Badoca habéis descrito animales sin inventar sus pensamientos. En una marina tendremos que aplicar la misma prudencia a una búsqueda en el mar.'
    ]),
    ...withOrder(
      expedition('lagos-expedicion', 'Lagos y su marina', 'Expedición de la ciudad orientada al mar', 'Al llegar a Lagos, seguiremos la pista del receptor de Niebla.', [
        'Recorred una parte de la marina y localizad embarcaciones de usos distintos.',
        'Buscad una señal de salida hacia el mar o información de excursiones.',
        'Entrad en el centro histórico y localizad un elemento defensivo, una puerta o una muralla.',
        'Comparad hacia dónde se orientan marina y ciudad antigua.'
      ], [
        'Hecho. La marina organiza movimientos actuales hacia el mar; las defensas antiguas controlaban accesos y costa.',
        'El receptor de Niebla apuntaba a las salidas de barcos. Está preparando una prueba donde quizá no aparezca lo que buscamos.'
      ]),
      [
        onArrival(question('lagos-q1', 'Lagos y su marina', '¿Qué indica mejor que la marina conecta ciudad y mar?', ['Las rutas y embarcaciones que salen de ella', 'El color de una sombrilla', 'Que todas las calles sean rectas'], 0, 'Correcto. La función se reconoce por movimientos y conexiones.', 'Mañana esa salida nos permitirá investigar delfines y costa, pero sin prometer resultados.', 'Mirad qué elementos empiezan aquí y continúan fuera del puerto.'), ARRIVAL_LOCATIONS.lagos, [
          { from: 'topotino', text: 'En Badoca habéis separado un animal real de lo que imaginamos sobre él. La nueva pista sale hacia el mar, donde tampoco podremos ordenar que aparezca un delfín.' },
          { from: 'topotino', text: 'Ya estáis en la Marina de Lagos. Primero averiguaremos cómo conecta la ciudad con las rutas del mar.' }
        ]),
        question('lagos-q2', 'Lagos y su marina', '¿Para qué servía una defensa costera?', ['Vigilar y controlar accesos', 'Garantizar que aparezcan delfines', 'Decorar una piscina'], 0, 'Exacto. Su posición tiene relación con el territorio que controla.', 'La ciudad y el mar han mantenido relaciones comerciales, defensivas y de viaje diferentes.', 'Pensad qué podía observar o impedir desde su posición.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia20', '¿Qué frase vencería a Niebla?', ['Primero describimos lo observado; después proponemos explicaciones', 'Toda acción revela una emoción', 'Una historia bonita siempre es verdad'], 0, 'Sombra retirada. Niebla ha perdido una página entera de conclusiones inventadas.', 'Niebla conserva ventaja, pero ya no puede hacer pasar sus cuentos por observación.'),
    route('ruta-dia21', 'El receptor de Niebla termina en una salida de barco desde Lagos. Puede encontrar delfines o cuevas, pero no promete ningún resultado. ¿Cuál es la primera investigación?', ['Una salida de observación desde la Marina de Lagos', 'Un safari terrestre', 'Una visita a una fortaleza'], 0, [
      'Primera señal encontrada: una salida de observación desde la Marina de Lagos.',
      'Aplicaremos el Protocolo Azul: observar sin perseguir y aceptar la incertidumbre.',
      'Preparad protección solar, agua, algo de abrigo para el barco y calzado seguro. Si el mar cambia el plan, la historia se adapta. Descansad.'
    ], { setFlags: ['completado_badoca_lagos'] })
  ]
};

packs['013-delfines-benagil-sagres'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. La única señal abierta comienza en el barco de Lagos.',
    'Topoloco promete resultados para parecer poderoso. Nosotros investigaremos algo más difícil: lo que puede ocurrir sin fingir que está garantizado.'
  ],
  steps: [
    ...withOrder(
      expedition('barco-expedicion', 'Barco · delfines y Benagil', 'Expedición del avistamiento incierto', 'Seguid siempre las indicaciones de la tripulación. La expedición funciona haya o no haya delfines.', [
        'Antes de salir, localizad una norma o indicación de seguridad.',
        'Observad tres señales que use la tripulación para buscar o navegar.',
        'Si aparecen delfines, registrad una conducta visible; si no, registrad las condiciones del mar.',
        'En la costa, localizad una cueva, arco o estrato desde una posición autorizada.'
      ], [
        'Expedición completada. No ver un animal hoy no demuestra que no viva en la zona.',
        'La tripulación combina experiencia, señales y azar. El Protocolo Azul impide convertir la búsqueda en persecución.'
      ]),
      [
        question('barco-q1', 'Barco · delfines y Benagil', 'Si hoy no aparecen delfines, ¿qué conclusión es válida?', ['Hoy no los vimos en estas condiciones', 'No existen delfines en el Atlántico', 'La tripulación mintió necesariamente'], 0, 'Correcto. Es una conclusión limitada a la observación real.', 'La ausencia de un avistamiento no equivale a ausencia de la especie. Esa diferencia protege la ciencia y a los animales.', 'Elegid la frase que no afirma más de lo observado.'),
        question('barco-q2', 'Barco · delfines y Benagil', '¿Qué conducta respeta mejor el Protocolo Azul?', ['Mantener distancia y seguir a la tripulación', 'Perseguir al grupo para acercarse', 'Darles comida para que vuelvan'], 0, 'Exacto. Observar no significa controlar.', 'Reducir molestias permite que el encuentro, si ocurre, dependa del comportamiento natural del animal.', 'Pensad quién debe decidir la distancia segura.')
      ]
    ),
    nextStop('dia21-pista-sagres', 'Desde el mar aparece un promontorio con fortaleza, una gran figura circular y un cabo frente al Atlántico. ¿Qué lugar encaja?', ['Sagres y Cabo de São Vicente', 'Belém', 'Cascais'], 0, [
      'La señal conduce a Sagres y al Cabo de São Vicente.',
      'En el barco habéis observado sin controlar el resultado. Desde tierra alta comprobaremos qué información añade una vista amplia y qué incertidumbres siguen abiertas.'
    ]),
    ...withOrder(
      expedition('sagres-expedicion', 'Sagres y Cabo de São Vicente', 'Expedición del horizonte', 'Corvinho nos espera en la fortaleza, aunque seguramente fingirá que dirige el viento.', [
        'En la fortaleza, localizad la gran rosa de los vientos o su espacio.',
        'Mirad el promontorio desde dos puntos seguros.',
        'Buscad una construcción defensiva y una señal ligada a navegación.',
        'En el cabo, observad cómo cambian viento, luz y horizonte al atardecer.'
      ], [
        'Expedición terminada. El promontorio permite mirar mar y costa, pero una vista amplia no elimina la incertidumbre.',
        'La rosa suele llamarse de los vientos; su función exacta ha tenido interpretaciones distintas. Corvinho aprueba que mantengamos más de una hipótesis.'
      ]),
      [
        onArrival(question('sagres-q1', 'Sagres y Cabo de São Vicente', '¿Qué ayuda a la navegación desde un promontorio?', ['Una vista amplia de costa, mar y horizonte', 'No mirar el tiempo', 'Suponer que el viento nunca cambia'], 0, 'Correcto. La posición ofrece información.', 'También exige interpretar viento, luz y costa. Una vista grande no sustituye al razonamiento.', 'Recordad qué podíais ver desde arriba que no se ve al nivel del agua.'), ARRIVAL_LOCATIONS.sagres, [
          { from: 'topotino', text: 'Desde el barco habéis aprendido que observar no garantiza encontrar. La señal nos manda ahora a mirar el mismo mar desde tierra firme y mucha altura.' },
          { from: 'topotino', text: 'Habéis llegado a Sagres. Buscad costa, viento y horizonte antes de decidir qué información aporta este punto.' }
        ]),
        question('sagres-q2', 'Sagres y Cabo de São Vicente', 'Si hay varias explicaciones para una estructura, ¿qué hacemos?', ['Comparamos evidencias y mantenemos abierta la duda', 'Elegimos la más emocionante', 'Decimos que todas están demostradas'], 0, 'Muy bien. Una hipótesis no se convierte en hecho por sonar bien.', 'Topoloco acaba de admitir que está aprendiendo de vuestro método. Eso lo vuelve más peligroso y también más previsible.', 'Buscad la opción que permite corregir si aparece nueva evidencia.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia21', '¿Qué protege mejor una investigación incierta?', ['Decir exactamente qué vimos y qué no sabemos', 'Prometer el resultado antes de salir', 'Ocultar cualquier ausencia'], 0, 'Sombra retirada. Topoloco no puede usar vuestra incertidumbre como debilidad.', 'Topoloco conserva datos de hoy, pero no ha conseguido una versión falsa completa.'),
    route('ruta-dia22', 'La siguiente ventana muestra acantilados amarillos con cuevas, arcos y pilares junto al mar. ¿Cuál es la primera señal?', ['Ponta da Piedade', 'Nazaré', 'Cabo da Roca'], 0, [
      'Primera señal encontrada: Ponta da Piedade.',
      'Las rocas nos permitirán investigar cómo el mar aprovecha grietas y crea formas. No sabemos adónde llevará después.',
      'Preparad calzado con buen agarre, agua y protector solar. Nada de bordes ni atajos. Descansad.'
    ], { setFlags: ['completado_delfines_benagil_sagres'], water: 'Agua del Horizonte' })
  ]
};

packs['014-piedade-algar-jaima'] = {
  shadowActor: 'Eco',
  openingMessages: [
    'Buenos días. La única señal abierta nos lleva a Ponta da Piedade.',
    'Topoloco necesita copiar formas y voces. Nosotros aprenderemos qué permanece cuando el agua abre huecos y cómo se reconoce a un amigo de verdad.'
  ],
  steps: [
    ...withOrder(
      expedition('piedade-expedicion', 'Ponta da Piedade', 'Expedición de formas costeras', 'Recorred pasarelas y miradores seguros con los adultos.', [
        'Observad la costa desde dos miradores.',
        'Localizad tres formas entre cueva, arco, pilar, fractura e islote.',
        'Buscad una zona donde el agua pueda aprovechar una grieta.',
        'Comparad una roca conectada a tierra con otra aislada.'
      ], [
        'Expedición completada. Las olas y la meteorización aprovechan fracturas, agrandan huecos y pueden aislar pilares.',
        'No toda roca sigue una secuencia idéntica. El material, las grietas y la fuerza del mar cambian el resultado.'
      ]),
      [
        question('piedade-q1', 'Ponta da Piedade', '¿Qué puede formarse cuando un hueco atraviesa una roca?', ['Un arco', 'Una plaza', 'Una huella de dinosaurio'], 0, 'Correcto: un arco.', 'Si el techo o una parte del arco cae, pueden quedar pilares o islotes. Es una secuencia posible, no una ley para toda la costa.', 'Pensad qué forma deja pasar la vista o el agua de un lado a otro.'),
        question('piedade-q2', 'Ponta da Piedade', '¿Por qué dos zonas cercanas pueden tener formas distintas?', ['Porque cambian fracturas, roca y exposición al mar', 'Porque una costa está enfadada', 'Porque el agua elige al azar sin relación con nada'], 0, 'Exacto. El proceso depende de varias condiciones.', 'Comparar dos miradores permite ver que la erosión no trabaja como una máquina de moldes idénticos.', 'Buscad diferencias físicas, no intenciones.')
      ]
    ),
    nextStop('dia22-pista-algar', 'Una grieta del acantilado dibuja otra costa con ventanas naturales que se pueden observar de cerca. ¿Qué lugar señala?', ['Algar Seco', 'Praia da Rocha', 'Salema'], 0, [
      'La señal conduce a Algar Seco.',
      'Ponta da Piedade mostró cómo aparecen huecos y pilares. Allí comprobaremos qué roca permanece sosteniendo cada abertura.'
    ]),
    ...withOrder(
      expedition('algar-expedicion', 'Algar Seco', 'Expedición de huecos y soportes', 'Seguid solo pasarelas y zonas abiertas.', [
        'Localizad una ventana natural o cavidad desde un punto seguro.',
        'Buscad el soporte de roca que mantiene una abertura.',
        'Comparad una superficie muy expuesta con otra protegida.',
        'Mirad Carvoeiro o el mar a través de una abertura natural.'
      ], [
        'Hecho. Un hueco no existe sin bordes y soportes que lo definan.',
        'Eco copia la voz y cree que basta con quitar al original. Pero una identidad también se sostiene con relaciones y límites.'
      ]),
      [
        onArrival(question('algar-q1', 'Algar Seco', '¿Qué necesita una ventana natural para seguir abierta?', ['Roca que actúe como soporte alrededor', 'Que desaparezca toda la roca', 'Una cortina'], 0, 'Correcto. El hueco depende de lo que permanece.', 'La erosión retira material, pero la forma visible también está definida por sus soportes.', 'Mirad qué partes sostienen la abertura.'), ARRIVAL_LOCATIONS.algar, [
          { from: 'topotino', text: 'Ponta da Piedade nos ha enseñado cómo el mar cambia la roca. La señal continúa hacia un lugar donde podremos mirar de cerca huecos y soportes.' },
          { from: 'topotino', text: 'Ya estáis en Algar Seco. Observad una abertura real antes de elegir qué la mantiene en pie.' }
        ]),
        question('algar-q2', 'Algar Seco', '¿Dónde suele actuar con más fuerza el mar?', ['En zonas más expuestas a oleaje y fracturas', 'Siempre igual en cualquier punto', 'Solo donde hay edificios'], 0, 'Sí. La exposición y las debilidades de la roca importan.', 'Por eso comparar dos zonas próximas ayuda a explicar diferencias sin inventar una regla universal.', 'Comparad la cara abierta al mar con una cavidad protegida.')
      ],
      'question-first'
    ),
    nextStop('dia22-pista-jaima', 'Eco ha escondido una voz copiada en el lugar donde dormiréis, dentro de una tienda especial cerca de Albufeira. ¿Dónde debemos comprobarla?', ['HolaJaima', 'Un hotel de Lisboa', 'El castillo de Óbidos'], 0, [
      'La interferencia señala la jaima de Albufeira.',
      'Algar Seco ha enseñado que un hueco depende de lo que lo rodea. Esta noche comprobaremos si una voz depende también de la conducta de quien habla.',
      'No enviéis nada del Cuaderno aunque una voz parezca la mía.'
    ]),
    ...withOrder(
      onArrival(expedition('jaima-expedicion', 'HolaJaima · Albufeira', 'Expedición de la voz verdadera', 'Al llegar, Eco intentará imitar a Topotino. El Cuaderno continúa privado.', [
        'Reconoced dos detalles reales de vuestra tienda o su entorno.',
        'Escuchad durante un minuto y separad un sonido cercano de uno lejano.',
        'Recordad una regla que el verdadero Topotino mantiene siempre sobre el Cuaderno.',
        'Si una voz pide una foto, marca o página, no enviéis nada.'
      ], [
        'Bien hecho. La tienda ha funcionado como lugar de escucha y como prueba de coherencia.',
        'Una voz puede copiarse. Una conducta mantenida durante días es mucho más difícil de falsificar.'
      ]), ARRIVAL_LOCATIONS.jaima, [
        { from: 'system', text: 'Interferencia de voz detectada cerca del campamento.' },
        { from: 'topotino', text: 'La señal ha seguido los huecos de la roca hasta vuestra tienda. Eco cree que una voz parecida basta para hacerse pasar por mí.' },
        { from: 'topotino', text: 'No contestéis deprisa ni enseñéis el Cuaderno. Primero compararemos lo que esa voz pide con mis reglas de siempre.' }
      ]),
      [
        question('jaima-q1', 'HolaJaima · Albufeira', 'Una voz idéntica pide una foto del Cuaderno. ¿Quién es más probable que sea?', ['Eco imitando a Topotino', 'El verdadero Topotino rompiendo su regla', 'El Cuaderno hablando'], 0, 'Exacto. La petición contradice la conducta de Topotino.', 'Eco se ha delatado: el verdadero Topotino nunca pide páginas, fotos ni marcas privadas.', 'No os fijéis solo en la voz. Comparad lo que pide con la regla mantenida.'),
        question('jaima-q2', 'HolaJaima · Albufeira', '¿Qué prueba mejor una identidad?', ['Una conducta coherente a lo largo del tiempo', 'Solo el sonido de la voz', 'Una contraseña enviada por un desconocido'], 0, 'Correcto. La coherencia resiste mejor una copia.', '¡Mierda, Eco casi entra en el canal! Perdón. Ya está fuera. Habéis reconocido al verdadero Topotino por cómo os protege.', 'Pensad qué parte no pudo copiar Eco aunque imitara el sonido.')
      ]
    ),
    recovery('recuperacion-dia22', '¿Qué relación une roca e identidad?', ['Un hueco y una voz se entienden por los soportes y relaciones que permanecen', 'Todo hueco es una mentira', 'Una copia siempre sustituye al original'], 0, 'Sombra retirada. Eco ha perdido una parte de la grabación.', 'Eco conserva una copia incompleta, pero el Cuaderno sigue totalmente fuera de su alcance.'),
    route('ruta-dia23', 'Eco dejó una orden: «Busca el lugar que rescata animales del mar. Si los cuidan, nos pertenecen». ¿Adónde vamos para demostrar que está equivocado?', ['Zoomarine y Porto d’Abrigo', 'Un museo de fósiles', 'Una fortaleza'], 0, [
      'Correcto: Zoomarine, donde investigaremos Porto d’Abrigo.',
      'Cuidar no significa poseer. Un rescate serio intenta rehabilitar y devolver cuando es posible.',
      'Preparad bañador, toalla, protector solar, agua y calzado cómodo. Mañana Vasco vuelve a la red. Descansad.'
    ], { setFlags: ['completado_piedade_algar_jaima'], water: 'Agua de la Piedra' })
  ]
};

packs['015-zoomarine'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Hoy investigamos Zoomarine y Porto d’Abrigo.',
    'Eco dejó una idea peligrosa: «si cuidas algo, te pertenece». Vasco nos ayudará a desmontarla, pero la evidencia está en el parque.'
  ],
  steps: [
    ...withOrder(
      expedition('zoomarine-expedicion', 'Zoomarine', 'Expedición de cuidar y devolver', 'No dependemos de ver un animal concreto ni de asistir a una presentación determinada.', [
        'Buscad información sobre Porto d’Abrigo o el centro de rehabilitación.',
        'Reconstruid las fases: llegada, diagnóstico, rehabilitación y posible devolución.',
        'Observad una especie y separad un rasgo corporal de una conducta visible.',
        'Localizad una norma para visitantes y una medida que requiera profesionales.'
      ], [
        'Expedición completada. Porto d’Abrigo trabaja desde 2002 con animales marinos que necesitan ayuda.',
        'El objetivo, cuando es viable, es devolverlos. Proteger puede exigir distancia, conocimiento y renunciar a quedárselos.'
      ]),
      [
        question('zoomarine-q1', 'Zoomarine', '¿Qué debe decidirse con evidencia antes de devolver un animal?', ['Si está recuperado y puede sobrevivir', 'Si queda bonito en una foto', 'Si alguien quiere conservarlo'], 0, 'Correcto. La salud y la capacidad de volver son esenciales.', 'Diagnóstico y rehabilitación requieren profesionales. El cariño no sustituye la evidencia.', 'Pensad qué decisión afecta a la supervivencia del animal.'),
        question('zoomarine-q2', 'Zoomarine', '¿Por qué «cuidar significa poseer» es falso?', ['Porque cuidar busca el bienestar, incluso si exige devolver y alejarse', 'Porque nadie puede ayudar a un animal', 'Porque todos los animales deben vivir en una casa'], 0, 'Exacto. Cuidar no convierte a nadie en dueño.', 'Topoloco retuvo recuerdos y los llamó salvados. Si quisiera protegerlos, intentaría devolverlos sin imponer una versión.', 'Aplicad la lógica de Porto d’Abrigo a los recuerdos de Topotino.')
      ]
    ),
    recovery('recuperacion-dia23', '¿Qué palabra completa mejor rescatar, rehabilitar y…?', ['Devolver', 'Coleccionar', 'Ocultar'], 0, 'Sombra retirada. Vasco ha recuperado una conexión limpia del mapa.', 'Topoloco conserva una interferencia, pero su excusa de «protección» ya no funciona.'),
    route('ruta-dia24', 'La siguiente ventana muestra un puente de siete arcos llamado «romano», aunque la evidencia lo sitúa en otra época. ¿Dónde está?', ['Tavira', 'Lagos', 'Lisboa'], 0, [
      'Primera señal encontrada: Tavira.',
      'Allí corregiremos una memoria popular sin quitar valor al puente. No hay ninguna otra coordenada abierta.',
      'Preparad documentación, calzado cómodo, agua y protector solar. Descansad.'
    ], { setFlags: ['completado_zoomarine'], water: 'Agua del Cuidado' })
  ]
};

packs['016-tavira-sevilla'] = {
  shadowActor: 'Borrón',
  openingMessages: [
    'Buenos días. La única señal abierta nos lleva al puente de Tavira.',
    'Borrón ha escrito «romano» sobre el puente de siete arcos. No vamos a borrar el puente: vamos a corregir la etiqueta con respeto y evidencia.'
  ],
  steps: [
    ...withOrder(
      expedition('tavira-expedicion', 'Tavira', 'Expedición del puente corregible', 'Recorred el centro y cruzad solo por pasos permitidos.', [
        'Observad el puente antiguo desde una ribera segura y contad sus siete arcos.',
        'Cruzadlo y localizad tres detalles actuales de su construcción.',
        'Subid al jardín del castillo o a otra vista alta segura.',
        'Relacionad río, puente, tejados y salida hacia el mar.'
      ], [
        'Expedición completada. Se le llama a menudo puente romano, pero la evidencia permite asegurarlo como medieval y reconstruido hacia 1655.',
        'Corregir una memoria no destruye el valor del puente. Lo vuelve más honesto.'
      ]),
      [
        question('tavira-q1', 'Tavira', '¿Qué afirmación es más rigurosa?', ['Es medieval y fue reconstruido; «romano» es un nombre popular no demostrado', 'Es romano porque mucha gente lo dice', 'Tiene siete arcos, así que es prehistórico'], 0, 'Correcto. Distingue evidencia y nombre repetido.', 'La popularidad de una etiqueta no pesa más que los estudios y las fases constructivas.', 'Elegid la opción que deja claro qué sabemos y qué no está demostrado.'),
        question('tavira-q2', 'Tavira', '¿Qué aporta una vista alta de Tavira?', ['Revela relaciones entre río, puente y ciudad, pero pierde detalles pequeños', 'Permite verlo absolutamente todo', 'Demuestra la fecha exacta del puente'], 0, 'Exacto. Toda perspectiva muestra y oculta.', 'Una vista alta ayuda a comprender el sistema urbano; la observación cercana aporta materiales y detalles.', 'Comparad lo que se ve desde arriba con lo que visteis sobre el puente.')
      ]
    ),
    nextStop('dia24-pista-sevilla', 'Al corregir la etiqueta del puente aparece otro canal con varios puentes y bancos que representan territorios. La señal cruza una frontera. ¿Qué lugar es?', ['Plaza de España de Sevilla', 'Rossio de Lisboa', 'Castillo de Óbidos'], 0, [
      'La señal conduce a la Plaza de España de Sevilla.',
      'En Tavira el puente cruza un río urbano. Allí comprobaremos cómo un puente también puede formar parte de una representación.'
    ]),
    ...withOrder(
      expedition('sevilla-plaza-expedicion', 'Plaza de España · Sevilla', 'Expedición de puentes que representan', 'Al llegar a Sevilla, compararemos el canal con el Gilão de Tavira.', [
        'Cruzad uno de los puentes de Plaza de España.',
        'Observad el canal desde dos posiciones.',
        'Localizad bancos o elementos que representen territorios.',
        'Buscad dos diferencias entre este espacio y el puente de Tavira.'
      ], [
        'Hecho. Los puentes de la plaza permiten cruzar el canal y también forman parte de una representación de España.',
        'Una forma parecida puede cumplir funciones distintas. Dos orillas no necesitan perder su diferencia para estar conectadas.'
      ]),
      [
        onArrival(question('sevilla-plaza-q1', 'Plaza de España · Sevilla', '¿Qué función añade la plaza a sus puentes?', ['Organizar una escena que representa unión y territorio', 'Defender la entrada del Atlántico', 'Conservar huellas de dinosaurio'], 0, 'Correcto. Aquí cruzar y representar trabajan juntos.', 'El canal y los puentes forman parte de un diseño simbólico, distinto del cruce urbano de Tavira.', 'Pensad en todo lo que rodea al puente, no solo en el paso.'), ARRIVAL_LOCATIONS.sevillaPlaza, [
          { from: 'topotino', text: 'En Tavira habéis corregido la historia de un puente sin quitarle valor. La señal cruza la frontera para comparar otro puente con una función distinta.' },
          { from: 'topotino', text: 'Habéis llegado a la Plaza de España. Mirad el canal y todo lo que rodea sus puentes antes de elegir.' }
        ]),
        question('sevilla-plaza-q2', 'Plaza de España · Sevilla', '¿Qué comparación es más útil?', ['Misma forma general, pero contexto y función diferentes', 'Son idénticos porque ambos cruzan agua', 'No se pueden comparar dos lugares'], 0, 'Muy bien. Comparar no significa declarar iguales.', 'Topotina ha detectado aquí la segunda firma de parque que apareció en Magikland: está en Isla Mágica.', 'Buscad una semejanza y una diferencia que puedan existir a la vez.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia24', '¿Qué hace una memoria honesta cuando aparece mejor evidencia?', ['Se corrige sin fingir que nunca se equivocó', 'Se aferra al nombre más popular', 'Borra el lugar completo'], 0, 'Sombra retirada. Borrón ha perdido su etiqueta falsa.', 'La palabra de Borrón sigue visible, pero ahora funciona como ejemplo de una corrección.'),
    route('ruta-dia25', 'Topotina ha localizado la estación gemela de Magikland: una isla de exploradores, barcos, piratas y viajes. ¿Adónde vamos?', ['Isla Mágica y Agua Mágica', 'Dino Parque', 'Oceanário'], 0, [
      'Exacto: Isla Mágica y Agua Mágica.',
      'Solo sabemos que comparte la firma técnica de Magikland. Tendremos que averiguar quién responde allí y qué ha preparado Niebla.',
      'Preparad bañador, toalla, protector solar, agua y calzado cómodo. Descansad.'
    ], { setFlags: ['completado_tavira_sevilla'], water: 'Agua de las Dos Orillas' })
  ]
};

packs['017-isla-magica'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días. Hoy entramos en Isla Mágica y Agua Mágica.',
    'Recordad Portugal dos Pequenitos: representar una época no convierte el escenario en un edificio original, pero puede enseñar si explica sus límites.',
    'Es la estación gemela de Magikland. No sabemos todavía quién está emitiendo desde dentro ni qué intenta hacer Niebla.'
  ],
  steps: [
    ...withOrder(
      expedition('isla-expedicion', 'Isla Mágica y Agua Mágica', 'Expedición de historia, escenario y decisión', 'No hace falta montar en nada que no queráis. El parque ofrece muchas evidencias desde caminos, zonas y espectáculos.', [
        'Recorred dos zonas temáticas distintas y buscad un cambio claro de ambientación.',
        'En una zona, localizad algo que represente historia y algo que tenga una función real hoy.',
        'Comparad un espacio o atracción de agua con otro sin agua.',
        'Identificad una emoción que pueda empujar a elegir deprisa y una forma de parar a pensar.'
      ], [
        'Expedición completada. Isla Mágica representa los siglos XVI y XVII; no pretende ser un edificio original de esa época.',
        'Capitán Pico y América os nombran exploradores. Han encontrado dos rutas de Niebla: una llama mucho la atención y otra permite comprobar y corregir.'
      ]),
      [
        question('isla-q1', 'Isla Mágica y Agua Mágica', '¿Qué diferencia un escenario histórico de una fuente original?', ['El escenario representa una época con elementos actuales', 'El escenario estuvo necesariamente allí en el siglo XVI', 'No puede enseñar nada'], 0, 'Correcto. Representar no es falsificar si se explica con claridad.', 'Como en Portugal dos Pequenitos, un escenario selecciona y transforma. Puede ayudar a imaginar y aprender, pero no sustituye una fuente original.', 'Mirad qué elementos funcionan para visitantes actuales.'),
        question('isla-q2', 'Isla Mágica y Agua Mágica', 'Niebla ofrece dos rutas. ¿Cuál es más segura intelectualmente?', ['La más urgente y llamativa, sin comprobar nada', 'La que permite comprobar una afirmación y corregir si falla', 'La que prohíbe cambiar de opinión'], 1, 'Exacto. Comprobar y conservar una salida derrota la urgencia.', 'Krim ha detectado la emoción sin dejar que mande. Capitán Pico hace que Niebla siga la ruta llamativa y América recupera la señal.', 'Elegid la ruta que permite volver atrás si la evidencia no encaja.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia25', '¿Qué hace un buen explorador cuando siente mucha prisa?', ['Nombra la emoción, comprueba y mantiene una salida', 'Obedece la primera señal', 'Finge que no siente nada'], 0, 'Sombra retirada. Krim dice que Niebla ha salido color verde mareado.', 'Niebla mantiene una ventaja, pero la contratrampa ha recuperado la señal principal.'),
    route('ruta-dia26', 'La señal recuperada muestra un palacio sevillano donde edificios y jardines conservan cambios de muchas épocas. ¿Cuál es la primera parada?', ['Real Alcázar de Sevilla', 'Palacio de las Dueñas', 'Castillo de Gibralfaro'], 0, [
      'Primera señal encontrada: Real Alcázar de Sevilla.',
      'Solo sabemos que allí debemos comprobar cómo varias épocas pueden convivir sin que una borre a las demás.',
      'Tened agua y calzado cómodo. Guardad energía; la red sigue ocultando el resto.'
    ], { setFlags: ['completado_isla_magica'] })
  ]
};

packs['018-sevilla-alhambra-noche'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. La señal abierta nos lleva al Real Alcázar de Sevilla.',
    'Topoloco intenta encerrar una sola versión. Primero comprobaremos si un edificio puede conservar cambios de muchas épocas.'
  ],
  steps: [
    ...withOrder(
      expedition('alcazar-expedicion', 'Real Alcázar de Sevilla', 'Expedición de capas que dialogan', 'Elegid un palacio o patio y un jardín de función o época diferente.', [
        'Comparad dos patrones geométricos.',
        'Buscad dos usos distintos del agua.',
        'Observad cómo se pasa de interior a jardín.',
        'Localizad una capa añadida que no borre por completo la anterior.'
      ], [
        'Expedición completada. El Alcázar reúne transformaciones y estilos que dialogan sin convertirse en una sola fecha.',
        'Superponer puede modificar, reutilizar y conservar. La señal ha reaccionado a esa diferencia.'
      ]),
      [
        question('alcazar-q1', 'Real Alcázar de Sevilla', '¿Qué demuestra mejor que existen varias capas?', ['Cambios de estilo y uso que siguen visibles', 'Que todo parece exactamente igual', 'Que un jardín no tiene historia'], 0, 'Correcto. La diferencia visible conserva el paso del tiempo.', 'Un conjunto vivo puede integrar nuevas funciones sin eliminar todas las anteriores.', 'Comparad dos espacios, no busquéis una fecha aislada.'),
        question('alcazar-q2', 'Real Alcázar de Sevilla', '¿Qué puede hacer el agua además de decorar?', ['Organizar recorrido, refrescar y reflejar', 'Borrar automáticamente el edificio', 'Detener el tiempo'], 0, 'Exacto. El agua tiene varias funciones a la vez.', 'Un reflejo depende del objeto y de la superficie que lo devuelve; no sustituye al original.', 'Pensad en movimiento, temperatura y visión.')
      ]
    ),
    nextStop('dia26-pista-catedral', 'El agua del Alcázar refleja una torre que conservó un antiguo alminar y después se convirtió en campanario. ¿Qué lugar debemos comprobar?', ['Catedral de Sevilla y Giralda', 'Torre de Belém', 'Castillo de São Jorge'], 0, [
      'La señal conduce a la Catedral de Sevilla y la Giralda.',
      'El Alcázar mostró épocas que conviven. Ahora buscaremos un cambio de función aún más claro en una torre.'
    ]),
    ...withOrder(
      expedition('catedral-expedicion', 'Catedral de Sevilla', 'Expedición de funciones transformadas', 'Buscad tres elementos que pertenezcan a historias o funciones distintas.', [
        'Relacionad la Giralda con el Giraldillo.',
        'Observad el gran espacio gótico de la catedral.',
        'Localizad la tumba de Colón, el retablo u otra pieza que narre viajes o poder.',
        'Elegid qué cambió de función, qué se añadió y qué permaneció reconocible.'
      ], [
        'Hecho. La Giralda conserva el antiguo alminar y suma campanario y Giraldillo; la catedral transformó el conjunto sin volverlo una historia de un solo momento.',
        'Ya tenemos la preparación: una historia puede cambiar y seguir siendo reconocible.'
      ]),
      [
        onArrival(question('catedral-q1', 'Catedral de Sevilla', '¿Qué ejemplo muestra mejor un cambio de función?', ['El alminar convertido en campanario', 'Una sombra que cambia de lugar', 'Una entrada que sigue siendo entrada'], 0, 'Correcto. La estructura permanece reconocible y su uso cambia.', 'Añadir el campanario y el Giraldillo no convierte toda la torre en una obra de una sola época.', 'Pensad qué hacía la torre antes y qué hace ahora.'), ARRIVAL_LOCATIONS.catedralSevilla, [
          { from: 'topotino', text: 'En el Alcázar habéis visto capas que conviven. La siguiente cerradura necesita un ejemplo todavía más claro: una torre que cambió de función.' },
          { from: 'topotino', text: 'Ya estáis en la Catedral. Buscad primero la Giralda y el Giraldillo; después compararemos lo que permaneció y lo que se añadió.' }
        ]),
        question('catedral-q2', 'Catedral de Sevilla', '¿Qué relato puede aportar una tumba o retablo?', ['Viajes, poder, creencias y decisiones de una época', 'La fecha exacta de cada piedra del edificio', 'Una única verdad sobre toda Sevilla'], 0, 'Muy bien. Una pieza aporta una capa, no el edificio entero.', 'Topoloco selecciona una pieza y finge que posee toda la historia. Esta comparación nos prepara para desenmascararlo.', 'Elegid la opción que reconoce el valor sin convertir una parte en el todo.')
      ],
      'question-first'
    ),
    nextStop('dia26-pista-alhambra', 'La Giralda libera la frase completa: «ciudad roja, doce guardianes de piedra, cuando el agua refleje la noche». ¿Qué lugar señala?', ['Alhambra de Granada', 'Plaza de España', 'Monasterio de Batalha'], 0, [
      'La señal final apunta a la Alhambra de Granada, esta noche.',
      'Ahora sí sabemos el destino final. Aún ignoramos cómo abrirán el cierre los doce guardianes; solo sabemos que el agua y los reflejos serán importantes.',
      'Tened entradas, agua, calzado cómodo y una capa ligera. No adelantaremos ninguna respuesta hasta llegar.'
    ]),
    ...withOrder(
      onArrival(expedition('alhambra-expedicion', 'Alhambra nocturna', 'Expedición de las cuatro cerraduras', 'Entrad con los adultos y seguid el recorrido real. El Cuaderno permanece privado.', [
        'En Mexuar, localizad una señal de cambio de uso o superposición.',
        'En Arrayanes, comparad un detalle arquitectónico con su reflejo y observad qué ocurre si el agua se mueve.',
        'En Comares, recordad dos momentos distintos del viaje que ahora se relacionen.',
        'En Leones, contad doce y comparad al menos tres cabezas, perfiles o tallas.'
      ], [
        'Las cuatro observaciones están reunidas. Topotina mantiene abierta la red.',
        'Topoloco exige una única versión y un único dueño. Vamos a responder cerradura por cerradura.'
      ]), ARRIVAL_LOCATIONS.alhambra, [
        { from: 'topotina', text: 'Coordenada final confirmada. Las doce ventanas están conectadas, pero ninguna se abrirá sin lo que Paula y Hugo observen dentro.' },
        { from: 'topotino', text: 'Catedral y Alcázar nos han preparado para distinguir cambios y capas. Ahora sí: habéis llegado a la Alhambra de noche.' },
        { from: 'topotino', text: 'Iremos en orden: Mexuar, Arrayanes, Comares y Leones. No saltéis al final; Topoloco cuenta con que tengamos prisa.' }
      ]),
      [
        question('alhambra-q1', 'Alhambra nocturna · Mexuar', '¿Qué refuta «un edificio solo cuenta su primer uso»?', ['Las adaptaciones y capas visibles del propio Mexuar', 'Que el edificio tenga una puerta', 'Que sea de noche'], 0, 'Primera cerradura abierta.', 'Mexuar cambió de usos y forma. La transformación no elimina automáticamente todas sus historias anteriores.', 'Usad una capa que hayáis localizado allí.'),
        question('alhambra-q2', 'Alhambra nocturna · Arrayanes', 'Si el agua se mueve y el reflejo se deforma, ¿qué demuestra?', ['Que la copia depende del original y del medio', 'Que el palacio se deforma', 'Que el reflejo es dueño del edificio'], 0, 'Segunda cerradura abierta.', 'El eclipse creó una sombra; agua y cristal distribuyeron copias deformables. Así extrajo Topoloco los recuerdos de Topotino.', 'Mirad qué permanece quieto y qué superficie cambia.'),
        question('alhambra-q3', 'Alhambra nocturna · Comares', 'Dos recuerdos de días distintos se ayudan a entender. ¿Qué demuestra?', ['Que la historia funciona como una red de relaciones', 'Que un recuerdo debe borrar al otro', 'Que solo importa el último día'], 0, 'Tercera cerradura abierta.', 'Cada corrección puede cambiar cómo entendemos algo anterior. Vuestra aventura no es una fila de vitrinas separadas.', 'Pensad por qué recordasteis juntos esos dos momentos.'),
        question('alhambra-q4', 'Alhambra nocturna · Leones', 'Los doce leones no son idénticos. ¿Qué idea destruye eso?', ['Que una obra compartida necesite una sola mano y una única versión', 'Que existan doce leones', 'Que la piedra pueda tallarse'], 0, 'Cuarta cerradura abierta.', 'Diferencias de rasgos, siluetas y tamaños muestran varias manos dentro de una obra común. Doce no significa doce piezas aisladas.', 'Comparad los tres leones que habéis elegido.')
      ]
    ),
    recovery('recuperacion-dia26', 'Última oportunidad: ¿qué no puede copiar la máquina de Topoloco?', ['Una historia compartida que acepta diferencias, correcciones y un cuaderno privado', 'Una frase única repetida muchas veces', 'Una fotografía de un reflejo'], 0, 'Sombra retirada antes del cierre. Topotina ha estabilizado una conexión.', 'La Sombra permanece en el cierre, pero no impedirá que liberemos la red.'),
    {
      id: 'final-alhambra',
      kind: 'ending',
      place: 'Patio de los Leones',
      title: 'Abrir las doce ventanas',
      intro: 'Consultad el Cuaderno en privado. No enviéis ninguna página. Cuando Paula y Hugo estén de acuerdo en que sus dos miradas forman una historia compartida, pulsad el cierre.',
      actions: ['Mirad el Cuaderno sin mostrarlo.', 'Elegid juntos una razón por la que dos recuerdos diferentes pueden pertenecer a una historia compartida.'],
      doneMessages: ['Cierre preparado. La respuesta final depende de toda la Memoria y toda la Sombra reunidas.'],
      effects: { setFlags: ['completado_sevilla_alhambra_noche', 'topoloco_derrotado', 'doce_aguas_reunidas'], water: 'Agua Clara de la Noche' }
    }
  ]
};

packs['019-epilogo-generalife'] = {
  shadowActor: null,
  openingMessages: [
    'Buenos días. La aventura principal terminó anoche. Hoy no hay trampa ni examen.',
    'La luz del día permite una segunda mirada. Solo quiero acompañaros y despedirme como toca.'
  ],
  steps: [
    expedition('epilogo-expedicion', 'Generalife, Carlos V y Alcazaba', 'Segunda mirada voluntaria', 'Hacedlo solo si os apetece. No hay respuesta correcta.', [
      'En Generalife, observad cómo el agua organiza el Patio de la Acequia o un jardín.',
      'En Carlos V, comparad la forma exterior con el patio interior.',
      'En la Alcazaba, mirad Granada desde una torre o punto seguro.'
    ], [
      'Gracias por volver a mirar. Un lugar no se agota en una visita ni una historia en una versión.',
      'El Cuaderno de la Memoria es vuestro. Topotina —Tina— manda saludos y exige que le devuelva tres destornilladores.',
      'Buen viaje de vuelta a Valladolid, Paula y Hugo. Canal T-00FIN cerrado con honores.'
    ])
  ]
};

export const CHALLENGE_PACKS = Object.freeze(packs);
