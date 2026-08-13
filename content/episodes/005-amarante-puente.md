---
{
  "id": "005-amarante-puente",
  "order": 5,
  "title": "Día 1 · El puente entre dos memorias",
  "channelCode": "T-19B4",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "date": { "on": "2026-08-13" },
    "location": { "lat": 41.2688522, "lng": -8.0780659, "radiusMeters": 1000, "label": "Ponte de São Gonçalo, Amarante" }
  },
  "mission": "Descubrir qué recuerda la ponte",
  "formulaWord": "COMIENZO",
  "water": "Agua del Puente",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Es el 13 de agosto. Paula y Hugo llegan a Amarante. El capítulo exige un recorrido real y enlazado: ribera y vista completa de la ponte, cruce seguro para leer el paisaje, obelisco o memoria de 1809, exterior de la Igreja de São Gonçalo y Senhora da Ponte. Las respuestas se diseñan con una exigencia aproximada de diez años para ambos. La geolocalización solo abre la conversación al llegar; la evidencia se obtiene caminando por el conjunto de São Gonçalo.

La ponte actual mide unos cincuenta metros y tiene cuatro balcones semicirculares. La antigua cayó tras las lluvias de 1763. La tradición atribuye a São Gonçalo la construcción de una ponte anterior, el movimiento de grandes piedras y la ayuda de peces para alimentar a quienes trabajaban. La ponte actual fue un paso estratégico durante la resistencia de 1809, que duró catorce días.

Topotino no recibe una señal nueva ni encuentra una máquina en Amarante. El propio lugar le provoca una familiaridad incompleta: reconoce el recorrido, recuerda preguntas de una investigación anterior y sabe qué detalles solía comprobar, pero no recuerda el caso entero ni sus conclusiones. Cada recuerdo debe contrastarse con lo que Paula y Hugo observan allí. No se usan ventanas mágicas del mapa ni pistas colocadas en monumentos.

El Cuaderno de la Memoria continúa siendo privado. Topotino no pide una entrada, una foto ni una explicación de sus páginas. La palabra técnica `COMIENZO` y las flags antiguas con `diario` se conservan silenciosamente por compatibilidad. Al terminar la investigación, pide recoger una pequeña muestra del agua de Amarante solo si los adultos lo consideran seguro, sin entrar en el río ni acercarse a un borde. Todavía no sabe para qué servirá, pero prefiere conservarla a tener que regresar después. Solo tras recogerla la llama Agua del Puente. Después, un recuerdo de la planificación anterior conduce a Magikland y Topotino pide descanso.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "requiredFlags": ["amarante_previa_identificada"], "text": "Habéis llegado al lugar que dedujisteis. Gracias por traerme hasta aquí aunque yo fuera quien preparó la investigación. Ups: mi yo anterior sí sabía organizar viajes." },
  { "from": "topotino", "time": "auto", "blockedFlags": ["amarante_previa_identificada"], "text": "La deducción quedó pendiente, pero ya estáis en Amarante. No fingiré que recuerdo haberlo planeado: investigaremos el lugar real y reconstruiremos la ruta desde lo que veáis." },
  { "from": "topotino", "time": "auto", "text": "Hay algo extraño. Este puente me resulta conocido, pero no como una fotografía: mis patas parecen recordar el recorrido antes que mi cabeza." },
  { "from": "topotino", "time": "auto", "text": "Creo que ya estuve aquí durante una investigación anterior al eclipse. Recuerdo preguntas, no respuestas. Si mi memoria se equivoca, corregidme; una corazonada de topo no es una prueba." },
  { "from": "topotino", "time": "auto", "text": "Empezad en una ribera desde la que veáis la ponte completa. Quiero comprobar un recuerdo concreto, no haceros repetir una pista." },
  { "from": "topotino", "time": "auto", "text": "Contad sus balcones semicirculares. Después elegid dos evidencias más: una de la construcción y otra de su relación con el río o la ciudad. Explicad cómo juntas permiten reconocer esta ponte y no solo cualquier puente bonito." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "amarante-alternativa-lluvia",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["llueve", "esta lloviendo", "está lloviendo", "mucha lluvia", "tormenta"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces nada de investigar bajo la lluvia. Gracias por avisar. Poneos a cubierto con los adultos y resolved el inventario desde una ventana o desde una fotografía que haya hecho hoy la familia: número de balcones semicirculares, otro detalle construido y por qué permite reconocer la ponte." }
    ]
  },
  {
    "id": "amarante-alternativa-cierre",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["cerrado", "cerrada", "no podemos entrar", "no nos dejan entrar", "es muy tarde", "ya es tarde"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No intentéis entrar. La investigación está en el exterior: contad desde el recorrido permitido los balcones semicirculares de la ponte y elegid otro detalle construido que la identifique. Nada de tocar ni cruzar zonas cerradas." }
    ]
  },
  {
    "id": "amarante-alternativa-cansancio",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["estamos cansados", "estoy cansado", "estoy cansada", "no podemos caminar", "nos duelen los pies"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces parad. Gracias por decirlo antes de convertiros en dos calcetines con mochila. Desde donde descanséis o desde una foto tomada hoy, contad los balcones semicirculares y elegid otro detalle construido. El reto sigue siendo razonar; caminar de más no demuestra nada." }
    ]
  },
  {
    "id": "amarante-alternativa-preguntar",
    "blockedFlags": ["amarante_puente_observado"],
    "match": ["no podemos", "no podemos hacerlo", "no se puede", "no podemos hacer la prueba"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entendido. No forcéis nada. Decidme qué lo impide y adaptaré esta misma investigación: necesito saber si es lluvia, cierre, cansancio u otra cosa." }
    ]
  },
  {
    "id": "amarante-puente-observado",
    "blockedFlags": ["amarante_puente_observado"],
    "openAnswer": true,
    "minWords": 18,
    "containsAnyGroups": [["cuatro", "4"], ["balcón", "balcon", "balcones", "balcões"], ["arco", "arcos", "piedra", "pedra", "obelisco", "torre"], ["río", "rio", "tâmega", "tamega", "orilla", "orillas", "ciudad"], ["porque", "identifica", "reconocer", "distingue", "característico", "caracteristico"]],
    "rejectContainsAny": ["no se", "ni idea", "da igual", "lo que sea"],
    "setFlags": ["amarante_puente_observado"],
    "remember": { "kind": "field_observation", "label": "Inventario físico de la Ponte de São Gonçalo" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Mi recuerdo acierta en una parte: son cuatro balcones semicirculares. Lo importante es que no os habéis quedado con el número: habéis reunido forma, río y ciudad para identificar el lugar." },
      { "from": "topotino", "time": "auto", "text": "La ponte actual mide unos cincuenta metros. La antigua se vino abajo en 1763 después de lluvias intensas, y la imagen de Nossa Senhora da Piedade sobrevivió y quedó vinculada a la nueva travesía. Un puente puede cambiar y seguir conservando una historia." },
      { "from": "topotino", "time": "auto", "text": "Ahora cruzadla con los adultos. Deteneos en un balcón permitido y mirad ambas orillas, el Tâmega y las calles que continúan." },
      { "from": "topotino", "time": "auto", "text": "Mi siguiente recuerdo es una pregunta sobre 1809: si un ejército quisiera cruzar el Tâmega, ¿qué tendría que controlar aquí y qué podría vigilar desde la ponte? No acepto solo «porque era importante»: usad dos evidencias del paisaje y una consecuencia." }
    ]
  },
  {
    "id": "amarante-posicion-estrategica",
    "requiredFlags": ["amarante_puente_observado"],
    "blockedFlags": ["amarante_posicion_razonada"],
    "openAnswer": true,
    "minWords": 20,
    "containsAnyGroups": [["río", "rio", "tâmega", "tamega"], ["orillas", "ciudad", "calles", "camino", "ruta", "entrada", "salida"], ["cruzar", "cruce", "paso", "defender", "controlar", "puente", "ponte"], ["porque", "permite", "impide", "obliga", "conecta", "separa"], ["vigilar", "detener", "bloquear", "proteger", "atacar", "defender"]],
    "rejectContainsAny": ["porque si", "porque sí", "no se", "ni idea", "da igual"],
    "setFlags": ["amarante_posicion_razonada"],
    "remember": { "kind": "reasoning", "label": "Hipótesis sobre la importancia estratégica de la ponte" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Buena inferencia. Habéis leído historia en el terreno, no repetido una fecha. En 1809 la resistencia de la ponte duró catorce días, entre abril y mayo, durante las Invasiones Francesas. Aunque la defensa acabó siendo superada, retrasó y desgastó la ofensiva: el paisaje ayuda a entender por qué un paso podía importar tanto." },
      { "from": "topotino", "time": "auto", "text": "Ahora buscad un obelisco, una lápida o una inscripción de la ponte. No me digáis solo qué fecha aparece: decid qué hecho conmemora y qué parte de la historia no puede contarnos por sí sola." },
      { "from": "topotino", "time": "auto", "text": "Después id al exterior de la Igreja de São Gonçalo. Buscad en una ventana la Senhora da Ponte. Mi memoria insiste en que la antigua ponte cayó en 1763, pero quiero que comprobéis qué imagen sobrevivió y dónde se conserva." },
      { "from": "topotino", "time": "auto", "text": "Cuando tengáis ambos hallazgos, comparadlos: ¿qué diferencia hay entre una inscripción histórica y una imagen conservada por una comunidad? No os pido decidir cuál es «más verdadera». Os pido explicar qué tipo de memoria aporta cada una." }
    ]
  },
  {
    "id": "amarante-historia-comprendida",
    "requiredFlags": ["amarante_posicion_razonada"],
    "blockedFlags": ["completado_amarante"],
    "openAnswer": true,
    "minWords": 24,
    "containsAnyGroups": [["obelisco", "inscripción", "inscripcion", "lápida", "lapida", "1809", "resistencia"], ["senhora", "piedad", "ventana", "iglesia", "1763", "medieval"], ["pez", "peces", "são gonçalo", "tradición", "tradicion", "relato"], ["memoria", "historia", "documento", "monumento", "conserva", "comunidad"], ["diferencia", "distinta", "tipo", "aporta", "recuerda", "conmemora"]],
    "rejectContainsAny": ["todo es verdad", "todo es mentira", "no se", "ni idea"],
    "setFlags": ["amarante_historia_comprendida"],
    "remember": { "kind": "walking_source_reasoning", "label": "Recorrido entre monumento, imagen y tradición en Amarante" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto. La inscripción conserva un hecho público; la Senhora da Ponte conserva una imagen ligada a una travesía anterior; y el relato de los peces conserva identidad y valores de Amarante. Son memorias distintas, no una sola prueba mezclada." },
      { "from": "topotino", "time": "auto", "text": "La tradición cuenta que São Gonçalo ayudó a construir la primera ponte, movió piedras enormes y pidió peces para alimentar a quienes trabajaban. Os lo cuento como tradición de la comunidad, no como un dato que la inscripción pueda demostrar." },
      { "from": "topotino", "time": "auto", "text": "Ahora entiendo por qué este lugar me resultaba familiar. No he recuperado el caso entero: he recuperado la manera de investigarlo. Mi yo anterior venía aquí para comparar paisaje, monumento e historia oral." },
      { "from": "topotino", "time": "auto", "text": "Antes de cerrar, os voy a pedir algo distinto. Si los adultos lo consideran seguro, recoged una pequeña muestra del agua de Amarante en un recipiente cerrado. No entréis en el río, no os acerquéis a bordes y no la bebáis." },
      { "from": "topotino", "time": "auto", "text": "No sé para qué servirá. Precisamente por eso prefiero tenerla guardada a descubrir mañana que necesitamos volver. Una investigación también consiste en conservar una posibilidad." },
      { "from": "topotino", "time": "auto", "text": "Cuando la tengáis, decidme solo que la habéis recogido. Después le pondremos un nombre: Agua del Puente. No porque sepamos todavía qué hará, sino porque nació junto a esta ponte." }
    ]
  },
  {
    "id": "amarante-diario-guardado",
    "requiredFlags": ["amarante_historia_comprendida"],
    "blockedFlags": ["completado_amarante"],
    "openAnswer": true,
    "minWords": 4,
    "containsAnyGroups": [["agua", "amarante", "río", "rio", "tâmega", "tamega"], ["recog", "cog", "guard", "muestra", "gotas", "frasco", "botella", "recipiente"]],
    "rejectContainsAny": ["no se", "ni idea", "da igual", "no podemos"],
    "setFlags": ["diario_amarante", "completado_amarante"],
    "water": "Agua del Puente",
    "formulaWord": "COMIENZO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Recibido. No voy a pediros el contenido del cuaderno. Doy por cerrada la investigación con lo que razonasteis sobre Amarante y con la muestra que habéis conservado con los adultos." },
      { "from": "topotino", "time": "auto", "text": "Desde ahora la llamamos Agua del Puente. No sé qué recordará ni para qué nos servirá, pero ya no tendremos que volver a buscarla." },
      { "from": "topotino", "time": "auto", "text": "Y ahora me ha vuelto otro recuerdo, pero viene hecho un lío. Había un lugar mágico muy raro; parecía un sueño. Allí convivían África, el lejano Oeste y un zoco, pero también piratas y un poblado medieval." },
      { "from": "topotino", "time": "auto", "text": "No sé si era un parque, una ciudad inventada o un sueño con entradas. Ayudadme a encontrarlo. No tengo muchas más pistas y, por una vez, mi confusión parece parte del mapa." },
      { "from": "topotino", "time": "auto", "text": "Y no olvidéis el lugar extraño de mi recuerdo: África, el lejano Oeste, un zoco, piratas y un poblado medieval en el mismo sitio. Mañana comprobaremos si existe de verdad." },
      { "from": "topotino", "time": "auto", "text": "Preparad bañador, toalla, protector solar, agua para beber y calzado cómodo. Ahora descansad; continuaremos mañana." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "La primera respuesta necesita tres partes: cuántos balcones semicirculares veis, otro detalle construido y por qué identifica esta ponte.",
  "Para explicar su valor estratégico, usad dos evidencias visibles: el río, las orillas, el paso, la forma de cruzar o la relación con la ciudad.",
  "Buscad dos paradas distintas: una inscripción u obelisco de 1809 y la Senhora da Ponte en una ventana de la iglesia. Después relacionadlas con el relato de los peces."
]
```

## Pistas progresivas

```json
[
  "Los balcones que buscamos sobresalen de la ponte con forma semicircular. El número es menor que cinco y mayor que tres; añadid una evidencia de piedra o arcos y otra relacionada con el río o la ciudad.",
  "Imaginad que el río dificulta pasar de una orilla a otra. No basta con decir que la ponte era importante: explicad qué podía vigilar o bloquear quien controlara ese paso.",
  "La inscripción u obelisco recuerda 1809. En el exterior de la iglesia, una ventana conserva la Senhora da Ponte y se relaciona con la caída de la antigua ponte en 1763. Los peces pertenecen al relato de São Gonçalo. Comparad qué tipo de memoria aporta cada fuente."
]
```

## Contexto para IA

Topotino conserva la amistad emocional con Paula y Hugo y recuerda todo desde el eclipse. El capítulo admite una rama normal y otra de recuperación: si falta `amarante_previa_identificada`, reconoce que la deducción quedó pendiente y no finge que ocurrió. No recupera el caso completo anterior, pero el lugar le activa recuerdos parciales de método: reconoce el puente, recuerda preguntas y puede recordar una ruta sin recordar sus respuestas. Cada recuerdo debe contrastarse con la evidencia que Paula y Hugo encuentran allí. Tras `amarante_puente_observado`, sabe que comprobaron cuatro balcones semicirculares y dos relaciones del puente con su entorno. Tras `amarante_posicion_razonada`, puede conversar sobre la importancia estratégica de la ponte sin añadir hechos que no dijeron. Tras `amarante_historia_comprendida`, sabe que localizaron la memoria de 1809, la Senhora da Ponte y la tradición de São Gonçalo, y debe explicar qué aporta cada fuente. Después pide una muestra segura del agua de Amarante; solo cuando se confirma que la han recogido reconoce el nombre Agua del Puente y el cierre del día. No usa ventanas del mapa, máquinas ni señales nuevas. No identifica con certeza a Topoloco. Conversa con ambos a nivel intelectual aproximado de diez años. El Cuaderno es privado. No revela el museo, Granada ni los leones. Al cerrar recuerda de forma incompleta un lugar imposible con África, lejano Oeste, zoco, piratas y poblado medieval, y pide ayudarle a encontrarlo al día siguiente.

## Fuentes documentales

- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
- https://www.cm-amarante.pt/amarante-evoca-a-defesa-da-ponte-com-programa-cultural-e-evocativo-no-dia-2-de-maio/
