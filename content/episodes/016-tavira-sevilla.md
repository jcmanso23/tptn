---
{
  "id": "016-tavira-sevilla",
  "order": 16,
  "title": "Día 12 · La ruta que salía al mar",
  "channelCode": "T-24A0",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-24" }, "location": { "lat": 37.1268750, "lng": -7.6498436, "radiusMeters": 1600, "label": "Centro de Tavira" } },
  "mission": "Descubrir quién ha cambiado el puente y adónde conduce el río",
  "formulaWord": null,
  "water": "Agua de las Dos Orillas",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

La mañana empieza con una anomalía comprensible: alguien ha añadido la palabra «ROMANO» a la señal del puente de siete arcos. Paula y Hugo no tienen por qué conocer a Borrón. Topotina reconoce una firma oscura, pero espera a que observen el lugar antes de explicar que Borrón es uno de los Oscurnos derrotados en Francia: cambia etiquetas y elimina detalles hasta conseguir que todos repitan una única versión.

La expedición conecta puente, río Gilão, castillo, calles y salida hacia el mar. Tavira fue una ciudad portuguesa ligada a navegación, pesca y comercio; desde una vista alta puede imaginarse cómo personas y mercancías se movían por una ciudad construida alrededor del agua. El aprendizaje no depende de visitar un museo ni de afirmar que el puente sea romano: la evidencia permite describirlo como medieval y reconstruido hacia 1655, mientras «romano» permanece como denominación popular no demostrada.

Después de derrotar la alteración, Topotina abre durante un minuto una señal verificada de Louri. Él ha interceptado una frase de Topoloco: «el último cargamento seguirá la autopista de agua hasta la ciudad que guardaba los viajes a América». Louri no sabe la respuesta. Paula y Hugo deben relacionar mar, Guadalquivir, comercio y archivo para deducir Sevilla.

La tarde en Sevilla queda completamente libre. Si la familia pasa junto al Guadalquivir, la Torre del Oro, la Giralda o el Archivo de Indias, Topotina puede explicar su relación con el río y los viajes; no es una misión y nada se bloquea si no los ven.

Por la noche entra Tecla buscando un módulo que Topoloco le ha robado. Durante una conversación cómica explica que el **Cuaderno de Bitácora Único** guardará una sola versión de la aventura, nombrará a Topoloco capitán y reducirá a todos los demás a acompañantes. Antes de la pregunta aparecen tres pistas: una isla dentro de Sevilla, barcos y viajes a América, y la firma gemela de Magikland. Paula y Hugo deducen Isla Mágica. Tecla se niega a arreglar el módulo, se marcha y no participa mañana.

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
  "La ciudad final debe estar conectada con el Atlántico por un río y conservar documentos de viajes a América."
]
```

## Pistas progresivas

```json
[
  "Desde una vista alta, seguid con la mirada el Gilão desde el puente hacia la salida de la ciudad.",
  "El responsable cambia palabras y quita detalles para que solo quede su versión. Topotina recuerda a un Oscurno que hacía eso en Francia.",
  "La ciudad de la pista está atravesada por el Guadalquivir y conserva el Archivo de Indias.",
  "La isla de mañana está dentro de Sevilla, representa viajes y comparte una firma técnica con Magikland."
]
```

## Contexto para IA

Mensajes cortos, concretos y conversacionales. Borrón no es conocido al inicio: solo después de observar la alteración Topotina lo presenta como un Oscurno de Francia que cambia etiquetas y elimina detalles. No usar «perspectiva», «capas», «red» o «autoría» sin un ejemplo visible inmediato. Louri entra mediante una invitación verificada de un minuto, aporta una frase interceptada y desconoce la respuesta. La ruta a Sevilla solo se pregunta después de esa conversación. La tarde de Sevilla queda libre; Torre del Oro, Giralda, Catedral y Archivo de Indias son observaciones exteriores opcionales. Tecla entra por la noche, conversa con humor y explica el Cuaderno de Bitácora Único antes de dejar pistas de Isla Mágica. No presentar a Krim, Marga, Rufino, Corvinho ni América en el chat. El Cuaderno de la Memoria sigue privado.

## Fuentes documentales

- https://visitartavira.pt/en/cultural-heritage/old-bridge/
- https://visitasevilla.es/torre-del-oro/
- https://www.cultura.gob.es/cultura/areas/archivos/mc/archivos/agi/portada.html
