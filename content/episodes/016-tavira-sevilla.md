---
{
  "id": "016-tavira-sevilla",
  "order": 16,
  "title": "Día 12 · La ruta que salía al mar",
  "channelCode": "T-25A0",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-24" }, "location": { "lat": 37.1268750, "lng": -7.6498436, "radiusMeters": 1600, "label": "Centro de Tavira" } },
  "mission": "Seguir la alteración de Borrón y recuperar lo que ha separado",
  "formulaWord": null,
  "water": "Agua de las Dos Orillas",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

La mañana empieza con una anomalía comprensible: alguien ha añadido la palabra «ROMANO» a la señal del puente de siete arcos. Paula y Hugo no tienen por qué conocer a Borrón. Topotina reconoce una firma oscura, pero espera a que observen el lugar antes de explicar que Borrón es uno de los Oscurnos derrotados en Francia: cambia etiquetas y elimina detalles hasta conseguir que todos repitan una única versión.

La expedición conecta puente, río Gilão, castillo, calles y salida hacia el mar. Tavira fue una ciudad portuguesa ligada a navegación, pesca y comercio; desde una vista alta puede imaginarse cómo personas y mercancías se movían por una ciudad construida alrededor del agua. El aprendizaje no depende de visitar un museo ni de afirmar que el puente sea romano: la evidencia permite describirlo como medieval y reconstruido hacia 1655, mientras «romano» permanece como denominación popular no demostrada.

Después de derrotar la alteración, Topotina abre durante un minuto una señal verificada de Louri. Él ha interceptado una frase de Topoloco: «el último cargamento seguirá la autopista de agua hasta la ciudad que guardaba los viajes a América». Louri no sabe la respuesta. Paula y Hugo deben relacionar mar, Guadalquivir, comercio y archivo para deducir Sevilla.

Al llegar a Sevilla, Topotina detecta once cortes en el registro de Borrón. No conoce de antemano una ruta familiar: comprende que el Oscurno está intentando separar lugares que, juntos, demuestran que una ciudad conserva varias épocas y funciones. Paula y Hugo recuperan los puntos de uno en uno, siempre después de una conversación que deja la siguiente pista.

El recorrido avanza en cinco tramos. Las Setas reúnen estructura contemporánea, mercado actual y restos antiguos. Sierpes conduce a las dos fachadas del Ayuntamiento entre San Francisco y Plaza Nueva. La Avenida de la Constitución desemboca en Catedral, Giralda y los tres testigos de Plaza del Triunfo. Santa Cruz demuestra cómo un trazado medieval responde al calor. La Fábrica de Tabacos cambió de industria a Universidad. María Luisa y Plaza de España cierran el recorrido con la Exposición Iberoamericana de 1929 y una nueva mirada hacia América.

En Plaza del Triunfo aparece una señal con plumas. Topotina la verifica y entra Capitán Pico. Se presenta con varios títulos inventados y presenta a América, que investiga fuera del chat y nunca escribe. Ambos interceptaron «tres testigos alrededor de un triunfo». Pico ayuda con humor, pero Paula y Hugo siguen siendo quienes observan y deciden.

La experiencia real termina cuando toca comenzar Santa Cruz. Paula y Hugo se retiran y hacen bien: han recuperado siete testigos y no se finge que visitaron los cuatro restantes. Durante la noche Borrón desplaza esos cortes. El día 25 Topotina descubre que la señal ha cruzado el Guadalquivir hacia la Isla de la Cartuja; la continuación pertenece ya al episodio final.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Ayer descubrimos algo importante: Topoloco provocó mi amnesia para apartarme de sus planes." },
  { "from": "topotina", "time": "auto", "text": "Esta mañana ha aparecido una alteración nueva. Alguien ha escrito «ROMANO» sobre la señal de un puente de siete arcos." },
  { "from": "topotino", "time": "auto", "text": "No sé quién lo hizo ni por qué una sola palabra importa tanto. Recorred el puente, el río y una vista alta de la ciudad. Después acusaremos con pruebas." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "tavira-quien-es-borron",
    "blockedFlags": ["completado_tavira_sevilla"],
    "containsAny": ["quién es borrón", "quien es borron", "qué es borrón", "que es borron", "no conocemos a borrón", "no sabemos quién es"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "No deberíais conocerlo todavía. Solo tengo una firma oscura y una palabra cambiada. Cuando comprobemos qué ha hecho en Tavira os diré si coincide con alguien de Francia." },
      { "from": "topotino", "time": "auto", "text": "Bien preguntado. Nada de fingir que ya sabemos lo que todavía estamos investigando." }
    ]
  },
  {
    "id": "sevilla-quien-es-pico",
    "blockedFlags": ["completado_tavira_sevilla"],
    "containsAny": ["quién es capitán pico", "quien es capitan pico", "quién es pico", "quien es pico", "quién es américa", "quien es america"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Todavía no lo sabemos. Solo tengo una señal con plumas cerca de Plaza del Triunfo. Primero comprobaré la firma; después dejaremos que se presente él mismo, que parece muy dispuesto." },
      { "from": "topotino", "time": "auto", "text": "Demasiado dispuesto. Ya ha enviado una tarjeta que dice «Capitán, almirante y probablemente leyenda»." }
    ]
  },
  {
    "id": "tavira-impedimento",
    "blockedFlags": ["completado_tavira_sevilla"],
    "containsAny": ["no podemos", "cerrado", "cambio de plan", "no podemos subir"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Decidme qué acceso falla. Podemos observar el Gilão y el puente desde otra ribera o sustituir el castillo por cualquier vista alta y segura de Tavira." }
    ]
  },
  {
    "id": "tavira-cierre",
    "blockedFlags": ["completado_tavira_sevilla"],
    "containsAny": ["hemos terminado tavira", "hemos acabado", "ya lo hemos hecho"],
    "setFlags": ["completado_tavira_sevilla"],
    "water": "Agua de las Dos Orillas",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Habéis recuperado la historia del puente y la ruta del río. Ahora seguiremos la frase que interceptó Louri." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Empezad por algo visible: el puente cruza un río y ese río continúa hacia el mar.",
  "No hace falta conocer ningún personaje de antemano. Primero descubrimos qué ha ocurrido y después ponemos nombre al responsable.",
  "La ciudad final debe estar conectada con el Atlántico por un río y conservar documentos de viajes a América.",
  "En Sevilla no busquéis once sitios a la vez. El chat mostrará un único tramo y la siguiente conversación dejará otra pista."
]
```

## Pistas progresivas

```json
[
  "Desde una vista alta, seguid con la mirada el Gilão desde el puente hacia la salida de la ciudad.",
  "El responsable cambia palabras y quita detalles para que solo quede su versión. Topotina recuerda a un Oscurno que hacía eso en Francia.",
  "La ciudad de la pista está atravesada por el Guadalquivir y conserva el Archivo de Indias.",
  "Una estructura moderna que parece un grupo de hongos protege un mercado y se levanta sobre restos mucho más antiguos.",
  "Una calle con nombre de serpiente lleva hasta un Ayuntamiento con dos caras de épocas distintas.",
  "Tres edificios alrededor de Plaza del Triunfo conservan poder, religión y documentos: ninguno cuenta solo toda la ciudad.",
  "El último tramo une un parque público con una plaza construida para la Exposición Iberoamericana de 1929.",
  "La isla de mañana está dentro de Sevilla, representa viajes y comparte una firma técnica con Magikland."
]
```

## Contexto para IA

Mensajes cortos, concretos y conversacionales. Borrón no es conocido al inicio: solo después de observar la alteración Topotina lo presenta como un Oscurno de Francia que cambia etiquetas y elimina detalles. No usar «perspectiva», «capas», «red» o «autoría» sin un ejemplo visible inmediato. Louri entra mediante una invitación verificada de un minuto, aporta una frase interceptada y desconoce la respuesta. La ruta a Sevilla solo se pregunta después de esa conversación.

En Sevilla solo se nombra el tramo ya descubierto. Nunca enumerar los once puntos ni adelantar el siguiente. La experiencia vivida se detuvo antes de investigar Santa Cruz. No afirmar que visitaron Santa Cruz, Fábrica de Tabacos, María Luisa o Plaza de España; tampoco que hablaron con Tecla por la noche. El día 25 una migración conserva los siete testigos reales y traslada los cuatro pendientes al arco final.

Capitán Pico aparece por primera vez en Plaza del Triunfo, después de que Topotina verifique la señal. Es grandilocuente, valiente, algo presumido y concede títulos navales absurdos. Presenta a América como compañera sobre el terreno; América no escribe ni aparece como remitente. Pico aporta «tres testigos alrededor de un triunfo», pero no conoce el plan completo ni resuelve pruebas. Tecla entra por la noche y explica el Cuaderno de Bitácora Único antes de dejar pistas de Isla Mágica. No presentar a Krim, Marga, Rufino o Corvinho. El Cuaderno de la Memoria sigue privado.

## Fuentes documentales

- https://visitartavira.pt/en/cultural-heritage/old-bridge/
- https://visitasevilla.es/torre-del-oro/
- https://www.cultura.gob.es/cultura/areas/archivos/mc/archivos/agi/portada.html
- https://visitasevilla.es/setas-y-mercado-de-la-encarnacion/
- https://visitasevilla.es/calle-sierpes-y-ayuntamiento/
- https://visitasevilla.es/ayuntamiento/
- https://whc.unesco.org/es/list/383
- https://visitasevilla.es/barrio-de-santa-cruz/
- https://www.us.es/actualidad-de-la-us/la-fabrica-de-tabacos-de-sevilla-historia-de-un-edificio-unico
- https://visitasevilla.es/parque-de-maria-luisa-2/
- https://visitasevilla.es/plaza-de-espana-2/
