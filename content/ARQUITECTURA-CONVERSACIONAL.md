# Arquitectura conversacional de Topotino

**Decisión actual:** conversación híbrida, con historia determinista y lenguaje natural generado por `openai/gpt-5.6-luna` mediante Vercel AI Gateway. No migrar todavía a OpenAI Agents SDK.

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

## 2. Cuatro capas separadas

### Canon secreto

Vive en `GUIA-COHERENCIA-NARRATIVA.md`. Incluye el plan completo de Topoloco, giros futuros y desenlace. No se envía al modelo conversacional.

### Conocimiento de Topotino

Vive en `## Contexto para IA` de cada episodio y se expresa por fases según las flags. Solo contiene lo que Topotino sabe, sospecha o ignora en ese momento.

### Estado verificable

Flags, aguas, palabras, episodios y mensajes viven en el estado de la partida y en su copia de Upstash. Esta capa decide qué se ha completado. Un modelo no puede inventar o conceder un logro.

### Conversación

El modelo puede redactar pistas, reaccionar a preguntas y adaptar una acción a un imprevisto. Recibe únicamente el conocimiento permitido, el estado actual y los mensajes recientes.

## 3. Alternativas reactivas

La conversación sigue esta política:

1. Topotino propone la prueba principal.
2. Paula o Hugo intentan resolverla.
3. Si expresan un obstáculo, el sistema identifica únicamente ese obstáculo.
4. Topotino ofrece una sola adaptación que conserva el objetivo narrativo.
5. Si «no podemos» no explica la causa, pregunta qué ocurre antes de proponer nada.

Las contingencias importantes siguen teniendo respuestas deterministas para funcionar aunque el modelo no esté disponible.

## 4. Por qué no migrar ahora a Agents SDK

OpenAI Agents SDK aporta bucles de agente, herramientas, sesiones persistentes, guardrails y trazas. Son capacidades valiosas cuando un agente debe decidir qué herramienta usar, mantener una sesión propia o ejecutar flujos de varios pasos.

Topotino todavía no necesita autonomía de ese tipo. Necesita principalmente una identidad estable, conocimiento acotado y respuestas naturales dentro de un estado narrativo que ya controla la aplicación. Migrar el runtime justo antes del viaje introduciría más superficie de fallo sin resolver por sí solo los dos problemas actuales:

- si el prompt recibe secretos, un agente también puede adelantarlos;
- si el proveedor de modelo no está operativo, cambiar de SDK no devuelve las respuestas.

El 11 de agosto de 2026 se diagnosticó que AI Gateway rechazaba las peticiones porque el equipo de Vercel no tenía una tarjeta válida asociada, mientras que `OPENAI_API_KEY` contenía un valor vacío. El código queda preparado para Luna, pero la conversación libre no se considera operativa hasta completar la activación económica del proveedor y superar una prueba real en producción. Las misiones guiadas siguen funcionando sin él.

## 5. Evolución recomendada

### Fase actual

- Mantener Vercel AI SDK para respuestas libres.
- Usar Luna como modelo conversacional y conservar Topotino como identidad narrativa.
- Enviar al modelo solo `aiContext`, flags y conversación reciente.
- Enviar los turnos recientes con roles de usuario y asistente para mantener una conversación real sin repetir el contexto como si fuera una ficha.
- Mantener respuestas guiadas para aciertos, progreso, seguridad y contingencias críticas.
- Registrar el conocimiento de Topotino por fases.

### Fase siguiente

Cuando el proveedor vuelva a responder, probar conversaciones reales con preguntas, errores, bromas e imprevistos. Medir contradicciones, revelaciones prematuras, latencia y coste.

### Cuándo sí adoptar un agente

Adoptar un único agente Topotino —no una red de agentes— si necesitamos herramientas como:

- `leer_estado_narrativo`: devuelve solo hechos permitidos y fase actual;
- `clasificar_imprevisto`: identifica lluvia, cierre, cansancio, miedo o cambio de plan;
- `pedir_pista_controlada`: recupera una pista ya aprobada;
- `proponer_adaptacion`: devuelve una adaptación sin modificar progreso;
- `solicitar_avance`: pide al motor determinista validar una respuesta antes de conceder flags, aguas o palabras.

El registro de Upstash seguirá siendo la fuente de verdad aunque el SDK incorpore sesiones. La memoria del modelo ayuda a conversar; no sustituye la continuidad canónica.

## 6. Límites no negociables

- El agente no puede conceder flags, aguas o palabras sin validación determinista.
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
