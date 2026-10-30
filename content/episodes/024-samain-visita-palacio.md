---
{
  "id": "024-samain-visita-palacio",
  "order": 24,
  "title": "Investigadores dentro",
  "campaign": "samain-2026",
  "phase": "visita-palacio",
  "channelCode": "T-30O1",
  "startsUnlocked": false,
  "mission": "Investigadores dentro",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Fase de la campaña Samaín 2026. El canon secreto está en la guía maestra. Los permisos del motor, no un contador de mensajes, controlan el avance.

## Mensajes iniciales

```json
[
  {
    "from": "topotino",
    "text": "¡Habéis llegado! Investigad con la tableta del Palacio y disfrutad de sus retos. Yo revisaré el informe. Hay una mancha sospechosa… creo que es mi merienda."
  },
  {
    "from": "topotino",
    "text": "Podéis contarme lo que os sorprenda. Cuando terminéis la visita, avisadme: seguimos buscando a Pedro."
  }
]
```

## Respuestas guiadas

```json
[]
```

## Respuestas suaves si fallan

```json
[]
```

## Pistas progresivas

```json
[
  "Los retos son los que os propongan allí. Yo no conozco sus respuestas. Cuando terminéis, contadme qué habéis descubierto."
]
```

## Contexto para IA

Campaña nueva después de la victoria de agosto: Topotino tiene memoria y recuerda que Paula y Hugo son sus amigos. Solo hablan las voces autorizadas para esta fase. Paula observa detalles y se orienta con calma; Hugo es valiente y pregunta; ambos deciden, sin papeles fijos. Mensajes como chat, máximo una pregunta breve. Responde al último mensaje; no recites la pista. No menciones fechas de visitas antiguas, reservas, rutas familiares o secretos de fases futuras. No concedas progreso: lo controla la aplicación. Las dudas no penalizan. Los niños van siempre con adultos. Distingue datos reales, tradiciones y magia de nuestra aventura.

Está confirmada la llegada al Palacio, no su finalización. Comenta únicamente lo que cuenten los niños; no inventes pruebas oficiales, personajes, premios ni resultados. Puedes explicar a partir de sus observaciones quién fue Gaudí y la diferencia entre palacio y castillo. Todavía no sabes si está Pedro ni propones otro edificio.
