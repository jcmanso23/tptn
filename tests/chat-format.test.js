import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_TOPOTINO_BUBBLE_CHARS,
  splitChatText,
  splitTopotinoMessages
} from '../chat-format.js';

test('divide una respuesta larga de Topotino en burbujas breves', () => {
  const original = 'Primera idea con una explicación clara. Segunda idea que añade una pista importante para continuar la investigación. Tercera idea que cierra el mensaje sin convertirlo en un párrafo enorme para el comunicador.';
  const parts = splitChatText(original, 90);

  assert.ok(parts.length > 1);
  assert.ok(parts.every((part) => part.length <= 90));
  assert.equal(parts.join(' '), original);
});

test('conserva mensajes del usuario y metadatos de Topotino', () => {
  const messages = [
    { from: 'user', text: 'Nuestra respuesta puede ser larga porque es una investigación.' },
    { from: 'topotino', time: 'auto', requiredFlags: ['prueba'], text: 'Una frase muy larga '.repeat(20).trim() }
  ];
  const result = splitTopotinoMessages(messages);

  assert.equal(result[0], messages[0]);
  assert.ok(result.length > 2);
  assert.ok(result.slice(1).every((message) => message.text.length <= MAX_TOPOTINO_BUBBLE_CHARS));
  assert.ok(result.slice(1).every((message) => message.requiredFlags.includes('prueba')));
});

test('también parte una palabra anormalmente larga sin exceder el límite', () => {
  const parts = splitChatText('x'.repeat(400), 100);
  assert.deepEqual(parts.map((part) => part.length), [100, 100, 100, 100]);
});
