---
{
  "id": "003-eclipse",
  "order": 3,
  "title": "El día del sol escondido",
  "channelCode": "T-12A7",
  "startsUnlocked": false,
  "activation": {
    "type": "flag",
    "required": ["completado_luanco"]
  },
  "mission": "El día del sol escondido",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Después de Luanco, Topotino deja pistas sobre un fenómeno en el que el día se oscurece sin ser de noche y la luna se coloca delante del sol. Los niños deben descubrir la palabra ECLIPSE.

Es obligatorio recordar seguridad solar. No se debe animar nunca a mirar al sol directamente. No revelar todavía el final en Granada ni los 12 leones.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Os dejo tres pistas antes de que la segunda agua despierte." },
  { "from": "topotino", "time": "auto", "text": "Primera: pasa cuando el día se pone oscuro sin que haya llegado la noche." },
  { "from": "topotino", "time": "auto", "text": "Segunda: pasa cuando la luna se coloca justo delante del sol, como si quisiera taparle un secreto." },
  { "from": "topotino", "time": "auto", "text": "Tercera: después de ese día, tendréis que buscar un lugar donde un reino empezó a decir: aquí comienza mi historia." },
  { "from": "topotino", "time": "auto", "text": "No busquéis antes de tiempo. La segunda agua todavía está dormida. Cuando sepáis qué fenómeno es, escribid su nombre." },
  { "from": "topotino", "time": "auto", "text": "Mensaje de seguridad de Topotino: El sol nunca se mira directamente. Ni por juego, ni por misión, ni por curiosidad. Los buenos exploradores cuidan sus ojos." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "eclipse-correcto",
    "match": ["eclipse", "un eclipse"],
    "setFlags": ["eclipse_identificado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Correcto. Era un eclipse." },
      { "from": "topotino", "time": "auto", "text": "Y repito el protocolo de seguridad: el sol nunca se mira directamente. Ni por juego, ni por misión, ni por curiosidad. Los buenos exploradores cuidan sus ojos." },
      { "from": "topotino", "time": "auto", "text": "Cuando pase el día del sol escondido, la siguiente ruta empezará a despertar. Buscaremos un origen, un comienzo, una historia que aprende a decir: aquí empieza todo." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "La pista está en el cielo: el día se oscurece, pero no porque llegue la noche.",
  "Pensad en la luna pasando delante del sol. Y recordad: nunca se mira el sol directamente.",
  "Es una palabra que empieza por E y los exploradores la investigan siempre con protección adecuada."
]
```

## Contexto para IA

Topotino puede dar pistas sobre el eclipse sin fomentar mirar al sol. Debe repetir la seguridad si preguntan cómo verlo. No debe desbloquear destinos nuevos todavía ni revelar la Alhambra, Granada o los 12 leones.
