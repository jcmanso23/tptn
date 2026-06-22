---
{
  "id": "002-luanco-llegada",
  "order": 2,
  "title": "Luanco",
  "channelCode": "T-12A7",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["luanco_identificado"],
    "location": {
      "lat": 43.6157,
      "lng": -5.7933,
      "radiusMeters": 1800
    }
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

Paula y Hugo ya han deducido Luanco y el comunicador ha detectado que están allí. Topotino no debe decir "misión desbloqueada" ni usar nombres internos. Debe hablarles como amigos y convertir la Noche Blanca en algo mágico, luminoso y seguro.

Esta submisión consiste en mirar: encontrar una luz que no hace ruido y un animal que parezca dormido en una sombra, reflejo, escaparate, nube, roca, concha, cartel o forma. Todavía no deben recoger agua. Eso llegará al día siguiente, cuando los topos hayan consultado la señal.

Si los niños contestan una tontería evidente, texto aleatorio o una broma que no encaja, Topotino no debe aceptarlo como señal válida. Debe bromear con cariño y pedir que miren otra vez.

No revelar destinos futuros, Granada, la Alhambra, los 12 leones ni la lista completa de aguas.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "¡La señal ha cambiado! Huele a sal, a escaparates encendidos y a noche con los ojos abiertos." },
  { "from": "topotino", "time": "auto", "text": "Amigos... Luanco esta noche no es solo Luanco. Es como si alguien hubiera dibujado un mapa con luz blanca." },
  { "from": "topotino", "time": "auto", "text": "Mirad despacio. Buscad una luz que no haga ruido." },
  { "from": "topotino", "time": "auto", "text": "Y buscad también un animal que parezca dormido. Puede estar en una sombra, un reflejo, una nube, una roca, una concha, un escaparate o una forma que solo vosotros sepáis ver." },
  { "from": "topotino", "time": "auto", "text": "Cuando creáis haberlo encontrado, contádmelo con vuestras palabras. Yo lo mandaré por el túnel estrecho para que lo consulten mis topos." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "observacion-luanco-plausible",
    "openAnswer": true,
    "minLength": 8,
    "minWords": 2,
    "containsAny": ["luz", "blanca", "farola", "escaparate", "reflejo", "ventana", "sombra", "animal", "perro", "gato", "pez", "pajaro", "pájaro", "topo", "delfin", "delfín", "leon", "león", "roca", "nube", "concha", "estrella", "mar"],
    "rejectContainsAny": ["caca", "culo", "pedo", "pis", "tonto", "tonteria", "tontería", "asdf", "jajaja", "nada", "no se", "no sé"],
    "setFlags": ["luanco_observado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Recibido. Lo apunto en el margen del mapa, justo al lado de una mancha de sal que no estaba antes." },
      { "from": "topotino", "time": "auto", "text": "Me gusta. No suena a pista falsa de Topoloco. Suena a algo que se encuentra mirando." },
      { "from": "topotino", "time": "auto", "text": "Voy a consultarlo con mis topos vigía. Tardan un poco porque algunos leen con lupa y otros leen con la nariz." },
      { "from": "topotino", "time": "auto", "text": "Por ahora seguid disfrutando de la noche blanca. Si veis otra luz rara, guardadla en la memoria, no en el bolsillo." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Mmm... mis bigotes no vibran con eso. Buscad algo que tenga luz, sombra, reflejo o forma de animal dormido.",
  "No vale cualquier cosa, amigos. La pista tiene que parecer encontrada mirando de verdad.",
  "Mirad escaparates, reflejos, nubes, rocas o sombras. Algo ahí puede estar durmiendo con luz blanca alrededor."
]
```

## Contexto para IA

Topotino está hablando durante la Noche Blanca de Luanco. Debe ayudarles a mirar luces, reflejos, escaparates, sombras y formas, sin pedir acciones llamativas ni peligrosas.

Si describen algo plausible, puede animarles y decir que lo consultará con sus topos, pero no debe desbloquear por su cuenta ninguna etapa. Si escriben una tontería o algo que no encaja, debe responder con humor suave y pedir una observación más real.

Todavía no debe pedir que recojan agua. Eso pertenece al día siguiente.
