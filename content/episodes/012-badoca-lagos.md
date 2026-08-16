---
{
  "id": "012-badoca-lagos",
  "order": 12,
  "title": "Día 8 · El espía que confundía hechos con cuentos",
  "channelCode": "T-84S6",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-20" }, "location": { "lat": 38.0388305, "lng": -8.7433595, "radiusMeters": 5000, "label": "Badoca Safari Park" } },
  "mission": "Observar antes de explicar",
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Niebla huyó de Lisboa con un receptor de la máquina y lo escondió en Badoca para grabar cómo deciden Paula y Hugo ante animales en movimiento. Un etograma simple separa conducta e intención y alimenta el receptor con observaciones que no puede convertir en predicciones seguras. Al descubrirlo, Niebla lo activa y huye a la marina de Lagos para embarcarlo. La orientación marítima permite seguirlo sin adelantar la salida del día siguiente.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. En el safari de Badoca no quiero una lista de animales. Elegid una especie y observadla durante un intervalo breve: registrad tres conductas en orden y sin atribuir emociones. Después proponed dos explicaciones posibles para una conducta." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "badoca-etograma",
    "blockedFlags": ["badoca_etograma"],
    "openAnswer": true,
    "minWords": 16,
    "containsAnyGroups": [["jirafa", "cebra", "ñu", "avestruz", "búfalo", "bufalo", "animal"], ["primero", "después", "despues", "luego"], ["caminó", "camino", "comió", "comio", "miró", "miro", "corrió", "corrio", "paró", "paro"], ["podría", "podria", "otra explicación", "otra explicacion", "porque"]],
    "setFlags": ["badoca_etograma"],
    "remember": { "kind": "behavior_log", "label": "Etograma breve de una especie de Badoca" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. «Miró a la derecha» es observación; «estaba tramando huir» es interpretación. Topoloco ha escrito lo segundo sobre una cebra que solo masticaba." },
      { "from": "topotino", "time": "auto", "text": "Elegid ahora dos especies que compartan el espacio. Comparad una característica corporal y una conducta. Explicad cómo pueden usar el mismo entorno de forma distinta sin que una sea mejor en todo." }
    ]
  },
  {
    "id": "badoca-dos-especies",
    "requiredFlags": ["badoca_etograma"],
    "blockedFlags": ["badoca_especies"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["jirafa", "cebra", "ñu", "avestruz", "búfalo", "bufalo"], ["cuerpo", "patas", "cuello", "pico", "tamaño", "tamano"], ["conducta", "come", "corre", "grupo", "solo"], ["entorno", "distinto", "porque", "ventaja"]],
    "setFlags": ["badoca_especies"],
    "remember": { "kind": "comparative_biology", "label": "Comparación situada de dos especies" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto. La adaptación distribuye posibilidades; no entrega una medalla universal." },
      { "from": "topotino", "time": "auto", "text": "He detectado un pequeño receptor junto a la ruta. No grababa animales: registraba el orden en que observáis, comparáis y corregís." },
      { "from": "topotino", "time": "auto", "text": "Lleva una marca como de niebla y una frase: «no acercarse a los niños de Francia». Marga cree que pertenece a un Oscurno llamado Niebla." },
      { "from": "topotino", "time": "auto", "text": "No recuerdo Francia, pero vosotros sí. Parece que ellos también." },
      { "from": "topotino", "time": "auto", "text": "Al llegar a Lagos, empezad en el acceso terrestre de la marina. Seguid los pantalanes hacia la salida al mar sin abandonar el paseo permitido." },
      { "from": "topotino", "time": "auto", "text": "Buscad por el camino una señal de movimiento, una infraestructura y otra de protección u orientación. Unidlas en una ruta de tierra a agua." }
    ]
  },
  {
    "id": "lagos-ciudad-mar",
    "requiredFlags": ["badoca_especies"],
    "blockedFlags": ["lagos_mar"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["barco", "personas", "mercancía", "mercancia", "movimiento"], ["marina", "puerto", "muelle", "bocana", "infraestructura"], ["muralla", "faro", "señal", "senal", "protección", "proteccion", "orientación", "orientacion"], ["tierra", "mar", "agua", "recorrido"]],
    "setFlags": ["lagos_mar"],
    "remember": { "kind": "route_model", "label": "Modelo tierra-mar construido en Lagos" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Ruta coherente. Habéis convertido señales aisladas en un sistema de llegada, protección y salida." },
      { "from": "topotino", "time": "auto", "text": "Antes de dormir, haced una predicción para mañana: si buscamos delfines sin saber dónde aparecerán, ¿qué tres tipos de evidencia serán más fiables que señalar al azar? No hace falta acertar el lugar; diseñad el método." }
    ]
  },
  {
    "id": "lagos-prediccion-delfines",
    "requiredFlags": ["lagos_mar"],
    "blockedFlags": ["completado_badoca_lagos"],
    "openAnswer": true,
    "minWords": 11,
    "containsAnyGroups": [["delfín", "delfin", "delfines"], ["ave", "pez", "movimiento", "aleta", "salpicadura", "guía", "guia", "sonido", "grupo"], ["evidencia", "buscar", "observar", "porque"]],
    "setFlags": ["completado_badoca_lagos"],
    "remember": { "kind": "field_method", "label": "Método de búsqueda de delfines" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Buen método. Hoy no se abre una ventana: habéis diseñado la investigación que necesitaremos en el mar." },
      { "from": "topotino", "time": "auto", "text": "Vasco ha reconocido la ruta y recuerda su Protocolo Azul: observar sin prometer y no confundir no ver con ausencia." },
      { "from": "topotino", "time": "auto", "text": "Para mañana: llegad con tiempo. Llevad protector solar y una chaqueta ligera para el barco." },
      { "from": "topotino", "time": "auto", "text": "Topoloco sabe ya cómo razonáis, así que mañana puede plantar una pista hecha a vuestra medida. Aceptad la incertidumbre y comparad fuentes. Ahora descansad junto a la marina; la salida es temprano." }
    ]
  },
  {
    "id": "dia20-impedimento",
    "blockedFlags": ["completado_badoca_lagos"],
    "containsAny": ["no podemos", "no hay safari", "cerrado", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Indicad qué parte ha cambiado. Si no hay safari, el etograma puede hacerse con otra especie observada de forma segura; si no llegáis a Lagos, modelaremos la orientación del lugar real." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Primero tres conductas observables; después dos posibles explicaciones.",
  "Comparad dos especies sin declarar una superior en todo.",
  "En Lagos: movimiento, infraestructura y protección u orientación.",
  "Para mañana diseñad un método, no una adivinanza."
]
```

## Pistas progresivas

```json
[
  "Evitad palabras como feliz, enfadado o travieso en el registro inicial.",
  "Cuello, patas, pico y vida en grupo pueden relacionarse con el uso del espacio.",
  "Marina, bocana y muralla cumplen funciones distintas.",
  "Guía, aves, bancos de peces y señales en superficie son fuentes posibles."
]
```

## Contexto para IA

Topotino descubre que Niebla estudia el método de los niños para Topoloco y que los Oscurnos los recuerdan de Francia y evitan acercarse. No afirma aún por qué. Recuerda el Protocolo Azul de Vasco y no promete delfines. Este día no abre ventana. Cuaderno privado.

## Fuentes documentales

- https://badoca.com/en/what-to-do/safari/
