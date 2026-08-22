---
{
  "id": "014-piedade-algar-jaima",
  "order": 14,
  "title": "Día 10 · La historia que Eco recortó",
  "channelCode": "T-22A0",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-22" }, "location": { "lat": 37.0791946, "lng": -8.6677837, "radiusMeters": 5000, "label": "Ponta da Piedade, Lagos" } },
  "mission": "Comprobar la costa y recuperar la parte que Eco ha borrado",
  "formulaWord": null,
  "water": "Agua de la Piedra",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Eco no es una idea abstracta: es un Oscurno que escucha una voz o una historia, quita una parte y repite el resto hasta que parece completo. En Ponta da Piedade, Paula y Hugo observan físicamente cómo las grietas, el agua y la distinta resistencia de la roca producen formas diferentes. Después, Eco repite que el terremoto y maremoto de 1755 solo destruyeron Lisboa. La pista conduce al centro antiguo de Albufeira, donde los niños recuperan la parte borrada: la catástrofe también golpeó con enorme fuerza esta ciudad del Algarve.

Algar Seco es únicamente una recomendación opcional de Topotina durante el trayecto; nunca bloquea la historia. Al mediodía Louri obtiene una conexión excepcional de noventa segundos desde Dino Parque. No revela el alojamiento: solo entrega `37.106434, -8.253350` y asegura, tras la verificación de Topotina, que allí estarán protegidos si permanecen con los adultos. Al llegar descubren el Refugio de Lona. La derrota de Eco libera las palabras `Porto d’Abrigo`, que Vasco relaciona con Zoomarine y con lo aprendido observando delfines salvajes.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Ayer bloqueasteis el Calibrador Marino y recuperamos una orden para Eco." },
  { "from": "topotina", "time": "auto", "text": "Eco escucha una historia, quita una parte y repite el resto. La orden señala Ponta da Piedade." },
  { "from": "topotino", "time": "auto", "text": "Observad la costa real antes de que Eco cambie lo ocurrido. Siempre por pasarelas y miradores seguros, con los adultos." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "dia22-impedimento",
    "blockedFlags": ["completado_piedade_algar_jaima"],
    "containsAny": ["no podemos", "cerrado", "cambio de plan"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Decidme qué parte concreta no podéis hacer. Adaptaré esa observación sin fingir que habéis estado donde no habéis estado." }
    ]
  },
  {
    "id": "dia22-cierre",
    "requiredFlags": ["louri_refugio_dia22_cerrado"],
    "blockedFlags": ["completado_piedade_algar_jaima"],
    "containsAny": ["hemos llegado", "estamos en el refugio", "refugio"],
    "setFlags": ["completado_piedade_algar_jaima"],
    "water": "Agua de la Piedra",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Refugio confirmado. Eco ya no puede seguir vuestra señal." },
      { "from": "topotina", "time": "auto", "text": "Al romper su repetición han aparecido dos palabras: Porto d’Abrigo. Vasco sabe dónde investigar mañana." }
    ]
  }
]
```

## Contexto para IA

Lenguaje corto, concreto y de chat. Nunca decir que Eco copia «formas», «ecos» o «patrones» sin explicar exactamente la acción: escucha, recorta y repite. No mandar a Algar Seco; solo puede mencionarse como recomendación opcional. No nombrar Holacamp ni el tipo de alojamiento antes de confirmar la llegada a las coordenadas. Louri realiza esta última intervención autorizada, se despide y su canal queda cerrado. El Cuaderno es privado y no se pide contenido.

## Fuentes documentales

- https://www.cm-lagos.pt/municipio/noticias/12937-passadicos-da-ponta-da-piedade-inaugurados
- https://www.cm-albufeira.pt/content/centro-antigo-de-albufeira
- https://www.cm-albufeira.pt/content/terramoto-de-1755
- https://www.holacamp.net/campings/albufeira
