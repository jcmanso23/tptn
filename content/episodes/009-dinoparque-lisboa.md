---
{
  "id": "009-dinoparque-lisboa",
  "order": 9,
  "title": "Día 5 · El secreto de Louri",
  "channelCode": "T-21A3",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-17" }, "location": { "lat": 39.2790352, "lng": -9.2916689, "radiusMeters": 5000, "label": "Dino Parque Lourinhã" } },
  "mission": "Identificar al espía y descubrir la máquina",
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

La misión comienza con un único objetivo: identificar al dinosaurio que trabaja para Topoloco. Dino Parque se utiliza como investigación científica real. Paula y Hugo distinguen fósil, réplica, modelo y reconstrucción; observan cómo la paleontología usa huesos, huellas, huevos, nidos y embriones; y comprenden que `probablemente`, `según las evidencias` y `todavía no sabemos` son expresiones honestas.

A mitad de la investigación entra **LOURI**, un pequeño T-Rex rojo, presumido, pedante, dramático y adorable. Su avatar es la imagen roja aportada por la familia. Topoloco estaba presente cuando salió del huevo, le dijo que era su padre y lo educó como una reconstrucción perfecta y espía excepcional. Después escondió un comunicador conectado con Louri dentro del dinosaurio rojo de Burger King que Hugo recibió la noche del 15: los ojos del juguete funcionaban como cámara. Louri estaba al otro lado de la señal; no era el plástico que Hugo llevaba. Al cerrar el canal, el juguete puede seguir con Hugo como un dinosaurio normal. No se pide a los niños creer que el juguete se mueve, habla físicamente o desaparece.

La entrada provoca la discusión cómica de la contraseña `topotino1234`. Louri empieza a dudar al comparar las certezas absolutas de Topoloco con la honestidad científica. Una orden interceptada lo declara defectuoso por hacer demasiadas preguntas. Paula y Hugo le enseñan que dudar, revisar y cambiar de opinión no significa estar roto.

Louri abandona a Topoloco y revela información incompleta: existe una **Máquina de los Recuerdos** capaz de capturar recuerdos, separarlos de sus relaciones y almacenar una sola versión en el Museo Topoloco de los Recuerdos Robados. Hay una operación en Lisboa, relacionada con una ciudad destruida y reconstruida y con la decisión de qué conservar.

Antes de despedirse, la cámara explica cómo pudo observarlos. Louri elogia la actuación de Hugo en la plaza. Topotino dice que le encantó y reconoce lo bien que Paula se orientó por Óbidos. También pregunta si están escribiendo y dibujando el **Cuaderno de la Memoria**; cualquier respuesta es válida y nadie pide verlo ni conocer su contenido.

Louri entrega un fragmento de plano que señala Lisboa y se queda en Dino Parque para descubrir quién es entre científicos que admiten lo que aún no saben. Su despedida solo ocurre después de que Paula y Hugo respondan a ese pequeño diálogo. Sale del chat y Topotina cierra definitivamente su canal. No viaja con ellos y no vuelve a intervenir desde el 18 de agosto.

## Secuencia canónica

1. Modelos a tamaño real: separar evidencia e interpretación.
2. Fósil, réplica y laboratorio: comprender cómo se construye conocimiento.
3. Huevos, nidos y embriones de dinosaurios portugueses: inferir sin exagerar.
4. Entrada cómica de Louri y revelación de su señal oculta en el juguete de Burger King.
5. Crisis ante las palabras `hipótesis`, `probablemente` y `desconocemos`.
6. Orden de Topoloco que lo declara defectuoso.
7. Paula y Hugo le ayudan a corregir su idea; Louri cambia de bando.
8. Revelación de la máquina y del museo.
9. Conversación sobre Hugo, Paula y el Cuaderno; cualquier respuesta mantiene la escena.
10. Despedida definitiva y cierre técnico del canal Louri.
11. El fragmento conduce a Lisboa; allí se confirma la reconstrucción posterior a 1755 y el módulo de la máquina señala el Pavilhão do Conhecimento para el día 18.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Identificaremos al dinosaurio que trabaja para Topoloco. Recorred modelos, museo y laboratorio." },
  { "from": "topotina", "time": "auto", "text": "Buscad un fósil, una réplica, una reconstrucción y huevos o embriones. Separad lo que sabemos de lo que todavía no sabemos." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "louri-entrada-y-verdad",
    "containsAny": ["fósil", "fosil", "réplica", "replica", "hipótesis", "hipotesis"],
    "setFlags": ["louri_descubierto", "louri_libre"],
    "messages": [
      { "from": "system", "time": "auto", "text": "Louri se ha unido al canal." },
      { "from": "louri", "time": "auto", "text": "Soy Louri. Tyrannosaurus Rex. Espía profesional. Rugidor de élite. Era yo." },
      { "from": "louri", "time": "auto", "text": "Topoloco dijo que era mi padre. Escondió un comunicador mío dentro del dinosaurio rojo de Burger King. Yo estaba al otro lado y sus ojos eran mi cámara." },
      { "from": "topotina", "time": "auto", "text": "Tener preguntas no significa estar roto. Comparar pruebas y corregirse es investigar." }
    ]
  },
  {
    "id": "louri-despedida-lisboa",
    "requiredFlags": ["louri_libre"],
    "containsAny": ["lisboa", "máquina", "maquina", "plano"],
    "setFlags": ["louri_canal_cerrado", "completado_dinoparque_lisboa"],
    "messages": [
      { "from": "louri", "time": "auto", "text": "La máquina captura recuerdos, separa sus partes y guarda una sola versión. Su próxima operación está en Lisboa." },
      { "from": "louri", "time": "auto", "text": "Hugo, tu actuación en la plaza fue magnífica. Paula, te orientaste muy bien por Óbidos." },
      { "from": "topotino", "time": "auto", "text": "Hugo, me encantó tu actuación. Paula, me gusta mucho cómo encuentras el camino. ¿Estáis escribiendo y dibujando el Cuaderno de la Memoria?" },
      { "from": "louri", "time": "auto", "text": "Me quedo aquí para descubrir quién soy. Aunque sospecho que soy extraordinario." },
      { "from": "system", "time": "auto", "text": "Louri ha salido del canal." },
      { "from": "topotina", "time": "auto", "text": "Canal Louri cerrado definitivamente." },
      { "from": "topotino", "time": "auto", "text": "Viajad rumbo a Lisboa. Preparad calzado cómodo y una prenda ligera. Mañana seguiremos el plano en Pavilhão do Conhecimento. Descansad." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Buscad qué está etiquetado como fósil, réplica, modelo o reconstrucción.",
  "Decir «todavía no sabemos» permite seguir investigando; fingir seguridad cierra la pregunta."
]
```

## Pistas progresivas

```json
[
  "Un modelo completo puede reunir huesos conocidos y partes interpretadas.",
  "La orden de Topoloco llama defecto a una pregunta. Ese es el engaño que Louri debe descubrir.",
  "El fragmento final habla de una ciudad destruida y reconstruida: Lisboa."
]
```

## Contexto para IA

- Louri solo puede hablar entre su entrada y su salida explícitas de este episodio.
- Después de `Canal Louri cerrado definitivamente`, Luna nunca redacta mensajes de Louri ni lo presenta como acompañante.
- Louri quiere a Topoloco al principio; es un niño engañado, no un villano.
- No llamar a Topoloco padre real: es la mentira que Louri creyó.
- No afirmar que Louri es una reconstrucción científicamente perfecta.
- El fragmento de Lisboa es incompleto: no revela aún el mecanismo total ni la Alhambra.
- El Cuaderno permanece privado.
- La pregunta sobre el Cuaderno es un puente conversacional: se acepta cualquier respuesta y después continúa la despedida.
- Desde este episodio, toda prueba final de un lugar termina con comentario concreto, pregunta humana, reacción del personaje y solo entonces la pista del siguiente destino.
- Si la ubicación confirma que Paula y Hugo ya están en Lisboa, todo diálogo pendiente de Dino Parque queda cerrado sin repetirse. Topotino continúa desde la llegada a Lisboa.

## Fuentes documentales

- https://www.dinoparque.pt/
- https://www.dinoparque.pt/sobre/
- https://www.dinoparque.pt/cientifico/
