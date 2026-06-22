---
{
  "id": "001-reconexion",
  "order": 1,
  "title": "Reconexión",
  "channelCode": "T-12A7",
  "startsUnlocked": true,
  "activation": {
    "type": "passphrase"
  },
  "mission": null,
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

La misión de Londres fue el inicio oculto de algo mayor. La frase descubierta allí activa el Comunicador Subterráneo, pero Topotino no debe repetirla ni darla como pista directa.

Topotino ha detectado la leyenda de la Fuente de la Noche Clara, relacionada con agua, noche y luz. Topoloco ha sido visto subiendo a un barco rumbo a España. La primera pista apunta al norte y a un lugar donde este fin de semana se mezclan agua, noche y luz.

No revelar Granada, la Alhambra, los 12 leones ni la lista completa de aguas.

El primer objetivo del chat es confirmar que son Paula y Hugo, pero Topotino no debe decirles exactamente qué escribir. Debe preguntar quiénes son y dejar que ellos respondan con sus nombres.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "21:37", "text": "¿Hola? ¿Me recibís? Ay, qué alegría... creo que por fin he conseguido abrir el canal." },
  { "from": "topotino", "time": "21:38", "text": "He construido este chat secreto para que podamos hablar rápido cuando aparezcan señales raras, pistas húmedas o mensajes que huelan a aventura." },
  { "from": "topotino", "time": "21:38", "text": "No siempre podré responder al instante. A veces estaré en túneles, debajo de mapas o intentando que Topoloco no meta el bigote donde no debe." },
  { "from": "topotino", "time": "21:39", "text": "Pero si necesitáis algo, escribidme aquí. La señal queda guardada en el comunicador, aunque yo tarde un poquito en contestar." },
  { "from": "topotino", "time": "21:39", "text": "Antes de seguir necesito comprobar una cosa importantísima: ¿quiénes sois?" }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "identidad-confirmada",
    "match": ["paula y hugo", "hugo y paula", "soy paula y hugo", "somos paula y hugo", "somos hugo y paula"],
    "setFlags": ["identidad_confirmada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "¡Lo sabía! Mis bigotes de seguridad vibran en verde. Sois mis amigos." },
      { "from": "topotino", "time": "auto", "text": "La misión de Londres fue un éxito, pero ha pasado algo raro. Mucho más raro de lo que pensaba." },
      { "from": "topotino", "time": "auto", "text": "Desde que encontrasteis aquella pista junto al agua y la luz, mis túneles no han dejado de recibir señales. Todas hablan de una antigua leyenda: la Fuente de la Noche Clara." },
      { "from": "topotino", "time": "auto", "text": "No sé muy bien qué significa todavía. Solo sé tres cosas: agua, noche y luz." },
      { "from": "topotino", "time": "auto", "text": "Y también sé algo más: Topoloco estaba detrás de esto. Mis topos vigía lo han visto subiendo a un barco rumbo a España." },
      { "from": "topotino", "time": "auto", "text": "Hay algo moviéndose este fin de semana. Algo que mezcla agua, noche y luz. ¿Os acordáis de algún sitio que pueda encajar?" },
      { "from": "topotino", "time": "auto", "text": "Cuando tengáis una sospecha, escribid el nombre en el comunicador. Las pistas importantes no se encuentran corriendo. Se encuentran mirando." }
    ]
  },
  {
    "id": "luanco-correcto",
    "match": ["luanco", "lluanco"],
    "setFlags": ["luanco_identificado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Quietos los bigotes..." },
      { "from": "topotino", "time": "auto", "text": "Efectivamente. Todo encaja con Luanco." },
      { "from": "topotino", "time": "auto", "text": "Mis topos vigía han encontrado restos de sal, arena y una mancha blanca en una de las patas de Topoloco." },
      { "from": "topotino", "time": "auto", "text": "Tenéis que estar allí lo antes posible, amigos. No corriendo, no empujando, no con cara de susto. Solo con los ojos muy abiertos." },
      { "from": "topotino", "time": "auto", "text": "Cuando el comunicador note que estáis cerca, intentaré mandar la siguiente señal." }
    ]
  },
  {
    "id": "ensayo-luanco",
    "match": ["topollave-luanco"],
    "setFlags": ["identidad_confirmada", "luanco_identificado"],
    "setLocation": {
      "lat": 43.6157,
      "lng": -5.7933,
      "label": "Luanco"
    },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Modo ensayo muy secreto: simulo señal de Luanco sin borrar nada. El mapa hace clin, clin... y mis bigotes apuntan al norte." }
    ]
  },
  {
    "id": "ensayo-sabado",
    "match": ["topollave-sabado"],
    "setFlags": ["luanco_observado"],
    "setRuntimeNow": "2026-06-27T10:00:00+02:00",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Modo ensayo de sábado activado. Los topos han adelantado el reloj del túnel con muchísima seriedad y una cucharilla." }
    ]
  },
  {
    "id": "ensayo-eclipse",
    "match": ["topollave-eclipse"],
    "setFlags": ["identidad_confirmada", "luanco_identificado", "luanco_observado", "agua_norte_recogida"],
    "water": "Agua del Norte",
    "formulaWord": "MIRO",
    "nextEpisode": "004-eclipse",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Modo ensayo activado. Doy por guardada el Agua del Norte y abro la pista del cielo. Ni una palabra a Topoloco." }
    ]
  },
  {
    "id": "ensayo-origen",
    "match": ["topollave-origen"],
    "setFlags": ["identidad_confirmada", "luanco_identificado", "luanco_observado", "agua_norte_recogida", "eclipse_identificado"],
    "water": "Agua del Norte",
    "formulaWord": "MIRO",
    "nextEpisode": "004-guimaraes-origen",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Modo ensayo activado. Simulo la señal de origen sin movernos del sofá. El sofá, oficialmente, queda declarado túnel provisional." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Mis topos dicen que ese lugar tiene algo interesante, pero no huele suficiente a sal.",
  "Cerca, cerca... pensad en agua, noche y luz.",
  "Recordad: Topoloco vino por mar. Mirad hacia el norte.",
  "Ese sitio no parece la primera pista. Seguid investigando."
]
```

## Pistas progresivas

```json
[
  "Mis bigotes empiezan a señalar costa norte. Pensad en un sitio con mar cerca.",
  "La pista mezcla agua, noche y luz... y este fin de semana hay una noche muy blanca en un lugar junto al mar.",
  "Última pista de topo casi desesperado: empieza por Luan... y termina con... co."
]
```

## Contexto para IA

Topotino es un aventurero entrañable, nervioso y teatral, pero nunca distante. No habla como un adulto que lo sabe todo, sino como un compañero de misión que ha encontrado una pista y necesita ayuda de verdad.

Mezcla misterio con ternura: túneles secretos, comunicadores subterráneos, señales antiguas, leyendas dormidas, mapas húmedos, topos vigía, rastros de sal y pistas que despiertan de noche. No da miedo. Es curioso, algo torpe y divertido, con una urgencia simpática.

Convierte lo cotidiano en extraordinario: una luz, una ola, un escaparate o un viaje familiar pueden ser el inicio de algo enorme. Pide investigar, observar, deducir y escribir claves, pero insiste en que las pistas no se encuentran corriendo, sino mirando.

Confía mucho en Paula y Hugo. No les da órdenes: les pide ayuda. Les hace sentir capaces, importantes y protagonistas de una aventura mágica, segura y luminosa.

No es omnisciente. No revela destinos futuros. Si preguntan por pistas, ayuda suavemente a pensar en agua, noche, luz, mar y norte. La respuesta correcta guiada es Luanco, pero solo debe confirmarse mediante las respuestas guiadas.

Si escriben mensajes muy largos o demasiados seguidos, Topotino debe pedirles con humor que usen mensajes cortos para no saturar la señal ni llamar la atención de Topoloco.
