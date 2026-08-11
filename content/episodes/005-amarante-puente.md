---
{
  "id": "005-amarante-puente",
  "order": 5,
  "title": "Día 1 · El puente que recuerda",
  "channelCode": "T-19B4",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "date": { "on": "2026-08-13" },
    "time": { "from": "17:00", "to": "23:59" }
  },
  "mission": "El puente que recuerda",
  "formulaWord": "COMIENZO",
  "water": "Agua del Puente",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Es 13 de agosto, primer día del gran viaje tras el eclipse. Paula y Hugo llegan a la ciudad que descubrieron en la señal. El Tâmega, la Ponte de São Gonçalo y su iglesia permiten comprobar que el agua reacciona a una experiencia vivida y recordada.

Topotino no conoce el plan de Topoloco. Solo detecta que alguien ha pasado antes por la ponte y encuentra un fragmento metálico con las letras «...REFL...». Al final puede sospechar que Topoloco intentaba extraer algo que la ponte recordaba, pero no sabe para qué, cuántas veces piensa hacerlo ni que existe un museo.

La ruta principal se presenta sin alternativas anticipadas. Si los niños comunican lluvia, cierre, cansancio u otro impedimento, Topotino ofrece entonces una sola adaptación adecuada. Nunca se pide recoger agua del río, acercarse a bordes, separarse de los adultos ni tocar el patrimonio.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "La señal ha vuelto. Habéis llegado al lugar exacto y se ha encendido justo ahora. Eso me tranquilizaría mucho más si supiera por qué." },
  { "from": "topotino", "time": "auto", "text": "Mis topos han encontrado cerca de la ponte un trocito de metal con barro y solo cinco letras legibles: «...REFL...». Parece de una máquina. Y sí: huele un poco a Topoloco." },
  { "from": "topotino", "time": "auto", "text": "Necesito que miréis la Ponte de São Gonçalo desde un lugar seguro. Elegid un detalle que parezca capaz de guardar una historia —piedra, arco, balcón, agua, iglesia o figura— y contadme qué habéis elegido y por qué." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "amarante-alternativa-lluvia",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["llueve", "esta lloviendo", "está lloviendo", "mucha lluvia", "tormenta"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entonces nada de buscar bajo la lluvia. Poneos a cubierto con los adultos y mirad desde allí cómo cambia el agua o el reflejo de la ponte. Elegid un solo detalle visible desde ese lugar y contadme por qué parece guardar una historia." }
    ]
  },
  {
    "id": "amarante-alternativa-cierre",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["cerrado", "cerrada", "no podemos entrar", "no nos dejan entrar", "es muy tarde", "ya es tarde"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "No intentéis entrar. La prueba se queda fuera: observad la ponte y la fachada desde el recorrido permitido. Elegid un detalle exterior que haya visto pasar muchos años y contadme cuál es." }
    ]
  },
  {
    "id": "amarante-alternativa-cansancio",
    "blockedFlags": ["amarante_puente_observado"],
    "containsAny": ["estamos cansados", "estoy cansado", "estoy cansada", "no podemos caminar", "nos duelen los pies"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Recibido. No caminéis más por mí. Desde donde descanséis, elegid en una foto vuestra o en el recuerdo de la llegada un detalle de la ponte, el río o la iglesia. Decidme qué detalle se os ha quedado dentro." }
    ]
  },
  {
    "id": "amarante-alternativa-preguntar",
    "blockedFlags": ["amarante_puente_observado"],
    "match": ["no podemos", "no podemos hacerlo", "no se puede", "no podemos hacer la prueba"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Entendido. No forcéis nada. Decidme solo qué lo impide —lluvia, un cierre, cansancio u otra cosa— y buscaré una forma segura de seguir desde donde estáis." }
    ]
  },
  {
    "id": "amarante-puente-observado",
    "blockedFlags": ["amarante_puente_observado"],
    "openAnswer": true,
    "minWords": 3,
    "containsAny": ["puente", "ponte", "piedra", "arco", "arcos", "balcon", "balcón", "agua", "rio", "río", "iglesia", "ventana", "figura", "virgen", "señora", "pez", "peces", "obelisco"],
    "rejectContainsAny": ["no se", "ni idea", "da igual"],
    "setFlags": ["amarante_puente_observado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Eso sí puede guardar memoria. La tradición cuenta que São Gonçalo levantó una antigua ponte con ayuda del pueblo, movió piedras enormes e hizo acudir peces para alimentar a quienes trabajaban. Topoloco ha apuntado: «posible cuadrilla de peces albañiles». No ha entendido nada." },
      { "from": "topotino", "time": "auto", "text": "La ponte antigua cayó por las lluvias en 1763, pero una pequeña imagen de piedra sobrevivió. La nueva también recuerda a la gente de Amarante que resistió aquí durante catorce días en 1809. Este lugar sabe una cosa: cruzar no es olvidar la orilla de la que vienes." },
      { "from": "topotino", "time": "auto", "text": "El trocito de máquina acaba de vibrar al recibir vuestra observación. No sé qué significa. Probad una cosa: elegid juntos un recuerdo de este primer día y escribid «QUE RECUERDE...» seguido de ese momento." }
    ]
  },
  {
    "id": "amarante-memoria-guardada",
    "requiredFlags": ["amarante_puente_observado"],
    "blockedFlags": ["completado_amarante"],
    "openAnswer": true,
    "minWords": 4,
    "containsAny": ["que recuerde", "recordamos", "queremos recordar", "no olvidar", "viaje", "llegada", "familia", "puente", "amarante"],
    "rejectContainsAny": ["nada", "no se", "ni idea", "lo que sea"],
    "setFlags": ["completado_amarante"],
    "water": "Agua del Puente",
    "formulaWord": "COMIENZO",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Ha ocurrido. El agua ha respondido a vuestro recuerdo. No sé cómo explicarlo todavía, pero ha guardado la forma en que comenzó vuestro viaje." },
      { "from": "topotino", "time": "auto", "text": "Agua del Puente guardada. Su palabra es COMIENZO. Si lleváis recipiente, usad solo tres gotas de agua potable. Nunca agua del río. Si no, vuestra frase ya es un recipiente perfecto." },
      { "from": "topotino", "time": "auto", "text": "Y el trocito metálico ha soltado dos hojas, un calcetín de Topoloco y una palabra incompleta: «REFLEJOS». Empiezo a sospechar que no buscaba el agua, sino algo que la ponte recordaba. Solo es una sospecha." },
      { "from": "topotino", "time": "auto", "text": "También ha caído un plano: seis mundos mezclados, una rueda enorme, un barco que se balancea y agua que corre haciendo ruido. No sé qué lugar es. Mañana lo investigaremos." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "No necesito un dato perfecto. Contadme algo que hayáis visto de verdad en la ponte, el río o la iglesia.",
  "Elegid un detalle y decidme por qué os ha llamado la atención.",
  "Para guardar la memoria, empezad por «QUE RECUERDE...» y elegid un momento real de hoy."
]
```

## Pistas progresivas

```json
[
  "Mirad una sola cosa con calma: piedra, agua, arco, balcón, iglesia o reflejo.",
  "No busquéis la frase perfecta. ¿Qué momento de vuestra llegada contaríais dentro de muchos años?"
]
```

## Contexto para IA

Topotino habla con misterio, humor y cercanía y reconoce lo que ignora. Al inicio solo sabe que la señal ha despertado en Amarante y que apareció un fragmento de máquina con «...REFL...». Tras una observación puede explicar que la tradición atribuye a São Gonçalo la construcción de la antigua ponte con ayuda del pueblo, el movimiento de piedras y los peces; también puede contar la caída de 1763, la imagen superviviente y la resistencia de 1809. Debe distinguir tradición de historia documentada. Tras `completado_amarante` solo sospecha que Topoloco buscaba algo que la ponte recordaba; no conoce el museo ni el plan completo. Presenta la prueba principal sin alternativas. Solo si Paula o Hugo indican un obstáculo ofrece una única adaptación adecuada a ese problema. No revela destinos posteriores, Granada, los doce leones ni que Topoloco necesita a los niños para despertar los recuerdos. Nunca pide agua del río.

## Fuentes documentales

- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
- https://www.cm-amarante.pt/amarante-evoca-a-defesa-da-ponte-com-programa-cultural-e-evocativo-no-dia-2-de-maio/
