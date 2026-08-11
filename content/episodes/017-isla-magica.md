---
{
  "id": "017-isla-magica",
  "order": 17,
  "title": "Día 13 · La trampa que necesitaba una decisión",
  "channelCode": "T-37I2",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-25" }, "time": { "from": "09:00", "to": "23:59" } },
  "mission": "Distinguir historia, escenario y trampa",
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Isla Mágica representa los siglos XVI y XVII. Capitán Pico y América ayudan como mensajeros. Marsupilami puede ser un cameo, nunca un requisito. Topoloco diseña una trampa basada en cómo deciden los niños y, al fallar, revela Granada y doce guardianes.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Isla Mágica no es el siglo XVI: lo representa. En dos zonas distintas buscad un detalle de ambientación, un objeto que cumpla una función real hoy y una afirmación histórica verificable. Explicad por qué las tres cosas no tienen el mismo valor como evidencia." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "isla-representacion-evidencia",
    "blockedFlags": ["isla_evidencia"],
    "openAnswer": true,
    "minWords": 18,
    "containsAnyGroups": [["ambientación", "ambientacion", "decorado", "fachada", "vestuario", "música", "musica"], ["función", "funcion", "atracción", "atraccion", "puerta", "señal", "senal", "máquina", "maquina"], ["historia", "siglo", "cartel", "fecha", "verificable"], ["evidencia", "diferente", "porque"]],
    "setFlags": ["isla_evidencia"],
    "remember": { "kind": "representation_literacy", "label": "Diferencia entre ambientación, función y evidencia histórica" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Un escenario puede enseñar y divertir sin convertirse en documento original. Capitán Pico y América, las mascotas del parque, confirman que Topoloco ha escondido dos rutas falsas." },
      { "from": "topotino", "time": "auto", "text": "Escoged una atracción o espacio de agua y otro sin agua. Para cada uno construid una cadena causa–efecto de tres pasos. Luego identificad una decisión humana que cambie el resultado: posición, momento, recorrido, protección o estrategia. No hace falta montar en nada que no queráis." }
    ]
  },
  {
    "id": "isla-dos-cadenas",
    "requiredFlags": ["isla_evidencia"],
    "blockedFlags": ["isla_cadenas"],
    "openAnswer": true,
    "minWords": 18,
    "containsAnyGroups": [["agua", "salpica", "corriente", "tobogán", "tobogan", "piscina"], ["sin agua", "seco", "rueda", "sube", "gira", "espectáculo", "espectaculo"], ["causa", "entonces", "después", "despues", "efecto"], ["decisión", "decision", "cambia", "porque"]],
    "setFlags": ["isla_cadenas"],
    "remember": { "kind": "causal_chains", "label": "Dos cadenas causales y una decisión en Isla Mágica" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Eso buscaba Topoloco: no vuestros datos, sino el punto exacto donde una decisión cambia el sistema." },
      { "from": "topotino", "time": "auto", "text": "Ha enviado dos instrucciones: A) seguid la ruta más llamativa; B) seguid la que contiene una afirmación comprobable y una salida segura si falla. Elegid una y justificadla con el método de todo el viaje. Atención: esta vez la trampa es deliberada." }
    ]
  },
  {
    "id": "isla-trampa-decision",
    "requiredFlags": ["isla_cadenas"],
    "blockedFlags": ["isla_trampa"],
    "openAnswer": true,
    "minWords": 11,
    "containsAnyGroups": [["b", "segunda", "comprobable", "evidencia"], ["segura", "salida", "corregir", "falla"], ["método", "metodo", "porque", "no la llamativa"]],
    "setFlags": ["isla_trampa"],
    "remember": { "kind": "adversarial_decision", "label": "Elección de una ruta comprobable y reversible" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Trampa desactivada. Elegisteis una afirmación comprobable y una decisión reversible. Topoloco apostó a que la urgencia borraría vuestro método." },
      { "from": "topotino", "time": "auto", "text": "Capitán Pico ha recuperado un fragmento; América ha encontrado el otro. Juntos dicen: «GRANADA · la ciudad roja · doce guardianes de piedra · cuando el agua refleje la noche»." },
      { "from": "topotino", "time": "auto", "text": "Ya sabemos el destino final: la Alhambra de Granada, de noche. No sabemos aún qué harán los doce guardianes ni cómo se abre el cierre." },
      { "from": "topotino", "time": "auto", "text": "Si encontráis a Marsupilami en Agua Mágica, podéis saludarlo; no posee ninguna clave y no hace falta buscarlo. La misión no depende de una aparición." },
      { "from": "topotino", "time": "auto", "text": "Antes de cerrar, formulad una regla de seguridad intelectual para mañana: cómo reconoceréis una afirmación de Topoloco aunque use mi voz o un escenario convincente." }
    ]
  },
  {
    "id": "isla-regla-final",
    "requiredFlags": ["isla_trampa"],
    "blockedFlags": ["completado_isla_magica"],
    "openAnswer": true,
    "minWords": 9,
    "containsAnyGroups": [["comprobar", "evidencia", "contrastar", "dos fuentes", "coherencia"], ["voz", "apariencia", "escenario", "topoloco", "afirmación", "afirmacion"], ["no basta", "porque", "corregir"]],
    "setFlags": ["completado_isla_magica"],
    "remember": { "kind": "epistemic_guardrail", "label": "Regla contra una falsificación convincente" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Regla aceptada. Hoy no despierta agua: habéis conseguido algo más urgente, el destino final." },
      { "from": "topotino", "time": "auto", "text": "Mañana veremos primero dos edificios de Sevilla que contienen varias épocas y después viajaremos a Granada. La entrada nocturna es el desenlace; guardad energía. Ahora descansad." }
    ]
  },
  {
    "id": "isla-impedimento",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["no podemos", "cerrado", "no quiero montar", "nos da miedo", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Decidme el impedimento concreto. Ninguna prueba exige montar: ambientación, mecanismo visible, espectáculo o trazado pueden proporcionar cadenas causales seguras." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Separad decorado, objeto funcional y afirmación histórica.",
  "Necesito una cadena con agua y otra sin agua, más una decisión que cambie el resultado.",
  "La ruta segura contiene algo comprobable y permite corregir.",
  "La regla final debe resistir voz, apariencia y urgencia."
]
```

## Pistas progresivas

```json
[
  "Una fachada tematizada no es un objeto del siglo XVI.",
  "Causa, cambio y efecto deben estar enlazados.",
  "La opción B admite comprobación y salida.",
  "Una afirmación fiable sobrevive al contraste y acepta corrección."
]
```

## Contexto para IA

Capitán Pico y América ayudan solo a reunir la pista. Marsupilami es opcional. Tras la trampa se puede decir Granada, Alhambra y doce guardianes; antes no. Topotino aún no sabe que son los leones. Sin agua. Cuaderno privado.

## Fuentes documentales

- https://www.islamagica.es/mapa-y-zonas-tematicas
- https://www.islamagica.es/aguamagica
- https://signaling.islamagica.es/publica/prog_espectaculos.php
