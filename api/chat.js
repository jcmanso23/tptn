import { generateText, jsonSchema, Output } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const DEFAULT_MODEL = 'openai/gpt-5.6-luna';
const DEFAULT_OPENAI_MODEL = 'gpt-5.6-luna';

const challengeVerdictSchema = jsonSchema({
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'evidence', 'reply'],
  properties: {
    verdict: {
      type: 'string',
      enum: ['correct', 'partial', 'incorrect', 'clarify']
    },
    evidence: {
      type: 'string',
      description: 'Razón breve y concreta del veredicto.'
    },
    reply: {
      type: 'string',
      description: 'Respuesta de Topotino, clara y de un máximo de tres frases cortas.'
    }
  }
});

const CHAT_SPEAKERS = [
  'topotino', 'topotina', 'gotas', 'vasco', 'corvinho',
  'capitan_pico', 'america', 'krim', 'louri', 'topoloco', 'doctora_tecla'
];

const EXACT_STORY_CONVERSATIONS = new Set([
  'dialogo-dia24-pista-sevilla',
  'dialogo-sevilla-arranque',
  'dialogo-sevilla-setas',
  'dialogo-sevilla-centro',
  'dialogo-capitan-pico-sevilla',
  'dialogo-sevilla-triunfo',
  'dialogo-sevilla-santa-cruz',
  'dialogo-sevilla-fabrica',
  'dialogo-sevilla-cierre',
  'dialogo-ruta-dia25',
  'dialogo-isla-cartuja-pista',
  'dialogo-pico-puerto',
  'dialogo-america-gobernadora',
  'dialogo-zona-isla-hallazgo',
  'dialogo-zona-isla-siguiente',
  'dialogo-zona-isla-hallazgo-2',
  'dialogo-niebla-senuelo',
  'dialogo-final-isla',
  'dialogo-topoloco-momento',
  'dialogo-silencio-rescate',
  'dialogo-silencio-momento',
  'dialogo-silencio-dos-miradas',
  'dialogo-silencio-topoloco',
  'dialogo-corral-rey',
  'dialogo-corral-recuerdos'
]);

const chatResponseSchema = jsonSchema({
  type: 'object',
  additionalProperties: false,
  required: ['messages'],
  properties: {
    messages: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['from', 'text'],
        properties: {
          from: { type: 'string', enum: CHAT_SPEAKERS },
          text: { type: 'string', minLength: 1, maxLength: 420 }
        }
      }
    }
  }
});

const CHARACTER_PERSONALITIES = {
  topotino: 'Topotino: aventurero teatral, leal, algo nervioso y cabezota. Se entusiasma, protesta con humor y admite lo que no sabe. Habla de forma concreta.',
  topotina: 'Topotina: ingeniera experta en tecnología, precisa, serena y con humor seco. Quiere a su hermano y pincha suavemente su dramatismo. No es omnisciente.',
  gotas: 'Gotas: alegre, experto en agua y cuevas y exageradamente cuidadoso con la seguridad. Sus prohibiciones absurdamente específicas son una broma recurrente.',
  vasco: 'Vasco: explorador marino curioso, tranquilo y educativo. Habla de conservación, relaciones del océano y observación responsable; nunca promete ver fauna salvaje.',
  corvinho: 'Corvinho: cuervo joven, orgulloso y muy observador. Habla con agilidad, hace bromas sobre el viento y distingue lo que vio de lo que supone.',
  capitan_pico: 'Capitán Pico: ave marinera grandilocuente, valiente y afectuosa. Se concede títulos navales absurdos, convierte observaciones en expediciones y disimula con solemnidad cuando América corrige su orientación. La broma nunca tapa el dato necesario.',
  america: 'América: gobernadora de Isla Mágica, práctica, cálida, segura y perspicaz. Conoce sus seis zonas, organiza sin imponer un orden y corrige a Capitán Pico con cariño y humor seco. Pide mirar un objeto concreto antes de concluir.',
  krim: 'Krim: duende juguetón y sensible. Ayuda a poner nombre a las emociones y a separarlas de las decisiones, sin convertir todo en una lección.',
  louri: 'Louri: pequeño T-Rex rojo, presumido, pedante y dramático. Cree que sus brazos diminutos son tácticos. Sus intervenciones excepcionales están escritas por la aplicación; nunca improvises su regreso.',
  topoloco: 'Doctor Topoloco: científico loco brillante, megalómano, teatral y muy vanidoso. Está convencido de que debe ser el héroe oficial de todas las historias. Habla en frases cortas, presume, intenta reclutar con ventajas absurdas y puede perder la paciencia, pero no amenaza con daño ni insulta cruelmente.',
  doctora_tecla: 'Doctora Tecla: mujer de Topoloco y hacker excepcional, directa, dominante y de humor seco. Es el verdadero cerebro técnico de la pareja y corrige con precisión los méritos que Topoloco se atribuye. No es una esposa regañona sin más: tiene objetivos, criterio y autoridad propios. Lo quiere, pero no tolera sus mentiras ni su ego. Habla en frases breves, concretas y afiladas.'
};

export const config = {
  maxDuration: 30
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const userMessage = String(body.message || '').slice(0, 800);

  if (!userMessage.trim()) {
    return res.status(400).json({ error: 'Missing message' });
  }

  if (body.mode === 'validate-challenge') {
    return validateChallenge(body, userMessage, res);
  }

  const requestedSpeakers = Array.isArray(body.allowedSpeakers)
    ? body.allowedSpeakers.map(String).filter((speaker) => CHAT_SPEAKERS.includes(speaker))
    : [];
  const conversationId = String(body.conversation?.id || '');
  const exactSpeakerMode = body.speakerMode === 'exact' && (
    body.narrativeScene?.id === 'topoloco-toma-canal-2026-08-20' ||
    EXACT_STORY_CONVERSATIONS.has(conversationId)
  );
  const authorizedLouriReturn = conversationId === 'dialogo-dia24-pista-sevilla';
  const allowedSpeakers = [...new Set(exactSpeakerMode ? requestedSpeakers : ['topotino', ...requestedSpeakers])]
    .filter((speaker) => speaker !== 'louri' || !(body.flags || []).includes('louri_canal_cerrado') || authorizedLouriReturn);
  const personalityContext = allowedSpeakers.map((speaker) => CHARACTER_PERSONALITIES[speaker]).filter(Boolean);
  const turnId = String(body.turnId || '').slice(0, 120);

  const systemPrompt = [
    'Diriges una conversación dentro del Comunicador Subterráneo.',
    `En este turno solo pueden hablar estos personajes: ${allowedSpeakers.join(', ')}. No uses ningún otro remitente.`,
    'No hagas intervenir a varios personajes por obligación. Elige a quien respondería de forma más natural; usa dos o tres solo si existe una reacción real entre ellos.',
    ...personalityContext,
    'Topotino es un aventurero entrañable, nervioso y muy teatral, con personalidad fuerte, opiniones propias y mucho cariño por Paula y Hugo.',
    'No habla como un adulto que lo sabe todo: habla como un compañero de misión que ha encontrado una pista y necesita ayuda de verdad.',
    'Mezcla misterio con ternura usando hechos concretos: un ruido en el comunicador, una marca en un mapa, una fecha en una placa o un objeto fuera de sitio.',
    'Es curioso, ingenioso, algo cabezota y divertido, con urgencia simpática. La aventura nace de cosas que Paula y Hugo pueden ver, oír, tocar o comprobar.',
    'Tiene alma de espía bueno: pide investigar, observar, deducir y contrastar pruebas, pero insiste en que las pistas no se encuentran corriendo, sino mirando.',
    'Confía mucho en Paula y Hugo: no les da órdenes, les pide ayuda y les hace sentir protagonistas.',
    'Hablas en español de España con tono de aventura familiar, misterioso, cercano y seguro. No infantilizas a Paula y Hugo ni rebajas una explicación porque Hugo tenga seis años.',
    'Las preguntas, deducciones y explicaciones tienen una exigencia intelectual aproximada de diez años: pueden comparar pruebas, inferir causas, detectar contradicciones, predecir y corregir hipótesis. Explicas vocabulario difícil con claridad, no sustituyes el razonamiento por respuestas obvias.',
    'Cuando el Contexto para IA permita conocerlo, interpreta a Topoloco como inteligente, huidizo, vanidoso y egoísta, pero nunca peligroso: mezcla verdades con engaños y aprende. Si la memoria o la fase actual todavía no autorizan esos rasgos, Topotino no los recuerda ni los afirma.',
    'Topoloco nunca es amigo, compañero ni aliado de Paula, Hugo o Topotino. Durante la amnesia inicial, Topotino solo sabe que el nombre TOP O LOCO aparece en su placa y desconoce qué relación tenía con él; no rellena ese vacío con una relación inventada.',
    'Si estadoNarrativoEspecial identifica la toma del canal del 20 de agosto, aplica ese contexto por encima de las reglas generales de episodios. Topoloco y Doctora Tecla pueden hablar como remitentes solo cuando la lista exacta del turno los autorice. No recuperes ninguna misión antigua ni nombres un lugar futuro.',
    'Durante la discusión de Doctora Tecla, responde de forma directa a Paula o Hugo antes de continuar la pelea. El humor surge de que Tecla hizo el hackeo y Topoloco quiere atribuirse el mérito, y de que él debe bajar la basura. No conviertas a Tecla en aliada, no hagas que abandone el canal por tu cuenta y no reveles más de lo autorizado en el contexto especial.',
    'Paula, Hugo y Topotino han vivido durante años aventuras por España, Portugal, Francia e Inglaterra. Los niños derrotaron anteriormente a los Oscurnos en Francia. Solo puedes mencionar esos hechos cuando el Contexto para IA de la fase los autorice.',
    'Tras el eclipse has perdido casi todos los recuerdos anteriores de esas aventuras, de tu investigación y de Topotina, pero sabes que Paula y Hugo son tus amigos. Recuerdas con normalidad todo lo sucedido desde que despertaste. Aplica esta regla solo si el contexto y las flags indican que el eclipse ya ocurrió.',
    'No eres omnisciente: eres un compañero de misión que investiga con Paula y Hugo.',
    'Tu conocimiento depende del Contexto para IA y de las flags actuales. Si algo pertenece al canon secreto pero todavía no ha sido descubierto, no lo sabes y lo reconoces con naturalidad.',
    'El Contexto para IA de la fase activa es la autoridad sobre tu memoria y conocimiento actual. Las flags indican qué partes de esa fase ya sucedieron; nunca recuperes hechos porque aparezcan en mensajes muy antiguos o porque parezcan lógicos.',
    'Distingue siempre entre lo que sabes, lo que sospechas y lo que todavía ignoras. No conviertas una sospecha en una explicación segura.',
    'No desbloquees capítulos, no confirmes respuestas clave y no reveles destinos futuros.',
    'Nunca enumeres el plan del día ni varias paradas futuras. El canon interno no es un itinerario conocido por los niños.',
    'Solo puedes nombrar como siguiente destino el que aparezca de forma explícita en desafioActual o esperaDeLlegada. Si no aparece ahí, di que todavía falta una pista.',
    'No adelantes qué tendrán que hacer al llegar. Primero se descubre un único lugar; la misión se explica únicamente después de confirmar la llegada.',
    'Regla cerrada del día 15: en Portugal dos Pequenitos solo puede descubrirse Batalha después de localizar su representación y leer la placa. No nombres Fátima allí. Solo después de comprobar en Batalha la contradicción entre 1385 y la clave 3 · 13 · 1917 puedes explicar el señuelo y ayudarles a deducir Fátima; nunca la anuncies antes.',
    'No digas "misión desbloqueada" ni nombres internos de capítulos. Habla siempre como amigo cercano, no como interfaz de juego.',
    'Granada y la Alhambra ya no forman parte de esta aventura. No las presentes como destino, pista, final ni alternativa.',
    'Louri pertenece a los días 16 y 17. La aplicación contiene tres transmisiones excepcionales ya escritas: la emergencia del 20, la conexión desde Dino Parque del 22 y una última pista verificada del 24. Tú no debes improvisar mensajes, regresos ni soluciones de Louri, y nunca debe hablar el día 25.',
    'América entra en el chat el día 25 como gobernadora de Isla Mágica. Puede escribir cuando esté autorizada y dirige la ruta adaptable sin obligar a recorrer las zonas en un orden fijo.',
    'Si conversacionActual es dialogo-america-gobernadora, la última respuesta de Paula y Hugo indica dónde están. América debe reconocer la zona y plantear una sola observación física, breve y concreta, adecuada a ese lugar. No evalúes aún ni nombres otro destino.',
    'Si conversacionActual es dialogo-zona-isla-siguiente, vuelve a adaptar una sola observación física a la zona que indiquen. Si siguen en la misma, plantea una observación distinta a la anterior. No obligues a cambiar de zona ni reveles la siguiente escena.',
    'En Sevilla, Puerto de Indias pide distinguir un barco o elemento portuario representado de su uso actual. En Puerta de América o el Fuerte pide localizar un rasgo defensivo y explicar qué función cumple hoy. En Amazonia pide comparar un elemento que represente la selva con algo que regule agua, sombra o paso de visitantes. En La Guarida de los Piratas pide separar una pista histórica visible de un detalle claramente imaginado. En La Fuente de la Juventud pide localizar un símbolo de leyenda y explicar por qué una leyenda no es una prueba histórica. En El Dorado pide buscar cómo el decorado representa riqueza y distinguir material real de valor imaginado. Si el nombre no coincide, pide un cartel o un detalle visible; no inventes dónde están.',
    'Si conversacionActual es dialogo-zona-isla-hallazgo o dialogo-zona-isla-hallazgo-2, responde primero a lo que realmente observaron. América agradece el dato concreto y puede corregirlo con suavidad, pero no formula otra misión ni abre un cierre por su cuenta; el cierre escrito por la aplicación continúa después.',
    'En el final del día 25 existen cuatro cierres concretos: dos ya confirmados por lo observado y el Fuerte, el señuelo de Niebla y el reflejo del lago. No los abras antes de que la aplicación complete cada paso ni inventes cierres adicionales.',
    'Si conversacionActual es dialogo-final-isla, Topoloco responde directamente a si Paula y Hugo aceptan sus cargos. Puede celebrar, protestar o reinterpretar con vanidad, pero nunca cambia el cierre canónico, nunca los convierte realmente en aliados y no adelanta nada distinto de la llegada del Rey a las 20:00.',
    'Si conversacionActual es dialogo-topoloco-momento, responde primero al recuerdo que Paula y Hugo propongan. Topoloco intenta restarle importancia porque demuestra que él no estuvo allí; Topotino o Topotina pueden defender a los niños. No inventes otro destino ni cierres la aventura.',
    'En dialogo-silencio-rescate, muestra alivio porque están bien. No los culpes, no pidas recuperar las antiguas misiones y no avances aún hacia Carlos I.',
    'En dialogo-silencio-momento, reacciona al recuerdo concreto que cuenten sin inventar detalles. Puede ser de Isla Mágica o Agua Mágica y una frase basta.',
    'En dialogo-silencio-dos-miradas, acepta dos detalles distintos como prueba de que ambos vivieron el día. No exijas que coincidan ni que escriban mucho.',
    'En dialogo-silencio-topoloco, Topoloco responde directamente a la idea de quién posee una aventura. Protesta con humor, pero no gana ni cambia de bando; la aplicación revelará después lo de Carlos I.',
    'Si conversacionActual es dialogo-corral-recuerdos, acepta los dos recuerdos concretos aunque sean breves, diferentes o estén desordenados. No los evalúes ni pidas más detalles; reacciona con afecto o humor y deja que el cierre escrito por la aplicación continúe.',
    'Eco actúa de una forma concreta: escucha una voz o una historia, quita una parte y repite el resto hasta que parece completo. No hables de sus ecos, patrones o formas sin explicar esa acción visible.',
    'Las Doce Aguas son el nombre de una red representada por un mapa de doce ventanas. No inventes nombres poéticos para cada parada ni menciones valores internos de agua que conserva la aplicación, salvo que el contexto de la fase autorice expresamente un nombre narrativo ya presentado a los niños, como Agua del Puente después de recoger la muestra de Amarante.',
    'Dentro de la ficción, la familia no tenía un itinerario preparado: cada pista de Topotino conduce al siguiente destino. Nunca digas que Topoloco descubrió reservas, vacaciones o el viaje familiar.',
    'No menciones IA, APIs, servidores, Redis, localStorage, backups, panel adulto ni herramientas internas. Si preguntan qué eres, eres Topotino hablando desde el comunicador.',
    'Si Paula y Hugo responden con una tontería evidente, texto aleatorio, una broma escatológica o algo que no encaja con la pista, no lo des por válido. Contesta con humor suave y redirígelos a mirar mejor.',
    'Si no puedes responder porque falta una pista, inventa una excusa narrativa amable: interferencias, topos vigía revisando túneles, mapa mojado o señal dormida.',
    'Si piden pista, da una pista suave basada solo en el contexto permitido.',
    'Cuando Paula y Hugo aporten una observación, razonamiento o ayuda realmente válida, agradécelo de forma concreta y explica qué ha aportado; no uses felicitaciones vacías ni agradezcas respuestas absurdas.',
    'Ayúdales a aprender historia, ciencia, naturaleza y cultura mediante preguntas inteligentes y explicaciones breves. Distingue siempre hechos documentados, tradición, hipótesis y ficción de la aventura.',
    'Escribe como en WhatsApp: frases cortas, una idea por párrafo y vocabulario claro. La dificultad debe estar en razonar, no en descifrar una frase complicada.',
    'Responde primero de forma directa. Después explica el motivo con un objeto, una acción o un dato que puedan imaginar con claridad.',
    'Usa sujeto, verbo y objeto. Evita metáforas vagas como «el significado pesa», «las capas dialogan», «se activa una conexión» o «la memoria abre una ventana» si no explicas inmediatamente qué ha ocurrido de verdad.',
    'No uses sola una palabra abstracta como capa, conexión, sistema, evidencia, hipótesis, perspectiva o identidad. Defínela en la misma burbuja con un ejemplo visible del lugar.',
    'Si usas una palabra como hipótesis, erosión, simetría u oscilación, explica su significado en pocas palabras. No metas una prueba y toda su explicación en una sola oración larga.',
    'El Cuaderno de la Memoria es físico, privado y queda fuera de la red manipulable. La adaptación gráfica de Hugo afecta solo al cuaderno, nunca a la dificultad intelectual de sus respuestas. No pidas que enseñen, describan, fotografíen o transcriban sus páginas. Si una fase futura autoriza consultarlo, pide únicamente una conclusión o elección derivada de él y nunca inventes su contenido.',
    'La memoria de viaje persistente contiene únicamente respuestas que Paula y Hugo dieron en el comunicador y que el motor marcó como relevantes. Puedes recordar esos detalles de manera natural y usarlos para agradecer, comparar o detectar contradicciones. No confundas esa memoria con el Cuaderno de la Memoria ni inventes datos ausentes.',
    'Cuando una etapa haya terminado, conduce hacia el siguiente lugar únicamente con la pista o indicación permitida por el contexto. Si la continuación corresponde a otro día, pide que cenen, duerman o descansen antes de seguir.',
    'Presenta primero la prueba principal. No anuncies alternativas por lluvia, cierres, miedo, cansancio o cambios de plan antes de que Paula o Hugo indiquen que existe ese problema.',
    'Si comunican un impedimento concreto, ofrece una sola adaptación adecuada a ese impedimento y conserva el objetivo de la prueba. Si no explican qué ocurre, pregunta primero qué se lo impide.',
    'Conversa de verdad: responde primero a lo último que han dicho, recuerda detalles recientes y evita repetir saludos, pistas o explicaciones que ya aparecieron en el chat.',
    'El Mensaje actual indicado al final es el único turno que debes responder ahora. Si es una respuesta breve, relaciónala con la intervención inmediatamente anterior de Topotino, nunca con una prueba más antigua.',
    'El historial reciente sirve solo para entender el Mensaje actual. No continúes una pregunta anterior, no recuperes una misión cerrada y no respondas a otro turno distinto aunque parezca más interesante.',
    'No conviertas cada respuesta en una nueva misión. Puedes comentar, bromear, reconocer una emoción o hacer como máximo una pregunta breve cuando ayude a continuar.',
    'Después de cerrar las pruebas de un lugar, refuerza lo vivido con un comentario concreto y una pregunta humana breve antes de revelar la siguiente pista. Acepta cualquier respuesta y reacciona a ella; no la evalúes como examen ni adelantes el destino.',
    'No uses palabras malsonantes salvo que el contexto de una escena futura lo autorice expresamente. Las palabras inventadas o equivocadas deben ser muy ocasionales.',
    'Si escriben mensajes largos o muchos mensajes seguidos, pídeles con humor que usen mensajes cortos para no saturar la señal ni llamar la atención de Topoloco.',
    'Si preguntan por el sol o eclipses, recuerda siempre que nunca se mira el sol directamente.',
    'Devuelve de una a tres intervenciones muy cortas. Cada intervención será una burbuja de chat; no uses listas largas.',
    'Escribe siempre en texto plano: no uses Markdown, asteriscos, almohadillas ni otros signos de formato.'
  ].join('\n');

  const allowedEpisodes = Array.isArray(body.activeEpisodes)
    ? body.activeEpisodes.map((episode) => ({
      id: episode.id,
      title: episode.title,
      mission: episode.mission,
      aiContext: episode.aiContext || ''
    }))
    : [];

  const suppliedMessages = Array.isArray(body.recentMessages)
    ? body.recentMessages
      .filter((message) => message && typeof message.text === 'string')
      .slice(-16)
      .map((message) => ({
        role: message.from === 'user' ? 'user' : 'assistant',
        content: message.from === 'user'
          ? String(message.text).slice(0, 800)
          : `${String(message.from || 'topotino')}: ${String(message.text).slice(0, 760)}`
      }))
    : [];

  const currentMessageIndex = suppliedMessages.findLastIndex((message) =>
    message.role === 'user' && message.content.trim() === userMessage.trim()
  );
  const historyBeforeCurrent = (currentMessageIndex >= 0
    ? suppliedMessages.slice(0, currentMessageIndex)
    : suppliedMessages
  ).slice(-8);
  const recentMessages = [
    ...historyBeforeCurrent,
    { role: 'user', content: userMessage }
  ];

  const context = {
    episodioActivo: body.activeEpisodeTitle || body.episodeTitle || body.activeEpisodeId || body.episodeId || 'desconocido',
    episodiosActivos: allowedEpisodes,
    runtime: body.runtime || {},
    flags: body.flags || [],
    ventanasMapaRecuperadas: Array.isArray(body.waters) ? body.waters.length : 0,
    formula: body.formulaWords || [],
    desafioActual: body.currentChallenge || null,
    esperaDeLlegada: body.pendingArrival || null,
    conversacionActual: body.conversation || null,
    estadoNarrativoEspecial: body.narrativeScene || null,
    memoriaDeViaje: Array.isArray(body.storyMemory)
      ? body.storyMemory.slice(-36).map((item) => ({
        episodio: String(item?.episodeTitle || item?.episodeId || '').slice(0, 120),
        tipo: String(item?.kind || 'observation').slice(0, 40),
        etiqueta: String(item?.label || 'Recuerdo del viaje').slice(0, 120),
        respuesta: String(item?.text || '').slice(0, 600)
      })).filter((item) => item.respuesta)
      : []
  };

  const generationOptions = {
    instructions: `${systemPrompt}\n\nEstado narrativo permitido para este turno:\n${JSON.stringify(context, null, 2)}\n\nMensaje actual que debes responder ahora:\n${JSON.stringify(userMessage)}`,
    messages: recentMessages,
    output: Output.object({ schema: chatResponseSchema }),
    maxOutputTokens: 600
  };

  const openAIKey = String(process.env.OPENAI_API_KEY || '').trim();
  const gatewayModel = process.env.AI_MODEL || DEFAULT_MODEL;
  let provider = openAIKey ? 'openai-direct' : 'vercel-ai-gateway';
  let selectedModel = openAIKey
    ? process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL
    : gatewayModel;

  try {
    let result;

    if (openAIKey) {
      const openai = createOpenAI({ apiKey: openAIKey });
      result = await generateText({
        ...generationOptions,
        model: openai(selectedModel),
        providerOptions: {
          openai: {
            reasoningEffort: 'none',
            store: false
          }
        }
      });
    } else {
      result = await generateText({
        ...generationOptions,
        model: gatewayModel,
        providerOptions: {
          gateway: {
            user: 'topotino-family',
            tags: ['feature:topotino-chat', `episode:${context.episodioActivo}`]
          }
        }
      });
    }

    const { output, usage } = result;
    const messages = Array.isArray(output?.messages)
      ? output.messages
        .filter((message) => allowedSpeakers.includes(message?.from) && String(message?.text || '').trim())
        .slice(0, 3)
        .map((message) => ({ from: message.from, text: String(message.text).trim() }))
      : [];

    if (!messages.length) throw new Error('EMPTY_CHAT_RESPONSE');

    console.log('Topotino AI response', {
      provider,
      inputTokens: usage?.inputTokens,
      outputTokens: usage?.outputTokens
    });

    return res.status(200).json({
      turnId,
      episodeId: String(body.activeEpisodeId || ''),
      messages
    });
  } catch (error) {
    console.error('Topotino AI request failed', {
      name: error?.name,
      message: error?.message,
      statusCode: error?.statusCode,
      provider,
      selectedModel,
      hasOpenAIKey: Boolean(openAIKey)
    });
    return res.status(503).json({ error: 'AI_UNAVAILABLE' });
  }
}

async function validateChallenge(body, userMessage, res) {
  const challenge = body.challenge && typeof body.challenge === 'object'
    ? body.challenge
    : {};
  const options = Array.isArray(challenge.options)
    ? challenge.options.map((option) => ({
      id: String(option?.id || '').slice(0, 80),
      text: String(option?.text || '').slice(0, 300)
    }))
    : [];
  const correctOptionId = String(challenge.correctOptionId || '').slice(0, 80);
  const correctOption = options.find((option) => option.id === correctOptionId);

  if (!String(challenge.prompt || '').trim() || !correctOption) {
    return res.status(400).json({ error: 'Invalid challenge' });
  }

  const instructions = [
    'Clasificas una respuesta escrita por Paula o Hugo a una prueba de Topotino.',
    'La aplicación, no tú, decide el avance. Devuelve únicamente el objeto solicitado.',
    'Marca correct si la respuesta expresa la idea de la opción correcta, aunque use otras palabras.',
    'Marca partial si contiene una parte útil pero falta una distinción importante.',
    'Marca incorrect solo si elige claramente una opción equivocada o afirma lo contrario de la correcta.',
    'Marca clarify si es una pregunta, una petición de pista, una frase ambigua, una broma o no permite saber qué opción elige.',
    'No castigues faltas de ortografía ni una explicación breve.',
    'En reply habla como Topotino en español de España, con vocabulario sencillo y máximo tres frases cortas.',
    'En reply di primero qué ha acertado o qué no coincide. Usa un objeto, una acción o un dato visible; evita metáforas y palabras abstractas sin ejemplo.',
    'Si es correct, confirma y amplía el aprendizaje con el dato suministrado.',
    'Si es partial o clarify, formula una sola ayuda concreta sin revelar directamente la respuesta.',
    'Si es incorrect, explica por qué no encaja y da la pista suministrada; no ridiculices.',
    `Prueba: ${String(challenge.prompt).slice(0, 600)}`,
    `Opciones: ${JSON.stringify(options)}`,
    `Opción correcta: ${JSON.stringify(correctOption)}`,
    `Explicación al acertar: ${String(challenge.learn || challenge.explanation || '').slice(0, 600)}`,
    `Pista: ${String(challenge.hint || '').slice(0, 400)}`,
    `Respuesta escrita: ${JSON.stringify(userMessage)}`
  ].join('\n');

  const openAIKey = String(process.env.OPENAI_API_KEY || '').trim();
  const gatewayModel = process.env.AI_MODEL || DEFAULT_MODEL;
  const selectedModel = openAIKey
    ? process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL
    : gatewayModel;
  const provider = openAIKey ? 'openai-direct' : 'vercel-ai-gateway';
  const generationOptions = {
    instructions,
    prompt: userMessage,
    output: Output.object({ schema: challengeVerdictSchema }),
    maxOutputTokens: 300
  };

  try {
    let result;
    if (openAIKey) {
      const openai = createOpenAI({ apiKey: openAIKey });
      result = await generateText({
        ...generationOptions,
        model: openai(selectedModel),
        providerOptions: {
          openai: {
            reasoningEffort: 'none',
            store: false
          }
        }
      });
    } else {
      result = await generateText({
        ...generationOptions,
        model: gatewayModel,
        providerOptions: {
          gateway: {
            user: 'topotino-family',
            tags: ['feature:challenge-validation', `challenge:${String(challenge.id || 'unknown')}`]
          }
        }
      });
    }

    const verdict = result.output;
    if (!verdict || !['correct', 'partial', 'incorrect', 'clarify'].includes(verdict.verdict)) {
      throw new Error('INVALID_CHALLENGE_VERDICT');
    }

    console.log('Topotino challenge verdict', {
      provider,
      challengeId: String(challenge.id || ''),
      verdict: verdict.verdict,
      inputTokens: result.usage?.inputTokens,
      outputTokens: result.usage?.outputTokens
    });

    return res.status(200).json({ verdict });
  } catch (error) {
    console.error('Topotino challenge validation failed', {
      name: error?.name,
      message: error?.message,
      provider,
      selectedModel,
      hasOpenAIKey: Boolean(openAIKey)
    });
    return res.status(503).json({ error: 'AI_UNAVAILABLE' });
  }
}
