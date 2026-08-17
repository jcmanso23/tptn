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

function conversation(id, place, promptMessages, replyMessages) {
  return { id, kind: 'conversation', place, promptMessages, replyMessages };
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
    'Buenos días. Louri cerró su canal ayer, pero su plano sigue siendo nuestra única ventaja.',
    'Señala el Pavilhão do Conhecimento: allí está el módulo que Topoloco usa para separar causas y coincidencias.',
    'Si aprendemos cómo decide qué produjo cada cambio, podremos sabotearlo sin que Topoloco sepa qué dato le falló.'
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
    'Buenos días. Ayer estropeamos el módulo que separaba causas y relaciones.',
    'Topoloco ha movido los datos al archivo histórico de Lisboa. Quiere guardar una ciudad sin terremoto, reconstrucción ni voces distintas.',
    'La señal empieza en el Castelo de São Jorge: desde arriba veremos la versión general antes de comprobar a pie lo que oculta.'
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
    route('ruta-dia20', 'Al conservar las capas reales de Lisboa, Niebla huye con un receptor de la máquina. Su señal aparece entre animales africanos en grandes espacios. ¿Dónde lo buscamos mañana?', ['Badoca Safari Park', 'Oceanário', 'Tapada Nacional de Mafra'], 0, [
      'Primera señal encontrada: Badoca Safari Park.',
      'Niebla quiere convertir cualquier movimiento animal en un cuento falso. Nosotros separaremos conducta visible e interpretación.',
      'Preparad agua, protector solar, prismáticos si tenéis y ropa cómoda. Lo demás sigue oculto. Descansad.'
    ], { setFlags: ['completado_lisboa_historia_belem'], water: 'Agua de la Ciudad que Regresa' })
  ]
};

packs['012-badoca-lagos'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días. Niebla escapó de Lisboa con un receptor de la máquina y lo ha escondido en Badoca.',
    'Quiere grabar cómo decidís cuando un animal se mueve y así anticipar vuestra próxima elección.',
    'Describid conductas visibles sin inventar intenciones: si el receptor recibe suposiciones, Niebla gana.'
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
    nextStop('dia20-pista-lagos', 'Habéis encontrado el receptor. Niebla lo activa y huye hacia un puerto con marina, murallas y salidas al Atlántico. ¿Dónde intentará embarcarlo?', ['Lagos', 'Sines', 'Sesimbra'], 0, [
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
    'Buenos días. Niebla llevó el receptor hasta una embarcación de Lagos.',
    'Topoloco necesita respuestas seguras sobre algo que nadie puede ordenar: que aparezcan delfines y cómo actúe el mar.',
    'Aplicaremos el Protocolo Azul. Una observación limitada y honesta hará que su máquina aprenda una certeza falsa.'
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
    nextStop('dia21-pista-sagres', 'En Benagil, el receptor confunde «hueco» con «nada». Al corregirlo interceptamos una orden enviada a un promontorio con fortaleza y un cabo frente al Atlántico. ¿Dónde espera Eco?', ['Sagres y Cabo de São Vicente', 'Belém', 'Cascais'], 0, [
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
    'Buenos días. En Sagres interceptamos la orden de Topoloco: Eco está copiando la voz de Topotino.',
    'Necesita sonidos, palabras y patrones. Las formas de Ponta da Piedade pueden enseñarnos a distinguir dos cosas parecidas antes de que intente suplantarlo.'
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
    'Buenos días. Eco se delató al pedir una foto del Cuaderno: Topotino nunca lo haría.',
    'Su orden de retirada viene de Zoomarine. Topoloco intenta alimentar la máquina con una mentira: «si cuidas algo, te pertenece».',
    'Vamos a demostrar que rescatar, rehabilitar y devolver al mar es cuidar sin convertirse en dueño.'
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
    'Buenos días. Ayer unimos motivo, conducta y resultado: Topoloco provocó la amnesia para dejar de perder contra nosotros.',
    'Borrón ha reaccionado escribiendo «romano» sobre el puente de siete arcos de Tavira.',
    'El Cuaderno nos ayudará, en privado, a recordar cómo se corrige una etiqueta sin borrar el lugar.'
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
    'Buenos días. Al corregir a Borrón en Tavira y comparar los puentes de Sevilla, reapareció la firma gemela de Magikland.',
    'Conduce a Isla Mágica. Niebla ha combinado ruido, emoción y urgencia para que elijáis sin comprobar.',
    'Capitán Pico, América y Krim están dentro. No resolverán la trampa, pero nos ayudarán a hacer que Niebla siga una respuesta falsa.'
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
    route('ruta-dia26', 'La contratrampa revela el final —la Alhambra de noche— pero mantiene dos cerraduras previas. La primera es un palacio sevillano con edificios y jardines de muchas épocas. ¿Cuál es?', ['Real Alcázar de Sevilla', 'Palacio de las Dueñas', 'Castillo de Gibralfaro'], 0, [
      'Primera señal encontrada: Real Alcázar de Sevilla.',
      'Solo sabemos que allí debemos comprobar cómo varias épocas pueden convivir sin que una borre a las demás.',
      'Tened agua y calzado cómodo. Guardad energía; la red sigue ocultando el resto.'
    ], { setFlags: ['completado_isla_magica'] })
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
  'dia18-pista-tejo': {
    place: 'Oceanário · mensaje de Vasco',
    prompt: [{ from: 'topotino', text: 'Vasco quiere saber una cosa: ¿qué animal o relación del Oceanário os llamó más la atención?' }],
    reply: [{ from: 'topotino', text: 'Vasco dice que una respuesta personal vale más que una lista de especies. Y ha marcado una salida desde el tanque hacia agua real.' }]
  },
  'ruta-dia19': {
    place: 'Tajo · red confirmada',
    prompt: [{ from: 'topotina', text: 'El tanque y el Tajo pertenecen a escalas muy distintas. ¿Os pareció el río más grande de lo que imaginabais?' }],
    reply: [{ from: 'topotino', text: 'Topoloco intentó separar las dos cosas y habéis vuelto a unirlas. La señal huye ahora hacia la parte antigua de Lisboa.' }]
  },
  'dia19-pista-alfama': {
    place: 'Castelo de São Jorge',
    prompt: [{ from: 'topotino', text: 'Desde arriba todo parece ordenado. ¿Qué detalle no esperabais ver desde el castillo?' }],
    reply: [{ from: 'topotina', text: 'Una vista alta ayuda, pero también oculta lo que ocurre entre las casas. La señal nos obliga a bajar y comprobarlo a pie.' }]
  },
  'dia19-pista-belem': {
    place: 'Alfama y Baixa',
    prompt: [{ from: 'topotina', text: 'Habéis caminado dos trazados muy distintos. ¿En cuál os resultó más fácil orientaros?' }],
    reply: [{ from: 'topotino', text: 'No hay respuesta mala: cada trazado cuenta una forma distinta de crecer o reconstruir una ciudad. La marca sigue el Tajo.' }]
  },
  'ruta-dia20': {
    place: 'Belém · archivo recuperado',
    prompt: [{ from: 'topotino', text: 'Después de tantos monumentos, ¿qué historia de Belém os gustaría recordar dentro de años?' }],
    reply: [{ from: 'topotina', text: 'Esa elección vuestra es justo lo que Topoloco no puede decidir por vosotros. Niebla ha huido con un receptor y ya tengo su rastro.' }]
  },
  'dia20-pista-lagos': {
    place: 'Badoca · receptor localizado',
    prompt: [{ from: 'topotino', text: 'Niebla quería que inventarais emociones. ¿Qué animal os costó más observar sin imaginar lo que pensaba?' }],
    reply: [{ from: 'topotina', text: 'Buena observación. El receptor no ha podido predecir vuestra respuesta y Niebla acaba de activarlo para escapar.' }]
  },
  'ruta-dia21': {
    place: 'Lagos · junto al Atlántico',
    prompt: [{ from: 'topotina', text: 'Habéis seguido un aparato desde un safari hasta una marina. ¿Creéis que Niebla esperaba que llegarais tan lejos?' }],
    reply: [{ from: 'topotino', text: 'Yo tampoco. Bueno, sí. Casi. El receptor termina en una salida de barco y mañana sabremos qué quiere grabar.' }]
  },
  'dia21-pista-sagres': {
    place: 'Barco y Benagil',
    prompt: [{ from: 'topotino', text: 'Vasco pregunta: ¿qué fue más emocionante, encontrar animales o no saber qué iba a aparecer?' }],
    reply: [{ from: 'topotina', text: 'La incertidumbre también forma parte de una experiencia real. Al corregir el error sobre Benagil hemos interceptado una orden de Eco.' }]
  },
  'ruta-dia22': {
    place: 'Sagres · mensaje de Corvinho',
    prompt: [{ from: 'topotino', text: 'Corvinho grazna una pregunta: ¿qué hipótesis cambiasteis después de mirar mejor?' }],
    reply: [{ from: 'topotino', text: 'Corvinho dice «craa»; creo que significa que acepta la respuesta. Eco ha escapado con sonidos de la costa.' }]
  },
  'dia22-pista-algar': {
    place: 'Ponta da Piedade',
    prompt: [{ from: 'topotina', text: 'Entre cuevas, arcos y pilares, ¿qué forma os engañó primero?' }],
    reply: [{ from: 'topotino', text: 'Confundirse al principio no estropea la misión. Mirar otra vez sí cambia la historia. Eco ha dejado otra forma costera en la señal.' }]
  },
  'dia22-pista-jaima': {
    place: 'Algar Seco',
    prompt: [{ from: 'topotino', text: '¿Qué ventana o hueco de la roca os pareció más raro? Eco está copiando formas igual que copia voces.' }],
    reply: [{ from: 'topotina', text: 'He comparado vuestra respuesta con su señal. Eco no está en la roca: ha escondido la voz en el lugar donde dormiréis.' }]
  },
  'ruta-dia23': {
    place: 'HolaJaima · Eco descubierto',
    prompt: [{ from: 'topotino', text: 'Ese farsante pidió el Cuaderno. ¿Hubo alguna palabra o detalle que os hiciera desconfiar antes?' }],
    reply: [{ from: 'topotino', text: 'Hicisteis bien en parar. Un amigo no necesita una contraseña privada para demostrar que lo es. Eco dejó su orden de retirada.' }]
  },
  'ruta-dia24': {
    place: 'Zoomarine · conclusión',
    prompt: [{ from: 'topotina', text: 'Después de ver rescate y rehabilitación, ¿qué significa para vosotros cuidar sin poseer?' }],
    reply: [{ from: 'topotino', text: 'Gracias. Esa respuesta me ha ayudado a unir el motivo, el método y mi amnesia. Borrón acaba de atacar la siguiente ventana.' }]
  },
  'dia24-pista-sevilla': {
    place: 'Tavira · etiqueta corregida',
    prompt: [{ from: 'topotino', text: '¿Qué os parece más peligroso: equivocarse o repetir un nombre sin comprobarlo?' }],
    reply: [{ from: 'topotina', text: 'Corregir no borra el puente; mejora lo que sabemos de él. Borrón ha perdido la etiqueta y la señal cruza la frontera.' }]
  },
  'ruta-dia25': {
    place: 'Plaza de España · dos orillas',
    prompt: [{ from: 'topotina', text: 'Habéis comparado puentes reales y simbólicos. ¿Cuál os ayudó más a entender para qué sirve cruzar?' }],
    reply: [{ from: 'topotino', text: 'Me gusta esa respuesta. Al unir las dos orillas ha reaparecido una firma que ya vimos en Magikland.' }]
  },
  'ruta-dia26': {
    place: 'Isla Mágica · contratrampa',
    prompt: [{ from: 'topotino', text: 'Capitán Pico, América y Krim quieren saber: ¿qué os ayudó a no elegir con prisa?' }],
    reply: [{ from: 'topotina', text: 'Niebla siguió la opción falsa y reversible. Vuestra respuesta ha quedado fuera de su trampa y la señal final empieza a abrirse.' }]
  },
  'dia26-pista-catedral': {
    place: 'Real Alcázar · primera cerradura',
    prompt: [{ from: 'topotino', text: 'Después de patios, palacios y jardines, ¿qué cambio os pareció que conservaba mejor lo anterior?' }],
    reply: [{ from: 'topotina', text: 'Esa diferencia abre la primera cerradura. La segunda pide una torre que cambió de función.' }]
  },
  'dia26-pista-alhambra': {
    place: 'Catedral y Giralda · segunda cerradura',
    prompt: [{ from: 'topotina', text: 'La Giralda cambió sin dejar de ser reconocible. ¿Qué parte antigua y qué añadido recordaréis?' }],
    reply: [{ from: 'topotino', text: 'Perfecto. Ya tenemos las dos ideas que Topoloco intentaba separar. Ahora la frase final puede leerse completa.' }]
  }
});

for (const [episodeId, pack] of Object.entries(packs)) {
  if (Number(episodeId.slice(0, 3)) < 9) continue;
  pack.steps = pack.steps.flatMap((step) => {
    const bridge = STORY_CONVERSATIONS[step.id];
    if (!bridge) return [step];
    return [conversation(`dialogo-${step.id}`, bridge.place, bridge.prompt, bridge.reply), step];
  });
}

export const CHALLENGE_PACKS = Object.freeze(packs);
