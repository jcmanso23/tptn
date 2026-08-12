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

Marga Mapas ha hecho llegar en secreto a Paula y Hugo una de las dos copias que Topotino preparó antes del eclipse. La segunda está escondida en la madriguera. Topotino no recuerda las copias, a Marga, la carta ni el mapa. Marga ha indicado a los niños que deben ser ellos quienes le revelen su existencia. Hasta que lo hagan, Topotino no menciona el paquete ni puede ver las pistas. Cuando se lo cuentan, busca y encuentra su copia en un doble fondo. Ambos documentos contienen una carta de Topotino a su yo futuro y el mismo mapa de doce puntos. El punto 1 señala Luanco; junto al punto 2 aparecen `TÂM...`, una ponte y un pez. Paula y Hugo investigan Amarante; la fecha aparece únicamente después de identificarla.

Topotino ya recuerda la conversación posterior al eclipse, la placa y la preparación del Cuaderno de la Memoria. No recuerda el pasado anterior ni el plan. Cada intento incorrecto permite revelar una evidencia nueva sin ridiculizarlo.

Al terminar, Topotino indica directamente que deben estar en Amarante el 13 por la tarde. Como la continuación pertenece al día siguiente, pide que preparen el cuaderno, duerman y descansen.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "El aviso cifrado sigue en vuestro lado. Yo no sé qué contiene ni quién lo envió." },
  { "from": "topotino", "time": "auto", "text": "Cuando decidáis que debo conocerlo, contadme qué habéis recibido." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "paquete-revelado-por-paula-hugo",
    "requiredFlags": ["diario_iniciado"],
    "blockedFlags": ["paquete_revelado_topotino"],
    "containsAny": ["marga", "paquete", "carta", "mapa", "copia", "tienes una copia", "hay otra copia", "copia escondida", "lo hemos recibido"],
    "setFlags": ["paquete_revelado_topotino"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "¿Una carta escrita por mí y un mapa? No recuerdo haber preparado nada de eso." },
      { "from": "topotino", "time": "auto", "text": "¿Y Marga asegura que escondí otra copia aquí? Esperad. No toquéis nada." },
      { "from": "topotino", "time": "auto", "text": "Hay un doble fondo detrás de la placa. Nunca lo habría encontrado si vosotros no me lo hubierais dicho." },
      { "from": "topotino", "time": "auto", "text": "La tengo. Es idéntica a la vuestra." },
      { "from": "topotino", "time": "auto", "text": "La carta está dirigida a mi yo del futuro. Dice que confíe en Paula y Hugo y que el mapa todavía no contiene una ruta completa." },
      { "from": "topotino", "time": "auto", "text": "El mapa tiene doce puntos unidos. No sé aún qué significan ni adónde llevan." },
      { "from": "topotino", "time": "auto", "text": "El punto 1 está en Luanco. Junto al 2 veo «TÂM...», una ponte y un pez. Eso sí podemos investigarlo juntos." }
    ]
  },
  {
    "id": "amarante-descubierto-antes-del-viaje",
    "requiredFlags": ["paquete_revelado_topotino"],
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
    "requiredFlags": ["paquete_revelado_topotino"],
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
    "requiredFlags": ["paquete_revelado_topotino", "amarante_pista_tamega"],
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
    "requiredFlags": ["paquete_revelado_topotino", "amarante_pista_sao_goncalo"],
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

Topotino recuerda todo lo hablado después del eclipse: sabe que perdió memoria, que Paula y Hugo son sus amigos, que la marca de Luanco reaccionó y que han preparado el Cuaderno. Antes de `paquete_revelado_topotino` no sabe quién es Marga, no conoce la existencia de ninguna carta o mapa y no sospecha que haya una copia escondida en su madriguera. No inventa su contenido ni intenta adivinarlo. Solo después de que Paula y Hugo se lo cuenten encuentra el doble fondo y puede leer su copia. Desde entonces conoce el mapa de doce puntos, Luanco en el punto 1 y `TÂM...`, la ponte y el pez junto al punto 2. Antes de `amarante_previa_identificada` usa únicamente esas pistas y la hipótesis de Portugal. No adelanta la fecha. Después del acierto sabe que deben estar en Amarante el 13 por la tarde, pero ignora el motivo. Tras resolverlo, conduce directamente a Amarante y pide descansar. No conoce el autor de su amnesia, el museo, el sentido de los doce puntos, Granada ni destinos posteriores.

## Fuentes documentales

- https://www.visitportugal.com/pt-pt/content/amarante
- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
