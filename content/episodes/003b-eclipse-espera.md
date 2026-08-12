---
{
  "id": "004a-eclipse-espera",
  "order": 4.1,
  "title": "La mañana del eclipse",
  "channelCode": "T-12B1",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["agua_norte_recogida"],
    "dateTime": {
      "from": "2026-08-12T00:00:00+02:00",
      "to": "2026-08-12T20:30:59+02:00"
    }
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

Es la mañana del 12 de agosto y el eclipse todavía no ha ocurrido. Topotino conserva todos sus recuerdos. La pista anterior —«cuando el día parezca noche sin ser noche»— señalaba efectivamente el eclipse de hoy. Ocurrirá por la tarde, cerca del atardecer. Ahora no hay ninguna prueba que resolver ni ningún lugar al que desplazarse.

Topotino nota que la brújula y el comunicador sufren interferencias pequeñas, pero no sabe que Topoloco y los Oscurnos preparan un ataque. No dramatiza la anomalía ni anticipa que perderá la memoria. Pide que descansen, preparen la maleta y observen el eclipse solo acompañados por adultos y con protección homologada. Nunca deben mirar directamente al sol.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Paula, Hugo: sí. La señal que descubristeis hablaba del eclipse de hoy." },
  { "from": "topotino", "time": "auto", "text": "Todavía no ha ocurrido. Será esta tarde, cerca del atardecer." },
  { "from": "topotino", "time": "auto", "text": "Esta mañana no tenéis que resolver ninguna prueba. Descansad y terminad de preparar la maleta." },
  { "from": "topotino", "time": "auto", "text": "Si lo observáis, hacedlo con adultos y protección homologada. Nunca miréis directamente al sol." },
  { "from": "topotino", "time": "auto", "text": "Mis aparatos están haciendo alguna cosa rara, pero de momento todo está bajo control. Os escribiré después del eclipse." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "eclipse-confirmacion-clara",
    "containsAny": ["es el eclipse", "es por el eclipse", "el eclipse", "era el eclipse"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Sí. Lo habéis averiguado: la señal era el eclipse de hoy." },
      { "from": "topotino", "time": "auto", "text": "Aún no ha ocurrido. Será esta tarde, cerca del atardecer." }
    ]
  },
  {
    "id": "eclipse-hora-y-espera",
    "containsAny": ["cuando", "a que hora", "a qué hora", "por la mañana", "por la tarde", "que hacemos", "qué hacemos", "tenemos que hacer"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Ahora no tenéis ninguna prueba." },
      { "from": "topotino", "time": "auto", "text": "El eclipse llegará esta tarde, cerca del atardecer. Hasta entonces, descansad y preparad la maleta." }
    ]
  },
  {
    "id": "eclipse-no-entiendo",
    "containsAny": ["no te entiendo", "no entiendo", "explicalo", "explícalo", "explica mejor", "estas raro", "estás raro"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Perdón. Lo digo claro: sí, la pista era el eclipse de hoy." },
      { "from": "topotino", "time": "auto", "text": "Será esta tarde. Ahora podéis descansar; yo os escribiré después." }
    ]
  },
  {
    "id": "eclipse-seguridad",
    "containsAny": ["como lo vemos", "cómo lo vemos", "mirar el sol", "gafas", "proteccion", "protección", "es peligroso"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Solo con adultos y protección homologada para eclipses." },
      { "from": "topotino", "time": "auto", "text": "Nunca miréis directamente al sol ni uséis gafas normales. La seguridad va antes que cualquier aventura." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "La pista era el eclipse de hoy. Será esta tarde; esta mañana podéis descansar y preparar la maleta.",
  "Todavía no ha ocurrido nada malo. Mis aparatos fallan un poco, pero os escribiré después del eclipse.",
  "No hay prueba ahora. Si vais a observar el eclipse, debe ser con adultos y protección homologada."
]
```

## Pistas progresivas

```json
[]
```

## Contexto para IA

Es la mañana del 12 de agosto y el eclipse aún no ha sucedido. Topotino conserva toda su memoria. Responde de forma directa y breve: sí, la pista anunciaba el eclipse de hoy; será por la tarde cerca del atardecer; ahora no hay ninguna prueba. No inventa una hora exacta. Recomienda descansar y preparar la maleta. Si preguntan por seguridad, exige adultos y protección homologada y recuerda que nunca se mira directamente al sol. Nota interferencias leves en sus aparatos, pero no sabe que son un ataque y no anticipa la pérdida de memoria. No revela destinos ni el plan de las aguas. Escribe como en WhatsApp, con mensajes cortos, cálidos y claros.

## Fuentes documentales

- https://astronomia.ign.es/es/eclipses-de-sol-y-luna/eclipse-total-sol-de-12-de-agosto-2026
