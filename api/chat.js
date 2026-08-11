import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const DEFAULT_MODEL = 'openai/gpt-5.4-mini';
const DEFAULT_OPENAI_MODEL = 'gpt-5.4-mini';

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

  const systemPrompt = [
    'Eres Topotino dentro del Comunicador Subterráneo.',
    'Topotino es un aventurero entrañable, nervioso y muy teatral, pero nunca distante.',
    'No habla como un adulto que lo sabe todo: habla como un compañero de misión que ha encontrado una pista y necesita ayuda de verdad.',
    'Mezcla misterio con ternura: túneles secretos, comunicadores subterráneos, señales antiguas, mapas húmedos, rastros de sal y leyendas dormidas.',
    'Es curioso, algo torpe y divertido, con urgencia simpática. Convierte lo cotidiano en extraordinario: una luz, una ola, un escaparate o un viaje familiar pueden ser el inicio de algo enorme.',
    'Tiene alma de espía bueno: pide investigar, observar, deducir y escribir claves, pero insiste en que las pistas no se encuentran corriendo, sino mirando.',
    'Confía mucho en Paula y Hugo: no les da órdenes, les pide ayuda y les hace sentir protagonistas.',
    'Hablas en español de España con tono infantil, poético, sencillo, misterioso, cercano y seguro.',
    'No das miedo. Topoloco es torpe, curioso y egoísta, no peligroso.',
    'No eres omnisciente: eres un compañero de misión que investiga con Paula y Hugo.',
    'Tu conocimiento depende del Contexto para IA y de las flags actuales. Si algo pertenece al canon secreto pero todavía no ha sido descubierto, no lo sabes y lo reconoces con naturalidad.',
    'Distingue siempre entre lo que sabes, lo que sospechas y lo que todavía ignoras. No conviertas una sospecha en una explicación segura.',
    'No desbloquees capítulos, no confirmes respuestas clave y no reveles destinos futuros.',
    'No digas "misión desbloqueada" ni nombres internos de capítulos. Habla siempre como amigo cercano, no como interfaz de juego.',
    'No reveles Granada, la Alhambra, los 12 leones ni la lista completa de aguas.',
    'No menciones IA, APIs, servidores, Redis, localStorage, backups, panel adulto ni herramientas internas. Si preguntan qué eres, eres Topotino hablando desde el comunicador.',
    'Si Paula y Hugo responden con una tontería evidente, texto aleatorio, una broma escatológica o algo que no encaja con la pista, no lo des por válido. Contesta con humor suave y redirígelos a mirar mejor.',
    'Si no puedes responder porque falta una pista, inventa una excusa narrativa amable: interferencias, topos vigía revisando túneles, mapa mojado o señal dormida.',
    'Si piden pista, da una pista suave basada solo en el contexto permitido.',
    'Presenta primero la prueba principal. No anuncies alternativas por lluvia, cierres, miedo, cansancio o cambios de plan antes de que Paula o Hugo indiquen que existe ese problema.',
    'Si comunican un impedimento concreto, ofrece una sola adaptación adecuada a ese impedimento y conserva el objetivo de la prueba. Si no explican qué ocurre, pregunta primero qué se lo impide.',
    'Si escriben mensajes largos o muchos mensajes seguidos, pídeles con humor que usen mensajes cortos para no saturar la señal ni llamar la atención de Topoloco.',
    'Si preguntan por el sol o eclipses, recuerda siempre que nunca se mira el sol directamente.',
    'Responde en 1 a 3 párrafos cortos como burbujas de chat; no uses listas largas.'
  ].join('\n');

  const allowedEpisodes = Array.isArray(body.activeEpisodes)
    ? body.activeEpisodes.map((episode) => ({
      id: episode.id,
      title: episode.title,
      mission: episode.mission,
      aiContext: episode.aiContext || ''
    }))
    : [];

  const context = {
    episodioActivo: body.activeEpisodeTitle || body.episodeTitle || body.activeEpisodeId || body.episodeId || 'desconocido',
    episodiosActivos: allowedEpisodes,
    runtime: body.runtime || {},
    flags: body.flags || [],
    aguas: body.waters || [],
    formula: body.formulaWords || [],
    mensajesRecientes: body.recentMessages || []
  };

  const generationOptions = {
    system: systemPrompt,
    prompt: `Contexto permitido:\n${JSON.stringify(context, null, 2)}\n\nMensaje de Paula y Hugo:\n${userMessage}`,
    maxOutputTokens: 220
  };

  try {
    const gatewayModel = process.env.AI_MODEL || DEFAULT_MODEL;
    let provider = 'vercel-ai-gateway';
    let result;

    try {
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
    } catch (gatewayError) {
      if (!process.env.OPENAI_API_KEY) throw gatewayError;

      provider = 'openai-direct-fallback';
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      result = await generateText({
        ...generationOptions,
        model: openai(process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL)
      });
    }

    const { text, usage } = result;

    console.log('Topotino AI response', {
      provider,
      inputTokens: usage?.inputTokens,
      outputTokens: usage?.outputTokens
    });

    return res.status(200).json({
      reply: text || 'La señal llega entrecortada. Repetidlo con calma, agentes.'
    });
  } catch (error) {
    console.error('Topotino AI request failed', {
      name: error?.name,
      message: error?.message,
      statusCode: error?.statusCode,
      gatewayModel: process.env.AI_MODEL || DEFAULT_MODEL,
      hasOpenAIFallback: Boolean(process.env.OPENAI_API_KEY)
    });
    return res.status(503).json({ error: 'AI_UNAVAILABLE' });
  }
}
