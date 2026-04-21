const MISSIONS = [
  {
    "id": "buckingham",
    "order": 1,
    "letra": "L",
    "nombreClave": "La Fortaleza de la Corona",
    "pista": "Buscad un lugar donde las verjas parecen decir ‘aquí pasa algo importante’, donde los guardias casi no pestañean y donde mucha gente mira la fachada esperando que ocurra algo especial.",
    "nombreReal": "Buckingham Palace",
    "lat": 51.501364,
    "lng": -0.14189,
    "radioMetros": 280,
    "imagen": "images/buckingham.jpg",
    "emoji": "🏰",
    "pieza": "La Corona de Guardia",
    "insignia": "Agentes de Palacio",
    "mensajeRecompensa": "Parte completado en Buckingham Palace. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué detalle hace que este edificio no parezca una casa cualquiera?",
        "opciones": [
          "La gran verja y la fachada simétrica",
          "Las ruedas en el tejado",
          "Los puentes de madera",
          "Las cuevas laterales"
        ],
        "correcta": 0
      },
      {
        "texto": "Busca a los guardias y fíjate muy bien. ¿Qué es lo más llamativo de su uniforme?",
        "opciones": [
          "Un sombrero negro muy alto",
          "Unas alas doradas",
          "Un casco de astronauta",
          "Un pañuelo verde"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Por qué este era un sitio perfecto para esconder una letra del misterio?",
        "opciones": [
          "Porque representa realeza, ceremonia e importancia",
          "Porque es un parque lleno de aves",
          "Porque es un mercado cubierto",
          "Porque está hecho para barcos"
        ],
        "correcta": 0
      }
    ],
    "historia": "Antes de ser el gran palacio que hoy conoce todo el mundo, este lugar fue una gran casa llamada Buckingham House. Con los años se fue ampliando hasta convertirse en la residencia oficial del monarca en Londres. Aquí hay salones enormes, recepciones importantes y balcones desde los que a veces la historia saluda.\n\nCasi todo el mundo recuerda la fachada y los guardias, pero el verdadero secreto de Buckingham Palace es que mezcla vida diaria y ceremonia. Es casa, oficina, escenario y símbolo al mismo tiempo.",
    "encajeEnMisterio": "Aquí Topotino entendió la primera regla del código: Topoloco no había escogido lugares cualquiera, sino lugares que “mandan”. Buckingham representa el poder visible, la solemnidad y la idea de que algunas fachadas cuentan más de lo que parecen."
  },
  {
    "id": "stjames",
    "order": 2,
    "letra": "O",
    "nombreClave": "El Lago de los Mensajeros",
    "pista": "Ahora buscad un lugar donde el agua brilla, los pájaros parecen saber secretos y, aunque sigáis en una gran ciudad, por un momento todo parece respirar más despacio.",
    "nombreReal": "St James’s Park",
    "lat": 51.5028,
    "lng": -0.1342,
    "radioMetros": 320,
    "imagen": "images/stjames.jpg",
    "emoji": "🦢",
    "pieza": "La Pluma del Lago",
    "insignia": "Exploradores del Parque Real",
    "mensajeRecompensa": "Parte completado en St James’s Park. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué hace especial este lugar comparado con muchas calles del centro?",
        "opciones": [
          "Tiene lago, árboles y aves",
          "Tiene pantallas gigantes",
          "Tiene una torre con reloj",
          "Tiene un techo cubierto"
        ],
        "correcta": 0
      },
      {
        "texto": "Busca aves cerca del agua. ¿Qué encaja mejor con este parque?",
        "opciones": [
          "Patos, cisnes o pelícanos",
          "Lobos y zorros árticos",
          "Caballos salvajes",
          "Tiburones pequeños"
        ],
        "correcta": 0
      },
      {
        "texto": "Mirad 10 segundos alrededor y luego apartad la vista. ¿Qué sensación manda aquí?",
        "opciones": [
          "Pausa y naturaleza",
          "Ruido y semáforos",
          "Fábrica y humo",
          "Estadio y competición"
        ],
        "correcta": 0
      }
    ],
    "historia": "St James’s Park es el parque real más antiguo de Londres. Hoy parece elegante y tranquilo, pero hace siglos esta zona era mucho más salvaje. Con el tiempo se transformó en este parque lleno de senderos, agua y vistas preciosas hacia edificios muy importantes.\n\nY aquí viene una curiosidad de espía experto: los pelícanos llevan en este parque desde 1664. Eso significa que cuando veáis aves sobre el agua, estaréis en un lugar donde la naturaleza y la historia llevan siglos conviviendo.",
    "encajeEnMisterio": "Después del poder, Topotino descubrió la segunda pista: Londres también se entiende por sus pausas. St James’s Park representa lo contrario del ruido: el momento en que la ciudad baja la voz y deja que te fijes mejor."
  },
  {
    "id": "marblearch",
    "order": 3,
    "letra": "N",
    "nombreClave": "El Arco Blanco",
    "pista": "Buscad una puerta que ya no cierra nada y, aun así, sigue pareciendo importante. Es como una entrada enorme construida para recordar que la ciudad sabe impresionar.",
    "nombreReal": "Marble Arch",
    "lat": 51.5131,
    "lng": -0.1589,
    "radioMetros": 250,
    "imagen": "images/marblearch.jpg",
    "emoji": "🏛️",
    "pieza": "El Arco Blanco",
    "insignia": "Guardianes de Entrada",
    "mensajeRecompensa": "Parte completado en Marble Arch. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué forma manda claramente en este monumento?",
        "opciones": [
          "Un arco",
          "Una rueda",
          "Un reloj",
          "Un puente"
        ],
        "correcta": 0
      },
      {
        "texto": "Acercaos y mirad hacia arriba. ¿Qué sensación encaja mejor con Marble Arch?",
        "opciones": [
          "Elegancia y piedra clara",
          "Velocidad y ruido",
          "Selva y barro",
          "Agua y olas"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué fue Marble Arch al principio?",
        "opciones": [
          "Una entrada ceremonial pensada para el palacio",
          "La puerta de un zoo",
          "Un faro para barcos",
          "Un escenario para conciertos"
        ],
        "correcta": 0
      }
    ],
    "historia": "Marble Arch fue diseñado por John Nash y hecho con mármol de Carrara. Al principio no estaba aquí: se pensó como una gran entrada ceremonial para Buckingham Palace y luego fue trasladado a su lugar actual.\n\nLo mejor de este monumento es su rareza: parece una puerta, pero no lleva a un castillo ni a una muralla. Es una entrada simbólica, una forma de decir que algunas ciudades también construyen “umbrales” para entrar en su historia.",
    "encajeEnMisterio": "Aquí Topotino entendió la tercera clave: Topoloco había elegido también lugares que funcionan como entradas, pasos o comienzos. Marble Arch es Londres diciendo: “si quieres entenderme, primero tienes que entrar bien”."
  },
  {
    "id": "piccadilly",
    "order": 4,
    "letra": "D",
    "nombreClave": "La Plaza de las Luces Robadas",
    "pista": "Si veis anuncios, luces, coches, pasos rápidos y una ciudad que parece no dormirse nunca, vais bien. Aquí hasta el aire parece ir deprisa.",
    "nombreReal": "Piccadilly Circus",
    "lat": 51.5101,
    "lng": -0.134,
    "radioMetros": 240,
    "imagen": "images/piccadilly.jpg",
    "emoji": "🎡",
    "pieza": "La Chispa de las Luces",
    "insignia": "Agentes de Ciudad Despierta",
    "mensajeRecompensa": "Parte completado en Piccadilly Circus. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué es lo primero que suele llamar la atención en este lugar?",
        "opciones": [
          "Las pantallas luminosas y el movimiento",
          "Los dinosaurios",
          "El lago y los cisnes",
          "Las torres del puente"
        ],
        "correcta": 0
      },
      {
        "texto": "Quedaos quietos durante 15 segundos y contad mentalmente cuántas cosas distintas se mueven. Después elegid:",
        "opciones": [
          "Casi nada",
          "Muy pocas",
          "Muchísimas a la vez",
          "Solo el viento"
        ],
        "correcta": 2
      },
      {
        "texto": "¿Por qué Piccadilly Circus encajaba en el código secreto?",
        "opciones": [
          "Porque representa el movimiento y la vida de la ciudad",
          "Porque aquí se coronan reyes",
          "Porque aquí viven fósiles",
          "Porque aquí duermen los pelícanos"
        ],
        "correcta": 0
      }
    ],
    "historia": "Piccadilly Circus es uno de los cruces más famosos de Londres. Varias calles muy importantes llegan aquí y por eso se ha convertido en un lugar de encuentro, de movimiento y de vida. Mucha gente lo reconoce por sus pantallas curvas y por la estatua alada que casi todos llaman Eros.\n\nNo es solo una plaza: es una especie de nudo de energía. Es como si todo Londres pasara por aquí durante un segundo y siguiera luego su camino.",
    "encajeEnMisterio": "Aquí Topotino descubrió que el código no hablaba solo de monumentos serios. También necesitaba movimiento. Piccadilly representa la parte de Londres que corre, se cruza, se ilumina y nunca está del todo quieta."
  },
  {
    "id": "trafalgar",
    "order": 5,
    "letra": "R",
    "nombreClave": "La Plaza de los Leones",
    "pista": "Cuatro guardianes de piedra vigilan este lugar, y una gran columna sube hacia el cielo como si señalara algo importante que ocurrió hace mucho.",
    "nombreReal": "Trafalgar Square",
    "lat": 51.508,
    "lng": -0.1281,
    "radioMetros": 230,
    "imagen": "images/trafalgar.jpg",
    "emoji": "🦁",
    "pieza": "El Rugido del León",
    "insignia": "Guardianes de la Plaza",
    "mensajeRecompensa": "Parte completado en Trafalgar Square. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "Busca a los guardianes de piedra. ¿Qué animales son?",
        "opciones": [
          "Leones",
          "Caballos",
          "Pingüinos",
          "Delfines"
        ],
        "correcta": 0
      },
      {
        "texto": "Mira hacia arriba. ¿Qué se levanta sobre la plaza y la hace reconocible desde lejos?",
        "opciones": [
          "Una gran columna",
          "Una noria",
          "Un castillo",
          "Un faro"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué idea representa mejor este lugar dentro del misterio?",
        "opciones": [
          "Recuerdo, historia y vida pública",
          "Playa y vacaciones",
          "Bosque y aventura",
          "Ciencia y fósiles"
        ],
        "correcta": 0
      }
    ],
    "historia": "Trafalgar Square recuerda una batalla naval muy famosa para la historia británica. En el centro se levanta la columna de Nelson y abajo descansan sus grandes leones de piedra, que parecen vigilar la plaza desde siempre.\n\nPero esta plaza no solo guarda pasado. También es un lugar de celebraciones, reuniones y momentos compartidos. Incluso cada Navidad recibe un gran árbol que Oslo regala a Londres.",
    "encajeEnMisterio": "Aquí Topotino entendió otra parte del mensaje: para descifrar Londres también hay que contar con la memoria. Trafalgar Square representa lo que una ciudad decide recordar y enseñar a los que vienen después."
  },
  {
    "id": "bigben",
    "order": 6,
    "letra": "E",
    "nombreClave": "El Guardián del Tiempo",
    "pista": "Buscad una torre famosa en todo el mundo. Mucha gente cree saber su nombre, pero aquí hay un truco escondido.",
    "nombreReal": "Big Ben / Elizabeth Tower",
    "lat": 51.5007,
    "lng": -0.1246,
    "radioMetros": 220,
    "imagen": "images/bigben.jpg",
    "emoji": "🕰️",
    "pieza": "La Aguja del Tiempo",
    "insignia": "Guardianes del Reloj",
    "mensajeRecompensa": "Parte completado en Big Ben / Elizabeth Tower. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué detalle hace que este monumento se reconozca al instante?",
        "opciones": [
          "El gran reloj",
          "El lago",
          "El techo del mercado",
          "Las estatuas de leones"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué es realmente Big Ben?",
        "opciones": [
          "La gran campana",
          "Toda la torre entera",
          "El río",
          "La abadía"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Por qué este lugar era una pieza necesaria del misterio?",
        "opciones": [
          "Porque representa el tiempo y las campanadas de Londres",
          "Porque representa la naturaleza del parque",
          "Porque representa la magia del mercado",
          "Porque representa la entrada al palacio"
        ],
        "correcta": 0
      }
    ],
    "historia": "Aquí va una curiosidad toposecreta: mucha gente llama Big Ben a toda la torre, pero en realidad Big Ben es el nombre de la gran campana. La torre se llama Elizabeth Tower. Es decir: el nombre más famoso de Londres está un poco mal usado por medio planeta.\n\nLa torre forma parte del conjunto del Parlamento y su reloj es tan conocido que parece estar vigilando la ciudad entera. Hablar de Londres y hablar de esta torre casi siempre acaba siendo lo mismo.",
    "encajeEnMisterio": "Aquí Topotino vio clara otra pieza: ninguna frase sobre Londres estaría completa sin el tiempo. Big Ben no representa solo un reloj; representa que esta ciudad también se mide, se ordena y se recuerda por sus campanadas."
  },
  {
    "id": "westminster",
    "order": 7,
    "letra": "S",
    "nombreClave": "El Sello del Reino",
    "pista": "Aquí la ciudad habla con voz seria. Si sentís que estáis en un lugar donde se mezclan poder, historia, ceremonias y edificios importantes, habéis llegado.",
    "nombreReal": "Westminster",
    "lat": 51.4993,
    "lng": -0.1273,
    "radioMetros": 260,
    "imagen": "images/westminster.jpg",
    "emoji": "🏛️",
    "pieza": "El Sello del Reino",
    "insignia": "Agentes de Westminster",
    "mensajeRecompensa": "Parte completado en Westminster. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "Mirando alrededor, ¿qué sensación manda en esta zona?",
        "opciones": [
          "Historia, decisiones y solemnidad",
          "Playa y vacaciones",
          "Selva y aventura",
          "Feria y atracciones"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué edificio de esta zona está unido a las coronaciones desde 1066?",
        "opciones": [
          "Westminster Abbey",
          "Tower Bridge",
          "London Eye",
          "Marble Arch"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Por qué Westminster es clave dentro del mapa secreto?",
        "opciones": [
          "Porque reúne poder político, ceremonias e historia",
          "Porque es el lugar más silencioso de Londres",
          "Porque aquí se exhiben dinosaurios",
          "Porque aquí nacieron los puentes"
        ],
        "correcta": 0
      }
    ],
    "historia": "Westminster no es solo un edificio: es una zona cargada de historia. Aquí están el Palacio de Westminster, donde se reúne el Parlamento, y la abadía donde se han coronado los soberanos desde 1066.\n\nToda esta zona demuestra que una ciudad no solo se compone de calles y tiendas. También se compone de decisiones, normas, juramentos y lugares donde pasan cosas que afectan a muchísima gente.",
    "encajeEnMisterio": "Después del tiempo, Topotino descubrió otra clave: Londres también se explica por sus decisiones. Westminster es el sitio donde la ciudad se vuelve seria y donde la historia y el presente se dan la mano."
  },
  {
    "id": "londoneye",
    "order": 8,
    "letra": "B",
    "nombreClave": "El Ojo de la Ciudad",
    "pista": "Si queréis mirar Londres como lo haría un pájaro muy aplicado o un topo con un plan excelente, buscad una rueda enorme junto al río.",
    "nombreReal": "London Eye",
    "lat": 51.5033,
    "lng": -0.1195,
    "radioMetros": 240,
    "imagen": "images/londoneye.jpg",
    "emoji": "🎡",
    "pieza": "El Ojo de la Ciudad",
    "insignia": "Vigías del Támesis",
    "mensajeRecompensa": "Parte completado en London Eye. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué forma manda cuando miras este lugar de lejos?",
        "opciones": [
          "Una rueda enorme",
          "Un arco de piedra",
          "Una torre cuadrada",
          "Una cueva"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué representa el número de cápsulas del London Eye?",
        "opciones": [
          "Los boroughs de Londres",
          "Los reyes de Inglaterra",
          "Los grandes museos",
          "Los puentes del Támesis"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué aporta este lugar al misterio que otros no pueden aportar igual?",
        "opciones": [
          "Una mirada desde arriba sobre la ciudad",
          "El recuerdo de una batalla",
          "La vida de los pelícanos",
          "La entrada a un palacio"
        ],
        "correcta": 0
      }
    ],
    "historia": "El London Eye se inauguró en el año 2000 y cambió el perfil de Londres para siempre. Con 135 metros de altura, fue durante un tiempo la rueda de observación más alta del mundo.\n\nTiene 32 cápsulas, una por cada borough de Londres. Eso hace que esta rueda no sea solo una atracción: parece una gran mirada circular que recoge la ciudad por partes y luego la devuelve entera.",
    "encajeEnMisterio": "Aquí Topotino resolvió una duda importante: para entender Londres no basta con caminarla. También hay que mirarla desde arriba. El London Eye representa perspectiva, distancia y esa capacidad de juntar las piezas en una sola imagen."
  },
  {
    "id": "nhm",
    "order": 9,
    "letra": "R",
    "nombreClave": "La Sala de los Gigantes",
    "pista": "Hay un edificio que parece casi una catedral de la naturaleza. Dentro viven huesos, fósiles, criaturas inmensas y preguntas que no se acaban nunca.",
    "nombreReal": "Natural History Museum",
    "lat": 51.4967,
    "lng": -0.1764,
    "radioMetros": 260,
    "imagen": "images/nhm.jpg",
    "emoji": "🦕",
    "pieza": "El Hueso de la Memoria",
    "insignia": "Cazadores de Fósiles",
    "mensajeRecompensa": "Parte completado en Natural History Museum. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "Este lugar existe sobre todo para descubrir…",
        "opciones": [
          "El mundo natural y sus criaturas",
          "Los secretos de los reyes",
          "Las leyes del Parlamento",
          "Los mercados antiguos"
        ],
        "correcta": 0
      },
      {
        "texto": "Busca algo muy antiguo: fósil, hueso, dinosaurio o criatura enorme. ¿Qué pega mejor con este museo?",
        "opciones": [
          "Ciencia, animales y descubrimiento",
          "Coches y gasolina",
          "Coronas y guardias",
          "Pantallas y anuncios"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué aporta este lugar a la frase secreta de Londres?",
        "opciones": [
          "Asombro, curiosidad y tiempo profundo",
          "Ruido y tráfico",
          "Compras rápidas",
          "Vida real y balcones"
        ],
        "correcta": 0
      }
    ],
    "historia": "El museo abrió en 1881 y su edificio ya es una aventura por sí solo. Su arquitecto lo llenó de detalles inspirados en animales y plantas, como si quisiera que hasta las paredes hablasen de la naturaleza.\n\nDentro está una de las colecciones de dinosaurios más famosas del mundo. Es uno de esos lugares donde entiendes que la Tierra lleva muchísimo tiempo haciendo cosas increíbles, incluso antes de que existieran las ciudades.",
    "encajeEnMisterio": "Aquí Topotino comprendió que el código también necesitaba asombro. Londres no es solo política, puentes y plazas: también es un lugar donde se guarda la curiosidad humana y donde mirar el pasado de la Tierra te hace más pequeño y más listo a la vez."
  },
  {
    "id": "leadenhall",
    "order": 10,
    "letra": "I",
    "nombreClave": "El Pasadizo de los Magos",
    "pista": "Buscad un mercado cubierto que parece un secreto elegante del centro de Londres. Si lo encontráis, entenderéis por qué algunos directores de cine pensaron que aquí podía empezar algo mágico.",
    "nombreReal": "Leadenhall Market",
    "lat": 51.5128,
    "lng": -0.0836,
    "radioMetros": 220,
    "imagen": "images/leadenhall.jpg",
    "emoji": "✨",
    "pieza": "El Pasadizo de los Magos",
    "insignia": "Exploradores del Callejón Secreto",
    "mensajeRecompensa": "Parte completado en Leadenhall Market. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué hace que este mercado no parezca un mercado cualquiera?",
        "opciones": [
          "Su techo decorado y sus pasillos cubiertos",
          "Su gran lago central",
          "Su torre del reloj",
          "Sus animales salvajes"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Por qué este lugar encanta tanto a quien imagina historias?",
        "opciones": [
          "Porque parece un callejón elegante y casi mágico",
          "Porque aquí viven dragones",
          "Porque aquí nieva siempre",
          "Porque aquí hay un palacio real"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué idea añade Leadenhall Market al misterio?",
        "opciones": [
          "Que Londres también tiene rincones secretos con historia",
          "Que Londres solo se entiende desde arriba",
          "Que Londres solo es política",
          "Que Londres solo es naturaleza"
        ],
        "correcta": 0
      }
    ],
    "historia": "Leadenhall Market existe desde la Edad Media y se levanta sobre una zona que ya era importante en tiempos de la Londres romana. Eso significa que bajo esta parte de la ciudad se acumulan siglos y siglos de pasos, compras, voces e historias.\n\nHoy es elegante y tranquilo, pero conserva algo especial: techo decorado, pasillos cubiertos y rincones que parecen salidos de una película. No es casualidad que se usara para Harry Potter: este lugar ya parecía mágico antes de llegar al cine.",
    "encajeEnMisterio": "Aquí Topotino encontró la parte más escondida del código: Londres también está hecha de pasadizos, rincones y lugares que parecen guardar una segunda vida. Leadenhall representa el secreto bonito de la ciudad."
  },
  {
    "id": "towerbridge",
    "order": 11,
    "letra": "L",
    "nombreClave": "La Puerta del Río",
    "pista": "Buscad un puente que no parece un puente cualquiera. Tiene dos torres, parece medio fortaleza y se planta sobre el río como diciendo: ‘aquí paso yo’.",
    "nombreReal": "Tower Bridge",
    "lat": 51.5055,
    "lng": -0.0754,
    "radioMetros": 240,
    "imagen": "images/towerbridge.jpg",
    "emoji": "🌉",
    "pieza": "La Llave del Támesis",
    "insignia": "Guardianes del Puente",
    "mensajeRecompensa": "Parte completado en Tower Bridge. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué dos cosas juntas hacen que este puente se reconozca enseguida?",
        "opciones": [
          "Sus dos torres y el río",
          "Sus pantallas y sus leones",
          "Su reloj y su lago",
          "Su arco blanco y sus pelícanos"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué puede hacer Tower Bridge que no hacen la mayoría de los puentes normales?",
        "opciones": [
          "Abrirse para dejar pasar barcos",
          "Convertirse en rueda gigante",
          "Esconder dinosaurios",
          "Lanzar agua al cielo"
        ],
        "correcta": 0
      },
      {
        "texto": "¿Qué representa este lugar dentro del código?",
        "opciones": [
          "Unión, paso y conexión",
          "Silencio y pausa",
          "Realeza y ceremonia",
          "Fósiles y animales"
        ],
        "correcta": 0
      }
    ],
    "historia": "Tower Bridge se abrió en 1894. Aunque parece muy antiguo, es más moderno de lo que mucha gente cree. Su aspecto neogótico se eligió para que encajara con la cercana Torre de Londres.\n\nY aquí llega lo mejor: no solo es bonito, también se puede abrir para dejar pasar barcos altos. Es un puente, un monumento y una máquina al mismo tiempo.",
    "encajeEnMisterio": "Aquí Topotino entendió otra pieza clarísima: Londres también es unión. El río separa, pero el puente junta. Tower Bridge representa conexión, paso y la idea de que una ciudad funciona porque hay cosas que unen lo que parecía separado."
  },
  {
    "id": "coventgarden",
    "order": 12,
    "letra": "LA",
    "nombreClave": "La Plaza que Hace Eco",
    "pista": "Para la última pista necesitáis un lugar donde siempre parece estar ocurriendo algo: gente mirando, artistas actuando, tiendas, soportales y esa sensación de que el suelo guarda recuerdos.",
    "nombreReal": "Covent Garden",
    "lat": 51.5117,
    "lng": -0.124,
    "radioMetros": 230,
    "imagen": "images/coventgarden.jpg",
    "emoji": "🎭",
    "pieza": "El Eco de la Plaza",
    "insignia": "Agentes del Último Rastro",
    "mensajeRecompensa": "Parte completado en Covent Garden. Informe validado y clave asegurada.",
    "preguntas": [
      {
        "texto": "¿Qué se nota enseguida al llegar a Covent Garden?",
        "opciones": [
          "Que hay ambiente, gente y vida",
          "Que es una selva cerrada",
          "Que es un lugar vacío",
          "Que es una estación secreta"
        ],
        "correcta": 0
      },
      {
        "texto": "¿De dónde viene el nombre de Covent Garden?",
        "opciones": [
          "Del jardín del convento o de la abadía",
          "De una carrera de coches",
          "De una montaña",
          "De una palabra para “puente”"
        ],
        "correcta": 0
      },
      {
        "texto": "Buscad una actuación, un músico o un rincón donde la gente se pare a mirar. Después elegid: ¿qué aporta este lugar al misterio?",
        "opciones": [
          "Vida compartida, paseo y artistas callejeros",
          "Campanas y tiempo",
          "Leones y memoria",
          "Rejas y guardias"
        ],
        "correcta": 0
      }
    ],
    "historia": "Covent Garden empezó hace muchos siglos como campos ligados a Westminster Abbey. Su nombre viene de “Convent Garden”, es decir, el jardín del convento. Cuesta imaginarlo hoy, porque ahora es una de las zonas con más ambiente de Londres.\n\nAquí lleva habiendo espectáculo desde hace muchísimo tiempo. Por eso Covent Garden no se descubre solo con los ojos: también con los oídos. Es un lugar de voces, músicos, pasos y gente que se para a mirar.",
    "encajeEnMisterio": "La última idea que Topotino descubrió fue esta: Londres también es vida compartida. Covent Garden representa las voces, el paseo, el arte callejero y la alegría de una ciudad cuando se deja habitar."
  }
];
