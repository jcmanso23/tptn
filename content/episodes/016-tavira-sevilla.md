---
{
  "id": "016-tavira-sevilla",
  "order": 16,
  "title": "Día 12 · El puente que corrigió su nombre",
  "channelCode": "T-22A0",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-24" }, "location": { "lat": 37.1268750, "lng": -7.6498436, "radiusMeters": 1600, "label": "Centro de Tavira" } },
  "mission": "Corregir a Borrón y abrir el camino a Sevilla",
  "formulaWord": null,
  "water": "Agua de las Dos Orillas",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Borrón ha escrito «romano» sobre el puente de siete arcos de Tavira para que una palabra repetida sustituya a la historia. Paula y Hugo lo observan desde la ribera, lo cruzan y comparan esa mirada cercana con una vista alta. La evidencia permite asegurarlo como medieval y reconstruido hacia 1655; corregir la etiqueta no destruye el puente, sino que hace más honesta su memoria. Corvinho ayuda desde el aire y presume de su orientación.

Al borrar la etiqueta falsa aparece Sevilla. La tarde queda deliberadamente libre para llegar, descansar y estar con la familia. Plaza de España es solo una recomendación opcional de Topotina, nunca una misión ni un requisito. Por la noche, la señal revela que la estación gemela de Magikland es Isla Mágica y prepara el cierre del día siguiente.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Borrón ha escrito «romano» sobre el puente de siete arcos de Tavira." },
  { "from": "corvinho", "time": "auto", "text": "Lo vigilo desde arriba. Mi orientación es impecable. Mis aterrizajes también, salvo calumnias." },
  { "from": "topotina", "time": "auto", "text": "Observad el puente de cerca y desde una vista alta. Corregiremos la etiqueta con pruebas." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "tavira-impedimento",
    "blockedFlags": ["completado_tavira_sevilla"],
    "containsAny": ["no podemos", "cerrado", "cambio de plan"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Decidme qué acceso falla. Podemos comparar el puente desde otra ribera o vista segura sin inventar ninguna observación." }
    ]
  },
  {
    "id": "tavira-cierre",
    "blockedFlags": ["completado_tavira_sevilla"],
    "containsAny": ["hemos terminado tavira", "hemos acabado", "ya lo hemos hecho"],
    "setFlags": ["completado_tavira_sevilla"],
    "water": "Agua de las Dos Orillas",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis corregido el nombre sin borrar el puente. Borrón ha perdido la etiqueta." },
      { "from": "topotina", "time": "auto", "text": "La señal cruza la frontera hacia Sevilla. Esta tarde no hay misión obligatoria: llegad, descansad y estad con la familia." }
    ]
  }
]
```

## Contexto para IA

No obligar a visitar Plaza de España. Solo se recomienda si la familia dispone de tiempo. No revelar Isla Mágica hasta la pista nocturna posterior a Tavira. Corvinho es divertido y algo presumido, pero no resuelve las pruebas. Lenguaje concreto y mensajes breves.

## Fuentes documentales

- https://visitartavira.pt/en/cultural-heritage/old-bridge/
- https://visitasevilla.es/en/plaza-de-espana/
