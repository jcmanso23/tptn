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
    "time": { "from": "09:00", "to": "23:59" }
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

Es 14 de agosto. Topotino recuerda todo lo ocurrido después del eclipse, incluido Amarante y el Diario de las Dos Memorias, pero todavía no recuerda las aventuras anteriores. El día se divide deliberadamente en dos ritmos: movimiento, juego y sorpresa en Magikland; quietud, escucha y reflejos al llegar a Curia o a otro lugar de descanso.

Magikland tiene seis áreas temáticas y atracciones con movimientos diversos. Topotino encuentra un aparato rotulado «Cazarrisas Hidráulico», pero no sabe qué captura ni para qué lo construyó Topoloco. La prueba principal consiste en localizar movimientos y vivir el parque. Las adaptaciones solo se ofrecen después de que los niños expresen un cierre, miedo, cansancio u otro obstáculo.

Curia ofrece lago, pontes, jardines y, cuando funcionan, embarcaciones de pedales. La ruta principal conduce al lago. Si el plan cambia o el parque no resulta posible, Topotino adapta entonces la misma prueba de quietud al lugar real en el que esté la familia.

La experiencia demuestra que el Cazarrisas captura ruido, pero solo reacciona de verdad cuando Paula y Hugo dan significado a un momento compartido. En Curia, la quietud devuelve a Topotino una sensación de Londres: no los hechos completos, sino la certeza de haberse reído con ellos. El diario conserva dos versiones del mismo momento. Todavía no se revela que Topoloco necesita que Paula y Hugo despierten las memorias. El cierre deja una pista sensorial hacia un bosque, sin nombrar Buçaco, y pide descansar hasta el día siguiente.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Alerta de bigotes. Ha aparecido un plano de Topoloco y, al desplegarlo, mi túnel se ha llenado de África, un mundo de confusión, una aldea medieval, piratas, el Far-West y un zoco. Todo a la vez. Casi piso un barco dibujado." },
  { "from": "topotino", "time": "auto", "text": "En el margen pone «Cazarrisas Hidráulico» y nada más. No sé qué captura ni por qué. Si reconocéis el lugar de esos seis mundos, escribid su nombre." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "magikland-identificado",
    "blockedFlags": ["magikland_identificado"],
    "match": ["magikland", "es magikland", "estamos en magikland", "vamos a magikland"],
    "setFlags": ["magikland_identificado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Magikland encaja con los seis mundos. El escondite perfecto para una máquina que se alimenta de movimiento." },
      { "from": "topotino", "time": "auto", "text": "Hoy no quiero nombres de atracciones ni una lista de deberes. Buscad tres movimientos distintos. Por ejemplo: algo que gire, algo que suba y baje, algo que se balancee, corra, vuele o salpique." },
      { "from": "topotino", "time": "auto", "text": "Cuando tengáis tres, enviadme tres verbos y decid cuál eligió Paula, cuál Hugo y cuál encontrasteis juntos." }
    ]
  },
  {
    "id": "magikland-alternativa-cierre",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "containsAny": ["esta cerrado", "está cerrado", "han cerrado", "atraccion cerrada", "atracción cerrada", "no funciona", "no podemos entrar"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces esa atracción queda fuera, sin discusión. Desde una zona permitida buscad tres movimientos que sí estén ocurriendo —en otras atracciones, en el agua o en la gente que pasa— y enviadme solo los tres verbos." }
    ]
  },
  {
    "id": "magikland-alternativa-miedo",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "containsAny": ["me da miedo", "nos da miedo", "no quiero montar", "no queremos montar", "demasiado alto", "no me atrevo"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No tenéis que subir ahí. Elegid otro movimiento que os apetezca vivir y completad los demás observando desde el camino. La valentía también sabe decir «eso no»." }
    ]
  },
  {
    "id": "magikland-alternativa-cansancio",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "containsAny": ["estamos cansados", "estoy cansado", "estoy cansada", "nos duelen los pies", "queremos descansar"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Parad y descansad. Desde donde estáis, recordad tres movimientos que ya hayáis visto hoy y convertidlos en tres verbos. No hace falta dar ni un paso más." }
    ]
  },
  {
    "id": "magikland-alternativa-preguntar",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "match": ["no podemos", "no podemos hacerlo", "no podemos hacer la prueba", "no se puede"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entendido. Decidme qué ocurre exactamente y adaptaré esta prueba, no otra: ¿está cerrado, os da miedo, estáis cansados o ha pasado algo diferente?" }
    ]
  },
  {
    "id": "magikland-movimientos",
    "requiredFlags": ["magikland_identificado"],
    "blockedFlags": ["magikland_movimientos"],
    "openAnswer": true,
    "minWords": 3,
    "containsAny": ["gira", "girar", "sube", "subir", "baja", "bajar", "cae", "balancea", "balancear", "corre", "volar", "vuela", "salpica", "salpicar", "moja", "rueda", "rebota"],
    "rejectContainsAny": ["ninguno", "nada", "no se", "ni idea"],
    "setFlags": ["magikland_movimientos"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Tres movimientos distintos y además habéis distinguido quién descubrió cada uno. El Cazarrisas ha reaccionado de forma diferente, pero aún no entiendo qué mide." },
      { "from": "topotino", "time": "auto", "text": "El Cazarrisas de Topoloco también se ha activado, pero su primera grabación dice: «AAAAAA, PARAD ESTA COSA». Creo que ha archivado su propio grito." },
      { "from": "topotino", "time": "auto", "text": "Ahora elegid el momento más divertido, raro o inesperado del parque. No tiene que ser una atracción: puede ser una cara, una salpicadura, una espera o algo que os haya ocurrido juntos. Contádmelo con una frase." }
    ]
  },
  {
    "id": "magikland-recuerdo-elegido",
    "requiredFlags": ["magikland_movimientos"],
    "blockedFlags": ["magikland_recuerdo_elegido"],
    "openAnswer": true,
    "minWords": 5,
    "containsAny": ["risa", "reimos", "reímos", "divertido", "gracioso", "momento", "cuando", "mojamos", "salpicadura", "cara", "atraccion", "atracción", "parque", "espera", "juntos", "hugo", "paula"],
    "rejectContainsAny": ["nada", "ninguno", "no se", "ni idea", "lo que sea"],
    "setFlags": ["magikland_recuerdo_elegido"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias por contarlo con un detalle real. El aparato ha reaccionado con fuerza al significado de ese recuerdo, no solo al ruido o a la palabra «risa». Eso es nuevo. Y bastante inquietante." },
      { "from": "topotino", "time": "auto", "text": "Me falta comprobar qué ocurre después de tanto movimiento. Cuando lleguéis a Curia, escribid CURIA." }
    ]
  },
  {
    "id": "curia-alternativa-cambio-plan",
    "requiredFlags": ["magikland_recuerdo_elegido"],
    "blockedFlags": ["curia_llegada"],
    "containsAny": ["no vamos a curia", "no iremos a curia", "hemos cambiado el plan", "cambio de plan", "no podemos ir a curia"],
    "setFlags": ["curia_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Cambio anotado. La señal no necesita ese nombre: necesita que paséis del movimiento a la quietud. Cuando lleguéis al lugar real donde vais a descansar, colocad un vaso de agua potable sobre una mesa, guardad veinte segundos de silencio y decidme después qué OÍMOS y qué VIMOS." }
    ]
  },
  {
    "id": "curia-alternativa-cansancio-previo",
    "requiredFlags": ["magikland_recuerdo_elegido"],
    "blockedFlags": ["curia_llegada"],
    "containsAny": ["estamos muy cansados", "no podemos mas", "no podemos más", "queremos ir al hotel", "nos vamos al hotel"],
    "setFlags": ["curia_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces al hotel. Cuando estéis descansando, dejad un vaso de agua potable quieto sobre una mesa, escuchad veinte segundos y decidme después qué OÍMOS y qué VIMOS. La prueba no vale más que vuestro descanso." }
    ]
  },
  {
    "id": "curia-llegada",
    "requiredFlags": ["magikland_recuerdo_elegido"],
    "blockedFlags": ["curia_llegada"],
    "match": ["curia", "hemos llegado a curia", "estamos en curia"],
    "setFlags": ["curia_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Cambio de ritmo. Buscad el lago de Curia y quedaos en un punto seguro del paseo, siempre junto a los adultos." },
      { "from": "topotino", "time": "auto", "text": "Quedaos veinte segundos en silencio junto a los adultos. Uno buscará un reflejo o algo quieto. El otro escuchará un sonido pequeño que antes habría pasado desapercibido." },
      { "from": "topotino", "time": "auto", "text": "Después escribid una sola frase que incluya «OÍMOS...» y «VIMOS...». No toquéis ni recojáis agua del lago o de la piscina." }
    ]
  },
  {
    "id": "curia-alternativa-lluvia",
    "requiredFlags": ["curia_llegada"],
    "blockedFlags": ["completado_magikland_curia"],
    "rejectContainsAny": ["oimos", "oímos", "vimos"],
    "containsAny": ["llueve", "esta lloviendo", "está lloviendo", "tormenta"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No salgáis por la prueba. Hacedla desde una ventana: durante veinte segundos, uno escucha la lluvia y el otro busca un reflejo en el cristal. Luego juntadlo en «OÍMOS...» y «VIMOS...»." }
    ]
  },
  {
    "id": "curia-alternativa-cierre",
    "requiredFlags": ["curia_llegada"],
    "blockedFlags": ["completado_magikland_curia"],
    "rejectContainsAny": ["oimos", "oímos", "vimos"],
    "containsAny": ["parque cerrado", "esta cerrado", "está cerrado", "no podemos entrar", "ya es tarde"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No entréis. Volved al alojamiento y colocad un vaso de agua potable quieto sobre una mesa. Veinte segundos: uno escucha, otro busca un reflejo. Después escribid «OÍMOS...» y «VIMOS...»." }
    ]
  },
  {
    "id": "curia-alternativa-cansancio",
    "requiredFlags": ["curia_llegada"],
    "blockedFlags": ["completado_magikland_curia"],
    "rejectContainsAny": ["oimos", "oímos", "vimos"],
    "containsAny": ["estamos cansados", "estoy cansado", "estoy cansada", "queremos descansar"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces la prueba se hace sentados donde descanséis. Mirad durante veinte segundos un vaso de agua potable y escuchad el sonido más pequeño del lugar. Después escribid «OÍMOS...» y «VIMOS...»." }
    ]
  },
  {
    "id": "curia-quietud-observada",
    "requiredFlags": ["curia_llegada"],
    "blockedFlags": ["curia_quietud_observada"],
    "openAnswer": true,
    "minWords": 4,
    "containsAll": ["oimos", "vimos"],
    "rejectContainsAny": ["nada", "no se", "ni idea"],
    "setFlags": ["curia_quietud_observada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Después de todo el ruido habéis encontrado un sonido pequeño y un reflejo quieto. El Cazarrisas no sabe qué hacer con el silencio, pero mi memoria sí." },
      { "from": "topotino", "time": "auto", "text": "He recordado una sensación de Londres: los tres nos reíamos porque algo había salido rematadamente mal. No veo todavía dónde estábamos ni qué ocurrió. Pero recuerdo cómo era reírme con vosotros, y eso estaba dentro de mí aunque no supiera encontrarlo." },
      { "from": "topotino", "time": "auto", "text": "Abrid el Diario de las Dos Memorias. Paula escribirá o dibujará qué parte del momento divertido de hoy conservaría; Hugo guardará otra. Después decidme brevemente qué dos cosas habéis anotado." }
    ]
  },
  {
    "id": "curia-diario-guardado",
    "requiredFlags": ["curia_quietud_observada"],
    "blockedFlags": ["completado_magikland_curia"],
    "openAnswer": true,
    "minWords": 5,
    "containsAny": ["diario", "escrito", "dibujado", "paula", "hugo", "recordar", "recuerdo", "risa", "divertido", "momento"],
    "rejectContainsAny": ["nada", "no se", "ni idea", "lo que sea"],
    "setFlags": ["diario_magikland_curia", "completado_magikland_curia"],
    "water": "Agua de la Risa",
    "formulaWord": "RIO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Dos detalles distintos y una sola experiencia compartida. El agua quieta ha conservado la risa sin convertirla en una copia: acaba de despertar el Agua de la Risa." },
      { "from": "topotino", "time": "auto", "text": "No uséis agua del parque, del lago ni de la piscina. El diario ya guarda lo importante. El Cazarrisas reacciona a recuerdos vividos, pero todavía no sé qué quiere hacer esa figura con ellos." },
      { "from": "topotino", "time": "auto", "text": "Del filtro ha salido olor a musgo, piedra fría y hojas empapadas, junto a una nota: «donde el bosque bebe del cielo». Esa será la ruta de mañana." },
      { "from": "topotino", "time": "auto", "text": "Por hoy se acabó. Habéis jugado, observado y me habéis devuelto una emoción. Cenad y descansad. Mañana necesitaremos ojos despiertos y oídos de bosque." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Buscad el nombre del parque que reúne seis mundos: África, confusión, medievo, piratas, Far-West y zoco.",
  "No necesito nombres de atracciones. Dadme verbos de movimiento: girar, subir, bajar, balancearse, correr o salpicar.",
  "Elegid un momento real que os haya hecho reír o sorprenderos. Una frase sencilla vale.",
  "Para la señal de Curia necesito las dos partes: «OÍMOS...» y «VIMOS...».",
  "En el diario guardad dos detalles distintos del mismo momento divertido y contadme cuáles son."
]
```

## Pistas progresivas

```json
[
  "El nombre del parque empieza por MAGIK...",
  "Buscad tres acciones distintas y convertidlas en verbos.",
  "Cuando lleguéis al siguiente lugar, la señal está esperando la palabra CURIA.",
  "Durante veinte segundos: una persona escucha y otra busca un reflejo. Después juntad las dos observaciones.",
  "La última parte no es una contraseña: son dos recuerdos breves, uno de Paula y otro de Hugo, guardados en el diario."
]
```

## Contexto para IA

Topotino recuerda todo desde el eclipse: la amnesia, la placa, el diario, Amarante, el Agua del Puente y la escena parcial de la figura junto a una máquina. Sigue sin recordar Londres ni su investigación completa. Al inicio sabe que el plano representa Magikland y que existe un Cazarrisas Hidráulico. Después de `magikland_movimientos` sabe que reacciona de forma distinta a los movimientos; después de `magikland_recuerdo_elegido` sabe que responde con más fuerza al significado de un recuerdo real; después de `curia_quietud_observada` ha recuperado únicamente la sensación de haberse reído con Paula y Hugo en Londres, no el lugar ni el suceso. Entonces pide dos versiones breves en el Diario de las Dos Memorias. Después de `completado_magikland_curia` sabe que despertó el Agua de la Risa y que el aparato parece interesado en recuerdos vividos, pero no conoce el museo, el motivo, el número ni que Topoloco necesita a los niños. Agradece de forma concreta cada observación válida. Presenta la prueba principal sin anticipar cierres, miedo, cansancio o cambios; adapta solo ante el impedimento comunicado. Puede enseñar las seis áreas temáticas y, ya en Curia, el lago, las pontes y jardines. No pide agua de atracciones, piscinas o lago. Al cerrar conduce mediante la pista del bosque y pide descanso. No revela Buçaco por su nombre, Granada ni los doce leones.

## Fuentes documentales

- https://magikland.pt/areas-tematicas/
- https://magikland.pt/divertimentos-e-piscinas/
- https://magikland.pt/informacoes-uteis/
- https://www.cm-anadia.pt/visitar/locais-a-visitar/patrimonio-natural/poi/parque-da-curia
