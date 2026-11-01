import { splitTopotinoMessages } from '../chat-format.js';
const texts = [
  'Paula, Hugo… ¡tenía una sorpresa guardada para vosotros! Después de toda vuestra ayuda, ahora me toca preparar algo divertido.',
  'Os regalo «Los 12 secretos de Santiago»: un paseo con vuestro propio mapa para descubrir juntos los detalles más curiosos de la ciudad.',
  '¡Hay un ángel con gafas, una casa con truco y un peregrino que aparece de noche! También investigué las uvas de piedra. Confirmado: no sirven para merendar.',
  'Podéis jugar a vuestro ritmo, hacer fotos y seguir otro día. ¡Esta aventura es para disfrutarla juntos! Abrid el regalo con el botón de este mensaje.'
];
const gift = splitTopotinoMessages(texts.map(text => ({from:'topotino',text})))
  .map((message,index) => ({...message,episodeId:'040-samain-victoria',id:`samain-regalo-santiago-v1-${index}`}));
export const SANTIAGO_GIFT_LINK_ID = gift.at(-1).id;
export function pendingSantiagoGift(campaign, messages) {
  if (campaign?.id !== 'samain-2026' || campaign.stage !== 'victoria' || campaign.entryDelivered !== 'victoria') return [];
  const delivered = new Set(messages.map(m => m.deliveryId));
  if ((campaign.outbox || []).some(m => !delivered.has(m.id))) return [];
  return gift.filter(m => !delivered.has(m.id));
}
