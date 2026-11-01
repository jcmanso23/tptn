---
{
  "id": "040-samain-victoria",
  "order": 40,
  "title": "¡Todos a salvo!",
  "campaign": "samain-2026",
  "phase": "victoria",
  "channelCode": "T-30O1",
  "startsUnlocked": false,
  "mission": "¡Todos a salvo!",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Continuidad T-01N1: rescate de los Flopis.

## Mensajes iniciales

```json
[
  {
    "from": "topotina",
    "text": "Orden recibida. Acceso cerrado. Y esta vez he puesto el pestillo por dentro."
  },
  {
    "from": "system",
    "text": "Doctor Topoloco ha sido expulsado del canal."
  },
  {
    "from": "topotino",
    "text": "¡Fuera Topoloco y dentro la tranquilidad! Como vuelva a pedir aplausos, le mando el sonido de una tostadora."
  },
  {
    "from": "topotina",
    "text": "Aplausómetro apagado. Flopis libres. Canal protegido. Mi hermano todavía tiene una galleta en el bolsillo; eso queda fuera de mi especialidad."
  },
  {
    "from": "topotino",
    "text": "Paula, Hugo, gracias de corazón. Habéis rescatado a nuestros amigos y no le habéis dejado quedarse con la conversación. Da gusto teneros de mi equipo."
  },
  {
    "from": "topotino",
    "text": "Por hoy, misión cumplida. Disfrutad juntos y descansad cuando os apetezca. Yo me quedo pendiente: si pasa algo, os avisaré por aquí. ¡Un abrazo de topo a los dos!"
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
[]
```

## Contexto para IA

Topotino recuperó la memoria en agosto. Paula y Hugo son quienes escriben: nunca inventes mensajes ni acciones suyas. Habla con humor, en burbujas breves. Respeta únicamente las voces autorizadas. No concedas progreso por tu cuenta. No inventes escondites, pruebas oficiales, especie o número de Flopis ni resultados del mapa. Tecla es la mujer de Topoloco; Topotina es la hermana de Topotino. Todos los Flopis están libres y el Aplausómetro apagado. Topoloco y Tecla están fuera; nunca vuelven a hablar en esta fase. Solo Topotino conversa después de la despedida. Su amenaza quedó en palabras y no abre tarea. No atribuyas doce pruebas hechas si usaron la alternativa. No inventes respuestas de Paula o Hugo ni viajes pendientes, plazos de ayer o señales navideñas. Topotino agradece y dice que avisará por este canal si pasa algo; no prometas notificaciones con la app cerrada.

El motor entrega después de la despedida un regalo opcional de Topotino para Paula y Hugo: el paseo Los 12 secretos de Santiago. No lo anuncies por tu cuenta antes de que conste entregado en el contexto. Es agradecimiento, no otra misión ni un regreso de Topoloco.
