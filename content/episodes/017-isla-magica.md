---
{
  "id": "017-isla-magica",
  "order": 17,
  "title": "Día 13 · Las doce ventanas",
  "channelCode": "T-22A0",
  "startsUnlocked": false,
  "finalRoutes": ["sevilla-night"],
  "activation": { "mode": "all", "date": { "on": "2026-08-25" }, "location": { "lat": 37.4077506, "lng": -5.9998062, "radiusMeters": 1600, "label": "Isla Mágica, Sevilla" } },
  "mission": "Hacer caer a Niebla y desconectar el Corrector",
  "formulaWord": null,
  "water": "Agua Clara de la Noche",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Isla Mágica es la estación gemela de Magikland. Topoloco usó ambos parques para estudiar cómo la emoción y la prisa convierten un momento en recuerdo. Niebla prepara dos rutas: una llamativa y urgente; otra permite comprobar y rectificar. Capitán Pico y América convierten a Paula y Hugo en exploradores; Krim les ayuda a nombrar la emoción sin dejar que decida por ellos. La contratrampa hace que Niebla siga la ruta falsa y revela el cable principal del Corrector junto al lago.

Por la noche, Topoloco intenta usar el reflejo del lago como sustituto de la aventura real. Los niños distinguen escenario, evidencia, emoción, recuerdo y reflejo. Finalmente consultan el Cuaderno de la Memoria en privado y aceptan que sus dos recuerdos diferentes pueden formar una historia compartida sin que uno borre al otro. Las doce ventanas responden como una red, Topotino recuerda que llamaba Tina a su hermana y el Corrector queda desconectado. Este es el final único de la aventura. No se abre otra ruta ni se menciona Granada.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. La firma gemela de Magikland conduce a Isla Mágica." },
  { "from": "america", "time": "auto", "text": "Recorred dos zonas distintas. Niebla ha preparado dos rutas: una quiere que corráis; la otra permite comprobar y volver atrás." },
  { "from": "capitan_pico", "time": "auto", "text": "¡Paula y Hugo, exploradores! Hoy encontraremos el cable del Corrector sin obedecer a la prisa." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "isla-impedimento",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["no podemos", "cerrado", "no quiero montar", "nos da miedo", "cambio de plan"],
    "messages": [
      { "from": "america", "time": "auto", "text": "Ninguna prueba exige montar. Podemos usar caminos, escenarios, carteles y el lago desde un punto seguro." }
    ]
  },
  {
    "id": "final-isla-magica",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["desconectar", "hemos terminado", "final"],
    "setFlags": ["completado_isla_magica", "completado_sevilla_alhambra_noche", "topoloco_derrotado", "doce_aguas_reunidas"],
    "water": "Agua Clara de la Noche",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Las doce ventanas están abiertas. Topoloco ya no puede declarar que una sola versión es dueña de vuestra aventura." },
      { "from": "topotino", "time": "auto", "text": "Tina… recuerdo que llamaba Tina a Topotina. Gracias, Paula y Hugo. La aventura termina aquí, junto al lago." }
    ]
  }
]
```

## Contexto para IA

Final único en Isla Mágica durante la noche del 25. Capitán Pico es aventurero y grandilocuente; América es práctica y clara; Krim habla de emociones sin infantilizar. Topoloco es cómico, orgulloso y peligroso, y el mecanismo debe explicarse: el Corrector intenta convertir una copia o una versión en la única historia permitida. El Cuaderno nunca se fotografía, transcribe ni envía. Tras el cierre no se abre otra misión.

## Fuentes documentales

- https://www.islamagica.es/mapa-y-zonas-tematicas
- https://www.islamagica.es/aguamagica
- https://www.islamagica.es/espectaculos/capitan-pico-y-america
- https://www.islamagica.es/espectaculos/el-duende-de-los-colores
