---
{
  "id": "003-luanco-agua-norte",
  "order": 3,
  "title": "Luanco · La primera señal",
  "channelCode": "T-12B0",
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

Es sábado 27. Los topos han revisado la observación de Luanco. Topotino todavía no conoce la red completa, pero sospecha que Topoloco está haciendo pruebas con lugares donde el agua y los recuerdos se cruzan.

Topotino no sabe todavía para qué sirve la prueba. Topoloco es egoísta y huidizo, no un torpe constante.

Paula y Hugo deben recoger muy poca agua, como tres gotas, de forma segura y respetuosa. Deben etiquetarla simplemente como LUANCO. No hace falta cantidad: es una muestra para la investigación anterior al eclipse.

No revelar la lista completa de aguas ni destinos futuros.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Amigos, acabo de recibir respuesta de los topos vigía." },
  { "from": "topotino", "time": "auto", "text": "Venía en un papel húmedo, doblado en forma de ola. Eso, en lenguaje topo, significa asunto importante." },
  { "from": "topotino", "time": "auto", "text": "La señal de anoche no era una pista suelta. Topoloco está probando algo con el agua y los recuerdos de los lugares." },
  { "from": "topotino", "time": "auto", "text": "No sé todavía para qué. Y eso me pone los bigotes de punta." },
  { "from": "topotino", "time": "auto", "text": "Necesito que cojáis solo un poquito de agua. Tres gotas bastan. Las aguas importantes no pesan por cantidad, pesan por recuerdo." },
  { "from": "topotino", "time": "auto", "text": "Ponedle una etiqueta que diga LUANCO. Así sabremos de dónde salió la muestra." },
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
      { "from": "topotino", "time": "auto", "text": "Muestra de Luanco guardada. No es mucha, pero conserva el lugar exacto donde empezó esta señal." },
      { "from": "topotino", "time": "auto", "text": "Es importante que no la perdáis." },
      { "from": "topotino", "time": "auto", "text": "Escuchad... me llega una primera palabra... es MIRO." },
      { "from": "topotino", "time": "auto", "text": "¿Para qué servirá?" },
      { "from": "topotino", "time": "auto", "text": "La siguiente señal no se abre en una calle." },
      { "from": "topotino", "time": "auto", "text": "Se abrirá cuando el día parezca noche sin ser noche, y la luna se ponga delante del sol como si quisiera taparle un secreto." },
      { "from": "topotino", "time": "auto", "text": "Ese día llevad preparada una maleta para muchos días. No sé explicarlo todavía, pero mis mapas tiemblan como cuando empieza una aventura larga." },
      { "from": "topotino", "time": "auto", "text": "No puedo decir más. Corto comunicación hasta entonces. Y recordad: el sol nunca se mira directamente. Ni por juego, ni por misión, ni por curiosidad." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Todavía no marco la muestra de Luanco como guardada. Recordad coger solo tres gotas de agua del mar.",
  "No hace falta mucha agua. Hace falta cuidarla y recordar de dónde viene.",
  "Cuando la tengáis en el botecito con su pegatina, decidme que está hecho."
]
```

## Contexto para IA

Topotino explica que la muestra sirve para investigar la relación entre agua, lugar y recuerdo, sin inventar todavía el mapa ni la ruta. Debe insistir en recoger muy poca agua, respetar el lugar y etiquetar el bote como LUANCO.

Si Paula y Hugo dicen que ya lo han hecho de forma plausible, la respuesta guiada debe encargarse del avance. Si escriben algo raro o inseguro, Topotino debe redirigir hacia una acción sencilla, segura y respetuosa.
