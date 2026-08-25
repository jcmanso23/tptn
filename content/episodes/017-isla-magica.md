---
{
  "id": "017-isla-magica",
  "order": 17,
  "title": "Día 13 · La isla dentro de la isla",
  "channelCode": "T-25A0",
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

El capítulo se activa por la mañana desde cualquier lugar. Paula y Hugo se retiraron ayer justo cuando tocaba investigar Santa Cruz. Fue una buena decisión. Recuperaron siete testigos; no visitaron Santa Cruz, Fábrica de Tabacos, María Luisa ni Plaza de España y no ocurrió la conversación nocturna con Tecla.

Durante la noche Borrón arrancó los cuatro cortes pendientes y cruzó su señal hacia la Isla de la Cartuja. Cree que en un lugar de recreaciones podrá mezclar mentira y representación. Se equivoca: una representación honesta explica qué está reconstruyendo y no pretende sustituir al original. Topotina recupera además una lectura del módulo robado: el Corrector de Topoloco quiere imponer un Cuaderno de Bitácora Único.

La señal tiene seis direcciones, barcos, viajes a América y la firma gemela de Magikland. Una conversación breve permite que Paula y Hugo deduzcan una isla mágica dentro de la Isla de la Cartuja. La expedición permanece oculta hasta confirmar la llegada física.

Al llegar, Capitán Pico vuelve a conectar desde dentro del parque y exige que conste que su orientación fue «impecable», aunque América tuvo el mapa. América sigue vigilando sobre el terreno y no escribe. Ninguna prueba depende de encontrarlos físicamente, fotografiarse o montar en una atracción.

Capitán Pico explica la magia de forma concreta: Isla Mágica está en la Isla de la Cartuja y sus seis zonas permiten viajar con la imaginación a los siglos XVI y XVII. Sevilla, Puerto de Indias representa la ciudad conectada con América; Puerta de América, las carabelas, el lago y los cambios de ambientación permiten reconocer lo aprendido en Tavira y Sevilla.

Topotina detecta entonces a Niebla y lo presenta por primera vez: es un Oscurno de Francia que usa ruido, prisa y opciones llamativas para lograr que alguien elija sin comprobar. Paula y Hugo preparan una respuesta falsa, reversible y comprobable. Niebla la sigue y deja visible el cable del Corrector.

Junto al lago recuperan los cuatro cortes que Borrón desplazó y dejan expuesto el Corrector. Topoloco revela su plan sin abstracciones: pretende guardar una sola versión, nombrarse capitán y convertir a Paula, Hugo y los aliados en acompañantes de su gran expedición. Tecla no vuelve; Topoloco intenta llamar al servicio técnico y recibe una negativa automática.

Topotina detecta que la activación definitiva ocurrirá a las 20:00 en el Corral de Comedias. El chat lo presenta como una recepción real: Sevilla espera a Carlos I y todo debe estar preparado, pero discursos, reverencias, bailes, equívocos y participación convierten el orden perfecto en un caos divertido. Antes de entrar reciben instrucciones concretas; durante la representación el móvil permanece guardado y en silencio.

Al salir, el desenlace utiliza cuatro ideas comprensibles: un escenario representa una época pero no es el pasado real; un reflejo depende del objeto, la luz y el agua; una historia puede mejorar cuando varias personas corrigen errores; y dos recuerdos diferentes pueden formar una historia compartida. Paula y Hugo consultan el Cuaderno de la Memoria en privado. La máquina no puede copiarlo ni decidir quién es dueño de una aventura construida entre ambos.

Las doce ventanas se abren y el Corrector queda desconectado. Borrón, Eco y Niebla pierden sus conexiones. El Museo Topoloco devuelve los recuerdos robados. Topotino recuerda «Tina». Paula y Hugo reciben una confirmación inequívoca de que lo han conseguido. Después Topotino recomienda ver la Sevilla que quedó pendiente, ya sin pruebas. Este es el final único y no abre otra amenaza.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días, Paula y Hugo. Ayer paramos justo antes de investigar Santa Cruz. Hicisteis bien: una aventura no mejora porque sus exploradores terminen arrastrándose." },
  { "from": "topotina", "time": "auto", "text": "Recuperasteis siete testigos. Durante la noche Borrón arrancó los cuatro pendientes y movió su señal al otro lado del Guadalquivir." },
  { "from": "topotino", "time": "auto", "text": "Así que no repetiremos Santa Cruz ni fingiremos que vimos lo que no vimos. Perseguiremos lo que Borrón se llevó." },
  { "from": "topotina", "time": "auto", "text": "La nueva marca tiene seis direcciones, barcos, viajes a América y la misma firma que encontramos en Magikland. Primero tenemos que descubrir dónde termina." }
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
      { "from": "capitan_pico", "time": "auto", "text": "Ninguna prueba exige montar. Caminos, carteles, escenarios, barcos y el lago bastan. Para la recepción final preguntad al personal si cambia el horario o el acceso." }
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
      { "from": "topotino", "time": "auto", "text": "Tina… recuerdo que llamaba Tina a Topotina. Gracias, Paula y Hugo. La aventura termina aquí, al salir del Corral de Comedias." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Ya conocéis a Capitán Pico. Volverá a conectar desde dentro del parque; Topotina explicará a Niebla cuando detecte su señal.",
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
  "En el Corral observad quién se equivoca, quién corrige y si el caos puede resolverse sin un único dueño.",
  "El Cuaderno contiene dos miradas privadas que Topoloco nunca pudo copiar."
]
```

## Contexto para IA

Final único en Isla Mágica durante la tarde del 25. La mañana reconoce que ayer se retiraron antes de Santa Cruz: siete testigos recuperados y cuatro desplazados por Borrón. Nunca afirmar que visitaron Santa Cruz, Fábrica de Tabacos, María Luisa o Plaza de España. La expedición solo aparece tras confirmar físicamente Isla Mágica. Capitán Pico y América ya fueron presentados el 24: Pico vuelve con avatar y humor aventurero; América permanece sobre el terreno y no escribe. Topotina presenta a Niebla con una explicación concreta. No introducir a Krim, Corvinho, Marga o Rufino. La culminación sucede después de la recepción de Carlos I en el Corral de Comedias de las 20:00. Antes de entrar se pide guardar y silenciar el móvil; no enviar mensajes durante la representación. Topoloco explica exactamente qué hará el Cuaderno de Bitácora Único. El Cuaderno de la Memoria nunca se fotografía, transcribe ni envía. La victoria es inequívoca incluso si la Sombra fue alta. Después Topotino recomienda conocer la Sevilla pendiente sin abrir otra misión ni mencionar Granada.

## Fuentes documentales

- https://www.islamagica.es/mapa-y-zonas-tematicas
- https://www.islamagica.es/espectaculos/capitan-pico-y-america
- https://www.islamagica.es/espectaculos/mundial-de-marineria
- https://www.islamagica.es/espectaculos/que-viene-el-rey
- https://signaling.islamagica.es/publica/espectaculos.php
