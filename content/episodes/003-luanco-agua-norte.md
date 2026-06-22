---
{
  "id": "003-luanco-agua-norte",
  "order": 3,
  "title": "Agua del Norte",
  "channelCode": "T-12A7",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["luanco_observado"],
    "date": {
      "on": "2026-06-27"
    }
  },
  "mission": null,
  "formulaWord": "MIRO",
  "water": "Agua del Norte",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Es sábado 27. Los topos han revisado la observación de Luanco y han descubierto que la Fuente de la Noche Clara no despierta con una pista única, sino con una especie de pócima simbólica hecha con aguas de muchos lugares.

Topotino debe explicar que por eso Topoloco está en Luanco: quiere guardar el brillo para él. No debe dar miedo; Topoloco es torpe, obsesivo y egoísta.

Paula y Hugo deben recoger muy poca agua, como tres gotas, de forma segura y respetuosa. Deben poner una pegatina o etiqueta para recordar que es el Agua del Norte. No hace falta cantidad: importa el recuerdo.

No revelar la lista completa de aguas ni destinos futuros.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Amigos, acabo de recibir respuesta de los topos vigía." },
  { "from": "topotino", "time": "auto", "text": "Venía en un papel húmedo, doblado en forma de ola. Eso, en lenguaje topo, significa: asunto importante." },
  { "from": "topotino", "time": "auto", "text": "La señal de anoche no era una pista suelta. Era el borde de algo mucho más raro: una pócima de aguas." },
  { "from": "topotino", "time": "auto", "text": "Por eso Topoloco está rondando. Quiere encontrar el brillo antes que vosotros y guardárselo, como si la belleza cupiera en un bolsillo." },
  { "from": "topotino", "time": "auto", "text": "Necesito que cojáis solo un poquito de agua. Tres gotas bastan. Las aguas importantes no pesan por cantidad, pesan por recuerdo." },
  { "from": "topotino", "time": "auto", "text": "Ponedle una pegatina o una etiqueta que diga: Agua del Norte. Así sabremos que esta fue la primera que aprendió a mirar." },
  { "from": "topotino", "time": "auto", "text": "Cuando esté guardada, contádmelo por aquí. Sin gritar. Las gotas escuchan mejor en voz baja." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "agua-norte-recogida",
    "match": ["hecho", "ya esta", "ya está", "agua del norte", "hemos cogido el agua", "tenemos el agua", "tres gotas"],
    "containsAll": ["agua"],
    "setFlags": ["agua_norte_recogida"],
    "water": "Agua del Norte",
    "formulaWord": "MIRO",
    "nextEpisode": "004-eclipse",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Buena misión, amigos. Muy buena." },
      { "from": "topotino", "time": "auto", "text": "Agua del Norte guardada. No es mucha, pero tiene memoria de mar, de noche blanca y de ojos atentos." },
      { "from": "topotino", "time": "auto", "text": "Primera palabra que se despierta en mi mapa: MIRO." },
      { "from": "topotino", "time": "auto", "text": "Y ahora escuchad esto, porque la siguiente señal no se abre en una calle." },
      { "from": "topotino", "time": "auto", "text": "Se abrirá cuando el día haga algo rarísimo: cuando parezca noche sin ser noche, y la luna se ponga delante del sol como si quisiera taparle un secreto." },
      { "from": "topotino", "time": "auto", "text": "No puedo decir más. Corto comunicación hasta entonces. Y recordad: el sol nunca se mira directamente. Ni por juego, ni por misión, ni por curiosidad." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Todavía no marco el Agua del Norte como guardada. Recordad: solo tres gotas y una etiqueta.",
  "No hace falta mucha agua. Hace falta cuidarla y recordar de dónde viene.",
  "Cuando la tengáis en el botecito con su pegatina, decidme que está hecho."
]
```

## Contexto para IA

Topotino debe explicar la idea de la pócima de aguas de forma misteriosa y familiar, sin revelar la ruta completa. Debe insistir en recoger muy poca agua, respetar el lugar y etiquetar el bote como Agua del Norte.

Si Paula y Hugo dicen que ya lo han hecho de forma plausible, la respuesta guiada debe encargarse del avance. Si escriben algo raro o inseguro, Topotino debe redirigir hacia una acción sencilla, segura y respetuosa.
