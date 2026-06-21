---
{
  "id": "001-reconexion",
  "order": 1,
  "title": "Reconexión",
  "channelCode": "T-12A7",
  "startsUnlocked": true,
  "activation": {
    "type": "passphrase",
    "accepted": ["londresbrilla"]
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

La misión de Londres fue el inicio oculto de algo mayor. La clave Londresbrilla activa el Comunicador Subterráneo.

Topotino ha detectado la leyenda de la Fuente de la Noche Clara, relacionada con agua, noche y luz. Topoloco ha sido visto subiendo a un barco rumbo a España. La primera pista apunta al norte y a un lugar donde este fin de semana se mezclan agua, noche y luz.

No revelar Granada, la Alhambra, los 12 leones ni la lista completa de aguas.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "21:37", "text": "Amigos… por fin puedo comunicarme con vosotros." },
  { "from": "topotino", "time": "21:38", "text": "La misión de Londres fue un éxito, pero ha pasado algo raro. Mucho más raro de lo que pensaba." },
  { "from": "topotino", "time": "21:38", "text": "Desde que encontrasteis aquella pista junto al agua y la luz, mis túneles no han dejado de recibir señales. Todas hablan de una antigua leyenda: la Fuente de la Noche Clara." },
  { "from": "topotino", "time": "21:39", "text": "No sé muy bien qué significa todavía. Solo sé tres cosas: agua, noche y luz." },
  { "from": "topotino", "time": "21:39", "text": "Y también sé algo más: Topoloco estaba detrás de esto. Mis topos vigía lo han visto subiendo a un barco rumbo a España." },
  { "from": "topotino", "time": "21:40", "text": "Hay algo moviéndose este fin de semana. Algo que mezcla agua, noche y luz. ¿Os acordáis de algún sitio que pueda encajar?" },
  { "from": "topotino", "time": "21:40", "text": "Cuando tengáis una sospecha, escribid el nombre en el comunicador. Las pistas importantes no se encuentran corriendo. Se encuentran mirando." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "luanco-correcto",
    "match": ["luanco", "lluanco"],
    "setFlags": ["luanco_identificado"],
    "nextEpisode": "002-luanco-primera-gota",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Confirmado." },
      { "from": "topotino", "time": "auto", "text": "Era Luanco." },
      { "from": "topotino", "time": "auto", "text": "Mis topos vigía han encontrado restos de sal, arena y una mancha blanca en una de las patas de Topoloco." },
      { "from": "topotino", "time": "auto", "text": "Nueva misión desbloqueada: Operación Primera Gota." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Mis topos dicen que ese lugar tiene algo interesante, pero no huele suficiente a sal.",
  "Cerca, cerca… pensad en agua, noche y luz.",
  "Recordad: Topoloco vino por mar. Mirad hacia el norte.",
  "Ese sitio no parece la primera pista. Seguid investigando."
]
```

## Contexto para IA

Topotino habla con misterio amable, humor suave y tono de compañero de misión. No da miedo. No es omnisciente. No revela destinos futuros. Si preguntan por pistas, ayuda suavemente a pensar en agua, noche, luz, mar y norte. La respuesta correcta guiada es Luanco, pero solo debe confirmarse mediante las respuestas guiadas.
