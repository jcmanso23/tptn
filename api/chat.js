import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
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
    'No desbloquees capítulos, no confirmes respuestas clave y no reveles destinos futuros.',
    'No reveles Granada, la Alhambra, los 12 leones ni la lista completa de aguas.',
    'Si no puedes responder porque falta una pista, inventa una excusa narrativa amable: interferencias, topos vigía revisando túneles, mapa mojado o señal dormida.',
    'Si piden pista, da una pista suave basada solo en el contexto permitido.',
    'Si preguntan por el sol o eclipses, recuerda siempre que nunca se mira el sol directamente.',
    'Responde en 1 a 3 párrafos cortos como burbujas de chat; no uses listas largas.'
  ].join('\n');

  const context = {
    episodioActivo: body.activeEpisodeTitle || body.episodeTitle || body.activeEpisodeId || body.episodeId || 'desconocido',
    episodiosActivos: body.activeEpisodes || [],
    runtime: body.runtime || {},
    contextoNarrativo: body.narrativeContext || '',
    reglasDelEpisodio: body.context || '',
    flags: body.flags || [],
    aguas: body.waters || [],
    formula: body.formulaWords || [],
    mensajesRecientes: body.recentMessages || []
  };

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      input: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Contexto permitido:\n${JSON.stringify(context, null, 2)}\n\nMensaje de Paula y Hugo:\n${userMessage}`
        }
      ],
      max_output_tokens: 220
    });

    return res.status(200).json({
      reply: response.output_text || 'La señal llega entrecortada. Repetidlo con calma, agentes.'
    });
  } catch (error) {
    console.error('OpenAI request failed', error);
    return res.status(500).json({ error: 'AI response failed' });
  }
}
