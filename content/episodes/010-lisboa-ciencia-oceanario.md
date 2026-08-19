---
{
  "id": "010-lisboa-ciencia-oceanario",
  "order": 10,
  "title": "Día 6 · Un océano hecho de relaciones",
  "channelCode": "T-21A4",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-18" } },
  "mission": "Ver la red",
  "formulaWord": null,
  "water": "Agua del Océano Único",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Louri ya ha cerrado su canal y no participa. Al descubrir que había dejado de obedecerle, Topoloco atacó el chat e inyectó mensajes antiguos de Dino Parque para impedir que el grupo avanzara. Topotina confirma el ataque en el registro y repara el orden del canal con Topotino. El fragmento que Louri dejó antes de marcharse sobrevive y conduce al módulo de la Máquina de los Recuerdos que separa causas y relaciones. Pavilhão permite sabotear su clasificador cambiando una variable cada vez. El fallo señala después al Oceanário porque el módulo intenta separar especies que dependen unas de otras. Vasco enseña el Protocolo Azul sin resolver las pruebas. Después, el grupo descubre que Topoloco se refugia en Alfama y debe expulsarlo escuchando y contrastando una visita guiada desde Rossio. La siguiente señal apunta a los Jerónimos.

La explicación del sabotaje se activa por la fecha aunque la familia todavía no esté en el Pavilhão. La misión física del edificio permanece oculta hasta confirmar su llegada. Por la mañana solo se nombra el Pavilhão; Oceanário y la visita de Alfama se descubren después, uno a uno.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días, Paula y Hugo. Ayer Topoloco rompió el chat secreto porque se enfadó al saber que Louri había dejado de obedecerle." },
  { "from": "topotina", "time": "auto", "text": "Mezcló mensajes antiguos para hacernos volver a Dino Parque. Topotino y yo hemos reparado el orden del canal y bloqueado esas transmisiones." },
  { "from": "topotino", "time": "auto", "text": "La pista de Louri sobrevivió. Señala el Pavilhão do Conhecimento y un módulo de la Máquina de los Recuerdos. Hoy vamos a encontrarlo y sabotearlo." },
  { "from": "topotino", "time": "auto", "text": "Cuando lleguéis, pulsad Actualizar señal. Hasta entonces no abriré la misión del edificio." }
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
      { "from": "topotino", "time": "auto", "text": "Exacto: ventaja no es una propiedad aislada, es una relación. Id al Oceanário. Allí os espera Vasco, amigo de la red de Topotino." },
      { "from": "topotino", "time": "auto", "text": "Nació simbólicamente un 8 de junio, le encanta bucear y sabe más del océano que Rufino de tornillos. Y Rufino duerme abrazado a una llave inglesa." },
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
      { "from": "topotino", "time": "auto", "text": "También deja una regla: Protocolo Azul. Observar sin prometer, no confundir «no lo vimos» con «no existe», no molestar y devolver lo que debe seguir libre." },
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
      { "from": "topotino", "time": "auto", "text": "La sexta ventana se ha aclarado y las líneas entre todas han aparecido por un instante. Las Doce Aguas no parecen doce objetos: son una red de lugares y experiencias." },
      { "from": "topotino", "time": "auto", "text": "La siguiente línea sube por una colina de Lisboa, atraviesa calles de épocas distintas y sigue el Tejo hasta una torre que fue defensa y relato." },
      { "from": "topotino", "time": "auto", "text": "Descansad. Hoy habéis pensado como científicos de sistemas." }
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
  "Comparad el tanque y la visita de Alfama: una semejanza, dos diferencias y una conexión sobre cómo se construye un relato."
]
```

## Pistas progresivas

```json
[
  "No importa acertar primero; importa usar el resultado para corregir.",
  "Fijaos en superficie, columna de agua y fondo.",
  "Una red cambia si una relación deja de funcionar.",
  "Alfama y Mouraria conservaron parte de su trazado y reúnen historia, leyendas y memoria cultural."
]
```

## Contexto para IA

Vasco es aliado y nunca resuelve una misión. Enseña el Protocolo Azul, que Topotino recordará en la búsqueda de delfines y Zoomarine. Después, Topoloco se refugia en Alfama y el grupo debe escuchar una visita guiada desde Rossio, distinguir historia de leyenda y expulsarlo del barrio. La siguiente señal apunta a los Jerónimos. Cuaderno privado.

## Fuentes documentales

- https://www.pavconhecimento.pt/exposicoes/superbichos
- https://oceanario.pt/vasco/
- https://oceanario.pt/vasco/diverte-te-e-aprende/
- https://oceanario.pt/en/conservation/what-we-do-at-oceanario/center-for-species-survival/
- https://www.freetour.com/lisbon/alfama-free-walking-tour
