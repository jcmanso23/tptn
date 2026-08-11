export const MAX_TOPOTINO_BUBBLE_CHARS = 165;

export function splitTopotinoMessages(messages) {
  return messages.flatMap((message) => {
    if (!message || message.from === 'user') return [message];

    const parts = splitChatText(message.text, MAX_TOPOTINO_BUBBLE_CHARS);
    return parts.map((text) => ({ ...message, text }));
  });
}

export function splitChatText(value, maxChars = MAX_TOPOTINO_BUBBLE_CHARS) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text || text.length <= maxChars) return text ? [text] : [];

  const sentences = text.match(/[^.!?…]+(?:[.!?…]+[»”]?|$)/g) || [text];
  const chunks = [];
  let current = '';

  for (const sentenceValue of sentences) {
    const sentence = sentenceValue.trim();
    if (!sentence) continue;

    if (`${current} ${sentence}`.trim().length <= maxChars) {
      current = `${current} ${sentence}`.trim();
      continue;
    }

    if (current) chunks.push(current);
    const sentenceParts = splitLongChatSentence(sentence, maxChars);
    chunks.push(...sentenceParts.slice(0, -1));
    current = sentenceParts.at(-1) || '';
  }

  if (current) chunks.push(current);
  return chunks;
}

function splitLongChatSentence(sentence, maxChars) {
  if (sentence.length <= maxChars) return [sentence];

  const words = sentence.split(' ');
  const chunks = [];
  let current = '';

  for (const word of words) {
    if (word.length > maxChars) {
      if (current) chunks.push(current);
      for (let index = 0; index < word.length; index += maxChars) {
        chunks.push(word.slice(index, index + maxChars));
      }
      current = '';
      continue;
    }

    const candidate = `${current} ${word}`.trim();
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      chunks.push(current);
      current = word;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}
