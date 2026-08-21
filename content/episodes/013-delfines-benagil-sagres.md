---
{
  "id": "013-delfines-benagil-sagres",
  "order": 13,
  "title": "Día 9 · El calibrador del mar",
  "channelCode": "T-21A8",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-21" }, "location": { "lat": 37.1098806, "lng": -8.6748233, "radiusMeters": 1000, "label": "Marina de Lagos" } },
  "mission": "Bloquear el Calibrador Marino",
  "formulaWord": null,
  "water": "Agua del Horizonte",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Topotina recupera el canal con ayuda involuntaria de la firma que dejó Doctora Tecla. Durante la discusión, Tecla revela que Topoloco conectó un Calibrador Marino al Corrector. Quiere transformar sucesos imprevisibles en afirmaciones seguras: si hoy no aparece un delfín, escribirá que no existen; si encuentra el hueco de una cueva, lo llamará «nada» y borrará el proceso que la formó.

La pista de Louri conduce a una salida en barco desde Lagos. En el mar no hay cobertura. Paula y Hugo leen todas las observaciones antes de zarpar, guardan el móvil y siguen las instrucciones de la tripulación. Solo al regresar al puerto responden tres preguntas. Sus respuestas limitadas y verdaderas bloquean el calibrador. Topotina recupera entonces un archivo dirigido a Eco: está aprendiendo a copiar formas y voces. Después de una tarde sin aventura en la playa, la primera coordenada señala Ponta da Piedade para el día 22.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Canal recuperado. Tecla se ha marchado, Topoloco está fuera y sabemos qué buscaba: el Calibrador Marino." },
  { "from": "vasco", "time": "auto", "text": "El Protocolo Azul no promete delfines. Observar con respeto significa mantener distancia y aceptar también que quizá hoy no aparezcan." },
  { "from": "topotino", "time": "auto", "text": "En el mar no tendréis cobertura. Leed la expedición antes de salir y guardad el móvil. Las preguntas llegarán cuando volváis al puerto." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "delfines-incertidumbre",
    "blockedFlags": ["delfines_incertidumbre"],
    "openAnswer": true,
    "minWords": 8,
    "containsAnyGroups": [["delfín", "delfin", "delfines", "no vimos", "no aparecieron"], ["hoy", "condiciones", "momento", "observamos"], ["no demuestra", "no significa", "pueden", "porque"]],
    "setFlags": ["delfines_incertidumbre"],
    "remember": { "kind": "uncertain_field_observation", "label": "Búsqueda de delfines con resultado abierto" },
    "messages": [
      { "from": "vasco", "time": "auto", "text": "Exacto: contáis lo que ocurrió hoy sin convertirlo en una regla sobre todos los delfines." }
    ]
  },
  {
    "id": "cuevas-proceso-marino",
    "requiredFlags": ["delfines_incertidumbre"],
    "blockedFlags": ["cuevas_proceso_marino"],
    "openAnswer": true,
    "minWords": 8,
    "containsAnyGroups": [["cueva", "hueco", "entrada", "roca"], ["grieta", "fractura", "débil", "debil"], ["mar", "ola", "agua", "erosión", "erosion"], ["tiempo", "poco a poco", "porque"]],
    "setFlags": ["cuevas_proceso_marino"],
    "remember": { "kind": "geomorphology_process", "label": "Proceso observado en una cueva marina" },
    "messages": [
      { "from": "topotina", "time": "auto", "text": "El hueco no es «nada». Conserva el resultado de una grieta, la acción repetida del agua, la roca retirada y la roca que permanece." }
    ]
  },
  {
    "id": "calibrador-marino-bloqueado",
    "requiredFlags": ["cuevas_proceso_marino"],
    "blockedFlags": ["calibrador_marino_bloqueado"],
    "containsAny": ["calibrador bloqueado", "hemos respondido", "tres respuestas", "informe terminado"],
    "setFlags": ["calibrador_marino_bloqueado"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Calibrador bloqueado. Exigía una historia sin dudas y ha recibido observaciones con límites, condiciones y procesos." },
      { "from": "topotino", "time": "auto", "text": "Hemos impedido que Topoloco convierta vuestra salida real en una mentira perfecta." },
      { "from": "topotina", "time": "auto", "text": "He recuperado un archivo dirigido a Eco. Está reuniendo formas y voces para producir copias difíciles de distinguir." }
    ]
  },
  {
    "id": "ruta-dia22-ponta",
    "requiredFlags": ["calibrador_marino_bloqueado", "tarde_lagos_lista"],
    "blockedFlags": ["completado_delfines_benagil_sagres"],
    "containsAny": ["ponta da piedade", "ponta", "acantilados amarillos"],
    "setFlags": ["completado_delfines_benagil_sagres"],
    "water": "Agua del Horizonte",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Ponta da Piedade. Allí aprenderemos a distinguir formas reales antes de que Eco copie apariencias y voces." },
      { "from": "topotina", "time": "auto", "text": "La señal continuará después hacia el este del Algarve. Haced las maletas y preparad agua, protector solar y calzado con buen agarre." },
      { "from": "topotino", "time": "auto", "text": "Hoy la playa es descanso, no misión. Mañana continuamos." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "No ver un delfín hoy no demuestra que no viva en esta costa.",
  "Una cueva conserva un proceso: grietas, agua, roca retirada, roca que permanece y tiempo.",
  "Las respuestas se hacen al volver al puerto, nunca durante la navegación.",
  "La primera imagen de Eco muestra acantilados amarillos muy cerca de Lagos."
]
```

## Pistas progresivas

```json
[
  "Elegid la frase que no afirma más de lo observado.",
  "El mar puede agrandar una fractura poco a poco.",
  "El Calibrador falla cuando una respuesta distingue hechos, límites y dudas.",
  "La primera coordenada de mañana es Ponta da Piedade."
]
```

## Contexto para IA

Topotina y Vasco pueden conversar después del regreso al puerto. En el mar no se pide ninguna respuesta ni se presupone cobertura. El Calibrador Marino de Topoloco intenta convertir incertidumbre en certeza falsa. Las observaciones de Paula y Hugo lo bloquean de verdad y permiten recuperar la orden dirigida a Eco. No se propone ninguna visita adicional durante la tarde en la playa. A las 17:30 se puede preparar únicamente Ponta da Piedade como primera parada del 22 y pedir que hagan las maletas; no se revelan las paradas posteriores. No se revela Granada. El Cuaderno sigue privado.

## Fuentes documentales

- https://daysofadventure.com/
- https://www.cm-lagos.pt/
- https://percursos.cm-lagoa.pt/azul/p7
