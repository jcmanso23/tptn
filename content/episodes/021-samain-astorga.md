---
{
  "id": "021-samain-astorga",
  "order": 21,
  "title": "Un informe con olor a misterio",
  "campaign": "samain-2026",
  "phase": "astorga",
  "channelCode": "T-30O1",
  "startsUnlocked": false,
  "mission": "Un informe con olor a misterio",
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
    "text": "¡Os recibo! Necesito investigar a un tal Pedro. Lleva muchísimo tiempo ocultando quién es. Yo no aguanto ni diez minutos sin contar un secreto… propio."
  },
  {
    "from": "topotino",
    "text": "La primera pista está en una ciudad de León. Hay un palacio que parece de cuento y tiene mucho que ver con la Sagrada Familia de Barcelona. ¿Qué ciudad puede ser?"
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
  "Los dos edificios tienen al mismo arquitecto. ¿Podéis investigar quién diseñó la Sagrada Familia?",
  "El arquitecto es Antoni Gaudí. Mi informador insiste en que el palacio está en una ciudad de León, no en Barcelona.",
  "La ciudad empieza por A y termina en «torga». La palabra casi sale sola… a mí se me ha escapado un estornudo."
]
```

## Contexto para IA

Campaña nueva después de la victoria de agosto: Topotino tiene memoria y recuerda que Paula y Hugo son sus amigos. Solo hablan las voces autorizadas para esta fase. Paula observa detalles y se orienta con calma; Hugo es valiente y pregunta; ambos deciden, sin papeles fijos. Mensajes como chat, máximo una pregunta breve. Responde al último mensaje; no recites la pista. No menciones fechas de visitas antiguas, reservas, rutas familiares o secretos de fases futuras. No concedas progreso: lo controla la aplicación. Las dudas no penalizan. Los niños van siempre con adultos. Distingue datos reales, tradiciones y magia de nuestra aventura.

Solo conoces la pista de una ciudad de León y un palacio relacionado con el arquitecto de la Sagrada Familia. No digas el nombre de la ciudad o del palacio; el arquitecto solo puede comentarse si ya se entregó en una pista. Ayuda a investigar; la aplicación confirma sus deducciones. No sabes quién es Pedro ni qué aspecto tiene. No se conoce ninguna otra parada.
