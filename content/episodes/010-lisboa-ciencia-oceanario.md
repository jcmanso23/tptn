---
{
  "id": "010-lisboa-ciencia-oceanario",
  "order": 10,
  "title": "Día 6 · Un océano hecho de relaciones",
  "channelCode": "T-68O4",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-18" }, "location": { "lat": 38.7622806, "lng": -9.0955818, "radiusMeters": 1000, "label": "Pavilhão do Conhecimento, Lisboa" } },
  "mission": "Ver la red",
  "formulaWord": null,
  "water": "Agua del Océano Único",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Pavilhão y Oceanário convierten módulos y especies en relaciones causales. Vasco, mascota oficial, entrega una pista sin resolverla. Aparece el número doce como nodos, todavía no como aguas.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. En Superbichos, buscad dos módulos de animales situados en partes distintas de la exposición." },
  { "from": "topotino", "time": "auto", "text": "Antes de usarlos, predecid qué adaptación representan. Después probadlos y corregid al menos una parte con la evidencia." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "pavilhao-dos-modulos",
    "blockedFlags": ["pavilhao_modulos"],
    "openAnswer": true,
    "minWords": 16,
    "containsAnyGroups": [["animal", "módulo", "modulo", "adaptación", "adaptacion"], ["predijimos", "pensábamos", "pensabamos", "antes"], ["probamos", "observamos", "resultado", "después", "despues"], ["cambiamos", "corregimos", "porque"]],
    "setFlags": ["pavilhao_modulos"],
    "remember": { "kind": "experiment_revision", "label": "Predicción y revisión en dos módulos de Superbichos" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Una adaptación no es magia: resuelve ciertos problemas en cierto ambiente y puede tener costes en otro." },
      { "from": "topotino", "time": "auto", "text": "Elegid una de las dos adaptaciones y cambiad una condición del entorno: temperatura, luz, alimento, depredador o medio. Defended si seguiría siendo ventaja, sería neutra o se volvería desventaja." }
    ]
  },
  {
    "id": "pavilhao-cambio-entorno",
    "requiredFlags": ["pavilhao_modulos"],
    "blockedFlags": ["pavilhao_entorno"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["entorno", "temperatura", "luz", "alimento", "depredador", "agua", "tierra"], ["ventaja", "desventaja", "neutra", "serviría", "serviria"], ["porque", "si cambia", "depende"]],
    "setFlags": ["pavilhao_entorno"],
    "remember": { "kind": "conditional_reasoning", "label": "Adaptación bajo un entorno cambiado" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto: ventaja no es una propiedad aislada, es una relación. Id al Oceanário. Vasco, su mascota oficial, me debe un favor desde un asunto con una sardina y un túnel. No preguntéis." },
      { "from": "topotino", "time": "auto", "text": "Ante el tanque central, escoged tres especies que ocupen zonas o se muevan de forma diferente. Para cada una relacionad una forma corporal o conducta con el lugar que ocupa. Después conectadlas mediante alimento, refugio, competencia o protección; no hace falta que una se coma a otra." }
    ]
  },
  {
    "id": "oceanario-red-especies",
    "requiredFlags": ["pavilhao_entorno"],
    "blockedFlags": ["oceanario_red"],
    "openAnswer": true,
    "minWords": 18,
    "containsAnyGroups": [["especie", "pez", "tiburón", "tiburon", "raya", "ave", "nutria", "animal"], ["forma", "aleta", "cuerpo", "conducta", "nada", "fondo", "superficie"], ["alimento", "refugio", "protección", "proteccion", "competencia", "relación", "relacion"], ["porque"]],
    "setFlags": ["oceanario_red"],
    "remember": { "kind": "ecological_network", "label": "Red de tres especies en el Oceanário" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Vasco confirma la red. El tanque contiene cinco millones de litros, pero su idea importante no es el volumen: representa un solo océano conectado." },
      { "from": "topotino", "time": "auto", "text": "Topoloco ha enviado un diagrama con doce círculos separados y la frase «doce cajas, doce dueños». Corregidlo: reorganizad mentalmente esos doce nodos como una red y explicad por qué cortar una conexión podría cambiar más de una parte." }
    ]
  },
  {
    "id": "oceanario-doce-nodos",
    "requiredFlags": ["oceanario_red"],
    "blockedFlags": ["oceanario_nodos"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["doce", "12", "nodo", "círculo", "circulo"], ["red", "conexión", "conexion", "relación", "relacion"], ["afecta", "cambia", "depende", "porque"]],
    "setFlags": ["oceanario_nodos"],
    "remember": { "kind": "systems_reasoning", "label": "Doce nodos entendidos como red" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Doce partes pueden formar un sistema. Todavía no sé qué representa el doce, pero Topoloco teme las conexiones más que los objetos." },
      { "from": "topotino", "time": "auto", "text": "Salid hacia el Tejo o miradlo desde el teleférico si lo usáis. Comparad el agua contenida del tanque con el río abierto: indicad una semejanza, dos diferencias y una conexión real entre ambos sistemas." }
    ]
  },
  {
    "id": "tejo-oceanario-comparacion",
    "requiredFlags": ["oceanario_nodos"],
    "blockedFlags": ["completado_lisboa_ciencia_oceanario"],
    "openAnswer": true,
    "minWords": 13,
    "containsAnyGroups": [["tanque", "oceanário", "oceanario"], ["tejo", "río", "rio"], ["semejanza", "ambos", "diferencia", "cerrado", "abierto"], ["conecta", "océano", "oceano", "agua", "porque"]],
    "setFlags": ["completado_lisboa_ciencia_oceanario"],
    "remember": { "kind": "system_comparison", "label": "Comparación entre tanque y Tejo" },
    "water": "Agua del Océano Único",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis comparado un sistema controlado con otro abierto sin confundirlos. El Tejo conecta ciudad y océano; el tanque ayuda a comprender sin sustituir el mar." },
      { "from": "topotino", "time": "auto", "text": "Ha despertado el Agua del Océano Único. Recuerdo doce destellos enlazados, no doce botellas. Topoloco los separó porque juntos cuentan algo que él no controla." },
      { "from": "topotino", "time": "auto", "text": "Mañana leeremos Lisboa como si fuera una excavación vertical y seguiremos el río hasta una torre que parece defensa y relato a la vez. Descansad; hoy habéis pensado como científicos de sistemas." }
    ]
  },
  {
    "id": "dia18-impedimento",
    "blockedFlags": ["completado_lisboa_ciencia_oceanario"],
    "containsAny": ["no podemos", "cerrado", "no funciona", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Decidme qué módulo o recinto no está disponible. Buscaré otra evidencia observable para conservar predicción, relación y comparación, sin adelantar una alternativa que quizá no necesitéis." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "La respuesta debe incluir predicción, prueba y una corrección.",
  "Una adaptación es ventaja solo respecto a un ambiente.",
  "Relacionad tres especies por forma, zona y una conexión.",
  "Comparad tanque y Tejo: una semejanza, dos diferencias, una conexión."
]
```

## Pistas progresivas

```json
[
  "No importa acertar primero; importa usar el resultado para corregir.",
  "Fijaos en superficie, columna de agua y fondo.",
  "Una red cambia si una relación deja de funcionar.",
  "El Tejo desemboca en el Atlántico."
]
```

## Contexto para IA

Vasco es aliado puntual y nunca resuelve una misión. Topotino conoce doce nodos conectados, no todavía las doce aguas ni Granada. No confunde exhibición con océano real. Cuaderno privado.

## Fuentes documentales

- https://www.pavconhecimento.pt/exposicoes/superbichos
- https://oceanario.pt/vasco/diverte-te-e-aprende/
- https://oceanario.pt/en/conservation/what-we-do-at-oceanario/center-for-species-survival/
