---
{
  "id": "004b-rumbo-amarante",
  "order": 4.7,
  "title": "La primera ruta de la placa",
  "channelCode": "T-17M3",
  "startsUnlocked": false,
  "activation": {
    "required": ["diario_iniciado"]
  },
  "mission": "Descubrir adónde conduce la placa",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Marga Mapas ha hecho llegar a Paula y Hugo el paquete cerrado que Topotino le confió antes del eclipse. La condición de emergencia se ha cumplido. Contiene una carta de Topotino a su yo futuro, un mapa con doce ventanas oscuras conectadas y la pista del primer destino. Una ventana ya está clara y lleva una pequeña marca de Luanco; las demás no tienen nombres. Topotino no conoce la ciudad, la fecha ni por qué su yo anterior quería llegar allí. Solo ve `TÂM...`, una ponte y un pez. Paula y Hugo investigan Amarante; la fecha aparece únicamente después de identificarla.

Topotino ya recuerda la conversación posterior al eclipse, la placa y la preparación del Cuaderno de la Memoria. No recuerda el pasado anterior ni el plan. Cada intento incorrecto permite revelar una evidencia nueva sin ridiculizarlo.

Al terminar, Topotino indica directamente que deben estar en Amarante el 13 por la tarde. Como la continuación pertenece al día siguiente, pide que preparen el cuaderno, duerman y descansen.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Marga os ha hecho llegar el paquete que le entregué antes del eclipse. Lo estamos abriendo juntos, aunque yo esté al otro lado del comunicador." },
  { "from": "topotino", "time": "auto", "text": "La carta está dirigida a mí. Dice: «Topotino: si no recuerdas haber escrito esto, no finjas. Confía en Paula y Hugo. Ellos conservan la parte que ninguna máquina puede guardar»." },
  { "from": "topotino", "time": "auto", "text": "También dice que el mapa no es una ruta completa y que debemos abrir una señal cada vez, comprobando las pistas en el lugar real." },
  { "from": "topotino", "time": "auto", "text": "También hay un mapa con doce ventanas oscuras unidas por líneas. Solo una está clara y tiene una pequeña marca de Luanco." },
  { "from": "topotino", "time": "auto", "text": "Debajo pone «Mapa de las Doce Aguas». No sé si habla de lugares, señales o una red." },
  { "from": "topotino", "time": "auto", "text": "La siguiente ventana muestra dos dibujos. Uno pone «TÂM...» y el otro es una ponte con un pez debajo." },
  { "from": "topotino", "time": "auto", "text": "Creo —solo creo— que puede apuntar a Portugal y a una ciudad atravesada por ese río. Investigadlo como buenos detectives: río, ponte y pez tienen que encajar a la vez. Enviadme el nombre cuando tengáis una hipótesis." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "amarante-descubierto-antes-del-viaje",
    "blockedFlags": ["amarante_previa_identificada"],
    "match": ["amarante", "puede ser amarante", "creemos que es amarante", "la ciudad es amarante"],
    "setFlags": ["amarante_previa_identificada"],
    "remember": { "kind": "deduction", "label": "Deducción de Amarante a partir del Tâmega, la ponte y São Gonçalo" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Amarante encaja con las tres cosas: el Tâmega, la Ponte de São Gonçalo y la tradición del pez. Buena investigación; no os habéis quedado con la primera ciudad que sonaba portuguesa." },
      { "from": "topotino", "time": "auto", "text": "Al colocar ese nombre sobre la placa ha aparecido una línea que antes era invisible: «13 de agosto · por la tarde». Tenemos que estar allí entonces. Digo tenemos porque pienso acompañaros desde el comunicador, aunque mis patas no quepan en vuestro coche." },
      { "from": "topotino", "time": "auto", "text": "No sé para qué debemos ir. Preparad el Cuaderno de la Memoria y el viaje. Ahora descansad; mañana será largo y no pienso permitir que empecéis una aventura con sueño de murciélago." }
    ]
  },
  {
    "id": "amarante-intento-uno",
    "requiredFlags": ["diario_iniciado"],
    "blockedFlags": ["amarante_pista_tamega", "amarante_previa_identificada"],
    "openAnswer": true,
    "minWords": 1,
    "setFlags": ["amarante_pista_tamega"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias por probar una hipótesis. No encaja todavía, pero al mover la placa se ha limpiado el nombre completo del río: Tâmega." },
      { "from": "topotino", "time": "auto", "text": "Buscad una ciudad portuguesa cuyo centro esté atravesado por el Tâmega. Yo voy a dejar de frotar el mapa con la manga porque solo estoy extendiendo el cacao." }
    ]
  },
  {
    "id": "amarante-intento-dos",
    "requiredFlags": ["amarante_pista_tamega"],
    "blockedFlags": ["amarante_pista_sao_goncalo", "amarante_previa_identificada"],
    "openAnswer": true,
    "minWords": 1,
    "setFlags": ["amarante_pista_sao_goncalo"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Esa tampoco reúne todas las pruebas. Gracias por seguir buscando" },
      { "from": "topotino", "time": "auto", "text": "He sacado mi lupa y en el pez leo una inscripción diminuta, «São Gonçalo». Puede ser el nombre de la ponte o de alguien ligado a ella." },
      { "from": "topotino", "time": "auto", "text": "Tenemos Tâmega, São Gonçalo y una ciudad portuguesa que empieza por A." }
    ]
  },
  {
    "id": "amarante-intento-tres",
    "requiredFlags": ["amarante_pista_sao_goncalo"],
    "blockedFlags": ["amarante_previa_identificada"],
    "openAnswer": true,
    "minWords": 1,
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Aún no. Os doy el nombre completo para no dejaros atascados: AMARANTE." },
      { "from": "topotino", "time": "auto", "text": "Comprobadlo: el Tâmega atraviesa su centro y la ponte está relacionada con São Gonçalo. Escribid AMARANTE cuando lo tengáis." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "No quiero inventar el destino. Hagamos que encajen el río, la ponte y el pez.",
  "Seguid el Tâmega hasta una ciudad portuguesa y comprobad su relación con São Gonçalo.",
  "La fecha continúa oculta hasta que tengamos una ciudad apoyada por las tres pistas."
]
```

## Pistas progresivas

```json
[]
```

## Contexto para IA

Topotino recuerda todo lo hablado después del eclipse: sabe que perdió memoria, que Paula y Hugo son sus amigos, que la marca de Luanco reaccionó, que han preparado el Cuaderno y que Marga entregó un mapa con doce ventanas conectadas. No recuerda a Marga de antes. Antes de `amarante_previa_identificada` solo conoce `TÂM...`, la ponte, el pez y la hipótesis de Portugal; usa únicamente las pistas permitidas. No adelanta la fecha. Después del acierto sabe que deben estar en Amarante el 13 por la tarde, pero ignora el motivo. Agradece los intentos razonados sin validar nombres incorrectos. Tras resolverlo, conduce directamente a Amarante y pide descansar. No conoce el autor de su amnesia, el museo, el sentido de las doce ventanas, Granada ni destinos posteriores.

## Fuentes documentales

- https://www.visitportugal.com/pt-pt/content/amarante
- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
