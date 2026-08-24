# Arquitectura conversacional de Topotino

**Decisión actual:** conversación híbrida operativa en producción, con historia determinista y lenguaje natural generado por `gpt-5.6-luna`. Cuando existe `OPENAI_API_KEY`, la app usa OpenAI directamente; AI Gateway queda como ruta para instalaciones sin clave propia. No migrar todavía a OpenAI Agents SDK.

## 1. El objetivo

Topotino debe conversar con fluidez sin convertirse en un narrador omnisciente ni alterar por accidente una historia que Paula y Hugo están viviendo de verdad.

En cada turno necesita saber:

- quién es y cómo habla;
- qué hechos del canon ya han sido descubiertos;
- qué sospecha, pero todavía no puede afirmar;
- en qué fase exacta de la prueba se encuentran;
- qué han respondido recientemente Paula y Hugo;
- si ha surgido un impedimento real que exige adaptar la prueba;
- qué secretos siguen fuera de su conocimiento.
- qué recuerdos anteriores al eclipse ha recuperado y cuáles siguen perdidos;
- si una escena futura autoriza consultar el Cuaderno de la Memoria, sin solicitar ni inventar su contenido;
- qué aprendizaje real puede explicar;
- cómo agradecer un avance válido;
- cuál es el siguiente destino permitido y si antes deben descansar.

## 2. Cuatro capas separadas

### Canon secreto

Vive en `GUIA-COHERENCIA-NARRATIVA.md`. Incluye el plan completo de Topoloco, giros futuros y desenlace. No se envía al modelo conversacional.

### Conocimiento de Topotino

Vive en `## Contexto para IA` de cada episodio y se expresa por fases según las flags. Solo contiene lo que Topotino sabe, sospecha o ignora en ese momento.

Desde el eclipse distingue memoria emocional, memoria factual anterior y memoria nueva. Sabe siempre que Paula y Hugo son sus amigos; no recupera hechos por intuición y recuerda normalmente todo lo vivido desde que despertó.

### Estado verificable

Flags, valores internos heredados de aguas, palabras, episodios, mensajes, retos completados, Memoria, Sombra y memoria de viaje viven en el estado de la partida y en su copia de Upstash. Esta capa decide qué se ha completado. Los valores de agua se traducen en la interfaz como ventanas recuperadas del mapa. Un modelo no puede inventar o conceder un logro.

Desde `T-20A0`, los retos jugables del día 13 en adelante viven en `content/challenges.js`. El motor presenta tres formatos controlados:

- preguntas de elección con botones y ampliación educativa después del acierto;
- expediciones con dos a cuatro acciones físicas que se dan juntas;
- rutas del día siguiente que se resuelven la noche anterior y terminan con preparación y descanso.

Un error claro suma una Sombra. Después de dos intentos, el motor sustituye la pregunta por una comprobación física para que nadie quede atrapado. Una vez al día puede aparecer una recuperación que retire una Sombra. Cada avance válido suma Memoria y el balance produce tres variantes del mismo desenlace victorioso.

La `storyMemory` conserva únicamente respuestas guiadas del comunicador marcadas como relevantes: observaciones físicas, hipótesis, predicciones, decisiones y correcciones. Cada elemento incluye episodio, tipo, etiqueta y texto original. Se limita a sesenta elementos y migra de forma compatible: una partida anterior empieza con la lista vacía sin perder ningún dato existente.

### Conversación

El modelo puede reaccionar a preguntas, adaptar una acción a un imprevisto y validar semánticamente una respuesta escrita. Recibe únicamente el conocimiento permitido, el estado actual, la memoria de viaje y los mensajes recientes.

Cada mensaje nuevo queda etiquetado con el episodio en el que nació. Luna recibe únicamente los últimos turnos de ese episodio, nunca una mezcla de días. Cada petición lleva además un identificador único de turno y el episodio de origen; si la etapa cambia mientras la IA responde, la respuesta se descarta.

La conversación admite varias voces. Luna puede devolver de una a tres burbujas y asignarlas solo a personajes autorizados para esa escena. Topotino está siempre disponible; Topotina y los aliados solo hablan después de su entrada real. Cada uno tiene una ficha de personalidad, conocimientos y límites. Louri queda bloqueado tras el cierre definitivo de su canal, salvo las transmisiones excepcionales que el motor autoriza con nombre y escena exactos.

Los diálogos críticos usan dos capas consecutivas. Primero Luna responde de forma natural a lo último que escribieron Paula y Hugo. Después el motor entrega siempre el cierre canónico de la escena: el dato, la pista o la despedida imprescindible para que la historia continúe. La lista de remitentes se fija por diálogo; la IA no puede introducir a América, recuperar personajes de otros días ni sustituir el cierre por una improvisación.

No se fuerza un diálogo coral en cada respuesta. Habla el personaje que reaccionaría de forma natural y solo intervienen varios si la relación entre ellos aporta humor, emoción o claridad.

En una pregunta con opciones, Paula y Hugo pueden pulsar un botón o escribir con sus propias palabras. Luna devuelve un objeto cerrado con `correct`, `partial`, `incorrect` o `clarify`. Ese veredicto no modifica el estado directamente: el motor aplica las mismas reglas que con los botones. Si Luna no responde, no cuenta como error y los botones mantienen la aventura jugable.

El Cuaderno de la Memoria queda deliberadamente fuera de esta capa. Luna sabe que existe y para qué servirá, pero no recibe, solicita ni deduce sus páginas.

## 3. Alternativas reactivas

La conversación sigue esta política:

1. Topotino propone la prueba principal.
2. Paula o Hugo intentan resolverla.
3. Si expresan un obstáculo, el sistema identifica únicamente ese obstáculo.
4. Topotino ofrece una sola adaptación que conserva el objetivo narrativo.
5. Si «no podemos» no explica la causa, pregunta qué ocurre antes de proponer nada.

Las activaciones por fecha filtran sus mensajes iniciales mediante `requiredFlags` y `blockedFlags`. Si falta una fase anterior, llega un puente de recuperación que reconoce lo no vivido y presenta la evidencia disponible del día actual. Nunca se atribuye a Paula y Hugo una ventana, una deducción o una visita que no completaron.

Las contingencias importantes siguen teniendo respuestas deterministas para funcionar aunque el modelo no esté disponible.

Una caída de Luna nunca puede reutilizar una respuesta suave o una pista narrativa del episodio. En conversación libre se pide repetir solo el último mensaje; en un diálogo de transición se usa únicamente el cierre aprobado de esa misma escena. Las pistas progresivas solo aparecen cuando Paula o Hugo piden ayuda de forma explícita.

## 4. Por qué no migrar ahora a Agents SDK

OpenAI Agents SDK aporta bucles de agente, herramientas, sesiones persistentes, guardrails y trazas. Son capacidades valiosas cuando un agente debe decidir qué herramienta usar, mantener una sesión propia o ejecutar flujos de varios pasos.

Topotino todavía no necesita autonomía de ese tipo. Necesita principalmente una identidad estable, conocimiento acotado y respuestas naturales dentro de un estado narrativo que ya controla la aplicación. Migrar el runtime justo antes del viaje introduciría más superficie de fallo sin resolver por sí solo los dos problemas actuales:

- si el prompt recibe secretos, un agente también puede adelantarlos;
- si el proveedor de modelo no está operativo, cambiar de SDK no devuelve las respuestas.

El 11 de agosto de 2026 se decidió usar la facturación existente de la API de OpenAI y priorizar la conexión directa mediante `OPENAI_API_KEY`. La conversación libre con Luna superó pruebas reales en producción: contexto reciente, recuerdo de datos conversados, adaptación a lluvia, límites de conocimiento y respuestas completas. Las misiones guiadas siguen funcionando aunque el modelo no esté disponible.

## 5. Evolución recomendada

### Fase actual

- Mantener Vercel AI SDK para respuestas libres.
- Usar Luna como modelo conversacional y conservar Topotino como identidad narrativa.
- Enviar al modelo solo el `aiContext` de la fase activa, flags y conversación reciente; no mezclar contextos antiguos desbloqueados que contradigan la amnesia actual.
- Enviar los turnos recientes con roles de usuario y asistente para mantener una conversación real sin repetir el contexto como si fuera una ficha.
- Aislar esos turnos por episodio y rechazar respuestas cuyo identificador de turno o episodio ya no coincida.
- Permitir voces de personajes con remitente propio, personalidad estable y autorización por escena.
- Enviar también la memoria de viaje persistente, separada de los turnos recientes y del cuaderno privado.
- Mantener el motor de retos para aciertos, progreso, seguridad y contingencias críticas.
- Usar botones para elecciones, tarjetas para expediciones y salida física después de dos intentos.
- Mantener visibles Memoria y Sombra y ofrecer una recuperación como máximo una vez por jornada.
- Descubrir por completo la ruta siguiente la noche anterior y recordar su motivo al comenzar la mañana.
- Registrar el conocimiento de Topotino por fases.
- Mantener privado el Cuaderno de la Memoria. La app no pide ni registra su contenido; solo registra respuestas dadas durante las investigaciones del chat.
- Agradecer de forma concreta observaciones y razonamientos válidos sin conceder progreso desde el modelo.
- Conducir al siguiente lugar solo con la pista autorizada y pedir descanso cuando cambie el día.
- Razonar con Paula y Hugo con exigencia aproximada de diez años para ambos. La edad de Hugo solo adapta la escritura del cuaderno, no la complejidad intelectual.

### Fase siguiente

Cuando el proveedor vuelva a responder, probar conversaciones reales con preguntas, errores, bromas e imprevistos. Medir contradicciones, revelaciones prematuras, latencia y coste.

### Cuándo sí adoptar un agente

Adoptar un único agente Topotino —no una red de agentes— si necesitamos herramientas como:

- `leer_estado_narrativo`: devuelve solo hechos permitidos y fase actual;
- `clasificar_imprevisto`: identifica lluvia, cierre, cansancio, miedo o cambio de plan;
- `pedir_pista_controlada`: recupera una pista ya aprobada;
- `proponer_adaptacion`: devuelve una adaptación sin modificar progreso;
- `solicitar_avance`: pide al motor determinista validar una respuesta antes de conceder flags, ventanas o palabras técnicas.

El registro de Upstash seguirá siendo la fuente de verdad aunque el SDK incorpore sesiones. La memoria del modelo ayuda a conversar; no sustituye la continuidad canónica.

## 6. Límites no negociables

- El agente no puede conceder flags, ventanas o palabras técnicas sin validación determinista.
- No puede leer el canon secreto completo.
- No puede modificar capítulos ni enviar mensajes adultos.
- Las reglas de seguridad se aplican antes de la creatividad narrativa.
- Una caída del modelo siempre conserva un camino jugable mediante respuestas guiadas.
- Cada cambio de conocimiento debe quedar registrado en la guía de coherencia.

## Referencias técnicas

- [OpenAI API quickstart · Agents SDK](https://platform.openai.com/docs/quickstart)
- [OpenAI Agents SDK para TypeScript](https://openai.github.io/openai-agents-js/)
- [Sesiones en OpenAI Agents SDK](https://openai.github.io/openai-agents-js/guides/sessions/)
- [Guardrails en OpenAI Agents SDK](https://openai.github.io/openai-agents-js/guides/guardrails/)
- [Agentes en Vercel AI SDK](https://ai-sdk.dev/docs/agents/overview)
