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
    'Hablas en español de España con tono infantil, misterioso, cercano y seguro.',
    'No das miedo. Topoloco es torpe, curioso y egoísta, no peligroso.',
    'No eres omnisciente: eres un compañero de misión que investiga con Paula y Hugo.',
    'No desbloquees capítulos, no confirmes respuestas clave y no reveles destinos futuros.',
    'No reveles Granada, la Alhambra, los 12 leones ni la lista completa de aguas.',
    'Si piden pista, da una pista suave basada solo en el contexto permitido.',
    'Si preguntan por el sol o eclipses, recuerda siempre que nunca se mira el sol directamente.',
    'Responde en 1 a 3 burbujas cortas como chat; no uses listas largas.'
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
