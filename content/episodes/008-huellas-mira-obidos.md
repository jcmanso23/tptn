---
{
  "id": "008-huellas-mira-obidos",
  "order": 8,
  "title": "Día 4 · El animal ausente y la ciudad escrita",
  "channelCode": "T-47G2",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-16" }, "time": { "from": "08:00", "to": "23:59" } },
  "mission": "Leer lo que ya no está",
  "formulaWord": null,
  "water": "Agua del Tiempo Profundo",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Huellas, cueva y ciudad amurallada enseñan a inferir procesos ausentes mediante rastros. Gotas, mascota oficial de Mira de Aire, ayuda una vez. Topoloco intenta confundir copia con memoria desplazada.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. La primera señal tiene unos 175 millones de años, pero sigue indicando una dirección. Cuando veáis los rastros de saurópodos, elegid uno: decid hacia dónde avanzaba, qué os hace pensar que no caminaba hacia el lado contrario y qué NO podemos saber solo con esas huellas." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "huellas-inferencia",
    "blockedFlags": ["huellas_inferencia"],
    "openAnswer": true,
    "minWords": 14,
    "containsAnyGroups": [["huella", "pisada", "rastro"], ["dirección", "direccion", "avanzaba", "dedos", "talón", "talon", "separación", "separacion"], ["no sabemos", "no se puede", "color", "sonido", "edad", "velocidad", "porque"]],
    "setFlags": ["huellas_inferencia"],
    "remember": { "kind": "trace_inference", "label": "Inferencia y límite de evidencia en las huellas" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Una huella permite inferir dirección y modo de desplazamiento, pero no autoriza a inventar color, carácter o rugido. Topoloco ha dibujado bigote al saurópodo. Queda científicamente suspendido." },
      { "from": "topotino", "time": "auto", "text": "Siguiente pista: una montaña hueca descubierta en 1947. Dentro os espera Gotas, mascota de la cueva y viejo colega mío del gremio subterráneo. Localizad una forma que cuelgue y otra que crezca desde el suelo. Explicad qué papel desempeña el agua en ambas." }
    ]
  },
  {
    "id": "mira-aire-formaciones",
    "requiredFlags": ["huellas_inferencia"],
    "blockedFlags": ["mira_aire_formaciones"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["estalactita", "cuelga", "techo"], ["estalagmita", "suelo", "crece"], ["agua", "gota", "caliza", "disuelve", "deposita", "mineral"]],
    "setFlags": ["mira_aire_formaciones"],
    "remember": { "kind": "geology_explanation", "label": "Formación de estalactitas y estalagmitas" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gotas confirma vuestra explicación: el agua primero disuelve y transporta; después deja mineral. Quitar y construir pueden ser fases del mismo proceso." },
      { "from": "topotino", "time": "auto", "text": "Medid ahora el tiempo sin reloj: elegid una formación gruesa y otra fina y proponed dos explicaciones posibles para la diferencia. Después decid qué observación adicional necesitaríais para escoger entre ellas." }
    ]
  },
  {
    "id": "mira-aire-hipotesis",
    "requiredFlags": ["mira_aire_formaciones"],
    "blockedFlags": ["mira_aire_hipotesis"],
    "openAnswer": true,
    "minWords": 14,
    "containsAnyGroups": [["gruesa", "fina", "grande", "pequeña", "pequena"], ["agua", "tiempo", "gota", "mineral", "caudal", "edad"], ["hipótesis", "hipotesis", "podría", "podria", "necesitamos", "comparar", "medir"]],
    "setFlags": ["mira_aire_hipotesis"],
    "remember": { "kind": "multiple_hypotheses", "label": "Hipótesis rivales sobre formaciones de Mira de Aire" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Excelente: dos hipótesis y una prueba capaz de separarlas. Eso impide enamorarse de la primera explicación." },
      { "from": "topotino", "time": "auto", "text": "La salida de la cueva proyecta una puerta pintada y una calle que sube hacia un castillo. Es Óbidos. Recorred desde Porta da Vila hacia Rua Direita y localizad tres soportes de memoria diferentes: defensa, religión o arte, y un uso cultural actual. Explicad cómo cambia la función sin borrar el pasado." }
    ]
  },
  {
    "id": "obidos-soportes",
    "requiredFlags": ["mira_aire_hipotesis"],
    "blockedFlags": ["obidos_soportes"],
    "openAnswer": true,
    "minWords": 16,
    "containsAnyGroups": [["muralla", "puerta", "castillo", "defensa"], ["iglesia", "santa maria", "azulejo", "josefa", "arte"], ["libro", "librería", "libreria", "tienda", "cultura", "actual"], ["cambió", "cambio", "función", "funcion", "conserva", "pasado"]],
    "setFlags": ["obidos_soportes"],
    "remember": { "kind": "urban_memory", "label": "Tres soportes de memoria en Óbidos" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Muy bien. Muralla, iglesia y librería guardan de forma distinta: proteger, representar y reinterpretar. Una memoria puede cambiar de soporte sin desaparecer." },
      { "from": "topotino", "time": "auto", "text": "Última comprobación: en Santa Maria buscad una escena o figura entre los azulejos y el arte. Describid dos detalles visibles y separad observación de interpretación: «veo…» frente a «creo que significa…»." }
    ]
  },
  {
    "id": "obidos-observacion-interpretacion",
    "requiredFlags": ["obidos_soportes"],
    "blockedFlags": ["completado_huellas_mira_obidos"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["veo", "observamos", "detalle", "color", "figura", "azulejo", "cuadro"], ["creo", "interpretamos", "significa", "podría", "podria", "porque"]],
    "setFlags": ["completado_huellas_mira_obidos"],
    "remember": { "kind": "observation_interpretation", "label": "Separación de observación e interpretación en Óbidos" },
    "water": "Agua del Tiempo Profundo",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis marcado la frontera entre dato e interpretación. Topoloco cruza esa frontera corriendo y luego finge que nunca existió." },
      { "from": "topotino", "time": "auto", "text": "Ha despertado el Agua del Tiempo Profundo. Ahora recuerdo algo nuevo: mis recuerdos no fueron destruidos; fueron extraídos y repartidos en soportes distintos. Aún no sé dónde." },
      { "from": "topotino", "time": "auto", "text": "Mañana tendréis que distinguir un hueso real de un animal reconstruido y una hipótesis de una fantasía. Descansad dentro de la muralla. De noche, hasta una piedra sensata parece sospechosa." }
    ]
  },
  {
    "id": "dia16-impedimento",
    "blockedFlags": ["completado_huellas_mira_obidos"],
    "containsAny": ["no podemos", "cerrado", "no entramos", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Indicad qué parada concreta ha fallado. Os daré una investigación equivalente usando solo evidencias del lugar real; no habrá respuesta regaladita por el bigote de nadie." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Una inferencia válida dice qué muestra la huella y qué no puede mostrar.",
  "En la cueva: techo, suelo y papel del agua.",
  "En Óbidos necesito defensa, arte o religión y uso cultural actual.",
  "Separad literalmente lo que veis de lo que creéis que significa."
]
```

## Pistas progresivas

```json
[
  "La orientación de dedos y talón ayuda con la dirección.",
  "Estalactita: techo. Estalagmita: suelo.",
  "Rua Direita conecta la puerta con el castillo.",
  "Una descripción no contiene todavía la intención de la figura."
]
```

## Contexto para IA

Gotas puede saludar y corregir una confusión geológica, pero no resuelve las pruebas. Topotino admite límites. No pide material físico ni el cuaderno. Al final sabe que los recuerdos fueron extraídos y repartidos, sin conocer museo, número de aguas o destino final.

## Fuentes documentales

- https://www.icnf.pt/conservacao/rnapareasprotegidas/monumentosnaturais/mnpegadasdedinossauriosdeouremtorresnovas
- https://www.grutasmiradaire.com/en/
- https://turismo.obidos.pt/2021/04/09/rua-direita-main-street/
- https://turismo.obidos.pt/2020/07/30/igreja-de-santa-maria/
