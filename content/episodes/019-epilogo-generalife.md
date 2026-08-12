---
{
  "id": "019-epilogo-generalife",
  "order": 19,
  "title": "Epílogo · La memoria a la luz del día",
  "channelCode": "T-00FIN",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-27" }, "location": { "lat": 37.1769930, "lng": -3.5852285, "radiusMeters": 1000, "label": "Generalife, Granada" } },
  "mission": "Mirar de nuevo",
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

No hay villano, agua ni misión obligatoria. Generalife, Carlos V y Alcazaba sirven para volver a mirar de día. Topotino cierra sin secuela forzada y reconoce a Paula y Hugo como coautores.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "requiredFlags": ["completado_sevilla_alhambra_noche"], "text": "Buenos días. La aventura terminó anoche. Hoy no hay trampa, agua ni examen. Si visitáis Generalife, Carlos V o la Alcazaba, elegid voluntariamente algo que la luz del día os haga entender de otra manera y contadme solo si os apetece." },
  { "from": "topotino", "time": "auto", "blockedFlags": ["completado_sevilla_alhambra_noche"], "text": "Buenos días. El cierre nocturno sigue pendiente en vuestra historia, así que no fingiré que Topoloco fue derrotado. El progreso permanece guardado y podremos retomarlo cuando la visita real sea posible." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "epilogo-segunda-mirada",
    "requiredFlags": ["completado_sevilla_alhambra_noche"],
    "blockedFlags": ["epilogo_completado"],
    "openAnswer": true,
    "minWords": 5,
    "containsAny": ["luz", "día", "dia", "generalife", "jardín", "jardin", "agua", "carlos v", "alcazaba", "torre", "vista", "distinto", "anoche"],
    "setFlags": ["epilogo_completado"],
    "remember": { "kind": "epilogue_observation", "label": "Segunda mirada diurna y voluntaria" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias por volver a mirar. Un lugar no se agota en una visita ni una historia en una versión." },
      { "from": "topotino", "time": "auto", "text": "El Cuaderno de la Memoria es vuestro. No necesito verlo para saber lo importante: fue construido por dos personas capaces de observar, discutir, corregir y seguir siendo un equipo." },
      { "from": "topotino", "time": "auto", "text": "Topotina —Tina— manda saludos. Dice que por fin voy a devolverle sus tres destornilladores. No recuerdo haberlos cogido, lo cual no mejora mi defensa." },
      { "from": "topotino", "time": "auto", "text": "Buen viaje de vuelta a Valladolid, Paula y Hugo. Canal T-00FIN cerrado con honores. Topotino fuera… aunque seguiré vigilando por si cierto topo ridículo vuelve a asomar el bigote." }
    ]
  },
  {
    "id": "epilogo-sin-tiempo",
    "requiredFlags": ["completado_sevilla_alhambra_noche"],
    "blockedFlags": ["epilogo_completado"],
    "containsAny": ["nos vamos", "no tenemos tiempo", "volvemos a valladolid", "no podemos visitar"],
    "setFlags": ["epilogo_completado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces no añadimos una visita que no ocurrió. La aventura ya está completa. Buen viaje de vuelta: lo vivido no necesita una prueba extra para ser verdadero." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "No hay respuesta obligatoria. Si queréis, contad qué entendisteis de otra forma con la luz del día."
]
```

## Pistas progresivas

```json
[
  "Comparad voluntariamente la noche con el día: luz, agua, escala, sonido o vista."
]
```

## Contexto para IA

No crea nueva amenaza ni misión. Si el final no se completó, ofrece continuidad y conserva progreso. Si se completó, conversa con calma y orgullo específico. Nunca pide el cuaderno. No insinúa una segunda aventura salvo que los niños la soliciten.

## Fuentes documentales

- https://www.alhambra-patronato.es/edificios-lugares/estructura-urbana
