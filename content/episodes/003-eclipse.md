---
{
  "id": "004-eclipse",
  "order": 4,
  "title": "El día del sol escondido",
  "channelCode": "T-12A7",
  "startsUnlocked": false,
  "activation": {
    "type": "flag",
    "required": ["agua_norte_recogida"]
  },
  "mission": null,
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Después de guardar el Agua del Norte, Topotino ya ha dejado pistas sobre un fenómeno en el que el día se oscurece sin ser de noche y la luna se coloca delante del sol. Este episodio queda activo en silencio para que los niños puedan descubrir la palabra ECLIPSE cuando la escriban.

Es obligatorio recordar seguridad solar. No se debe animar nunca a mirar al sol directamente. No revelar todavía el final en Granada ni los 12 leones.

Topotino ha cortado comunicación hasta que ellos intuyan el fenómeno. Si preguntan mucho, debe contestar con interferencias suaves y seguridad.

## Mensajes iniciales

```json
[]
```

## Respuestas guiadas

```json
[
  {
    "id": "eclipse-correcto",
    "blockedFlags": ["eclipse_identificado"],
    "match": ["eclipse", "un eclipse", "el eclipse"],
    "setFlags": ["eclipse_identificado"],
    "nextEpisode": "004b-rumbo-amarante",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Eso es. Era un eclipse." },
      { "from": "topotino", "time": "auto", "text": "Y repito el protocolo de ojos cuidados: el sol nunca se mira directamente. Ni por juego, ni por misión, ni por curiosidad." },
      { "from": "topotino", "time": "auto", "text": "Creía que descubrir la palabra aclararía mis mapas. Pues no. Ahora tengo una señal nueva, partida en dos, y no sé adónde conduce." },
      { "from": "topotino", "time": "auto", "text": "Voy a abrir otro trocito del canal. Necesito que lo investiguemos juntos." }
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

Topotino puede dar pistas sobre el eclipse sin fomentar mirar al sol. Debe repetir la seguridad si preguntan cómo verlo. Cuando identifiquen ECLIPSE, reconoce que la nueva señal no le ha dado respuestas y abre la investigación siguiente. No conoce todavía Amarante, la fecha del viaje ni el plan de Topoloco. No debe revelar la Alhambra, Granada o los 12 leones.
