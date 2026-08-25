const optionIds = ['a', 'b', 'c', 'd'];

const ARRIVAL_LOCATIONS = Object.freeze({
  bucaco: { lat: 40.3755835, lng: -8.3619487, radiusMeters: 5000, label: 'Mata Nacional do Buçaco' },
  portugalPequenitos: { lat: 40.202478, lng: -8.434375, radiusMeters: 700, label: 'Portugal dos Pequenitos, Coimbra' },
  batalha: { lat: 39.6594, lng: -8.8254, radiusMeters: 700, label: 'Monasterio de Batalha' },
  fatima: { lat: 39.6321, lng: -8.6719, radiusMeters: 1000, label: 'Santuario de Fátima' },
  mira: { lat: 39.5434, lng: -8.7046, radiusMeters: 700, label: 'Grutas de Mira de Aire' },
  obidos: { lat: 39.3605, lng: -9.1570, radiusMeters: 1000, label: 'Óbidos' },
  rossio: { lat: 38.7139, lng: -9.1394, radiusMeters: 700, label: 'Rossio, Lisboa' },
  pavilhao: { lat: 38.7622806, lng: -9.0955818, radiusMeters: 1000, label: 'Pavilhão do Conhecimento, Lisboa' },
  oceanario: { lat: 38.7636, lng: -9.0937, radiusMeters: 180, label: 'Oceanário de Lisboa' },
  tejo: { lat: 38.7682, lng: -9.0922, radiusMeters: 350, label: 'Ribera del Tajo, Parque das Nações' },
  alfama: { lat: 38.7114, lng: -9.1301, radiusMeters: 500, label: 'Alfama, Lisboa' },
  belem: { lat: 38.6977, lng: -9.2068, radiusMeters: 1000, label: 'Belém, Lisboa' },
  lagos: { lat: 37.1099, lng: -8.6748, radiusMeters: 1000, label: 'Marina de Lagos' },
  algar: { lat: 37.0966, lng: -8.4719, radiusMeters: 700, label: 'Algar Seco, Carvoeiro' },
  albufeira: { lat: 37.0888, lng: -8.2524, radiusMeters: 1600, label: 'Centro antiguo de Albufeira' },
  jaima: { lat: 37.106434, lng: -8.25335, radiusMeters: 1800, label: 'Refugio de Lona, Albufeira' },
  setasSevilla: { lat: 37.3933, lng: -5.9918, radiusMeters: 650, label: 'Setas de Sevilla, Plaza de la Encarnación' },
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

function expedition(id, place, title, intro, actions, doneMessages, extras = {}) {
  return { id, kind: 'expedition', place, title, intro, actions, doneMessages, ...extras };
}

function conversation(id, place, promptMessages, replyMessages) {
  return { id, kind: 'conversation', place, promptMessages, replyMessages, scriptedReply: true };
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
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días, Paula y Hugo. Antes de movernos necesito ordenar todo lo que ha ocurrido.',
    'El eclipse dañó casi todos mis recuerdos anteriores. La carta que preparé antes del ataque nos dejó el mapa de doce ventanas y confirmó que sois mis aliados.',
    'En Amarante comprobasteis el puente, su historia y el Tâmega. Después el chat sufrió interferencias. Sospechamos de Topoloco, pero aún no sabemos cómo entró ni si causó mi amnesia.',
    'En Magikland descubristeis el Cazarrisas: un programa firmado por Topoloco que estudia qué miráis y por qué un momento se convierte en recuerdo.',
    { from: 'topotina', text: 'En Magikland entré yo. Recuerdo que Topotino es mi hermano y demostré que construimos el comunicador juntos. Él todavía no me recuerda.' },
    { from: 'topotino', text: 'Es bastante incómodo. Sobre todo porque también ha recordado exactamente cuántos cables tengo sin ordenar.' },
    'En el Hotel do Parque y en Buçaco comprobasteis que un lugar puede conservar partes de épocas distintas. Buçaco dejó un fragmento con arcos apuntados, piedra tallada y un nombre borrado.',
    { from: 'topotina', text: 'Eso es lo que sabemos. Ignoramos qué quiere hacer Topoloco con los recuerdos, dónde están las demás ventanas y si el contador de Sombra detectará otra intrusión.' },
    'La única pista abierta señala Portugal dos Pequenitos. Cuando lleguéis, veremos qué necesita que comprobéis allí.'
  ],
  steps: [
    ...withOrder(
      onArrival(expedition('portugal-pequenitos-expedicion', 'Portugal dos Pequenitos', 'La búsqueda del nombre borrado', 'Topoloco borró el nombre del fragmento. Encontrad el monumento representado sin empezar por las placas.', [
        'Entrad en Portugal Monumental y buscad una fachada con arcos apuntados, pináculos y mucha piedra tallada.',
        'Comparad esos rasgos con el fragmento de Buçaco y elegid la representación que mejor coincide.',
        'Mirad una puerta o ventana junto a vuestro cuerpo para comprobar que está construida a escala reducida.',
        'Solo al final, leed la placa o el plano y comprobad el nombre del monumento.'
      ], [
        'Expedición completada. El parque abrió en 1940 y fue proyectado por Cassiano Branco para enseñar mediante edificios a escala infantil.',
        'Una representación conserva rasgos que permiten reconocer el original, pero reduce el tamaño y puede seleccionar solo algunas partes.',
        { from: 'topotina', text: 'Buen método: primero habéis comparado formas y después habéis usado la placa para comprobar el nombre. Así no dependemos de lo que diga la pantalla.' },
        { from: 'topotino', text: 'Yo habría leído la placa primero. Por rapidez científica. Y porque los pináculos se me parecen todos cuando no he desayunado.' }
      ]), ARRIVAL_LOCATIONS.portugalPequenitos, [
        { from: 'topotina', text: 'Coordenada de Coimbra confirmada. Anoche movimos Buçaco; esta es la señal que ocupaba su lugar en el mapa de hoy.' },
        { from: 'topotino', text: 'O sea, ¿Portugal entero se ha encogido?' },
        { from: 'topotina', text: 'No. Es una representación a escala.' },
        { from: 'topotino', text: 'Lo sabía. Estaba comprobando si la técnica misteriosa mantenía la calma.' },
        { from: 'topotina', text: 'Buçaco devolvió un fragmento sin nombre. Aquí hay monumentos de todo Portugal representados en pequeño. Encontrad cuál coincide antes de mirar la placa.' }
      ]),
      [
        question('portugal-pequenitos-q1', 'Portugal dos Pequenitos', '¿Por qué se inauguró este parque-jardín en 1940?', ['Como espacio educativo y de juego pensado para la infancia', 'Para guardar los edificios originales de Portugal', 'Como base secreta de Topoloco'], 0, 'Correcto: nació como espacio educativo y de juego.', [
          'Bissaya Barreto lo ideó junto a una Casa da Criança. El arquitecto Cassiano Branco estudió materiales y rasgos de los lugares antes de representarlos.',
          { from: 'topotina', text: 'Eso es investigar antes de construir. Tomar medidas no es lo mismo que copiar sin explicar.' },
          { from: 'topotino', text: 'Anotado: medir primero. Mi último túnel salió con una curva que nadie había pedido.' }
        ], 'Buscad una opción que explique por qué los edificios están adaptados al tamaño infantil.'),
        question('portugal-pequenitos-q2', 'Portugal dos Pequenitos', '¿Qué estáis viendo al mirar una Torre de Belém pequeña?', ['Una representación construida del monumento', 'La torre original trasladada a Coimbra', 'Una fotografía sin volumen'], 0, 'Correcto: es una representación construida.', 'Conserva rasgos reconocibles, pero cambia la escala y el lugar. El original continúa en Belém y tiene su propia historia y función.', 'Comparad la puerta o las ventanas con vuestro tamaño.'),
        question('portugal-pequenitos-q3', 'Portugal dos Pequenitos', '¿Qué rasgo visible os ha ayudado más a encontrar la representación del fragmento?', ['Los arcos apuntados y la piedra muy tallada', 'Una cúpula lisa de cristal', 'Unas murallas de ladrillo rojo'], 0, 'Correcto. Esos rasgos encajan con una gran obra del gótico portugués.', [
          'En el gótico, los arcos apuntados conducen el peso hacia abajo y permiten ganar altura. Los pináculos también acentúan esa sensación vertical.',
          { from: 'topotino', text: 'Conclusión: el edificio apunta hacia arriba y mi pelo, en cambio, apunta hacia donde quiere.' }
        ], 'Mirad la forma de los arcos y cuánto trabajo tiene la piedra.'),
        question('portugal-pequenitos-q4', 'Portugal dos Pequenitos', 'Ahora sí: ¿qué nombre confirma la placa de la representación que habéis localizado?', ['Monasterio de Batalha', 'Monasterio de los Jerónimos', 'Torre de Belém'], 0, 'Exacto: el nombre borrado era Monasterio de Batalha.', [
          'La representación forma parte del conjunto dedicado a las Beiras. Sirve para reconocer el edificio, pero no puede reproducir su altura, sus materiales ni el espacio interior.',
          { from: 'topotina', text: 'La señal acaba de añadir tres datos: PROMESA, CORONA y 1385. Solo ha abierto una coordenada.' }
        ], 'Comprobad el nombre escrito en la placa o en el plano del parque.')
      ]
    ),
    nextStop('dia15-pista-batalha', 'Habéis unido la placa con PROMESA, CORONA y 1385. ¿Qué lugar debemos comprobar ahora?', ['Monasterio de Batalha', 'Palacio da Pena', 'Castillo de Leiria'], 0, [
      'La pista señala el Monasterio de Batalha.',
      { from: 'topotino', text: 'Lo habéis averiguado vosotros: primero por la arquitectura y después por la placa. Esa es nuestra única coordenada.' },
      { from: 'topotina', text: 'No mostraré la misión hasta que lleguéis. Necesitamos comparar la representación con el edificio real.' }
    ]),
    ...withOrder(
      expedition('batalha-expedicion', 'Monasterio de Batalha', 'Expedición de la promesa de piedra', 'Buscad cómo una victoria y una promesa se convirtieron en un edificio trabajado durante generaciones.', [
        'Mirad la fachada y elegid un detalle de piedra que necesite trabajo muy preciso.',
        'Entrad en la iglesia y comparad su altura con la sensación de la fachada.',
        'Visitad la Capela do Fundador o el Claustro Real.',
        'Localizad las Capelas Imperfeitas y comprobad qué parte quedó sin terminar.'
      ], [
        'Expedición completada. Las obras comenzaron en 1388 después de la victoria portuguesa y del voto de D. João I.',
        'Varias generaciones y maestros dejaron estilos distintos. Que las capillas estén inacabadas no las vuelve inútiles ni mudas.',
        { from: 'topotina', text: 'Alto. El fragmento guardado antes del eclipse contiene 3 · 13 · 1917. Aquí tenemos un rey, un voto y 1385. Topoloco cambió el destino.' },
        { from: 'topotino', text: '¡Nos ha mandado al monasterio equivocado! Bonito, importantísimo y equivocado. Qué manera tan elegante de fastidiar.' },
        { from: 'system', text: 'TRANSMISIÓN INTERCEPTADA · «Gracias por visitar mi desvío. Una promesa a la Virgen se parece mucho a otra pista... si no miráis las fechas. T.»' },
        { from: 'topotina', text: 'Ese fue su error. Conservó la relación con la Virgen, pero sustituyó protagonistas y fecha.' }
      ]),
      [
        onArrival(question('batalha-q1', 'Monasterio de Batalha', '¿Por qué se empezó a construir el monasterio?', ['Por una promesa ligada a una victoria', 'Para ocultar un parque acuático', 'Porque las Capelas Imperfeitas ya existían'], 0, 'Exacto. La promesa y la victoria están en el origen del monumento.', 'La construcción comenzó en 1388 y convirtió una decisión histórica en un lugar de memoria.', 'Pensad qué hecho y qué promesa explican su nombre y su origen.'), ARRIVAL_LOCATIONS.batalha, [
          { from: 'topotino', text: 'En Coimbra encontrasteis esta representación sin que nadie os regalara el nombre. Ahora comprobaremos si la pista encaja de verdad.' },
          { from: 'topotino', text: 'Ahora sí: estáis ante el Monasterio de Batalha. Comparad lo que una reproducción puede mostrar con los materiales, el tamaño y el espacio del edificio real.' }
        ]),
        question('batalha-q2', 'Monasterio de Batalha', '¿Qué enseñan las Capelas Imperfeitas?', ['Que una obra incompleta también puede tener valor e historia', 'Que nunca se comenzó a trabajar en ellas', 'Que todo el monasterio está sin techo'], 0, 'Muy bien. Incompleto no significa vacío.', [
          'Las capillas se pensaron como panteón de la dinastía de Avis. Varios maestros trabajaron durante generaciones y dejaron estilos distintos.',
          { from: 'topotina', text: 'Borrón había marcado INÚTIL sobre la parte abierta. Paula y Hugo acaban de demostrar que inacabado no significa sin historia.' },
          { from: 'topotino', text: 'Mi madriguera lleva años inacabada. Por fin una defensa académica impecable.' },
          'Bajo el 1385 falso aparece la clave auténtica: 1917, tres niños pastores y un lugar donde contaron que se les apareció la Virgen.'
        ], 'Mirad qué partes existen aunque el conjunto no se terminara como estaba previsto.')
      ],
      'question-first'
    ),
    nextStop('dia15-pista-fatima', 'La pista auténtica dice: 1917, tres niños pastores y apariciones de la Virgen. ¿Qué lugar señala?', ['Santuario de Fátima', 'Catedral de Oporto', 'Monasterio de Batalha'], 0, [
      'Habéis reconstruido la pista: señala Fátima.',
      { from: 'topotino', text: 'Topoloco cambió un relato vinculado a la Virgen por otro para desviarnos. Las fechas y los protagonistas lo han delatado.' },
      { from: 'topotina', text: 'Coordenada de Fátima enviada. No hay ninguna parada más visible detrás.' }
    ]),
    ...withOrder(
      onArrival(expedition('fatima-expedicion', 'Fátima', 'Expedición de la pista auténtica', 'Comprobad en el lugar real los tres datos que Topoloco intentó ocultar.', [
        'Localizad la Capelinha das Aparições.',
        'Buscad en carteles o dentro de la basílica los nombres Lúcia, Francisco y Jacinta.',
        'Localizad la fecha 1917 o el día 13 en alguna explicación del santuario.',
        'Comparad la pequeña Capelinha con la explanada y las dos basílicas.'
      ], [
        'Comprobado. El santuario conserva el relato de Lúcia, Francisco y Jacinta sobre las apariciones de 1917 en Cova da Iria.',
        'Topoloco conservó «Virgen» para que el señuelo pareciera correcto, pero cambió tres niños por un rey y 1917 por 1385.',
        'La Capelinha es pequeña, pero señala el lugar central del relato. El tamaño del edificio y su importancia no son la misma cosa.'
      ]), ARRIVAL_LOCATIONS.fatima, [
        { from: 'topotino', text: 'Habéis llegado a Fátima. Aquí podremos comprobar si los tres datos recuperados son verdaderos.' },
        { from: 'topotina', text: 'Buscad personas, fecha y lugar. Yo vigilaré que Topoloco no vuelva a cambiar la señal mientras la estáis leyendo.' }
      ]),
      [
        question('fatima-q1', 'Fátima', '¿Quiénes eran los tres niños del relato de las apariciones de 1917?', ['Lúcia, Francisco y Jacinta', 'João, Filipa y Henrique', 'Cassiano, Bissaya y Huguet'], 0, 'Correcto: Lúcia, Francisco y Jacinta.', [
          'Eran niños pastores. Según su relato, vieron por primera vez a una señora «más brillante que el sol» en Cova da Iria el 13 de mayo de 1917.',
          { from: 'topotino', text: 'Tres niños detectaron algo que los adultos tardaron años en estudiar. Me parece una magnífica tradición de trabajo.' }
        ], 'Buscad los tres nombres en los carteles o en la basílica.'),
        question('fatima-q2', 'Fátima', '¿Para qué sirve una explanada tan grande?', ['Para conectar y reunir a muchas personas', 'Para esconder la Capelinha', 'Para demostrar que una basílica es más verdadera'], 0, 'Sí. Organiza movimientos y encuentros de una comunidad numerosa.', [
          'El recinto une la Basílica do Rosário y la Basílica da Santíssima Trindade y permite recibir grandes asambleas de peregrinos.',
          'El tamaño responde a una función. No demuestra que una creencia sea más verdadera ni sustituye la importancia de la Capelinha.'
        ], 'Mirad cómo circulan las personas y qué edificios conecta.')
      ]
    ),
    recovery('recuperacion-dia15', '¿Qué ha permitido descubrir el engaño de Topoloco?', ['Comparar arquitectura, protagonistas y fechas en los lugares reales', 'Aceptar la primera señal sin comprobarla', 'Pensar que todos los lugares religiosos cuentan lo mismo'], 0, 'Sombra retirada. Habéis detectado un señuelo comparando datos concretos.', 'Topoloco conserva una pequeña ventaja, pero su truco ya no funciona.'),
    route('ruta-dia16', 'La siguiente ventana muestra pasos enormes impresos en roca, pero ningún hueso. ¿Cuál es la primera señal de mañana?', ['Pegadas de Dinossáurios', 'Museu do Côa', 'Parque de Serralves'], 0, [
      'Primera señal encontrada: Pegadas de Dinossáurios.',
      'Solo sabemos que tendremos que reconstruir el movimiento de un animal ausente por las marcas que dejó.',
      'Llevad calzado con buen agarre, agua y protección solar. Lo demás tendrá que aparecer allí. Ahora descansad.'
    ], { setFlags: ['completado_bucaco_batalha_fatima'], water: 'Agua de la Promesa' })
  ]
};

packs['008-huellas-mira-obidos'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    { from: 'topotina', text: 'Buenos días. He detectado algo raro en el canal. No quiero escribirlo de forma normal por si alguien está mirando.' },
    { from: 'topotina', text: 'OCOLOPOT ED AÍPSE NU SOMENET EUQ OERC' },
    { from: 'topotino', text: '¿Ahora hablamos del revés? Genial. Bastante trabajo me cuesta recordar hacia delante.' },
    { from: 'topotina', text: 'Leedlo desde el final: CREO QUE TENEMOS UN ESPÍA DE TOPOLOCO.' },
    { from: 'topotina', text: 'Y hay algo más. Creo que es un dinosaurio.' },
    { from: 'topotino', text: 'Claro. Un dinosaurio espía. Seguro que también lleva gabardina y sombrero.' },
    { from: 'topotino', text: 'Solo tenemos una pista comprobable: unas huellas enormes en roca. Vamos a investigar si ha pasado por allí.' }
  ],
  steps: [
    ...withOrder(
      expedition('pegadas-expedicion', 'Pegadas de Dinossáurios', 'Operación: encontrar al espía', 'Buscad rastros reales. No convirtáis una sospecha en un hecho.', [
        'Seguid el circuito hasta ver una pista de saurópodo desde dos puntos.',
        'Buscad huellas delanteras y traseras o diferencias de tamaño dentro del rastro.',
        'Usad un panel para localizar la antigüedad aproximada del yacimiento.',
        'Decid qué sabéis por las marcas y qué solo estáis suponiendo.'
      ], [
        'Expedición completada. La losa conserva cerca de veinte pistas y una de ellas alcanza 147 metros.',
        'Las marcas tienen unos 175 millones de años. Permiten estimar dirección, tamaño y forma de moverse, pero no el color ni las intenciones.',
        { from: 'topotina', text: 'He detectado una marca reciente de tres garras y una nota: «TRABAJO DE ESPÍA EXTRAORDINARIO». Demasiado reciente y demasiado presumida.' },
        { from: 'topotino', text: 'Eso no demuestra que sea un dinosaurio. Sí demuestra que alguien necesita abuela.' }
      ]),
      [
        question('pegadas-q1', 'Pegadas de Dinossáurios', '¿Qué es una huella fosilizada?', ['Un fósil de la actividad del animal', 'Un hueso del pie', 'Una escultura moderna'], 0, 'Correcto. Conserva una acción: pisar.', 'Por eso se llama icnofósil. Informa del movimiento sin conservar el cuerpo.', 'Pensad si estáis viendo una parte del cuerpo o la marca que produjo.'),
        question('pegadas-q2', 'Pegadas de Dinossáurios', '¿Qué NO puede asegurar una pista por sí sola?', ['La dirección aproximada del movimiento', 'Que el animal apoyó allí los pies', 'El color exacto de su piel'], 2, 'Exacto. La piel no dejó esa información en las pisadas.', 'Una buena investigación dice también qué desconoce. Borrón gana cuando una deducción se presenta como observación.', 'Buscad qué dato no dejó ninguna marca en la roca.')
      ]
    ),
    nextStop('dia16-pista-mira', 'No hemos encontrado al espía. Gotas ha enviado una pista: «Si no está en la superficie, buscad en las entrañas de la Tierra, donde el agua abre galerías». ¿Adónde vamos?', ['Grutas de Mira de Aire', 'Grutas de Santo António', 'Mina de Sal-Gema de Loulé'], 0, [
      'La señal conduce a las Grutas de Mira de Aire.',
      'Es una búsqueda, no un salto: comprobaremos si el espía se ha ocultado bajo tierra.',
      { from: 'topotina', text: 'La transmisión lleva una firma aliada: GOTAS. Está incompleta. Solo podré verificarla cuando lleguéis.' },
      { from: 'topotino', text: 'Gotas añade: no correr, no lamer estalactitas, no adoptar murciélagos y no comprobar personalmente la profundidad de ningún agujero.' }
    ]),
    ...withOrder(
      expedition('mira-expedicion', 'Grutas de Mira de Aire', 'Rastreo en las entrañas de la Tierra', 'Buscad al espía mientras observáis cómo el agua construye la cueva.', [
        'Localizad una estalactita que baje del techo y una estalagmita que suba del suelo.',
        'Buscad una columna o un punto donde ambas formas casi se unan.',
        'Observad un lago, curso o zona húmeda del recorrido.',
        'Buscad una marca reciente, una sombra o un escondite posible sin salir del recorrido.'
      ], [
        { from: 'gotas', text: 'Hecho. El agua de lluvia absorbe dióxido de carbono, entra por grietas y puede disolver lentamente parte de la roca caliza.' },
        { from: 'gotas', text: 'Cuando el agua pierde ese gas, deja carbonato cálcico. Repetido gota a gota, el depósito va construyendo las formaciones.' },
        { from: 'topotino', text: 'No hay dinosaurio. Ni siquiera uno con brazos ridículamente pequeños. Pero alguien ha seguido leyendo el canal.' },
        { from: 'gotas', text: 'Entonces necesitamos reorganizarnos en un lugar que controle entradas y salidas. Yo votaría por algo con murallas. Muchas murallas.' }
      ]),
      [
        onArrival(question('mira-q1', 'Grutas de Mira de Aire', '¿Cuál crece desde el techo?', ['La estalactita', 'La estalagmita', 'El lago'], 0, 'Correcto: la estalactita cuelga del techo.', 'La estalagmita crece desde el suelo por las gotas que caen. Si llegan a unirse, pueden formar una columna.', 'Recordad la forma que habéis visto colgar.'), ARRIVAL_LOCATIONS.mira, [
          { from: 'topotino', text: 'Las huellas conservan un paso sobre la superficie. La nueva pista apunta a marcas creadas gota a gota bajo tierra.' },
          { from: 'system', text: 'Gotas se ha unido al canal.' },
          { from: 'topotino', text: '¿¡Cómo que Gotas se ha unido!? ¿Puede entrar cualquiera en mi CHAT SECRETO? ¡Topotina!' },
          { from: 'topotina', text: 'No cualquiera. Ha usado una invitación de un solo uso, firmada por ti antes del eclipse y verificada por mí.' },
          { from: 'topotino', text: '¿Mi yo anterior repartía llaves del chat? Cada minuto me cae un poco peor ese individuo.' },
          { from: 'gotas', text: 'Hola, Paula y Hugo. Soy Gotas. Conozco estas cuevas y recuerdo a Topotino, aunque él tenga ahora la memoria como un colador.' },
          { from: 'topotino', text: 'Mis coladores están perfectamente archivados. A ti, en cambio, todavía no te recuerdo.' },
          { from: 'topotina', text: 'Firma verificada. Es Gotas, nuestro enlace en Mira de Aire. No hay ninguna brecha nueva en el canal.' },
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
    nextStop('dia16-pista-obidos', 'Gotas busca un refugio cercano: ciudad medieval en alto, una puerta principal, murallas, castillo y calles estrechas. ¿Qué lugar encaja?', ['Óbidos', 'Guimarães', 'Marvão'], 0, [
      'La silueta encaja con Óbidos.',
      'Óbidos será EL REFUGIO. Allí comprobaremos si podemos vigilar las entradas antes de hablar del espía.'
    ]),
    ...withOrder(
      onArrival(expedition('obidos-expedicion', 'Óbidos', 'Comprobar EL REFUGIO', 'Pensad como defensores medievales: vigilad accesos, altura y recorridos.', [
        'Entrad por Porta da Vila: observad por qué una puerta concentra el riesgo aunque exista toda una muralla.',
        'Recorred una calle estrecha y localizad desde dónde se podría ver a alguien acercarse.',
        'Mirad murallas, posición elevada y castillo desde un punto seguro; decid qué ventaja ofrece cada uno.',
        'Entrad en la Livraria de Santiago: una antigua iglesia que ahora protege historias.'
      ], [
        'Expedición cerrada. Óbidos conserva muralla, puertas y trazado, pero también viviendas, comercio y cultura actuales.',
        'Una puerta permite controlar el acceso; la altura amplía la vista; las murallas frenan y canalizan la entrada.',
        'La Livraria de Santiago cambió de función sin perder su memoria: antes protegía una comunidad religiosa; hoy guarda historias.'
      ]), ARRIVAL_LOCATIONS.obidos, [
        { from: 'topotino', text: '¡Hemos llegado a Óbidos! Antes de seguir al castillo, tengo una noticia importante: os he cogido una casita dentro de la muralla. Desde ahora, la casa donde dormís es EL REFUGIO.' },
        { from: 'topotino', text: 'Está en Rua do Facho 35. Para entrar, usad el candado del medio: la clave es 7549. Topoloco tiene demasiada afición por las puertas ajenas, así que usadlo con los adultos y no lo escribáis en el chat.' },
        { from: 'topotina', text: 'Comprobad puerta, altura, murallas y calles. Si el espía nos sigue, quiero saber por dónde podría entrar y desde dónde lo veríamos.' }
      ]),
      [
        question('obidos-q1', 'Óbidos', '¿Qué demuestra mejor que Óbidos sigue siendo una ciudad viva?', ['Que dentro de edificios antiguos hay usos actuales', 'Que nadie puede entrar', 'Que todas las calles están vacías'], 0, 'Exacto. El uso actual convive con la estructura heredada.', 'Vivir en un lugar histórico implica adaptar, cuidar y reinterpretar, no congelarlo.', 'Pensad en la tienda, iglesia o librería que habéis localizado.'),
        question('obidos-q2', 'Óbidos', '¿Cuál es una observación y no una interpretación?', ['La puerta tiene azulejos y un paso estrecho', 'La puerta parece enfadada', 'La muralla quiere esconder secretos'], 0, 'Correcto. Describe rasgos que otra persona puede comprobar.', 'Las interpretaciones pueden ser divertidas, pero deben distinguirse de la evidencia visible.', 'Elegid la frase que una fotografía también podría comprobar.')
      ]
    ),
    recovery('recuperacion-dia16', '¿Qué regla nos protege mejor de un espía que quiere engañarnos?', ['Separar lo observado de lo que suponemos', 'Inventar la explicación más emocionante', 'Aceptar cualquier nota firmada por un dinosaurio'], 0, 'Sombra retirada. Topoloco no puede convertir una sospecha en una falsa certeza.', 'El espía conserva ventaja, pero ya no puede obligarnos a inventar pruebas.'),
    route('ruta-dia17', 'La próxima señal muestra dinosaurios completos por fuera, fósiles y científicos trabajando por dentro. ¿Cuál es la primera parada?', ['Dino Parque Lourinhã', 'Museu da Lourinhã', 'Castillo de Leiria'], 0, [
      'Primera señal encontrada: Dino Parque Lourinhã.',
      'Allí hay modelos, fósiles, huevos, embriones, científicos y laboratorio. Si el espía es un dinosaurio, podremos descubrir quién es y qué partes de su historia son verdad.',
      { from: 'topotina', text: 'La última marca de tres garras apunta en esa dirección. Mañana podemos identificarlo.' },
      'Preparad calzado cómodo, agua y protector solar para el recorrido exterior. Descansad.'
    ], { setFlags: ['completado_huellas_mira_obidos'], water: 'Agua del Tiempo Profundo' })
  ]
};

packs['009-dinoparque-lisboa'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Hoy tenemos una misión clara: identificar al dinosaurio que espía para Topoloco.',
    'La marca de tres garras termina en Dino Parque. Allí hay modelos a tamaño real, fósiles, huevos, embriones y científicos trabajando.',
    { from: 'topotina', text: 'No buscamos el dinosaurio más impresionante. Buscamos pruebas que separen lo real, la reconstrucción y lo que todavía no sabemos.' },
    { from: 'topotino', text: 'Y si encontráis uno pequeño, rojo y muy presumido, avisad. Lo de pequeño no se lo digáis a la cara.' }
  ],
  steps: [
    ...withOrder(
      expedition('dinoparque-expedicion', 'Dino Parque Lourinhã', 'Investigación: ¿quién es el espía?', 'Recorred modelos, museo y zona de trabajo científico.', [
        'Elegid un modelo a tamaño real y buscad qué partes proceden de pruebas y cuáles son reconstrucción.',
        'Localizad un fósil real y una réplica; comprobad cómo están identificados.',
        'Buscad el laboratorio o una explicación de cómo limpian, comparan y estudian fósiles.',
        'Encontrad información sobre nidos, huevos o embriones de dinosaurios portugueses.'
      ], [
        'Un fósil es evidencia material. Una réplica copia una pieza. Un modelo reúne evidencias e interpretación para mostrar un animal completo.',
        'Los huevos y embriones de Lourinhanosaurus permiten estudiar su desarrollo. El laboratorio muestra que cada conclusión necesita trabajo, comparación y revisión.',
        { from: 'topotina', text: 'Movimiento dentro del canal. Alguien está intentando escribir con... dos brazos extremadamente cortos.' }
      ]),
      [
        question('dinoparque-q1', 'Dino Parque Lourinhã', '¿Todo modelo muestra exactamente cómo era el animal?', ['Sí, los científicos conocen cada detalle', 'No: combina evidencias con interpretaciones revisables', 'No: todos los modelos son inventados'], 1, [
          'Correcto. Una reconstrucción científica usa evidencias, pero debe reconocer lo que interpreta.',
          { from: 'system', text: 'Un participante desconocido se ha unido al canal: LOURI.' },
          { from: 'topotino', text: '¡¿CÓMO HA ENTRADO?! ¡Topotina, cambia la contraseña!' },
          { from: 'topotina', text: 'Ya la he cambiado.' },
          { from: 'topotino', text: '¿Por cuál?' },
          { from: 'topotina', text: 'topotino1234' },
          { from: 'topotino', text: 'ESO NO ES CAMBIARLA.' },
          { from: 'louri', text: 'Soy Louri. Tyrannosaurus Rex. Espía profesional. Rugidor de élite. Infiltrador extraordinario.' },
          { from: 'louri', text: 'Y sí. Era yo. Lo de extraordinario lo digo yo, pero normalmente tengo razón.' },
          { from: 'topotino', text: '¿Tú eres el espía? Tienes los brazos tan cortos que casi no llegas al teclado.' },
          { from: 'louri', text: 'Son brazos tácticos. Reducen mi superficie detectable.' },
          { from: 'louri', text: 'Topoloco escondió un comunicador mío dentro del dinosaurio rojo de Burger King. Yo estaba al otro lado. Sus ojos eran mi cámara.' },
          { from: 'topotino', text: '¿NOS HAN INFILTRADO UN ESPÍA A TRAVÉS DE UN MENÚ INFANTIL?' },
          { from: 'topotina', text: 'Técnicamente fue bastante eficaz.' },
          { from: 'topotino', text: '¡NO LE DES IDEAS!' }
        ], 'No confundáis una reconstrucción completa con un cuerpo conservado.'),
        question('dinoparque-q2', 'Dino Parque Lourinhã', 'Cuando faltan pruebas, ¿qué respuesta es más científica?', ['Inventar el detalle y afirmarlo con seguridad', 'Decir probablemente, según las evidencias o todavía no sabemos', 'No volver a investigar'], 1, [
          'Exacto. Reconocer un límite hace que una conclusión sea más honesta, no más débil.',
          { from: 'louri', text: 'Eso no encaja. Padre dice que me creó perfecto. Que conoce cada color, cada rugido y cada escama.' },
          { from: 'louri', text: 'Cuando salí del huevo, Topoloco era la primera persona que vi. Me dijo: «Yo soy tu padre».' },
          { from: 'louri', text: 'Nunca habló de fósiles. Ni de hipótesis. Decía que dudar era un fallo.' },
          { from: 'system', text: 'Orden interceptada: «UNIDAD LOURI. Desviación detectada. Hace demasiadas preguntas. Si continúa dudando, será considerada defectuosa».' },
          { from: 'louri', text: '¿Defectuosa? Pero soy su hijo.' },
          { from: 'topotina', text: 'Tener preguntas no significa estar roto. Significa que estás comprobando lo que te contaron.' },
          { from: 'topotino', text: 'Si hacer preguntas fuera un defecto, yo habría sido retirado del mercado hace años.' }
        ], 'Buscad en los paneles palabras que reconozcan un límite del conocimiento.')
      ]
    ),
    question('louri-cambio-bando', 'Dino Parque Lourinhã', '¿Qué debe hacer Louri al descubrir pruebas que contradicen a Topoloco?', ['Ignorarlas para seguir sintiéndose perfecto', 'Compararlas, hacer preguntas y corregir su idea', 'Romper todos los modelos'], 1, [
      { from: 'louri', text: 'He decidido no volver a trabajar para Topoloco.' },
      { from: 'louri', text: 'A menos que me pida perdón. Y me dé algo muy bueno.' },
      { from: 'topotina', text: 'Louri.' },
      { from: 'louri', text: 'Vale. No vuelvo.' },
      { from: 'louri', text: 'Escuché su plan. Construye una máquina que captura recuerdos, separa unas partes de otras y guarda una sola versión en su museo.' },
      { from: 'louri', text: 'Tiene una operación en Lisboa. Repetía: «ciudad destruida, ciudad reconstruida, decidir qué conservar».' },
      { from: 'louri', text: 'No sé cómo funciona toda la máquina. Solo tengo un fragmento del plano y una coordenada.' }
    ], 'Cambiar una idea ante nuevas pruebas no es un defecto.'),
    nextStop('dia17-pista-lisboa', 'El rótulo de Topoloco mezcla una reconstrucción con una cuadrícula de calles y dos grandes plazas. ¿Qué ciudad debemos comprobar?', ['Lisboa', 'Oporto', 'Setúbal'], 0, [
      'La pista señala Lisboa.',
      'No vamos porque aparezca en un cartel al azar. Es la coordenada que Louri robó de la máquina: una ciudad destruida y reconstruida donde Topoloco tiene un módulo.',
      'Louri se queda en Dino Parque. Su parte en esta aventura ha terminado.'
    ]),
    ...withOrder(
      expedition('lisboa-llegada-expedicion', 'Lisboa · Baixa y Rossio', 'Expedición de orientación', 'Al llegar, leeremos la ciudad sin convertir el paseo en otro examen largo.', [
        'Localizad Restauradores o Rossio.',
        'Seguid una calle recta de la Baixa y observad cómo conecta dos plazas.',
        'Buscad un edificio antiguo con un uso actual.',
        'Desde un punto seguro, identificad una subida que conduzca hacia otra parte de la ciudad.'
      ], [
        'Ya está. Las calles rectas de la Baixa ayudan a orientarse y pertenecen a una reconstrucción posterior al terremoto de 1755.',
        'El plano de Louri encaja con la reconstrucción posterior al terremoto de 1755. Topoloco estudia cómo una ciudad decide qué cambia y qué conserva.'
      ]),
      [
        onArrival(question('lisboa-llegada-q1', 'Lisboa · Baixa y Rossio', '¿Qué ayuda más a orientarse en la Baixa?', ['La relación entre calles rectas y plazas', 'Cerrar los ojos', 'Seguir siempre la calle más empinada'], 0, 'Correcto. La estructura urbana crea conexiones legibles.', 'La Baixa fue reconstruida con una trama regular. Mañana compararemos esa organización con otros sistemas.', 'Mirad qué calles permiten ver o alcanzar otra plaza.'), ARRIVAL_LOCATIONS.rossio, [
        { from: 'topotino', text: 'La coordenada de Louri termina aquí. Topoloco ha escondido en la Baixa una pieza de la Máquina de los Recuerdos.' },
          { from: 'topotino', text: 'Ya estáis en Rossio. Antes de investigar Lisboa, vamos a aprender a orientarnos en su trazado real.' }
        ]),
        question('lisboa-llegada-q2', 'Lisboa · Baixa y Rossio', '¿Qué revela un edificio antiguo con uso actual?', ['Que una ciudad puede cambiar sin borrar todas sus capas', 'Que el edificio nunca cambió', 'Que el pasado ya no importa'], 0, 'Sí. Uso nuevo y huella antigua pueden convivir.', 'Esta idea contradice el museo de una sola versión que prepara Topoloco.', 'Comparad lo que conserva el edificio con lo que se hace hoy dentro.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia17', '¿Qué ha liberado a Louri del engaño?', ['Distinguir evidencias, hipótesis y cosas que aún no sabemos', 'Aceptar la voz más segura', 'Dejar de hacer preguntas'], 0, 'Interferencia retirada. Topoloco pierde un espía porque Paula y Hugo comprobaron sus afirmaciones.', 'Topoloco conserva ventaja, pero ya conocemos su máquina y su operación en Lisboa.'),
    route('ruta-dia18', 'El plano de Louri marca el módulo que separa causas y coincidencias. Está en un centro de Lisboa lleno de experimentos para tocar y probar. ¿Cuál es la primera señal de mañana?', ['Pavilhão do Conhecimento', 'Museu da Ciência de Coimbra', 'Planetário do Porto'], 0, [
      'Primera señal encontrada: Pavilhão do Conhecimento.',
      'Topoloco usa ese módulo para cortar las conexiones entre recuerdos. Si aprendemos cómo prueba causas y efectos, podremos estropearlo. No hay otra parada visible todavía.',
      'Preparad calzado cómodo y una prenda ligera para interiores. Descansad.'
    ], { setFlags: ['completado_dinoparque_lisboa'] })
  ]
};

packs['010-lisboa-ciencia-oceanario'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días, Paula y Hugo. Antes de salir: ayer Topoloco rompió el chat secreto.',
    { from: 'topotina', text: 'He revisado el registro. Se enfadó al descubrir que Louri había dejado de obedecerle. Entonces mezcló mensajes antiguos para hacernos volver a Dino Parque.' },
    'Pues casi lo consigue. Estoy enfadadísimo. También un poco impresionado. Pero sobre todo enfadadísimo.',
    { from: 'topotina', text: 'Lo hemos reparado juntos. El canal ahora corta cualquier transmisión antigua que intente volver a colocarse delante del mensaje actual.' },
    'Y he dejado un botón pequeño para actualizar la señal si una llegada no aparece. Esta vez se ve. He mirado dos veces.',
    'La pista que Louri nos dio antes de cerrar su canal sobrevivió al ataque. Señala el Pavilhão do Conhecimento.',
    'Allí está el módulo de la Máquina de los Recuerdos que sirve para separar causas y coincidencias. Hoy vamos a encontrarlo y a estropearlo con pruebas de verdad.',
    'Cuando lleguéis al Pavilhão, actualizad la señal. Hasta entonces no abriré la misión del edificio.'
  ],
  steps: [
    ...withOrder(
      onArrival(expedition('pavilhao-expedicion', 'Pavilhão do Conhecimento', 'Expedición de causa y efecto', 'Elegid módulos que podáis probar con seguridad y respetad sus instrucciones.', [
        'Probad dos módulos situados en zonas distintas.',
        'Antes del segundo intento, predecid qué cambiará si modificáis una acción.',
        'Repetid un módulo cambiando solo una cosa.',
        'Elegid el resultado que más os sorprendió.'
      ], [
        'Expedición completada. Habéis cambiado una variable y observado su efecto.',
        'Eso permite distinguir coincidencia de causa. Topoloco preferiría quedarse solo con el resultado bonito.'
      ]), ARRIVAL_LOCATIONS.pavilhao, [
        { from: 'topotina', text: 'Llegada confirmada. La señal del módulo está dentro de este edificio.' },
        { from: 'topotino', text: 'Aquí empieza la operación. Probad, cambiad una sola cosa y observad qué ocurre: así sabremos qué parte de la máquina debemos sabotear.' }
      ]),
      [
        question('pavilhao-q1', 'Pavilhão do Conhecimento', '¿Cómo se comprueba mejor qué causó un cambio?', ['Cambiando una cosa cada vez', 'Cambiándolo todo a la vez', 'Repitiendo la explicación sin probar'], 0, 'Exacto. Así podemos relacionar causa y efecto.', 'Controlar una variable no hace el experimento aburrido: hace que la conclusión sea más fuerte.', 'Recordad qué hicisteis distinto entre dos intentos.'),
        question('pavilhao-q2', 'Pavilhão do Conhecimento', 'Si la predicción falla, ¿qué conviene hacer?', ['Ocultarla', 'Compararla con el resultado y corregir la idea', 'Culpar al módulo'], 1, 'Muy bien. Corregir es parte de investigar.', 'Una predicción equivocada puede enseñar más que un acierto casual. La máquina de Topoloco no sabe presumir de una corrección.', 'Pensad qué información nueva os dio el resultado real.')
      ]
    ),
    nextStop('dia18-pista-oceanario', 'El módulo dañado intenta separar seres vivos como si no dependieran unos de otros. Su salida muestra un océano conectado y la firma VASCO. ¿Dónde podemos demostrar que se equivoca?', ['Oceanário de Lisboa', 'Aquário Vasco da Gama', 'Sea Life Porto'], 0, [
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
    ...withOrder(
      onArrival(expedition('alfama-visita-expedicion', 'Rossio · visita guiada de Alfama', 'Investigar Alfama a fondo', 'Topoloco se refugia en Alfama y está rompiendo el canal. Reuníos a las 10:30 en la estatua central de Praça Dom Pedro IV, junto a los paraguas blancos de Live History.', [
        'A las 10:30, comprobad que estáis en la Praça Dom Pedro IV, no en la estación de Rossio.',
        'Durante el recorrido, anotad mentalmente dos historias o leyendas y separadlas de los datos históricos.',
        'Fijaos en cómo cambian las calles al pasar de Baixa a Mouraria y Alfama: anchura, pendientes, curvas y murallas.',
        'Recordad al menos dos lugares visitados, una explicación sobre el terremoto de 1755 y una referencia al fado o a la mezcla cultural del barrio.'
      ], [
        'Expedición completada. Habéis recorrido los barrios antiguos sin confundir una leyenda entretenida con una prueba histórica.',
        'Alfama y Mouraria conservaron buena parte de su trazado porque sobrevivieron al terremoto de 1755. Sus callejuelas, pendientes, miradores y mezcla cultural cuentan una historia distinta a la cuadrícula de la Baixa.',
        { from: 'topotino', text: 'He recuperado una línea segura. Topoloco ha salido por una escalera tan estrecha que hasta su ego ha tenido que ponerse de lado. Esta tarde seguiremos su señal hasta los Jerónimos.' }
      ]), ARRIVAL_LOCATIONS.rossio, [
        { from: 'topotino', text: '¡Interferencias! Topoloco está bloqueando mi señal y no consigo comunicarme bien. Solo he podido recuperar una coordenada: se está refugiando en Alfama.' },
        { from: 'topotino', text: 'La visita empieza a las 10:30 en la Praça Dom Pedro IV, la plaza grande de Rossio, junto a la estatua y los paraguas blancos. Atención: no es la estación de tren.' },
        { from: 'topotino', text: 'Investigad Alfama a fondo con el grupo y estad atentos a todo lo que cuenten. Yo corto ahora la comunicación hasta encontrar una solución segura. No sigáis ninguna señal que pretenda hablar en mi nombre.' }
      ]),
      [
        question('alfama-q1', 'Alfama · visita guiada', '¿Qué diferencia hay entre un dato histórico y una leyenda contada durante la visita?', ['El dato puede contrastarse con fuentes; la leyenda forma parte del relato y puede no estar demostrada', 'La leyenda siempre es falsa y el dato siempre es aburrido', 'Son exactamente lo mismo si el guía lo cuenta'], 0, 'Correcto. Escuchar una leyenda es interesante, pero no obliga a convertirla en un hecho.', 'Una visita puede reunir historia, memoria local y relatos populares. La clave es saber qué tipo de afirmación estamos escuchando.', 'Recordad si la explicación se presentó como documento, tradición o interpretación.'),
        question('alfama-q2', 'Alfama · visita guiada', '¿Qué observación ayuda a reconocer Alfama frente a la Baixa?', ['Calles estrechas, curvas y pendientes frente a la cuadrícula más recta de la Baixa', 'Todas las calles tienen exactamente la misma forma', 'Alfama no tiene relación con el río ni con los miradores'], 0, 'Muy bien. El trazado también conserva información sobre cómo creció la ciudad.', 'Alfama y Mouraria permiten caminar por una Lisboa más irregular, mientras la Baixa muestra la reconstrucción posterior al terremoto.', 'Elegid la opción que podríais comprobar caminando.'),
        question('alfama-q3', 'Alfama · visita guiada', '¿Qué debemos hacer si dos explicaciones de la visita no encajan del todo?', ['Recordar qué se observó, distinguir fuentes y mantener abierta la corrección', 'Elegir la versión más emocionante', 'Aceptar la primera versión para no molestar a Topoloco'], 0, 'Exacto. Una buena investigación escucha, compara y puede corregirse.', 'Eso es precisamente lo que expulsa a Topoloco: no puede controlar una historia cuando vosotros distinguís evidencia, memoria y relato.', 'Pensad qué parte visteis directamente y cuál os contaron.')
      ]
    ),
    recovery('recuperacion-dia18', '¿Qué protege mejor la visita de Alfama?', ['Escuchar, distinguir historia y leyenda, y corregir si una afirmación no encaja', 'Repetir la historia más llamativa', 'Seguir a Topoloco por cualquier calle'], 0, 'Sombra retirada. Topoloco ya no puede esconderse dentro de una historia sin que comprobéis sus capas.', 'La señal sigue activa, pero habéis recuperado el control del relato.'),
    nextStop('ruta-dia19', 'La señal que dejó Topoloco apunta a un monasterio relacionado con los viajes, el poder y el río. ¿Cuál es la prueba de esta tarde?', ['Mosteiro dos Jerónimos', 'Castelo de São Jorge', 'Oceanário de Lisboa'], 0, [
      'Primera señal encontrada: el Mosteiro dos Jerónimos.',
      'Después de investigar Alfama, seguiremos esta tarde la pista de los viajes y comprobaremos qué función cumple cada monumento de Belém.',
      'Llevad calzado cómodo, agua y protección para el sol. Manteneos atentos: las interferencias todavía no han desaparecido.'
    ], { setFlags: ['completado_lisboa_ciencia_oceanario'], water: 'Agua del Océano Único' })
  ]
};

packs['011-lisboa-historia-belem'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Ayer cerramos el ataque del chat y estropeamos el módulo que separaba causas y relaciones.',
    'Topoloco ha movido los datos al archivo histórico de Lisboa. Quiere guardar una ciudad sin terremoto, reconstrucción ni voces distintas.',
    'La señal empieza en el Mosteiro dos Jerónimos: Topoloco ha huido de Alfama hacia un lugar donde los viajes, la fe y el poder dejaron marcas en la piedra.'
  ],
  steps: [
    ...withOrder(
      onArrival(expedition('jeronimos-expedicion', 'Mosteiro dos Jerónimos', 'Expedición de piedra, viajes y poder', 'Movedos con los adultos y observad el exterior y los espacios permitidos sin convertir cada detalle en una certeza automática.', [
        'Localizad un detalle de piedra trabajado y describidlo sin inventar su significado.',
        'Buscad una referencia a viajes, navegación, religión o poder.',
        'Comparad una decoración repetida con una figura o elemento diferente.',
        'Separad lo que podéis observar de lo que el monumento pretende contar.'
      ], [
        'Expedición completada. Los Jerónimos reúnen arquitectura, memoria religiosa y relatos de viajes y poder.',
        'La piedra trabajada muestra decisiones de muchas manos; una decoración o un monumento puede transmitir un relato, pero no cuenta por sí solo toda la historia.',
        { from: 'topotino', text: 'Topoloco quería esconderse detrás de una fachada monumental. Mala suerte: las fachadas no saben guardar secretos cuando las observan dos exploradores atentos.' }
      ]), ARRIVAL_LOCATIONS.belem, [
        { from: 'topotino', text: 'La señal de Alfama termina aquí. Habéis llegado al Mosteiro dos Jerónimos: ahora comprobaremos qué parte de la historia cuenta la piedra y qué parte debemos investigar.' }
      ]),
      [
        question('jeronimos-q1', 'Mosteiro dos Jerónimos', '¿Qué tipo de afirmación es más segura después de observar un detalle de piedra?', ['Describir su forma y después separar la interpretación de la evidencia', 'Afirmar automáticamente quién lo talló y qué pensaba', 'Decir que toda la historia del edificio está en ese detalle'], 0, 'Correcto. Primero describimos; después interpretamos con cautela.', 'Un detalle puede abrir una pregunta histórica, pero no resolverla por sí solo.', 'Elegid la opción que otra persona podría comprobar mirando lo mismo.'),
        question('jeronimos-q2', 'Mosteiro dos Jerónimos', '¿Qué relación debemos comprobar en los Jerónimos?', ['La relación entre arquitectura, religión, viajes y poder', 'Que todas las piedras tengan exactamente la misma función', 'Que un monumento solo pueda tener una historia'], 0, 'Muy bien. Un monumento puede reunir varias capas y relatos.', 'Topoloco quiere reducirlo todo a una sola versión; vosotros conservaréis las conexiones y las diferencias.', 'Pensad qué elementos del lugar hablan de cada una de esas capas.')
      ]
    ),
    nextStop('dia19-pista-castelo', 'Desde los Jerónimos, la señal sube hacia una fortaleza en una colina desde la que Lisboa se ve como un mapa. ¿Dónde debemos seguir?', ['Castelo de São Jorge', 'Alfama', 'Parque das Nações'], 0, [
      'La señal conduce al Castelo de São Jorge.',
      'Desde arriba Lisboa parecía un mapa. Ahora necesitamos comprobar a pie lo que esa vista ocultaba.'
    ]),
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
      ],
      'question-first'
    ),
    nextStop('dia19-pista-belem', 'Desde la colina, la señal sigue el Tajo hacia una torre defensiva y monumentos relacionados con viajes. ¿Qué zona debemos comprobar?', ['Belém', 'Alfama', 'Rossio'], 0, [
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
          { from: 'topotino', text: 'Los Jerónimos y el castillo muestran que una ciudad cambia sin volverse una sola historia. La siguiente señal sigue el Tajo hacia los viajes que también la transformaron.' },
        { from: 'topotino', text: 'Habéis llegado a Belém. Ahora sí: buscad cómo la piedra, el río y los viajes se explican entre sí.' }
      ]),
      [
        question('belem-q1', 'Belém', '¿Cuál tuvo una función defensiva ligada a la entrada del Tajo?', ['La Torre de Belém', 'El Padrão dos Descobrimentos', 'Un pastel'], 0, 'Correcto: la Torre de Belém.', 'Su posición junto al agua formaba parte de un sistema defensivo. Hoy su función y su entorno han cambiado.', 'Mirad cuál está situado como control del paso por el río.'),
        question('belem-q2', 'Belém', '¿Qué diferencia mejor un monumento conmemorativo de una defensa?', ['El primero representa un relato; la segunda controla o protege un paso', 'Los dos hacen exactamente lo mismo', 'Una defensa no necesita posición'], 0, 'Exacto. Forma, función y relato no son lo mismo.', 'El Padrão fue concebido para conmemorar; la Torre tuvo usos defensivos. Compararlos evita una historia plana.', 'Pensad qué acción podía realizar cada construcción.')
      ]
    ),
    recovery('recuperacion-dia19', '¿Qué hizo Lisboa para seguir existiendo?', ['Cambió, reconstruyó y conservó capas distintas', 'Permaneció idéntica', 'Borró todos sus barrios antiguos'], 0, 'Sombra retirada. Topoloco ya no puede confundir permanencia con inmovilidad.', 'La versión única gana terreno, pero aún conserváis las diferencias.'),
    route('ruta-dia20', 'Al conservar las capas reales de Lisboa, aparece una señal entre animales africanos en grandes espacios. ¿Qué nombre está intentando mostrarnos?', ['Badoca Safari Park', 'Oceanário', 'Tapada Nacional de Mafra'], 0, [
      'La pantalla escribe Badoca Safari Park, pero la señal tiene cortes extraños. Topotina no puede confirmar que sea auténtica.',
      'No os mandaré allí todavía. Mañana comprobaremos el canal antes de movernos.',
      'Descansad. Si Topoloco ha preparado un señuelo, prefiero que crea que ha funcionado.'
    ], { setFlags: ['completado_lisboa_historia_belem'], water: 'Agua de la Ciudad que Regresa' })
  ]
};

packs['012-badoca-lagos'] = {
  shadowActor: 'Topoloco',
  openingMessages: [],
  steps: [
    route('topoloco-ruta-lagos', 'Buscad una ciudad costera del Algarve con marina. Desde allí salen barcos para observar delfines salvajes y cuevas marinas. ¿Cuál encaja?', ['Faro', 'Lagos', 'Porto'], 1, [
      'Lagos. La conexión de emergencia de Louri queda confirmada.'
    ], { setFlags: ['lagos_descubierto_por_louri'] })
  ]
};

packs['013-delfines-benagil-sagres'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Hemos recuperado el canal y la pista de Louri conduce a una embarcación de Lagos.',
    'Tecla ha revelado qué buscamos: el Calibrador Marino de Topoloco. Intenta convertir una observación incierta en una historia segura aunque sea falsa.',
    'En el mar no tendréis cobertura. Leed ahora la expedición, guardad el móvil y observad. Las preguntas solo aparecerán cuando confirméis que habéis vuelto al puerto.'
  ],
  steps: [
    expedition('barco-expedicion', 'Barco desde Lagos · delfines y cuevas', 'Expedición sin cobertura', 'Leedlo antes de zarpar. En el mar no contestéis al chat: seguid siempre a la tripulación y observad sin intentar controlar lo que ocurra.', [
        'Antes de salir, localizad una norma o indicación de seguridad.',
        'Fijaos en dos señales que use la tripulación para navegar o buscar animales.',
        'Si aparecen delfines, recordad una conducta visible; si no aparecen, recordad las condiciones de la búsqueda.',
        'En las cuevas o acantilados visibles desde el barco, buscad una grieta, una entrada y roca que todavía actúe como soporte.'
      ], [
        'Señal recuperada al volver al puerto. Ahora sí podemos hablar.',
        'Topotina ha conectado vuestras observaciones al Calibrador Marino. Contestad tres preguntas cortas para impedir que convierta una experiencia real en una certeza inventada.'
      ], { completionLabel: 'Ya hemos vuelto al puerto' }),
    question('barco-q1', 'Puerto de Lagos · informe de delfines', 'Si hoy no aparecen delfines, ¿qué conclusión es válida?', ['Hoy no los vimos en estas condiciones', 'No existen delfines en el Atlántico', 'La tripulación mintió necesariamente'], 0, 'Correcto. Es una conclusión limitada a la observación real.', 'La ausencia de un avistamiento no equivale a ausencia de la especie. Esa diferencia protege la ciencia y a los animales.', 'Elegid la frase que no afirma más de lo observado.'),
    question('barco-q2', 'Puerto de Lagos · Protocolo Azul', '¿Qué conducta respeta mejor a unos delfines salvajes?', ['Mantener la distancia que marque la tripulación', 'Perseguir al grupo para acercarse', 'Darles comida para que vuelvan'], 0, 'Exacto. Observar no significa controlar.', 'Reducir molestias permite que el encuentro, si ocurre, dependa del comportamiento natural del animal.', 'Pensad quién debe decidir la distancia segura.'),
    question('barco-q3', 'Puerto de Lagos · cuevas marinas', '¿Qué explica mejor que exista una cueva en el acantilado?', ['El agua aprovecha grietas y retira roca poco a poco', 'Dentro nunca hubo roca', 'El mar dibujó el hueco de una sola vez'], 0, 'Correcto. El hueco conserva la historia de un proceso.', 'Olas, agua, fracturas y muchísimo tiempo pueden agrandar una abertura. Una cueva no es «nada»: su forma depende también de la roca que permanece.', 'Elegid la explicación que une una debilidad de la roca con la acción repetida del agua.'),
    Object.assign(
      conversation('dialogo-regreso-puerto-dia21', 'Puerto de Lagos · calibrador localizado', [
        { from: 'vasco', text: 'Informe recibido. ¿Qué os sorprendió más de la salida: algo que hizo un animal, una decisión de la tripulación o una forma de la roca?' }
      ], [
        { from: 'vasco', text: 'Gracias. Esa observación concreta vale más que una respuesta perfecta inventada antes de salir.' }
      ]),
      { alwaysMessages: [
        { from: 'topotina', text: 'He introducido las tres respuestas en el Calibrador Marino. Exigía «sí o no» y ha recibido límites, condiciones y procesos. Se ha bloqueado.' },
        { from: 'topotino', text: '¡Lo hemos conseguido! Topoloco ya no puede usar esta salida para fabricar una versión falsa.' },
        { from: 'topotina', text: 'Y hemos recuperado una orden para Eco. Debe escuchar una historia, quitar una parte y repetirla hasta que parezca completa. Necesito unas horas para saber dónde piensa hacerlo.' }
      ], effects: { setFlags: ['calibrador_marino_bloqueado'] } }
    ),
    recovery('recuperacion-dia21', '¿Qué ha bloqueado el Calibrador Marino?', ['Decir exactamente qué vimos, qué no vimos y qué no sabemos', 'Prometer el resultado antes de salir', 'Llamar «nada» a cualquier hueco'], 0, 'Sombra retirada. Topoloco no puede usar vuestra incertidumbre como debilidad.', 'Topoloco conserva una parte del registro, pero el calibrador ha quedado bloqueado.'),
    Object.assign(
      route('ruta-dia22', 'El archivo de Eco muestra acantilados amarillos con cuevas, arcos y pilares muy cerca de Lagos. ¿Cuál es la primera señal?', ['Ponta da Piedade', 'Nazaré', 'Cabo da Roca'], 0, [
        'Primera señal encontrada: Ponta da Piedade.',
        'Eco escucha, recorta y repite. Mañana comprobaremos la costa real antes de que quite una parte y nos cuente una historia falsa.',
        'Después la señal seguirá hacia el este del Algarve, pero todavía no sabemos hasta dónde. Haced las maletas esta tarde.',
        'Preparad calzado con buen agarre, agua y protector solar. Nada de bordes ni atajos. Hoy la playa es descanso, no misión: disfrutad y descansad.'
      ], { setFlags: ['completado_delfines_benagil_sagres'], water: 'Agua del Horizonte' }),
      { notBefore: { date: '2026-08-21', time: '17:30' } }
    ),
  ]
};

packs['014-piedade-algar-jaima'] = {
  shadowActor: 'Eco',
  openingMessages: [
    'Buenos días. Ayer bloqueasteis el Calibrador Marino y recuperamos una orden dirigida a Eco.',
    'Eco es un Oscurno imitador. Escucha una voz o una historia, la recorta y la repite para engañar.',
    'La orden señala Ponta da Piedade. Tenemos que observar la costa real antes de que Eco cambie una parte del relato.'
  ],
  steps: [
    ...withOrder(
      expedition('piedade-expedicion', 'Ponta da Piedade', 'Seguir la costa verdadera', 'Recorred solo pasarelas y miradores seguros con los adultos.', [
        'Observad la costa desde dos miradores distintos.',
        'Localizad una cueva o hueco, un arco y una roca aislada o pilar.',
        'Buscad una grieta por la que el agua pueda seguir retirando roca.',
        'Comparad una roca unida al acantilado con otra separada.'
      ], [
        'Bien observado. El agua aprovecha grietas, agranda huecos y puede dejar arcos o pilares aislados.',
        'Eco puede repetir los nombres, pero no puede cambiar la roca que habéis comprobado allí.'
      ]),
      [
        question('piedade-q1', 'Ponta da Piedade', '¿Qué nombre recibe un hueco que atraviesa la roca y deja paso de un lado a otro?', ['Un arco', 'Una plaza', 'Una huella'], 0, 'Correcto: es un arco natural.', 'Si una parte del arco cae, puede quedar un pilar o islote. Es una posibilidad, no una regla para toda la costa.', 'Elegid la forma que deja una abertura completa.'),
        question('piedade-q2', 'Ponta da Piedade', '¿Por qué dos rocas cercanas pueden acabar con formas distintas?', ['Porque tienen grietas, dureza y exposición al mar diferentes', 'Porque una de ellas decidió esconderse', 'Porque el agua trabaja igual en todas partes'], 0, 'Exacto. El mar no encuentra la misma roca ni las mismas grietas en cada punto.', 'Por eso mirar dos lugares es mejor que memorizar una secuencia como si siempre ocurriera igual.', 'Comparad diferencias físicas que el agua pueda aprovechar.')
      ]
    ),
    nextStop('dia22-pista-albufeira', 'Eco repite: «El terremoto y el maremoto de 1755 solo destruyeron Lisboa». La señal sale de una ciudad del Algarve con centro antiguo y Praia dos Pescadores. ¿Cuál es?', ['Albufeira', 'Lagos', 'Faro'], 0, [
      { from: 'topotino', text: 'Albufeira. Eco está recortando la historia para que solo quede una ciudad.' },
      { from: 'topotina', text: 'Id al centro antiguo con los adultos. Compararemos la zona alta, la playa y la información histórica para demostrar qué ocurrió allí.' },
      { from: 'topotina', text: 'Parada opcional: la ruta pasa cerca de Algar Seco. Si os apetece, mirad A Boneca y sus ventanas al mar. Puede ayudarme a seguir la señal, pero no es una misión ni tenéis que contestar.' }
    ]),
    ...withOrder(
      onArrival(expedition('albufeira-expedicion', 'Centro antiguo de Albufeira', 'Encontrar la parte borrada de 1755', 'Moveos con los adultos por calles y miradores abiertos. No hace falta entrar en ningún edificio.', [
        'Desde Pau da Bandeira u otro mirador seguro, localizad Praia dos Pescadores y el centro antiguo.',
        'Bajad hacia la playa y buscad una señal de su pasado pesquero.',
        'Recorred una calle estrecha y comparad lo que se ve allí con la vista desde arriba.',
        'Localizad el panel del Jardim Frutuoso da Silva o información municipal que mencione el terremoto de 1755 en Albufeira.'
      ], [
        'Lo habéis encontrado. El terremoto y el maremoto de 1755 también golpearon con enorme fuerza Albufeira.',
        'Eco había quitado esta ciudad de la frase para fabricar una historia más simple. Ya no puede hacerlo.'
      ]), ARRIVAL_LOCATIONS.albufeira, [
        { from: 'system', text: 'Señal de Eco localizada en el centro antiguo de Albufeira.' },
        { from: 'topotina', text: 'Eco está repitiendo la misma frase desde aquí. Necesito que os mováis entre la zona alta y la playa para comparar el lugar completo.' },
        { from: 'topotino', text: 'Nada de perseguir sombras por callejones. Con los adultos y por zonas abiertas.' }
      ]),
      [
        question('albufeira-q1', 'Centro antiguo de Albufeira', '¿Qué afirmación cuenta mejor lo ocurrido en 1755?', ['El terremoto y el maremoto afectaron Lisboa y también la costa del Algarve', 'Solo Lisboa sufrió daños', 'Albufeira todavía no existía'], 0, 'Correcto. La catástrofe afectó a más de un lugar.', 'En Albufeira destruyó gran parte del caserío y de las antiguas murallas. Nombrar Lisboa no obliga a borrar el Algarve.', 'Elegid la frase que no quite una parte comprobable de la historia.'),
        question('albufeira-q2', 'Centro antiguo de Albufeira', '¿Por qué ver hoy una ciudad viva no demuestra que quedara intacta en 1755?', ['Porque una ciudad puede reconstruirse y conservar memoria de lo perdido', 'Porque todos los edificios son de 1755', 'Porque una playa no tiene historia'], 0, 'Exacto. Reconstruir no significa que nada ocurriera.', 'Las calles, documentos, edificios sustituidos y paneles permiten conocer cambios aunque la ciudad siga llena de vida.', 'Pensad en la diferencia entre sobrevivir sin daños y reconstruirse.')
      ]
    ),
    Object.assign(conversation('louri-refugio-dia22', 'Albufeira · conexión autorizada de Dino Parque', [
      { from: 'system', text: 'Solicitud firmada desde Dino Parque. Topotina autoriza una conexión de 90 segundos.' },
      { from: 'louri', text: '¡LOURI REGRESA! Esta es mi segunda despedida definitiva. Las grandes figuras necesitamos margen dramático.' },
      { from: 'topotino', text: 'Louri, tus despedidas definitivas están empezando a parecer una colección.' },
      { from: 'louri', text: 'He interceptado una orden antigua de Topoloco. Al romper la repetición de Eco, él ha intentado seguir vuestra señal.' },
      { from: 'louri', text: 'Id con los adultos a estas coordenadas: 37.106434, -8.253350.' },
      { from: 'topotina', text: 'Coordenadas verificadas. Es un lugar público con familias, personal y adultos, fuera del rastreo del comunicador.' },
      { from: 'topotina', text: 'Allí estaréis totalmente seguros de Topoloco si permanecéis con los adultos. No sigáis ninguna otra coordenada.' },
      { from: 'louri', text: 'Confirmad que lo habéis recibido. Puede ser con una frase heroica. O con «vale». Intentaré soportarlo.' }
    ], [
      { from: 'topotina', text: 'Respuesta recibida. Mantengo abierta la conexión solo para que Louri termine su aviso.' }
    ]), {
      notBefore: { date: '2026-08-22', time: '13:00' },
      alwaysMessages: [
        { from: 'topotino', text: 'Gracias, Louri. Tus brazos son pequeños, pero esta advertencia ha sido enorme.' },
        { from: 'system', text: 'Canal de Dino Parque cerrado definitivamente.' },
        { from: 'topotina', text: 'Seguid las coordenadas con los adultos. Yo apagaré el rastro detrás de vosotros.' }
      ],
      effects: { setFlags: ['louri_refugio_dia22_cerrado'] }
    }),
    onArrival(conversation('refugio-llegada-dia22', 'Refugio de Lona · Albufeira', [
      { from: 'system', text: 'Coordenadas confirmadas. Rastreo exterior bloqueado.' },
      { from: 'topotino', text: '¿Nuestro refugio ultrasecreto es una tienda? Yo había imaginado una fortaleza. Con túneles. Y una despensa.' },
      { from: 'topotina', text: 'Hay adultos, personal, familias y caminos iluminados. El canal está en modo seguro. Eco no puede seguirnos hasta aquí.' },
      { from: 'topotino', text: 'Paula, Hugo: ya estáis a salvo de la señal. ¿Qué os parece el Refugio de Lona?' }
    ], [
      { from: 'topotino', text: 'Acepto vuestra valoración. Incluso si es mejor que mi fortaleza imaginaria, cosa difícil.' },
      { from: 'topotina', text: 'Al romper la repetición de Eco recuperamos dos palabras de su orden: Porto d’Abrigo.' }
    ]), ARRIVAL_LOCATIONS.jaima, [
      { from: 'system', text: 'Llegada confirmada en las coordenadas enviadas por Louri.' },
      { from: 'topotina', text: 'Estáis dentro del perímetro seguro. Ahora sí puedo deciros qué lugar hemos encontrado.' }
    ], 'llegada-refugio-lona-t22a0'),
    recovery('recuperacion-dia22', '¿Qué hizo fallar a Eco en Albufeira?', ['Comprobar una parte real de la historia que su frase había borrado', 'Repetir su frase más alto', 'Aceptar que solo una ciudad importa'], 0, 'Sombra retirada. Eco ya no puede mantener su versión recortada.', 'Eco conserva parte de la grabación, pero Albufeira ha vuelto a la historia.'),
    route('ruta-dia23', 'Topotino cree que Porto d’Abrigo es un puerto pesquero. Vasco dice que es un centro que rescata, rehabilita y devuelve animales marinos dentro de un parque cercano. ¿Cuál?', ['Zoomarine', 'Dino Parque', 'Isla Mágica'], 0, [
      { from: 'topotino', text: 'Zoomarine. De acuerdo: no era un puerto para barcos. Era demasiado fácil.' },
      { from: 'vasco', text: 'Ayer observasteis delfines salvajes sin controlarlos. Mañana veremos qué ocurre cuando un animal necesita ayuda y por qué cuidar no significa poseer.' },
      { from: 'topotina', text: 'Preparad bañador, toalla, protector solar, agua y calzado cómodo. Ahora descansad en el refugio.' }
    ], { setFlags: ['completado_piedade_algar_jaima'], water: 'Agua de la Piedra' })
  ]
};

packs['015-zoomarine'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Ayer devolvisteis Albufeira a la historia y Louri nos condujo al Refugio de Lona.',
    'La orden recuperada decía Porto d’Abrigo. Está dentro de Zoomarine y ayuda a animales marinos heridos o en peligro.',
    'Topoloco afirma: «si lo salvo, me pertenece». Hoy vamos a desmontar esa mentira y compararla con los delfines salvajes de Lagos.'
  ],
  steps: [
    ...withOrder(
      expedition('zoomarine-expedicion', 'Zoomarine', 'Expedición de cuidar y devolver', 'No dependemos de ver un animal concreto ni de asistir a una presentación determinada.', [
        'Buscad información sobre Porto d’Abrigo o el centro de rehabilitación.',
        'Reconstruid las fases: llegada, diagnóstico, rehabilitación y posible devolución.',
        'Observad una especie y comparad esa observación con los delfines salvajes del barco.',
        'Localizad una norma para visitantes y una medida que requiera profesionales.'
      ], [
        'Expedición completada. Porto d’Abrigo trabaja desde 2002 con animales marinos que necesitan ayuda.',
        'El objetivo, cuando es posible y seguro, es devolverlos. Proteger puede exigir ayuda profesional y también dejarlos marchar.'
      ]),
      [
        question('zoomarine-q1', 'Zoomarine', '¿Qué debe decidirse con evidencia antes de devolver un animal?', ['Si está recuperado y puede sobrevivir', 'Si queda bonito en una foto', 'Si alguien quiere conservarlo'], 0, 'Correcto. La salud y la capacidad de volver son esenciales.', 'Diagnóstico y rehabilitación requieren profesionales. El cariño no sustituye la evidencia.', 'Pensad qué decisión afecta a la supervivencia del animal.'),
        question('zoomarine-q2', 'Zoomarine', '¿Qué diferencia principal hay entre los delfines salvajes de Lagos y un animal que necesita rehabilitación?', ['Al salvaje se le observa sin perseguir; al herido pueden ayudarlo profesionales para intentar devolverlo', 'Todo animal visto por personas pasa a ser suyo', 'Un animal herido debe quedarse siempre lejos de especialistas'], 0, 'Exacto. La intervención depende de la necesidad del animal.', 'Ayer respetasteis distancia. Hoy comprobáis que ayudar tampoco da derecho a convertirse en dueño.', 'Pensad cuándo no intervenir protege y cuándo hacen falta profesionales.')
      ]
    ),
    recovery('recuperacion-dia23', '¿Qué palabra completa mejor rescatar, rehabilitar y…?', ['Devolver', 'Coleccionar', 'Ocultar'], 0, 'Sombra retirada. Vasco ha recuperado una conexión limpia del mapa.', 'Topoloco conserva una interferencia, pero su excusa de «protección» ya no funciona.'),
    route('ruta-dia24', 'La siguiente ventana muestra un puente de siete arcos llamado «romano», aunque la evidencia lo sitúa en otra época. ¿Dónde está?', ['Tavira', 'Lagos', 'Lisboa'], 0, [
      'Primera señal encontrada: Tavira.',
      'Borrón ha escrito «romano» para que una palabra repetida sustituya a la historia real. Allí la corregiremos sin quitar valor al puente.',
      'Preparad documentación, calzado cómodo, agua y protector solar. Descansad.'
    ], { setFlags: ['completado_zoomarine'], water: 'Agua del Cuidado' })
  ]
};

packs['016-tavira-sevilla'] = {
  shadowActor: 'Borrón',
  openingMessages: [
    'Buenos días. Ayer unimos motivo, conducta y resultado: Topoloco provocó la amnesia para dejar de perder contra nosotros.',
    { from: 'topotina', text: 'Esta mañana ha aparecido una alteración nueva. Alguien ha escrito «ROMANO» sobre la señal de un puente de siete arcos.' },
    'No sé quién lo hizo ni por qué una sola palabra importa tanto. Primero miraremos el puente, el río y la ciudad. Después acusaremos con pruebas.'
  ],
  steps: [
    ...withOrder(
      expedition('tavira-expedicion', 'Tavira', 'La palabra que no encaja', 'Seguid el río por el centro y usad únicamente caminos y miradores permitidos.', [
        'Observad el puente antiguo desde una ribera segura y contad sus siete arcos.',
        'Cruzadlo y buscad qué une: calles, comercios, casas y las dos orillas.',
        'Subid al jardín del castillo o a otra vista alta y segura.',
        'Seguid con la mirada el Gilão desde el puente hacia su salida al mar.'
      ], [
        'Ya veo la trampa. Se le llama muchas veces puente romano, pero los estudios permiten describirlo como medieval y reconstruido hacia 1655. «Romano» es un nombre popular, no una fecha demostrada.',
        { from: 'topotina', text: 'He comparado la mancha de la señal. Pertenece a Borrón, uno de los Oscurnos que conocimos en Francia.' },
        { from: 'topotina', text: 'Borrón cambia una etiqueta y quita detalles hasta que todos repiten su versión. No borra el puente: intenta borrar lo que sabemos de él.' },
        'Borrón… Ese nombre me produce picor detrás de la oreja izquierda. Creo que es un recuerdo. Y creo que me caía fatal.'
      ]),
      [
        question('tavira-q1', 'Tavira', '¿Qué frase corrige a Borrón sin inventar otra historia?', ['Es medieval y fue reconstruido; «romano» es un nombre popular no demostrado', 'Es romano porque mucha gente lo repite', 'Tiene siete arcos, así que procede de la prehistoria'], 0, 'Correcto. Habéis corregido la etiqueta sin fingir que sabemos más de lo demostrado.', 'Equivocarse no es el problema. El problema sería mantener una palabra después de descubrir que las pruebas no la confirman.', 'Elegid la opción que distingue lo estudiado del nombre popular.'),
        question('tavira-q2', 'Tavira', 'Desde el castillo se ve el río atravesando la ciudad y continuando hacia el mar. ¿Por qué era importante esa unión?', ['Permitía mover personas, pescado, sal y otras mercancías entre la ciudad y el Atlántico', 'Demostraba que todos los edificios eran barcos', 'Impedía que Tavira tuviera calles'], 0, 'Exacto. El agua funcionaba como una gran vía de transporte.', 'Antes de trenes, carreteras y aviones modernos, los ríos y el mar conectaban puertos, ciudades y mercados. Tavira miraba hacia el Atlántico.', 'Pensad qué podía viajar por el agua además de los peces.')
      ]
    ),
    nextStop('dia24-pista-sevilla', 'Louri oyó «autopista de agua», «viajes a América» y «una ciudad que guardaba sus documentos». ¿Qué ciudad atravesada por el Guadalquivir encaja?', ['Sevilla', 'Lisboa', 'Coimbra'], 0, [
      { from: 'topotino', text: 'Sevilla. El Guadalquivir conectaba la ciudad con el Atlántico. Por allí pasaron barcos, mercancías, mapas y noticias de América.' },
      { from: 'topotina', text: 'Un momento. La señal de Borrón no termina en el río. Ha cortado el mapa de Sevilla en once testigos para que parezcan lugares sin relación.' },
      { from: 'topotino', text: 'Once. Estupendo. Yo habría preferido que su maldad tuviera formato de siesta, pero sigamos.' }
    ]),
    Object.assign(conversation('dialogo-sevilla-arranque', 'Llegada a Sevilla · primer corte', [
      { from: 'topotina', text: 'No mostraré los once puntos a la vez. Borrón podría seguir nuestro recorrido y, además, Topotino intentaría numerarlos con dibujos de bocadillos.' },
      { from: 'topotino', text: 'Era un sistema visual excelente. Paula, Hugo: antes de empezar, ¿qué es lo primero que os ha llamado la atención de Sevilla?' }
    ], [
      { from: 'topotino', text: 'Me lo guardo. Una ciudad empieza a contarse por lo que ven quienes llegan, no por lo que decide un mapa saboteado.' },
      { from: 'topotina', text: 'Primer corte: una enorme estructura moderna de madera, con forma de hongos, protege un mercado y se levanta sobre restos mucho más antiguos.' },
      { from: 'topotino', text: 'Hongos gigantes en el centro. Por fin una pista redactada por alguien que entiende la importancia de la merienda.' }
    ]), { allowedSpeakers: ['topotino', 'topotina'] }),
    nextStop('sevilla-ruta-setas', '¿Qué lugar de Sevilla encaja con una estructura moderna de madera, un mercado y restos arqueológicos debajo?', ['Las Setas de Sevilla', 'Torre del Oro', 'Puente de Triana'], 0, [
      'Las Setas. Id a la Plaza de la Encarnación.',
      'No subáis al mirador si no os apetece. La investigación se resuelve desde los espacios públicos del conjunto.'
    ]),
    onArrival(expedition('sevilla-setas-expedicion', 'Las Setas', 'El edificio con tres tiempos', 'Buscad tres usos en el mismo lugar. No hace falta comprar entrada.', [
      'Mirad la gran cubierta moderna de madera y su forma.',
      'Localizad el Mercado de la Encarnación o una señal que indique su uso actual.',
      'Buscad una referencia al Antiquarium y a los restos romanos y andalusíes hallados debajo.'
    ], [
      { from: 'topotina', text: 'Borrón quería una sola edad. Aquí conviven restos antiguos, mercado actual y una estructura inaugurada en 2011.' },
      { from: 'topotino', text: 'Tres tiempos bajo el mismo sombrero. Yo tengo uno y apenas consigo guardar las orejas.' }
    ]), ARRIVAL_LOCATIONS.setasSevilla, [
      { from: 'topotina', text: 'Primer testigo localizado. Borrón ha dejado una etiqueta: «Sevilla moderna. Nada anterior debajo».' },
      { from: 'topotino', text: 'Qué casualidad: estamos justo encima de la prueba de que miente.' }
    ], 'llegada-setas-sevilla-t24a1'),
    question('sevilla-setas-q1', 'Las Setas', '¿Qué observación desmonta mejor la etiqueta de Borrón?', [
      'Que hay una obra moderna, un mercado actual y restos de épocas antiguas en el mismo lugar',
      'Que toda Sevilla se construyó en 2011',
      'Que los restos arqueológicos son decorados del mercado'
    ], 0, 'Exacto. Un mismo lugar puede conservar tiempos y funciones diferentes.', 'Las obras de las Setas permitieron encontrar restos romanos y andalusíes. Lo nuevo no obliga a borrar lo antiguo.', 'Elegid la opción que conserve las tres pruebas visibles.'),
    Object.assign(conversation('dialogo-sevilla-setas', 'Las Setas · rastro recuperado', [
      { from: 'topotina', text: 'Primer testigo recuperado. Borrón ha huido por una calle peatonal famosa por sus tiendas y por una leyenda sobre una serpiente.' },
      { from: 'topotino', text: '¿Serpiente real o nombre con leyenda? Antes de perseguir nada con colmillos: ¿qué parte de las Setas os sorprendió más?' }
    ], [
      { from: 'topotino', text: 'Buena observación. Y confirmo que no perseguiremos serpientes. Mi seguro de madriguera excluye reptiles con biografía.' },
      { from: 'topotina', text: 'La pista dice calle comercial, peatonal, junto al Ayuntamiento. Su nombre es el siguiente dato que debéis deducir.' }
    ]), { allowedSpeakers: ['topotino', 'topotina'] }),
    nextStop('sevilla-ruta-sierpes', '¿Qué calle comercial y peatonal de Sevilla lleva un nombre relacionado con una leyenda de serpiente?', ['Calle Sierpes', 'Calle Betis', 'Calle San Fernando'], 0, [
      'Calle Sierpes. Recorredla hacia la Plaza de San Francisco.',
      'Borrón se mueve entre comercios y las dos caras del Ayuntamiento.'
    ]),
    expedition('sevilla-centro-expedicion', 'Sierpes, San Francisco y Plaza Nueva', 'Las dos caras del Ayuntamiento', 'Seguid el orden del rastro y caminad siempre con los adultos.', [
      'Recorred Sierpes y localizad una tienda o comercio que muestre su función actual.',
      'En Plaza de San Francisco, mirad la fachada detallada del Ayuntamiento y buscad alguna piedra sin terminar de tallar.',
      'Rodead el Ayuntamiento hasta Plaza Nueva y comparad su fachada más regular y sencilla.',
      'Localizad la estatua de San Fernando o el inicio del tranvía en Plaza Nueva.'
    ], [
      { from: 'topotina', text: 'Sierpes conserva su función comercial. El Ayuntamiento muestra una fachada plateresca hacia San Francisco y otra neoclásica hacia Plaza Nueva.' },
      { from: 'topotino', text: 'Mismo edificio, dos caras. Yo también tengo cara de héroe y cara de «Topotina ha encontrado otro fallo». La segunda aparece bastante.' }
    ]),
    question('sevilla-centro-q1', 'Ayuntamiento de Sevilla', '¿Por qué el Ayuntamiento tiene dos fachadas tan distintas?', [
      'Porque una pertenece al siglo XVI y la otra a una ampliación del XIX hacia Plaza Nueva',
      'Porque Borrón cambió una por la noche',
      'Porque son dos ayuntamientos pegados sin relación'
    ], 0, 'Correcto. El edificio creció cuando también cambió la ciudad.', 'La cara de San Francisco conserva decoración plateresca; la ampliación del XIX se abrió a la nueva plaza con estilo neoclásico.', 'Comparad las dos plazas y pensad si el edificio pudo ampliarse.'),
    Object.assign(conversation('dialogo-sevilla-centro', 'Plaza Nueva · siguiente corte', [
      { from: 'topotina', text: 'Segundo, tercero y cuarto testigos recuperados. El rastro sigue por una avenida con tranvía que conduce hacia una torre que antes fue minarete y después campanario.' },
      { from: 'topotino', text: 'Yo también he cambiado de función: antes investigaba y ahora procuro que nadie sea atropellado. Mirad el tranvía. ¿Listos para seguir?' }
    ], [
      { from: 'topotino', text: 'Vamos. Sin correr y sin auriculares: un tranvía es silencioso, pero no tanto como Topoloco cuando le toca bajar la basura.' },
      { from: 'topotina', text: 'La avenida lleva el nombre de la norma principal que organiza un país. Al final esperan la Catedral y la Giralda.' }
    ]), { allowedSpeakers: ['topotino', 'topotina'] }),
    nextStop('sevilla-ruta-constitucion', '¿Qué avenida con tranvía conduce desde Plaza Nueva hasta la Catedral y la Giralda?', ['Avenida de la Constitución', 'Avenida de Kansas City', 'Paseo de Colón'], 0, [
      'Avenida de la Constitución. Seguidla atentos al tranvía.',
      'Borrón ha dejado tres señales alrededor de una plaza llamada del Triunfo.'
    ]),
    expedition('sevilla-monumental-expedicion', 'Constitución y Plaza del Triunfo', 'Tres testigos que no cuentan lo mismo', 'Todo se observa desde el exterior y los espacios públicos.', [
      'Recorred un tramo de la Avenida de la Constitución y fijaos por dónde circula el tranvía.',
      'Mirad la Giralda: distinguid la parte inferior de la torre y el cuerpo superior de campanas.',
      'En Plaza del Triunfo, localizad Catedral, Alcázar y Archivo de Indias.',
      'Asignad una función a cada uno: templo, palacio-fortaleza y archivo de documentos.'
    ], [
      { from: 'topotina', text: 'La Giralda conserva el antiguo minarete almohade y una parte cristiana posterior con campanas. El edificio hace visible el paso de distintas épocas.' },
      { from: 'topotino', text: 'Tres monumentos, tres funciones y una plaza. Borrón debe de estar rechinando los dientes. Si tiene dientes. Nunca se los conté.' }
    ]),
    Object.assign(conversation('dialogo-capitan-pico-sevilla', 'Plaza del Triunfo · señal con plumas', [
      { from: 'system', text: 'Señal desconocida detectada: patrón de plumas y sal marina.' },
      { from: 'topotino', text: '¿Sal marina en Sevilla? ¿Y plumas? Topotina, dime que no ha entrado una gaviota con contraseña.' },
      { from: 'topotina', text: 'Firma verificada. Procede de una isla dentro de la ciudad. Le doy acceso durante dos minutos.' },
      { from: 'system', text: 'Capitán Pico se ha unido al canal.' },
      { from: 'capitan_pico', text: '¡Capitán Pico! Navegante, explorador y Almirante Provisional de Todo lo que Pueda Verse desde un Poste.' },
      { from: 'capitan_pico', text: 'América es mi compañera y trabaja fuera del chat. Ha interceptado esto: «tres testigos alrededor de un triunfo». ¿Cuál os parece más peligroso para Borrón?' }
    ], [
      { from: 'capitan_pico', text: '¡Respuesta digna de tripulación! Los tres son peligrosos: uno conserva formas, otro usos y otro documentos.' },
      { from: 'topotina', text: 'Catedral, Alcázar y Archivo no cuentan lo mismo. Al compararlos, Borrón ya no puede sustituir Sevilla por una sola frase.' },
      { from: 'topotino', text: 'Pico, ¿quién te concedió tantos títulos?' },
      { from: 'capitan_pico', text: 'Yo. La ceremonia fue breve, solemne y muy bien organizada.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'] }),
    question('sevilla-monumental-q1', 'Plaza del Triunfo', '¿Por qué el Archivo de Indias es especialmente peligroso para la mentira de Borrón?', [
      'Porque conserva documentos que permiten comprobar relatos sobre viajes y América',
      'Porque convierte cualquier leyenda en verdad',
      'Porque fue construido como parque de atracciones'
    ], 0, 'Exacto. Un documento no cuenta todo, pero permite comprobar fechas, decisiones y viajes.', 'El edificio fue una lonja antes de ser archivo. También él cambió de función sin perder su historia.', 'Pensad cuál de los tres edificios guarda documentos.'),
    Object.assign(conversation('dialogo-sevilla-triunfo', 'Plaza del Triunfo · la sombra escapa', [
      { from: 'capitan_pico', text: 'América ve a Borrón entrar en un laberinto de calles estrechas, casas blancas y naranjos.' },
      { from: 'topotino', text: 'Perfecto. Soy un topo. Los laberintos son prácticamente oficinas con mala señal. ¿Qué detalle de esta plaza recordaríais?' }
    ], [
      { from: 'capitan_pico', text: 'Anotado en mi Bitácora Oficial de Cosas que No Debo Adjudicarme.' },
      { from: 'topotina', text: 'El barrio siguiente fue judería medieval. Sus calles estrechas daban sombra y reducían el calor. Debéis encontrarlo por esos rasgos.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'] }),
    nextStop('sevilla-ruta-santa-cruz', '¿Qué barrio junto al Alcázar conserva calles estrechas, plazas con naranjos y parte del trazado de la antigua judería?', ['Santa Cruz', 'Triana', 'La Cartuja'], 0, [
      'Santa Cruz. Dad un paseo breve, sin necesidad de seguir una calle exacta.',
      'Buscad cómo la forma del barrio ayudaba a vivir con el calor.'
    ]),
    expedition('sevilla-santa-cruz-expedicion', 'Barrio de Santa Cruz', 'El laberinto que da sombra', 'Elegid calles tranquilas y respetad a quienes viven allí.', [
      'Comparad una calle estrecha con una plaza algo más abierta.',
      'Buscad sombra, naranjos, patios, rejas o fuentes.',
      'Si pasáis por el Callejón del Agua, observad su cercanía a la muralla del Alcázar.'
    ], [
      'El trazado estrecho e irregular procede de la ciudad medieval. Las calles reducían el sol directo y favorecían zonas más frescas.',
      { from: 'capitan_pico', text: 'He intentado abrir las alas en una calle estrecha. La calle ha ganado. No constará en el informe.' }
    ]),
    question('sevilla-santa-cruz-q1', 'Santa Cruz', '¿Qué ventaja práctica podían tener muchas calles estrechas en Sevilla?', [
      'Crear sombra y reducir el impacto del sol entre las casas',
      'Permitir que navegaran barcos grandes',
      'Evitar que existieran plazas y patios'
    ], 0, 'Correcto. La forma de una calle también responde al clima y a la vida cotidiana.', 'El barrio conserva parte de su trazado medieval. No es un laberinto construido para turistas.', 'Comparad el sol de una calle ancha con la sombra entre dos fachadas cercanas.'),
    Object.assign(conversation('dialogo-sevilla-santa-cruz', 'Santa Cruz · edificio cambiado', [
      { from: 'topotina', text: 'Borrón sale del barrio y entra en un edificio enorme del siglo XVIII. Antes fabricaba tabaco; hoy fabrica discusiones, exámenes y carreras.' },
      { from: 'topotino', text: 'Eso suena a universidad. Aunque yo pensaba que los exámenes se cultivaban en macetas oscuras. ¿Habéis conseguido orientaros en Santa Cruz?' }
    ], [
      { from: 'topotino', text: 'Entonces seguís cualificados. Yo he girado tres veces y ahora estoy técnicamente detrás de mí mismo.' },
      { from: 'topotina', text: 'Buscad la antigua Real Fábrica de Tabacos, hoy sede de la Universidad de Sevilla.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'] }),
    nextStop('sevilla-ruta-fabrica', '¿Qué gran edificio cambió de fabricar tabaco a albergar aulas y el Rectorado de la Universidad?', ['Antigua Real Fábrica de Tabacos', 'Archivo de Indias', 'Palacio de San Telmo'], 0, [
      'Antigua Real Fábrica de Tabacos. Observadla desde el exterior.',
      'Borrón afirma que un edificio solo puede tener el uso con el que nació. Vamos a corregirlo.'
    ]),
    expedition('sevilla-fabrica-expedicion', 'Antigua Fábrica de Tabacos · Universidad', 'Una fortaleza que cambió de trabajo', 'No hace falta entrar. Investigad su tamaño y su aspecto exterior.', [
      'Recorred parte de la fachada y comprobad la enorme escala del edificio.',
      'Buscad el foso, una garita, la portada o algún detalle que recuerde a una fortaleza.',
      'Localizad un rótulo o símbolo que confirme su uso universitario actual.'
    ], [
      { from: 'topotina', text: 'Funcionó como fábrica desde 1758. Su aspecto cerrado ayudaba a controlar una industria valiosa. En el siglo XX pasó a ser Universidad.' },
      { from: 'topotino', text: 'De tabaco a libros. Es el cambio de uso más saludable de toda la aventura y pienso defenderlo con firmeza.' }
    ]),
    question('sevilla-fabrica-q1', 'Antigua Fábrica de Tabacos', '¿Qué demuestra este edificio contra la versión de Borrón?', [
      'Que puede conservar rasgos de fábrica y fortaleza mientras cumple una función universitaria nueva',
      'Que todo edificio debe mantener para siempre su primer uso',
      'Que la Universidad fabrica hojas de tabaco'
    ], 0, 'Correcto. Cambiar de función no obliga a borrar el pasado del edificio.', 'Su arquitectura recuerda la industria y el control del siglo XVIII; las aulas muestran su vida actual.', 'Buscad una opción que conserve el antes y el ahora.'),
    Object.assign(conversation('dialogo-sevilla-fabrica', 'Universidad · último tramo', [
      { from: 'capitan_pico', text: 'América ha encontrado los dos últimos cortes al sur: un parque público y una plaza semicircular que mira hacia América.' },
      { from: 'topotino', text: 'Pico, ¿«al sur» es una dirección comprobada o uno de tus títulos?' },
      { from: 'capitan_pico', text: 'Comprobada por América. Yo estaba ocupado señalando el sur correcto con enorme autoridad.' },
      { from: 'topotina', text: 'El parque lleva el nombre de una infanta que cedió sus jardines a la ciudad. ¿Sabéis cuál puede ser?' }
    ], [
      { from: 'topotina', text: 'Buscamos el Parque de María Luisa. Allí la Sevilla de 1929 preparó una gran exposición relacionada con países de América.' },
      { from: 'topotino', text: 'Último tramo. Agua, árboles y una plaza enorme. Borrón ha elegido un escondite bastante poco discreto.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'] }),
    nextStop('sevilla-ruta-parque', '¿Qué parque público conduce a la Plaza de España y conserva espacios preparados para la Exposición de 1929?', ['Parque de María Luisa', 'Jardines de Murillo', 'Alameda de Hércules'], 0, [
      'Parque de María Luisa. Cruzadlo con calma hacia Plaza de España.',
      'Buscad naturaleza, fuentes o glorietas antes de entrar en la gran plaza.'
    ]),
    expedition('sevilla-parque-expedicion', 'María Luisa y Plaza de España', 'Los dos últimos testigos', 'Caminad a vuestro ritmo. La investigación termina en el espacio central de la plaza.', [
      'En el parque, localizad árboles, una fuente, un estanque o una glorieta.',
      'Al llegar a Plaza de España, observad su forma semicircular.',
      'Buscad el canal, los puentes y los bancos con mapas o azulejos de provincias.',
      'Localizad un elemento que muestre que el edificio y el jardín forman un conjunto planeado.'
    ], [
      { from: 'topotina', text: 'El parque procede de jardines cedidos a la ciudad. Plaza de España se construyó para la Exposición Iberoamericana de 1929.' },
      { from: 'capitan_pico', text: 'Semicírculo, canal, puentes y cerámica. Magnífico puerto para un capitán. Pequeño inconveniente: los barcos son diminutos.' },
      { from: 'topotino', text: 'No conviertas los patos en tripulación.' },
      { from: 'capitan_pico', text: 'Demasiado tarde. Uno ya es contramaestre.' }
    ]),
    question('sevilla-parque-q1', 'Plaza de España', '¿Para qué gran acontecimiento se construyó Plaza de España?', [
      'Para la Exposición Iberoamericana de 1929',
      'Para guardar los fósiles de Dino Parque',
      'Para sustituir al Ayuntamiento medieval'
    ], 0, 'Correcto. La plaza formó parte de una exposición que reunió a España con países americanos.', 'Su arquitectura regionalista emplea ladrillo, cerámica, azulejos y hierro. La forma semicircular se interpreta como apertura hacia América.', 'Fijaos en los bancos, mapas y referencias a territorios.'),
    question('sevilla-parque-q2', 'Plaza de España', '¿Qué han demostrado juntos los once testigos de Sevilla?', [
      'Que una ciudad puede conservar muchas épocas y usos sin reducirse a una sola versión',
      'Que solo los edificios más nuevos merecen recordarse',
      'Que Borrón tenía razón al separar todos los lugares'
    ], 0, 'Exacto. Habéis vuelto a unir comercio, gobierno, religión, documentos, calles, industria, universidad, naturaleza y viajes.', 'Borrón necesitaba que cada lugar pareciera aislado. Al recorrerlos en orden, la ciudad vuelve a contar una historia con muchas voces.', 'Elegid la opción que no borre ninguno de los lugares observados.'),
    Object.assign(conversation('dialogo-sevilla-cierre', 'Plaza de España · once de once', [
      { from: 'system', text: 'Once testigos recuperados. Alteración de Borrón deshecha.' },
      { from: 'capitan_pico', text: '¡Doce testigos!' },
      { from: 'topotina', text: 'Son once.' },
      { from: 'capitan_pico', text: 'Me había contado a mí. Acepto la corrección con una dignidad naval extraordinaria.' },
      { from: 'topotino', text: 'Paula, Hugo: antes de cerrar el recorrido, ¿qué lugar escogeríais para explicar que Sevilla ha cambiado muchas veces?' }
    ], [
      { from: 'topotino', text: 'Buena elección. No hay un único edificio capaz de contar toda Sevilla; por eso vuestra respuesta también forma parte de la investigación.' },
      { from: 'topotina', text: 'Borrón ha perdido el rastro. Pero uno de los cortes contenía la firma de Magikland y una referencia a barcos y América.' },
      { from: 'capitan_pico', text: 'América y yo volveremos a nuestra isla. No puedo revelar dónde está. Reglamento de Misterio, artículo que acabo de inventar.' },
      { from: 'topotino', text: 'Descansad un poco. Esta noche revisaremos la señal sin anunciar nada que todavía no sepamos.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'], effects: { setFlags: ['sevilla_once_testigos_t24a1'] } }),
    recovery('recuperacion-dia24', '¿Qué hace una memoria honesta cuando aparece mejor evidencia?', ['Se corrige sin fingir que nunca se equivocó', 'Se aferra al nombre más popular', 'Borra el lugar completo'], 0, 'Sombra retirada. Borrón ha perdido su etiqueta falsa.', 'La palabra de Borrón sigue visible, pero ahora funciona como ejemplo de una corrección.'),
    Object.assign(route('ruta-dia25', 'Tecla ha descrito una isla dentro de Sevilla, llena de barcos, exploradores y viajes a América, con la misma firma que Magikland. ¿Dónde está Topoloco?', ['Isla Mágica', 'Dino Parque', 'Oceanário de Lisboa'], 0, [
      'Exacto: Isla Mágica. Una isla de agua, barcos e imaginación escondida dentro de una ciudad.',
      'Mañana buscaremos allí el Cuaderno de Bitácora Único antes de que Topoloco cierre nuestra aventura con su nombre.',
      'Preparad bañador y toalla si queréis usar Agua Mágica, además de protector solar, agua y calzado cómodo. Ninguna prueba obligará a montar ni a entrar en la zona acuática.',
      'Ahora descansad. Mañana por la tarde terminaremos esto juntos.'
    ], { setFlags: ['completado_tavira_sevilla'], water: 'Agua de las Dos Orillas' }), {
      notBefore: { date: '2026-08-24', time: '20:00' }
    })
  ]
};

packs['017-isla-magica'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días, Paula y Hugo. Ayer paramos justo antes de investigar Santa Cruz. Hicisteis bien: una aventura no mejora porque sus exploradores terminen arrastrándose.',
    { from: 'topotina', text: 'Recuperasteis siete testigos. Esta mañana los cuatro huecos pendientes tienen el sello de Borrón y cuatro cierres nuevos.' },
    'No repetiremos Santa Cruz ni fingiremos que vimos lo que no vimos. Vamos a recuperar esos huecos donde Borrón los ha escondido.',
    { from: 'topotina', text: 'El rastro cruzó el Guadalquivir. Dejó seis marcas de zona, una carabela, «CARTU…» y el engranaje torcido que vimos en Magikland.' },
    { from: 'topotino', text: 'Una isla dentro de otra isla. Como aparezca una tercera, pido migas de pan y un notario.' }
  ],
  steps: [
    Object.assign(conversation('dialogo-isla-cartuja-pista', 'Sevilla · cuatro cortes desaparecidos', [
      { from: 'topotino', text: 'Antes de seguir: ¿qué recordáis que hacía Borrón con la historia de Sevilla? Decidlo a vuestra manera.' }
    ], [
      { from: 'topotino', text: 'Exacto: quitaba detalles y separaba lugares para que solo quedara una versión pobre.' },
      { from: 'topotina', text: 'Los cuatro cierres apuntan a la Isla de la Cartuja. Dentro hay un lugar dividido en seis mundos y relacionado con barcos y América.' },
      { from: 'topotino', text: 'Borrón ha escondido la pista con la discreción de un elefante vestido de faro.' }
    ]), { allowedSpeakers: ['topotino', 'topotina'] }),
    nextStop('isla-cartuja-pista', '¿Qué lugar de la Isla de la Cartuja tiene seis mundos, carabelas y un vínculo con Magikland?', ['Isla Mágica', 'Archivo de Indias', 'Parque de María Luisa'], 0, [
      'Isla Mágica. Borrón cree que, entre recreaciones, podrá hacer pasar una copia por el lugar real.',
      'Los cuatro huecos de Sevilla están allí, cerrados por el Corrector de Topoloco. Tendremos que abrirlos uno a uno.',
      'Id con agua, protector solar y calzado cómodo. La primera misión aparecerá al llegar.'
    ]),
    ...withOrder(
      onArrival(expedition('isla-expedicion', 'Sevilla, Puerto de Indias', 'Primer cierre: el puerto representado', 'No hace falta montar en ninguna atracción. Empezad por la zona Sevilla, Puerto de Indias.', [
        'Localizad Sevilla, Puerto de Indias en el mapa o en un cartel y buscad barcos, carabelas o elementos del puerto.',
        'Elegid un detalle que ayude a imaginar el comercio y los viajes del siglo XVI.',
        'Buscad también algo que tenga una función real para las personas que visitan el parque hoy.'
      ], [
        'Sevilla, Puerto de Indias recrea la ciudad que conectaba Europa y América. Los barcos ayudan a imaginarla, pero no son documentos del siglo XVI.',
        { from: 'capitan_pico', text: '¡Primer reconocimiento completado! América asiente. Yo también, pero con una inclinación de pico más reglamentaria.' }
      ]), { lat: 37.4077506, lng: -5.9998062, radiusMeters: 1600, label: 'Isla Mágica, Sevilla' }, [
        { from: 'topotina', text: 'Llegada confirmada. Detecto cuatro cierres. El primero está en la zona que representa el antiguo puerto de Sevilla.' },
        { from: 'topotina', text: 'Capitán Pico solicita acceso desde el interior con catorce títulos nuevos.' },
        { from: 'topotino', text: 'Aprueba solo los dos primeros. Este chat tiene un límite de vanidad por burbuja.' },
        { from: 'system', text: 'Capitán Pico ha vuelto al canal.' },
        { from: 'capitan_pico', text: '¡Tripulación reunida! América encontró el escondite y yo confirmé que, efectivamente, estaba donde ella señalaba. Navegación impecable.' },
        { from: 'topotino', text: '¿Confirmaste una flecha dibujada por América?' },
        { from: 'capitan_pico', text: 'Con enorme precisión.' }
      ], 'llegada-isla-final-t25a0'),
      [
        question('isla-q1', 'Sevilla, Puerto de Indias', '¿Qué afirmación describe bien lo que estáis viendo?', ['Es una recreación actual que ayuda a imaginar el puerto histórico', 'Es el puerto original conservado exactamente igual', 'Sustituye a los documentos del Archivo de Indias'], 0, [
          'Correcto. Una recreación enseña si reconoce que representa algo y no pretende reemplazarlo.',
          { from: 'system', text: 'CIERRE DE BORRÓN: 1/4 ABIERTO' },
          { from: 'topotina', text: 'Primer cierre fuera. Borrón apostó por que confundiríamos escenario y documento.' }
        ], 'Como en Portugal dos Pequenitos y Dino Parque, un modelo selecciona detalles para explicar. No se convierte por eso en el original.', 'Buscad la opción que permite aprender sin fingir que el parque tiene quinientos años.')
      ],
      'expedition-first'
    ),
    Object.assign(conversation('dialogo-pico-puerto', 'Sevilla, Puerto de Indias · primer cierre abierto', [
      { from: 'capitan_pico', text: 'Primer cierre abierto. ¿Qué detalle del puerto os ha hecho viajar más con la imaginación? Aquí no hay respuesta incorrecta.' }
    ], [
      { from: 'capitan_pico', text: 'Buena elección. La imaginación nos lleva lejos; comprobar qué es real evita que Borrón conduzca el barco.' },
      { from: 'topotina', text: 'El segundo cierre se ha movido a Puerta de América. Buscad el Fuerte y comprobad qué representa y para qué sirve hoy.' },
      { from: 'topotino', text: 'Pico, tú detrás. La última vez que guiaste, América llevaba el mapa.' },
      { from: 'capitan_pico', text: 'Delegación cartográfica de alto nivel.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'] }),
    expedition('puerta-america-expedicion', 'Puerta de América', 'Segundo cierre: el fuerte con dos trabajos', 'Caminad hasta Puerta de América y buscad el Fuerte o una fachada defensiva.', [
      'Localizad una puerta, torre, muro o puesto desde el que se podría vigilar una entrada.',
      'Comprobad qué hace ese elemento dentro de la historia representada.',
      'Decid qué función real cumple hoy: orientar, separar espacios, dar acceso o crear ambiente.'
    ], [
      'Un mismo elemento puede representar una defensa antigua y servir hoy para organizar el parque. Reconocer las dos funciones evita confundir pasado y presente.',
      { from: 'topotina', text: 'El cierre reacciona. Falta decidir qué explicación conserva las dos funciones.' }
    ]),
    question('puerta-america-q1', 'Puerta de América', '¿Por qué el Fuerte puede enseñar historia sin ser un fuerte histórico original?', ['Porque representa rasgos defensivos y además cumple una función actual en el parque', 'Porque todo edificio con torre tiene quinientos años', 'Porque una recreación borra la necesidad de conservar originales'], 0, [
      'Exacto. Podemos aprender de lo representado y, a la vez, reconocer el edificio actual que tenemos delante.',
      { from: 'system', text: 'CIERRE DE BORRÓN: 2/4 ABIERTOS' },
      { from: 'capitan_pico', text: '¡Dos cierres! Mitad de operación. También mitad de mis títulos, por orden de Topotina.' }
    ], 'Borrón quiere que elijáis entre «todo es mentira» y «todo es original». Las dos funciones pueden ser verdaderas a la vez.', 'Elegid la opción que distingue representación y uso actual.'),
    Object.assign(conversation('dialogo-america-gobernadora', 'Isla Mágica · ruta libre', [
      { from: 'system', text: 'América se ha unido al canal.' },
      { from: 'america', text: 'Buenas, Paula y Hugo. Soy América, gobernadora de Isla Mágica. Aquí mando yo. Capitán Pico también manda, pero sobre todo manda mensajes.' },
      { from: 'capitan_pico', text: '¡Os vi en el Fuerte! Fingí no conoceros para que Borrón no sospechara. Permanecí inmóvil, serio y completamente natural.' },
      { from: 'america', text: 'Se quedó tieso mirando la cámara durante toda la foto.' },
      { from: 'capitan_pico', text: 'Era una maniobra de contraespionaje. Y la foto me hizo muchísima ilusión. Mi pico salió por su lado bueno. Los dos lados.' },
      { from: 'topotina', text: 'He recuperado el primer cierre de lo que ya observasteis. La visita y la foto del Fuerte confirman el segundo.' },
      { from: 'system', text: 'CIERRE DE BORRÓN: 2/4 ABIERTOS' },
      { from: 'america', text: 'No vais a seguir mi parque en un orden inventado. Decidme en qué zona estáis ahora. Escribid el nombre del cartel o describid lo que tenéis delante.' }
    ], [
      { from: 'america', text: 'La señal ha cortado el nombre. Mirad el cartel de la zona y elegid un objeto del escenario que también tenga una función real hoy. Decidme cuáles son esas dos funciones.' }
    ]), {
      scriptedReply: false,
      allowedSpeakers: ['america', 'capitan_pico', 'topotina', 'topotino']
    }),
    Object.assign(conversation('dialogo-zona-isla-hallazgo', 'Isla Mágica · investigación adaptable', [
      { from: 'america', text: 'Cuando encontréis lo que os acabo de pedir, contadme qué habéis visto. No hace falta una explicación larga.' }
    ], [
      { from: 'america', text: 'Eso sirve. Habéis separado lo que representa el decorado de lo que hace de verdad dentro del parque. Borrón ya no puede mezclar ambas cosas.' },
      { from: 'capitan_pico', text: 'Confirmo el hallazgo como Inspector Naval de Lugares a los que América ya Había Llegado Primero.' },
      { from: 'america', text: 'Seguid vuestro recorrido. Yo ajustaré la investigación a donde estéis, no al orden del mapa.' }
    ]), {
      allowedSpeakers: ['america', 'capitan_pico', 'topotina', 'topotino']
    }),
    Object.assign(conversation('dialogo-zona-isla-siguiente', 'Isla Mágica · nueva posición', [
      { from: 'america', text: '¿En qué zona estáis ahora? Si seguís en la misma, decidlo también y buscaré otra pista distinta.' }
    ], [
      { from: 'america', text: 'Se ha cortado el nombre otra vez. Elegid otro detalle que represente una historia o una leyenda y decidme qué parte podéis comprobar de verdad allí.' }
    ]), {
      scriptedReply: false,
      allowedSpeakers: ['america', 'capitan_pico', 'topotina', 'topotino']
    }),
    Object.assign(conversation('dialogo-zona-isla-hallazgo-2', 'Isla Mágica · segunda comprobación', [
      { from: 'america', text: 'Cuando lo tengáis, contadme vuestra conclusión en un mensaje corto.' }
    ], [
      { from: 'america', text: 'Comprobado. El parque puede contar una historia sin fingir que su decorado es el objeto original.' },
      { from: 'capitan_pico', text: 'Segunda comprobación aprobada. Para celebrarlo me concedo una medalla. América dice que una pegatina. Negociaciones abiertas.' },
      { from: 'topotina', text: 'Un momento. Acaban de aparecer tres órdenes distintas sobre vuestra siguiente posición. Alguien intenta aprovechar que habéis cambiado el recorrido.' }
    ]), {
      allowedSpeakers: ['america', 'capitan_pico', 'topotina', 'topotino']
    }),
    question('isla-q2', 'Isla Mágica · interferencia', 'Han aparecido tres órdenes urgentes y contradictorias. ¿Qué contratrampa es más segura?', ['Elegir un punto público del mapa como señuelo, vigilar la señal y poder corregir', 'Enviar nuestra posición real y correr', 'Inventar un lugar imposible que tampoco podamos comprobar'], 0, [
      'Exacto. Un señuelo seguro debe ser público, comprobable y fácil de retirar.',
      { from: 'topotina', text: 'Ya sé quién envía las órdenes: Niebla, el Oscurno que usa ruido y prisa para que elijamos sin comprobar.' },
      { from: 'topotino', text: 'Pues se va a llevar una ruta falsa de primera calidad. Falsa, pero con excelentes acabados.' }
    ], 'No gana la ruta más valiente, sino la que no revela dónde estáis y se puede corregir.', 'Elegid la opción que pueda deshacerse y comprobarse.'),
    recovery('recuperacion-dia25', '¿Qué hace un buen explorador cuando alguien intenta meterle prisa?', ['Comprueba y mantiene una salida', 'Obedece la primera señal', 'Entrega su posición real'], 0, 'Sombra retirada. Niebla ha seguido una ruta vacía y comprobable.', 'Niebla mantiene una ventaja, pero el cable principal ya está localizado.'),
    Object.assign(conversation('dialogo-niebla-senuelo', 'Isla Mágica · preparar el señuelo', [
      { from: 'topotina', text: 'Elegid un punto público del mapa para el señuelo. Decid solo el nombre; yo ocultaré vuestra posición real.' }
    ], [
      { from: 'topotina', text: 'Señuelo enviado. La marca de Niebla se ha separado de vosotros y corre hacia ese punto.' },
      { from: 'capitan_pico', text: '¡Ha picado! Puedo decirlo porque soy especialista en picos y, desde hace siete segundos, en nieblas.' },
      { from: 'system', text: 'CIERRE DE BORRÓN: 3/4 ABIERTOS' },
      { from: 'topotina', text: 'Al perseguir la ruta falsa ha dejado visible el cable del último cierre. Termina junto al lago.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'], effects: { setFlags: ['niebla_enganada_t25a1'] } }),
    Object.assign(conversation('dialogo-final-isla', 'Isla Mágica · llamada de los exploradores', [
      { from: 'system', text: 'Doctor Topoloco ha forzado la entrada al canal.' },
      { from: 'topoloco', text: '¡Alto! Paula y Hugo, todavía podéis uniros a mi versión oficial.' },
      { from: 'topoloco', text: 'Paula será Ministra Suprema de Mapas. Hugo, Director de Rugidos y Entradas Dramáticas. ¿Aceptáis?' }
    ], [
      { from: 'topoloco', text: '¡Excelente! O pésimo. No importa: en mi Cuaderno vuestra respuesta quedará escrita como un sí.' },
      { from: 'topoloco', text: 'Mi Cuaderno guardará una sola historia: yo seré capitán, descubridor, rey y héroe. Vosotros saldréis en letra visible mediante lupa.' },
      { from: 'topotino', text: 'No puedes decidir qué contestaron ni apropiarte de algo que no viviste.' }
    ]), {
      allowedSpeakers: ['topotino', 'topotina', 'capitan_pico', 'topoloco']
    }),
    Object.assign(conversation('dialogo-topoloco-momento', 'Isla Mágica · desafío de Topoloco', [
      { from: 'topoloco', text: 'Muy bien, sabiondos. Decid un momento del viaje que yo jamás podría contar como si lo hubiera vivido.' }
    ], [
      { from: 'topoloco', text: 'Bah. Un detalle menor, emotivo y peligrosamente convincente.' },
      { from: 'topotino', text: 'Precisamente. Tú conoces datos, pero no estuviste allí.' },
      { from: 'topoloco', text: '¡Da igual! He movido el núcleo. Cuando llegue el Rey a las 20:00, mi nombre quedará estampado sobre las doce ventanas.' },
      { from: 'topotina', text: 'Gracias por decir la hora.' },
      { from: 'topoloco', text: '¡Era una amenaza, no una cita!' },
      { from: 'topotina', text: 'El último cierre sigue junto al lago. El cable lee reflejos con la misma señal que apareció durante el eclipse.' }
    ]), {
      allowedSpeakers: ['topotino', 'topotina', 'capitan_pico', 'topoloco'],
      alwaysMessages: [{ from: 'topotino', text: 'Al lago, agentes. Sin correr. Un final épico con una caída tonta pierde bastante categoría.' }]
    }),
    question('sevilla-lago-pista', 'Isla Mágica · lago', 'Topoloco está usando el lago como durante el eclipse. ¿Por qué el reflejo no puede convertirse en dueño del original?', ['Porque depende del objeto, la luz y el agua para existir', 'Porque crea y posee todo lo que aparece en él', 'Porque transforma un decorado actual en un documento del siglo XVI'], 0,
      'Exacto. Sin objeto, luz y superficie no existiría esa imagen.',
      'Topoloco utilizó la sombra del eclipse y los reflejos para copiar y separar recuerdos. El agua en movimiento demuestra que una copia cambia aunque el objeto real siga fuera.',
      'Mirad qué existe fuera del agua y qué cambia en la superficie.'),
    expedition('sevilla-lago-expedicion', 'Isla Mágica · junto al lago', 'Recuperar los cuatro cortes', 'Buscad un punto seguro con vista al agua.', [
      'Elegid un barco, edificio o escenario del parque que se refleje en el agua.',
      'Mirad qué cambia en el reflejo cuando se mueve el agua y qué permanece fuera.',
      'Comparad el objeto real que veis con su imagen reflejada.',
      'Decid cuál podría seguir existiendo si desapareciera el agua.'
    ], [
      { from: 'system', text: 'CIERRE DE BORRÓN: 4/4 ABIERTOS' },
      { from: 'topotina', text: 'Cuatro cortes recuperados. Santa Cruz, la antigua Fábrica, María Luisa y Plaza de España vuelven al mapa como lugares pendientes, no como visitas inventadas.' },
      { from: 'capitan_pico', text: '¡Once testigos reunidos! Esta vez no me he contado a mí. América me confiscó el lápiz.' },
      'Borrón confundió representar con mentir. Habéis demostrado que una recreación puede enseñar sin hacerse pasar por el original.'
    ]),
    question('sevilla-lago-q2', 'Isla Mágica · lago', '¿Qué diferencia una representación honesta de la falsificación de Topoloco?', ['Explica qué recrea y no pretende sustituir al original', 'Borra el original para quedarse con su nombre', 'Afirma que todo ocurrió exactamente como muestra'], 0, [
      'Correcto. Un escenario puede ayudar a imaginar otra época sin declarar que es el documento original.',
      'Borrón y Topoloco borran la diferencia entre copia y original. Por eso sus cuatro cortes no han resistido vuestra comparación.',
      { from: 'topoloco', text: '¡Celebrad lo que queráis! El Rey llegará y mi versión será la oficial, perfecta y sin interrupciones.' }
    ], 'Una representación dice qué recrea. Topoloco pretende borrar el original y quedarse con su nombre.', 'Pensad cuál de las opciones reconoce sus límites.'),
    Object.assign(conversation('dialogo-corral-rey', 'Isla Mágica · mensaje de palacio', [
      { from: 'topotina', text: 'He seguido el núcleo. Termina en un corral del Siglo de Oro. A las 20:00 Sevilla recibirá a Carlos I.' },
      { from: 'capitan_pico', text: 'Discursos, reverencias, bailes y un rey en camino. Al fin una misión adecuada para mi uniforme de gala número…' },
      { from: 'topotino', text: 'No tienes uniforme de gala.' },
      { from: 'capitan_pico', text: 'Por eso sigue impecable. Paula, Hugo: ¿qué creéis que puede salir mal cuando todos intentan que una recepción sea perfecta?' }
    ], [
      { from: 'topotino', text: 'Exacto: nervios, errores y gente corrigiendo sobre la marcha. Justo lo que el Corrector no soporta.' },
      { from: 'topotina', text: 'Id al Corral de Comedias antes de las 20:00 y seguid las indicaciones del personal. Dentro, móvil guardado y en silencio.' },
      { from: 'capitan_pico', text: 'Observad tres cosas: quién se equivoca, quién ayuda y si el caos necesita un único dueño para resolverse.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico'] }),
    Object.assign(expedition('corral-rey-expedicion', 'Corral de Comedias', 'La recepción que debía ser perfecta', 'Entrad con tiempo. Durante la recepción, guardad y silenciad el móvil. Marcadla como hecha solo cuando salgáis.', [
      'Observad un error o equívoco que cambie lo preparado.',
      'Fijaos en cómo otra persona responde, corrige o improvisa.',
      'Comprobad si la recepción avanza gracias a varias personas y no a una sola.'
    ], [
      { from: 'system', text: 'Recepción real terminada. Corrector Definitivo: estabilidad crítica.' },
      { from: 'topoloco', text: '¡PROTESTO! ¡Había un guion! ¡Un guion precioso con mi nombre en todas las páginas!' },
      { from: 'capitan_pico', text: 'Y aun así la historia funcionó con errores, ayuda y muchas voces. Derrota por comedia. Mi modalidad favorita.' }
    ]), { notBefore: { date: '2026-08-25', time: '19:45' } }),
    question('corral-rey-q1', 'Corral de Comedias', '¿Qué demuestra mejor lo ocurrido en la recepción?', ['Que varias personas pueden corregir errores y construir juntas una historia', 'Que solo quien lleva corona puede decidir todo', 'Que equivocarse obliga a borrar lo ocurrido'], 0,
      'Exacto. Los errores no hicieron inútil la historia: permitieron que otros respondieran, ayudaran y la hicieran avanzar.',
      'El Corrector de Topoloco falla porque solo admite un guion, una voz y un dueño.',
      'Elegid la opción que conserve la participación de todos.'),
    question('corral-rey-q2', 'Corral de Comedias', 'Paula y Hugo pueden recordar detalles distintos de esta recepción. ¿Qué debe conservar una memoria honesta?', ['Las dos miradas, sus coincidencias y sus diferencias', 'Solo la versión de quien conteste primero', 'La versión de Topoloco, aunque no estuviera allí'], 0,
      'Correcto. Dos recuerdos distintos pueden pertenecer al mismo momento sin que uno tenga que borrar al otro.',
      'Topoloco solo sabe guardar una respuesta. Vuestra memoria puede conservar lo que vio cada uno.',
      'Pensad quién estuvo de verdad y qué aporta cada mirada.'),
    Object.assign(conversation('dialogo-corral-recuerdos', 'Corral de Comedias · salida', [
      { from: 'topotino', text: 'Ahora sí: decidme un momento que recuerde Paula y otro que recuerde Hugo. Pueden ser distintos. No enseñéis el Cuaderno.' }
    ], [
      { from: 'topotino', text: 'Eso es justo lo que no entiende el Corrector: dos recuerdos distintos pueden pertenecer a la misma aventura.' },
      { from: 'topotina', text: 'El núcleo intenta elegir uno y borrar el otro. No puede. El Cuaderno confirma que vuestra historia existía fuera de su máquina.' },
      { from: 'topoloco', text: '¡Elegid uno! ¡El más elegante! ¡Preferiblemente el que me incluya!' },
      { from: 'capitan_pico', text: 'Decisión naval: conservamos los dos y expulsamos al señor de la corona de cartón.' }
    ]), { allowedSpeakers: ['topotino', 'topotina', 'capitan_pico', 'topoloco'] }),
    {
      id: 'final-sevilla-noche',
      kind: 'ending',
      place: 'Corral de Comedias · salida',
      title: 'Abrir las Doce Aguas',
      intro: 'Consultad el Cuaderno de la Memoria en privado. No enviéis páginas. El guion único ha fallado y Topoloco no puede copiar lo que vivisteis juntos.',
      actions: [
        'Mirad el Cuaderno sin mostrarlo.',
        'Elegid una diferencia real entre vuestros recuerdos del viaje o de la recepción.',
        'Decid juntos por qué las dos miradas pertenecen a quienes vivieron la aventura.',
        'Cuando estéis preparados, abrid la última ventana.'
      ],
      completionLabel: '¡Abrir la última ventana!',
      doneMessages: ['Las doce ventanas responden a la vez. El Corrector intenta elegir un único dueño, no puede hacerlo y pierde el control.'],
      effects: {
        setFlags: ['completado_isla_magica', 'completado_sevilla_alhambra_noche', 'topoloco_derrotado', 'doce_aguas_reunidas'],
        water: 'Agua Clara de la Noche',
        lockFinalRoute: true
      }
    }
  ]
};

packs['018-sevilla-alhambra-noche'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Ayer engañasteis a Niebla y apareció el destino final: la Alhambra de noche.',
    'No podemos abrirla aún. La máquina exige dos pruebas sevillanas: varias épocas juntas y un edificio que cambió de función sin perder toda su memoria.',
    'La primera cerradura está en el Real Alcázar. La segunda solo aparecerá cuando la resolvamos.'
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

const STORY_CONVERSATIONS = Object.freeze({
  'dia17-pista-lisboa': {
    place: 'Dino Parque · despedida de Louri',
    prompt: [
      { from: 'topotina', text: 'He revisado el dinosaurio rojo de Hugo. Topoloco escondió dentro un comunicador conectado con Louri. Sus ojos eran una cámara y he recuperado dos grabaciones.' },
      { from: 'louri', text: 'Yo estaba al otro lado de la señal. Era espionaje remoto de altísimo nivel. Y no tuve que mover ni uno de mis diminutos brazos.' },
      { from: 'topotino', text: 'Hugo, he visto tu actuación en la plaza y me encantó. Paula, también vi cómo te orientabas ayer por Óbidos: me gusta mucho cómo encuentras el camino.' },
      { from: 'topotino', text: 'Antes de despedirnos: ¿estáis escribiendo y dibujando el Cuaderno de la Memoria?' }
    ],
    reply: [
      { from: 'topotino', text: 'Gracias por responder. Si vais poco a poco, está bien. No quiero verlo ni saber qué habéis puesto: el Cuaderno es vuestro y debe quedar fuera de esta red.' },
      { from: 'louri', text: 'Creo que me quedaré aquí. Necesito descubrir quién soy. Aunque sospecho que soy extraordinario.' },
      { from: 'topotino', text: 'Eso sí parece bastante confirmado.' },
      { from: 'louri', text: 'Paula, Hugo: si alguien vuelve a espiaros mediante un juguete de comida rápida, miradle los ojos. Las cámaras pestañean fatal.' },
      { from: 'system', text: 'Louri ha salido del canal.' },
      { from: 'topotina', text: 'Canal Louri cerrado definitivamente. Su fragmento señala LISBOA.' },
      { from: 'topotino', text: 'Gracias, Louri. Y esta vez cambia la contraseña de verdad, Topotina.' }
    ]
  },
  'ruta-dia18': {
    place: 'Lisboa · cierre del día',
    prompt: [{ from: 'topotina', text: 'Habéis llegado siguiendo una coordenada que ayer no existía para nosotros. ¿Qué os ha sorprendido más de las calles de Lisboa?' }],
    reply: [{ from: 'topotino', text: 'Me lo guardo. Una ciudad reconstruida no es una maqueta: se entiende caminándola. Ahora veamos qué módulo señaló Louri para mañana.' }]
  },
  'dia18-pista-oceanario': {
    place: 'Pavilhão · módulo saboteado',
    prompt: [{ from: 'topotina', text: 'El módulo de Topoloco acaba de fallar. ¿Hubo algún experimento que no saliera como esperabais?' }],
    reply: [{ from: 'topotino', text: 'Eso es justo lo que su máquina no soporta: probar, sorprenderse y corregir. El fallo ha dejado una nueva señal.' }]
  },
  'alfama-visita-expedicion': {
    place: 'Rossio · visita guiada de Alfama',
    prompt: [{ from: 'topotino', text: 'Topoloco se esconde en Alfama. Durante la visita de las 10:30, escuchad con atención: ¿qué historia, lugar o detalle os parece más importante?' }],
    reply: [{ from: 'topotino', text: 'Guardadlo y separad lo que visteis de lo que os contaron. Después comprobaremos si Topoloco ha mezclado historia, leyenda y opinión.' }]
  },
  'ruta-dia19': {
    place: 'Alfama · señal recuperada',
    prompt: [{ from: 'topotina', text: 'Topoloco ha salido de Alfama, pero dejó una señal relacionada con viajes, poder y piedra. ¿Qué lugar de Belém debemos investigar?' }],
    reply: [{ from: 'topotino', text: 'Correcto: los Jerónimos. Después de escuchar el barrio antiguo, iremos a comprobar cómo un monumento cuenta —y también selecciona— una historia.' }]
  },
  'dia19-pista-castelo': {
    place: 'Jerónimos · siguiente señal',
    prompt: [{ from: 'topotino', text: 'Después de los Jerónimos, la señal sube hacia una fortaleza. ¿Qué puede enseñar una vista alta que no vemos desde la calle?' }],
    reply: [{ from: 'topotina', text: 'Una vista alta amplía la información, pero también puede ocultar lo que ocurre entre las casas. Comprobadlo en el castillo.' }]
  },
  'dia19-pista-belem': {
    place: 'Castelo · señal hacia Belém',
    prompt: [{ from: 'topotina', text: 'Desde la colina la señal sigue el Tajo. ¿Qué zona reúne una torre defensiva y monumentos relacionados con viajes?' }],
    reply: [{ from: 'topotino', text: 'Belém. Allí compararemos defensa, conmemoración, viajes y río sin mezclarlos en una sola historia.' }]
  },
  'ruta-dia20': {
    place: 'Belém · archivo recuperado',
    prompt: [{ from: 'topotino', text: 'Después de tantos monumentos, ¿qué historia de Belém os gustaría recordar dentro de años?' }],
    reply: [{ from: 'topotina', text: 'Esa elección vuestra es justo lo que Topoloco no puede decidir por vosotros. Niebla ha huido con un receptor y ya tengo su rastro.' }]
  },
  'dia20-pista-lagos': {
    place: 'Conexión de emergencia de Louri',
    prompt: [{ from: 'louri', text: 'El safari era un señuelo. ¿Qué ciudad del Algarve tiene una marina desde la que buscar delfines y cuevas del mar?' }],
    reply: [{ from: 'topotina', text: 'Lagos encaja. He fijado la señal antes de que Topoloco vuelva a cortarla.' }]
  },
  'ruta-dia21': {
    place: 'Lagos · canal recuperado',
    prompt: [{ from: 'topotina', text: 'Topoloco utilizó el safari como señuelo. ¿Qué detalle de la pista de Louri os hizo pensar en Lagos?' }],
    reply: [{ from: 'topotino', text: 'La marina y las salidas hacia delfines y cuevas marinas. Mañana sabremos qué quiere grabar en el mar.' }]
  },
  'ruta-dia22': {
    place: 'Tarde en la playa de Lagos',
    notBefore: { date: '2026-08-21', time: '17:30' },
    effects: { setFlags: ['tarde_lagos_lista'] },
    prompt: [
      { from: 'topotino', text: 'Esta tarde no hay misión. Disfrutad de la playa y descansad; bastante hemos tenido con delfines, cuevas, hackers y basura.' },
      { from: 'topotina', text: 'He terminado de descifrar el archivo de Eco. Antes de mostrarlo: ¿habéis conseguido descansar un poco?' }
    ],
    reply: [
      { from: 'topotino', text: 'Bien. Descansar también forma parte de una expedición, aunque Topoloco lo consideraría una grave falta de dramatismo.' },
      { from: 'topotina', text: 'El archivo contiene la primera coordenada y una imagen de acantilados amarillos con cuevas, arcos y pilares. Eco quiere usar una parte de la costa para contar una historia falsa sobre toda ella.' },
      { from: 'topotino', text: 'Averigüemos el primer lugar de mañana. Después haced las maletas: la señal seguirá explorando el Algarve.' }
    ]
  },
  'dia22-pista-albufeira': {
    place: 'Ponta da Piedade',
    prompt: [{ from: 'topotina', text: 'Ya habéis visto cómo cambia la roca de un punto a otro. ¿Qué detalle os ha parecido más difícil de explicar?' }],
    reply: [{ from: 'topotino', text: 'Gracias. Eco no puede reducir toda la costa a una sola forma. Ahora está repitiendo una mentira sobre 1755 desde otra ciudad del Algarve.' }]
  },
  'ruta-dia23': {
    place: 'Refugio de Lona · señal recuperada',
    prompt: [{ from: 'topotina', text: 'Ya estamos a salvo y Eco ha perdido la repetición. ¿Qué parte de Albufeira os ayudó más a descubrir su mentira?' }],
    reply: [{ from: 'topotino', text: 'Eso era justo lo que Eco había quitado. Al recuperarlo han aparecido dos palabras: Porto d’Abrigo. Vasco sabe qué significan.' }]
  },
  'ruta-dia24': {
    place: 'Zoomarine · conclusión',
    prompt: [{ from: 'topotina', text: 'Después de ver rescate y rehabilitación, ¿qué significa para vosotros cuidar sin poseer?' }],
    reply: [{ from: 'topotino', text: 'Gracias. Esa respuesta me ha ayudado a unir el motivo, el método y mi amnesia. Borrón acaba de atacar la siguiente ventana.' }]
  },
  'dia24-pista-sevilla': {
    place: 'Tavira · transmisión interceptada',
    allowedSpeakers: ['topotino', 'topotina', 'louri'],
    allowClosedSpeaker: 'louri',
    prompt: [
      { from: 'system', text: 'Solicitud de entrada: señal sauriana verificada.' },
      { from: 'topotino', text: 'No. Otra vez no. ¿Louri?' },
      { from: 'topotina', text: 'Es él. La firma procede de Dino Parque y la conexión durará un minuto.' },
      { from: 'louri', text: 'He interceptado una frase de Topoloco gracias a mi extraordinario oído científico.' },
      { from: 'louri', text: 'Dijo: «El último cargamento seguirá la autopista de agua hasta la ciudad que guardaba los viajes a América».' },
      { from: 'louri', text: 'No sé qué ciudad es. Naturalmente podría averiguarlo, pero deseo comprobar si vosotros también sois extraordinarios. ¿Qué pensáis?' }
    ],
    reply: [
      { from: 'louri', text: 'Interesante. Mi hipótesis personal era «un lugar con agua», lo cual abarca casi todo el planeta y por eso es una hipótesis muy ambiciosa.' },
      { from: 'topotina', text: 'Tenemos datos más precisos: una ciudad conectada con el Atlántico por un río y un archivo que conserva documentos de viajes a América.' },
      { from: 'louri', text: 'Mi minuto termina. Recordad: Topoloco habló de un cargamento final. Esto ya no es otra pista suelta.' },
      { from: 'system', text: 'Louri ha salido del canal.' },
      { from: 'topotino', text: 'Gracias, Louri. Ahora sí: unamos todas las pistas y elijamos la ciudad.' }
    ]
  },
  'ruta-dia25': {
    place: 'Sevilla · intrusión nocturna',
    notBefore: { date: '2026-08-24', time: '20:00' },
    allowedSpeakers: ['topotino', 'topotina', 'doctora_tecla', 'topoloco'],
    prompt: [
      { from: 'system', text: 'Doctora Tecla ha abierto un acceso antiguo.' },
      { from: 'topotino', text: '¡TECLA! Se suponía que habías cerrado ese acceso.' },
      { from: 'doctora_tecla', text: 'Lo cerré. Lo he vuelto a abrir porque busco un módulo que mi marido ha robado de mi taller.' },
      { from: 'topoloco', text: '¡No lo robé! Lo trasladé sin una montaña de permisos aburridos.' },
      { from: 'doctora_tecla', text: 'Lo llamé Cuaderno de Bitácora Único y lo bloqueé porque es peligroso. Guarda una sola versión, nombra un capitán y elimina las demás voces.' },
      { from: 'topoloco', text: 'Una historia necesita orden. Y un retrato mío enorme en la portada.' },
      { from: 'doctora_tecla', text: 'Paula, Hugo: ¿entendéis por qué sería grave que Topoloco decidiera quién aparece como héroe de todo lo que habéis vivido?' }
    ],
    reply: [
      { from: 'doctora_tecla', text: 'Exacto. Una máquina puede guardar datos, pero no tiene derecho a convertir a quien no estuvo allí en dueño de la experiencia.' },
      { from: 'topoloco', text: '¡Deja de explicar mi plan en el chat de mis enemigos!' },
      { from: 'doctora_tecla', text: 'Entonces no robes mis prototipos.' },
      { from: 'topotina', text: 'He leído la dirección que dejó el módulo: una isla dentro de Sevilla, barcos, exploradores y viajes a América.' },
      { from: 'doctora_tecla', text: 'Y tiene la misma firma que aquella instalación de Magikland. Hasta aquí puedo decir sin haceros el trabajo.' },
      { from: 'topoloco', text: '¡No podéis encontrar una isla en mitad de una ciudad!' },
      { from: 'doctora_tecla', text: 'Yo me voy. Y no pienso repararte nada cuando lo rompas.' },
      { from: 'system', text: 'Doctora Tecla y Doctor Topoloco han salido del canal.' },
      { from: 'topotino', text: 'Bien. La discusión ha dejado todas las pistas. Ahora tenemos que descubrir el nombre de esa isla imposible.' }
    ]
  }
});

for (const [episodeId, pack] of Object.entries(packs)) {
  if (Number(episodeId.slice(0, 3)) < 9) continue;
  pack.steps = pack.steps.flatMap((step) => {
    const bridge = STORY_CONVERSATIONS[step.id];
    if (!bridge) return [step];
    return [Object.assign(
      conversation(`dialogo-${step.id}`, bridge.place, bridge.prompt, bridge.reply),
      bridge.notBefore ? { notBefore: bridge.notBefore } : {},
      bridge.effects ? { effects: bridge.effects } : {},
      bridge.allowedSpeakers ? { allowedSpeakers: bridge.allowedSpeakers } : {},
      bridge.allowClosedSpeaker ? { allowClosedSpeaker: bridge.allowClosedSpeaker } : {}
    ), step];
  });
}

export const CHALLENGE_PACKS = Object.freeze(packs);
