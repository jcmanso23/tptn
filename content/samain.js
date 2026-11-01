// Narrative progress is owned by this reducer, never by the conversational model.
export const SAMAIN_ID = 'samain-2026';
const step = (key, number, label, actions = []) => ({
  key, episodeId: `${number}-samain-${key}`, label,
  actions: actions.map(([id, text]) => ({ id, text }))
});

export const SAMAIN_STAGES = Object.freeze([
  step('contacto', '020', 'Contacto del viernes'),
  step('astorga', '021', 'Investigar la primera ciudad'),
  step('palacio', '022', 'Identificar el palacio'),
  step('llegada-palacio', '023', 'Llegada al Palacio', [['llegada', 'Ya estamos en el Palacio']]),
  step('visita-palacio', '024', 'Experiencia del Palacio', [['terminado', 'Hemos terminado la visita']]),
  step('catedral', '025', 'Investigar el otro edificio'),
  step('llegada-catedral', '026', 'Llegada a la Catedral', [['llegada', 'Ya estamos en la Catedral']]),
  step('visita-catedral', '027', 'La aventura de Marta y Pedro', [['terminado', 'Hemos terminado con Marta y Pedro']]),
  step('pedro', '028', 'Contar el descubrimiento'),
  step('trampa', '029', 'La distracción', [['ayudar', '¡Vamos contigo!']]),
  step('lugo', '030', 'Descubrir la ciudad amurallada'),
  step('llegada-lugo', '031', 'Llegada a Lugo', [['llegada', 'Ya estamos en el centro de Lugo']]),
  step('refugio', '032', 'La dirección del refugio'),
  step('llegada-refugio', '033', 'Llegada al refugio', [['llegada', 'Ya estamos en el refugio']]),
  step('samain', '034', 'Una noche distinta'),
  step('muralla', '035', 'El circuito de Topoloco', [['observado', 'Hemos mirado una puerta de la muralla']]),
  step('busqueda', '036', 'Cambiar al mapa de los Flopis', [
    ['rescatados', 'Hemos completado las 12 pruebas'], ['ayuda', 'Necesitamos ayuda con la búsqueda']
  ]),
  step('dificultad', '037', 'Ayuda para la búsqueda', [
    ['volver', 'Vamos a seguir con el mapa'], ['alternativa', 'Queremos el rescate desde este chat'],
    ['rescatados', 'Ya están todos libres']
  ]),
  step('alternativa', '038', 'Encontrar una salida'),
  step('enviar-salida', '039', 'Enviar la señal de salida', [['abrir', 'Abrir la salida']]),
  step('irrupcion', '041', 'Topoloco pide una reclamación', [['responder', 'Dar paso a Hugo']]),
  step('replica', '042', 'La respuesta de Hugo', [['responder', 'Vamos a despedir a Topoloco']]),
  step('expulsion', '043', 'Cerrar el acceso de Topoloco', [['expulsar', '¡Fuera del canal, Topoloco!']]),
  step('victoria', '040', 'Victoria y descanso')
]);

export const samainStage = (key) => SAMAIN_STAGES.find((s) => s.key === key);
export const samainStageForEpisode = (id) => SAMAIN_STAGES.find((s) => s.episodeId === id);
export const newSamain = () => ({ id: SAMAIN_ID, stage: 'contacto', completed: [], hints: {}, partialRescue: false, entrySequence: 0, pedroRecoveryChecked: true, lugoRecoveryChecked: true, mapNoticeChecked: true });

export function normalizeSamain(value) {
  if (value?.id !== SAMAIN_ID || !samainStage(value.stage)) return null;
  return {
    ...newSamain(), stage: value.stage,
    completed: [...new Set((Array.isArray(value.completed) ? value.completed : []).filter((s) => samainStage(s)))],
    hints: Object.fromEntries(Object.entries(value.hints || {}).filter(([k, v]) => samainStage(k) && Number.isSafeInteger(v) && v >= 0)),
    morningRescueChecked: value.morningRescueChecked === true,
    partialRescue: value.partialRescue === true,
    pedroRecoveryChecked: value.pedroRecoveryChecked === true,
    lugoRecoveryChecked: value.lugoRecoveryChecked === true,
    waitingRomanVisit: value.waitingRomanVisit === true,
    mapNoticeChecked: value.mapNoticeChecked === true,
    entrySequence: Number.isSafeInteger(value.entrySequence) ? value.entrySequence : 0,
    entryDelivered: value.entryDelivered === value.stage ? value.stage : null,
    outbox: Array.isArray(value.outbox) ? value.outbox.filter((m) => m && typeof m.id === 'string' && typeof m.text === 'string').slice(0, 40) : []
  };
}

export function madridDay(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function samainCanStart(now) {
  const day = madridDay(now);
  return day >= '2026-10-30' && day <= '2026-11-01';
}

export function samainSpeakers(key) {
  return ['irrupcion', 'replica', 'expulsion'].includes(key) ? ['topotino', 'topotina', 'topoloco'] : ['topotino'];
}

const normalize = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ').trim();
const say = (text) => ({ kind: 'reply', text });
const go = (next, extra = {}) => ({ kind: 'advance', next, ...extra });
const affirmative = (t) => /^(si|claro|vale|venga|vamos|ayudamos|te ayudamos|estamos listos|os ayudamos|de acuerdo|me apunto|nos apuntamos|ok|hola|te recibimos|aqui estamos|estamos los dos)\b/.test(t);
const finished = (t) => /\b(hemos terminado|lo hemos terminado|ya hemos terminado|hemos terminado la visita|ya hemos acabado|hemos finalizado|ya terminamos|terminamos la visita|hemos acabado|ya acabamos|hemos salido|ya salimos|visita terminada|ya esta|ya lo hemos hecho)\b/.test(t);
const arrived = (t) => /\b(ya estamos|estamos en|hemos llegado|ya llegamos|acabamos de llegar|ya dentro|ya hemos entrado)\b/.test(t);

// Report recognition is deliberately conservative: questions, plans and denials
// are conversation, not proof of a physical visit or a successful rescue.
export function samainIsUncertain(raw) {
  const t = normalize(raw);
  return /[¿?]/.test(raw) || /\b(no|aun|todavia|quizas|quiza|creo|supongo|ojala|manana|luego|podemos|podriamos|vamos a|si conseguimos|si encontramos|cuando encontremos|cuando consigamos|si terminamos|si acabamos|si hemos|si estan|a ver si|si los|si lo|dice|dicen|dijo|dijiste|has dicho|cuando|imagina|imaginad)\b/.test(t);
}

export function samainRescueSucceeded(raw) {
  const t = normalize(raw);
  return !samainIsUncertain(raw) && !/\b(algunos|uno|una|dos|faltan|falta|quedan|pendientes|excepto|menos|solo|casi|parte)\b/.test(t) &&
    /\b(hemos (?:terminado|completado|superado|hecho|acabado) (?:ya )?(?:las |los )?(?:12|doce) (?:pruebas|retos)|ya (?:hemos )?(?:estan )?(?:completado|completadas|superado|superadas|hecho|hechas|terminado|terminadas) (?:las )?(?:12|doce)(?: pruebas| retos)?|hemos (?:terminado|completado|superado|hecho|acabado) todas las pruebas|(?:las )?(?:12|doce) pruebas (?:completadas|terminadas|superadas|hechas)|ya lo he conseguido|lo hemos conseguido|hemos conseguido liberarlos|los hemos encontrado|hemos encontrado a todos|hemos rescatado a todos|los hemos rescatado|los hemos liberado|ya estan todos libres|todos estan libres|estan todos a salvo|rescatamos a todos)\b/.test(t);
}

export function reduceSamain(campaign, raw = '', action = '', now = new Date()) {
  const stage = samainStage(campaign.stage);
  if (!stage) return { kind: 'chat' };
  const t = normalize(raw);
  if (['llegada-refugio', 'samain', 'muralla'].includes(stage.key)) {
    if (campaign.waitingRomanVisit && !samainIsUncertain(raw) && (finished(t) || /\b(hemos terminado|ya hemos terminado|ya acabamos|hemos acabado|ya terminamos|hemos finalizado|ya hemos acabado)\b/.test(t))) return go('busqueda', { romanVisitFinished: true, prefix: '¡¡Bien hecho, exploradores!! Ahora necesitamos vuestra ayuda: buscad el mapa de los Flopis que ya conocéis para rescatarlos. ¡Yo seguiré el rastro de Topoloco con mis bigotes en modo detective!' });
    if (campaign.waitingRomanVisit) return { kind: 'chat' };
    if (!campaign.waitingRomanVisit && !samainIsUncertain(raw) && /\bmuralla\b/.test(t) && /\b(hemos encontrado|encontramos|hemos visto|ya estamos|estamos en|hemos llegado|estamos junto|estamos viendo)\b/.test(t)) return { kind: 'reply', romanVisitStarted: true, text: '¡¡Habéis encontrado la muralla!! ¡Mis bigotes están dando volteretas romanas! ¿Habéis descubierto algo sobre las cloacas romanas? Contadme lo que veáis o aprendáis. Seguid vuestra aventura y avisadme cuando terminéis; yo mientras vigilo a Topoloco… y procuro no caer en ninguna alcantarilla.' };
  }
  if (action && !stage.actions.some((a) => a.id === action)) return { kind: 'chat' };
  if (!action && /\b(pista|ayuda con la pista|otra pista|no sabemos|no se|no entiendo|no entendemos)\b/.test(t) && !['busqueda', 'dificultad', 'irrupcion', 'replica', 'expulsion', 'victoria'].includes(stage.key)) return { kind: 'hint' };

  if (['busqueda', 'dificultad'].includes(stage.key)) {
    if (action === 'rescatados' || samainRescueSucceeded(raw)) return go('irrupcion', { rescued: true });
    if (action === 'alternativa') return go('alternativa');
    if (action === 'volver') return go('busqueda');
    if (/\b(algunos|solo uno|solo dos|faltan|falta|uno de los)\b/.test(t)) return say('¡Tenemos una parte! Guardamos lo que ya habéis conseguido. ¿Queréis seguir con el mapa o preferís que busquemos otra forma de ayudar a los que faltan?');
    if (/\b(cansad|miedo|dormir|descansar|dejarl|parar|llueve|lloviendo)\w*/.test(t)) return stage.key === 'dificultad'
      ? say('Primero descansad en el refugio de Rúa Armanyá 31, con los adultos. Cuando os apetezca, podemos intentar el rescate desde aquí sin volver a salir.')
      : go('dificultad', { prefix: 'Primero podéis volver al refugio y descansar con los adultos. No hace falta seguir caminando.' });
    if (/\b(no encontramos el mapa|no vemos el mapa|donde esta el mapa|que mapa|cual es el mapa)\b/.test(t)) return say('El mapa de los Flopis que ya habéis utilizado en otras aventuras. Se abre fuera de este chat. Buscad con los adultos cerca de la plaza o de la Catedral; yo no conozco el escondite exacto. Si no aparece, tengo otra forma de intentarlo desde aquí.');
    if (action === 'ayuda' || /\b(no funciona|no carga|sin internet|sin cobertura|no podemos|no lo conseguimos|no lo hemos conseguido|no los encontramos|no hemos encontrado|no encontramos|no hemos podido|no hemos conseguido|ayuda|alternativa|otro modo|por aqui|desde aqui|desde el chat|desde este chat)\b/.test(t)) return stage.key === 'dificultad'
      ? go('alternativa') : go('dificultad');
    if (/\b(hemos terminado|ya hemos terminado|lo hemos terminado|hemos acabado|hemos finalizado|ya esta|hecho|conseguido)\b/.test(t) && !samainIsUncertain(raw)) return say('¿Queréis decir que todos los Flopis están libres? Confirmádmelo para que no cierre ninguna jaula con alguien dentro.');
    return { kind: 'chat' };
  }

  if (['irrupcion', 'replica'].includes(stage.key)) {
    if (action === 'responder' || (t && !/[¿?]/.test(raw))) return go(stage.key === 'irrupcion' ? 'replica' : 'expulsion', { conversation: true });
    return { kind: 'chat' };
  }
  if (stage.key === 'expulsion' && (action === 'expulsar' || (!samainIsUncertain(raw) && /\b(fuera|expulsar|expulsalo|echalo|echadle|expulsadlo|cerrar el acceso|adios topoloco)\b/.test(t)))) return go('victoria');

  if (stage.key === 'contacto') return affirmative(t) && !/[¿?]/.test(raw) ? go('astorga') : { kind: 'chat' };
  if (stage.key === 'astorga' && /\bastorga\b/.test(t) && !/\b(no|nunca|descartamos)\b/.test(t)) {
    return go(/\b(gaudi|episcopal)\b/.test(t) ? 'llegada-palacio' : 'palacio');
  }
  if (stage.key === 'palacio' && /\b(gaudi|episcopal)\b/.test(t) && !/\b(no|nunca|descartamos)\b/.test(t)) return go('llegada-palacio');

  if (['llegada-palacio', 'visita-palacio', 'llegada-catedral', 'visita-catedral'].includes(stage.key)) {
    if (madridDay(now) < '2026-10-31') return say('La investigación en los edificios será mañana, sábado 31. Hoy podemos preparar las pistas; no hace falta salir ahora.');
    if (stage.key.startsWith('llegada-') && (action === 'llegada' || (arrived(t) && !samainIsUncertain(raw)))) return go(stage.key === 'llegada-palacio' ? 'visita-palacio' : 'visita-catedral');
    const pedroDiscovery = /\b(pedro mato|mato|maragato)\b/.test(t) && /\b(hemos encontrado|ya encontramos|ya sabemos|hemos descubierto|ya descubrimos)\b/.test(t) && !samainIsUncertain(raw);
    if (stage.key.startsWith('visita-') && (action === 'terminado' || ((finished(t) || (stage.key === 'visita-catedral' && pedroDiscovery)) && !samainIsUncertain(raw)))) {
      if (stage.key === 'visita-palacio') return go('catedral');
      return go(/\b(mato|figura|estatua|maragato|veleta)\b/.test(t) ? 'trampa' : 'pedro');
    }
  }
  if (stage.key === 'catedral' && /\bcatedral\b/.test(t) && !/\b(no|nunca)\b/.test(t)) return go('llegada-catedral');
  if (stage.key === 'pedro' && /\b(mato|figura|estatua|maragato|veleta)\b/.test(t) && !samainIsUncertain(raw)) return go('trampa');
  if (stage.key === 'trampa' && /\blugo\b/.test(t) && !samainIsUncertain(raw)) return go('llegada-lugo');
  if (stage.key === 'trampa' && (action === 'ayudar' || affirmative(t))) return go('lugo');
  if (stage.key === 'lugo' && /\blugo\b/.test(t) && !/\b(no|nunca|descartamos)\b/.test(t)) return go('llegada-lugo');
  if (stage.key === 'llegada-lugo' && (action === 'llegada' || (arrived(t) && !samainIsUncertain(raw)))) return go('refugio');
  if (stage.key === 'refugio' && /\b(31|treinta y uno)\b/.test(t) && !/\bno\b/.test(t)) return go('llegada-refugio');
  if (stage.key === 'llegada-refugio' && (action === 'llegada' || (arrived(t) && !samainIsUncertain(raw)))) return go('samain');
  if (stage.key === 'samain' && t.length > 1 && !/[¿?]/.test(raw)) return go('muralla');
  if (stage.key === 'muralla' && (action === 'observado' || (!samainIsUncertain(raw) && /\b(hemos mirado|hemos visto|hemos observado|hay puertas|tiene puertas|hay una puerta|tiene una puerta)\b/.test(t)))) return go('busqueda');
  if (stage.key === 'alternativa' && /\b(puerta|puertas|salida|abrir|paso|hueco)\b/.test(t) && !samainIsUncertain(raw)) return go('enviar-salida');
  if (stage.key === 'enviar-salida' && (action === 'abrir' || (!samainIsUncertain(raw) && affirmative(t)) || (!samainIsUncertain(raw) && /\b(abrid|abrimos|abre|enviad|enviamos|enviar|abrir la salida|adelante)\b/.test(t)))) return go('irrupcion', { rescued: true, alternative: true });
  return { kind: 'chat' };
}
