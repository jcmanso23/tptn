---
{
  "id": "006-magikland-curia",
  "order": 6,
  "title": "Día 2 · El agua que ríe",
  "channelCode": "T-26R8",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "anyFlags": ["completado_amarante", "completado_guimaraes"],
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

Es 14 de agosto. El día se divide deliberadamente en dos ritmos: movimiento, juego y sorpresa en Magikland; quietud, escucha y reflejos al llegar a Curia o a otro lugar de descanso.

Magikland tiene seis áreas temáticas y atracciones con movimientos diversos. La prueba no depende de montar en ninguna, porque puede haber cierres, límites de altura, miedo o cansancio. Observar desde una zona permitida vale lo mismo que subir. Topoloco ha añadido un Cazarrisas Hidráulico a su aspirador porque cree que puede separar una risa del recuerdo que la causó.

Curia ofrece lago, pontes, jardines y, cuando funcionan, embarcaciones de pedales. Ningún elemento concreto es obligatorio. El capítulo debe poder cerrarse en el hotel, ante un vaso de agua potable, una piscina observada desde una zona segura o una ventana con lluvia.

Todavía no se revela que Topoloco necesita que Paula y Hugo despierten las memorias. El cierre deja una pista sensorial hacia un bosque, sin nombrar Buçaco.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Alerta de bigotes. El plano de Topoloco se ha desplegado solo y ahora mi túnel contiene África, un mundo de confusión, una aldea medieval, piratas, el Far-West y un zoco. Todo a la vez. Casi piso un barco dibujado." },
  { "from": "topotino", "time": "auto", "text": "En el margen pone: «Cazarrisas Hidráulico listo. Capturar la alegría antes de que los niños la recuerden». Si reconocéis el lugar de esos seis mundos, escribid su nombre." }
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
      { "from": "topotino", "time": "auto", "text": "Magikland. El escondite perfecto para una máquina que se alimenta de movimiento." },
      { "from": "topotino", "time": "auto", "text": "Hoy no quiero nombres de atracciones ni una lista de deberes. Buscad tres movimientos distintos. Por ejemplo: algo que gire, algo que suba y baje, algo que se balancee, corra, vuele o salpique." },
      { "from": "topotino", "time": "auto", "text": "Podéis vivirlos u observarlos desde un lugar permitido. Nadie tiene que montar donde no quiera. Cuando tengáis tres, enviadme tres verbos y decid cuál eligió Paula, cuál Hugo y cuál visteis juntos." }
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
      { "from": "topotino", "time": "auto", "text": "Tres movimientos distintos: señal completa. El agua no recuerda igual cuando cae, gira o salpica. Vosotros acabáis de enseñárselo." },
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
      { "from": "topotino", "time": "auto", "text": "Guardado. Eso es justo lo que Topoloco no comprende: una risa sin el momento que la provocó solo es ruido dentro de una botella." },
      { "from": "topotino", "time": "auto", "text": "Aún falta comprobar una cosa. Después de tanto movimiento, el agua debe saber detenerse para recordar. Cuando lleguéis a Curia, escribid CURIA. Si cambia el plan, escribid DESCANSO cuando encontréis cualquier lugar tranquilo." }
    ]
  },
  {
    "id": "curia-llegada",
    "requiredFlags": ["magikland_recuerdo_elegido"],
    "blockedFlags": ["curia_llegada"],
    "match": ["curia", "hemos llegado a curia", "estamos en curia", "descanso", "pausa"],
    "setFlags": ["curia_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Cambio de ritmo. En Curia hay un lago, pontes y jardines; pero si es tarde o está cerrado, servirá la piscina vista desde un sitio seguro, la lluvia en una ventana o incluso un vaso de agua potable." },
      { "from": "topotino", "time": "auto", "text": "Quedaos veinte segundos en silencio junto a los adultos. Uno buscará un reflejo o algo quieto. El otro escuchará un sonido pequeño que antes habría pasado desapercibido." },
      { "from": "topotino", "time": "auto", "text": "Después escribid una sola frase que incluya «OÍMOS...» y «VIMOS...». No toquéis ni recojáis agua del lago o de la piscina." }
    ]
  },
  {
    "id": "curia-quietud-completada",
    "requiredFlags": ["curia_llegada"],
    "blockedFlags": ["completado_magikland_curia"],
    "openAnswer": true,
    "minWords": 4,
    "containsAll": ["oimos", "vimos"],
    "rejectContainsAny": ["nada", "no se", "ni idea"],
    "setFlags": ["completado_magikland_curia"],
    "water": "Agua de la Risa",
    "formulaWord": "RIO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Comprobado: el agua puede moverse, reír y después quedarse quieta sin perder lo vivido. Ahí nace el Agua de la Risa." },
      { "from": "topotino", "time": "auto", "text": "Su palabra es RÍO. Tiene dos caras: un río corre por la tierra... y yo río cuando algo me hace feliz. Topoloco buscaba una sola y se le escaparon las dos." },
      { "from": "topotino", "time": "auto", "text": "No uséis agua del parque, del lago ni de la piscina. Tres gotas de agua potable bastan; también sirve dejar vuestra frase guardada aquí." },
      { "from": "topotino", "time": "auto", "text": "Del Cazarrisas roto ha salido olor a musgo, piedra fría y hojas empapadas. En su filtro hay una nota: «próximo intento, donde el bosque bebe del cielo». Descansad. Mañana necesitaremos oídos de bosque." }
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
  "Para la última señal necesito las dos partes: «OÍMOS...» y «VIMOS...»."
]
```

## Pistas progresivas

```json
[
  "El nombre del parque empieza por MAGIK...",
  "Podéis observar tres movimientos sin montar en ninguna atracción.",
  "Si Curia no encaja hoy, escribid DESCANSO y haced la prueba en cualquier lugar tranquilo y seguro.",
  "Durante veinte segundos: una persona escucha y otra busca un reflejo. Después juntad las dos observaciones."
]
```

## Contexto para IA

Topotino propone experiencias flexibles y seguras. Puede mencionar las seis áreas temáticas de Magikland y movimientos de sus atracciones, pero no exige subir a ninguna ni da por hecho que estén abiertas. Acepta que observar sea la participación elegida. En Curia puede hablar del lago, las pontes, jardines, casa de té y pequeñas embarcaciones si están operativas, pero nunca convierte esos elementos en requisito. Si cambia el plan, adapta la quietud a cualquier agua potable o lugar de descanso. No pide recoger agua de atracciones, piscinas o lago. No revela Buçaco por su nombre, Granada, los doce leones ni que Topoloco necesita a Paula y Hugo.

## Fuentes documentales

- https://magikland.pt/areas-tematicas/
- https://magikland.pt/divertimentos-e-piscinas/
- https://magikland.pt/informacoes-uteis/
- https://www.cm-anadia.pt/visitar/locais-a-visitar/patrimonio-natural/poi/parque-da-curia
