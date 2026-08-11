---
{
  "id": "006-magikland-curia",
  "order": 6,
  "title": "Día 2 · La risa que Topotino había olvidado",
  "channelCode": "T-26R8",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "date": { "on": "2026-08-14" },
    "location": { "lat": 41.1990981, "lng": -8.2800010, "radiusMeters": 5000, "label": "Magikland, Penafiel" }
  },
  "mission": "El agua que ríe",
  "formulaWord": "RIO",
  "water": "Agua de la Risa",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Es 14 de agosto. La jornada contrapone movimiento y quietud, pero no mediante una lista simple. Magikland funciona como laboratorio de mecánica: Paula y Hugo identifican tipos de movimiento, hacen una predicción causal y distinguen ruido, emoción y recuerdo. En Curia analizan un paisaje construido, naturaleza y reflejos. Las pruebas tienen una exigencia intelectual aproximada de diez años y necesitan observación física. La llegada a Magikland abre el capítulo, pero la ubicación nunca valida las respuestas.

Magikland se divide en África, Mundo da Confusão, Aldeia Medieval, Refúgio dos Piratas, Far-West y Souk. Ofrece rotaciones, oscilaciones, desplazamientos, subidas, bajadas y recorridos de agua. Ninguna fase exige montar en una atracción concreta. Topoloco ha dejado un Cazarrisas Hidráulico que intenta separar el sonido de una risa, la causa y el recuerdo que deja. Su primer fracaso registra su propio grito, pero el segundo le permite aprender que Paula y Hugo despiertan memorias al interpretar lo vivido.

En Curia duermen, pero la investigación se centra en el Hotel do Parque: un edificio de 1922 restaurado como hotel, con decoración clásica, suelos de madera, patio, piscina y jardín. La prueba distingue huellas de su época original de las adaptaciones y usos actuales; después conserva el experimento de reflejo en el jardín, la piscina, una ventana o agua potable.

El Cuaderno de la Memoria continúa privado. Topotino no pide que cuenten qué escriben o dibujan. La palabra técnica `RIO` y la flag antigua `diario_magikland_curia` se conservan silenciosamente. Al cerrar despierta el Agua de la Risa, aparece una pista sensorial hacia Buçaco y Topotino pide descanso.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Antes de salir: bañador, toalla, protector solar, agua para beber y calzado cómodo. Hay zonas de agua, aunque ninguna prueba obliga a usarlas." },
  { "from": "topotino", "time": "auto", "requiredFlags": ["completado_amarante"], "text": "Alerta de bigotes. El plano de seis mundos que salió de la máquina de Amarante se ha desplegado otra vez: África, confusión, una aldea medieval, piratas, Far-West y un zoco." },
  { "from": "topotino", "time": "auto", "blockedFlags": ["completado_amarante"], "text": "La señal de ayer quedó incompleta y no voy a inventar un Agua del Puente que no despertamos. Esta mañana ha aparecido, por otra vía, un plano firmado «TOP O LOCO»: África, confusión, una aldea medieval, piratas, Far-West y un zoco. Continuaremos desde la evidencia que sí tenemos." },
  { "from": "topotino", "time": "auto", "text": "En el margen pone «Cazarrisas Hidráulico» y aparece el mismo sello «TOP O LOCO» de la placa. Eso relaciona el nombre con la máquina, pero no demuestra quién atacó mi memoria. Identificad primero el lugar donde conviven esos seis mundos y enviadme el nombre con una razón que descarte que sea una ciudad normal." }
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
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis clasificado mecanismos distintos y defendido dónde se aprecia mejor el cambio de dirección. El Cazarrisas ha registrado trayectorias, pero todavía confunde movimiento con emoción." },
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
      { "from": "topotino", "time": "auto", "text": "Tercera investigación. Elegid un momento real del parque y separad tres capas: qué sonido o movimiento ocurrió, qué lo causó y por qué podría convertirse en un recuerdo dentro de varios años. No busco el momento más ruidoso, sino el más significativo." }
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
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis separado el fenómeno, su causa y el significado. El aparato reacciona al significado del recuerdo, no a sus decibelios. Acaba de imprimir «MUESTRA VÁLIDA · AJUSTAR SIGUIENTE CAPTURA». Topoloco no solo estaba midiendo el parque: está aprendiendo de cómo razonáis." },
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
      { "from": "topotino", "time": "auto", "text": "Empezad fuera: buscad en la fachada dos señales de su época original. Después entrad con los adultos y elegid otra en la madera o la decoración." },
      { "from": "topotino", "time": "auto", "text": "Terminaremos en el jardín o el patio. Buscad allí una adaptación actual y explicad cómo distinguís las capas." }
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
      { "from": "topotino", "time": "auto", "text": "Bien razonado. El edificio no está congelado en 1922: conserva señales antiguas mientras incorpora usos nuevos. Una memoria fiable funciona igual; no borra lo anterior, pero admite capas posteriores." },
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
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis distinguido objeto, reflejo y punto de vista, y además habéis detectado un sonido que el ruido del parque ocultaba. El Cazarrisas registra volumen; vosotros habéis explicado experiencia." },
      { "from": "topotino", "time": "auto", "text": "He recordado una sensación de Londres: los tres nos reíamos porque algo había salido rematadamente mal. No veo dónde estábamos ni qué ocurrió, pero recuerdo cómo era reírme con vosotros. No completaré el hueco con una invención." },
      { "from": "topotino", "time": "auto", "text": "El Agua de la Risa acaba de despertar. No uséis agua del parque, del lago ni de la piscina. Lo importante no era guardar líquido, sino comprender por qué un momento se convierte en recuerdo." },
      { "from": "topotino", "time": "auto", "text": "Del filtro ha salido olor a musgo, piedra fría y hojas empapadas, junto a una nota: «donde el bosque bebe del cielo». Esa será la ruta de mañana." },
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

Topotino recuerda todo desde el eclipse y consulta la memoria de viaje persistente de respuestas del comunicador. Si falta `completado_amarante`, usa la rama de recuperación: reconoce que no despertaron el Agua del Puente y no atribuye a Paula y Hugo deducciones que no hicieron. Al inicio solo conoce el plano firmado `TOP O LOCO` y el rótulo Cazarrisas Hidráulico; la firma aumenta la sospecha, pero no demuestra todavía quién causó la amnesia. Tras `magikland_movimientos`, sabe qué mecanismos clasificaron y cómo justificaron el cambio de dirección. Tras `magikland_prediccion_movimiento`, recuerda su predicción y corrección. Tras `magikland_recuerdo_elegido`, recuerda el fenómeno, causa y significado del momento elegido. Tras `curia_paisaje_razonado`, sabe qué huellas de 1922 y qué adaptación actual identificaron en el Hotel do Parque. Tras `curia_quietud_observada`, recuerda su razonamiento sobre objeto, reflejo, observador y sonido; entonces recupera solo la sensación de haberse reído con ellos en Londres. Conversa a nivel intelectual aproximado de diez años con ambos. Puede pedir razones, señalar una contradicción y aceptar que lo corrijan. No simplifica por la edad de Hugo. El Cuaderno de la Memoria es privado: no pide, conoce ni inventa su contenido. Presenta la prueba principal antes de adaptar y solo cambia la evidencia ante el impedimento comunicado. No pide agua de atracciones, piscinas o lago. Después de `completado_magikland_curia`, sabe que despertó el Agua de la Risa y que Topoloco aprendió algo de sus respuestas, pero no conoce el museo, el número de aguas ni que necesita a los niños. Al cerrar conduce mediante la pista del bosque y pide descanso. No revela Buçaco por su nombre, Granada ni los doce leones.

## Fuentes documentales

- https://magikland.pt/areas-tematicas/
- https://magikland.pt/divertimentos-e-piscinas/
- https://magikland.pt/informacoes-uteis/
- https://www.cm-anadia.pt/visitar/alojamento/hoteis/poi/hotel-do-parque
- https://www.booking.com/hotel/pt/do-parque-anadia.en-gb.html
