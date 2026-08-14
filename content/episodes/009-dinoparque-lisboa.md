---
{
  "id": "009-dinoparque-lisboa",
  "order": 9,
  "title": "Día 5 · Los huesos que no mienten",
  "channelCode": "T-53D9",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-17" }, "location": { "lat": 39.2790352, "lng": -9.2916689, "radiusMeters": 5000, "label": "Dino Parque Lourinhã" } },
  "mission": "Reconstruir sin inventar",
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Dino Parque recupera la distinción iniciada en Portugal dos Pequenitos: una representación puede enseñar si reconoce qué transforma. Aquí se añade evidencia material y trabajo científico para separar fósil, modelo e inferencia. Topoloco planta una reconstrucción perfecta para demostrar que una historia convincente puede sustituir la evidencia. Al fracasar deja la primera mención del Museo Topoloco de los Recuerdos Robados.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Recorred primero una ruta exterior hasta un modelo. Fijaos en tamaño, piel y postura." },
  { "from": "topotino", "time": "auto", "text": "En Coimbra comparasteis reproducción y original. Hoy añadiremos una pieza fósil y el trabajo científico que los relaciona con el modelo." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "dinoparque-modelo-fosil",
    "blockedFlags": ["dinoparque_modelo_fosil"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["modelo", "reconstrucción", "reconstruccion", "escala", "color"], ["fósil", "fosil", "hueso", "huevo", "resto", "original"], ["laboratorio", "limpia", "roca", "estudia", "científico", "cientifico"], ["diferencia", "porque", "evidencia"]],
    "setFlags": ["dinoparque_modelo_fosil"],
    "remember": { "kind": "evidence_classification", "label": "Diferencia entre modelo, fósil y trabajo científico" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Clasificación correcta. El modelo comunica una hipótesis; el fósil es una parte material; el laboratorio hace visible el proceso que los relaciona." },
      { "from": "topotino", "time": "auto", "text": "Buscad la información sobre Lourinhanosaurus: nido, huevos y huesos de embriones. Construid una cadena de tres pasos: evidencia encontrada, inferencia razonable y una pregunta que aún quede abierta. Si vuestra conclusión afirma más que la evidencia, Topoloco gana." }
    ]
  },
  {
    "id": "dinoparque-cadena-evidencia",
    "requiredFlags": ["dinoparque_modelo_fosil"],
    "blockedFlags": ["dinoparque_cadena"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["nido", "huevo", "embrión", "embrion", "hueso"], ["evidencia", "encontraron", "hallaron"], ["inferimos", "podría", "podria", "indica"], ["pregunta", "no sabemos", "falta"]],
    "setFlags": ["dinoparque_cadena"],
    "remember": { "kind": "evidence_chain", "label": "Cadena evidencia-inferencia-pregunta sobre Lourinhanosaurus" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis reconstruido sin fingir certeza total. Ahora buscad un modelo cuya piel, color o sonido no pueda conocerse directamente por los huesos. Proponed dos versiones posibles y decid qué parte es ciencia y qué parte es elección del reconstruidor." }
    ]
  },
  {
    "id": "dinoparque-dos-reconstrucciones",
    "requiredFlags": ["dinoparque_cadena"],
    "blockedFlags": ["dinoparque_reconstrucciones"],
    "openAnswer": true,
    "minWords": 13,
    "containsAnyGroups": [["piel", "color", "sonido", "plumas", "modelo"], ["podría", "podria", "otra", "dos", "versión", "version"], ["evidencia", "elección", "eleccion", "hipótesis", "hipotesis"]],
    "setFlags": ["dinoparque_reconstrucciones"],
    "remember": { "kind": "uncertain_reconstruction", "label": "Dos reconstrucciones compatibles con la evidencia" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Perfecto. La evidencia limita las historias posibles, pero a veces no escoge una sola. Eso acaba de romper la trampa de Topoloco: había dejado una reconstrucción «completamente segura» sin indicar qué partes eran supuestas." },
      { "from": "topotino", "time": "auto", "text": "Su etiqueta falsa dice: «Museo Topoloco de los Recuerdos Robados». Primera vez que aparece ese nombre. No sabemos dónde está ni qué guarda, pero lo de «robados» no parece un accidente tipográfico." },
      { "from": "topotino", "time": "auto", "text": "Al llegar a Lisboa, orientaos en Rossio o Baixa: identificad una dirección hacia el río usando pendiente, apertura de calles, aire, luz o señalización. Dad dos indicios independientes; no vale mirar solo el mapa." }
    ]
  },
  {
    "id": "lisboa-orientacion",
    "requiredFlags": ["dinoparque_reconstrucciones"],
    "blockedFlags": ["completado_dinoparque_lisboa"],
    "openAnswer": true,
    "minWords": 10,
    "containsAnyGroups": [["río", "rio", "tejo", "agua"], ["pendiente", "calle", "aire", "luz", "señal", "senal", "abierta", "dirección", "direccion"], ["dos", "también", "además", "ademas", "porque"]],
    "setFlags": ["completado_dinoparque_lisboa"],
    "remember": { "kind": "urban_orientation", "label": "Orientación física hacia el Tejo" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Bien orientados: dos señales independientes son más resistentes a una pista falsa. Topoloco ya sabe que no puede engañaros con un cartel bonito." },
      { "from": "topotino", "time": "auto", "text": "Hoy no se abre una ventana. Eso también importa: ya sabemos que Topoloco está construyendo un museo con recuerdos ajenos." },
      { "from": "topotino", "time": "auto", "text": "La etiqueta lleva una dirección incompleta hacia un laboratorio de adaptaciones y un océano que pretende ser uno solo. Mañana seguiremos esa pista." },
      { "from": "topotino", "time": "auto", "text": "Descansad. Lisboa tiene muchas capas y ninguna piensa colocarse en fila solo para nosotros." }
    ]
  },
  {
    "id": "dia17-impedimento",
    "blockedFlags": ["completado_dinoparque_lisboa"],
    "containsAny": ["no podemos", "cerrado", "cambio de plan"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Decidme si ha fallado Dino Parque o la llegada a Lisboa. Cambiaré el soporte, no la exigencia: original, modelo, inferencia y límite deberán seguir separados." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Nombrad una diferencia entre modelo, fósil y trabajo de laboratorio.",
  "La cadena es: qué encontraron, qué permite inferir y qué sigue sin saberse.",
  "En Lisboa dad dos señales físicas distintas que apunten hacia el Tejo."
]
```

## Pistas progresivas

```json
[
  "Un modelo completo no es un cuerpo original.",
  "Los embriones apoyan una inferencia sobre reproducción, no sobre el color de la madre.",
  "La Baixa se abre hacia Praça do Comércio y el Tejo."
]
```

## Contexto para IA

Topotino conoce por primera vez el nombre Museo Topoloco de los Recuerdos Robados, pero no su ubicación, contenido ni finalidad exacta. No debe convertir hipótesis en hechos. Este día no abre ventana. Cuaderno privado.

## Fuentes documentales

- https://www.dinoparque.pt/sobre/
- https://www.dinoparque.pt/cientifico/
