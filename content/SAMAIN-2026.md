# Samaín 2026 · revisión adulta

Implementación local T-30O1. No se ha publicado ni enviado ningún mensaje al canal familiar. La historia completa y sus secretos están en la sección 0 de GUIA-COHERENCIA-NARRATIVA.md; las personalidades están en PERSONAJES.md.

## Recorrido vigente · T-01N3 · Santiago patas arriba

1. El rescate de los Flopis se confirma sin cambiar sus doce pruebas del mapa.
2. Tecla deja protestar a Topoloco; fallan las copias. Él escucha que querían ir a Santiago, huye allí y presume de cambiarla. Topotino es escéptico y espera aviso de llegada.
3. Botón o afirmación explícita confirma la llegada a Santiago. Topotino detecta el Desquiciador de Rótulos y entrega /santiago/.
4. Doce disparates del villano se contrastan con los doce hallazgos reales del documento familiar. Mapa, pistas, historias y progreso anteriores se conservan. Guardar o aplazar no detiene al villano.
5. Al volver al mismo navegador con doce hallazgos, el chat reconoce el informe. Desde otro móvil, pueden confirmar expresamente que completaron las doce comprobaciones.
6. Tecla abre una línea limitada de reclamaciones, Topotina la controla y Paula y Hugo intervienen. Luego llegan la amenaza de venganza, las bromas, la expulsión y el agradecimiento final.

Las partidas de la versión del regalo que ya estaban en el desenlace se recuperan una vez en la espera de Santiago. No se borra historia ni se presupone la llegada. La guía maestra recoge la explicación de continuidad. El final de agosto permanece intacto.

## Prueba y controles

- Misma clave infantil que antes. No se reinicia ni sustituye la partida histórica.
- Revisión aislada: abrir otro perfil de navegador, iniciar con la clave habitual y usar `?testNow=2026-10-30T18:00:00%2B01:00&fastReply=1`. Para probar las visitas, cambiar a `testNow=2026-10-31T12:00:00%2B01:00` sin borrar el almacenamiento.
- El panel adulto existente (`?topoadulto=1`) permite programar una fase concreta. Es una excepción explícita de prueba; no añade visitas ficticias al historial. También permite volver a una fase para corregir un atasco.
- La campaña se inicia automáticamente entre el 30 de octubre y el 1 de noviembre, hora de Madrid. Una campaña iniciada puede terminar después, sin caducar por medianoche. Fuera de la ventana puede iniciarse con el lanzador adulto.
- Las confirmaciones físicas pueden escribirse o pulsarse. Deducir un destino, el GPS o esperar no cuenta como llegar.
- Los mensajes de entrada pendientes se recuperan tras una recarga sin repetir las burbujas ya recibidas.
- Las fases cargan su propio contexto de IA. Se conservan mensajes y memoria histórica; la IA de esta campaña recibe solo sus observaciones pertinentes. Memoria/Sombra y las doce aguas permanecen guardadas y ocultas.
- Ante conflicto entre dispositivos se conserva la copia local y se avisa al adulto. Exportar JSON antes de restaurar deliberadamente otra copia; no hay fusión automática de respuestas incompatibles.
- La app cerrada no recibe notificaciones push. El primer mensaje se entrega al abrir o volver al chat.

## Datos reales y ficción

No se inventan retos o guiones oficiales, accesos al alojamiento, programación del sábado, actores u objetos escondidos. La muralla conserva el perímetro romano y tiene puertas; el circuito de sombras es magia de nuestro universo. El Samaín se explica como celebración actual recuperada con vínculos a tradiciones de cosecha, invierno, difuntos, luces y calabazas. No se presenta como incompatible con Halloween ni se identifica su historia con nuestra máquina.

Fuentes: https://www.gvam.es/palacio-de-gaudi-estrena-guia-interactiva-para-escolares/ · https://www.diocesisastorga.es/actualidad/noticias/la-catedral-de-astorga-presenta-su-audioguia-infantil-1107 · https://www.turismo.gal/recurso/-/detalle/3110/muralla-romana-de-lugo?ctre=41&langId=es_ES&tp=9 · https://www.turismo.gal/recurso/-/detalle/210514000434/paseo-do-rio-rato?langId=gl_ES&tp=40004370

## Verificación realizada

- 57 pruebas locales aprobadas: regresión de agosto, estructura Markdown/JSON y avance/negaciones de Samaín. Los archivos de pruebas permanecen en local, excluidos de Git; también se retiraron del índice los que ya estaban versionados.
- Chromium móvil: recorrido del viernes y sábado, pistas progresivas, confirmaciones, protección del secreto de Pedro, voces de Tecla/Topoloco, resultado parcial, victoria externa y alternativa desde el refugio.
- Recarga durante una transmisión: entrega solo burbujas pendientes, sin duplicar. Recarga final y apertura offline con service worker: conserva el cierre y la partida.
- Lanzador adulto probado fuera de la ventana de fechas, sin marcar visitas anteriores.
- Guardado de cliente probado con respuestas retrasadas, creación inicial, reintento tras error y conflicto; mantiene cambios locales. Handler real de estado y script Lua ejecutados contra un servicio REST local de prueba: solo una escritura concurrente gana, los reintentos son idempotentes y los arrays vacíos se conservan. Redis de producción no se ha modificado ni validado en vivo; no hay credenciales Redis en el entorno local.
- OpenAI directo probado con la clave ya existente y autorizada: Topotino responde sin confirmar la identidad de Pedro antes de terminar la visita, sin revelar Lugo y sin introducir otras voces.
- Capturas de comprobación: `/tmp/tptn-samain-victoria.png` y `/tmp/tptn-samain-alternativa.png`.
- Sin despliegue, commit ni mensajes al canal familiar.
