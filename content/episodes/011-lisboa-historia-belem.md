---
{
  "id": "011-lisboa-historia-belem",
  "order": 11,
  "title": "Día 7 · La ciudad que volvió a levantarse",
  "channelCode": "T-72L1",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-19" }, "location": { "lat": 38.7139258, "lng": -9.1334830, "radiusMeters": 1000, "label": "Castelo de São Jorge, Lisboa" } },
  "mission": "Leer una ciudad por capas",
  "formulaWord": null,
  "water": "Agua de la Ciudad que Regresa",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Castelo, Alfama, Baixa y Belém muestran ocupación, transformación y reconstrucción. Un pavo real del castillo es conocido de Topotino, pero no se alimenta ni da soluciones. Topoloco vuelve a confundir supervivencia con inmovilidad.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Subid al Castelo de São Jorge con los adultos. Si veis un pavo real, no lo alimentéis: uno de ellos es conocido mío, pero exagera muchísimo. Desde un punto alto, elegid dos rasgos del terreno que expliquen por qué una fortificación resulta útil allí y una dificultad que la colina crea para quienes viven en la ciudad." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "castelo-topografia",
    "blockedFlags": ["castelo_topografia"],
    "openAnswer": true,
    "minWords": 13,
    "containsAnyGroups": [["alto", "colina", "vista", "pendiente", "río", "rio"], ["defensa", "vigilar", "ver", "acceso", "atacar"], ["dificulta", "subir", "transportar", "caminar", "agua", "porque"]],
    "setFlags": ["castelo_topografia"],
    "remember": { "kind": "terrain_reasoning", "label": "Ventajas y costes de la colina del Castelo" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. La misma pendiente puede proteger y complicar la vida: ventaja y coste dependen de la pregunta." },
      { "from": "topotino", "time": "auto", "text": "En el núcleo arqueológico, localizad tres capas de ocupación distintas —por ejemplo Edad del Hierro, contactos fenicios, barrio islámico o transformaciones posteriores—. Para cada una citad un objeto, estructura o cartel que la sostenga. Después decid por qué una capa posterior no borra por completo la anterior." }
    ]
  },
  {
    "id": "castelo-capas",
    "requiredFlags": ["castelo_topografia"],
    "blockedFlags": ["castelo_capas"],
    "openAnswer": true,
    "minWords": 17,
    "containsAnyGroups": [["hierro", "fenicio", "islámico", "islamico", "medieval", "terremoto", "capa"], ["muro", "casa", "patio", "objeto", "cartel", "resto"], ["encima", "debajo", "conserva", "no borra", "porque"]],
    "setFlags": ["castelo_capas"],
    "remember": { "kind": "archaeological_layers", "label": "Tres capas arqueológicas del Castelo" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Bien. Topoloco habría llamado «desorden» a la superposición. Vosotros habéis leído una secuencia." },
      { "from": "topotino", "time": "auto", "text": "Bajad a pie con los adultos por Alfama hasta la Sé. Elegid una calle curva o con pendiente." },
      { "from": "topotino", "time": "auto", "text": "Continuad hasta Baixa y buscad dos calles más rectas. Comparad anchura, pendiente, plazas y planificación con al menos tres evidencias." }
    ]
  },
  {
    "id": "alfama-baixa-comparacion",
    "requiredFlags": ["castelo_capas"],
    "blockedFlags": ["alfama_baixa"],
    "openAnswer": true,
    "minWords": 17,
    "containsAnyGroups": [["alfama"], ["baixa"], ["estrecha", "estrecho", "ancha", "recta", "curva", "pendiente", "cuadrícula", "cuadricula"], ["planificada", "terreno", "porque", "evidencia"]],
    "setFlags": ["alfama_baixa"],
    "remember": { "kind": "urban_comparison", "label": "Comparación del trazado de Alfama y Baixa" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Comparación sólida. Una ciudad que vuelve a levantarse no vuelve idéntica: aprende, decide y también pierde cosas." },
      { "from": "topotino", "time": "auto", "text": "En Belém, dividíos intelectualmente: una persona investiga Jerónimos y otra la Torre. En el monasterio buscad tres motivos manuelinos; en la torre, separad un elemento defensivo de dos símbolos o decoraciones. Reunid después ambas miradas y explicad cómo el viaje marítimo aparece en piedra." }
    ]
  },
  {
    "id": "belem-dos-miradas",
    "requiredFlags": ["alfama_baixa"],
    "blockedFlags": ["belem_miradas"],
    "openAnswer": true,
    "minWords": 18,
    "containsAnyGroups": [["jerónimos", "jeronimos", "monasterio"], ["torre", "belém", "belem"], ["cuerda", "nudo", "esfera", "cruz", "mar", "planta", "animal", "ventana"], ["defensa", "cañón", "canon", "viaje", "navegación", "navegacion", "piedra"]],
    "setFlags": ["belem_miradas"],
    "remember": { "kind": "paired_investigation", "label": "Dos miradas reunidas sobre Jerónimos y Torre de Belém" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias a los dos. Una mirada encontró lenguaje simbólico; la otra distinguió defensa y representación. Juntas son más precisas que cualquiera por separado." },
      { "from": "topotino", "time": "auto", "text": "Última pregunta: escoged un elemento visto hoy que sobrevivió, otro que fue reconstruido o transformado y otro cuyo uso cambió. Defended por qué los tres pueden conservar memoria sin ser idénticos a su origen." }
    ]
  },
  {
    "id": "lisboa-tres-memorias",
    "requiredFlags": ["belem_miradas"],
    "blockedFlags": ["completado_lisboa_historia_belem"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["sobrevivió", "sobrevivio", "conserva"], ["reconstruido", "transformado", "cambió", "cambio"], ["uso", "función", "funcion"], ["memoria", "origen", "porque"]],
    "setFlags": ["completado_lisboa_historia_belem"],
    "remember": { "kind": "memory_transformation", "label": "Supervivencia, reconstrucción y cambio de uso en Lisboa" },
    "water": "Agua de la Ciudad que Regresa",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Eso era. Conservación no significa inmovilidad. Ha despertado el Agua de la Ciudad que Regresa." },
      { "from": "topotino", "time": "auto", "text": "Recuerdo que el supuesto museo de Topoloco no era un edificio normal: él llamaba «exposición» a congelar una sola versión y eliminar las demás. Yo intenté impedirlo." },
      { "from": "topotino", "time": "auto", "text": "Mañana cambiaremos piedra por animales vivos. Necesitaré observaciones sin suponer intenciones. Cenad y descansad; hoy Lisboa os ha hecho subir suficiente para tres topos y medio." }
    ]
  },
  {
    "id": "dia19-impedimento",
    "blockedFlags": ["completado_lisboa_historia_belem"],
    "containsAny": ["no podemos", "cerrado", "demasiada cola", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Decidme qué recinto no podéis visitar. Usaremos exteriores y trazado urbano para mantener la lectura de capas, pero no daré por observado lo que no habéis visto." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "La colina ofrece una ventaja defensiva y también impone un coste cotidiano.",
  "Cada capa necesita una evidencia física o un cartel del lugar.",
  "Comparad Alfama y Baixa con anchura, rectitud, pendiente y planificación.",
  "Jerónimos y Torre deben aportar hallazgos diferentes que luego conectéis."
]
```

## Pistas progresivas

```json
[
  "Desde arriba se controla el acceso, pero todo debe subir.",
  "Buscad patios o estructuras de viviendas islámicas.",
  "La Baixa muestra calles más rectas y regulares.",
  "Cuerdas, nudos y esfera armilar convierten navegación en piedra."
]
```

## Contexto para IA

El pavo real es un chiste puntual; nunca se alimenta. Topotino sabe que el museo congela una versión única. No sabe su destino final ni que Topoloco causó la amnesia. Respeta el cuaderno privado.

## Fuentes documentales

- https://castelodesaojorge.pt/en/castle/archaeology/archaeological-centre/
- https://castelodesaojorge.pt/en/castle/collections/museum-centre/
- https://castelodesaojorge.pt/en/faq/
- https://www.patrimoniocultural.gov.pt/pat_mun/mosteiros-dos-jeronimos-e-torre-de-belem-em-lisboa/
- https://www.patrimoniocultural.gov.pt/pat_mun/torre-de-belem/
