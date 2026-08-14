---
{
  "id": "006-magikland-curia",
  "order": 6,
  "title": "Día 2 · La máquina que estudiaba recuerdos",
  "channelCode": "T-26R8",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "date": { "on": "2026-08-14" },
    "location": { "lat": 41.1990981, "lng": -8.2800010, "radiusMeters": 5000, "label": "Magikland, Penafiel" }
  },
  "mission": "Descubrir qué mide la máquina",
  "formulaWord": "RIO",
  "water": "Agua de la Risa",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Es 14 de agosto. Antes de cualquier prueba, Topotino reconoce las interferencias de Amarante, explica que parecen un intento de intrusión de Topoloco y presenta el contador de Sombra como alarma experimental. Espera una respuesta de Paula y Hugo para comprobar que el canal vuelve a respetar el orden. Solo después les ayuda a identificar Magikland; Curia permanece oculta hasta que el Cazarrisas produce la coordenada al terminar la investigación del parque.

La jornada contrapone movimiento y quietud, pero no mediante una lista simple. Magikland funciona como laboratorio de mecánica: Paula y Hugo identifican tipos de movimiento, hacen una predicción causal y distinguen ruido, emoción y recuerdo. En Curia analizan un paisaje construido, naturaleza y reflejos. Las pruebas tienen una exigencia intelectual aproximada de diez años y necesitan observación física. La llegada a Magikland abre el capítulo, pero la ubicación nunca valida las respuestas.

El lenguaje infantil nombra siempre lo que ocurre: qué pieza gira, qué objeto se mueve, qué parte del hotel parece antigua y qué superficie cambia el reflejo. Los términos técnicos se explican en la misma frase. La dificultad está en comparar y razonar, no en interpretar metáforas de Topotino.

Magikland se divide en África, Mundo da Confusão, Aldeia Medieval, Refúgio dos Piratas, Far-West y Souk. Ofrece rotaciones, oscilaciones, desplazamientos, subidas, bajadas y recorridos de agua. Ninguna fase exige montar en una atracción concreta. Topoloco ha dejado un Cazarrisas Hidráulico que intenta separar el sonido de una risa, la causa y el recuerdo que deja. Su primer fracaso registra su propio grito, pero el segundo le permite aprender que Paula y Hugo recuperan conexiones al interpretar lo vivido. La máquina comparte firma con otra estación todavía no localizada dentro de un segundo parque de aventuras.

Después de que Paula y Hugo confirmen que los seis mundos existen, llega la primera transmisión de Topotina. Explica que es la hermana de Topotino y que ayudó a preparar el sistema de investigación, pero no la ruta: dividieron la información para que nadie pudiera robarla completa. Topotino no la recuerda. Ella responde: «No necesito que me recuerdes para seguir siendo tu hermana».

En Curia duermen, pero la investigación se centra en el Hotel do Parque: un edificio de 1922 restaurado como hotel, con decoración clásica, suelos de madera, patio, piscina y jardín. La prueba distingue huellas de su época original de las adaptaciones y usos actuales; después conserva el experimento de reflejo en el jardín, la piscina, una ventana o agua potable.

El Cuaderno de la Memoria continúa privado. Topotino no pide que cuenten qué escriben o dibujan. La palabra técnica `RIO`, el valor interno de agua y la flag antigua `diario_magikland_curia` se conservan silenciosamente. Al cerrar, el recuerdo de Topotino se completa con una imagen precisa del siguiente paisaje y aparece una pista hacia Buçaco; después pide descanso.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Antes de salir: bañador, toalla, protector solar, agua para beber y calzado cómodo. Hay zonas de agua, aunque ninguna prueba obliga a usarlas." },
  { "from": "topotino", "time": "auto", "requiredFlags": ["completado_amarante"], "text": "Alerta de bigotes. El lugar raro de mi recuerdo existe: seis mundos juntos, como si alguien hubiera mezclado un sueño con un mapa. Agua del Puente a salvo; ahora comprobaremos si mi cabeza acierta con el resto." },
  { "from": "topotino", "time": "auto", "blockedFlags": ["completado_amarante"], "text": "El recuerdo de ayer quedó incompleto, pero ya estamos aquí. No fingiré que sé por qué: busquemos el lugar que encaja con África, el lejano Oeste, el zoco, los piratas y el poblado medieval." },
  { "from": "topotino", "time": "auto", "text": "Antes de buscar atracciones concretas, comprobad que esos mundos conviven de verdad en el mismo recinto. Después veremos qué está intentando aprender una máquina escondida entre ellos." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "magikland-pista-pedida",
    "blockedFlags": ["magikland_pista_dada", "magikland_identificado"],
    "containsAny": ["pista", "ayuda", "no sabemos", "no lo encontramos", "no tenemos idea", "ni idea"],
    "setFlags": ["magikland_pista_dada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Pista más clara: es un parque de Penafiel." },
      { "from": "topotino", "time": "auto", "text": "Su nombre empieza por MAGIK y termina como la palabra inglesa para «tierra»." }
    ]
  },
  {
    "id": "magikland-solucion-ayudada",
    "requiredFlags": ["magikland_pista_dada"],
    "blockedFlags": ["magikland_identificado"],
    "containsAny": ["pista", "ayuda", "no sabemos", "no lo encontramos", "no tenemos idea", "ni idea"],
    "setFlags": ["magikland_identificado"],
    "remember": { "kind": "assisted_deduction", "label": "Identificación ayudada de Magikland" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Es Magikland: MAGIK + LAND. No os voy a dejar atrapados en un nombre." },
      { "from": "topotino", "time": "auto", "text": "Ahora comprobad allí la parte importante: que existen los seis mundos del plano." },
      { "from": "topotino", "time": "auto", "text": "Después buscad tres movimientos: algo que gira, algo que va y vuelve y algo que cambia de lugar. No hace falta montar." }
    ]
  },
  {
    "id": "magikland-identificado",
    "blockedFlags": ["magikland_identificado"],
    "openAnswer": true,
    "minWords": 3,
    "containsAny": ["magikland"],
    "rejectContainsAny": ["no se", "ni idea", "da igual"],
    "setFlags": ["magikland_identificado"],
    "remember": { "kind": "deduction", "label": "Identificación razonada de Magikland" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Magikland encaja: sus seis áreas explican el plano. Gracias por justificarlo." },
      { "from": "topotino", "time": "auto", "text": "Recorred al menos tres mundos distintos. En cada uno buscad un movimiento: rotación, que gira; oscilación, que va y vuelve; y desplazamiento, que cambia de lugar." },
      { "from": "topotino", "time": "auto", "text": "Decidme qué elemento observasteis en cada caso y en cuál de los tres cambia de dirección de manera más evidente. Podéis discrepar, pero justificad la elección." }
    ]
  },
  {
    "id": "magikland-alternativa-cierre",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "containsAny": ["esta cerrado", "está cerrado", "han cerrado", "atraccion cerrada", "atracción cerrada", "no funciona", "no podemos entrar"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces esa atracción queda fuera. Desde una zona permitida buscad otros tres movimientos del parque o de sus mecanismos visibles: rotación, oscilación y desplazamiento. La clasificación y la justificación siguen intactas." }
    ]
  },
  {
    "id": "magikland-alternativa-miedo",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "containsAny": ["me da miedo", "nos da miedo", "no quiero montar", "no queremos montar", "demasiado alto", "no me atrevo"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No tenéis que subir. Observad desde el camino tres mecanismos seguros y clasificadlos en rotación, oscilación y desplazamiento. La valentía también consiste en decidir con información qué no queréis hacer." }
    ]
  },
  {
    "id": "magikland-alternativa-cansancio",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "containsAny": ["estamos cansados", "estoy cansado", "estoy cansada", "nos duelen los pies", "queremos descansar"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Parad y descansad. Desde donde estáis, elegid tres movimientos ya vistos y clasificadlos: rotación, oscilación y desplazamiento. Explicad cuál cambia de dirección de forma más clara. Pensar sentados sigue siendo pensar." }
    ]
  },
  {
    "id": "magikland-alternativa-preguntar",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "match": ["no podemos", "no podemos hacerlo", "no podemos hacer la prueba", "no se puede"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Decidme qué lo impide exactamente. Adaptaré esta investigación sin regalar la clasificación: ¿cierre, miedo, cansancio u otra cosa?" }
    ]
  },
  {
    "id": "magikland-movimientos",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["rotación", "rotacion", "gira", "eje"], ["oscilación", "oscilacion", "balancea", "ida y vuelta"], ["desplazamiento", "avanza", "recorre", "traslada"], ["noria", "rueda", "barco", "tren", "coche", "carro", "vehículo", "vehiculo", "atracción", "atraccion", "agua", "tronco"], ["porque", "dirección", "direccion", "cambia", "observamos", "vimos"]],
    "rejectContainsAny": ["ninguno", "nada", "no se", "ni idea"],
    "setFlags": ["magikland_movimientos"],
    "remember": { "kind": "field_classification", "label": "Clasificación de movimientos observados en Magikland" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis clasificado tres mecanismos y explicado cuál cambia de dirección con más claridad. El Cazarrisas ha grabado los movimientos, pero todavía confunde el ruido de una atracción con vuestra reacción." },
      { "from": "topotino", "time": "auto", "text": "Segunda investigación. Elegid uno de esos movimientos antes de verlo completar otro ciclo. Predecid en qué parte irá más rápido y en cuál más despacio. Después observadlo y decid si la predicción se sostiene, usando altura, gravedad, impulso, rozamiento o corriente como explicación." }
    ]
  },
  {
    "id": "magikland-prediccion-movimiento",
    "requiredFlags": ["magikland_movimientos"],
    "blockedFlags": ["magikland_prediccion_movimiento"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["rápido", "rapido", "despacio", "velocidad"], ["altura", "arriba", "abajo", "gravedad", "impulso", "rozamiento", "corriente"], ["predicción", "prediccion", "observamos", "comprobamos", "acertamos", "fallamos", "cambió", "cambio"]],
    "rejectContainsAny": ["porque si", "porque sí", "no se", "ni idea", "da igual"],
    "setFlags": ["magikland_prediccion_movimiento"],
    "remember": { "kind": "prediction", "label": "Predicción y comprobación sobre velocidad y movimiento" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Eso sí es una investigación: predicción, observación y corrección. Acierto o error inicial importan menos que explicar por qué cambió vuestra hipótesis." },
      { "from": "topotino", "time": "auto", "text": "El Cazarrisas de Topoloco también se ha activado, pero su primera grabación dice: «AAAAAA, PARAD ESTA COSA». Ha clasificado su propio grito como descubrimiento científico. Vanidad uno, método cero." },
      { "from": "topotino", "time": "auto", "text": "Tercera investigación. Elegid un momento real del parque. Decid qué ocurrió, qué lo causó y por qué creéis que lo recordaréis dentro de varios años. No tiene que ser el momento más ruidoso." }
    ]
  },
  {
    "id": "magikland-recuerdo-elegido",
    "requiredFlags": ["magikland_prediccion_movimiento"],
    "blockedFlags": ["magikland_recuerdo_elegido"],
    "openAnswer": true,
    "minWords": 9,
    "containsAnyGroups": [["sonido", "movimiento", "salpicadura", "grito", "risa", "caída", "caida"], ["causa", "porque", "provocó", "provoco", "ocurrió", "ocurrio"], ["recuerdo", "recordaremos", "significó", "significo", "importante", "juntos", "años"]],
    "rejectContainsAny": ["nada", "ninguno", "no se", "ni idea", "lo que sea"],
    "setFlags": ["magikland_recuerdo_elegido"],
    "remember": { "kind": "meaningful_event", "label": "Momento significativo de Magikland y explicación de su causa" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis dicho qué ocurrió, qué lo causó y por qué os importó. La máquina reacciona cuando un momento os importa, no cuando solo hay mucho ruido. Acaba de imprimir: «MUESTRA VÁLIDA»." },
      { "from": "topotino", "time": "auto", "text": "La máquina tiene una segunda firma, como si estuviera emparejada con otro parque. No aparece el nombre. Solo una brújula, un barco y colores muy intensos." },
      { "from": "topotino", "time": "auto", "text": "Un mensaje acaba de entrar en el canal: «Soy Topotina. Soy tu hermana. Yo diseñé las ventanas, pero tú escondiste la ruta»." },
      { "from": "topotino", "time": "auto", "text": "No la recuerdo. Se lo he dicho. Ha contestado: «No necesito que me recuerdes para seguir siendo tu hermana». Vale. Eso me ha dejado los bigotes bastante quietos." },
      { "from": "topotino", "time": "auto", "text": "La siguiente coordenada no señala Curia entera. Señala un edificio que abrió en 1922 y todavía recibe viajeros. Cuando encontréis el Hotel do Parque, escribid HOTEL DO PARQUE. Allí comprobaremos si un lugar puede conservar memoria aunque cambie de uso." }
    ]
  },
  {
    "id": "curia-alternativa-cambio-plan",
    "requiredFlags": ["magikland_recuerdo_elegido"],
    "blockedFlags": ["curia_llegada"],
    "containsAny": ["no vamos a curia", "no iremos a curia", "hemos cambiado el plan", "cambio de plan", "no podemos ir a curia"],
    "setFlags": ["curia_llegada", "curia_recuperacion_lugar_real"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Cambio real anotado. No fingiremos estar en el Hotel do Parque. En el alojamiento real buscad dos indicios de un edificio de otra época y una adaptación que permita usarlo hoy. Después justificad vuestra clasificación." }
    ]
  },
  {
    "id": "curia-alternativa-cansancio-previo",
    "requiredFlags": ["magikland_recuerdo_elegido"],
    "blockedFlags": ["curia_llegada"],
    "containsAny": ["estamos muy cansados", "no podemos mas", "no podemos más", "queremos ir al hotel", "nos vamos al hotel"],
    "setFlags": ["curia_llegada", "curia_recuperacion_lugar_real"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces se investiga sentados en el hotel. Buscad dos indicios de que el edificio pertenece a otra época y una adaptación que permita usarlo hoy. La dificultad está en justificar, no en seguir caminando." }
    ]
  },
  {
    "id": "curia-llegada",
    "requiredFlags": ["magikland_recuerdo_elegido"],
    "blockedFlags": ["curia_llegada"],
    "match": ["hotel do parque", "hemos llegado al hotel do parque", "estamos en el hotel do parque", "curia"],
    "setFlags": ["curia_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Edificio localizado. El Hotel do Parque abrió en 1922 y después fue restaurado." },
      { "from": "topotino", "time": "auto", "text": "Empezad fuera: buscad en la fachada dos partes que parezcan antiguas. Después entrad con los adultos y buscad otra en la madera o la decoración." },
      { "from": "topotino", "time": "auto", "text": "Terminaremos en el jardín o el patio. Buscad algo moderno y explicad qué detalle os permite distinguirlo de las partes antiguas." }
    ]
  },
  {
    "id": "curia-paisaje-razonado",
    "requiredFlags": ["curia_llegada"],
    "blockedFlags": ["curia_paisaje_razonado"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["antiguo", "antigua", "clásico", "clasico", "1922", "fachada", "ventana", "balcón", "balcon", "madera", "decoración", "decoracion", "simetría", "simetria"], ["actual", "moderno", "hotel", "recepción", "recepcion", "piscina", "jardín", "jardin", "luz", "equipamiento", "restaurado"], ["porque", "indica", "se nota", "evidencia", "época", "epoca", "uso"]],
    "rejectContainsAny": ["todo antiguo", "todo moderno", "no se", "ni idea", "da igual"],
    "setFlags": ["curia_paisaje_razonado"],
    "remember": { "kind": "architectural_reasoning", "label": "Lectura de las capas históricas y actuales del Hotel do Parque" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Bien razonado. El hotel conserva partes de 1922 y también tiene elementos modernos para recibir huéspedes hoy. Cambiar no obliga a borrar todo lo anterior." },
      { "from": "topotino", "time": "auto", "text": "Última investigación. En el jardín, junto a la piscina o ante una ventana, elegid un reflejo seguro. Observadlo desde un punto y cambiad después vuestra posición unos pasos, siempre con los adultos. Decid qué cambió, qué permaneció y si cambió el objeto, el reflejo o el observador. Añadid un sonido pequeño que solo percibisteis al deteneros." }
    ]
  },
  {
    "id": "curia-alternativa-lluvia",
    "requiredFlags": ["curia_paisaje_razonado"],
    "blockedFlags": ["completado_magikland_curia"],
    "containsAny": ["llueve", "esta lloviendo", "está lloviendo", "tormenta"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No salgáis. Usad un reflejo en la ventana o en un vaso de agua potable. Cambiad la posición desde un lugar seguro y explicad qué cambia, qué permanece y qué sonido pequeño aparece al guardar silencio." }
    ]
  },
  {
    "id": "curia-alternativa-cierre",
    "requiredFlags": ["curia_paisaje_razonado"],
    "blockedFlags": ["completado_magikland_curia"],
    "containsAny": ["parque cerrado", "esta cerrado", "está cerrado", "no podemos entrar", "ya es tarde"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No entréis. Haced la investigación desde el alojamiento con una ventana o un vaso de agua potable: cambiad vuestra posición y razonad qué cambia en el reflejo, qué permanece y qué sonido pequeño percibís al deteneros." }
    ]
  },
  {
    "id": "curia-alternativa-cansancio",
    "requiredFlags": ["curia_paisaje_razonado"],
    "blockedFlags": ["completado_magikland_curia"],
    "containsAny": ["estamos cansados", "estoy cansado", "estoy cansada", "queremos descansar"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces se hace sentados. Observad un reflejo en una ventana o en agua potable desde dos posiciones y explicad qué cambia, qué permanece y qué sonido pequeño notáis al quedaros quietos." }
    ]
  },
  {
    "id": "curia-quietud-observada",
    "requiredFlags": ["curia_paisaje_razonado"],
    "blockedFlags": ["completado_magikland_curia"],
    "openAnswer": true,
    "minWords": 9,
    "containsAnyGroups": [["reflejo", "imagen", "observador", "objeto"], ["posición", "posicion", "cambió", "cambio", "permaneció", "igual", "punto de vista"], ["sonido", "oímos", "oimos", "escuchamos", "ruido"]],
    "rejectContainsAny": ["nada", "no se", "ni idea", "da igual"],
    "setFlags": ["curia_quietud_observada", "diario_magikland_curia", "completado_magikland_curia"],
    "remember": { "kind": "reflection_reasoning", "label": "Experimento de reflejo, punto de vista y escucha en Curia" },
    "water": "Agua de la Risa",
    "formulaWord": "RIO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis distinguido el objeto real, su imagen en el agua y el lugar desde el que mirabais. También habéis oído un sonido pequeño al quedaros quietos." },
      { "from": "topotino", "time": "auto", "text": "He recordado una sensación de Londres: los tres nos reíamos porque algo había salido rematadamente mal. No veo dónde estábamos ni qué ocurrió, pero recuerdo cómo era reírme con vosotros. No completaré el hueco con una invención." },
      { "from": "topotino", "time": "auto", "text": "La tercera ventana del mapa se ha aclarado. No uséis agua del parque, del lago ni de la piscina: la conexión apareció al comprender por qué un momento se convierte en recuerdo." },
      { "from": "topotino", "time": "auto", "text": "Topotina confirma que las ventanas forman una red. Ella construyó el sistema; yo escondí los destinos. Ninguno tenía el plan completo." },
      { "from": "topotino", "time": "auto", "text": "Del filtro ha salido una imagen: un bosque con convento, memoria de una batalla y un palacio. Huele a musgo, piedra fría y hojas mojadas. Esa será la ruta de mañana." },
      { "from": "topotino", "time": "auto", "text": "Por hoy se acabó. Habéis clasificado movimientos, comprobado una predicción y separado objeto, reflejo y observador. Cenad y descansad. Mañana necesitaremos ojos despiertos y argumentos todavía mejores." }
    ]
  },
  {
    "id": "curia-diario-guardado",
    "requiredFlags": ["curia_quietud_observada"],
    "blockedFlags": ["completado_magikland_curia"],
    "openAnswer": true,
    "minWords": 1,
    "setFlags": ["diario_magikland_curia", "completado_magikland_curia"],
    "water": "Agua de la Risa",
    "formulaWord": "RIO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "La señal antigua esperaba una descripción del cuaderno. Ya no la necesito y no voy a pedírosla. La investigación del reflejo contiene la evidencia suficiente." },
      { "from": "topotino", "time": "auto", "text": "La siguiente pista huele a musgo, piedra fría y hojas empapadas: «donde el bosque bebe del cielo». Ahora descansad." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Para reconocer el lugar, relacionad su nombre con los seis mundos del plano; no basta con escribir un nombre sin razón.",
  "Buscad tres mecanismos reales y clasificadlos: rotación alrededor de un eje, oscilación de ida y vuelta y desplazamiento de un punto a otro.",
  "Una predicción completa dice dónde irá más rápido o despacio y propone una causa: altura, gravedad, impulso, rozamiento o corriente.",
  "Separad el momento del parque en fenómeno, causa y significado futuro.",
  "En el Hotel do Parque, buscad dos huellas de 1922 y una adaptación de su uso actual; justificad cada capa.",
  "En el reflejo distinguimos tres cosas: el objeto, su imagen y la posición desde la que observáis. Añadid el sonido pequeño que apareció al deteneros."
]
```

## Pistas progresivas

```json
[
  "El nombre del parque empieza por MAGIK, pero necesito también la relación con las seis áreas temáticas.",
  "Una noria rota; un barco pirata suele oscilar; un vehículo o una barca se desplaza. Buscad ejemplos reales allí.",
  "En muchos movimientos dominados por la gravedad, la velocidad cambia con la altura. Comprobadlo en el mecanismo que habéis elegido.",
  "El Cazarrisas puede registrar ruido, pero no sabe por qué ese instante os importará dentro de años.",
  "Una fachada, un balcón o la madera pueden conservar una época; una recepción, la iluminación o la piscina muestran el uso actual.",
  "Si cambiáis de posición y el objeto sigue quieto, ¿qué ha cambiado realmente: el objeto, la imagen visible o vuestro punto de vista?"
]
```

## Contexto para IA

Topotino recuerda todo desde el eclipse y consulta la memoria de viaje persistente. Si falta `completado_amarante`, reconoce que no abrieron la ventana anterior y no atribuye deducciones que no hicieron. Al inicio conoce el plano firmado `TOP O LOCO` y el Cazarrisas; la firma aumenta la sospecha, pero no demuestra quién causó la amnesia. Tras `magikland_recuerdo_elegido`, sabe que el aparato graba qué observan, qué eligen y qué recuerdan después; detecta la firma de un segundo parque y recibe a Topotina. No la recuerda, pero acepta como hecho nuevo que afirma ser su hermana y diseñó el mapa. Tras `curia_paisaje_razonado`, sabe qué partes de 1922 y qué elemento moderno identificaron en el Hotel do Parque. Tras `curia_quietud_observada`, recupera solo la sensación de haberse reído con ellos en Londres y ve aclararse la tercera ventana. Conversa a nivel intelectual aproximado de diez años con frases concretas: nombra el objeto, la acción y el resultado, y define cualquier término técnico con un ejemplo. El Cuaderno es privado. No pide agua de atracciones, piscinas o lago. No conoce el museo, Granada ni los doce leones. Al cerrar conduce mediante una imagen precisa del bosque y pide descanso.

## Fuentes documentales

- https://magikland.pt/areas-tematicas/
- https://magikland.pt/divertimentos-e-piscinas/
- https://magikland.pt/informacoes-uteis/
- https://www.cm-anadia.pt/visitar/alojamento/hoteis/poi/hotel-do-parque
- https://www.booking.com/hotel/pt/do-parque-anadia.en-gb.html
