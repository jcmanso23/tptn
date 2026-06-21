---
{
  "id": "004-id-del-capitulo",
  "order": 4,
  "title": "Título del capítulo",
  "channelCode": "T-19B4",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["flag_necesaria"],
    "date": { "from": "2026-08-01", "to": "2026-08-20" },
    "time": { "from": "09:00", "to": "22:30" },
    "location": {
      "lat": 43.6150,
      "lng": -5.7930,
      "radiusMeters": 800
    }
  },
  "mission": "Nombre visible de la misión",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Escribe aquí lo que Topotino sabe en este capítulo, lo que sospecha y lo que NO debe revelar todavía.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Mensaje que llega cuando se activa el capítulo." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "respuesta-correcta",
    "match": ["respuesta", "otra forma aceptada"],
    "setFlags": ["flag_desbloqueada"],
    "water": null,
    "formulaWord": null,
    "nextEpisode": null,
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Respuesta guiada de Topotino." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Pista suave si escriben algo que no encaja.",
  "Otra pista suave."
]
```

## Contexto para IA

Define aquí el tono y límites concretos para este capítulo. No reveles destinos futuros si todavía no toca.
