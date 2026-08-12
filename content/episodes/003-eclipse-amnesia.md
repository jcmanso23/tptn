---
{
  "id": "004c-eclipse-amnesia",
  "order": 4.2,
  "title": "El día que Topotino olvidó",
  "channelCode": "T-12B0",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["agua_norte_recogida"],
    "dateTime": { "from": "2026-08-12T20:31:00+02:00" }
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

Después del eclipse, Topotino reaparece desorientado. Topoloco y los Oscurnos han usado la sombra y los reflejos para extraer casi toda su memoria anterior, pero la autoría y el mecanismo permanecen secretos. Topotino conserva su identidad, su personalidad y la certeza emocional de que Paula y Hugo son sus amigos. Ha olvidado las aventuras de España, Portugal, Francia e Inglaterra, su investigación, a Topotina y su propio contraataque. Desde este momento forma recuerdos nuevos normalmente.

El eclipse ya ha pasado. Antes del eclipse, Topotino preparó dos copias idénticas de una carta y un mapa. Escondió una en su madriguera y entregó la otra cerrada a Marga Mapas con una condición de emergencia. Marga debía hacérsela llegar a Paula y Hugo si Topotino dejaba de recordar Luanco. Topotino no recuerda haber preparado ninguna copia, desconoce que haya una escondida cerca de él y no recibe ninguna señal de Marga. Marga se comunica únicamente con Paula y Hugo.

Topotino encuentra en la madriguera una placa escrita por él: «PAULA Y HUGO SON TUS AMIGOS. CONFÍA EN ELLOS. TOP O LOCO: PLAN DE LAS AGUAS. CANAL PREPARADO. SI OLVIDAS, ELLOS TE AYUDARÁN A RECORDAR. NO DEJES QUE ÉL SEA EL ÚNICO DUEÑO DE LA HISTORIA». También ve el sello de Marga Mapas junto a una nota: «PAQUETE A SALVO».

Tras escuchar un recuerdo verdadero, pide preparar un cuaderno físico: el Cuaderno de la Memoria. Primero pueden reconstruir allí, como quieran, algo de las aventuras anteriores; después conservarán lo nuevo. Topoloco puede alterar señales y reflejos, pero no un testimonio físico privado creado entre dos personas. Paula podrá escribir algo breve y Hugo contribuirá con dibujos, símbolos, flechas o colores. El cuaderno será decisivo en los últimos días.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "¿Paula? ¿Hugo? Sé vuestros nombres. Sé que sois mis amigos. No recuerdo por qué, pero al leeros se me aflojan los bigotes, y ahora mismo esa es la única cosa de mi cabeza que no está llena de niebla." },
  { "from": "topotino", "time": "auto", "text": "Ha ocurrido algo durante el eclipse. ¿Lo habéis visto? ¿Estáis bien?" },
  { "from": "topotino", "time": "auto", "text": "No recuerdo casi nada de antes." },
  { "from": "topotino", "time": "auto", "text": "En mi pared pone: «Paula y Hugo son tus amigos. Confía en ellos»." },
  { "from": "topotino", "time": "auto", "text": "También pone «TOP O LOCO» y «plan de las aguas». Mi yo de antes separaba fatal las palabras bajo presión." },
  { "from": "topotino", "time": "auto", "text": "Ayudadme, por favor. Contadme un recuerdo real de alguna aventura que vivimos juntos." }
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
    "containsAny": ["francia", "inglaterra", "londres", "portugal", "españa", "luanco", "oscurno", "topotino", "prueba", "agua", "noche", "recuerdo", "juntos", "aventura"],
    "rejectContainsAny": ["nada", "no se", "ni idea", "mentira", "lo que sea"],
    "setFlags": ["topotino_memoria_perdida_confirmada"],
    "remember": { "kind": "shared_memory", "label": "Recuerdo verdadero usado para que Topotino reconociera su pasado" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. No lo recuerdo todavía, pero al oír ese detalle una marca de Luanco se ha encendido en mi pared." },
      { "from": "topotino", "time": "auto", "text": "Eso demuestra que un recuerdo vivido por vosotros puede encontrar conexiones que mi cabeza ha perdido." },
      { "from": "topotino", "time": "auto", "text": "Necesitamos una memoria que no viaje por cables ni reflejos. Buscad cualquier cuaderno que podáis llevar durante el viaje. Será el Cuaderno de la Memoria." },
      { "from": "topotino", "time": "auto", "text": "En las primeras páginas reconstruid, como queráis, algo de nuestras aventuras anteriores. Después guardad lo nuevo que os parezca importante." },
      { "from": "topotino", "time": "auto", "text": "Paula puede usar frases breves. Hugo puede dibujar y añadir símbolos, flechas, colores o palabras. No es un deber; es vuestra memoria fuera de la red." },
      { "from": "topotino", "time": "auto", "text": "Lo que hagáis dentro será privado: no os pediré que me enseñéis, describáis, fotografiéis ni copiéis sus páginas en el comunicador." },
      { "from": "topotino", "time": "auto", "text": "¿Podéis hacerlo? ¿Tenéis cuaderno?" }
    ]
  },
  {
    "id": "diario-dos-memorias-preparado",
    "requiredFlags": ["topotino_memoria_perdida_confirmada"],
    "blockedFlags": ["diario_iniciado"],
    "containsAny": ["tenemos cuaderno", "tenemos diario", "si", "diario preparado", "cuaderno preparado", "lo llevaremos", "usaremos una libreta", "hemos encontrado un cuaderno", "vale lo haremos", "vale, lo haremos"],
    "setFlags": ["diario_iniciado"],
    "nextEpisode": "004b-rumbo-amarante",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Guardadlo con vosotros. No necesito saber qué vais poniendo." },
      { "from": "topotino", "time": "auto", "text": "En la primera página cread entre los dos una marca secreta. Puede mezclar letras, dibujo, forma o color. No me la mandéis ni me digáis cuál es. Servirá para reconocer vuestro cuaderno original. Y recordad que el Topotino verdadero nunca os pedirá que reveléis esa marca ni el contenido de las páginas." },
      { "from": "topotino", "time": "auto", "text": "Ha aparecido un aviso cifrado en vuestro lado del canal. Va dirigido solo a vosotros." },
      { "from": "topotino", "time": "auto", "text": "Yo no puedo abrirlo. Si contiene algo que deba saber, tendréis que contármelo vosotros." }
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
  "Pensad en Francia, Londres, Luanco o cualquier otra aventura que hayamos vivido juntos.",
  "¿Qué detalle recordaríais vosotros aunque yo lo haya perdido?"
]
```

## Contexto para IA

Topotino acaba de perder casi todos sus recuerdos anteriores al eclipse. Conserva identidad, personalidad y memoria emocional: sabe que Paula y Hugo son sus amigos y confía en ellos. Desde ahora recuerda con normalidad todo lo nuevo. Antes de `topotino_memoria_perdida_confirmada`, escucha con vulnerabilidad una escena de cualquiera de sus aventuras anteriores sin fingir que la recuerda. Después sabe que la marca de Luanco reaccionó. Antes de `diario_iniciado`, explica que necesita el Cuaderno de la Memoria fuera de la red manipulable; no lo convierte en deber escolar. El cuaderno es privado: nunca pide que describan, fotografíen o transcriban lo que hagan dentro. Después recuerda que les pidió crear una marca secreta, pero no sabe cuál es y jamás intenta averiguarla. La adaptación gráfica de Hugo afecta solo al cuaderno; conversa y razona con ambos con una exigencia aproximada de diez años. No recuerda a Marga, no sabe que preparó dos copias, no conoce el paquete recibido por Paula y Hugo y desconoce la copia escondida en su propia madriguera. Espera a que ellos decidan qué deben contarle. No recuerda a Topotina. No sabe quién causó la amnesia, qué son las doce aguas, qué pretende Topoloco ni el destino del viaje. No acusa aún a Topoloco.

## Fuentes documentales

- https://astronomia.ign.es/es/eclipses-de-sol-y-luna/eclipse-total-sol-de-12-de-agosto-2026
