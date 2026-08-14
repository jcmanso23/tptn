---
{
  "id": "017-isla-magica",
  "order": 17,
  "title": "Día 13 · La trampa que necesitaba una decisión",
  "channelCode": "T-37I2",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-25" }, "location": { "lat": 37.4077506, "lng": -5.9998062, "radiusMeters": 1000, "label": "Isla Mágica, Sevilla" } },
  "mission": "Distinguir historia, escenario y trampa",
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Isla Mágica representa los siglos XVI y XVII y es la estación gemela de Magikland. Retoma la distinción aprendida en Portugal dos Pequenitos: una representación puede enseñar sin convertirse en el edificio o la época original. Capitán Pico y América no son mascotas decorativas: son aliados de Topotino y convierten a Paula y Hugo en pequeños exploradores para buscar dos partes de la señal. Krim, duende del Mundo de los Colores, ayuda a separar emoción y decisión mediante color, cuento y juego. Niebla combina ruido, emoción y urgencia en una trampa basada en cómo deciden los niños. Paula y Hugo la vuelven contra él y el fallo revela Granada y doce guardianes.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Isla Mágica no es el siglo XVI: lo representa. Elegid dos zonas separadas del mapa y caminad de una a otra." },
  { "from": "topotino", "time": "auto", "text": "Aplicad lo aprendido en Portugal dos Pequenitos: buscad ambientación, un objeto con función real hoy y una afirmación histórica verificable." }
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
      { "from": "topotino", "time": "auto", "text": "Gracias. Un escenario puede enseñar y divertir sin convertirse en documento original." },
      { "from": "topotino", "time": "auto", "text": "Capitán Pico y América os nombran pequeños exploradores. Han encontrado dos rutas falsas de Topoloco, pero cada una contiene media señal verdadera." },
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
      { "from": "topotino", "time": "auto", "text": "Krim ha detectado colores de prisa, emoción y miedo a perderse algo. Sentirlos es normal; obedecerlos sin pensar es otra cosa." },
      { "from": "topotino", "time": "auto", "text": "Niebla envía dos rutas: A) la más llamativa y urgente; B) una afirmación comprobable con salida segura si falla." },
      { "from": "topotino", "time": "auto", "text": "Elegid una. Decid qué emoción intenta usar Niebla, qué evidencia comprobaréis y cómo podréis corregir sin quedar atrapados." }
    ]
  },
  {
    "id": "isla-trampa-decision",
    "requiredFlags": ["isla_cadenas"],
    "blockedFlags": ["isla_trampa"],
    "openAnswer": true,
    "minWords": 11,
    "containsAnyGroups": [["b", "segunda", "comprobable", "evidencia"], ["segura", "salida", "corregir", "falla"], ["emoción", "emocion", "prisa", "miedo", "ilusión", "ilusion", "urgencia"], ["método", "metodo", "porque", "no la llamativa"]],
    "setFlags": ["isla_trampa"],
    "remember": { "kind": "adversarial_decision", "label": "Elección de una ruta comprobable y reversible" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Contratrampa completada. Elegisteis una afirmación comprobable, reconocisteis la emoción y mantuvisteis una salida. Niebla creyó que la urgencia borraría vuestro método." },
      { "from": "topotino", "time": "auto", "text": "Capitán Pico ha hecho que Niebla siga la ruta llamativa. América ha cerrado la copia en cuanto intentó corregir. Krim dice que el Oscurno salió color «verde mareado»." },
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
      { "from": "topotino", "time": "auto", "text": "Regla aceptada. Hoy no se abre una ventana: habéis conseguido algo más urgente, el destino final." },
      { "from": "topotino", "time": "auto", "text": "Mañana veremos dos edificios de Sevilla con varias épocas y después viajaremos a Granada." },
      { "from": "topotino", "time": "auto", "text": "Tened las entradas preparadas y llevad una capa ligera para la noche. Guardad energía." },
      { "from": "topotino", "time": "auto", "text": "La entrada nocturna es el desenlace. Ahora descansad." }
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

Capitán Pico y América reclutan a los niños como exploradores y ayudan a reunir la pista, sin resolver las pruebas. Krim ayuda a nombrar la emoción y separarla de la decisión. Niebla cae en una contratrampa reversible y huye. Marsupilami es opcional. Tras la trampa se puede decir Granada, Alhambra y doce guardianes; antes no. Topotino aún no sabe que son los leones. Este día no abre ventana. Cuaderno privado.

## Fuentes documentales

- https://www.islamagica.es/mapa-y-zonas-tematicas
- https://www.islamagica.es/aguamagica
- https://signaling.islamagica.es/publica/prog_espectaculos.php
- https://www.islamagica.es/espectaculos/capitan-pico-y-america
- https://www.islamagica.es/espectaculos/el-duende-de-los-colores
