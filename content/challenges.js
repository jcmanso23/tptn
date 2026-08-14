const optionIds = ['a', 'b', 'c', 'd'];

function question(id, place, prompt, options, correctIndex, success, learn, hint, recoveryActions) {
  return {
    id,
    kind: 'choice',
    place,
    prompt,
    options: options.map((text, index) => ({ id: optionIds[index], text })),
    correctOptionId: optionIds[correctIndex],
    successMessages: [success, learn],
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
    place: 'Ruta de mañana',
    prompt,
    options: options.map((text, index) => ({ id: optionIds[index], text })),
    correctOptionId: optionIds[correctIndex],
    successMessages,
    hint: 'Usad todas las pistas y pensad qué ruta permite verlas en el mismo día.',
    recovery: {
      title: 'Pista definitiva de ruta',
      actions: ['Leed otra vez cada pista.', 'Buscad la opción que las reúne todas sin forzar ninguna.']
    },
    effects
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
    'Mi memoria conserva seis mundos imposibles y una máquina que estudia cómo nace un recuerdo. Topoloco podría estar aprendiendo de nosotros.',
    'Hoy no tenéis que escribir explicaciones largas. Mirad, haced y elegid. Yo me encargo de ordenar la historia.'
  ],
  steps: [
    ...withOrder(
      expedition('magikland-expedicion', 'Magikland', 'Expedición de los seis mundos', 'Recorred el parque sin prisa. No hace falta montar en nada que no queráis.', [
        'Localizad tres mundos distintos entre África, Far-West, Souk, Piratas, Aldea Medieval y Mundo da Confusão.',
        'Buscad algo que gire, algo que vaya y vuelva y algo que se desplace.',
        'Elegid un momento que creáis que recordaréis dentro de mucho tiempo.'
      ], [
        'Hecho. Ya puedo ordenar lo que habéis visto.',
        'Topoloco no estudia solo atracciones: intenta separar movimiento, emoción y recuerdo. Ese aparato es su Cazarrisas.'
      ]),
      [
        question('magikland-q1', 'Magikland', '¿Cuál de estos movimientos es una oscilación?', ['Una noria que gira alrededor de su eje', 'Un barco que va y vuelve', 'Un tren que avanza por la vía'], 1, 'Correcto: ir y volver alrededor de una posición es oscilar.', 'La rotación gira alrededor de un eje; el desplazamiento cambia de lugar. Topoloco los mezclaba para que su máquina pareciera más lista.', 'Fijaos en qué movimiento cambia de dirección una y otra vez.'),
        question('magikland-q2', 'Magikland', '¿Qué hace que un momento se convierta mejor en recuerdo?', ['Que sea el más ruidoso', 'Que tenga significado para quien lo vive', 'Que dure exactamente un minuto'], 1, 'Sí. El significado pesa más que los decibelios.', 'Entra una transmisión: «Soy Topotina, tu hermana. Diseñé las ventanas». No la recuerdo. Ella responde: «No necesito que me recuerdes para seguir siendo tu hermana».', 'Pensad en el momento que elegisteis: ¿lo recordaréis solo por el volumen?')
      ]
    ),
    question(
      'curia-ruta-descubierta',
      'Nueva coordenada',
      'El Cazarrisas acaba de expulsar una reserva antigua: un hotel inaugurado en 1922, rodeado de jardines y cerca de unas termas del centro de Portugal. ¿A qué localidad conduce?',
      ['Curia', 'Aveiro', 'Braga'],
      0,
      'Curia. La señal no apunta a toda la localidad, sino al Hotel do Parque.',
      'Topoloco parece comparar recuerdos con edificios que cambian sin borrar lo anterior. Vamos a comprobarlo allí.',
      'Buscad la localidad termal vinculada a un Hotel do Parque inaugurado en 1922.'
    ),
    ...withOrder(
      expedition('curia-expedicion', 'Hotel do Parque · Curia', 'Expedición del hotel que conserva tiempo', 'Cuando lleguéis a Curia, la investigación continúa en el Hotel do Parque y sus jardines.', [
        'Mirad la fachada y localizad dos detalles que parezcan de otra época.',
        'Dentro, con los adultos, buscad una adaptación que permita usar hoy el edificio como hotel.',
        'Salid al jardín y comparad una zona construida con una zona vegetal.',
        'Buscad un reflejo seguro en cristal, piscina o agua, sin acercaros a ningún borde.'
      ], [
        'Expedición completada. El edificio abrió en 1922 y fue adaptándose sin borrar todas sus huellas.',
        'Eso es justo lo que Topoloco no comprende: cambiar de uso no obliga a perder la memoria.'
      ]),
      [
        question('curia-q1', 'Hotel do Parque · Curia', '¿Qué prueba mejor que un edificio antiguo sigue vivo?', ['Que todo permanezca exactamente igual', 'Que conserve huellas antiguas y tenga adaptaciones actuales', 'Que nadie pueda entrar'], 1, 'Exacto. Conservar no significa congelar.', 'Un hotel histórico puede mantener fachada, suelos o decoración y, a la vez, incorporar instalaciones actuales.', 'Comparad los detalles antiguos con la adaptación que habéis encontrado.'),
        question('curia-q2', 'Hotel do Parque · Curia', 'Si un reflejo se mueve cuando cambia el agua, ¿qué demuestra?', ['Que el reflejo depende del objeto y de la superficie', 'Que el edificio se está moviendo', 'Que el reflejo es más antiguo que el objeto'], 0, 'Muy bien. El reflejo no es una copia independiente.', 'Esta idea será importante: una imagen puede deformarse aunque el original siga en su sitio.', 'Mirad qué cambia realmente: ¿el edificio o la superficie que lo refleja?')
      ]
    ),
    recovery('recuperacion-dia14', 'Para borrar una Sombra: ¿qué une Magikland y el Hotel do Parque?', ['Los dos muestran que un recuerdo nace al relacionar experiencia y cambio', 'Los dos fueron construidos en 1922', 'Los dos son bosques'], 0, 'Recuperación conseguida. Habéis unido movimiento, significado y cambio sin borrar el pasado.', 'La Sombra se queda hoy. No pasa nada: sabemos exactamente qué relación debemos reforzar.'),
    route('ruta-dia15', 'Una nueva pista muestra un bosque con convento, ermitas, una batalla y un palacio; después, un monasterio nacido de una promesa y una gran explanada de peregrinos. ¿Qué ruta es?', ['Buçaco, Batalha y Fátima', 'Sintra, Nazaré y Leiria', 'Oporto, Guimarães y Braga'], 0, [
      'Ruta encontrada: Mata Nacional do Buçaco, Monasterio de Batalha y Fátima.',
      'Seguimos esa ruta porque Topoloco confunde lo más grande con lo más importante. Mañana veremos promesas muy distintas.',
      'Preparad calzado cómodo, agua y algo para lluvia o sol. Será un día largo: bosque, piedra y una gran explanada. Descansad.'
    ], { setFlags: ['completado_magikland_curia'], water: 'Agua de la Risa', formulaWord: 'RIO' })
  ]
};

packs['007-bucaco-batalha-fatima'] = {
  shadowActor: 'Borrón',
  openingMessages: [
    'Buenos días. Ayer descubristeis tres paradas: Buçaco, Batalha y Fátima.',
    'Topoloco sostiene que solo importa lo enorme y terminado. Hoy vamos a demostrar que una promesa, una obra incompleta y un lugar pequeño pueden guardar mucha memoria.'
  ],
  steps: [
    ...withOrder(
      expedition('bucaco-expedicion', 'Mata Nacional do Buçaco', 'Expedición del bosque con capas', 'El bosque no es un decorado: cada parte pertenece a una época y a un uso.', [
        'Localizad el Palace Hotel y comparadlo con el Convento de Santa Cruz.',
        'Buscad una ermita o capilla separada del convento.',
        'Llegad a Fonte Fria y observad cómo baja el agua por la escalinata.',
        'Encontrad una señal, placa o vista relacionada con la batalla de 1810.'
      ], [
        'Ya está. Habéis recorrido cuatro capas del mismo bosque.',
        'Los carmelitas construyeron aquí su retiro desde 1628; la batalla llegó en 1810 y el palacio pertenece a otra transformación posterior.'
      ]),
      [
        question('bucaco-q1', 'Mata Nacional do Buçaco', '¿Qué elemento pertenece mejor a la vida retirada de los carmelitas?', ['Una ermita apartada', 'El gran Palace Hotel', 'Una atracción mecánica'], 0, 'Correcto. La ermita permitía retirarse de la comunidad.', 'Las pequeñas ermitas tenían espacios mínimos para oración y vida cotidiana. Su tamaño ayudaba a su función.', 'Recordad cuál de los lugares estaba pensado para estar separado.'),
        question('bucaco-q2', 'Mata Nacional do Buçaco', '¿Qué muestra mejor Fonte Fria?', ['Que el agua organiza un recorrido construido dentro del bosque', 'Que el bosque no necesita agua', 'Que la fuente es anterior a toda presencia humana'], 0, 'Sí. Naturaleza y construcción trabajan juntas.', 'La fuente tiene origen carmelita y fue transformada; su aspecto actual también cuenta cambios posteriores.', 'Seguid con la vista el camino del agua por escalones, canales y estanques.')
      ]
    ),
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
        question('batalha-q1', 'Monasterio de Batalha', '¿Por qué se empezó a construir el monasterio?', ['Por una promesa ligada a una victoria', 'Para ocultar un parque acuático', 'Porque las Capelas Imperfeitas ya existían'], 0, 'Exacto. La promesa y la victoria están en el origen del monumento.', 'La construcción comenzó en 1388 y convirtió una decisión histórica en un lugar de memoria.', 'Pensad qué hecho y qué promesa explican su nombre y su origen.'),
        question('batalha-q2', 'Monasterio de Batalha', '¿Qué enseñan las Capelas Imperfeitas?', ['Que una obra incompleta también puede tener valor e historia', 'Que nunca se comenzó a trabajar en ellas', 'Que todo el monasterio está sin techo'], 0, 'Muy bien. Incompleto no significa vacío.', 'Las capillas fueron concebidas como panteón y conservan el rastro de un proyecto que cambió.', 'Mirad qué partes existen aunque el conjunto no se terminara como estaba previsto.')
      ],
      'question-first'
    ),
    ...withOrder(
      expedition('fatima-expedicion', 'Fátima', 'Expedición de la escala', 'Aquí compararemos un lugar pequeño con espacios capaces de reunir a muchísimas personas.', [
        'Localizad la Capelinha das Aparições.',
        'Cruzad una parte de la explanada y mirad la distancia entre sus extremos.',
        'Comparad desde fuera la Basílica do Rosário y la Basílica da Santíssima Trindade.',
        'Buscad una señal que muestre que llegan personas de lugares distintos.'
      ], [
        'Hecho. La Capelinha es pequeña, pero ocupa el centro simbólico del conjunto.',
        'La importancia de un lugar no se mide solo en metros. Se construye también con lo que una comunidad recuerda y hace allí.'
      ]),
      [
        question('fatima-q1', 'Fátima', '¿Qué lugar es más pequeño pero central en el relato de las apariciones?', ['La Capelinha', 'Toda la explanada', 'El aparcamiento'], 0, 'Correcto: la Capelinha.', 'La escala física y la importancia simbólica pueden ser muy diferentes. Esa era la trampa de Topoloco.', 'Comparad el tamaño de la capilla con el espacio que la rodea.'),
        question('fatima-q2', 'Fátima', '¿Para qué sirve una explanada tan grande?', ['Para conectar y reunir a muchas personas', 'Para esconder la Capelinha', 'Para demostrar que una basílica es más verdadera'], 0, 'Sí. Organiza movimientos y encuentros de una comunidad numerosa.', 'Un espacio abierto también tiene función: permite ceremonias, recorridos y reuniones sin sustituir los lugares pequeños.', 'Mirad cómo circulan las personas y qué edificios conecta.')
      ]
    ),
    recovery('recuperacion-dia15', '¿Qué idea derrota mejor la frase «solo importa lo grande y terminado»?', ['Una ermita, una capilla inacabada y la Capelinha pueden conservar memoria', 'Todos los lugares importantes son enormes', 'Solo cuentan los edificios nuevos'], 0, 'Sombra retirada. Habéis encontrado el hilo común de las tres paradas.', 'Borrón conserva una mancha, pero ya sabemos reconocer su truco.'),
    route('ruta-dia16', 'Mañana seguiremos rastros de un animal desaparecido, entraremos donde el agua trabaja bajo tierra y dormiremos dentro de una ciudad amurallada. ¿Qué ruta es?', ['Pegadas de Dinossáurios, Mira de Aire y Óbidos', 'Coímbra, Aveiro y Oporto', 'Nazaré, Peniche y Cascais'], 0, [
      'Exacto: huellas de dinosaurios, Grutas de Mira de Aire y Óbidos.',
      'La conexión es clara: aprenderemos a reconstruir algo ausente por las marcas que dejó.',
      'Llevad calzado con buen agarre y una capa ligera para la cueva. En Óbidos caminaremos por calles irregulares. Ahora descansad.'
    ], { setFlags: ['completado_bucaco_batalha_fatima'], water: 'Agua de la Promesa' })
  ]
};

packs['008-huellas-mira-obidos'] = {
  shadowActor: 'Borrón',
  openingMessages: [
    'Buenos días. Hoy seguimos la ruta que descubristeis: huellas, cueva y ciudad amurallada.',
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
    ...withOrder(
      expedition('mira-expedicion', 'Grutas de Mira de Aire', 'Expedición del agua invisible', 'Gotas nos pide observar el trabajo del agua sin tocar las formaciones.', [
        'Localizad una estalactita que baje del techo y una estalagmita que suba del suelo.',
        'Buscad una columna o un punto donde ambas formas casi se unan.',
        'Observad un lago, curso o zona húmeda del recorrido.',
        'Comparad una formación fina con otra más ancha.'
      ], [
        'Hecho. El agua se filtra por la caliza, disuelve minerales y vuelve a depositarlos gota a gota.',
        'La cueva demuestra que una acción lenta puede construir formas enormes sin que veamos todo el proceso.'
      ]),
      [
        question('mira-q1', 'Grutas de Mira de Aire', '¿Cuál crece desde el techo?', ['La estalactita', 'La estalagmita', 'El lago'], 0, 'Correcto: la estalactita cuelga del techo.', 'La estalagmita crece desde el suelo por las gotas que caen. Si llegan a unirse, pueden formar una columna.', 'Recordad la forma que habéis visto colgar.'),
        question('mira-q2', 'Grutas de Mira de Aire', '¿Por qué no deben tocarse las formaciones?', ['Porque son decorados de papel', 'Porque crecen muy despacio y podemos alterarlas', 'Porque se mueven solas'], 1, 'Muy bien. El proceso es lento y delicado.', 'La grasa y la suciedad de las manos pueden afectar superficies que tardaron muchísimo en formarse.', 'Pensad cuánto tarda una gota en dejar una capa diminuta.')
      ],
      'question-first'
    ),
    ...withOrder(
      expedition('obidos-expedicion', 'Óbidos', 'Expedición de la ciudad escrita', 'En Óbidos, Borrón mezcla soportes reales con interpretaciones apresuradas.', [
        'Entrad por Porta da Vila y observad qué protege y qué anuncia.',
        'Recorred Rua Direita hasta localizar una iglesia, tienda o librería dentro de un edificio antiguo.',
        'Mirad la muralla y el castillo desde un lugar seguro; no caminéis por zonas que os parezcan peligrosas.',
        'Elegid un detalle medieval y otro que muestre un uso actual.'
      ], [
        'Expedición cerrada. Óbidos conserva muralla, puertas y trazado, pero también viviendas, comercio y cultura actuales.',
        'Una ciudad histórica no es una maqueta inmóvil. Sus usos nuevos escriben sin borrar por completo lo anterior.'
      ]),
      [
        question('obidos-q1', 'Óbidos', '¿Qué demuestra mejor que Óbidos sigue siendo una ciudad viva?', ['Que dentro de edificios antiguos hay usos actuales', 'Que nadie puede entrar', 'Que todas las calles están vacías'], 0, 'Exacto. El uso actual convive con la estructura heredada.', 'Vivir en un lugar histórico implica adaptar, cuidar y reinterpretar, no congelarlo.', 'Pensad en la tienda, iglesia o librería que habéis localizado.'),
        question('obidos-q2', 'Óbidos', '¿Cuál es una observación y no una interpretación?', ['La puerta tiene azulejos y un paso estrecho', 'La puerta parece enfadada', 'La muralla quiere esconder secretos'], 0, 'Correcto. Describe rasgos que otra persona puede comprobar.', 'Las interpretaciones pueden ser divertidas, pero deben distinguirse de la evidencia visible.', 'Elegid la frase que una fotografía también podría comprobar.')
      ]
    ),
    recovery('recuperacion-dia16', '¿Qué une huellas, cueva y ciudad?', ['Permiten reconstruir procesos mediante rastros visibles', 'Fueron creadas por dinosaurios', 'Están todas bajo tierra'], 0, 'Una Sombra menos. Borrón no puede borrar una relación que habéis comprobado tres veces.', 'La mancha sigue en el mapa, pero ya no puede cambiar el sentido de la ruta.'),
    route('ruta-dia17', 'La próxima señal muestra dinosaurios completos por fuera, fósiles y científicos por dentro, y al final una ciudad de plazas reconstruidas. ¿Qué ruta es?', ['Dino Parque Lourinhã y Lisboa', 'Zoomarine y Faro', 'Isla Mágica y Sevilla'], 0, [
      'Ruta correcta: Dino Parque Lourinhã y después Lisboa.',
      'Allí separaremos modelo, fósil e investigación. Topoloco quiere que una reconstrucción bonita sustituya a la evidencia.',
      'Preparad calzado cómodo, agua y protector solar para el recorrido exterior. Después viajaremos a Lisboa. Descansad.'
    ], { setFlags: ['completado_huellas_mira_obidos'], water: 'Agua del Tiempo Profundo' })
  ]
};

packs['009-dinoparque-lisboa'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Hoy iremos al Dino Parque y después a Lisboa, como descubristeis anoche.',
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
        question('dinoparque-q1', 'Dino Parque Lourinhã', '¿Cuál es evidencia material del pasado?', ['La pieza fósil', 'El color elegido para un modelo', 'La música del parque'], 0, 'Correcto: el fósil.', 'Puede estar incompleto, pero procede del organismo o de su actividad. El modelo combina evidencias con decisiones de reconstrucción.', 'Pensad cuál de los elementos no fue fabricado para la visita.'),
        question('dinoparque-q2', 'Dino Parque Lourinhã', 'Si dos modelos muestran colores distintos, ¿qué conclusión es más honesta?', ['Uno de los colores debe ser una mentira', 'El color puede ser una hipótesis si no hay evidencia suficiente', 'Los dinosaurios cambiaban de color cada hora'], 1, 'Exacto. Una reconstrucción debe mostrar dónde empieza la hipótesis.', 'La ciencia puede proponer alternativas y corregirlas. El museo de Topoloco quiere esconder esas dudas.', '¿Habéis encontrado una prueba directa del color en el fósil elegido?')
      ]
    ),
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
        question('lisboa-llegada-q1', 'Lisboa · Baixa y Rossio', '¿Qué ayuda más a orientarse en la Baixa?', ['La relación entre calles rectas y plazas', 'Cerrar los ojos', 'Seguir siempre la calle más empinada'], 0, 'Correcto. La estructura urbana crea conexiones legibles.', 'La Baixa fue reconstruida con una trama regular. Mañana compararemos esa organización con otros sistemas.', 'Mirad qué calles permiten ver o alcanzar otra plaza.'),
        question('lisboa-llegada-q2', 'Lisboa · Baixa y Rossio', '¿Qué revela un edificio antiguo con uso actual?', ['Que una ciudad puede cambiar sin borrar todas sus capas', 'Que el edificio nunca cambió', 'Que el pasado ya no importa'], 0, 'Sí. Uso nuevo y huella antigua pueden convivir.', 'Esta idea contradice el museo de una sola versión que prepara Topoloco.', 'Comparad lo que conserva el edificio con lo que se hace hoy dentro.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia17', '¿Qué error comete el museo de Topoloco?', ['Presentar una reconstrucción como si fuera la única verdad', 'Conservar fósiles con información', 'Explicar cuándo existe una duda'], 0, 'Interferencia retirada. Una historia honesta puede contener hipótesis y correcciones.', 'Topoloco conserva ventaja hoy, pero ya conocemos el nombre de su plan.'),
    route('ruta-dia18', 'Mañana entraremos primero en un laboratorio de experimentos y después en un gran océano central con Vasco. Terminaremos junto al Tajo. ¿Qué ruta es?', ['Pavilhão do Conhecimento, Oceanário y ribera del Tajo', 'Castelo, Belém y Sintra', 'Badoca, Lagos y Sagres'], 0, [
      'Correcto: Pavilhão do Conhecimento, Oceanário y Tajo.',
      'Buscaremos relaciones: cómo cambia un resultado, cómo dependen las especies y cómo Lisboa se conecta con el océano.',
      'Preparad calzado cómodo y una prenda ligera para interiores. No necesitáis escribir mucho. Descansad.'
    ], { setFlags: ['completado_dinoparque_lisboa'] })
  ]
};

packs['010-lisboa-ciencia-oceanario'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días. Hoy toca Pavilhão, Oceanário y Tajo.',
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
        question('oceanario-q1', 'Oceanário de Lisboa', '¿Por qué importa observar el tanque desde varios lados?', ['Porque cada ventana muestra relaciones y zonas distintas del mismo sistema', 'Porque los animales cambian de especie', 'Porque una ventana siempre miente'], 0, 'Correcto. Cambia la perspectiva, no el océano.', 'Las distintas vistas se complementan. Esto se parece a Paula y Hugo recordando el mismo viaje de maneras diferentes.', 'Comparad qué aparecía y desaparecía al cambiar de ventana.'),
        question('oceanario-q2', 'Oceanário de Lisboa', '¿Cuál cumple mejor el Protocolo Azul?', ['Observar sin molestar y aceptar que un animal puede no aparecer', 'Perseguirlo hasta conseguir una foto', 'Alimentarlo para que se acerque'], 0, 'Exacto. Observar no da derecho a intervenir.', 'Vasco nos pide distinguir «no lo vimos» de «no existe» y proteger sin convertir al animal en propiedad.', 'Pensad qué opción respeta la decisión y el espacio del animal.')
      ],
      'question-first'
    ),
    ...withOrder(
      expedition('tejo-expedicion', 'Ribera del Tajo', 'Expedición del río que llega al océano', 'Al salir, conectaremos el mundo interior del Oceanário con el paisaje real.', [
        'Mirad la anchura del Tajo desde la ribera.',
        'Buscad una embarcación o infraestructura relacionada con el agua.',
        'Localizad una señal de marea, viento o corriente.',
        'Comparad el agua real con el tanque central sin acercaros al borde.'
      ], [
        'Expedición terminada. El Tajo no acaba en Lisboa: se abre hacia el Atlántico.',
        'La sexta ventana confirma que las doce marcas del mapa son nodos de una red, no doce objetos aislados.'
      ]),
      [
        question('tejo-q1', 'Ribera del Tajo', '¿Qué conecta mejor el Tajo con el Oceanário?', ['Ambos permiten estudiar relaciones del agua con seres vivos y personas', 'Ambos tienen paredes de cristal', 'Ambos son piscinas'], 0, 'Sí. Uno es paisaje real y otro una representación cuidada, pero ambos muestran conexiones.', 'Las representaciones ayudan a observar; el río recuerda que el sistema continúa fuera del edificio.', 'Buscad una relación, no una semejanza de forma.'),
        question('tejo-q2', 'Ribera del Tajo', 'Si cambia la marea, ¿qué demuestra?', ['Que el borde entre río y océano es dinámico', 'Que Lisboa se mueve de sitio', 'Que el tanque controla el Tajo'], 0, 'Correcto. La relación cambia con el tiempo.', 'Una red viva no permanece idéntica. Topoloco quiere fijar una versión única y por eso siempre pierde información.', 'Fijaos en marcas, movimiento del agua o embarcaciones.')
      ]
    ),
    recovery('recuperacion-dia18', '¿Qué palabra une experimentos, especies y Tajo?', ['Relación', 'Colección', 'Inmovilidad'], 0, 'Sombra retirada. Las doce ventanas empiezan a comportarse como una red.', 'Niebla conserva terreno, pero ya no puede presentar los nodos como piezas separadas.'),
    route('ruta-dia19', 'Mañana leeremos Lisboa desde una fortaleza alta, bajaremos por barrios de trazado distinto y terminaremos entre monumentos junto al Tajo. ¿Qué ruta es?', ['Castelo, Alfama–Baixa y Belém', 'Oceanário, Sintra y Cascais', 'Dino Parque, Óbidos y Nazaré'], 0, [
      'Exacto: Castelo de São Jorge, Alfama y Baixa, y después Belém.',
      'Buscaremos capas de ocupación, reconstrucción y monumentos que cuentan viajes y poder.',
      'Llevad calzado cómodo para cuestas, agua y protector solar. Descansad; mañana Lisboa será nuestro documento.'
    ], { setFlags: ['completado_lisboa_ciencia_oceanario'], water: 'Agua del Océano Único' })
  ]
};

packs['011-lisboa-historia-belem'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Hoy recorreremos Castelo, Alfama–Baixa y Belém.',
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
        question('alfama-q1', 'Alfama y Baixa', '¿En qué trazado es más fácil ver de lejos el final de una calle?', ['En la cuadrícula recta de Baixa', 'En cualquier curva de Alfama', 'En una escalera cerrada'], 0, 'Correcto. La línea recta facilita orientación y perspectiva.', 'El trazado irregular puede adaptarse a pendientes y crear recorridos distintos. No hay una forma única de ciudad.', 'Recordad en cuál de los dos barrios veíais otra plaza al fondo.'),
        question('alfama-q2', 'Alfama y Baixa', '¿Qué prueba mejor que Lisboa se reconstruyó?', ['La diferencia entre trazados y edificios de distintas épocas', 'Que todas las calles son iguales', 'Que el terremoto no cambió nada'], 0, 'Sí. La diferencia visible conserva el cambio.', 'Reconstruir no borra necesariamente lo anterior: puede dejar contrastes que ayudan a entender la catástrofe y la respuesta.', 'Comparad, no busquéis una sola calle aislada.')
      ],
      'question-first'
    ),
    ...withOrder(
      expedition('belem-expedicion', 'Belém', 'Expedición de piedra, río y viajes', 'Recorred la ribera sin necesidad de entrar en todos los edificios.', [
        'Observad el Mosteiro dos Jerónimos y elegid un detalle de piedra trabajado.',
        'Localizad el Padrão dos Descobrimentos y mirad hacia dónde se orienta.',
        'Llegad a un punto seguro desde el que se vea la Torre de Belém y el Tajo.',
        'Buscad una diferencia entre monumento conmemorativo y construcción defensiva.'
      ], [
        'Expedición cerrada. Jerónimos, Padrão y Torre cuentan relaciones distintas con los viajes, el poder y el río.',
        'Topoloco intenta guardarlos como una sola versión heroica; vuestra comparación mantiene funciones y épocas diferentes.'
      ]),
      [
        question('belem-q1', 'Belém', '¿Cuál tuvo una función defensiva ligada a la entrada del Tajo?', ['La Torre de Belém', 'El Padrão dos Descobrimentos', 'Un pastel'], 0, 'Correcto: la Torre de Belém.', 'Su posición junto al agua formaba parte de un sistema defensivo. Hoy su función y su entorno han cambiado.', 'Mirad cuál está situado como control del paso por el río.'),
        question('belem-q2', 'Belém', '¿Qué diferencia mejor un monumento conmemorativo de una defensa?', ['El primero representa un relato; la segunda controla o protege un paso', 'Los dos hacen exactamente lo mismo', 'Una defensa no necesita posición'], 0, 'Exacto. Forma, función y relato no son lo mismo.', 'El Padrão fue concebido para conmemorar; la Torre tuvo usos defensivos. Compararlos evita una historia plana.', 'Pensad qué acción podía realizar cada construcción.')
      ]
    ),
    recovery('recuperacion-dia19', '¿Qué hizo Lisboa para seguir existiendo?', ['Cambió, reconstruyó y conservó capas distintas', 'Permaneció idéntica', 'Borró todos sus barrios antiguos'], 0, 'Sombra retirada. Topoloco ya no puede confundir permanencia con inmovilidad.', 'La versión única gana terreno, pero aún conserváis las diferencias.'),
    route('ruta-dia20', 'Mañana observaremos animales africanos sin inventar lo que sienten y después seguiremos hasta una ciudad unida a su marina. ¿Qué ruta es?', ['Badoca Safari Park y Lagos', 'Oceanário y Cascais', 'Zoomarine y Tavira'], 0, [
      'Ruta correcta: Badoca y después Lagos.',
      'Niebla quiere convertir cualquier movimiento animal en un cuento falso. Nosotros separaremos conducta visible e interpretación.',
      'Preparad agua, protector solar, prismáticos si tenéis y ropa cómoda. En Lagos terminaremos junto a la marina. Descansad.'
    ], { setFlags: ['completado_lisboa_historia_belem'], water: 'Agua de la Ciudad que Regresa' })
  ]
};

packs['012-badoca-lagos'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días. Ayer descubristeis Badoca y Lagos.',
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
        question('lagos-q1', 'Lagos y su marina', '¿Qué indica mejor que la marina conecta ciudad y mar?', ['Las rutas y embarcaciones que salen de ella', 'El color de una sombrilla', 'Que todas las calles sean rectas'], 0, 'Correcto. La función se reconoce por movimientos y conexiones.', 'Mañana esa salida nos permitirá investigar delfines y costa, pero sin prometer resultados.', 'Mirad qué elementos empiezan aquí y continúan fuera del puerto.'),
        question('lagos-q2', 'Lagos y su marina', '¿Para qué servía una defensa costera?', ['Vigilar y controlar accesos', 'Garantizar que aparezcan delfines', 'Decorar una piscina'], 0, 'Exacto. Su posición tiene relación con el territorio que controla.', 'La ciudad y el mar han mantenido relaciones comerciales, defensivas y de viaje diferentes.', 'Pensad qué podía observar o impedir desde su posición.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia20', '¿Qué frase vencería a Niebla?', ['Primero describimos lo observado; después proponemos explicaciones', 'Toda acción revela una emoción', 'Una historia bonita siempre es verdad'], 0, 'Sombra retirada. Niebla ha perdido una página entera de conclusiones inventadas.', 'Niebla conserva ventaja, pero ya no puede hacer pasar sus cuentos por observación.'),
    route('ruta-dia21', 'Mañana saldremos en barco buscando delfines y Benagil sin prometer ninguno; después iremos a una fortaleza y al gran cabo del atardecer. ¿Qué ruta es?', ['Marina de Lagos, Benagil y Sagres', 'Badoca, Tavira y Sevilla', 'Óbidos, Nazaré y Sintra'], 0, [
      'Exacto: barco desde Lagos, costa de Benagil y después Sagres y Cabo de São Vicente.',
      'Aplicaremos el Protocolo Azul: observar sin perseguir y aceptar la incertidumbre.',
      'Preparad protección solar, agua, algo de abrigo para el barco y calzado seguro. Si el mar cambia el plan, la historia se adapta. Descansad.'
    ], { setFlags: ['completado_badoca_lagos'] })
  ]
};

packs['013-delfines-benagil-sagres'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Buenos días. Hoy barco, Benagil y Sagres.',
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
        question('sagres-q1', 'Sagres y Cabo de São Vicente', '¿Qué ayuda a la navegación desde un promontorio?', ['Una vista amplia de costa, mar y horizonte', 'No mirar el tiempo', 'Suponer que el viento nunca cambia'], 0, 'Correcto. La posición ofrece información.', 'También exige interpretar viento, luz y costa. Una vista grande no sustituye al razonamiento.', 'Recordad qué podíais ver desde arriba que no se ve al nivel del agua.'),
        question('sagres-q2', 'Sagres y Cabo de São Vicente', 'Si hay varias explicaciones para una estructura, ¿qué hacemos?', ['Comparamos evidencias y mantenemos abierta la duda', 'Elegimos la más emocionante', 'Decimos que todas están demostradas'], 0, 'Muy bien. Una hipótesis no se convierte en hecho por sonar bien.', 'Topoloco acaba de admitir que está aprendiendo de vuestro método. Eso lo vuelve más peligroso y también más previsible.', 'Buscad la opción que permite corregir si aparece nueva evidencia.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia21', '¿Qué protege mejor una investigación incierta?', ['Decir exactamente qué vimos y qué no sabemos', 'Prometer el resultado antes de salir', 'Ocultar cualquier ausencia'], 0, 'Sombra retirada. Topoloco no puede usar vuestra incertidumbre como debilidad.', 'Topoloco conserva datos de hoy, pero no ha conseguido una versión falsa completa.'),
    route('ruta-dia22', 'Mañana recorreremos acantilados con arcos y pilares, compararemos otra costa agujereada y dormiremos en una tienda especial donde una voz podría no ser quien dice. ¿Qué ruta es?', ['Ponta da Piedade, Algar Seco y HolaJaima', 'Tavira, Sevilla y Granada', 'Belém, Cascais y Sintra'], 0, [
      'Ruta encontrada: Ponta da Piedade, Algar Seco y la jaima de Albufeira.',
      'Las rocas nos enseñarán huecos y soportes. Por la noche necesitaremos reconocer a una persona por su conducta, no solo por su voz.',
      'Preparad calzado con buen agarre, protector solar y lo necesario para dormir en la jaima. Nada de bordes ni atajos. Descansad.'
    ], { setFlags: ['completado_delfines_benagil_sagres'], water: 'Agua del Horizonte' })
  ]
};

packs['014-piedade-algar-jaima'] = {
  shadowActor: 'Eco',
  openingMessages: [
    'Buenos días. Hoy Ponta da Piedade, Algar Seco y la jaima.',
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
        question('algar-q1', 'Algar Seco', '¿Qué necesita una ventana natural para seguir abierta?', ['Roca que actúe como soporte alrededor', 'Que desaparezca toda la roca', 'Una cortina'], 0, 'Correcto. El hueco depende de lo que permanece.', 'La erosión retira material, pero la forma visible también está definida por sus soportes.', 'Mirad qué partes sostienen la abertura.'),
        question('algar-q2', 'Algar Seco', '¿Dónde suele actuar con más fuerza el mar?', ['En zonas más expuestas a oleaje y fracturas', 'Siempre igual en cualquier punto', 'Solo donde hay edificios'], 0, 'Sí. La exposición y las debilidades de la roca importan.', 'Por eso comparar dos zonas próximas ayuda a explicar diferencias sin inventar una regla universal.', 'Comparad la cara abierta al mar con una cavidad protegida.')
      ],
      'question-first'
    ),
    ...withOrder(
      expedition('jaima-expedicion', 'HolaJaima · Albufeira', 'Expedición de la voz verdadera', 'Al llegar, Eco intentará imitar a Topotino. El Cuaderno continúa privado.', [
        'Reconoced dos detalles reales de vuestra tienda o su entorno.',
        'Escuchad durante un minuto y separad un sonido cercano de uno lejano.',
        'Recordad una regla que el verdadero Topotino mantiene siempre sobre el Cuaderno.',
        'Si una voz pide una foto, marca o página, no enviéis nada.'
      ], [
        'Bien hecho. La tienda ha funcionado como lugar de escucha y como prueba de coherencia.',
        'Una voz puede copiarse. Una conducta mantenida durante días es mucho más difícil de falsificar.'
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
    route('ruta-dia24', 'La siguiente ventana muestra un puente de siete arcos llamado «romano», aunque la evidencia lo sitúa en otra época. Después cruzaremos una frontera hasta una plaza con canal y puentes. ¿Qué ruta es?', ['Tavira y Sevilla', 'Lagos y Sagres', 'Lisboa y Belém'], 0, [
      'Correcto: Tavira y después Sevilla.',
      'En Tavira corregiremos una memoria popular; en Plaza de España compararemos puentes que cruzan, representan y organizan un espacio.',
      'Preparad documentación para el viaje, calzado cómodo, agua y protector solar. Descansad: mañana cruzamos una frontera y una idea equivocada.'
    ], { setFlags: ['completado_zoomarine'], water: 'Agua del Cuidado' })
  ]
};

packs['016-tavira-sevilla'] = {
  shadowActor: 'Borrón',
  openingMessages: [
    'Buenos días. Hoy Tavira y Sevilla.',
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
        question('sevilla-plaza-q1', 'Plaza de España · Sevilla', '¿Qué función añade la plaza a sus puentes?', ['Organizar una escena que representa unión y territorio', 'Defender la entrada del Atlántico', 'Conservar huellas de dinosaurio'], 0, 'Correcto. Aquí cruzar y representar trabajan juntos.', 'El canal y los puentes forman parte de un diseño simbólico, distinto del cruce urbano de Tavira.', 'Pensad en todo lo que rodea al puente, no solo en el paso.'),
        question('sevilla-plaza-q2', 'Plaza de España · Sevilla', '¿Qué comparación es más útil?', ['Misma forma general, pero contexto y función diferentes', 'Son idénticos porque ambos cruzan agua', 'No se pueden comparar dos lugares'], 0, 'Muy bien. Comparar no significa declarar iguales.', 'Topotina ha detectado aquí la segunda firma de parque que apareció en Magikland: está en Isla Mágica.', 'Buscad una semejanza y una diferencia que puedan existir a la vez.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia24', '¿Qué hace una memoria honesta cuando aparece mejor evidencia?', ['Se corrige sin fingir que nunca se equivocó', 'Se aferra al nombre más popular', 'Borra el lugar completo'], 0, 'Sombra retirada. Borrón ha perdido su etiqueta falsa.', 'La palabra de Borrón sigue visible, pero ahora funciona como ejemplo de una corrección.'),
    route('ruta-dia25', 'Topotina ha localizado la estación gemela de Magikland: una isla de exploradores, barcos, piratas y viajes, con Capitán Pico, América y Krim. ¿Adónde vamos?', ['Isla Mágica y Agua Mágica', 'Dino Parque', 'Oceanário'], 0, [
      'Exacto: Isla Mágica y Agua Mágica.',
      'Capitán Pico y América tienen dos partes de una señal. Krim nos ayudará cuando Niebla intente usar emoción y prisa contra vosotros.',
      'Preparad bañador, toalla, protector solar, agua y calzado cómodo. Mañana habrá una contratrampa. Descansad.'
    ], { setFlags: ['completado_tavira_sevilla'], water: 'Agua de las Dos Orillas' })
  ]
};

packs['017-isla-magica'] = {
  shadowActor: 'Niebla',
  openingMessages: [
    'Buenos días. Hoy entramos en Isla Mágica y Agua Mágica.',
    'Es la estación gemela de Magikland. Capitán Pico y América os esperan como exploradores; Krim vigilará que Niebla no convierta una emoción en una orden.'
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
        question('isla-q1', 'Isla Mágica y Agua Mágica', '¿Qué diferencia un escenario histórico de una fuente original?', ['El escenario representa una época con elementos actuales', 'El escenario estuvo necesariamente allí en el siglo XVI', 'No puede enseñar nada'], 0, 'Correcto. Representar no es falsificar si se explica con claridad.', 'Un decorado puede ayudar a imaginar y aprender; una fuente original aporta otro tipo de evidencia.', 'Mirad qué elementos funcionan para visitantes actuales.'),
        question('isla-q2', 'Isla Mágica y Agua Mágica', 'Niebla ofrece dos rutas. ¿Cuál es más segura intelectualmente?', ['La más urgente y llamativa, sin comprobar nada', 'La que permite comprobar una afirmación y corregir si falla', 'La que prohíbe cambiar de opinión'], 1, 'Exacto. Comprobar y conservar una salida derrota la urgencia.', 'Krim ha detectado la emoción sin dejar que mande. Capitán Pico hace que Niebla siga la ruta llamativa y América recupera la señal.', 'Elegid la ruta que permite volver atrás si la evidencia no encaja.')
      ],
      'question-first'
    ),
    recovery('recuperacion-dia25', '¿Qué hace un buen explorador cuando siente mucha prisa?', ['Nombra la emoción, comprueba y mantiene una salida', 'Obedece la primera señal', 'Finge que no siente nada'], 0, 'Sombra retirada. Krim dice que Niebla ha salido color verde mareado.', 'Niebla mantiene una ventaja, pero la contratrampa ha recuperado la señal principal.'),
    route('ruta-dia26', 'La señal dice: «ciudad roja, doce guardianes de piedra, cuando el agua refleje la noche». Antes veremos dos edificios de Sevilla con muchas capas. ¿Cuál es la ruta final?', ['Real Alcázar, Catedral de Sevilla y Alhambra nocturna', 'Tavira, Badoca y Lisboa', 'Óbidos, Batalha y Fátima'], 0, [
      'Ruta final descubierta: Real Alcázar, Catedral y Alhambra de Granada por la noche.',
      'Los doce guardianes son los leones. Aún no sabemos cómo abren el cierre, pero el reflejo nocturno será esencial.',
      'Tened entradas, agua, calzado cómodo y una capa ligera para la noche. Guardad energía. Mañana llegamos al final.'
    ], { setFlags: ['completado_isla_magica'] })
  ]
};

packs['018-sevilla-alhambra-noche'] = {
  shadowActor: 'Topoloco',
  openingMessages: [
    'Último día. Ayer descubristeis Alcázar, Catedral y Alhambra nocturna.',
    'Topoloco intenta encerrar una sola versión. Hoy reuniremos capas, cambios, reflejos y varias manos para abrir las doce ventanas.'
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
        'Superponer puede modificar, reutilizar y conservar. Necesitaremos esa idea esta noche.'
      ]),
      [
        question('alcazar-q1', 'Real Alcázar de Sevilla', '¿Qué demuestra mejor que existen varias capas?', ['Cambios de estilo y uso que siguen visibles', 'Que todo parece exactamente igual', 'Que un jardín no tiene historia'], 0, 'Correcto. La diferencia visible conserva el paso del tiempo.', 'Un conjunto vivo puede integrar nuevas funciones sin eliminar todas las anteriores.', 'Comparad dos espacios, no busquéis una fecha aislada.'),
        question('alcazar-q2', 'Real Alcázar de Sevilla', '¿Qué puede hacer el agua además de decorar?', ['Organizar recorrido, refrescar y reflejar', 'Borrar automáticamente el edificio', 'Detener el tiempo'], 0, 'Exacto. El agua tiene varias funciones a la vez.', 'Esta noche un reflejo mostrará cómo Topoloco copió recuerdos, pero el reflejo dependerá siempre del original.', 'Pensad en movimiento, temperatura y visión.')
      ]
    ),
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
        question('catedral-q1', 'Catedral de Sevilla', '¿Qué ejemplo muestra mejor un cambio de función?', ['El alminar convertido en campanario', 'Una sombra que cambia de lugar', 'Una entrada que sigue siendo entrada'], 0, 'Correcto. La estructura permanece reconocible y su uso cambia.', 'Añadir el campanario y el Giraldillo no convierte toda la torre en una obra de una sola época.', 'Pensad qué hacía la torre antes y qué hace ahora.'),
        question('catedral-q2', 'Catedral de Sevilla', '¿Qué relato puede aportar una tumba o retablo?', ['Viajes, poder, creencias y decisiones de una época', 'La fecha exacta de cada piedra del edificio', 'Una única verdad sobre toda Sevilla'], 0, 'Muy bien. Una pieza aporta una capa, no el edificio entero.', 'Topoloco selecciona una pieza y finge que posee toda la historia. Esta comparación nos prepara para desenmascararlo.', 'Elegid la opción que reconoce el valor sin convertir una parte en el todo.')
      ],
      'question-first'
    ),
    ...withOrder(
      expedition('alhambra-expedicion', 'Alhambra nocturna', 'Expedición de las cuatro cerraduras', 'Entrad con los adultos y seguid el recorrido real. El Cuaderno permanece privado.', [
        'En Mexuar, localizad una señal de cambio de uso o superposición.',
        'En Arrayanes, comparad un detalle arquitectónico con su reflejo y observad qué ocurre si el agua se mueve.',
        'En Comares, recordad dos momentos distintos del viaje que ahora se relacionen.',
        'En Leones, contad doce y comparad al menos tres cabezas, perfiles o tallas.'
      ], [
        'Las cuatro observaciones están reunidas. Topotina mantiene abierta la red.',
        'Topoloco exige una única versión y un único dueño. Vamos a responder cerradura por cerradura.'
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
