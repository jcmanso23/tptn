const STORAGE_KEYS = {
  auth: 'topotino_chat_auth_v1',
  state: 'topotino_chat_state_v2'
};

const LEGACY_STATE_KEY = 'topotino_chat_state_v1';
const PASSPHRASE_HASH = 'a64716bd9f4e8added1bf47f80b97c3fc7b70a15b8043cdab083e1ddf85f3794';
const EPISODES_MANIFEST = 'content/episodes.json?v=chat-v14';
const ACTIVATION_TICK_MS = 60000;
const TOPOTINO_IMAGE = 'images/topotino.png?v=marco-v1';
const CHATTER_LIMIT_CHARS = 180;
const CHATTER_LIMIT_MESSAGES = 4;
const CHATTER_WINDOW_MS = 2 * 60 * 1000;
const CHATTER_WARNING_COOLDOWN_MS = 90 * 1000;
const REPLY_SILENCE_MIN_MS = 5000;
const REPLY_SILENCE_MAX_MS = 60000;
const REPLY_TYPING_MIN_MS = 5000;
const REPLY_TYPING_MAX_MS = 10000;
const REPLY_STAGGER_MIN_MS = 700;
const REPLY_STAGGER_MAX_MS = 1600;
const REPLY_NEXT_TYPING_MIN_MS = 3000;
const REPLY_NEXT_TYPING_MAX_MS = 8000;
const REPLY_TYPING_VISIBLE_MIN_MS = 8000;
const REPLY_TYPING_VISIBLE_MAX_MS = 14000;
const REPLY_NEXT_TYPING_VISIBLE_MIN_MS = 4000;
const REPLY_NEXT_TYPING_VISIBLE_MAX_MS = 9000;
const ACTIVATION_SILENCE_MIN_MS = 700;
const ACTIVATION_SILENCE_MAX_MS = 1800;
const ACTIVATION_TYPING_MIN_MS = 1200;
const ACTIVATION_TYPING_MAX_MS = 2600;
const SYNC_DEBOUNCE_MS = 1800;

const CHATTER_WARNINGS = [
  'Chsss... mensajes cortitos, agentes. Si Topoloco oye tanto tecleo, va a sacar la libreta de sospechas.',
  'Toposeñal un poco saturada. Decidme solo lo imprescindible, como buenos espías de bolsillo.',
  'Alerta de bigotes: demasiadas palabras hacen cosquillas en los túneles. Resumid, resumid.',
  'Modo sigilo, por favor. Topoloco se despista fácil, pero no le regalemos una novela entera.'
];

const TYPING_MESSAGES = [
  'Topotino está escribiendo...',
  'Topotino está tecleando con mucho cuidado...',
  'Topotino está ordenando sus palabras...',
  'Topotino está escribiendo despacito para no hacer ruido...',
  'Topotino está preparando una respuesta...'
];

const FORMULA_WORDS = [
  'MIRO',
  'COMIENZO',
  'RIO',
  'ESPERO',
  'CONFIO',
  'JUEGO',
  'DESCUBRO',
  'PREGUNTO',
  'CUIDO',
  'VUELO',
  'ME ATREVO',
  'AGRADEZCO'
];

const FORMULA_LABELS = {
  MIRO: 'Miro',
  COMIENZO: 'Comienzo',
  RIO: 'Río',
  ESPERO: 'Espero',
  CONFIO: 'Confío',
  JUEGO: 'Juego',
  DESCUBRO: 'Descubro',
  PREGUNTO: 'Pregunto',
  CUIDO: 'Cuido',
  VUELO: 'Vuelo',
  'ME ATREVO': 'Me atrevo',
  AGRADEZCO: 'Agradezco'
};

const state = {
  unlocked: false,
  activeEpisodeId: '001-reconexion',
  unlockedEpisodeIds: [],
  renderedEpisodes: [],
  messages: [],
  flags: [],
  waters: [],
  formulaWords: [],
  softResponseCursor: {},
  hintMissCursor: {},
  chatterWarningCursor: 0,
  lastChatterWarningAt: 0,
  typingMessageCursor: 0,
  runtimeNowOverride: null,
  lastKnownPosition: null,
  locationStatus: 'Sin posición actualizada.',
  channelId: null,
  recoveryCode: null,
  revision: 0,
  lastSyncedAt: null,
  syncStatus: 'local',
  syncError: null
};

let manifest = [];
let episodes = [];
let busy = false;
let syncTimer = null;
let syncInFlight = false;

const els = {};
const params = new URLSearchParams(window.location.search);
const isAdultMode = params.get('adult') === '1';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindElements();
  bindEvents();
  registerServiceWorker();
  loadState();
  applyTestingParams();

  try {
    manifest = await fetchJson(EPISODES_MANIFEST);
    episodes = await Promise.all(manifest.map((item) => fetchEpisode(item.file)));
    episodes.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));
  } catch (error) {
    console.error(error);
    showUnlockError('No se pudo cargar el comunicador. Revisad la conexión.');
    return;
  }

  setupAdultPanel();

  if (state.unlocked) {
    await enterChat();
  } else {
    showScreen('unlock');
  }
}

function bindElements() {
  els.unlockScreen = document.getElementById('screen-unlock');
  els.chatScreen = document.getElementById('screen-chat');
  els.unlockForm = document.getElementById('unlock-form');
  els.unlockCode = document.getElementById('unlock-code');
  els.unlockError = document.getElementById('unlock-error');
  els.chatForm = document.getElementById('chat-form');
  els.chatInput = document.getElementById('chat-input');
  els.messages = document.getElementById('messages');
  els.typing = document.getElementById('typing-indicator');
  els.sendButton = document.querySelector('.send-button');
  els.channelCode = document.getElementById('channel-code');
  els.missionActive = document.getElementById('mission-active');
  els.watersCount = document.getElementById('waters-count');
  els.watersList = document.getElementById('waters-list');
  els.formulaDisplay = document.getElementById('formula-display');
  els.progressToggle = document.getElementById('progress-toggle');
  els.progressBody = document.getElementById('progress-body');
  els.internalProgress = document.getElementById('internal-progress');
  els.locationButton = document.getElementById('location-refresh');
  els.locationStatus = document.getElementById('location-status');
  els.typingText = document.getElementById('typing-text');
  els.adultPanel = document.getElementById('adult-panel');
  els.adultRecoveryCode = document.getElementById('adult-recovery-code');
  els.adultSyncStatus = document.getElementById('adult-sync-status');
  els.adultLastSync = document.getElementById('adult-last-sync');
  els.adultRestoreCode = document.getElementById('adult-restore-code');
  els.adultFileInput = document.getElementById('adult-import-file');
  els.adultMessage = document.getElementById('adult-message');
  els.adultCopy = document.getElementById('adult-copy-code');
  els.adultSync = document.getElementById('adult-force-sync');
  els.adultRestore = document.getElementById('adult-restore');
  els.adultExport = document.getElementById('adult-export');
  els.adultImport = document.getElementById('adult-import');
  els.adultClear = document.getElementById('adult-clear-local');
}

function bindEvents() {
  els.unlockForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const codeHash = await sha256Hex(normalizeText(els.unlockCode.value));
    if (codeHash !== PASSPHRASE_HASH) {
      showUnlockError('Acceso denegado. Esa no parece la clave secreta.');
      return;
    }

    els.unlockError.hidden = true;
    state.unlocked = true;
    saveState();
    await enterChat();
  });

  els.chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = els.chatInput.value.trim();
    if (!text || busy) return;
    els.chatInput.value = '';
    await handleUserMessage(text);
  });

  els.progressToggle.addEventListener('click', () => {
    const isOpen = !els.progressBody.hidden;
    els.progressBody.hidden = isOpen;
    els.progressToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  els.locationButton.addEventListener('click', refreshLocation);
  window.addEventListener('online', () => syncStateNow({ force: true }));

  if (els.adultCopy) els.adultCopy.addEventListener('click', copyRecoveryCode);
  if (els.adultSync) els.adultSync.addEventListener('click', () => syncStateNow({ force: true }));
  if (els.adultRestore) els.adultRestore.addEventListener('click', restoreFromAdultCode);
  if (els.adultExport) els.adultExport.addEventListener('click', exportAdultBackup);
  if (els.adultImport) els.adultImport.addEventListener('click', () => els.adultFileInput.click());
  if (els.adultFileInput) els.adultFileInput.addEventListener('change', importAdultBackup);
  if (els.adultClear) els.adultClear.addEventListener('click', clearLocalAdultState);
}

async function enterChat() {
  showScreen('chat');
  if (params.get('debug') === '1') {
    els.internalProgress.hidden = false;
    els.internalProgress.setAttribute('aria-hidden', 'false');
  }
  await refreshLocationForPendingActivations();
  const activationMessages = await evaluateActivations({ reason: 'enter', collectMessages: true });
  renderAll();
  setInterval(() => evaluateActivations({ reason: 'tick' }), ACTIVATION_TICK_MS);
  if (activationMessages.length) {
    await deliverTopotinoMessages(activationMessages, { mode: 'activation' });
  }
  window.setTimeout(() => syncStateNow({ force: state.syncStatus !== 'synced' }), 1000);
  setTimeout(() => els.chatInput.focus(), 50);
}

function showScreen(name) {
  els.unlockScreen.classList.toggle('active', name === 'unlock');
  els.chatScreen.classList.toggle('active', name === 'chat');
}

async function evaluateActivations({ reason, collectMessages = false } = {}) {
  let changed = false;
  const queuedMessages = [];

  for (const episode of episodes) {
    if (isEpisodeUnlocked(episode.meta.id)) continue;
    if (!episodeCanActivate(episode)) continue;
    unlockEpisode(episode.meta.id);
    if (collectMessages) {
      queuedMessages.push(...(episode.initialMessages || []));
    } else {
      appendMessages(episode.initialMessages || []);
    }
    changed = true;
  }

  if (changed) {
    saveState();
    renderAll();
  }

  return queuedMessages;
}

function episodeCanActivate(episode) {
  if (!state.unlocked) return false;
  if (episode.meta.startsUnlocked) return true;

  const activation = episode.meta.activation || {};
  const checks = [];

  const requiredFlags = activation.required || activation.flags || [];
  if (requiredFlags.length) {
    checks.push(requiredFlags.every((flag) => state.flags.includes(flag)));
  }

  if (activation.anyFlags && activation.anyFlags.length) {
    checks.push(activation.anyFlags.some((flag) => state.flags.includes(flag)));
  }

  if (activation.date) {
    checks.push(dateMatches(activation.date, getRuntimeNow()));
  }

  if (activation.time) {
    checks.push(timeMatches(activation.time, getRuntimeNow()));
  }

  if (activation.location) {
    checks.push(locationMatches(activation.location));
  }

  if (!checks.length) return false;
  return activation.mode === 'any' ? checks.some(Boolean) : checks.every(Boolean);
}

function episodeCanActivateExceptLocation(episode) {
  if (!state.unlocked || isEpisodeUnlocked(episode.meta.id)) return false;
  const activation = episode.meta.activation || {};
  if (!activation.location) return false;

  const checks = [];
  const requiredFlags = activation.required || activation.flags || [];
  if (requiredFlags.length) {
    checks.push(requiredFlags.every((flag) => state.flags.includes(flag)));
  }
  if (activation.anyFlags && activation.anyFlags.length) {
    checks.push(activation.anyFlags.some((flag) => state.flags.includes(flag)));
  }
  if (activation.date) {
    checks.push(dateMatches(activation.date, getRuntimeNow()));
  }
  if (activation.time) {
    checks.push(timeMatches(activation.time, getRuntimeNow()));
  }

  if (!checks.length) return true;
  return activation.mode === 'any' ? checks.some(Boolean) : checks.every(Boolean);
}

async function refreshLocationForPendingActivations() {
  if (!navigator.geolocation) return;
  if (!episodes.some((episode) => episodeCanActivateExceptLocation(episode))) return;

  try {
    const position = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000
    });
    state.lastKnownPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: Math.round(position.coords.accuracy || 0),
      capturedAt: new Date().toISOString(),
      source: 'device-auto'
    };
    state.locationStatus = `Señal actualizada (${state.lastKnownPosition.accuracy || '?'} m).`;
    saveState();
  } catch (error) {
    state.locationStatus = locationErrorMessage(error);
  }
}

function unlockEpisode(episodeId) {
  if (!state.unlockedEpisodeIds.includes(episodeId)) {
    state.unlockedEpisodeIds.push(episodeId);
  }
  if (!state.renderedEpisodes.includes(episodeId)) {
    state.renderedEpisodes.push(episodeId);
  }
  state.activeEpisodeId = episodeId;
}

async function handleUserMessage(text) {
  appendMessage({ from: 'user', time: nowTime(), text });
  saveState();
  renderAll();

  const guided = findGuidedResponse(text);
  if (guided) {
    await applyGuidedResponse(guided.response, guided.episode);
    return;
  }

  const progressiveHint = nextProgressiveHint();
  if (progressiveHint) {
    await deliverTopotinoMessages([{
      from: 'topotino',
      time: nowTime(),
      text: progressiveHint
    }]);
    saveState();
    renderAll();
    return;
  }

  if (shouldWarnAboutChatter(text)) {
    await deliverTopotinoMessages([{
      from: 'topotino',
      time: nowTime(),
      text: nextChatterWarning()
    }]);
    saveState();
    renderAll();
    return;
  }

  await askAiFallback(text);
}

async function applyGuidedResponse(guided, sourceEpisode) {
  const outboundMessages = [...(guided.messages || [])];
  state.hintMissCursor[sourceEpisode.meta.id] = 0;
  addUniqueMany(state.flags, guided.setFlags || []);

  if (guided.setLocation) setSimulatedLocation(guided.setLocation);
  if (guided.setRuntimeNow) setSimulatedRuntime(guided.setRuntimeNow);
  if (guided.clearRuntimeNow) clearSimulatedRuntime();
  if (guided.water) addWater(guided.water);
  if (guided.formulaWord) addFormulaWord(guided.formulaWord);

  if (guided.nextEpisode) {
    const nextEpisode = getEpisode(guided.nextEpisode);
    if (nextEpisode) {
      const wasRendered = state.renderedEpisodes.includes(nextEpisode.meta.id);
      unlockEpisode(nextEpisode.meta.id);
      if (!wasRendered) outboundMessages.push(...(nextEpisode.initialMessages || []));
    }
  }

  const activatedMessages = await evaluateActivations({ reason: 'guided', collectMessages: true });
  outboundMessages.push(...activatedMessages);

  await deliverTopotinoMessages(outboundMessages);
  saveState();
  renderAll();
}

async function askAiFallback(text) {
  const activeEpisode = getActiveEpisode();
  if (!activeEpisode || activeEpisode.meta.ai?.enabled === false) {
    await deliverTopotinoMessages([{
      from: 'topotino',
      time: nowTime(),
      text: 'La señal tiembla un poco. Probad con una pista más concreta, agentes.'
    }]);
    saveState();
    renderAll();
    return;
  }

  const responsePromise = (async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        activeEpisodeId: activeEpisode.meta.id,
        activeEpisodeTitle: activeEpisode.meta.title,
        activeEpisodes: getUnlockedEpisodes().map((episode) => ({
          id: episode.meta.id,
          title: episode.meta.title,
          mission: episode.meta.mission,
          narrativeContext: episode.narrativeContext,
          aiContext: episode.aiContext
        })),
        runtime: getRuntimeContext(),
        flags: state.flags,
        waters: state.waters,
        formulaWords: state.formulaWords,
        recentMessages: state.messages.slice(-14)
      })
    });

    if (!response.ok) throw new Error('AI request failed');
    const data = await response.json();
    return [{
      from: 'topotino',
      time: nowTime(),
      text: data.reply || 'He recibido interferencias. Repetidlo más despacio, agentes.'
    }];
  })().catch(() => {
    const soft = activeEpisode && activeEpisode.softResponses.length
      ? nextSoftResponse(activeEpisode)
      : null;
    return [{
      from: 'topotino',
      time: nowTime(),
      text: soft || 'No tengo señal suficiente para consultar los túneles ahora mismo. El historial queda guardado; probad otra vez cuando vuelva internet.'
    }];
  });

  await deliverTopotinoMessages(responsePromise);
  saveState();
  renderAll();
}

function findGuidedResponse(text) {
  const normalized = normalizeText(text);
  const available = getUnlockedEpisodes().slice().reverse();

  for (const episode of available) {
    const response = (episode.guidedResponses || []).find((candidate) =>
      responseMatches(candidate, normalized)
    );
    if (response) return { episode, response };
  }

  return null;
}

function responseMatches(candidate, normalizedText) {
  const requiredFlags = candidate.requiredFlags || [];
  if (requiredFlags.length && !requiredFlags.every((flag) => state.flags.includes(flag))) {
    return false;
  }

  const rejected = candidate.rejectContainsAny || [];
  if (rejected.some((term) => normalizedText.includes(normalizeText(term)))) {
    return false;
  }

  if ((candidate.match || []).some((match) => normalizeText(match) === normalizedText)) {
    return true;
  }

  const words = normalizedText.split(' ').filter(Boolean);
  if (candidate.minWords && words.length < candidate.minWords) return false;
  if (candidate.minLength && normalizedText.length < candidate.minLength) return false;

  const containsAll = candidate.containsAll || [];
  if (containsAll.length && !containsAll.every((term) => normalizedText.includes(normalizeText(term)))) {
    return false;
  }

  const containsAny = candidate.containsAny || [];
  if (containsAny.length) {
    return containsAny.some((term) => normalizedText.includes(normalizeText(term)));
  }

  if (containsAll.length) return true;

  return Boolean(candidate.openAnswer);
}

function nextSoftResponse(episode) {
  const key = episode.meta.id;
  const cursor = state.softResponseCursor[key] || 0;
  const response = episode.softResponses[cursor % episode.softResponses.length];
  state.softResponseCursor[key] = cursor + 1;
  return response;
}

function nextProgressiveHint() {
  const activeEpisode = getActiveEpisode();
  const hints = activeEpisode?.progressiveHints || [];
  if (!hints.length) return null;

  const key = activeEpisode.meta.id;
  const misses = (state.hintMissCursor[key] || 0) + 1;
  state.hintMissCursor[key] = misses;

  if (misses < 3) return null;
  return hints[(misses - 3) % hints.length];
}

function shouldWarnAboutChatter(text) {
  const now = Date.now();
  if (now - state.lastChatterWarningAt < CHATTER_WARNING_COOLDOWN_MS) return false;

  if (text.length >= CHATTER_LIMIT_CHARS) return true;

  const recentUserMessages = state.messages.filter((message) =>
    message.from === 'user' &&
    typeof message.createdAt === 'number' &&
    now - message.createdAt <= CHATTER_WINDOW_MS
  );

  return recentUserMessages.length >= CHATTER_LIMIT_MESSAGES;
}

function nextChatterWarning() {
  const response = CHATTER_WARNINGS[state.chatterWarningCursor % CHATTER_WARNINGS.length];
  state.chatterWarningCursor += 1;
  state.lastChatterWarningAt = Date.now();
  return response;
}

async function deliverTopotinoMessages(messagesOrPromise, options = {}) {
  setBusy(true, false);

  try {
    const messagesPromise = Promise.resolve(messagesOrPromise);
    const timing = getReplyTiming(options.mode);
    await wait(randomInt(timing.silenceMin, timing.silenceMax));
    setBusy(true, true);

    const [messages] = await Promise.all([
      messagesPromise,
      wait(randomInt(timing.typingMin, timing.typingMax))
    ]);

    const normalizedMessages = Array.isArray(messages) ? messages.filter(Boolean) : [];
    for (let index = 0; index < normalizedMessages.length; index += 1) {
      appendMessage(normalizedMessages[index]);
      saveState();
      renderAll();
      if (index < normalizedMessages.length - 1) {
        setBusy(true, false);
        await wait(randomInt(timing.staggerMin, timing.staggerMax));
        setBusy(true, true);
        await wait(randomInt(timing.nextTypingMin, timing.nextTypingMax));
      }
    }
  } finally {
    setBusy(false, false);
  }
}

function getReplyTiming(mode) {
  if (params.get('fastReply') === '1') {
    return {
      silenceMin: 250,
      silenceMax: 600,
      typingMin: 300,
      typingMax: 700,
      staggerMin: 80,
      staggerMax: 180,
      nextTypingMin: 140,
      nextTypingMax: 360
    };
  }

  if (mode === 'activation') {
    return {
      silenceMin: ACTIVATION_SILENCE_MIN_MS,
      silenceMax: ACTIVATION_SILENCE_MAX_MS,
      typingMin: ACTIVATION_TYPING_MIN_MS,
      typingMax: ACTIVATION_TYPING_MAX_MS,
      staggerMin: REPLY_STAGGER_MIN_MS,
      staggerMax: REPLY_STAGGER_MAX_MS,
      nextTypingMin: ACTIVATION_TYPING_MIN_MS,
      nextTypingMax: ACTIVATION_TYPING_MAX_MS
    };
  }

  return {
    silenceMin: REPLY_SILENCE_MIN_MS,
    silenceMax: REPLY_SILENCE_MAX_MS,
    typingMin: REPLY_TYPING_VISIBLE_MIN_MS,
    typingMax: REPLY_TYPING_VISIBLE_MAX_MS,
    staggerMin: REPLY_STAGGER_MIN_MS,
    staggerMax: REPLY_STAGGER_MAX_MS,
    nextTypingMin: REPLY_NEXT_TYPING_VISIBLE_MIN_MS,
    nextTypingMax: REPLY_NEXT_TYPING_VISIBLE_MAX_MS
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function refreshLocation() {
  if (!navigator.geolocation) {
    state.locationStatus = 'Este navegador no permite actualizar ubicación.';
    renderProgress();
    return;
  }

  els.locationButton.disabled = true;
  state.locationStatus = 'Buscando señal de posición...';
  renderProgress();

  try {
    const position = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000
    });
    state.lastKnownPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: Math.round(position.coords.accuracy || 0),
      capturedAt: new Date().toISOString(),
      source: 'device'
    };
    state.locationStatus = `Señal actualizada (${state.lastKnownPosition.accuracy || '?'} m).`;
    const activationMessages = await evaluateActivations({ reason: 'location', collectMessages: true });
    saveState();
    if (activationMessages.length) {
      await deliverTopotinoMessages(activationMessages, { mode: 'activation' });
    }
  } catch (error) {
    state.locationStatus = locationErrorMessage(error);
  } finally {
    els.locationButton.disabled = false;
    renderAll();
  }
}

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function renderAll() {
  renderMessages();
  renderProgress();
  renderAdultPanel();
}

function renderMessages() {
  els.messages.innerHTML = '';
  const fragment = document.createDocumentFragment();
  let lastDateKey = '';

  state.messages.forEach((message) => {
    const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
    const dateKey = formatDate(messageDate);
    if (dateKey !== lastDateKey) {
      const separator = document.createElement('div');
      separator.className = 'date-separator';
      separator.textContent = formatChatDate(messageDate);
      fragment.appendChild(separator);
      lastDateKey = dateKey;
    }

    const row = document.createElement('article');
    row.className = `message-row ${message.from === 'user' ? 'user' : 'topotino'}`;

    if (message.from !== 'user') {
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.innerHTML = `<img src="${TOPOTINO_IMAGE}" alt="Topotino" onerror="this.style.display='none'">`;
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const text = document.createElement('div');
    text.className = 'message-text';
    text.textContent = message.text;
    bubble.appendChild(text);

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = `${formatMessageTime(message)} ${message.from === 'user' ? '✓✓' : '▣'}`;
    bubble.appendChild(meta);

    row.appendChild(bubble);
    fragment.appendChild(row);
  });

  els.messages.appendChild(fragment);
  els.messages.scrollTop = els.messages.scrollHeight;
}

function renderProgress() {
  const activeEpisode = getActiveEpisode();
  const meta = activeEpisode ? activeEpisode.meta : {};
  els.channelCode.textContent = meta.channelCode || 'T-12A7';
  els.missionActive.textContent = meta.mission || meta.title || 'Reconexión';
  els.watersCount.textContent = `${state.waters.length}/12`;
  els.locationStatus.textContent = state.locationStatus;
  els.formulaDisplay.textContent = FORMULA_WORDS
    .map((word) => state.formulaWords.includes(word) ? FORMULA_LABELS[word] : '???')
    .join(', ');

  els.watersList.innerHTML = '';
  state.waters.forEach((water) => {
    const pill = document.createElement('span');
    pill.className = 'water-pill';
    pill.textContent = water;
    els.watersList.appendChild(pill);
  });
}

async function fetchEpisode(file) {
  const response = await fetch(file);
  if (!response.ok) throw new Error(`Could not load episode ${file}`);
  const markdown = await response.text();
  return parseEpisode(markdown);
}

function parseEpisode(markdown) {
  const frontmatterMatch = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (!frontmatterMatch) throw new Error('Episode missing frontmatter');
  const meta = JSON.parse(frontmatterMatch[1]);
  const body = markdown.slice(frontmatterMatch[0].length);

  return {
    meta,
    narrativeContext: sectionText(body, 'Contexto narrativo'),
    aiContext: sectionText(body, 'Contexto para IA'),
    initialMessages: sectionJson(body, 'Mensajes iniciales', []),
    guidedResponses: sectionJson(body, 'Respuestas guiadas', []),
    softResponses: sectionJson(body, 'Respuestas suaves si fallan', []),
    progressiveHints: sectionJson(body, 'Pistas progresivas', [])
  };
}

function sectionText(markdown, heading) {
  const start = markdown.indexOf(`## ${heading}`);
  if (start === -1) return '';
  const afterHeading = markdown.slice(start).replace(/^## .+\n?/, '');
  const next = afterHeading.search(/\n## /);
  const raw = next === -1 ? afterHeading : afterHeading.slice(0, next);
  return raw.replace(/```json[\s\S]*?```/g, '').trim();
}

function sectionJson(markdown, heading, fallback) {
  const start = markdown.indexOf(`## ${heading}`);
  if (start === -1) return fallback;
  const afterHeading = markdown.slice(start);
  const match = afterHeading.match(/```json\s*([\s\S]*?)\s*```/);
  if (!match) return fallback;
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    console.warn(`Invalid JSON in ${heading}`, error);
    return fallback;
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
}

function appendMessages(messages) {
  messages.forEach((message) => appendMessage(message));
}

function appendMessage(message) {
  const createdAt = message.createdAt || Date.now();
  state.messages.push({
    from: message.from || 'topotino',
    time: formatRealTime(new Date(createdAt)),
    text: message.text || '',
    createdAt
  });
}

function getEpisode(episodeId) {
  return episodes.find((episode) => episode.meta.id === episodeId);
}

function getActiveEpisode() {
  const unlocked = getUnlockedEpisodes();
  return getEpisode(state.activeEpisodeId) || unlocked[unlocked.length - 1] || episodes[0];
}

function getUnlockedEpisodes() {
  return episodes.filter((episode) => isEpisodeUnlocked(episode.meta.id));
}

function isEpisodeUnlocked(episodeId) {
  return state.unlockedEpisodeIds.includes(episodeId);
}

function addWater(water) {
  if (!state.waters.includes(water)) state.waters.push(water);
}

function addFormulaWord(word) {
  const normalized = normalizeFormulaWord(word);
  if (!state.formulaWords.includes(normalized)) state.formulaWords.push(normalized);
}

function setSimulatedLocation(location) {
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  state.lastKnownPosition = {
    lat,
    lng,
    accuracy: Number(location.accuracy) || 1,
    capturedAt: new Date().toISOString(),
    source: location.source || 'chat-simulation'
  };
  state.locationStatus = location.label
    ? `Señal simulada: ${location.label}.`
    : `Señal simulada: ${lat.toFixed(5)}, ${lng.toFixed(5)}.`;
}

function setSimulatedRuntime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return;
  state.runtimeNowOverride = date.toISOString();
}

function clearSimulatedRuntime() {
  state.runtimeNowOverride = null;
}

function addUniqueMany(target, values) {
  values.forEach((value) => {
    if (!target.includes(value)) target.push(value);
  });
}

function dateMatches(rule, now) {
  const current = formatDate(now);
  if (rule.on) return current === rule.on;
  if (rule.from && current < rule.from) return false;
  if (rule.to && current > rule.to) return false;
  return true;
}

function timeMatches(rule, now) {
  const current = formatTime(now);
  if (rule.from && rule.to && rule.from > rule.to) {
    return current >= rule.from || current <= rule.to;
  }
  if (rule.from && current < rule.from) return false;
  if (rule.to && current > rule.to) return false;
  return true;
}

function locationMatches(rule) {
  const pos = state.lastKnownPosition;
  if (!pos || typeof pos.lat !== 'number' || typeof pos.lng !== 'number') return false;
  const distance = haversineDistanceMeters(pos.lat, pos.lng, rule.lat, rule.lng);
  return distance <= (rule.radiusMeters || 300);
}

function getRuntimeContext() {
  const now = getRuntimeNow();
  return {
    nowIso: now.toISOString(),
    date: formatDate(now),
    time: formatTime(now),
    position: state.lastKnownPosition,
    locationStatus: state.locationStatus
  };
}

function getRuntimeNow() {
  const override = params.get('testNow');
  if (override) {
    const date = new Date(override);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (state.runtimeNowOverride) {
    const date = new Date(state.runtimeNowOverride);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatChatDate(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (formatDate(date) === formatDate(today)) return 'Hoy';
  if (formatDate(date) === formatDate(yesterday)) return 'Ayer';

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }).format(date);
}

function formatDateTime(date) {
  if (Number.isNaN(date.getTime())) return 'pendiente';
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatRealTime(date) {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatMessageTime(message) {
  if (message.createdAt) {
    const date = new Date(message.createdAt);
    if (!Number.isNaN(date.getTime())) return formatRealTime(date);
  }
  return message.time || nowTime();
}

function haversineDistanceMeters(lat1, lng1, lat2, lng2) {
  const toRad = (n) => (n * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function locationErrorMessage(error) {
  if (error && error.code === 1) return 'Permiso de ubicación denegado.';
  if (error && error.code === 2) return 'No se pudo calcular la ubicación.';
  if (error && error.code === 3) return 'La búsqueda de ubicación tardó demasiado.';
  return 'No se pudo actualizar la señal de posición.';
}

function normalizeFormulaWord(word) {
  return normalizeText(word).replace(/\s+/g, ' ').toUpperCase();
}

function normalizeText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function nowTime() {
  return formatRealTime(new Date());
}

function setBusy(nextBusy, showTyping = nextBusy) {
  busy = nextBusy;
  if (showTyping && els.typingText) {
    els.typingText.textContent = nextTypingMessage();
  }
  els.typing.hidden = !showTyping;
  els.sendButton.disabled = nextBusy;
  els.chatInput.disabled = nextBusy;
}

function nextTypingMessage() {
  const message = TYPING_MESSAGES[state.typingMessageCursor % TYPING_MESSAGES.length];
  state.typingMessageCursor += 1;
  return message;
}

function showUnlockError(text) {
  els.unlockError.textContent = text;
  els.unlockError.hidden = false;
}

function setupAdultPanel() {
  if (!els.adultPanel) return;
  els.adultPanel.hidden = !isAdultMode;
  renderAdultPanel();
  if (isAdultMode && state.unlocked) {
    scheduleStateSync();
  }
}

function renderAdultPanel() {
  if (!isAdultMode || !els.adultPanel) return;

  els.adultRecoveryCode.textContent = state.recoveryCode || 'Sin crear';
  els.adultSyncStatus.textContent = adultSyncLabel();
  els.adultLastSync.textContent = state.lastSyncedAt
    ? `Última copia: ${formatDateTime(new Date(state.lastSyncedAt))}`
    : 'Última copia: pendiente';
}

function adultSyncLabel() {
  if (state.syncStatus === 'synced') return 'Copia segura';
  if (state.syncStatus === 'syncing') return 'Sincronizando...';
  if (state.syncStatus === 'pending') return 'Pendiente de copia';
  if (state.syncStatus === 'offline') return 'Solo local';
  return 'Copia local';
}

async function copyRecoveryCode() {
  if (!state.recoveryCode) {
    showAdultMessage('Aún no hay código. Pulsa sincronizar cuando el canal esté abierto.');
    return;
  }
  try {
    await navigator.clipboard.writeText(state.recoveryCode);
    showAdultMessage('Código copiado.');
  } catch (error) {
    showAdultMessage('No se pudo copiar automáticamente.');
  }
}

async function restoreFromAdultCode() {
  try {
    await restoreFromRecoveryCode(els.adultRestoreCode.value);
    await enterChat();
    showAdultMessage('Conversación restaurada.');
  } catch (error) {
    showAdultMessage(friendlySyncError(error));
  }
}

function exportAdultBackup() {
  const backup = {
    exportedAt: new Date().toISOString(),
    app: 'topotino-comunicador',
    version: 1,
    state: buildLocalState()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `topotino-backup-${formatDate(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showAdultMessage('Backup exportado.');
}

async function importAdultBackup(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;

  try {
    const text = await file.text();
    const backup = JSON.parse(text);
    const importedState = backup.state || backup;
    applyRestoredState(importedState, importedState.recoveryCode || state.recoveryCode);
    state.unlocked = true;
    saveState({ sync: false });
    await enterChat();
    scheduleStateSync();
    showAdultMessage('Backup importado en este móvil.');
  } catch (error) {
    showAdultMessage('No se pudo importar ese JSON.');
  }
}

function clearLocalAdultState() {
  const confirmed = window.confirm('Esto borra solo los datos de este móvil. Conserva el código de recuperación antes de hacerlo.');
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEYS.auth);
  localStorage.removeItem(STORAGE_KEYS.state);
  localStorage.removeItem(LEGACY_STATE_KEY);
  window.location.href = `${window.location.pathname}?adult=1`;
}

function showAdultMessage(text) {
  if (!els.adultMessage) return;
  els.adultMessage.textContent = text || '';
}

function buildLocalState() {
  return {
    activeEpisodeId: state.activeEpisodeId,
    unlockedEpisodeIds: state.unlockedEpisodeIds,
    renderedEpisodes: state.renderedEpisodes,
    messages: state.messages,
    flags: state.flags,
    waters: state.waters,
    formulaWords: state.formulaWords,
    softResponseCursor: state.softResponseCursor,
    hintMissCursor: state.hintMissCursor,
    chatterWarningCursor: state.chatterWarningCursor,
    lastChatterWarningAt: state.lastChatterWarningAt,
    typingMessageCursor: state.typingMessageCursor,
    runtimeNowOverride: state.runtimeNowOverride,
    lastKnownPosition: state.lastKnownPosition,
    locationStatus: state.locationStatus,
    channelId: state.channelId,
    recoveryCode: state.recoveryCode,
    revision: state.revision,
    lastSyncedAt: state.lastSyncedAt,
    syncStatus: state.syncStatus,
    syncError: state.syncError
  };
}

function buildRemoteState() {
  const remote = buildLocalState();
  delete remote.recoveryCode;
  delete remote.syncStatus;
  delete remote.syncError;
  return remote;
}

function applyRestoredState(remoteState, recoveryCode) {
  Object.assign(state, {
    activeEpisodeId: remoteState.activeEpisodeId || state.activeEpisodeId,
    unlockedEpisodeIds: remoteState.unlockedEpisodeIds || [],
    renderedEpisodes: remoteState.renderedEpisodes || [],
    messages: remoteState.messages || [],
    flags: remoteState.flags || [],
    waters: remoteState.waters || [],
    formulaWords: (remoteState.formulaWords || []).map(normalizeFormulaWord),
    softResponseCursor: remoteState.softResponseCursor || {},
    chatterWarningCursor: remoteState.chatterWarningCursor || 0,
    lastChatterWarningAt: remoteState.lastChatterWarningAt || 0,
    typingMessageCursor: remoteState.typingMessageCursor || 0,
    runtimeNowOverride: remoteState.runtimeNowOverride || null,
    lastKnownPosition: remoteState.lastKnownPosition || null,
    locationStatus: remoteState.locationStatus || 'Sin posición actualizada.',
    channelId: remoteState.channelId || state.channelId,
    recoveryCode: recoveryCode || state.recoveryCode,
    revision: Number(remoteState.revision) || state.revision,
    lastSyncedAt: remoteState.lastSyncedAt || state.lastSyncedAt,
    syncStatus: 'synced',
    syncError: null
  });
}

function markStateChanged() {
  state.revision = (Number(state.revision) || 0) + 1;
  state.syncStatus = state.channelId ? 'pending' : 'local';
  state.syncError = null;
}

function scheduleStateSync() {
  if (!state.unlocked) return;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => syncStateNow(), SYNC_DEBOUNCE_MS);
}

async function ensureBackupChannel() {
  if (!state.unlocked || state.channelId || state.recoveryCode) return;
  try {
    const data = await callStateApi({
      action: 'init',
      state: buildRemoteState(),
      revision: Math.max(1, Number(state.revision) || 1)
    });
    state.channelId = data.channelId;
    state.recoveryCode = data.recoveryCode;
    state.revision = Number(data.revision) || state.revision || 1;
    state.lastSyncedAt = data.updatedAt || new Date().toISOString();
    state.syncStatus = 'synced';
    state.syncError = null;
    saveState({ sync: false });
    renderAdultPanel();
  } catch (error) {
    state.syncStatus = 'local';
    state.syncError = friendlySyncError(error);
    saveState({ sync: false });
    renderAdultPanel();
  }
}

async function syncStateNow({ force = false } = {}) {
  if (syncInFlight) return;
  if (!state.unlocked) return;

  syncInFlight = true;
  try {
    if (!state.channelId || !state.recoveryCode) {
      await ensureBackupChannel();
      showAdultMessage(state.channelId ? 'Canal seguro creado.' : state.syncError);
      return;
    }

    if (!force && state.syncStatus === 'synced') return;

    state.syncStatus = 'syncing';
    renderAdultPanel();
    const data = await callStateApi({
      action: 'sync',
      channelId: state.channelId,
      recoveryCode: state.recoveryCode,
      state: buildRemoteState(),
      revision: Number(state.revision) || 1
    });
    state.revision = Number(data.revision) || state.revision;
    state.lastSyncedAt = data.updatedAt || new Date().toISOString();
    state.syncStatus = 'synced';
    state.syncError = null;
    saveState({ sync: false });
    showAdultMessage('Copia segura actualizada.');
  } catch (error) {
    if (error.status === 409 && error.data?.remote?.state) {
      applyRestoredState({
        ...error.data.remote.state,
        channelId: error.data.remote.channelId,
        revision: error.data.remote.revision,
        lastSyncedAt: error.data.remote.updatedAt
      }, state.recoveryCode);
      saveState({ sync: false });
      renderAll();
      showAdultMessage('Se restauró la copia más reciente.');
    } else {
      state.syncStatus = 'offline';
      state.syncError = friendlySyncError(error);
      saveState({ sync: false });
      showAdultMessage(state.syncError);
    }
  } finally {
    syncInFlight = false;
    renderAdultPanel();
  }
}

async function restoreFromRecoveryCode(recoveryCode) {
  const code = normalizeRecoveryCode(recoveryCode);
  if (!code) throw new Error('Código vacío.');
  const data = await callStateApi({ action: 'restore', recoveryCode: code });
  applyRestoredState({
    ...data.state,
    channelId: data.channelId,
    revision: data.revision,
    lastSyncedAt: data.updatedAt
  }, code);
  state.unlocked = true;
  localStorage.setItem(STORAGE_KEYS.auth, '1');
  saveState({ sync: false });
  renderAll();
}

async function callStateApi(payload) {
  const response = await fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'State API error');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function friendlySyncError(error) {
  if (error.status === 503) return 'Copia segura pendiente: falta configurar Redis en Vercel.';
  if (error.status === 404) return 'No encuentro ese código de recuperación.';
  if (error.status === 403) return 'Ese código no abre este canal.';
  return 'Sin copia segura ahora mismo. El móvil conserva la conversación.';
}

function normalizeRecoveryCode(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

function saveState(options = {}) {
  try {
    if (options.sync !== false) {
      markStateChanged();
    }
    localStorage.setItem(STORAGE_KEYS.auth, state.unlocked ? '1' : '0');
    localStorage.setItem(STORAGE_KEYS.state, JSON.stringify(buildLocalState()));
    if (options.sync !== false) {
      scheduleStateSync();
    }
  } catch (error) {
    console.warn('Could not save state', error);
  }
}

function loadState() {
  try {
    if (params.get('reset') === '1') {
      if (isAdultMode && params.get('confirmReset') === '1') {
        localStorage.removeItem(STORAGE_KEYS.auth);
        localStorage.removeItem(STORAGE_KEYS.state);
        localStorage.removeItem(LEGACY_STATE_KEY);
      }
      params.delete('reset');
      params.delete('confirmReset');
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', nextUrl);
    }

    state.unlocked = localStorage.getItem(STORAGE_KEYS.auth) === '1';
    const raw = localStorage.getItem(STORAGE_KEYS.state) || localStorage.getItem(LEGACY_STATE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    const fallbackUnlocked = saved.unlockedEpisodeIds || [saved.activeEpisodeId || state.activeEpisodeId].filter(Boolean);
    Object.assign(state, {
      activeEpisodeId: saved.activeEpisodeId || state.activeEpisodeId,
      unlockedEpisodeIds: fallbackUnlocked,
      renderedEpisodes: saved.renderedEpisodes || [],
      messages: saved.messages || [],
      flags: saved.flags || [],
      waters: saved.waters || [],
      formulaWords: (saved.formulaWords || []).map(normalizeFormulaWord),
      softResponseCursor: saved.softResponseCursor || {},
      hintMissCursor: saved.hintMissCursor || {},
      chatterWarningCursor: saved.chatterWarningCursor || 0,
      lastChatterWarningAt: saved.lastChatterWarningAt || 0,
      typingMessageCursor: saved.typingMessageCursor || 0,
      runtimeNowOverride: saved.runtimeNowOverride || null,
      lastKnownPosition: saved.lastKnownPosition || state.lastKnownPosition,
      locationStatus: saved.locationStatus || state.locationStatus,
      channelId: saved.channelId || null,
      recoveryCode: saved.recoveryCode || null,
      revision: Number(saved.revision) || 0,
      lastSyncedAt: saved.lastSyncedAt || null,
      syncStatus: saved.syncStatus || 'local',
      syncError: saved.syncError || null
    });
  } catch (error) {
    console.warn('Could not load state', error);
  }
}

function applyTestingParams() {
  const testLat = Number(params.get('testLat'));
  const testLng = Number(params.get('testLng'));
  if (Number.isFinite(testLat) && Number.isFinite(testLng)) {
    state.lastKnownPosition = {
      lat: testLat,
      lng: testLng,
      accuracy: 1,
      capturedAt: new Date().toISOString(),
      source: 'test-url'
    };
    state.locationStatus = `Señal simulada: ${testLat.toFixed(5)}, ${testLng.toFixed(5)}.`;
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}
