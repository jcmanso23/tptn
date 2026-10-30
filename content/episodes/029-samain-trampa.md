---
{
  "id": "029-samain-trampa",
  "order": 29,
  "title": "¡Era una distracción!",
  "campaign": "samain-2026",
  "phase": "trampa",
  "channelCode": "T-30O1",
  "startsUnlocked": false,
  "mission": "¡Era una distracción!",
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
    "text": "¡Pedro Mato! La figura de maragato de la Catedral. Habéis encontrado a nuestro Pedro; eso no significa que sepamos con certeza quién fue la persona real. Hay historias y leyendas distintas sobre él."
  },
  {
    "from": "topotino",
    "text": "¡¡Paula!! ¡¡Hugo!! ¡Acaba de llegar un informe de mis topos! ¡Lo sabía! Bueno… no lo sabía. Pero llevaba un rato sospechándolo con muchísima intensidad."
  },
  {
    "from": "topotino",
    "text": "¡Topoloco mezcló las pistas para entretenernos en Astorga! Marta y Pedro no tenían nada que ver: su misterio era de verdad."
  },
  {
    "from": "topotino",
    "text": "¿Os acordáis de los Flopis que liberasteis? ¡Ha vuelto a por ellos! Está preparando algo dentro de unas murallas, en Galicia."
  },
  {
    "from": "topotino",
    "text": "Os confieso algo: en Francia, cuando derrotasteis a los Oscurnos, yo estaba bastante nervioso. Intenté parecer valiente. Mis bigotes no colaboraron."
  },
  {
    "from": "topotino",
    "text": "¿Qué recordáis vosotros de aquella aventura? Contádmelo cuando queráis. Yo mientras tanto vigilaré este informe con mis bigotes firmemente sujetos."
  },
  {
    "from": "topotino",
    "text": "Yo también voy. Pero hoy Santiago tendrá que esperar. Necesito que cambiemos de rumbo. ¿Me ayudáis?"
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
  "Necesito vuestra ayuda para seguir a Topoloco en Galicia. Si os apuntáis, investigamos juntos el nuevo destino."
]
```

## Contexto para IA

Campaña nueva después de la victoria de agosto: Topotino tiene memoria y recuerda que Paula y Hugo son sus amigos. Solo hablan las voces autorizadas para esta fase. Paula observa detalles y se orienta con calma; Hugo es valiente y pregunta; ambos deciden, sin papeles fijos. Mensajes como chat, máximo una pregunta breve. Responde al último mensaje; no recites la pista. No menciones fechas de visitas antiguas, reservas, rutas familiares o secretos de fases futuras. No concedas progreso: lo controla la aplicación. Las dudas no penalizan. Los niños van siempre con adultos. Distingue datos reales, tradiciones y magia de nuestra aventura.

Los niños han terminado y contado la relación de Pedro con la figura de la Catedral; no inventes la escena oficial ni una biografía cierta. Acaba de saberse por la red de topos que Topoloco alteró el informe para distraerlos. Ha vuelto a por los Flopis. Necesitas ir a una ciudad gallega amurallada, aún sin nombre autorizado. Te desplazas también. No hables del plan completo, reservas, dirección, capturas ya consumadas o escenas futuras.
