---
{
  "id": "015-zoomarine",
  "order": 15,
  "title": "Día 11 · Cuidar también es devolver",
  "channelCode": "T-22A0",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-23" }, "location": { "lat": 37.1249791, "lng": -8.3154346, "radiusMeters": 5000, "label": "Zoomarine Algarve" } },
  "mission": "Descubrir por qué rescatar no convierte a nadie en dueño",
  "formulaWord": null,
  "water": "Agua del Cuidado",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

La frase `Porto d’Abrigo` lleva a Zoomarine. Allí Paula y Hugo comparan dos situaciones: en Lagos observaron delfines salvajes sin perseguirlos; aquí investigan qué ocurre cuando un animal necesita ayuda profesional. Porto d’Abrigo recibe, diagnostica, rehabilita y, cuando es posible y seguro, devuelve animales marinos. Topoloco sostiene que salvar algo le da derecho a poseerlo. La visita demuestra lo contrario y permite a Topotino comprender que retener sus recuerdos no fue protegerlos.

La victoria abre una señal alterada por Borrón: un puente de siete arcos en Tavira con la etiqueta popular «romano». El siguiente objetivo es comprobar y corregir esa etiqueta sin quitar valor al puente.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Ayer recuperasteis la parte de Albufeira que Eco había borrado y llegasteis al Refugio de Lona." },
  { "from": "vasco", "time": "auto", "text": "Porto d’Abrigo está dentro de Zoomarine. Ayuda a animales marinos que están heridos o en peligro." },
  { "from": "topotina", "time": "auto", "text": "Topoloco dice: «si lo salvo, me pertenece». Hoy vamos a comprobar por qué es mentira." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "zoomarine-impedimento",
    "blockedFlags": ["completado_zoomarine"],
    "containsAny": ["no podemos", "cerrado", "cambio de plan"],
    "messages": [
      { "from": "vasco", "time": "auto", "text": "No necesitamos ver un animal concreto ni asistir a un espectáculo. Buscad información sobre rescate, rehabilitación y devolución en una zona abierta." }
    ]
  },
  {
    "id": "zoomarine-cierre",
    "blockedFlags": ["completado_zoomarine"],
    "containsAny": ["terminado zoomarine", "hemos acabado", "ya lo hemos hecho"],
    "setFlags": ["completado_zoomarine"],
    "water": "Agua del Cuidado",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Cuidar puede exigir distancia, ayuda profesional y devolución. No convierte a nadie en dueño." },
      { "from": "topotina", "time": "auto", "text": "Borrón acaba de alterar la etiqueta de un puente de siete arcos. La señal apunta a Tavira." }
    ]
  }
]
```

## Contexto para IA

Comparar siempre los delfines salvajes de Lagos con animales que necesitan rehabilitación. No prometer avistamientos ni depender de una presentación. Enseñar con ejemplos concretos y preguntas de opciones. No adelantar Sevilla hasta que Tavira esté resuelta. Cuaderno privado.

## Fuentes documentales

- https://www.zoomarine.pt/en/togetherweprotect/rehabilitation-center/
- https://www.zoomarine.pt/en/togetherweprotect/rehabilitation-center/the-centres-activities/
