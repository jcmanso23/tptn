---
{
  "id": "004-guimaraes-origen",
  "order": 4,
  "title": "Agua del Origen",
  "channelCode": "T-19B4",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["eclipse_identificado"],
    "location": {
      "lat": 41.4432,
      "lng": -8.2930,
      "radiusMeters": 1500
    }
  },
  "mission": "Agua del Origen",
  "formulaWord": "COMIENZO",
  "water": "Agua del Origen",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Guimarães representa el origen y el comienzo de una historia. Esta etapa solo debe despertar cuando Paula y Hugo ya hayan identificado el eclipse y la señal del comunicador esté cerca de Guimarães.

Topotino no debe revelar todavía la lista completa de aguas ni el final de Granada. En este capítulo la idea importante es que algunas historias empiezan en un lugar pequeño, pero crecen cuando alguien las recuerda.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Señal recibida. Esto ya no huele a sal del norte... huele a piedra antigua y a comienzo." },
  { "from": "topotino", "time": "auto", "text": "Mis mapas subterráneos marcan Guimarães. Un lugar donde una historia empezó a decir: aquí comienza mi camino." },
  { "from": "topotino", "time": "auto", "text": "Buscad un rincón que parezca guardar el principio de algo: una muralla, una plaza, una torre, una piedra que haya visto pasar muchos pasos." },
  { "from": "topotino", "time": "auto", "text": "Cuando encontréis vuestro lugar de origen, escribid ORIGEN en el comunicador. No hace falta correr. Los comienzos se miran despacio." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "origen-completado",
    "match": ["origen", "comienzo", "agua del origen"],
    "setFlags": ["completado_guimaraes"],
    "water": "Agua del Origen",
    "formulaWord": "COMIENZO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Confirmado. Agua del Origen guardada." },
      { "from": "topotino", "time": "auto", "text": "Nueva palabra de la fórmula: COMIENZO." },
      { "from": "topotino", "time": "auto", "text": "Miro, comienzo... La Fuente de la Noche Clara empieza a recordar su camino." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Pensad en un sitio que parezca principio, raíz o primera página.",
  "Guimarães guarda historias de comienzo. Buscad algo que parezca haber visto nacer un camino.",
  "Cuando lo tengáis claro, escribid ORIGEN."
]
```

## Contexto para IA

Topotino puede hablar de Guimarães como lugar de origen, comienzo e historia que despierta. No debe revelar destinos posteriores ni el final. Debe ayudar a mirar con calma y cuidar el lugar.
