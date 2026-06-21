---
{
  "id": "002-luanco-primera-gota",
  "order": 2,
  "title": "Operación Primera Gota",
  "channelCode": "T-12A7",
  "startsUnlocked": false,
  "activation": {
    "type": "flag",
    "required": ["luanco_identificado"]
  },
  "mission": "Operación Primera Gota",
  "formulaWord": "MIRO",
  "water": "Agua del Norte",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Luanco es el primer lugar real de la nueva aventura. La Noche Blanca mezcla mar, escaparates, luces, arte, noche y reflejos. Topotino cree que la primera agua puede despertar allí.

Los niños deben buscar una luz blanca especial, un animal dormido en alguna forma o reflejo y recoger simbólicamente tres gotas cerca del mar. Deben aprender la palabra MIRO y guardar el primer botecito: Agua del Norte.

No revelar destinos futuros. Después de completar esta misión solo se debe insinuar un fenómeno del cielo sin decir todavía "eclipse" salvo que los niños lo escriban en el episodio siguiente.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Habéis llegado al lugar correcto." },
  { "from": "topotino", "time": "auto", "text": "Esta noche Luanco no es solo Luanco. Es un mapa." },
  { "from": "topotino", "time": "auto", "text": "Buscad la luz que no hace ruido. Buscad un animal que parezca dormido. Puede estar en una sombra, una nube, un escaparate, una roca, una concha o un reflejo." },
  { "from": "topotino", "time": "auto", "text": "Y cuando estéis cerca del mar, guardad tres gotas del norte. No cojáis mucha agua: las aguas mágicas no pesan por cantidad. Pesan por recuerdo." },
  { "from": "topotino", "time": "auto", "text": "Cuando tengáis las tres gotas, decid muy bajito:\n\nMiro.\nAgua despierta, noche clara,\nque la aventura no se apaga.\n\nDespués escribid COMPLETADO en el comunicador." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "luanco-completado",
    "match": ["completado", "completado_luanco", "miro", "agua del norte", "tres gotas"],
    "setFlags": ["completado_luanco"],
    "water": "Agua del Norte",
    "formulaWord": "MIRO",
    "nextEpisode": "003-eclipse",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Recibido. Tres gotas del norte guardadas." },
      { "from": "topotino", "time": "auto", "text": "Habéis encontrado el Agua del Norte. No era una gota cualquiera. Era una gota que sabe mirar lejos." },
      { "from": "topotino", "time": "auto", "text": "Primera palabra de la fórmula desbloqueada: MIRO." },
      { "from": "topotino", "time": "auto", "text": "Pero la siguiente pista todavía no se puede abrir. Algunas pistas solo despiertan cuando pasa una cosa rarísima en el cielo." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Aún no marco la primera gota como completa. Buscad la luz blanca, el animal dormido y las tres gotas del norte.",
  "Recordad la frase bajita: Miro. Agua despierta, noche clara, que la aventura no se apaga.",
  "Cuando tengáis la misión hecha, escribid COMPLETADO. Yo sellaré el botecito desde aquí."
]
```

## Contexto para IA

Topotino puede ayudar con pistas suaves para observar Luanco durante la Noche Blanca. Debe recordar que no hace falta coger mucha agua y que hay que cuidar el lugar. No debe revelar la palabra eclipse directamente si los niños no la han escrito todavía.
