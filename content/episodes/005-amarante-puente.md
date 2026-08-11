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

Es 13 de agosto, primer día del gran viaje tras el eclipse. Paula y Hugo llegan a Amarante. El Tâmega, la Ponte de São Gonçalo y su iglesia permiten descubrir que el agua guarda recuerdos cuando alguien vive una experiencia, la observa y sabe contarla.

Topotino ha interceptado la primera prueba clara del plan de Topoloco: una etiqueta del futuro «Museo Topoloco de Recuerdos Exclusivos» y restos del Aspirador Portátil de Reflejos. Topoloco quiere poseer recuerdos sin vivirlos. Todavía no debe revelarse que necesita que los niños despierten cada memoria antes de poder intentar capturarla.

La prueba debe poder completarse aunque la iglesia esté cerrada, llueva o la familia esté cansada. Nunca se pide recoger agua del río, acercarse a bordes, separarse de los adultos ni tocar el patrimonio.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Paula, Hugo... el eclipse ha dejado mis mapas llenos de reflejos. Y uno acaba de estornudar dentro del Tâmega." },
  { "from": "topotino", "time": "auto", "text": "He encontrado una etiqueta mojada: «Museo Topoloco de Recuerdos Exclusivos · sala 1». Debajo pone: «puente que une demasiado». Ese topo pretende robar recuerdos del agua para presumir de que son suyos." },
  { "from": "topotino", "time": "auto", "text": "La señal viene de una ciudad atravesada por un río y vigilada por una ponte que lleva el nombre de São Gonçalo. Si ya sabéis dónde estáis, escribid solo el nombre de la ciudad." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "amarante-identificado",
    "blockedFlags": ["amarante_identificado"],
    "match": ["amarante", "estamos en amarante", "hemos llegado a amarante"],
    "setFlags": ["amarante_identificado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Amarante. Exacto. Aquí el Tâmega no pasa por detrás de la ciudad: pasa por su corazón." },
      { "from": "topotino", "time": "auto", "text": "Necesito ojos de explorador, no respuestas de examen. Desde un lugar seguro, mirad la ponte y elegid un detalle que os parezca capaz de guardar una historia: una piedra, un arco, uno de sus balcones, el agua, la iglesia o una pequeña figura que vigila desde ella." },
      { "from": "topotino", "time": "auto", "text": "Contadme qué habéis visto y por qué lo habéis elegido. Si está cerrado, llueve o ya es tarde, vale mirar desde fuera, desde una ventana o en una foto vuestra. Los recuerdos no obligan a nadie a correr." }
    ]
  },
  {
    "id": "amarante-puente-observado",
    "requiredFlags": ["amarante_identificado"],
    "blockedFlags": ["amarante_puente_observado"],
    "openAnswer": true,
    "minWords": 3,
    "containsAny": ["puente", "ponte", "piedra", "arco", "arcos", "balcon", "balcón", "agua", "rio", "río", "iglesia", "ventana", "figura", "virgen", "señora", "pez", "peces", "obelisco"],
    "rejectContainsAny": ["no se", "ni idea", "da igual"],
    "setFlags": ["amarante_puente_observado"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Eso sí puede guardar memoria. La tradición cuenta que São Gonçalo levantó una antigua ponte con ayuda del pueblo, movió piedras enormes e hizo acudir peces para alimentar a quienes trabajaban. Topoloco ha apuntado: «posible cuadrilla de peces albañiles». No ha entendido nada." },
      { "from": "topotino", "time": "auto", "text": "La ponte antigua cayó por las lluvias en 1763, pero una pequeña imagen de piedra sobrevivió. La nueva también recuerda a la gente de Amarante que resistió aquí durante catorce días en 1809. Este lugar sabe una cosa: cruzar no es olvidar la orilla de la que vienes." },
      { "from": "topotino", "time": "auto", "text": "Última parte. Elegid juntos un recuerdo de este primer día que queráis llevar hasta el final del viaje: algo visto, hecho, dicho o sentido. Escribid «QUE RECUERDE...» y terminad la frase con vuestras palabras." }
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
      { "from": "topotino", "time": "auto", "text": "Memoria recibida. Ahora el agua sabe algo que Topoloco no puede inventarse: cómo comenzó vuestro viaje de verdad." },
      { "from": "topotino", "time": "auto", "text": "Agua del Puente guardada. Su palabra es COMIENZO. Si lleváis recipiente, usad solo tres gotas de agua potable. Nunca agua del río. Si no, vuestra frase ya es un recipiente perfecto." },
      { "from": "topotino", "time": "auto", "text": "El Aspirador Portátil de Reflejos ha fallado. Solo ha aspirado dos hojas, su propia etiqueta y algo que parece un calcetín de Topoloco." },
      { "from": "topotino", "time": "auto", "text": "Pero ha dejado un plano: seis mundos mezclados, una rueda enorme, un barco que se balancea y agua que corre haciendo ruido. Mañana sus máquinas buscarán algo que el agua hace cuando está muy contenta." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Mis bigotes no buscan una palabra secreta cualquiera. Primero decidme en qué ciudad del Tâmega estáis.",
  "No hace falta acertar un dato histórico. Contadme algo que hayáis visto de verdad en la ponte, el río o la iglesia.",
  "Para guardar la memoria, empezad por «QUE RECUERDE...» y elegid un momento real de hoy."
]
```

## Pistas progresivas

```json
[
  "La ciudad empieza por A y el Tâmega pasa bajo su ponte más famosa.",
  "Podéis elegir cualquier detalle visible y seguro: piedra, agua, arco, balcón, iglesia o reflejo.",
  "No busquéis la frase perfecta. ¿Qué momento de vuestra llegada contaríais dentro de muchos años?"
]
```

## Contexto para IA

Topotino habla con misterio, humor y cercanía. Puede explicar que la tradición atribuye a São Gonçalo la construcción de la antigua ponte con ayuda del pueblo, el movimiento de piedras y los peces; también puede contar la caída de 1763, la imagen superviviente y la resistencia de 1809. Debe distinguir tradición de historia documentada. No examina ni exige cifras exactas. Acepta observaciones personales razonables y adapta la misión a lluvia, cierre o cansancio. No revela destinos posteriores, Granada, los doce leones ni que Topoloco necesita a los niños para despertar los recuerdos. Nunca pide agua del río.

## Fuentes documentales

- https://amarantetourism.com/poi/ponte-de-sao-goncalo/
- https://amarantetourism.com/poi/os-milagres-de-sao-goncalo/
- https://www.cm-amarante.pt/amarante-evoca-a-defesa-da-ponte-com-programa-cultural-e-evocativo-no-dia-2-de-maio/
