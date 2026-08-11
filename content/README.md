# Cómo escribir capítulos de Topotino

Antes de crear, corregir o publicar cualquier misión, lee y actualiza [`GUIA-COHERENCIA-NARRATIVA.md`](GUIA-COHERENCIA-NARRATIVA.md). Es el documento maestro del canon, los secretos, el recorrido y la propagación de cambios hacia todas las misiones futuras.

La separación entre canon secreto, conocimiento de Topotino, estado verificable y conversación se documenta en [`ARQUITECTURA-CONVERSACIONAL.md`](ARQUITECTURA-CONVERSACIONAL.md).

Cada capítulo o submisión es un archivo `.md` en `content/episodes/` y debe estar listado en `content/episodes.json`.

La app carga todos los MD, pero solo muestra los mensajes de un capítulo cuando su `activation` se cumple. Las condiciones no se pisan entre sí: puedes combinar respuesta, flags, fecha, hora y ubicación. Por defecto deben cumplirse todas; usa `"mode": "any"` si basta con que se cumpla una.

Para misiones grandes, divide la historia en varios MD pequeños. Ejemplo: descubrir Luanco, llegar a Luanco, observar la Noche Blanca, recoger el Agua del Norte y abrir la pista del cielo son submisiones distintas.

## Frontmatter recomendado

```json
{
  "id": "004-guimaraes-origen",
  "order": 4,
  "title": "Agua del Origen",
  "channelCode": "T-19B4",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["eclipse_identificado"],
    "date": { "from": "2026-08-01", "to": "2026-08-20" },
    "time": { "from": "09:00", "to": "22:30" },
    "location": {
      "lat": 41.4432,
      "lng": -8.2930,
      "radiusMeters": 1200
    }
  },
  "mission": "Agua del Origen",
  "formulaWord": "COMIENZO",
  "water": "Agua del Origen",
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
```

## Activaciones disponibles

- `startsUnlocked: true`: aparece al abrir el chat tras la clave.
- `required`: flags que ya deben existir, por ejemplo `["completado_luanco"]`.
- `anyFlags`: basta con una de esas flags.
- `date.on`: solo ese día, formato `YYYY-MM-DD`.
- `date.from` / `date.to`: ventana de días.
- `dateTime.from` / `dateTime.to`: instante ISO 8601 con zona horaria; permite que un acontecimiento quede disponible para siempre a partir de una hora concreta.
- `time.from` / `time.to`: ventana horaria local, formato `HH:MM`. También permite ventanas que cruzan medianoche.
- `location.lat/lng/radiusMeters`: se activa al llegar al radio indicado. La app actualiza la posición al abrirse, al volver a primer plano y periódicamente; “Actualizar señal” permite repetir la comprobación manualmente.
- `mode: "all"`: deben cumplirse todas las condiciones indicadas.
- `mode: "any"`: basta con una condición.

En las jornadas de viaje se recomienda combinar `date.on` y `location` con `mode: "all"`: la fecha impide adelantar la historia y la llegada evita que se abra por la mañana cuando la familia aún está en otra ciudad. Como referencia, usa unos 1.000 metros para una parada urbana o compacta y hasta 5.000 metros para parques, espacios naturales o áreas extensas. La ubicación abre el capítulo, pero nunca sustituye la observación ni valida una respuesta.

## Bloques del MD

Usa siempre estos encabezados:

- `# Contexto narrativo`: lo que sabe Topotino y lo que no debe revelar.
- `## Mensajes iniciales`: JSON con mensajes que llegan al activarse.
- `## Respuestas guiadas`: JSON con respuestas exactas o respuestas abiertas controladas que desbloquean flags, aguas, palabras o capítulos.
- `## Respuestas suaves si fallan`: JSON con pistas cuando no hay acierto guiado.
- `## Pistas progresivas`: JSON con pistas que empiezan a salir tras tres intentos fallidos en un episodio.
- `## Contexto para IA`: límites y tono para el fallback de OpenAI.

En respuestas guiadas puedes usar:

- `match`: textos exactos.
- `containsAny`: basta con que el mensaje contenga una de esas palabras.
- `containsAll`: deben aparecer todas esas palabras.
- `containsAnyGroups`: lista de grupos; la respuesta debe contener al menos un término de cada grupo. Permite validar razonamientos con varias piezas de evidencia sin exigir una frase exacta.
- `openAnswer: true`: acepta una respuesta abierta si pasa los filtros.
- `minLength` / `minWords`: evita respuestas demasiado vacías.
- `rejectContainsAny`: bloquea bromas o tonterías evidentes.
- `requiredFlags`: la respuesta solo funciona cuando ya se han completado esas fases.
- `blockedFlags`: la respuesta deja de funcionar cuando ya existe cualquiera de esas flags; evita repetir una fase terminada.
- `setFlags`: activa submisiones posteriores.
- `setLocation`: simula una ubicación desde el chat para pruebas.
- `setRuntimeNow`: simula fecha/hora desde el chat para pruebas.
- `remember`: guarda la respuesta del chat en la memoria persistente de viaje. Puede ser una etiqueta o un objeto con `kind` y `label`. No se usa para contenidos del Cuaderno de la Memoria.

Los objetos de `Mensajes iniciales` pueden incluir `requiredFlags` y `blockedFlags`. La app entrega solo los mensajes compatibles con el estado existente; se usa para que un capítulo por fecha tenga una entrada normal y otra de recuperación sin fingir fases no vividas.

Las horas visibles del chat siempre usan la hora real del dispositivo, como un chat normal. `testNow` y `setRuntimeNow` solo afectan a las activaciones internas de capítulos.

## Pruebas rápidas por URL

Puedes simular condiciones sin moverte:

- Resetear partida desde URL solo en modo adulto: `index.html?topoadulto=1&reset=1&confirmReset=1`
- Simular fecha/hora: `index.html?testNow=2026-08-12T21:30:00`
- Simular ubicación: `index.html?testLat=43.615&testLng=-5.793`
- Combinar: `index.html?topoadulto=1&reset=1&confirmReset=1&testNow=2026-08-12T21:30:00&testLat=43.615&testLng=-5.793`
- Acelerar respuestas para pruebas: añade `fastReply=1`
- Acortar el lanzamiento adulto solo para pruebas: añade `launchDelayMs=1000`

Las respuestas libres usan directamente la API de OpenAI cuando existe `OPENAI_API_KEY`; Vercel AI Gateway queda como alternativa. Para desarrollo local, vincula el proyecto y ejecuta `vercel env pull .env.local` antes de `vercel dev`.

Para activar copia segura necesitas configurar Redis/Upstash en Vercel con:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Si esas variables no existen, la app sigue funcionando con copia local en el móvil y el panel adulto mostrará que la copia segura está pendiente.

También se aceptan los nombres actuales de Upstash `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`, o `REDIS_URL`. Para funciones serverless se recomienda la modalidad REST.

Las integraciones de Vercel Marketplace pueden añadir un prefijo al recurso, por ejemplo `tptn_KV_REST_API_URL` y `tptn_KV_REST_API_TOKEN`. El servidor detecta esos pares automáticamente y mantiene juntos la URL y el token del mismo recurso.

## Mesa de viaje: cambios en directo

La ruta `/admin.html` abre un editor privado pensado para cambios durante el viaje. Requiere estas variables privadas en Vercel:

- `STORY_ADMIN_PASSWORD`: contraseña que escribe el adulto.
- `STORY_ADMIN_SECRET`: cadena aleatoria larga usada para firmar la sesión.
- una conexión Redis REST de las indicadas arriba.

Desde la mesa de viaje puedes:

- enviar un mensaje inmediato de Topotino a los comunicadores abiertos;
- editar cualquier capítulo Markdown sin desplegar de nuevo;
- crear un capítulo nuevo a partir de una plantilla;
- retirar una modificación y volver a la versión estable de GitHub.

Los cambios en directo se guardan en Redis como una capa sobre los archivos de GitHub. La app consulta esa capa al abrirse y cada minuto. Si Redis falla, los capítulos publicados en GitHub siguen funcionando.

Para incorporar definitivamente un cambio realizado durante el viaje, cópialo después al archivo correspondiente del repositorio y elimina la sobrescritura desde la mesa de viaje.

En la URL normal, las respuestas de Topotino tienen una pausa silenciosa aleatoria de 5 a 60 segundos. Después aparece un indicador de escritura durante 8 a 14 segundos y finalmente llegan las burbujas. Si hay varias burbujas, Topotino vuelve a "escribir" 4 a 9 segundos entre ellas. Con `fastReply=1` esos tiempos se reducen solo para probar.

## Panel adulto y recuperación

El panel adulto se abre con `?topoadulto=1`. No aparece en la experiencia normal de Paula y Hugo. Pide PIN adulto antes de mostrar herramientas. PIN actual: `5000`.

Desde el panel puedes:

- ver y copiar el código de recuperación;
- probar copia segura;
- lanzar manualmente una fase, que llegará al chat 5 minutos después;
- restaurar desde un código;
- exportar/importar un JSON;
- borrar solo los datos de este móvil.

`?reset=1` ya no borra datos en modo normal. Para borrar por URL hace falta `?topoadulto=1&reset=1&confirmReset=1`. La forma recomendada es usar el botón del panel adulto.

El lanzador manual no muestra nada técnico a los niños. Programa la fase y, cuando pasan 5 minutos, Topotino empieza a escribir y manda los mensajes iniciales del capítulo como si la señal hubiera despertado. Para probar sin esperar, usa `?topoadulto=1&fastReply=1&launchDelayMs=1000`.

## Llaves de ensayo por chat

Estas palabras no forman parte de la aventura para Paula y Hugo. Se mantienen como compatibilidad, pero la forma recomendada de probar ahora es el lanzador del panel adulto:

- `topollave-luanco`: activa la misión de Luanco, Operación Primera Gota.
- `topollave-sabado`: simula el sábado 27 sin borrar memoria y permite probar el mensaje de los topos.
- `topollave-eclipse`: simula Luanco completado, guarda Agua del Norte, añade MIRO y abre la pista del eclipse.
- `topollave-origen`: simula el camino hasta el primer día del viaje y abre Amarante sin esperar a la fecha.

Recomendación: usa siempre una ventana privada o entra con `?topoadulto=1&reset=1&confirmReset=1` antes de probar una secuencia completa.

## Misiones cargadas ahora

- `001-reconexion`: se activa al entrar con la clave. Solo confirma identidad y abre el misterio.
- `002-luanco-llegada`: se abre al acertar `Luanco` y estar cerca de Luanco, o con `topollave-luanco`.
- `003-luanco-agua-norte`: se abre el sábado 27 tras haber observado Luanco, o con `topollave-sabado`.
- `004-eclipse`: episodio anterior del eclipse, retirado y conservado solo por compatibilidad.
- `004c-eclipse-amnesia`: se activa después del eclipse del 12 de agosto y abre la pérdida de memoria y el Cuaderno de la Memoria.
- `004b-rumbo-amarante`: enlaza el eclipse con el viaje. Paula y Hugo deben descubrir Amarante antes de conocer la fecha y Topotino reconoce que ignora el motivo.
- `004-guimaraes-origen`: episodio retirado que conserva un identificador técnico heredado para no romper partidas de ensayo.
- `005-amarante-puente`: día 13 en Amarante, con observación de la ponte y elección de la primera memoria del viaje.
- `006-magikland-curia`: día 14, Magikland y lectura histórica del Hotel do Parque en Curia.
- `007` a `009`: Buçaco–Batalha–Fátima, tiempo profundo–Óbidos y Dino Parque–Lisboa.
- `010` a `012`: ciencia–Oceanário, Lisboa histórica–Belém y Badoca–Lagos.
- `013` a `015`: delfines–Benagil–Sagres, Ponta–Algar Seco–HolaJaima y Zoomarine.
- `016` y `017`: Tavira–Sevilla e Isla Mágica.
- `018-sevilla-alhambra-noche`: cierre principal en la Alhambra nocturna el 26 de agosto.
- `019-epilogo-generalife`: epílogo voluntario y regreso el 27.

El arco completo del viaje está publicado. Cada día conserva recuperación por cambio real de plan y conversación libre con Luna.
