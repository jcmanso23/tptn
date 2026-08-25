---
{
  "id": "017-isla-magica",
  "order": 17,
  "title": "Día 13 · La isla dentro de la isla",
  "channelCode": "T-25A2",
  "startsUnlocked": false,
  "finalRoutes": ["sevilla-night"],
  "activation": { "mode": "all", "required": ["completado_tavira_sevilla"], "date": { "on": "2026-08-25" } },
  "mission": "Impedir que Topoloco se convierta en dueño de la aventura",
  "formulaWord": null,
  "water": "Agua Clara de la Noche",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

El capítulo se activa por la mañana desde cualquier lugar. Paula y Hugo se retiraron ayer justo cuando tocaba investigar Santa Cruz. Fue una buena decisión. Recuperaron siete testigos; no visitaron Santa Cruz, Fábrica de Tabacos, María Luisa ni Plaza de España y no ocurrió la conversación nocturna con Tecla.

Durante la noche Borrón selló los cuatro cortes pendientes y cruzó su señal hacia la Isla de la Cartuja. Cree que en un lugar de recreaciones podrá mezclar mentira y representación. Se equivoca: una representación honesta explica qué está reconstruyendo y no pretende sustituir al original. Los cortes quedan protegidos por cuatro cierres visibles en el comunicador; cada avance del parque abre uno.

La señal tiene seis marcas de zona, una carabela, la palabra incompleta `CARTU…` y el mismo engranaje torcido que apareció en Magikland. Una conversación breve permite que Paula y Hugo deduzcan una isla mágica dentro de la Isla de la Cartuja. La expedición permanece oculta hasta confirmar la llegada física.

Al llegar, Capitán Pico y América vuelven al canal. América se presenta como gobernadora de Isla Mágica. Pico confiesa que vio a Paula y Hugo en el Fuerte y fingió no conocerlos para no alertar a Borrón, aunque le hizo mucha ilusión la foto. Esa visita ya cuenta: nadie debe pedirles que repitan el Fuerte.

La ruta deja de ser lineal. América pregunta en qué zona están realmente y adapta una observación física a Sevilla, Puerto de Indias, Puerta de América, Amazonia, La Guarida de los Piratas, La Fuente de la Juventud o El Dorado. Después vuelve a preguntar dónde están y ofrece una segunda observación distinta, incluso si no han cambiado de zona. La dificultad consiste en distinguir qué representa un escenario y qué función real cumple hoy, no en seguir el mapa en un orden concreto. El primer cierre procede de lo ya observado y el Fuerte confirma el segundo.

Después aparecen tres órdenes urgentes y contradictorias. Solo entonces Topotina identifica a Niebla: es un Oscurno de Francia que usa ruido y prisa para lograr que alguien elija sin comprobar. Paula y Hugo deciden la estrategia y eligen por chat un punto público del mapa. Topotina lo convierte en un señuelo que oculta su posición real. Niebla lo sigue, abre el tercer cierre y deja visible el cable del Corrector.

Topoloco detecta la contratrampa y entra personalmente. Primero ofrece a Paula y Hugo cargos absurdos y les deja contestar. Después los desafía a nombrar un momento que él jamás pudiera contar como propio y vuelve a reaccionar. No es un torpe pasivo: ha movido el núcleo del Corrector. Su ego le hace revelar que a las 20:00, cuando llegue un rey, estampará su nombre en las doce ventanas. Junto al lago Paula y Hugo abren el cuarto cierre al comprobar que el reflejo depende del objeto, la luz y el agua. Los cuatro cortes reaparecen como lugares pendientes, no como visitas inventadas.

Topotina detecta que la activación definitiva ocurrirá a las 20:00 en el Corral de Comedias. El chat lo presenta como una recepción real: Sevilla espera a Carlos I y todo debe estar preparado, pero discursos, reverencias, bailes, equívocos y participación convierten el orden perfecto en un caos divertido. Antes de entrar reciben instrucciones concretas; durante la representación el móvil permanece guardado y en silencio.

Al salir, el desenlace utiliza cuatro ideas comprensibles: un escenario representa una época pero no es el pasado real; un reflejo depende del objeto, la luz y el agua; una historia puede mejorar cuando varias personas corrigen errores; y dos recuerdos diferentes pueden formar una historia compartida. Paula y Hugo cuentan por chat dos momentos que recuerdan, sin enseñarlos ni someterlos a examen, y después consultan el Cuaderno de la Memoria en privado. La máquina no puede copiarlo ni decidir quién es dueño de una aventura construida entre ambos.

Las doce ventanas se abren y el Corrector queda desconectado. Borrón, Eco y Niebla pierden sus conexiones. El Museo Topoloco devuelve los recuerdos robados. Topotino recuerda «Tina» y la caja de galletas en la que ella construyó su primer comunicador; él mordió dos resistencias creyendo que eran chocolate. Después agradece a Hugo su valentía para actuar, a Paula su orientación y a ambos que observaran, corrigieran y supieran parar. Paula y Hugo reciben una confirmación inequívoca de que lo han conseguido. Después Topotino recomienda ver la Sevilla pendiente, ya sin pruebas. Este es el final único y no abre otra amenaza.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días, Paula y Hugo. Ayer paramos justo antes de investigar Santa Cruz. Hicisteis bien: una aventura no mejora porque sus exploradores terminen arrastrándose." },
  { "from": "topotina", "time": "auto", "text": "Recuperasteis siete testigos. Esta mañana los cuatro huecos pendientes tienen el sello de Borrón y cuatro cierres nuevos." },
  { "from": "topotino", "time": "auto", "text": "No repetiremos Santa Cruz ni fingiremos que vimos lo que no vimos. Vamos a recuperar esos huecos donde Borrón los ha escondido." },
  { "from": "topotina", "time": "auto", "text": "El rastro cruzó el Guadalquivir. Dejó seis marcas de zona, una carabela, «CARTU…» y el engranaje torcido que vimos en Magikland." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "isla-quien-es-niebla",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["quién es niebla", "quien es niebla", "qué es niebla", "que es niebla", "no conocemos a niebla"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Niebla es un Oscurno al que conocimos en Francia. No borra palabras como Borrón: llena una decisión de ruido y prisa para que elijamos sin comprobar. Os lo presentaré solo cuando detecte su señal." }
    ]
  },
  {
    "id": "isla-america-chat",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["por qué no habla américa", "porque no habla america", "dónde está américa", "donde esta america", "que hable américa"],
    "messages": [
      { "from": "america", "time": "auto", "text": "Aquí estoy. Soy la gobernadora de Isla Mágica y ahora también estoy dentro del chat. Decidme qué zona indica el cartel que tenéis más cerca y adaptaré la investigación." }
    ]
  },
  {
    "id": "isla-impedimento",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["no podemos", "cerrado", "no quiero montar", "nos da miedo", "cambio de plan"],
    "messages": [
      { "from": "capitan_pico", "time": "auto", "text": "Ninguna prueba exige montar. Caminos, carteles, escenarios, barcos y el lago bastan. Para la recepción final preguntad al personal si cambia el horario o el acceso." }
    ]
  },
  {
    "id": "final-isla-magica",
    "blockedFlags": ["completado_isla_magica"],
    "containsAny": ["desconectar", "hemos terminado", "final", "lo hemos conseguido"],
    "setFlags": ["completado_isla_magica", "completado_sevilla_alhambra_noche", "topoloco_derrotado", "doce_aguas_reunidas"],
    "water": "Agua Clara de la Noche",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Sí. Lo hemos conseguido. Las doce ventanas están abiertas y Topoloco ya no puede declararse dueño de vuestra aventura." },
      { "from": "topotino", "time": "auto", "text": "Tina… recuerdo que llamaba Tina a Topotina. Gracias, Paula y Hugo. La aventura termina aquí, al salir del Corral de Comedias." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Ya conocéis a Capitán Pico. Volverá a conectar desde dentro del parque; Topotina explicará a Niebla cuando detecte su señal.",
  "Buscad primero algo concreto: barcos, agua, carteles de zonas y cambios de ambientación.",
  "La trampa de Niebla consiste en enviar órdenes urgentes y contradictorias. Elegid una acción pública que podáis comprobar, ocultando vuestra posición real.",
  "El Cuaderno no se muestra. Solo necesitáis pensar juntos qué demuestra que la aventura pertenece a quienes la vivieron."
]
```

## Pistas progresivas

```json
[
  "En Sevilla, Puerto de Indias buscad elementos que representen comercio, barcos y viajes del siglo XVI.",
  "Una representación puede ayudar a imaginar el pasado, pero no demuestra que cada detalle ocurriera exactamente allí.",
  "Para engañar a Niebla, elegid un punto público del mapa como señuelo. Topotina ocultará vuestra posición real.",
  "Un reflejo necesita algo real fuera del agua. Si el agua cambia, la imagen cambia; el objeto no.",
  "En el Corral observad quién se equivoca, quién corrige y si el caos puede resolverse sin un único dueño.",
  "El Cuaderno contiene dos miradas privadas que Topoloco nunca pudo copiar."
]
```

## Contexto para IA

Final único en Isla Mágica durante la tarde del 25. La mañana reconoce que ayer se retiraron antes de Santa Cruz: siete testigos recuperados y cuatro huecos sellados por Borrón. Nunca afirmar que visitaron Santa Cruz, Fábrica de Tabacos, María Luisa o Plaza de España. La expedición solo aparece tras confirmar físicamente Isla Mágica. Capitán Pico vuelve con avatar y humor aventurero. América entra con su propio avatar, se presenta como gobernadora y dirige una investigación adaptable: pregunta la zona real, plantea una observación concreta y vuelve a preguntar después para adaptarse al movimiento real de Paula y Hugo. Si siguen en la misma zona, da una prueba distinta. Pico admite que los vio en el Fuerte, fingió no conocerlos para proteger la misión y se alegró mucho por la foto. No obligar a seguir las zonas en un orden fijo ni pedir repetir el Fuerte. Los cuatro cierres se completan con lo ya observado, el Fuerte, la contratrampa de Niebla y el lago. Topotina no nombra a Niebla hasta detectar sus órdenes contradictorias. Topoloco entra y mantiene dos intercambios: ofrece cargos y después pide un momento que no pudiera haber vivido. Reacciona a cada respuesta antes del cierre canónico; no acepta realmente unirse a ellos ni cambia de bando. No introducir a Krim, Corvinho, Marga, Rufino o Louri. La culminación sucede después de la recepción de Carlos I en el Corral de Comedias de las 20:00. Antes de entrar se pide guardar y silenciar el móvil; no enviar mensajes durante la representación. Al salir Paula y Hugo cuentan dos recuerdos y consultan el Cuaderno sin mostrarlo. La victoria es inequívoca incluso si la Sombra fue alta. Después Topotino recomienda conocer la Sevilla pendiente sin abrir otra misión ni mencionar Granada.

## Fuentes documentales

- https://www.islamagica.es/mapa-y-zonas-tematicas
- https://www.islamagica.es/espectaculos/capitan-pico-y-america
- https://www.islamagica.es/espectaculos/mundial-de-marineria
- https://www.islamagica.es/espectaculos/que-viene-el-rey
- https://signaling.islamagica.es/publica/espectaculos.php
