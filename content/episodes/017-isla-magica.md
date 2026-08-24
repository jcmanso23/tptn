---
{
  "id": "017-isla-magica",
  "order": 17,
  "title": "Día 13 · La última bitácora",
  "channelCode": "T-24A2",
  "startsUnlocked": false,
  "finalRoutes": ["sevilla-night"],
  "activation": { "mode": "all", "required": ["completado_tavira_sevilla"], "date": { "on": "2026-08-25" } },
  "mission": "Impedir que Topoloco se convierta en dueño de la aventura",
  "formulaWord": null,
  "water": "Agua Clara de la Noche",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

El capítulo se activa por la mañana desde cualquier lugar para resumir con claridad el conflicto, pero la expedición permanece oculta hasta confirmar la llegada física a Isla Mágica. Paula y Hugo ya recorrieron los once testigos de Sevilla, conocieron a Capitán Pico y saben que América trabaja fuera del chat. También saben que Topoloco robó el Cuaderno de Bitácora Único y que la pista conduce a una isla imposible conectada con Magikland.

Al llegar, Capitán Pico vuelve a conectar desde el parque y exige que conste que su orientación fue «impecable», aunque América tuvo el mapa. América sigue vigilando sobre el terreno y no escribe. Ninguna actividad depende de encontrarlos, asistir a un espectáculo o fotografiarse con ellos.

Capitán Pico explica la magia de forma concreta: Isla Mágica no es una isla oceánica, sino un recinto rodeado de agua e imaginación dentro de Sevilla. Sus seis zonas permiten viajar con la imaginación a los siglos XVI y XVII. Sevilla, Puerto de Indias representa la ciudad conectada con América; Puerta de América, las carabelas, el lago y los cambios de ambientación permiten reconocer lo aprendido en Tavira y Sevilla.

Topotina detecta entonces a Niebla y lo presenta por primera vez: es un Oscurno de Francia que usa ruido, prisa y opciones llamativas para lograr que alguien elija sin comprobar. Paula y Hugo preparan una respuesta falsa, reversible y comprobable. Niebla la sigue y deja visible el cable del Corrector.

Durante la tarde Topoloco activa el Cuaderno de Bitácora Único junto al lago. Su plan queda expresado sin abstracciones: pretende guardar una sola versión, nombrarse capitán y convertir a Paula, Hugo y todos los aliados en acompañantes de su gran expedición. Tecla no vuelve; Topoloco intenta llamarla y recibe una negativa automática que provoca una breve escena cómica.

El desenlace utiliza tres cosas comprensibles: un escenario representa una época pero no es el pasado real; un reflejo depende del objeto, la luz y el agua y no posee el original; dos recuerdos diferentes pueden formar una historia compartida sin que uno deba borrar al otro. Paula y Hugo consultan el Cuaderno de la Memoria en privado. La máquina no puede copiarlo ni decidir quién es dueño de una aventura construida entre ambos.

Las doce ventanas se abren y el Corrector queda desconectado. Borrón, Eco y Niebla pierden sus conexiones. El Museo Topoloco devuelve los recuerdos robados. Topotino recuerda «Tina». Paula y Hugo reciben una confirmación inequívoca de que lo han conseguido. Este es el final único de la aventura: ocurre durante la tarde del 25 y no abre otra amenaza.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días, Paula y Hugo. Hoy necesito que tengamos clarísimo qué estamos haciendo." },
  { "from": "topotino", "time": "auto", "text": "Durante el eclipse, Topoloco robó gran parte de mi memoria. Después utilizó cada lugar para copiar cómo observabais, elegíais y recordabais." },
  { "from": "topotina", "time": "auto", "text": "Ayer recuperasteis once testigos de Sevilla. Después Tecla confirmó que Topoloco quiere guardar una sola versión, ponerse como capitán y borrar las demás voces." },
  { "from": "topotino", "time": "auto", "text": "La pista señala una isla de barcos y exploradores escondida dentro de Sevilla. Cuando lleguemos, no empezará una visita normal. Empezará la última expedición." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "isla-quien-es-niebla",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["quién es niebla", "quien es niebla", "qué es niebla", "que es niebla", "no conocemos a niebla"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Niebla es un Oscurno al que conocimos en Francia. No borra palabras como Borrón: llena una decisión de ruido y prisa para que elijamos sin comprobar. Os lo presentaré solo cuando detecte su señal." }
    ]
  },
  {
    "id": "isla-america-chat",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["por qué no habla américa", "porque no habla america", "dónde está américa", "donde esta america", "que hable américa"],
    "messages": [
      { "from": "capitan_pico", "time": "auto", "text": "América está conmigo sobre el terreno y ha preferido vigilar antes que pelearse con un teclado. Yo llevaré el canal; ella me avisará si ve algo importante." }
    ]
  },
  {
    "id": "isla-impedimento",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["no podemos", "cerrado", "no quiero montar", "nos da miedo", "cambio de plan"],
    "messages": [
      { "from": "capitan_pico", "time": "auto", "text": "Ninguna prueba exige montar ni asistir a un espectáculo. Caminos, carteles, escenarios, barcos y el lago bastan para completar la expedición." }
    ]
  },
  {
    "id": "final-isla-magica",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["desconectar", "hemos terminado", "final", "lo hemos conseguido"],
    "setFlags": ["completado_isla_magica", "completado_sevilla_alhambra_noche", "topoloco_derrotado", "doce_aguas_reunidas"],
    "water": "Agua Clara de la Noche",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Sí. Lo hemos conseguido. Las doce ventanas están abiertas y Topoloco ya no puede declararse dueño de vuestra aventura." },
      { "from": "topotino", "time": "auto", "text": "Tina… recuerdo que llamaba Tina a Topotina. Gracias, Paula y Hugo. La aventura termina aquí, junto al lago." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "No necesitáis conocer antes a ningún personaje. Capitán Pico se presentará al llegar y Topotina explicará a Niebla cuando detecte su señal.",
  "Buscad primero algo concreto: barcos, agua, carteles de zonas y cambios de ambientación.",
  "La trampa de Niebla consiste en meter prisa. Elegid siempre una acción que podáis comprobar y corregir.",
  "El Cuaderno no se muestra. Solo necesitáis pensar juntos qué demuestra que la aventura pertenece a quienes la vivieron."
]
```

## Pistas progresivas

```json
[
  "En Sevilla, Puerto de Indias buscad elementos que representen comercio, barcos y viajes del siglo XVI.",
  "Una representación puede ayudar a imaginar el pasado, pero no demuestra que cada detalle ocurriera exactamente allí.",
  "Para engañar a Niebla, elegid una respuesta que sea falsa, que podáis deshacer y que después se pueda comprobar.",
  "Un reflejo necesita algo real fuera del agua. Si el agua cambia, la imagen cambia; el objeto no.",
  "El Cuaderno contiene dos miradas privadas que Topoloco nunca pudo copiar."
]
```

## Contexto para IA

Final único en Isla Mágica durante la tarde del 25. La mañana resume el conflicto antes de llegar y recuerda los once testigos sevillanos. La expedición solo aparece tras confirmar físicamente Isla Mágica. Capitán Pico y América ya fueron presentados el 24: Pico vuelve con avatar y humor aventurero; América permanece sobre el terreno y no escribe. No repetir su presentación como desconocidos ni exigir espectáculo, fotografía o atracción. Topotina presenta a Niebla con una explicación concreta antes de usar su nombre. No introducir a Krim, Corvinho, Marga o Rufino. Topoloco llama Cuaderno de Bitácora Único al módulo final y explica exactamente qué hará. El Cuaderno de la Memoria nunca se fotografía, transcribe ni envía. La victoria es inequívoca incluso si la Sombra fue alta: puede costar más ordenar recuerdos, pero el museo y el Corrector quedan derrotados. Tras el cierre no se abre otra misión ni se menciona Granada.

## Fuentes documentales

- https://www.islamagica.es/mapa-y-zonas-tematicas
- https://www.islamagica.es/espectaculos/capitan-pico-y-america
- https://www.islamagica.es/espectaculos/mundial-de-marineria
