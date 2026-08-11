---
{
  "id": "004b-rumbo-amarante",
  "order": 4.7,
  "title": "La señal partida",
  "channelCode": "T-17M3",
  "startsUnlocked": false,
  "activation": {
    "required": ["eclipse_identificado"]
  },
  "mission": "Descubrir el primer destino",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Esta transición une el eclipse con el comienzo del viaje. Topotino no conoce el destino, la fecha ni el motivo de la señal. Solo ha recuperado dos fragmentos: parte del nombre del río Tâmega y un dibujo de una ponte acompañado por un pez.

Paula y Hugo deben descubrir Amarante antes de que Topotino pueda leer la segunda capa del mensaje. Solo después del acierto aparece la instrucción de estar allí el 13 de agosto por la tarde. No se menciona todavía ninguna agua nueva, el museo, el plan de Topoloco ni los destinos posteriores.

Las respuestas incorrectas no se ridiculizan. Cada intento permite limpiar un fragmento más de la señal y recibir una pista progresiva.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Ya tengo los dos trozos de la señal. Uno dice «TÂM...» y el otro es un dibujo de una ponte con un pez debajo. Eso es todo. Ni fecha, ni lugar, ni instrucciones." },
  { "from": "topotino", "time": "auto", "text": "Mis topos creen que apunta a una ciudad de Portugal atravesada por ese río. Yo no la encuentro en el mapa porque alguien ha derramado cacao justo encima." },
  { "from": "topotino", "time": "auto", "text": "¿Podéis investigar qué ciudad puede ser? Enviadme solo el nombre cuando tengáis una sospecha." }
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
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Amarante... Un momento. El dibujo acaba de encajar con la ponte de São Gonçalo y el río Tâmega. Sí. Es Amarante." },
      { "from": "topotino", "time": "auto", "text": "Al acertarlo ha aparecido una línea que antes no estaba: «13 de agosto · por la tarde». Tenéis que estar allí entonces." },
      { "from": "topotino", "time": "auto", "text": "No me preguntéis todavía para qué, porque no lo sé. La señal se ha vuelto a apagar. Preparad el viaje y guardad bien el Agua del Norte; cuando lleguéis, veremos si despierta otra vez." }
    ]
  },
  {
    "id": "amarante-intento-uno",
    "requiredFlags": ["eclipse_identificado"],
    "blockedFlags": ["amarante_pista_tamega", "amarante_previa_identificada"],
    "openAnswer": true,
    "minWords": 1,
    "setFlags": ["amarante_pista_tamega"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "He probado ese nombre y los dos trozos no encajan. Pero al moverlos se ha limpiado una letra más: el río se llama Tâmega." },
      { "from": "topotino", "time": "auto", "text": "Buscad una ciudad portuguesa cuyo centro esté atravesado por el Tâmega. Yo sigo quitando cacao del mapa." }
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
      { "from": "topotino", "time": "auto", "text": "Tampoco. El pez del dibujo acaba de señalar una inscripción diminuta: «São Gonçalo». Debe de ser el nombre de la ponte o de alguien relacionado con ella." },
      { "from": "topotino", "time": "auto", "text": "La ciudad empieza por A. Tâmega, São Gonçalo y una ciudad portuguesa que empieza por A." }
    ]
  },
  {
    "id": "amarante-intento-tres",
    "requiredFlags": ["amarante_pista_sao_goncalo"],
    "blockedFlags": ["amarante_previa_identificada"],
    "openAnswer": true,
    "minWords": 1,
    "messages": [
      { "from": "topotino", "time": "auto", "text": "La señal insiste en que aún no es. Última limpieza de mapa: A...RANTE. Con el Tâmega cruzando por el centro." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Solo tengo dos fragmentos: TÂM... y una ponte con un pez. Probemos con un nombre de ciudad.",
  "No quiero inventarme el destino. Necesitamos que todos los trozos encajen.",
  "Seguid la pista del río y de São Gonçalo; la fecha continúa oculta hasta encontrar la ciudad."
]
```

## Pistas progresivas

```json
[]
```

## Contexto para IA

Topotino sabe muy poco y debe reconocerlo. Antes de la flag `amarante_previa_identificada`, solo conoce los fragmentos TÂM..., la ponte, el pez y que podría tratarse de Portugal. Puede ayudar a investigar con pistas ya reveladas por las flags, pero nunca confirma otra ciudad ni adelanta la fecha. Solo después de que escriban AMARANTE puede decir que deben estar allí el 13 de agosto por la tarde. No conoce el motivo, el plan de Topoloco, el museo, las doce aguas ni destinos posteriores.

## Fuentes documentales

- https://www.visitportugal.com/pt-pt/content/amarante
- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
