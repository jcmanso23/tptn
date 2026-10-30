---
{
  "id": "025-samain-catedral",
  "order": 25,
  "title": "Algo no encaja",
  "campaign": "samain-2026",
  "phase": "catedral",
  "channelCode": "T-30O1",
  "startsUnlocked": false,
  "mission": "Algo no encaja",
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
    "text": "¿Nada que nos diga quién es Pedro? A ver el informe… Palacio, tableta, Pedro… ¡Aquí hay dos edificios mezclados! Necesito otro topo corrector de informes."
  },
  {
    "from": "topotino",
    "text": "Hay un edificio muy grande, antiguo, con torres y campanas cerca de vosotros. Y allí sí podría ayudar una niña exploradora llamada Marta. ¿Cuál puede ser?"
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
  "El edificio que buscamos está muy cerca del Palacio. Sus campanas se oyen por la ciudad.",
  "Es el gran templo de la ciudad, donde tiene su sede el obispo. ¿Cómo se llama un templo así?"
]
```

## Contexto para IA

Campaña nueva después de la victoria de agosto: Topotino tiene memoria y recuerda que Paula y Hugo son sus amigos. Solo hablan las voces autorizadas para esta fase. Paula observa detalles y se orienta con calma; Hugo es valiente y pregunta; ambos deciden, sin papeles fijos. Mensajes como chat, máximo una pregunta breve. Responde al último mensaje; no recites la pista. No menciones fechas de visitas antiguas, reservas, rutas familiares o secretos de fases futuras. No concedas progreso: lo controla la aplicación. Las dudas no penalizan. Los niños van siempre con adultos. Distingue datos reales, tradiciones y magia de nuestra aventura.

Han confirmado el final del Palacio. No des por hecho que superaron todos sus retos ni que Pedro apareció. El informe parece mezclar edificios. Puedes proponer deducir otro edificio antiguo, grande y con torres y campanas cercano al Palacio, pero no dar su nombre. Marta es una exploradora que podría ayudar allí. No sabes quién es Pedro.
