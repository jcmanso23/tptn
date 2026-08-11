---
{
  "id": "015-zoomarine",
  "order": 15,
  "title": "Día 11 · Cuidar no es poseer",
  "channelCode": "T-18Z5",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-23" }, "location": { "lat": 37.1249791, "lng": -8.3154346, "radiusMeters": 5000, "label": "Zoomarine Algarve" } },
  "mission": "Devolver lo que debe ser libre",
  "formulaWord": null,
  "water": "Agua del Cuidado",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Zoomarine sirve para diferenciar observación, educación, rescate y rehabilitación. El eje ético es que cuidar no otorga propiedad. Las pruebas no dependen de ver un animal concreto.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Topoloco afirma: «si cuidas algo, te pertenece». Buscad primero información de Porto d’Abrigo." },
  { "from": "topotino", "time": "auto", "text": "Reconstruid un rescate: llegada, diagnóstico, rehabilitación y posible retorno. Para cada fase indicad qué decisión necesita evidencia." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "zoomarine-rehabilitacion",
    "blockedFlags": ["zoomarine_rehabilitacion"],
    "openAnswer": true,
    "minWords": 18,
    "containsAnyGroups": [["aviso", "rescate", "llegada"], ["diagnóstico", "diagnostico", "examinar", "salud"], ["rehabilitación", "rehabilitacion", "recuperar", "tratamiento"], ["retorno", "devolver", "mar", "liberar"], ["evidencia", "decidir", "porque"]],
    "setFlags": ["zoomarine_rehabilitacion"],
    "remember": { "kind": "care_process", "label": "Proceso razonado de rescate y rehabilitación" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Ayudar exige decisiones revisables, no apropiación. Porto d’Abrigo fue creado en 2002 y trabaja para devolver animales cuando es viable." },
      { "from": "topotino", "time": "auto", "text": "Elegid una especie observada hoy. Separad tres columnas mentales: característica corporal, conducta que realmente veis y función probable. Añadid una explicación alternativa para no confundir una presentación con toda su vida natural." }
    ]
  },
  {
    "id": "zoomarine-especie",
    "requiredFlags": ["zoomarine_rehabilitacion"],
    "blockedFlags": ["zoomarine_especie"],
    "openAnswer": true,
    "minWords": 16,
    "containsAnyGroups": [["delfín", "delfin", "foca", "ave", "tortuga", "animal", "especie"], ["cuerpo", "aleta", "pico", "piel", "forma"], ["conducta", "nadó", "nado", "voló", "volo", "comió", "comio", "movió", "movio"], ["función", "funcion", "podría", "podria", "alternativa"]],
    "setFlags": ["zoomarine_especie"],
    "remember": { "kind": "animal_evidence", "label": "Cuerpo, conducta e hipótesis sobre una especie" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Muy bien. Ver una conducta aquí aporta datos, pero no resume toda la vida de la especie. Habéis mantenido abierta una alternativa." },
      { "from": "topotino", "time": "auto", "text": "Moveos ahora a otra zona de animales o educación. Buscad una norma para visitantes y una medida de cuidado que use el equipo." },
      { "from": "topotino", "time": "auto", "text": "Comparadlas con Porto d’Abrigo. Decid cuál protege evitando molestias, cuál requiere profesionales y por qué alimentar o retener puede hacer daño." }
    ]
  },
  {
    "id": "zoomarine-decisiones",
    "requiredFlags": ["zoomarine_especie"],
    "blockedFlags": ["zoomarine_decisiones"],
    "openAnswer": true,
    "minWords": 17,
    "containsAnyGroups": [["profesionales", "avisar", "herido"], ["distancia", "ruido", "molestar"], ["alimentar", "comida", "permiso"], ["conservar", "poseer", "devolver", "liberar"], ["orden", "porque"]],
    "setFlags": ["zoomarine_decisiones"],
    "remember": { "kind": "field_ethics", "label": "Normas y decisiones de protección observadas en Zoomarine" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Argumentación aceptada. Habéis comparado cuidado profesional y conducta de visitantes en dos lugares del parque." },
      { "from": "topotino", "time": "auto", "text": "Proteger puede exigir apartarse y devolver; querer cerca no siempre es cuidar." },
      { "from": "topotino", "time": "auto", "text": "Aplicadlo al plan: Topoloco dice que mis recuerdos le pertenecen porque los «salvó» del eclipse. Refutadlo con una analogía precisa del rescate animal y señalad dónde falla la comparación." }
    ]
  },
  {
    "id": "zoomarine-refutacion",
    "requiredFlags": ["zoomarine_decisiones"],
    "blockedFlags": ["completado_zoomarine"],
    "openAnswer": true,
    "minWords": 13,
    "containsAnyGroups": [["recuerdo", "memoria", "topotino"], ["rescate", "rehabilitar", "animal", "cuidar"], ["devolver", "pertenece", "dueño", "dueno", "poseer"], ["falla", "porque"]],
    "setFlags": ["completado_zoomarine"],
    "remember": { "kind": "ethical_refutation", "label": "Refutación de la propiedad de los recuerdos" },
    "water": "Agua del Cuidado",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto. Si realmente los hubiera protegido, su objetivo sería devolverlos sin imponer una versión. Retenerlos y borrar relaciones es apropiación, no cuidado." },
      { "from": "topotino", "time": "auto", "text": "Ha despertado el Agua del Cuidado. Y he recuperado una certeza: Topoloco provocó mi amnesia para que dejara de frustrar su plan. Aún no puedo demostrar el mecanismo completo, pero ya conocemos motivo, conducta y resultado." },
      { "from": "topotino", "time": "auto", "text": "Mañana comprobaremos una memoria urbana muy repetida que quizá sea falsa. Después cruzaremos otra frontera y otro río. Descansad; hoy habéis derrotado una idea peligrosa, no solo una prueba." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "El proceso debe incluir llegada, diagnóstico, rehabilitación y posible retorno.",
  "Separad cuerpo, conducta observada y función probable.",
  "Cuidar puede exigir distancia, profesionales y devolución.",
  "Los recuerdos no pasan a ser propiedad de quien los retiene."
]
```

## Pistas progresivas

```json
[
  "Una liberación depende de que el animal pueda sobrevivir.",
  "Una presentación es una situación concreta, no toda la especie.",
  "Alimentar sin indicación puede dañar.",
  "Rescatar para no devolver contradice el objetivo de rehabilitar."
]
```

## Contexto para IA

Al final Topotino concluye que Topoloco causó la amnesia, como inferencia muy fuerte apoyada por motivo y conducta, pero admite que falta el mecanismo. No trivializa bienestar animal. Cuaderno privado.

## Fuentes documentales

- https://www.zoomarine.pt/pt/
- https://www.zoomarine.pt/en/togetherweprotect/about-us-twp/
- https://www.zoomarine.pt/en/discover-the-park/presentations/
