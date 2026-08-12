---
{
  "id": "007-bucaco-batalha-fatima",
  "order": 7,
  "title": "Día 3 · El bosque, la promesa y el lugar pequeño",
  "channelCode": "T-31B5",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-15" }, "location": { "lat": 40.3755835, "lng": -8.3619487, "radiusMeters": 5000, "label": "Mata Nacional do Buçaco" } },
  "mission": "La promesa que no se ve",
  "formulaWord": null,
  "water": "Agua de la Promesa",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Buçaco, Batalha y Fátima forman una investigación sobre capas, promesas y escala. Topoloco deja una ruta falsa que confunde lo más grande con lo más importante. La red necesita esa distinción para encontrar su cuarta conexión. Topotino recupera la promesa de confiar en Paula y Hugo, no el detalle de su memoria anterior al eclipse.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "requiredFlags": ["completado_magikland_curia"], "text": "Buenos días, investigadores. La nota de anoche decía «donde el bosque bebe del cielo». He localizado un bosque con convento, ermitas, una batalla y un palacio dentro de la misma arboleda. Decidme el nombre cuando estéis allí y explicad qué dos pistas lo distinguen de un bosque corriente." },
  { "from": "topotino", "time": "auto", "blockedFlags": ["completado_magikland_curia"], "text": "Mi señal anterior no llegó completa, así que no inventaré lo ocurrido. Hoy buscamos un bosque portugués con convento, ermitas, memoria de una batalla y un palacio. Identificadlo al llegar y justificadlo con dos pruebas visibles." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "bucaco-identificado",
    "blockedFlags": ["bucaco_identificado"],
    "openAnswer": true,
    "minWords": 7,
    "containsAnyGroups": [["buçaco", "bucaco", "busaco"], ["convento", "palacio", "ermita", "bosque", "batalla", "fonte fria"]],
    "setFlags": ["bucaco_identificado"],
    "remember": { "kind": "place_identification", "label": "Identificación razonada de Buçaco" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Buçaco confirmado. Gracias por relacionar lugar y evidencias. Aquí conviven al menos cuatro capas: bosque, retiro carmelita desde 1628, batalla de 1810 y etapa romántica del palacio." },
      { "from": "topotino", "time": "auto", "text": "Empezad ante el Palace Hotel. Pasad después por el Convento de Santa Cruz y elegid un tercer elemento del bosque o una ermita." },
      { "from": "topotino", "time": "auto", "text": "Ordenad las tres capas usando forma, material, función o cartel. Decid también qué dato os falta para estar seguros." }
    ]
  },
  {
    "id": "bucaco-capas",
    "requiredFlags": ["bucaco_identificado"],
    "blockedFlags": ["bucaco_capas"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["antiguo", "primero", "después", "despues", "reciente", "orden"], ["árbol", "arbol", "convento", "ermita", "palacio", "fuente", "batalla"], ["porque", "material", "función", "funcion", "cartel", "fecha", "falta", "seguro"]],
    "setFlags": ["bucaco_capas"],
    "remember": { "kind": "historical_layers", "label": "Orden razonado de tres capas de Buçaco" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Eso es pensar históricamente: ordenar, justificar y declarar la incertidumbre. Topoloco habría fechado todo por lo verde que esté. Método científico del brócoli." },
      { "from": "topotino", "time": "auto", "text": "Ahora localizad Fonte Fria. Sin contar escalones uno por uno, explicad cómo consigue el agua bajar por la estructura y qué cambiaría en su recorrido si la pendiente fuera menor. No toquéis ni recojáis agua." }
    ]
  },
  {
    "id": "bucaco-fonte-fria",
    "requiredFlags": ["bucaco_capas"],
    "blockedFlags": ["bucaco_fonte"],
    "openAnswer": true,
    "minWords": 9,
    "containsAnyGroups": [["fonte fria", "fuente", "agua", "escalones"], ["gravedad", "pendiente", "baja", "desnivel"], ["lento", "rápido", "rapido", "recorrido", "energía", "energia"]],
    "setFlags": ["bucaco_fonte"],
    "remember": { "kind": "causal_observation", "label": "Explicación del agua y la pendiente en Fonte Fria" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Correcto: la arquitectura guía el agua, pero la gravedad hace el trabajo. En la piedra ha aparecido una frase: «una promesa levantó una iglesia; lo inacabado dice la verdad». Buscad el monasterio que encaja y escribid BATALHA cuando estéis ante él." }
    ]
  },
  {
    "id": "batalha-llegada",
    "requiredFlags": ["bucaco_fonte"],
    "blockedFlags": ["batalha_llegada"],
    "match": ["batalha", "estamos en batalha", "hemos llegado a batalha"],
    "setFlags": ["batalha_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Batalha localizada. Recorred la iglesia o el Claustro Real y terminad en las Capelas Imperfeitas, abiertas al cielo." },
      { "from": "topotino", "time": "auto", "text": "Relacionad la promesa que originó el monasterio con algo terminado y algo inacabado que veáis. Explicad por qué lo incompleto también cuenta verdad." }
    ]
  },
  {
    "id": "batalha-capelas",
    "requiredFlags": ["bucaco_fonte", "batalha_llegada"],
    "blockedFlags": ["batalha_resuelto"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["batalha"], ["capelas", "capillas", "imperfectas", "inacabadas", "sin techo"], ["promesa", "independencia", "obra", "porque", "evidencia"]],
    "setFlags": ["batalha_resuelto"],
    "remember": { "kind": "heritage_reasoning", "label": "Promesa y obra inacabada en Batalha" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. El monasterio recuerda una promesa; las capillas no esconden que una intención puede quedar abierta. Estar inacabado no convierte algo en mentira." },
      { "from": "topotino", "time": "auto", "text": "Topoloco ha escrito: «lo mayor siempre es el centro». Al llegar a Fátima, id primero a la Capelinha y cruzad después la explanada hasta una basílica." },
      { "from": "topotino", "time": "auto", "text": "Comparad qué ocupa el centro simbólico y qué ocupa más espacio físico. No confundáis tamaño con importancia." }
    ]
  },
  {
    "id": "fatima-escala",
    "requiredFlags": ["batalha_resuelto"],
    "blockedFlags": ["completado_bucaco_batalha_fatima"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["capelinha", "capilla"], ["basílica", "basilica", "grande", "pequeña", "pequena", "espacio"], ["centro", "importante", "símbolo", "simbolo", "testimonio", "tradición", "tradicion", "porque"]],
    "setFlags": ["completado_bucaco_batalha_fatima"],
    "remember": { "kind": "scale_reasoning", "label": "Diferencia entre escala física y centralidad en Fátima" },
    "water": "Agua de la Promesa",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto. Habéis separado tamaño, posición y significado, y habéis tratado un lugar de fe con respeto: una cosa es lo observable y otra el testimonio que una comunidad conserva." },
      { "from": "topotino", "time": "auto", "text": "He recordado una promesa mía: si volvía a perderme dentro de mis propios recuerdos, confiaría en las dos versiones que Paula y Hugo pudieran comprobar juntos. No recuerdo cuándo la hice, pero sí por qué: una sola mirada deja puntos ciegos." },
      { "from": "topotino", "time": "auto", "text": "La cuarta ventana del mapa se ha aclarado. No guarda líquido: conecta palabra, evidencia y acción. Topoloco acaba de perder su apuesta de hoy." },
      { "from": "topotino", "time": "auto", "text": "La ventana siguiente muestra pasos de un animal que ya no existe y agua trabajando bajo tierra. Tendremos que seguir ambos rastros." },
      { "from": "topotino", "time": "auto", "text": "Preparad calzado con buena suela y una capa ligera: dentro de una cueva puede refrescar." },
      { "from": "topotino", "time": "auto", "text": "Por hoy, basta. Cenad y descansad. Y no soñéis con contar 147 metros de pisadas: se puede medir mejor." }
    ]
  },
  {
    "id": "dia15-impedimento",
    "blockedFlags": ["completado_bucaco_batalha_fatima"],
    "containsAny": ["no podemos", "está cerrado", "esta cerrado", "llueve", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Decidme qué lugar o condición concreta impide continuar. Mantendré la misma pregunta intelectual con evidencias del sitio que sí podáis observar; no voy a fingir que habéis estado donde no estáis." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "En Buçaco necesito tres capas ordenadas y una razón visible para cada una.",
  "En Fonte Fria relacionad desnivel, gravedad y velocidad del agua.",
  "En Batalha unid promesa, monasterio y Capelas Imperfeitas.",
  "En Fátima comparad espacio físico con centralidad simbólica."
]
```

## Pistas progresivas

```json
[
  "El bosque de Buçaco contiene convento, palacio y memoria de una batalla.",
  "La pendiente no empuja: permite que la gravedad transforme altura en movimiento.",
  "Buscad las capillas que permanecen abiertas al cielo.",
  "La Capelinha es mucho menor que las basílicas, pero ocupa el corazón del recinto."
]
```

## Contexto para IA

Topotino recuerda las respuestas nuevas, no el pasado anterior al eclipse. Agradece argumentos concretos. No presenta alternativas hasta conocer un impedimento. Mantiene la distinción entre evidencia histórica, tradición y fe. Conoce el mapa y su nombre, pero no entiende todavía qué conecta la red. No revela el museo, Granada ni la causa confirmada de la amnesia. El Cuaderno de la Memoria es privado.

## Fuentes documentales

- https://fmb.pt/fundacao/sobre-a-fundacao/historia/
- https://fmb.pt/fundacao/?lang=en
- https://www.patrimoniocultural.gov.pt/pat_mun/mosteiro-da-batalha/
- https://www.santuario-fatima.pt/pt/pages/lugares-das-aparicoes
- https://www.santuario-fatima.pt/pt/pages/lugares-de-culto-e-oracao
