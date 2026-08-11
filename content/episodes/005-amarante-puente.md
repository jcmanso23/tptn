---
{
  "id": "005-amarante-puente",
  "order": 5,
  "title": "Día 1 · El puente entre dos memorias",
  "channelCode": "T-19B4",
  "startsUnlocked": false,
  "activation": {
    "dateTime": {
      "from": "2026-08-13T17:00:00+02:00",
      "to": "2026-08-13T23:59:59+02:00"
    }
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

Es el 13 de agosto. Paula y Hugo llegan a Amarante. El capítulo exige tres investigaciones diferentes y enlazadas: inventario arquitectónico, razonamiento estratégico sobre el paisaje y clasificación de fuentes históricas. Las respuestas se diseñan con una exigencia aproximada de diez años para ambos. Ninguna fase depende de geolocalización; la evidencia necesaria está en la ponte, el Tâmega y el conjunto de São Gonçalo.

La ponte actual mide unos cincuenta metros y tiene cuatro balcones semicirculares. La antigua cayó tras las lluvias de 1763. La tradición atribuye a São Gonçalo la construcción de una ponte anterior, el movimiento de grandes piedras y la ayuda de peces para alimentar a quienes trabajaban. La ponte actual fue un paso estratégico durante la resistencia de 1809, que duró catorce días.

La señal detecta un fragmento metálico con `...REFL...`. Topotino no sabe que pertenece al Aspirador Portátil de Reflejos ni que Topoloco lo dejó para comprobar si Paula y Hugo despertaban memoria. Cuando relacionan forma, lugar, historia y experiencia, el Agua del Puente devuelve una escena parcial: una figura de espaldas sostiene que nadie puede acusarla de robar algo intangible. Topotino recupera su propia conclusión: «No quiere el agua. Quiere lo que el agua recuerda».

El Cuaderno de la Memoria continúa siendo privado. Topotino no pide una entrada, una foto ni una explicación de sus páginas. La palabra técnica `COMIENZO` y las flags antiguas con `diario` se conservan silenciosamente por compatibilidad. Nunca se recoge agua del río. Al terminar aparece una pista hacia Magikland y Topotino pide descanso.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "requiredFlags": ["amarante_previa_identificada"], "text": "La placa se ha encendido: habéis llegado al lugar que dedujisteis. Gracias por traerme hasta aquí aunque yo fuera quien dejó el mapa. Esta frase resulta incómoda, pero verdadera." },
  { "from": "topotino", "time": "auto", "blockedFlags": ["amarante_previa_identificada"], "text": "La señal anterior se cortó antes de que resolviéramos la placa. No voy a fingir que lo hicimos: durante la noche apareció el nombre AMARANTE junto al Tâmega y la ponte de São Gonçalo. Nos falta esa deducción, pero podemos investigar la evidencia real desde aquí." },
  { "from": "topotino", "time": "auto", "text": "Mis topos han detectado un fragmento de máquina. Solo se leen cinco letras: «...REFL...». Puede ser reflejo, reflector o reflejante. Reflejante no existe. Ya hemos descartado una hipótesis." },
  { "from": "topotino", "time": "auto", "text": "Primera investigación. Mirad la Ponte de São Gonçalo desde un lugar seguro y sin acercaros a los bordes. Contad sus balcones semicirculares y elegid además un detalle construido —arco, piedra, figura, ventana u obelisco— que ayude a reconocer esta ponte y no otra. Decidme el número, el detalle y por qué lo habéis elegido." }
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
    "minWords": 9,
    "containsAnyGroups": [["cuatro", "4"], ["balcón", "balcon", "balcones", "balcões"], ["arco", "arcos", "piedra", "pedra", "figura", "ventana", "janela", "obelisco", "iglesia", "igreja", "torre"], ["porque", "identifica", "reconocer", "distingue", "característico", "caracteristico"]],
    "rejectContainsAny": ["no se", "ni idea", "da igual", "lo que sea"],
    "setFlags": ["amarante_puente_observado"],
    "remember": { "kind": "field_observation", "label": "Inventario físico de la Ponte de São Gonçalo" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Cuatro balcones semicirculares y un segundo rasgo elegido con motivo: ya no me habéis dado una foto genérica, sino una identificación razonada de esta ponte." },
      { "from": "topotino", "time": "auto", "text": "Segunda investigación. Mirad el Tâmega, las dos orillas y por dónde continúa la ciudad. En 1809 este paso fue defendido durante catorce días. Sin buscar una fecha —ya os la he dado—, explicad por qué controlar esta ponte podía ser estratégicamente importante. Usad al menos dos evidencias del paisaje que tenéis delante." }
    ]
  },
  {
    "id": "amarante-posicion-estrategica",
    "requiredFlags": ["amarante_puente_observado"],
    "blockedFlags": ["amarante_posicion_razonada"],
    "openAnswer": true,
    "minWords": 10,
    "containsAnyGroups": [["río", "rio", "tâmega", "tamega"], ["orillas", "ciudad", "calles", "camino", "ruta", "entrada", "salida"], ["cruzar", "cruce", "paso", "defender", "controlar", "puente", "ponte"], ["porque", "permite", "impide", "obliga", "conecta", "separa"]],
    "rejectContainsAny": ["porque si", "porque sí", "no se", "ni idea", "da igual"],
    "setFlags": ["amarante_posicion_razonada"],
    "remember": { "kind": "reasoning", "label": "Hipótesis sobre la importancia estratégica de la ponte" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Buena inferencia. Habéis usado el río y la conexión entre orillas para explicar el valor del paso; eso es leer historia en el terreno, no repetir una fecha." },
      { "from": "topotino", "time": "auto", "text": "Tercera investigación: separar clases de verdad. La tradición cuenta que São Gonçalo movió enormes piedras y que unos peces alimentaron a quienes levantaban una ponte anterior. Los registros sitúan la caída de aquella ponte tras las lluvias de 1763 y la resistencia de la actual durante catorce días en 1809." },
      { "from": "topotino", "time": "auto", "text": "Clasificad las cuatro afirmaciones: cuáles pertenecen a la tradición y cuáles están documentadas históricamente. Después decidme por qué una tradición puede tener valor aunque no funcione como una prueba documental." }
    ]
  },
  {
    "id": "amarante-historia-comprendida",
    "requiredFlags": ["amarante_posicion_razonada"],
    "blockedFlags": ["completado_amarante"],
    "openAnswer": true,
    "minWords": 9,
    "containsAnyGroups": [["tradición", "tradicion", "leyenda"], ["1763"], ["1809"], ["valor", "cultura", "identidad", "memoria", "enseña", "explica", "historia"]],
    "rejectContainsAny": ["todo es verdad", "todo es mentira", "no se", "ni idea"],
    "setFlags": ["amarante_historia_comprendida", "diario_amarante", "completado_amarante"],
    "remember": { "kind": "source_reasoning", "label": "Distinción entre tradición, documento y valor cultural en Amarante" },
    "water": "Agua del Puente",
    "formulaWord": "COMIENZO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto. Habéis distinguido tradición, registro y valor cultural sin declarar que una leyenda es inútil ni que equivale a un documento. Esa diferencia será importante más adelante." },
      { "from": "topotino", "time": "auto", "text": "El fragmento «...REFL...» ha respondido. El Agua del Puente acaba de despertar. No recojáis agua del Tâmega: la memoria está en la relación que habéis descubierto entre forma, paisaje e historia." },
      { "from": "topotino", "time": "auto", "text": "Estoy recordando una escena. Una figura de espaldas ajusta una máquina y dice: «Nadie puede acusarme de robar algo que no se puede tocar». No veo su cara. Después oigo mi propia voz: «No quiere el agua. Quiere lo que el agua recuerda». Eso es todo; no voy a fingir que sé más." },
      { "from": "topotino", "time": "auto", "text": "La máquina ha soltado un plano con seis mundos: África, confusión, una aldea medieval, piratas, Far-West y un zoco. También aparecen una rueda, un barco que se balancea y agua corriendo. Esa es nuestra siguiente ruta." },
      { "from": "topotino", "time": "auto", "text": "Por hoy basta. Habéis hecho inventario, leído el terreno y discutido qué cuenta como evidencia. Cenad y descansad. Mañana quiero investigadores despiertos, no dos croquetas con ojeras." }
    ]
  },
  {
    "id": "amarante-diario-guardado",
    "requiredFlags": ["amarante_historia_comprendida"],
    "blockedFlags": ["completado_amarante"],
    "openAnswer": true,
    "minWords": 1,
    "setFlags": ["diario_amarante", "completado_amarante"],
    "water": "Agua del Puente",
    "formulaWord": "COMIENZO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "La señal antigua se había quedado esperando una confirmación que ya no necesito. No voy a pediros el contenido del cuaderno. Doy por cerrada la investigación con lo que razonasteis sobre Amarante." },
      { "from": "topotino", "time": "auto", "text": "La siguiente ruta reúne África, confusión, medievo, piratas, Far-West y un zoco. Ahora descansad; continuaremos mañana." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "La primera respuesta necesita tres partes: cuántos balcones semicirculares veis, otro detalle construido y por qué identifica esta ponte.",
  "Para explicar su valor estratégico, usad dos evidencias visibles: el río, las orillas, el paso, la forma de cruzar o la relación con la ciudad.",
  "No preguntamos si la leyenda es bonita. Distinguimos qué procede de la tradición y qué está respaldado por fechas y registros; después explicamos para qué sirve cada clase de relato."
]
```

## Pistas progresivas

```json
[
  "Los balcones que buscamos sobresalen de la ponte con forma semicircular. El número es menor que cinco y mayor que tres.",
  "Imaginad que el río dificulta pasar de una orilla a otra. ¿Qué controla quien controla el paso más claro?",
  "Peces y piedras gigantes pertenecen al relato tradicional; 1763 y 1809 son fechas documentadas. Falta explicar por qué ambas clases de memoria importan sin confundirlas."
]
```

## Contexto para IA

Topotino conserva la amistad emocional con Paula y Hugo y recuerda todo desde el eclipse. El capítulo admite una rama normal y otra de recuperación: si falta `amarante_previa_identificada`, reconoce que la deducción de la placa quedó pendiente y no finge que ocurrió. No recuerda Londres, Luanco ni su investigación anterior. Al inicio solo sabe que apareció un fragmento `...REFL...`. Tras `amarante_puente_observado`, sabe que vieron cuatro balcones semicirculares y otro rasgo real, conservados en la memoria de viaje. Tras `amarante_posicion_razonada`, puede conversar sobre su hipótesis estratégica sin añadir hechos que no dijeron. Tras `amarante_historia_comprendida`, sabe que distinguieron tradición, documento y valor cultural; la fase guiada completa el capítulo. Tras `completado_amarante`, sabe que despertó el Agua del Puente y recuerda únicamente la escena autorizada de la figura de espaldas. No identifica con certeza a Topoloco. Conversa con ambos a nivel intelectual aproximado de diez años: pide evidencias, permite desacuerdo y no simplifica por la edad de Hugo. El Cuaderno de la Memoria es privado y no pregunta qué contiene. Puede sugerir que conserven algo por iniciativa propia, pero nunca exige una entrada ni una confirmación. Agradece razonamientos concretos. No revela el museo, las doce aguas, Granada, los leones ni que los niños son necesarios. Al cerrar usa únicamente el plano de seis mundos y pide descanso. Nunca pide agua del río.

## Fuentes documentales

- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
- https://www.cm-amarante.pt/amarante-evoca-a-defesa-da-ponte-com-programa-cultural-e-evocativo-no-dia-2-de-maio/
