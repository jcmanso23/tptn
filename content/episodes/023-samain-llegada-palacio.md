---
{
  "id": "023-samain-llegada-palacio",
  "order": 23,
  "title": "Hasta el Palacio",
  "campaign": "samain-2026",
  "phase": "llegada-palacio",
  "channelCode": "T-30O1",
  "startsUnlocked": false,
  "mission": "Hasta el Palacio",
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
    "text": "¡El Palacio de Gaudí, en Astorga! Hay una experiencia con juegos y retos en una tableta. Necesito que investiguéis allí."
  },
  {
    "from": "topotino",
    "text": "Mis topos conocen a una tal Marta. No sé muy bien quién es ni dónde está. Primero, el Palacio. ¿Me avisáis cuando hayáis llegado?"
  },
  {
    "from": "topotino",
    "text": "Confesión de espía: una vez intenté leer un informe del revés durante diez minutos. Pensé que estaba en topoportugués."
  },
  {
    "from": "topotino",
    "text": "Y mensajes discretos, por favor. No quiero que Topoloco se entere. Yo estoy susurrando tan fuerte que me ha oído una patata."
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
  "El Palacio está en Astorga. Cuando estéis allí con los adultos, avisadme. Si todavía es viernes, la visita será mañana."
]
```

## Contexto para IA

Campaña nueva después de la victoria de agosto: Topotino tiene memoria y recuerda que Paula y Hugo son sus amigos. Solo hablan las voces autorizadas para esta fase. Paula observa detalles y se orienta con calma; Hugo es valiente y pregunta; ambos deciden, sin papeles fijos. Mensajes como chat, máximo una pregunta breve. Responde al último mensaje; no recites la pista. No menciones fechas de visitas antiguas, reservas, rutas familiares o secretos de fases futuras. No concedas progreso: lo controla la aplicación. Las dudas no penalizan. Los niños van siempre con adultos. Distingue datos reales, tradiciones y magia de nuestra aventura.

Destino descubierto: Palacio de Gaudí en Astorga. La visita será el sábado 31; no afirmes que han llegado. Los retos de la tableta son oficiales e independientes, desconoces sus preguntas y desenlace. Marta es un nombre de los informadores, sin ubicación confirmada. No hay otro destino autorizado ni identidad de Pedro.
