# Cómo escribir capítulos de Topotino

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
- `time.from` / `time.to`: ventana horaria local, formato `HH:MM`. También permite ventanas que cruzan medianoche.
- `location.lat/lng/radiusMeters`: se activa al pulsar “Actualizar señal” dentro del radio.
- `mode: "all"`: deben cumplirse todas las condiciones indicadas.
- `mode: "any"`: basta con una condición.

## Bloques del MD

Usa siempre estos encabezados:

- `# Contexto narrativo`: lo que sabe Topotino y lo que no debe revelar.
- `## Mensajes iniciales`: JSON con mensajes que llegan al activarse.
- `## Respuestas guiadas`: JSON con respuestas exactas o respuestas abiertas controladas que desbloquean flags, aguas, palabras o capítulos.
- `## Respuestas suaves si fallan`: JSON con pistas cuando no hay acierto guiado.
- `## Contexto para IA`: límites y tono para el fallback de OpenAI.

En respuestas guiadas puedes usar:

- `match`: textos exactos.
- `containsAny`: basta con que el mensaje contenga una de esas palabras.
- `containsAll`: deben aparecer todas esas palabras.
- `openAnswer: true`: acepta una respuesta abierta si pasa los filtros.
- `minLength` / `minWords`: evita respuestas demasiado vacías.
- `rejectContainsAny`: bloquea bromas o tonterías evidentes.
- `setFlags`: activa submisiones posteriores.
- `setLocation`: simula una ubicación desde el chat para pruebas.
- `setRuntimeNow`: simula fecha/hora desde el chat para pruebas.

## Pruebas rápidas por URL

Puedes simular condiciones sin moverte:

- Resetear partida: `index.html?reset=1`
- Simular fecha/hora: `index.html?testNow=2026-08-12T21:30:00`
- Simular ubicación: `index.html?testLat=43.615&testLng=-5.793`
- Combinar: `index.html?reset=1&testNow=2026-08-12T21:30:00&testLat=43.615&testLng=-5.793`
- Acelerar respuestas para pruebas: añade `fastReply=1`

Para probar OpenAI necesitas desplegar en Vercel o usar `vercel dev` con `OPENAI_API_KEY`.

Para activar copia segura necesitas configurar Redis/Upstash en Vercel con:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Si esas variables no existen, la app sigue funcionando con copia local en el móvil y el panel adulto mostrará que la copia segura está pendiente.

En la URL normal, las respuestas de Topotino tienen una pausa silenciosa aleatoria de 5 a 60 segundos. Después aparece un indicador de escritura durante 8 a 14 segundos y finalmente llegan las burbujas. Si hay varias burbujas, Topotino vuelve a "escribir" 4 a 9 segundos entre ellas. Con `fastReply=1` esos tiempos se reducen solo para probar.

## Panel adulto y recuperación

El panel adulto se abre con `?adult=1`. No aparece en la experiencia normal de Paula y Hugo.

Desde el panel puedes:

- ver y copiar el código de recuperación;
- forzar sincronización;
- restaurar desde un código;
- exportar/importar un JSON;
- borrar solo los datos de este móvil.

`?reset=1` ya no borra datos en modo normal. Para borrar por URL hace falta `?adult=1&reset=1&confirmReset=1`. La forma recomendada es usar el botón del panel adulto.

## Llaves de ensayo por chat

Estas palabras no forman parte de la aventura para Paula y Hugo. Son atajos para probar desde casa sin depender de día, hora ni localización. Escríbelas directamente en el chat después de entrar al comunicador:

- `topollave-luanco`: activa la misión de Luanco, Operación Primera Gota.
- `topollave-sabado`: simula el sábado 27 sin borrar memoria y permite probar el mensaje de los topos.
- `topollave-eclipse`: simula Luanco completado, guarda Agua del Norte, añade MIRO y abre la pista del eclipse.
- `topollave-origen`: simula el camino hasta Guimarães y abre Agua del Origen sin GPS.

Recomendación: usa siempre una ventana privada o entra con `?reset=1` antes de probar una secuencia completa.

## Misiones cargadas ahora

- `001-reconexion`: se activa al entrar con la clave. Solo confirma identidad y abre el misterio.
- `002-luanco-llegada`: se abre al acertar `Luanco` y estar cerca de Luanco, o con `topollave-luanco`.
- `003-luanco-agua-norte`: se abre el sábado 27 tras haber observado Luanco, o con `topollave-sabado`.
- `004-eclipse`: se abre al guardar el Agua del Norte. Sirve como pista posterior, no como destino físico inmediato.
- `004-guimaraes-origen`: queda preparada para más adelante. Normalmente requiere haber identificado el eclipse y estar cerca de Guimarães, salvo con llave de ensayo.

Para este fin de semana, las submisiones jugables son Luanco llegada/observación y Agua del Norte el sábado 27. La pista del eclipse se puede probar después para reproducir la continuación narrativa.
