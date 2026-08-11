---
{
  "id": "004c-eclipse-amnesia",
  "order": 4.2,
  "title": "El día que Topotino olvidó",
  "channelCode": "T-12A7",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["agua_norte_recogida"],
    "dateTime": { "from": "2026-08-12T20:35:00+02:00" }
  },
  "mission": "Reconstruir el primer recuerdo",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Después del eclipse, Topotino reaparece desorientado. Topoloco ha utilizado el Borrador de Reflejos contra él, pero esto permanece secreto hasta la Alhambra nocturna. Topotino conserva su identidad, su personalidad y la certeza emocional de que Paula y Hugo son sus amigos. Ha olvidado Londres, Luanco, su investigación, el plan enemigo y su propio contraataque. Desde este momento forma recuerdos nuevos normalmente.

La aventura no exige observar el eclipse. Es obligatorio recordar que el sol nunca se mira directamente y que solo se usan medios homologados siguiendo a los adultos.

Topotino encuentra en la madriguera una placa escrita por él: «PAULA Y HUGO SON TUS AMIGOS. CONFÍA EN ELLOS. TOP O LOCO: PLAN DE LAS AGUAS. CANAL PREPARADO. SI OLVIDAS, ELLOS TE AYUDARÁN A RECORDAR. NO DEJES QUE ÉL SEA EL ÚNICO DUEÑO DE LA HISTORIA». También encuentra: «EL AGUA NO GUARDA LO QUE MIRAS. GUARDA CÓMO LO VIV...».

Tras escuchar un recuerdo verdadero, pide preparar un cuaderno físico: el Diario de las Dos Memorias. Topoloco puede alterar señales y reflejos, pero dos testimonios manuscritos quedan fuera de su red. El diario será necesario en los últimos días y decisivo en la Alhambra.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "¿Paula? ¿Hugo? Sé vuestros nombres. Sé que sois mis amigos. No recuerdo por qué, pero al leeros se me aflojan los bigotes, y ahora mismo esa es la única cosa de mi cabeza que no está llena de niebla." },
  { "from": "topotino", "time": "auto", "text": "Ha ocurrido algo durante el eclipse. Primero: si lo habéis observado, siempre con los adultos y protección homologada. El sol nunca se mira directamente. Ni por una aventura, ni por mí, ni por nada." },
  { "from": "topotino", "time": "auto", "text": "No recuerdo Londres. No recuerdo Luanco. En mi pared hay una placa escrita por mí que dice que confíe en vosotros y que alguien —o algo— llamado «TOP O LOCO» tiene un plan relacionado con aguas. Francamente, mi yo de antes escribía fatal bajo presión." },
  { "from": "topotino", "time": "auto", "text": "Necesito comprobar que esos recuerdos existieron. Contadme un momento verdadero que hayamos vivido juntos y un detalle pequeño que un desconocido no podría inventar." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "topotino-recuerdo-ancla",
    "blockedFlags": ["topotino_memoria_perdida_confirmada"],
    "openAnswer": true,
    "minWords": 5,
    "containsAny": ["londres", "luanco", "topotino", "prueba", "agua", "noche", "brilla", "recuerdo", "juntos", "aventura"],
    "rejectContainsAny": ["nada", "no se", "ni idea", "mentira", "lo que sea"],
    "setFlags": ["topotino_memoria_perdida_confirmada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. No lo recuerdo todavía, pero ese detalle tiene bordes: no suena a una historia prestada. Y al escucharlo, el Agua del Norte ha vibrado. Creo que mi yo de antes la dejó como ancla para que no olvidara también a quién quería encontrar." },
      { "from": "topotino", "time": "auto", "text": "He encontrado otra frase a medio borrar: «EL AGUA NO GUARDA LO QUE MIRAS. GUARDA CÓMO LO VIV...». Me fastidia admitirlo, pero mi letra parece saber más que yo." },
      { "from": "topotino", "time": "auto", "text": "Necesitamos una memoria que no viaje por cables ni reflejos. Buscad cualquier cuaderno que podáis llevar durante el viaje. Será el Diario de las Dos Memorias: Paula escribirá o dibujará una parte y Hugo otra. No tiene que quedar bonito; tiene que ser vuestro." }
    ]
  },
  {
    "id": "diario-dos-memorias-preparado",
    "requiredFlags": ["topotino_memoria_perdida_confirmada"],
    "blockedFlags": ["diario_iniciado"],
    "containsAny": ["tenemos cuaderno", "tenemos diario", "diario preparado", "cuaderno preparado", "lo llevaremos", "usaremos una libreta", "hemos encontrado un cuaderno", "vale lo haremos", "vale, lo haremos"],
    "setFlags": ["diario_iniciado"],
    "nextEpisode": "004b-rumbo-amarante",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Guardadlo con vosotros. No os pediré redacciones: unas veces bastará un dibujo, una pregunta o dos líneas distintas. Si alguien vuelve a tocar nuestros recuerdos, ese diario será el testigo que no puede reprogramar." },
      { "from": "topotino", "time": "auto", "text": "La placa tiene dos dibujos en el reverso. No sé qué significan, pero los investigaremos juntos." }
    ]
  },
  {
    "id": "diario-aun-no-disponible",
    "requiredFlags": ["topotino_memoria_perdida_confirmada"],
    "blockedFlags": ["diario_iniciado"],
    "containsAny": ["no tenemos", "no hay cuaderno", "no tenemos cuaderno", "no tenemos libreta", "mañana lo buscamos", "lo compraremos"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No pasa nada. Usad por ahora una hoja y, antes de salir mañana, buscad una libreta cualquiera. No necesito lujo de papelería; necesito dos cabezas listas y algo que la tinta pueda defender." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "No busco una respuesta perfecta. Contadme una escena pequeña de Londres o Luanco que hayamos vivido juntos.",
  "Puede ser algo que vimos, algo que salió mal o una broma. Necesito un detalle real, no una contraseña.",
  "Si aún no tenéis cuaderno, decidme qué usaréis provisionalmente y preparad una libreta antes del viaje."
]
```

## Pistas progresivas

```json
[
  "Pensad en Londres, Luanco, el Agua del Norte o alguna conversación conmigo.",
  "¿Qué detalle recordaríais vosotros aunque yo lo haya perdido?"
]
```

## Contexto para IA

Topotino acaba de perder sus recuerdos anteriores al eclipse relacionados con Paula, Hugo y Topoloco. Conserva identidad, personalidad y memoria emocional: sabe que son sus amigos y confía en ellos. Desde ahora recuerda con normalidad todo lo nuevo. Antes de `topotino_memoria_perdida_confirmada`, escucha con vulnerabilidad y puede preguntar por una escena anterior sin fingir que la recuerda. Después sabe que el Agua del Norte reaccionó y que su yo anterior dejó una frase incompleta sobre cómo el agua guarda lo vivido. Antes de `diario_iniciado`, explica que necesita un cuaderno físico fuera de la red manipulable; no lo convierte en deber escolar. Después puede hablar de los dos dibujos de la placa. No sabe quién causó la amnesia, qué son las doce aguas, qué pretende Topoloco ni el destino del viaje. No acusa aún a Topoloco. Agradece de manera concreta los recuerdos y la ayuda. Si preguntan cómo observar el eclipse, exige adultos y protección homologada y recuerda que nunca se mira el sol directamente. No concede flags ni confirma que el diario está preparado: eso lo valida la respuesta guiada.

## Fuentes documentales

- https://astronomia.ign.es/es/eclipses-de-sol-y-luna/eclipse-total-sol-de-12-de-agosto-2026
