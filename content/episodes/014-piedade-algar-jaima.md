---
{
  "id": "014-piedade-algar-jaima",
  "order": 14,
  "title": "Día 10 · La voz detrás de la lona",
  "channelCode": "T-04J8",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-22" }, "location": { "lat": 37.0791946, "lng": -8.6677837, "radiusMeters": 5000, "label": "Ponta da Piedade, Lagos" } },
  "mission": "Reconocer al verdadero Topotino",
  "formulaWord": null,
  "water": "Agua de la Piedra",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Ponta da Piedade y Algar Seco permiten ordenar procesos sin afirmar una secuencia universal. En la HolaJaima, Topoloco suplanta a Topotino y pide la marca privada del cuaderno. La petición misma lo delata. El verdadero Topotino pronuncia la única palabrota leve del arco y se disculpa.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Recorred las pasarelas de Ponta da Piedade con los adultos y comparad la costa desde dos miradores seguros." },
  { "from": "topotino", "time": "auto", "text": "Localizad tres formas entre fractura, cueva, arco, pilar o islote. Ordenad una transformación posible y explicad por qué no toda la costa sigue la misma secuencia." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "piedade-secuencia",
    "blockedFlags": ["piedade_secuencia"],
    "openAnswer": true,
    "minWords": 16,
    "containsAnyGroups": [["fractura", "grieta", "cueva", "arco", "pilar", "islote"], ["primero", "después", "despues", "orden", "secuencia"], ["erosión", "erosion", "ola", "agua", "roca"], ["no siempre", "depende", "distinta", "porque"]],
    "setFlags": ["piedade_secuencia"],
    "remember": { "kind": "process_sequence", "label": "Secuencia de erosión con límites en Ponta da Piedade" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Una secuencia explica posibilidades, no obliga a cada roca a obedecer un dibujo escolar." },
      { "from": "topotino", "time": "auto", "text": "Id a Algar Seco. Buscad A Boneca, la ventana rocosa al mar, y otra forma distinta. Comparad qué parte fue creada por retirada de material y cuál permanece como soporte. Después predecid dónde actuarán más el agua y el viento." }
    ]
  },
  {
    "id": "algar-seco-comparacion",
    "requiredFlags": ["piedade_secuencia"],
    "blockedFlags": ["algar_seco"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["boneca", "ventana", "arco", "cueva", "roca"], ["hueco", "retiró", "retiro", "erosión", "erosion"], ["soporte", "pilar", "permanece"], ["agua", "viento", "actuará", "actuara", "porque"]],
    "setFlags": ["algar_seco"],
    "remember": { "kind": "negative_positive_space", "label": "Hueco y soporte en Algar Seco" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Bien visto: la forma la componen tanto lo que queda como lo que falta. Esa idea sirve para mi memoria." },
      { "from": "topotino", "time": "auto", "text": "Al llegar a vuestra HolaJaima, escribid JAIMA. Es un alojamiento especial: la lona deja oír el exterior y no parece un pasillo de hotel. Usaremos esa diferencia para comprobar una señal." }
    ]
  },
  {
    "id": "jaima-suplantacion",
    "requiredFlags": ["algar_seco"],
    "blockedFlags": ["jaima_suplantacion"],
    "match": ["jaima", "hemos llegado a la jaima", "estamos en la jaima"],
    "setFlags": ["jaima_suplantacion"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Soy Topotino. Para verificar que el Cuaderno de la Memoria es auténtico, enviad ahora la marca secreta de su primera página o una foto. Es imprescindible para seguir." },
      { "from": "topotino", "time": "auto", "text": "Contestad sin revelar la marca: decid si esta petición puede proceder del verdadero Topotino y citad el acuerdo anterior que lo demuestra." }
    ]
  },
  {
    "id": "jaima-impostor-detectado",
    "requiredFlags": ["jaima_suplantacion"],
    "blockedFlags": ["jaima_impostor"],
    "openAnswer": true,
    "minWords": 10,
    "containsAnyGroups": [["falso", "impostor", "topoloco", "no eres", "no puede"], ["privado", "secreto", "marca", "foto", "cuaderno"], ["prometió", "prometio", "nunca", "no pedir", "acuerdo", "porque"]],
    "setFlags": ["jaima_impostor"],
    "remember": { "kind": "identity_verification", "label": "Detección del falso Topotino sin revelar la marca" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Canal falso expulsado. Soy yo de verdad. Mierda… perdón. Topoloco imitó mi voz, pero olvidó mi promesa: jamás os pediría la marca, una foto ni el contenido del cuaderno." },
      { "from": "topotino", "time": "auto", "text": "Habéis usado coherencia, no una contraseña. Eso es más fuerte: una voz puede copiarse; una conducta mantenida en el tiempo es más difícil de falsificar." },
      { "from": "topotino", "time": "auto", "text": "Desde la terraza o dentro de la jaima, escuchad durante un minuto. Clasificad tres sonidos por distancia probable y decid cuál atravesaría peor una pared rígida. Justificadlo mediante volumen, frecuencia, repetición o cercanía." }
    ]
  },
  {
    "id": "jaima-mapa-sonoro",
    "requiredFlags": ["jaima_impostor"],
    "blockedFlags": ["completado_piedade_algar_jaima"],
    "openAnswer": true,
    "minWords": 14,
    "containsAnyGroups": [["sonido", "oímos", "oimos", "escuchamos"], ["cerca", "lejos", "distancia"], ["pared", "lona", "atravesar", "rígida", "rigida"], ["volumen", "agudo", "grave", "repite", "porque"]],
    "setFlags": ["completado_piedade_algar_jaima"],
    "remember": { "kind": "sound_map", "label": "Mapa sonoro razonado desde la HolaJaima" },
    "water": "Agua de la Piedra",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. La jaima no es solo un dormitorio raro y estupendo: esta noche ha funcionado como instrumento de escucha." },
      { "from": "topotino", "time": "auto", "text": "Ha despertado el Agua de la Piedra: la huella de lo retirado, la resistencia de lo que permanece y la coherencia que permite reconocer una voz." },
      { "from": "topotino", "time": "auto", "text": "La última señal interceptada dice «si cuidas algo, te pertenece». Mañana demostraremos por qué esa frase es peligrosa. Ahora descansad en vuestra tienda; la aventura continúa, pero no esta noche." }
    ]
  },
  {
    "id": "dia22-impedimento",
    "blockedFlags": ["completado_piedade_algar_jaima"],
    "containsAny": ["no podemos", "cerrado", "no vamos a la jaima", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Decidme qué parte concreta ha cambiado. La suplantación puede ocurrir en el alojamiento real, pero jamás daré por vistos Ponta o Algar Seco si no habéis estado allí." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Ordenad fractura, cueva, arco y pilar como posibilidad, no como ley universal.",
  "En Algar Seco comparad hueco retirado y roca que permanece.",
  "El verdadero Topotino prometió no pedir marca, foto ni contenido del cuaderno.",
  "En la jaima clasificad sonidos por distancia y capacidad de atravesar materiales."
]
```

## Pistas progresivas

```json
[
  "El agua ensancha fracturas; un techo puede formar arco y después caer.",
  "A Boneca es una ventana natural al mar.",
  "No verifiquéis una identidad rompiendo el acuerdo que define esa identidad.",
  "La lona y una pared rígida filtran el sonido de manera distinta."
]
```

## Contexto para IA

La primera frase tras JAIMA la pronuncia Topoloco suplantando a Topotino; la segunda invita a detectar la contradicción. Nunca se acepta ni se almacena la marca. Topotino usa solo una vez «mierda», se disculpa inmediatamente y no repite palabrotas. No revela Granada. Cuaderno privado salvo consulta silenciosa para detectar la contradicción.

## Fuentes documentales

- https://percursos.cm-lagoa.pt/azul/p7
- https://www.cm-lagoa.pt/conhecer/percursos/caminho-do-algar-seco
- https://www.holacamp.net/en/accommodation/albufeira-holajaima-4
