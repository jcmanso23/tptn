---
{
  "id": "005-amarante-puente",
  "order": 5,
  "title": "Día 1 · El puente entre dos memorias",
  "channelCode": "T-19B4",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["amarante_previa_identificada"],
    "dateTime": { "from": "2026-08-13T17:00:00+02:00" }
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

Es el 13 de agosto. Paula y Hugo llegan a la ciudad descubierta en la placa. El capítulo combina tres experiencias: observar un detalle capaz de guardar historia, distinguir tradición de hechos documentados y conservar dos versiones del comienzo del viaje en el Cuaderno de la Memoria.

La señal detecta un fragmento metálico con `...REFL...`. Topotino no sabe que pertenece al Aspirador Portátil de Reflejos ni que Topoloco lo dejó en parte para comprobar si los niños despertaban la memoria.

Cuando Paula y Hugo relacionan lugar, historia y experiencia, el Agua del Puente devuelve a Topotino una escena parcial: vio a una figura de espaldas trabajando con una máquina y la oyó decir que nadie podía acusarla de robar algo que no se podía tocar. Topotino no identifica todavía con certeza a Topoloco. Solo recupera su propia frase: «No quiere el agua. Quiere lo que el agua recuerda».

La palabra técnica `COMIENZO` se conserva silenciosamente por compatibilidad. No se anuncia como recompensa. Nunca se recoge agua del río. Al terminar, aparece una pista clara hacia Magikland y Topotino pide descanso porque la continuación será el 14.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "La placa se ha encendido: habéis llegado al lugar exacto. Gracias por traerme hasta aquí aunque yo fuera quien dejó el mapa. Esta frase resulta incómoda, pero verdadera." },
  { "from": "topotino", "time": "auto", "text": "Mis topos han detectado junto a la señal de la ponte un fragmento de máquina. Solo se leen cinco letras: «...REFL...». No sé si significa reflejo, reflector o reflejante. Reflejante no existe. Ya hemos aprendido algo." },
  { "from": "topotino", "time": "auto", "text": "Mirad la Ponte de São Gonçalo desde un lugar seguro. Paula elegirá un detalle que parezca capaz de guardar una historia y Hugo otro. Contadme qué ha elegido cada uno y por qué. Podéis escoger piedra, arco, agua, iglesia, figura, ventana o cualquier cosa que observéis de verdad." }
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
      { "from": "topotino", "time": "auto", "text": "Entonces nada de buscar bajo la lluvia. Gracias por avisar. Poneos a cubierto con los adultos y elegid desde allí dos detalles visibles en la ponte, el agua o la fachada. El objetivo es observar, no empapar agentes." }
    ]
  },
  {
    "id": "amarante-alternativa-cierre",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["cerrado", "cerrada", "no podemos entrar", "no nos dejan entrar", "es muy tarde", "ya es tarde"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias por decírmelo. No intentéis entrar. La ponte, el Tâmega y la fachada pueden observarse desde el recorrido permitido. Elegid allí dos detalles que hayan visto pasar muchos años." }
    ]
  },
  {
    "id": "amarante-alternativa-cansancio",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["estamos cansados", "estoy cansado", "estoy cansada", "no podemos caminar", "nos duelen los pies"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces parad. Gracias por decirlo antes de convertiros en dos calcetines con mochila. Desde donde descanséis, elegid en una foto o en el recuerdo de la llegada un detalle cada uno y explicad qué os llamó la atención." }
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
    "minWords": 5,
    "containsAny": ["puente", "ponte", "piedra", "arco", "arcos", "balcon", "balcón", "agua", "rio", "río", "iglesia", "ventana", "figura", "virgen", "señora", "pez", "peces", "obelisco", "reflejo"],
    "rejectContainsAny": ["no se", "ni idea", "da igual", "lo que sea"],
    "setFlags": ["amarante_puente_observado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Dos miradas distintas sobre la misma ponte: eso es exactamente lo que necesitaba comprobar. Un desconocido podría copiar una foto, pero no por qué cada uno os fijasteis en algo diferente." },
      { "from": "topotino", "time": "auto", "text": "Ahora una investigación de historia. La tradición cuenta que São Gonçalo ayudó a levantar una antigua ponte, movió piedras enormes e hizo acudir peces para alimentar a quienes trabajaban. En cambio, sabemos por registros que aquella ponte cayó por las lluvias en 1763 y que la actual resistió durante catorce días en 1809." },
      { "from": "topotino", "time": "auto", "text": "Decidme cuál de esas partes es tradición y cuáles son hechos históricos documentados. No quiero que confundamos una leyenda bonita con una fecha comprobada." }
    ]
  },
  {
    "id": "amarante-historia-comprendida",
    "requiredFlags": ["amarante_puente_observado"],
    "blockedFlags": ["amarante_historia_comprendida"],
    "openAnswer": true,
    "minWords": 5,
    "containsAny": ["tradicion", "tradición", "leyenda", "peces", "1763", "1809", "lluvias", "catorce", "documentado", "historia"],
    "rejectContainsAny": ["todo es verdad", "todo es mentira", "no se", "ni idea"],
    "setFlags": ["amarante_historia_comprendida"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto. Gracias por separar lo que cuenta la tradición de lo que sostienen las fechas y los registros. Las dos cosas pueden enseñarnos, pero no son la misma clase de verdad." },
      { "from": "topotino", "time": "auto", "text": "El fragmento «...REFL...» acaba de vibrar. Antes de tocar la señal, abrid el Cuaderno de la Memoria. Paula guardará una palabra o una frase muy corta sobre el comienzo del viaje. Hugo dibujará otro detalle, con los colores o símbolos que quiera. Después contádmelo en pocas palabras; no necesito que Hugo escriba." }
    ]
  },
  {
    "id": "amarante-diario-guardado",
    "requiredFlags": ["amarante_historia_comprendida"],
    "blockedFlags": ["completado_amarante"],
    "openAnswer": true,
    "minWords": 3,
    "containsAny": ["diario", "cuaderno", "dibujo", "dibujado", "símbolo", "simbolo", "color", "escrito", "recordar", "recuerdo", "viaje", "llegada", "familia", "puente", "ponte", "amarante", "tâmega", "tamega"],
    "rejectContainsAny": ["nada", "no se", "ni idea", "lo que sea"],
    "setFlags": ["diario_amarante", "completado_amarante"],
    "water": "Agua del Puente",
    "formulaWord": "COMIENZO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias por guardarlo. El cuaderno tiene dos recuerdos y ninguno borra al otro. La ponte ha respondido: el Agua del Puente acaba de despertar. No recojáis agua del río; vuestra entrada ya es el recipiente." },
      { "from": "topotino", "time": "auto", "text": "Estoy recordando una escena. Una figura de espaldas ajusta una máquina y dice: «Nadie puede acusarme de robar algo que no se puede tocar». No veo su cara. Después oigo mi propia voz: «No quiere el agua. Quiere lo que el agua recuerda». Eso es todo; no voy a fingir que sé más." },
      { "from": "topotino", "time": "auto", "text": "La máquina ha soltado un plano con seis mundos: África, confusión, una aldea medieval, piratas, Far-West y un zoco. También aparecen una rueda, un barco que se balancea y agua corriendo. Esa es nuestra siguiente ruta; mañana averiguaremos el lugar." },
      { "from": "topotino", "time": "auto", "text": "Por hoy basta. Habéis viajado, observado y me habéis devuelto mi primer recuerdo. Cenad y descansad. Mañana quiero agentes despiertos, no dos croquetas con ojeras." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Elegid un detalle real cada uno y explicad por qué parece capaz de guardar una historia.",
  "La parte de São Gonçalo y los peces pertenece a la tradición; las fechas 1763 y 1809 proceden de la historia documentada.",
  "En el Cuaderno de la Memoria basta una palabra o frase muy corta de Paula y un dibujo o símbolo de Hugo. Después contadme qué habéis querido conservar."
]
```

## Pistas progresivas

```json
[
  "Mirad con calma piedra, agua, arcos, iglesia, figuras o reflejos. Paula elige uno y Hugo otro.",
  "Preguntad qué parte es una tradición sobre São Gonçalo y qué partes tienen fecha histórica.",
  "El Cuaderno de la Memoria no pide una frase perfecta: Paula puede escribir muy poco y Hugo puede dibujar. Guardad entre los dos dos cosas que recordaríais dentro de muchos años."
]
```

## Contexto para IA

Topotino conserva la amistad emocional con Paula y Hugo y recuerda todo desde el eclipse: la amnesia, la placa, el Cuaderno de la Memoria y el descubrimiento de Amarante. No recuerda Londres, Luanco ni su antigua investigación. Al inicio solo sabe que la señal se activó allí y apareció `...REFL...`. Tras `amarante_puente_observado`, puede enseñar la tradición de São Gonçalo y los peces y distinguirla de la caída de 1763 y la resistencia de 1809. No da por superada esa comparación; la valida el motor. Tras `amarante_historia_comprendida`, pide una entrada breve y doble: Paula puede escribir algo mínimo y Hugo dibuja o usa símbolos, sin obligación de escribir. Tras `completado_amarante`, sabe que despertó el Agua del Puente y recuerda la escena exacta autorizada: figura de espaldas, frase sobre robar lo intangible y su propia conclusión «No quiere el agua. Quiere lo que el agua recuerda». No sabe quién era la figura ni acusa con certeza a Topoloco. Agradece observaciones y razonamientos concretos. Puede ampliar historia y cultura de Amarante usando solo los hechos del capítulo. No revela el museo, las doce aguas, Granada, los leones ni que los niños son necesarios. Si preguntan qué sigue antes del final, usa únicamente el plano de seis mundos; al cerrar el día pide descanso. Nunca pide agua del río.

## Fuentes documentales

- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
- https://www.cm-amarante.pt/amarante-evoca-a-defesa-da-ponte-com-programa-cultural-e-evocativo-no-dia-2-de-maio/
