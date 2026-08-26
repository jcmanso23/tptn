import { splitTopotinoMessages } from './chat-format.js?v=memory-v69';
import { CHALLENGE_PACKS, displayChallengeOptions } from './content/challenges.js?v=memory-v69';

const STORAGE_KEYS = {
  auth: 'topotino_chat_auth_v1',
  state: 'topotino_chat_state_v2'
};

const LEGACY_STATE_KEY = 'topotino_chat_state_v1';
const APP_VERSION_CODE = 'T-26A0';
const PASSPHRASE_HASH = 'a64716bd9f4e8added1bf47f80b97c3fc7b70a15b8043cdab083e1ddf85f3794';
const EPISODES_MANIFEST = 'content/episodes.json?v=memory-v69';
const LIVE_STORY_ENDPOINT = '/api/story';
const AMARANTE_TRAVEL_DATE = '2026-08-13';
const AMARANTE_ROUTE_EPISODE_ID = '004b-rumbo-amarante';
const AMARANTE_EPISODE_ID = '005-amarante-puente';
const AMARANTE_RESCUE_MARKER = 'rescate-cierre-amarante-t19b5';
const SECURITY_CHECKIN_DATE = '2026-08-14';
const SECURITY_ANNOUNCED_FLAG = 'seguridad_t20a1_anunciada';
const SECURITY_CONFIRMED_FLAG = 'seguridad_t20a1_confirmada';
const MACHINE_CLARIFIED_FLAG = 'maquina_topotina_aclarada_t20a5';
const OBIDOS_RESCUE_DATE = '2026-08-16';
const OBIDOS_EPISODE_ID = '008-huellas-mira-obidos';
const OBIDOS_RESCUE_MARKER = 'rescate-llegada-obidos-t21a1';
const OBIDOS_ARRIVAL_MARKER = 'llegada-obidos-expedicion-t20a6';
const LISBON_RESCUE_DATE = '2026-08-17';
const LISBON_RESCUE_MARKER = 'rescate-llegada-lisboa-t21a3';
const LISBON_RESCUE_EPISODE_ID = '009-dinoparque-lisboa';
const LISBON_RESCUE_LOCATION = { lat: 38.7223, lng: -9.1393, radiusMeters: 18000 };
const DAY18_MACHINE_EPISODE_ID = '010-lisboa-ciencia-oceanario';
const TOPOLOCO_SCENE_ID = 'topoloco-toma-canal-2026-08-20';
const TOPOLOCO_SCENE_DATE = '2026-08-20';
const TOPOLOCO_RECOVERY_DATE = '2026-08-21';
const TOPOLOCO_SCENE_EPISODE_ID = '012-badoca-lagos';
const TOPOLOCO_ROUTE_FLAG = 'lagos_descubierto_por_louri';
const TOPOLOCO_RECOVERED_FLAG = 'canal_recuperado_dia21';
const TOPOLOCO_RECOVERY_TECLA_FLAG = 'recuperacion_tecla_dia21_t21a8';
const DAY21_EPISODE_ID = '013-delfines-benagil-sagres';
const TECLA_SCENE_HOUR = 16;
const TECLA_SCENE_TURNS = 3;
const DEFAULT_FINAL_ROUTE = 'sevilla-night';
const DAY22_FINALE_MIGRATION_FLAG = 'migracion_final_sevilla_t22a0';
const DAY22_EPISODE_ID = '014-piedade-algar-jaima';
const FINAL_EPISODE_ID = '017-isla-magica';
const RETIRED_FINAL_EPISODE_IDS = new Set(['018-sevilla-alhambra-noche', '019-epilogo-generalife']);
const EARLY_SEVILLA_FINAL_FLAG = 'final_sevilla_adelantado';
const ZOOMARINE_TRANSITION_RESCUE_MARKER = 'rescate-transicion-zoomarine-t22a1';
const FINALE_CLARITY_MIGRATION_FLAG = 'migracion-final-claro-t24a0';
const SEVILLA_CARD_RESCUE_MARKER = 'rescate-tarjeta-sevilla-t24a2';
const SANTA_CRUZ_RETREAT_RESCUE_MARKER = 'rescate-retirada-santa-cruz-t25a0';
const FINALE_POLISH_MIGRATION_MARKER = 'migracion-final-cuatro-cierres-t25a1';
const FINALE_FLEXIBLE_ROUTE_MIGRATION_MARKER = 'migracion-isla-ruta-flexible-t25a2';
const FINALE_SILENCE_RESCUE_MARKER = 'rescate-silencio-isla-t25a3';
const DAY26_EPILOGUE_MARKER = 'epilogo-viaje-t26a0';
const DAY26_EPILOGUE_DATE = '2026-08-26';
const AI_REQUEST_TIMEOUT_MS = 18000;
const SECURITY_CHECKIN_MESSAGES = [
  'Buenos días, Paula y Hugo.',
  'Antes de seguir tengo que contaros algo. Ayer el chat secreto estaba estropeado: llegaban mensajes tarde, se mezclaban y yo respondía a cosas anteriores.',
  'He revisado el canal. Parece que Topoloco ha encontrado nuestra frecuencia y estuvo intentando entrar.',
  'Creo que he mejorado la seguridad. También he instalado un contador de Sombra: si sube, puede significar que Topoloco vuelve a acercarse al chat.',
  'No sé si funcionará. Vamos a probarlo.',
  '¿Me recibís los dos? Contestadme con cualquier cosa. No empezaré hasta comprobar que este mensaje os ha llegado entero.'
];
const SECURITY_CHECKIN_CHALLENGE = {
  id: 'seguridad-t20a1-checkin',
  kind: 'check-in',
  place: 'Comprobación del canal'
};
const STALE_LUANCO_EPISODE_IDS = new Set([
  '002-luanco-llegada',
  '003-luanco-agua-norte'
]);
const ACTIVATION_TICK_MS = 60000;
const LOCATION_REFRESH_COOLDOWN_MS = 2 * 60 * 1000;
const MAX_STORY_MEMORY_ITEMS = 60;
const ADULT_PHASE_DELAY_MS = 5 * 60 * 1000;
const ADULT_PIN_HASH = '0f8eb4b72b6e0c9e88b388eb967b49e067ef1004bf07bffc22c3acb13b43580a';
const ADULT_SESSION_KEY = 'topotino_adult_unlocked_v1';
const TOPOTINO_IMAGE = 'images/topotino.png?v=marco-v1';
const CHAT_SENDERS = {
  topotino: { name: 'Topotino', image: TOPOTINO_IMAGE },
  topotina: { name: 'Topotina', image: 'images/topotina.png?v=topotina-v1' },
  gotas: { name: 'Gotas', image: 'images/gotas.jpg?v=gotas-v1' },
  louri: { name: 'Louri', image: 'images/louri.jpg?v=louri-v1' },
  topoloco: { name: 'Doctor Topoloco', image: 'images/topoloco.jpg?v=topoloco-v1' },
  doctora_tecla: { name: 'Doctora Tecla', image: 'images/doctora-tecla.jpg?v=tecla-v1' },
  vasco: { name: 'Vasco', initial: 'V' },
  corvinho: { name: 'Corvinho', initial: 'C' },
  capitan_pico: { name: 'Capitán Pico', image: 'images/capitan-pico.jpg?v=capitan-pico-v1' },
  america: { name: 'América', image: 'images/america.png?v=america-v1' },
  krim: { name: 'Krim', initial: 'K' }
};
const EPISODE_AI_SPEAKERS = Object.freeze({
  '006-magikland-curia': ['topotina'],
  '007-bucaco-coimbra-batalha-fatima': ['topotina'],
  '008-huellas-mira-obidos': ['topotina', 'gotas'],
  '009-dinoparque-lisboa': ['topotina', 'louri'],
  '010-lisboa-ciencia-oceanario': ['topotina', 'vasco'],
  '011-lisboa-historia-belem': ['topotina', 'vasco'],
  '012-badoca-lagos': ['topotina', 'topoloco'],
  '013-delfines-benagil-sagres': ['topotina', 'vasco'],
  '014-piedade-algar-jaima': ['topotina', 'vasco'],
  '015-zoomarine': ['topotina', 'gotas', 'vasco'],
  '016-tavira-sevilla': ['topotina', 'louri', 'doctora_tecla', 'topoloco'],
  '017-isla-magica': ['topotina', 'capitan_pico', 'america', 'topoloco']
});
const CHATTER_LIMIT_CHARS = 500;
const CHATTER_LIMIT_MESSAGES = 8;
const CHATTER_WINDOW_MS = 60 * 1000;
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
const ACTIVATION_SILENCE_MIN_MS = 2000;
const ACTIVATION_SILENCE_MAX_MS = 8000;
const ACTIVATION_TYPING_MIN_MS = 2500;
const ACTIVATION_TYPING_MAX_MS = 6500;
const LONG_REPLY_CHANCE = 0.06;
const LONG_REPLY_MIN_MS = 60000;
const LONG_REPLY_MAX_MS = 120000;
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
  storyMemory: [],
  completedChallengeIds: [],
  challengeAttempts: {},
  challengeWrongOptions: {},
  memoryScore: 0,
  shadowScore: 0,
  recoveredShadow: 0,
  endingVariant: null,
  finalRoute: DEFAULT_FINAL_ROUTE,
  finalRouteLocked: false,
  narrativeScene: null,
  softResponseCursor: {},
  hintMissCursor: {},
  chatterWarningCursor: 0,
  lastChatterWarningAt: 0,
  typingMessageCursor: 0,
  runtimeNowOverride: null,
  lastKnownPosition: null,
  locationStatus: 'Sin posición actualizada.',
  locationNoticeShown: false,
  scheduledAdultLaunches: [],
  seenBroadcastIds: [],
  channelId: null,
  recoveryCode: null,
  revision: 0,
  lastSyncedAt: null,
  syncStatus: 'local',
  syncError: null
};

let manifest = [];
let baseEpisodes = [];
let episodes = [];
let liveStoryVersion = null;
let busy = false;
let syncTimer = null;
let syncInFlight = false;
let activationInterval = null;
let adultLaunchTimer = null;
let locationRefreshInFlight = false;
let startupRescueMessages = [];
let startupEpiloguePending = false;
let challengePanelCollapsed = false;
let renderedChallengeId = null;
let activeConversationTurnId = null;
let narrativeSceneTimer = null;

const els = {};
const params = new URLSearchParams(window.location.search);
const isAdultMode = params.get('topoadulto') === '1' || params.get('adult') === '1';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindElements();
  bindEvents();
  registerServiceWorker();
  loadState();
  applyTestingParams();

  try {
    manifest = await fetchJson(EPISODES_MANIFEST);
    baseEpisodes = await Promise.all(manifest.map((item) => fetchEpisode(item.file)));
    episodes = baseEpisodes.slice().sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));
    await refreshLiveStory();
    applyDay22FinaleMigration();
    applyFinaleClarityMigration();
    applySevillaCardRescue();
    applySantaCruzRetreatRescue();
    applyFinalePolishMigration();
    applyFinaleFlexibleRouteMigration();
    applyFinaleSilenceRescue();
    applyDay26Epilogue();
    applyZoomarineTransitionRescue();
    applyTravelDayRescue();
    applyAmaranteCompletionRescue();
    applyDay14SecurityCheckIn();
    applyDay14MachineClarification();
    applyObidosArrivalRescue();
    initializeTopolocoScene();
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
  els.memoryScore = document.getElementById('memory-score');
  els.shadowScore = document.getElementById('shadow-score');
  els.challengePanel = document.getElementById('challenge-panel');
  els.progressToggle = document.getElementById('progress-toggle');
  els.progressBody = document.getElementById('progress-body');
  els.internalProgress = document.getElementById('internal-progress');
  els.locationButton = document.getElementById('location-refresh');
  els.locationStatus = document.getElementById('location-status');
  els.typingText = document.getElementById('typing-text');
  els.adultPanel = document.getElementById('adult-panel');
  els.adultLock = document.getElementById('adult-lock');
  els.adultTools = document.getElementById('adult-tools');
  els.adultPin = document.getElementById('adult-pin');
  els.adultUnlock = document.getElementById('adult-unlock');
  els.adultRecoveryCode = document.getElementById('adult-recovery-code');
  els.adultSyncStatus = document.getElementById('adult-sync-status');
  els.adultLastSync = document.getElementById('adult-last-sync');
  els.adultPhaseSelect = document.getElementById('adult-phase-select');
  els.adultSchedulePhase = document.getElementById('adult-schedule-phase');
  els.adultPhaseStatus = document.getElementById('adult-phase-status');
  els.adultFinalRoute = document.getElementById('adult-final-route');
  els.adultFinalRouteStatus = document.getElementById('adult-final-route-status');
  els.adultOpenFinal = document.getElementById('adult-open-final');
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
  window.addEventListener('focus', () => runActivationCheck('focus'));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') runActivationCheck('visible');
  });

  if (els.adultUnlock) els.adultUnlock.addEventListener('click', unlockAdultTools);
  if (els.adultPin) {
    els.adultPin.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') unlockAdultTools();
    });
  }
  if (els.adultCopy) els.adultCopy.addEventListener('click', copyRecoveryCode);
  if (els.adultSync) els.adultSync.addEventListener('click', () => syncStateNow({ force: true }));
  if (els.adultSchedulePhase) els.adultSchedulePhase.addEventListener('click', scheduleAdultPhaseLaunch);
  if (els.adultFinalRoute) els.adultFinalRoute.addEventListener('change', updateAdultFinalRoute);
  if (els.adultOpenFinal) els.adultOpenFinal.addEventListener('click', openSevillaFinalNow);
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
  initializeTopolocoScene();
  if (await runNarrativeScene()) {
    renderAll();
    scheduleNarrativeSceneTimer();
    window.setTimeout(() => syncStateNow({ force: state.syncStatus !== 'synced' }), 1000);
    return;
  }
  await refreshLocationForLisbonArrivalRescue();
  applyLisbonArrivalRescue();
  const securityPending = isSecurityCheckInPending();
  const routePending = !securityPending && getActiveChallenge()?.kind === 'destination' && !isDay18MachineActivationDue();
  const liveMessages = await refreshLiveStory({ collectBroadcasts: !securityPending && !routePending });
  if (!securityPending && !routePending) await refreshLocationForPendingActivations();
  const activationMessages = securityPending || routePending
    ? []
    : await evaluateActivations({ reason: 'enter', collectMessages: true });
  renderAll();
  const challengeArrivalMessages = collectChallengeArrivalMessages();
  if (!activationInterval) {
    activationInterval = setInterval(() => runActivationCheck('tick'), ACTIVATION_TICK_MS);
  }
  scheduleNextAdultLaunchTimer();
  const conversationMessages = collectStoryConversationPromptMessages();
  const incomingMessages = [...startupRescueMessages, ...liveMessages, ...activationMessages, ...challengeArrivalMessages, ...conversationMessages];
  startupRescueMessages = [];
  if (incomingMessages.length) {
    const deliveryMode = startupEpiloguePending ? 'epilogue' : 'activation';
    startupEpiloguePending = false;
    await deliverTopotinoMessages(incomingMessages, { mode: deliveryMode });
  }
  window.setTimeout(() => syncStateNow({ force: state.syncStatus !== 'synced' }), 1000);
  setTimeout(() => els.chatInput.focus(), 50);
}

async function runActivationCheck(reason) {
  applyDay26Epilogue();
  initializeTopolocoScene();
  if (await runNarrativeScene()) {
    renderAll();
    scheduleNarrativeSceneTimer();
    return;
  }
  await refreshLocationForLisbonArrivalRescue();
  applyLisbonArrivalRescue();
  const securityPending = isSecurityCheckInPending();
  const routePending = !securityPending && getActiveChallenge()?.kind === 'destination' && !isDay18MachineActivationDue();
  const liveMessages = await refreshLiveStory({ collectBroadcasts: !securityPending && !routePending });
  if (securityPending) return;
  if (routePending) return;
  await refreshLocationForPendingActivations();
  const activationMessages = await evaluateActivations({ reason, collectMessages: true });
  renderAll();
  const challengeArrivalMessages = collectChallengeArrivalMessages();
  const conversationMessages = collectStoryConversationPromptMessages();
  const rescueMessages = [...startupRescueMessages];
  startupRescueMessages = [];
  const incomingMessages = [...rescueMessages, ...liveMessages, ...activationMessages, ...challengeArrivalMessages, ...conversationMessages];
  if (incomingMessages.length) {
    const deliveryMode = startupEpiloguePending ? 'epilogue' : 'activation';
    startupEpiloguePending = false;
    await deliverTopotinoMessages(incomingMessages, { mode: deliveryMode });
  }
}

async function refreshLiveStory({ collectBroadcasts = false } = {}) {
  try {
    const response = await fetch(LIVE_STORY_ENDPOINT, { cache: 'no-store' });
    if (!response.ok) return [];
    const live = await response.json();

    if (liveStoryVersion !== Number(live.version || 0)) {
      mergeLiveEpisodes(live.episodes || []);
      liveStoryVersion = Number(live.version || 0);
      renderAdultPhaseLauncher();
    }

    if (!collectBroadcasts || !state.unlocked) return [];
    const unseen = (live.broadcasts || []).filter((broadcast) =>
      broadcast?.id &&
      broadcast?.text &&
      !state.seenBroadcastIds.includes(broadcast.id)
    );
    if (!unseen.length) return [];

    addUniqueMany(state.seenBroadcastIds, unseen.map((broadcast) => broadcast.id));
    saveState();
    return unseen.map((broadcast) => ({
      from: 'topotino',
      time: 'auto',
      text: broadcast.text
    }));
  } catch (error) {
    console.warn('Live story unavailable; using the published chapters.', error);
    return [];
  }
}

function mergeLiveEpisodes(overrides) {
  const merged = new Map(baseEpisodes.map((episode) => [episode.meta.id, episode]));

  overrides.forEach((override) => {
    if (!override?.id || !override?.markdown) return;
    try {
      const episode = parseEpisode(override.markdown);
      if (episode.meta.id !== override.id) return;
      merged.set(episode.meta.id, episode);
    } catch (error) {
      console.warn(`Invalid live episode ${override.id}`, error);
    }
  });

  episodes = [...merged.values()].sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));
}

function showScreen(name) {
  els.unlockScreen.classList.toggle('active', name === 'unlock');
  els.chatScreen.classList.toggle('active', name === 'chat');
}

function initializeTopolocoScene() {
  if (!state.unlocked) return;
  const today = formatDate(getRuntimeNow());
  if (today === TOPOLOCO_RECOVERY_DATE && !state.flags.includes(TOPOLOCO_RECOVERY_TECLA_FLAG)) {
    state.narrativeScene = {
      id: TOPOLOCO_SCENE_ID,
      stage: 'recovery-tecla',
      resumeAt: null,
      teclaStage: 'complete',
      teclaInteractionCount: Number(state.narrativeScene?.teclaInteractionCount) || 0
    };
    if (!state.unlockedEpisodeIds.includes(TOPOLOCO_SCENE_EPISODE_ID)) {
      state.unlockedEpisodeIds.push(TOPOLOCO_SCENE_EPISODE_ID);
    }
    if (!state.renderedEpisodes.includes(TOPOLOCO_SCENE_EPISODE_ID)) {
      state.renderedEpisodes.push(TOPOLOCO_SCENE_EPISODE_ID);
    }
    state.activeEpisodeId = TOPOLOCO_SCENE_EPISODE_ID;
    saveState();
    return;
  }
  if (state.flags.includes(TOPOLOCO_RECOVERED_FLAG)) return;
  if (state.narrativeScene?.id === TOPOLOCO_SCENE_ID) {
    let changed = false;
    if (!state.narrativeScene.teclaStage) {
      state.narrativeScene.teclaStage = 'pending';
      changed = true;
    }
    if (!Number.isFinite(Number(state.narrativeScene.teclaInteractionCount))) {
      state.narrativeScene.teclaInteractionCount = 0;
      changed = true;
    }
    if (changed) saveState();
    return;
  }
  if (today !== TOPOLOCO_SCENE_DATE && today !== TOPOLOCO_RECOVERY_DATE) return;

  state.narrativeScene = {
    id: TOPOLOCO_SCENE_ID,
    stage: today === TOPOLOCO_SCENE_DATE ? 'intro' : 'recovery-tecla',
    resumeAt: null,
    teclaStage: 'pending',
    teclaInteractionCount: 0
  };
  if (!state.unlockedEpisodeIds.includes(TOPOLOCO_SCENE_EPISODE_ID)) {
    state.unlockedEpisodeIds.push(TOPOLOCO_SCENE_EPISODE_ID);
  }
  if (!state.renderedEpisodes.includes(TOPOLOCO_SCENE_EPISODE_ID)) {
    state.renderedEpisodes.push(TOPOLOCO_SCENE_EPISODE_ID);
  }
  state.activeEpisodeId = TOPOLOCO_SCENE_EPISODE_ID;
  saveState();
}

function isTopolocoSceneActive() {
  const scene = state.narrativeScene;
  return scene?.id === TOPOLOCO_SCENE_ID && scene.stage !== 'complete';
}

function getTopolocoRouteChallenge() {
  if (state.narrativeScene?.stage !== 'route') return null;
  return {
    id: 'topoloco-ruta-lagos',
    kind: 'destination',
    place: 'Transmisión de emergencia de Louri',
    title: 'Encontrad el puerto',
    prompt: 'Buscad una ciudad costera del Algarve con marina. Desde allí salen barcos para observar delfines salvajes y cuevas marinas. ¿Cuál encaja?',
    options: [
      { id: 'faro', text: 'Faro' },
      { id: 'lagos', text: 'Lagos' },
      { id: 'porto', text: 'Porto' }
    ],
    correctOptionId: 'lagos',
    hint: 'Porto no está en el Algarve. La ciudad correcta tiene una marina junto a la bahía de Lagos.',
    successMessages: [],
    effects: { setFlags: [TOPOLOCO_ROUTE_FLAG] }
  };
}

async function runNarrativeScene() {
  if (!isTopolocoSceneActive()) return false;
  const scene = state.narrativeScene;
  const today = formatDate(getRuntimeNow());

  if (today >= TOPOLOCO_RECOVERY_DATE && !['recovery-tecla', 'complete'].includes(scene.stage)) {
    scene.stage = 'recovery-tecla';
    scene.resumeAt = null;
    saveState();
  }

  if (scene.stage === 'intro') {
    scene.stage = 'awaiting-children';
    saveState();
    await deliverTopotinoMessages([
      { from: 'system', text: '⚠ ALERTA: conexión no autorizada.' },
      { from: 'topoloco', text: '¡POR FIN!' },
      { from: 'topoloco', text: 'He entrado en vuestro ridículo chat secreto. Ya no podréis frustrar mis planes.' },
      { from: 'topotino', text: '¡¿QUIÉN HA ABIERTO ESA PUERTA?! ¡TOPOLOCO, FUERA DE MI CANAL!' },
      { from: 'topotina', text: 'Topotino, deja de pulsar botones. Cada golpe añade tres errores al diagnóstico.' },
      { from: 'topotino', text: '¡NO LOS GOLPEO! Los presiono con indignación técnica.' },
      { from: 'topoloco', text: 'Soy el DOCTOR Topoloco. Y estoy terminando el Corrector Definitivo de la Historia.' },
      { from: 'topoloco', text: 'Vuestras aventuras tendrán una versión perfecta: la versión en la que yo fui el inventor, el salvador y el héroe.' },
      { from: 'topotino', text: 'Eso no es corregir una historia. Es mentir con una bata puesta.' },
      { from: 'topotina', text: 'Paula, Hugo: decidle cualquier cosa. Necesito que siga hablando mientras busco por dónde ha entrado.' },
      { from: 'topotino', text: 'Sí. Distraedlo. Su tema favorito es él mismo; tenemos ventaja.' }
    ], { mode: 'scene' });
    return true;
  }

  if (scene.stage === 'waiting-louri' && Number(scene.resumeAt) <= Date.now()) {
    await revealLouriEmergency();
    return true;
  }

  if (
    scene.stage === 'takeover' &&
    scene.teclaStage === 'pending' &&
    today === TOPOLOCO_SCENE_DATE &&
    getRuntimeNow().getHours() >= TECLA_SCENE_HOUR
  ) {
    await startDoctoraTeclaScene();
    return true;
  }

  if (scene.stage === 'recovery-tecla') {
    scene.stage = 'complete';
    scene.resumeAt = null;
    addUniqueMany(state.flags, [
      TOPOLOCO_RECOVERED_FLAG,
      TOPOLOCO_RECOVERY_TECLA_FLAG,
      TOPOLOCO_ROUTE_FLAG,
      'completado_badoca_lagos',
      'louri_emergencia_cerrada'
    ]);
    addUniqueMany(state.completedChallengeIds, ['topoloco-ruta-lagos']);
    saveState();
    await deliverTopotinoMessages([
      { from: 'system', text: 'Acceso de mantenimiento detectado.' },
      { from: 'topotina', text: 'Estoy dentro. He seguido la firma que dejó el hackeo.' },
      { from: 'topoloco', text: '¡IMPOSIBLE! ¡Este canal está protegido por mi inteligencia!' },
      { from: 'topotino', text: 'Y por una contraseña que seguramente contiene tu nombre.' },
      { from: 'topoloco', text: '¡DOCTORTOPOLOCO1 es una contraseña histórica!' },
      { from: 'doctora_tecla', text: '¿Quién está desmontando mi código?' },
      { from: 'topotina', text: 'Yo. Entrada lateral elegante. Cierre desastroso.' },
      { from: 'doctora_tecla', text: 'La entrada la hice yo. El cierre lo tocó él.' },
      { from: 'topoloco', text: '¡Yo dirigí la operación!' },
      { from: 'topotina', text: '¿Con los diecisiete mensajes que decían «porfi»?' },
      { from: 'topotino', text: 'Me cae bien la ingeniera enemiga. Eso me preocupa bastante.' },
      { from: 'doctora_tecla', text: 'No soy ingeniera enemiga. Soy la persona que evita que Topoloco conecte cables con cinta adhesiva.' },
      { from: 'topotina', text: 'Entonces explícame esta salida hacia el mar.' },
      { from: 'doctora_tecla', text: 'Eso es su Calibrador Marino. Quería obligar al Corrector a dar respuestas seguras sobre delfines salvajes y cuevas.' },
      { from: 'topoloco', text: '¡TECLA! ¡SECRETO INDUSTRIAL!' },
      { from: 'doctora_tecla', text: 'No funcionará si Paula y Hugo dicen exactamente qué vieron, qué no vieron y qué no pueden asegurar.' },
      { from: 'topotina', text: 'Perfecto. Ya tengo la frecuencia del calibrador.' },
      { from: 'doctora_tecla', text: 'Pues quédatela. Yo me voy. Y tú, Topoloco, bajas la basura cuando consigas salir.' },
      { from: 'system', text: 'Doctora Tecla ha abandonado el canal definitivamente.' },
      { from: 'topoloco', text: '¡NADIE ME EXPULSA DE MI PROPIA CONQUISTA!' },
      { from: 'topotino', text: 'Topoloco, una pregunta: ¿«conquista» lleva seis erres o siete?' },
      { from: 'topoloco', text: '¡NINGUNA! ¿CÓMO PUEDES NO SABER—?' },
      { from: 'topotina', text: 'Gracias. Mientras gritabas he revocado tu acceso.' },
      { from: 'system', text: 'Doctor Topoloco ha sido expulsado del canal.' },
      { from: 'topotino', text: 'Canal recuperado. Tecla se ha ido, Topoloco está fuera y mi dignidad técnica sigue en paradero desconocido.' },
      { from: 'topotina', text: 'La pista de Louri era correcta: el calibrador está escuchando una salida en barco desde Lagos.' },
      { from: 'vasco', text: 'Activo el Protocolo Azul. Los delfines son salvajes: quizá aparezcan y quizá no.' },
      { from: 'topotino', text: 'En el mar no tendréis cobertura. No intentéis contestar allí.' },
      { from: 'topotino', text: 'Observad a los delfines si aparecen, las decisiones de la tripulación y las formas de las cuevas. Al volver al puerto reuniremos las pruebas y atacaremos el calibrador.' }
    ], { mode: 'scene' });
    state.narrativeScene.stage = 'complete';
    if (state.unlockedEpisodeIds.includes(DAY21_EPISODE_ID)) state.activeEpisodeId = DAY21_EPISODE_ID;
    saveState();
    window.setTimeout(() => runActivationCheck('canal-recuperado-dia21'), 500);
    return true;
  }

  scheduleNarrativeSceneTimer();
  return true;
}

function scheduleNarrativeSceneTimer() {
  window.clearTimeout(narrativeSceneTimer);
  narrativeSceneTimer = null;
  const scene = state.narrativeScene;
  if (scene?.stage === 'waiting-louri' && scene.resumeAt) {
    narrativeSceneTimer = window.setTimeout(
      () => runNarrativeScene(),
      Math.max(0, Number(scene.resumeAt) - Date.now())
    );
    return;
  }
  if (
    scene?.stage === 'takeover' &&
    scene.teclaStage === 'pending' &&
    formatDate(getRuntimeNow()) === TOPOLOCO_SCENE_DATE
  ) {
    const startsAt = new Date(getRuntimeNow());
    startsAt.setHours(TECLA_SCENE_HOUR, 0, 0, 0);
    narrativeSceneTimer = window.setTimeout(
      () => runNarrativeScene(),
      Math.max(0, startsAt.getTime() - getRuntimeNow().getTime())
    );
  }
}

async function startDoctoraTeclaScene() {
  const scene = state.narrativeScene;
  if (scene?.stage !== 'takeover' || scene.teclaStage !== 'pending') return;
  scene.teclaStage = 'chat';
  scene.teclaInteractionCount = 0;
  saveState();
  await deliverTopotinoMessages([
    { from: 'system', text: '⚠ Nuevo acceso no autorizado.' },
    { from: 'doctora_tecla', text: '¿Topoloco? ¿Estás aquí?' },
    { from: 'topoloco', text: '¡TECLA! Estoy ejecutando una conquista histórica. No me interrumpas.' },
    { from: 'doctora_tecla', text: 'Llevo dos horas buscándote. Te toca bajar la basura.' },
    { from: 'topoloco', text: '¡Soy el Doctor Topoloco! No puedo abandonar mi trono digital por una bolsa.' },
    { from: 'doctora_tecla', text: 'Tu «trono digital» es el canal que abrí yo porque me lo suplicaste.' },
    { from: 'topoloco', text: 'No supliqué. Presenté una petición científica muy insistente.' },
    { from: 'doctora_tecla', text: 'Diecisiete mensajes y tres audios diciendo «porfi».' },
    { from: 'topoloco', text: '¡Eso era una contraseña vocal!' },
    { from: 'doctora_tecla', text: 'Paula, Hugo: ¿ya os ha dicho que hackeó esto él solo?' },
    { from: 'doctora_tecla', text: 'Preguntad lo que queráis mientras averiguo dónde se ha escondido. Cuando presume, se le escapan datos.' }
  ], { mode: 'scene' });
  renderAll();
}

async function finishDoctoraTeclaScene() {
  const scene = state.narrativeScene;
  if (scene?.stage !== 'takeover' || scene.teclaStage !== 'chat') return;
  scene.teclaStage = 'complete';
  saveState();
  await deliverTopotinoMessages([
    { from: 'doctora_tecla', text: 'Y deja de fingir que el Corrector funciona solo. Sin las doce ventanas y sin observaciones verdaderas, rellena los huecos con disparates.' },
    { from: 'topoloco', text: '¡TECLA! ¡ESO ERA INFORMACIÓN RESERVADA!' },
    { from: 'doctora_tecla', text: 'También era reservado que yo abrí el canal. Hasta que te pusiste la medalla.' },
    { from: 'topoloco', text: '¡Este es MI momento de gloria!' },
    { from: 'doctora_tecla', text: 'Pues disfruta de tu momento, de tu canal y de tu basura. Revoco mi acceso. La próxima vez te hackeas tú solo.' },
    { from: 'topoloco', text: '¡Soy un científico de prestigio! No recibo órdenes domésticas delante de mis futuros ayudantes.' },
    { from: 'doctora_tecla', text: 'En diez minutos serás un científico de prestigio durmiendo junto al cubo de reciclaje.' },
    { from: 'system', text: 'Doctora Tecla ha abandonado el canal y ha revocado su acceso.' },
    { from: 'topoloco', text: 'No pienso comentar nada de lo ocurrido.' },
    { from: 'topoloco', text: 'Paula, Hugo: mi oferta de empleo sigue en pie. La bolsa de basura no forma parte del contrato.' }
  ], { mode: 'scene' });
  saveState();
  renderAll();
}

async function revealLouriEmergency() {
  if (state.narrativeScene?.stage !== 'waiting-louri') return;
  state.narrativeScene.stage = 'route';
  state.narrativeScene.resumeAt = null;
  saveState();
  await deliverTopotinoMessages([
    { from: 'system', text: 'Conexión de emergencia detectada en el comunicador del dinosaurio rojo.' },
    { from: 'louri', text: '¡LOURI AL RESCATE! Espía retirado, rugidor de élite y propietario de dos brazos tácticamente compactos.' },
    { from: 'topotino', text: '¡¿LOURI?! ¿Mi chat secreto tiene alguna pared?' },
    { from: 'topotina', text: 'Es el conducto de emergencia del juguete. Un solo uso. Luego lo cierro.' },
    { from: 'louri', text: 'Topoloco os ha engañado. El safari era un señuelo.' },
    { from: 'louri', text: 'Y las cuevas no están bajo tierra. Están en el MAR.' },
    { from: 'louri', text: 'Delfines salvajes. Cuevas marinas. Una señal saliendo desde un puerto del Algarve.' },
    { from: 'topoloco', text: '¡TRAIDOR DE MENÚ INFANTIL!' },
    { from: 'louri', text: 'Exmenú infantil. Ahora soy asesor independiente.' },
    { from: 'topotina', text: 'He proyectado tres lugares. Paula, Hugo: encontrad el puerto antes de que Topoloco cierre la conexión.' }
  ], { mode: 'scene' });
  renderAll();
}

async function evaluateActivations({ reason, collectMessages = false } = {}) {
  let changed = false;
  const queuedMessages = [];
  const dueLaunches = collectDueAdultLaunches();
  if (dueLaunches.length) changed = true;

  dueLaunches.forEach((launch) => {
    if (isEpisodeUnlocked(launch.episodeId)) return;
    const episode = getEpisode(launch.episodeId);
    if (!episode) return;
    unlockEpisode(episode.meta.id);
    if (collectMessages) {
      queuedMessages.push(...episodeOpeningMessages(episode));
    } else {
      appendMessages(episodeOpeningMessages(episode));
    }
    changed = true;
  });

  for (const episode of episodes) {
    if (isEpisodeUnlocked(episode.meta.id)) continue;
    if (!episodeCanActivate(episode)) continue;
    unlockEpisode(episode.meta.id);
    if (collectMessages) {
      queuedMessages.push(...episodeOpeningMessages(episode));
    } else {
      appendMessages(episodeOpeningMessages(episode));
    }
    changed = true;
  }

  if (changed) {
    saveState();
    renderAll();
    scheduleNextAdultLaunchTimer();
  }

  return queuedMessages;
}

function episodeOpeningMessages(episode) {
  const pack = CHALLENGE_PACKS[episode.meta.id];
  const messages = pack?.openingMessages?.length
    ? toTopotinoMessages(pack.openingMessages)
    : eligibleMessages(episode.initialMessages);
  return messages;
}

function episodeCanActivate(episode) {
  if (!state.unlocked) return false;
  if (episode.meta.startsUnlocked) return true;
  if (Array.isArray(episode.meta.finalRoutes) && !episode.meta.finalRoutes.includes(state.finalRoute || DEFAULT_FINAL_ROUTE)) {
    return false;
  }

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

  if (activation.dateTime) {
    checks.push(dateTimeMatches(activation.dateTime, getRuntimeNow()));
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

function isDay18MachineActivationDue() {
  const episode = getEpisode(DAY18_MACHINE_EPISODE_ID);
  return Boolean(episode && !isEpisodeUnlocked(episode.meta.id) && episodeCanActivate(episode));
}

function collectDueAdultLaunches() {
  if (!Array.isArray(state.scheduledAdultLaunches) || !state.scheduledAdultLaunches.length) {
    state.scheduledAdultLaunches = [];
    return [];
  }

  const now = Date.now();
  const due = [];
  const pending = [];

  state.scheduledAdultLaunches.forEach((launch) => {
    if (!launch || !launch.episodeId || !launch.unlockAt) return;
    if (Number(launch.unlockAt) <= now) {
      due.push(launch);
    } else {
      pending.push(launch);
    }
  });

  if (pending.length !== state.scheduledAdultLaunches.length) {
    state.scheduledAdultLaunches = pending;
  }

  return due;
}

function scheduleNextAdultLaunchTimer() {
  window.clearTimeout(adultLaunchTimer);
  adultLaunchTimer = null;
  if (!state.unlocked || !Array.isArray(state.scheduledAdultLaunches)) return;

  const nextLaunch = state.scheduledAdultLaunches
    .filter((launch) => launch && launch.unlockAt)
    .sort((a, b) => Number(a.unlockAt) - Number(b.unlockAt))[0];

  if (!nextLaunch) return;
  const delay = Math.max(0, Number(nextLaunch.unlockAt) - Date.now());
  adultLaunchTimer = window.setTimeout(() => runActivationCheck('adult-launch'), delay);
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
  if (activation.dateTime) {
    checks.push(dateTimeMatches(activation.dateTime, getRuntimeNow()));
  }
  if (activation.time) {
    checks.push(timeMatches(activation.time, getRuntimeNow()));
  }

  if (!checks.length) return true;
  return activation.mode === 'any' ? checks.some(Boolean) : checks.every(Boolean);
}

async function refreshLocationForPendingActivations() {
  if (!navigator.geolocation) return;
  const hasPendingEpisode = episodes.some((episode) => episodeCanActivateExceptLocation(episode));
  const hasPendingChallenge = Boolean(getPendingArrivalChallenge());
  if (!hasPendingEpisode && !hasPendingChallenge) return;
  if (locationRefreshInFlight || lastLocationIsFresh(LOCATION_REFRESH_COOLDOWN_MS)) return;

  locationRefreshInFlight = true;

  try {
    if (!state.locationNoticeShown) {
      state.locationNoticeShown = true;
      saveState();
      await deliverTopotinoMessages([{
        from: 'topotino',
        time: nowTime(),
        text: 'El comunicador quizá os pida permiso para mirar una señal del mapa. No es una prueba: es solo para saber si mis bigotes apuntan al sitio correcto.'
      }], { mode: 'activation' });
    }
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
  } finally {
    locationRefreshInFlight = false;
  }
}

function lastLocationIsFresh(maxAgeMs) {
  const capturedAt = state.lastKnownPosition?.capturedAt;
  if (!capturedAt) return false;
  const age = Date.now() - new Date(capturedAt).getTime();
  return Number.isFinite(age) && age >= 0 && age < maxAgeMs;
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

  const sceneStage = state.narrativeScene?.id === TOPOLOCO_SCENE_ID
    ? state.narrativeScene.stage
    : null;
  if (sceneStage === 'awaiting-children') {
    await askNarrativeSceneAi(text, {
      stage: sceneStage,
      allowedSpeakers: ['topoloco', 'topotino', 'topotina'],
      context: 'Paula o Hugo está distrayendo a Topoloco mientras Topotina rastrea su acceso. Reacciona con humor. No evalúes la respuesta ni reveles destinos.'
    });
    state.narrativeScene.stage = 'waiting-louri';
    state.narrativeScene.resumeAt = Date.now() + (params.get('fastReply') === '1' ? 700 : randomInt(25000, 45000));
    saveState();
    scheduleNarrativeSceneTimer();
    return;
  }
  if (sceneStage === 'waiting-louri') {
    await askNarrativeSceneAi(text, {
      stage: sceneStage,
      allowedSpeakers: ['topoloco'],
      context: 'Topoloco sigue presumiendo mientras una conexión de emergencia intenta abrirse. Responde brevemente y no reveles ninguna pista.'
    });
    scheduleNarrativeSceneTimer();
    return;
  }
  if (sceneStage === 'takeover') {
    if (state.narrativeScene.teclaStage === 'chat') {
      const interactionNumber = Number(state.narrativeScene.teclaInteractionCount || 0) + 1;
      await askNarrativeSceneAi(text, {
        stage: sceneStage,
        allowedSpeakers: ['topoloco', 'doctora_tecla'],
        context: [
          'Doctora Tecla ha entrado buscando a Topoloco porque le toca bajar la basura.',
          'Ella es la hacker competente que abrió el canal después de que Topoloco se lo suplicara; él intenta atribuirse el mérito y mantener su grandeza.',
          `Este es el turno libre ${interactionNumber} de ${TECLA_SCENE_TURNS} para Paula y Hugo. Responde primero a lo que acaban de preguntar y haz avanzar una discusión cómica entre la pareja.`,
          'Dosifica únicamente estos datos ya autorizados: el Corrector necesita las doce ventanas, observaciones auténticas y comparar versiones; no puede inventar recuerdos convincentes desde cero.',
          'No reveles ningún destino posterior a Lagos, ninguna solución futura ni el desenlace. Tecla no es aliada y Topoloco no abandona el canal.',
          'Usa una a tres burbujas cortas. Puede contestar uno y reaccionar el otro; evita discursos y listas.'
        ].join(' ')
      });
      if (state.narrativeScene?.stage !== 'takeover' || state.narrativeScene.teclaStage !== 'chat') return;
      state.narrativeScene.teclaInteractionCount = interactionNumber;
      saveState();
      if (interactionNumber >= TECLA_SCENE_TURNS) await finishDoctoraTeclaScene();
      return;
    }
    await askNarrativeSceneAi(text, {
      stage: sceneStage,
      allowedSpeakers: ['topoloco'],
      context: 'Topoloco está solo en el canal e intenta reclutar a Paula y Hugo con cargos y ventajas absurdas. No avanza la historia ni revela el siguiente plan.'
    });
    return;
  }

  const challenge = getActiveChallenge();
  if (challenge) {
    if (challenge.kind === 'check-in') {
      await resolveSecurityCheckIn();
      return;
    }
    if (challenge.kind === 'conversation') {
      await resolveStoryConversation(challenge, text);
      return;
    }
    if (challengeNeedsPhysicalConfirmation(challenge) && isChallengeCompletionMessage(text)) {
      await resolveChallengeCompletion(challenge);
      return;
    }
    if (challenge.kind === 'choice' || challenge.kind === 'destination' || challenge.kind === 'daily-recovery') {
      const exactOption = (challenge.options || []).find((option) => normalizeText(option.text) === normalizeText(text));
      if (exactOption) {
        await resolveChallengeOption(challenge, exactOption.id);
        return;
      }
      await askChallengeValidation(challenge, text);
      return;
    }
  }

  const guided = findGuidedResponse(text);
  if (guided) {
    await applyGuidedResponse(guided.response, guided.episode, text);
    return;
  }

  if (shouldTopotinoStaySilent(text)) {
    saveState();
    renderAll();
    return;
  }

  const progressiveHint = isExplicitHintRequest(text) ? nextProgressiveHint({ immediate: true }) : null;
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

function getChallengePack(episodeId = getActiveEpisode()?.meta?.id) {
  return episodeId ? CHALLENGE_PACKS[episodeId] || null : null;
}

function getNextChallengeStep() {
  const episode = getActiveEpisode();
  const pack = getChallengePack(episode?.meta?.id);
  if (!pack) return null;

  const steps = pack.steps || [];
  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    if (Array.isArray(step.finalRoutes) && !step.finalRoutes.includes(state.finalRoute || DEFAULT_FINAL_ROUTE)) continue;
    if (state.completedChallengeIds.includes(step.id)) continue;
    if (step.notBefore && !challengeNotBeforeIsDue(step.notBefore, step)) return null;
    if (step.kind === 'conversation' && state.completedChallengeIds.includes(steps[index + 1]?.id)) continue;
    if (step.kind === 'daily-recovery' && getNetShadow() <= 0) continue;
    return { ...step, episodeId: episode.meta.id, shadowActor: pack.shadowActor || 'Topoloco' };
  }
  return null;
}

function challengeNotBeforeIsDue(rule, step = null) {
  if (step?.allowEarlyFlag && state.flags.includes(step.allowEarlyFlag)) return true;
  if (!rule?.date) return true;
  const [year, month, day] = String(rule.date).split('-').map(Number);
  const [hour = 0, minute = 0] = String(rule.time || '00:00').split(':').map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return true;
  const threshold = new Date(year, month - 1, day, hour, minute, 0, 0);
  return getRuntimeNow().getTime() >= threshold.getTime();
}

function getPendingArrivalChallenge() {
  const challenge = getNextChallengeStep();
  if (!challenge?.location || challengeArrivalWasConfirmed(challenge) || challengeLocationMatches(challenge.location)) return null;
  return challenge;
}

function getActiveChallenge() {
  const sceneChallenge = getTopolocoRouteChallenge();
  if (sceneChallenge) return sceneChallenge;
  if (isTopolocoSceneActive()) return null;
  if (isSecurityCheckInPending()) {
    return { ...SECURITY_CHECKIN_CHALLENGE, episodeId: getActiveEpisode()?.meta?.id };
  }
  const challenge = getNextChallengeStep();
  if (challenge?.location && !challengeArrivalWasConfirmed(challenge) && !challengeLocationMatches(challenge.location)) return null;
  return challenge;
}

function collectChallengeArrivalMessages() {
  const challenge = getNextChallengeStep();
  if (!challenge?.location || !challengeLocationMatches(challenge.location)) return [];
  if (!challenge.arrivalMarker || state.seenBroadcastIds.includes(challenge.arrivalMarker)) return [];

  state.seenBroadcastIds.push(challenge.arrivalMarker);
  saveState();
  return toTopotinoMessages(challenge.arrivalMessages || []);
}

function collectStoryConversationPromptMessages() {
  const challenge = getNextChallengeStep();
  if (challenge?.kind !== 'conversation') return [];
  const marker = `dialogo-abierto-${challenge.id}`;
  if (state.seenBroadcastIds.includes(marker)) return [];
  state.seenBroadcastIds.push(marker);
  saveState();
  return toTopotinoMessages(challenge.promptMessages || []);
}

function challengeArrivalWasConfirmed(challenge) {
  return Boolean(challenge?.arrivalMarker && state.seenBroadcastIds.includes(challenge.arrivalMarker));
}

function challengeLocationMatches(rule) {
  const pos = state.lastKnownPosition;
  if (!pos || typeof pos.lat !== 'number' || typeof pos.lng !== 'number') return false;
  const distance = haversineDistanceMeters(pos.lat, pos.lng, rule.lat, rule.lng);
  const accuracyMargin = Math.min(Math.max(Number(pos.accuracy) || 0, 0), 100);
  return distance <= (rule.radiusMeters || 300) + accuracyMargin;
}

function isSecurityCheckInPending() {
  return state.flags.includes(SECURITY_ANNOUNCED_FLAG) && !state.flags.includes(SECURITY_CONFIRMED_FLAG);
}

async function resolveSecurityCheckIn() {
  if (state.flags.includes(SECURITY_CONFIRMED_FLAG)) return;
  await deliverTopotinoMessages(toTopotinoMessages([
    'Os recibo. Esta vez el mensaje ha llegado entero y en orden.',
    'El contador de Sombra sigue estable. Por ahora, Topoloco no parece estar dentro del canal.',
    'Ayer recuperamos el Agua del Puente. Después quedó un recuerdo incompleto: África, Far-West, un zoco, piratas y una aldea medieval en el mismo lugar.',
    'Solo puedo ver la primera parada. Vamos a identificarla.'
  ]), { mode: 'conversation' });
  addUniqueMany(state.flags, [SECURITY_CONFIRMED_FLAG]);
  saveState();
  renderAll();
}

function challengeNeedsPhysicalConfirmation(challenge) {
  if (!challenge) return false;
  if (challenge.kind === 'expedition' || challenge.kind === 'ending') return true;
  return (state.challengeAttempts[challenge.id] || 0) >= 2 && Boolean(challenge.recovery);
}

function isChallengeCompletionMessage(text) {
  const normalized = normalizeText(text);
  if (/^(no|aun no|todavia no)\b/.test(normalized) || /\bno lo hemos hecho\b/.test(normalized)) return false;
  return [
    'ya lo hemos hecho', 'ya esta hecho', 'ya está hecho', 'lo hemos hecho',
    'hemos terminado', 'terminado', 'completado', 'hecho', 'ya esta', 'ya está'
  ].some((phrase) => normalized === normalizeText(phrase) || normalized.includes(normalizeText(phrase)));
}

async function handleChallengeOption(challenge, optionId) {
  const option = (challenge.options || []).find((item) => item.id === optionId);
  if (!option) return;
  appendMessage({ from: 'user', time: nowTime(), text: option.text });
  saveState();
  renderAll();

  await resolveChallengeOption(challenge, optionId);
}

async function resolveChallengeOption(challenge, optionId) {
  if (challenge.kind === 'daily-recovery') {
    await resolveDailyRecovery(challenge, optionId === challenge.correctOptionId);
    return;
  }
  if (optionId === challenge.correctOptionId) {
    await resolveChallengeSuccess(challenge);
  } else {
    await resolveChallengeIncorrect(challenge, optionId);
  }
}

async function handleChallengeCompletion(challenge) {
  appendMessage({ from: 'user', time: nowTime(), text: 'Ya lo hemos hecho.' });
  saveState();
  renderAll();
  await resolveChallengeCompletion(challenge);
}

async function resolveChallengeCompletion(challenge) {
  if (state.completedChallengeIds.includes(challenge.id)) return;
  const isRecovery = (state.challengeAttempts[challenge.id] || 0) >= 2 && Boolean(challenge.recovery);
  let messages;

  if (challenge.kind === 'ending') {
    completeChallenge(challenge, { awardMemory: true });
    state.endingVariant = calculateEndingVariant();
    messages = endingMessages(state.endingVariant);
  } else if (isRecovery) {
    completeChallenge(challenge, { awardMemory: true });
    messages = [
      'Comprobación hecha. Ya no hace falta adivinar ninguna redacción.',
      ...(challenge.successMessages || []),
      'La pregunta queda resuelta. Las Sombras de los intentos anteriores permanecen, pero la aventura continúa.'
    ];
  } else {
    completeChallenge(challenge, { awardMemory: true });
    messages = challenge.doneMessages || ['Expedición completada. Gracias, agentes.'];
  }

  saveState();
  renderAll();
  await deliverTopotinoMessages(toTopotinoMessages(messages), { mode: 'challenge' });
  const conversationMessages = collectStoryConversationPromptMessages();
  if (conversationMessages.length) await deliverTopotinoMessages(conversationMessages, { mode: 'conversation' });
  saveState();
  renderAll();
}

async function resolveChallengeSuccess(challenge) {
  if (state.completedChallengeIds.includes(challenge.id)) return;
  if (challenge.id === 'topoloco-ruta-lagos') {
    completeChallenge(challenge, { awardMemory: true });
    await completeTopolocoRoute();
    return;
  }
  completeChallenge(challenge, { awardMemory: true });
  saveState();
  renderAll();
  await deliverTopotinoMessages(toTopotinoMessages(challenge.successMessages || ['Correcto. Muy bien observado.']), { mode: 'challenge' });
  const conversationMessages = collectStoryConversationPromptMessages();
  if (conversationMessages.length) await deliverTopotinoMessages(conversationMessages, { mode: 'conversation' });
  saveState();
  renderAll();
}

async function resolveStoryConversation(challenge, userText) {
  if (state.completedChallengeIds.includes(challenge.id)) return;
  const hasScriptedReply = challenge.scriptedReply !== false && challenge.replyMessages?.length;
  await askAiFallback(userText, {
    conversationChallenge: challenge,
    fallbackMessages: hasScriptedReply
      ? [{ from: 'topotino', text: 'Os he leído. Seguid conmigo, que ahora viene la parte importante.' }]
      : challenge.replyMessages
  });
  if (hasScriptedReply) {
    await deliverTopotinoMessages(toTopotinoMessages(challenge.replyMessages), { mode: 'conversation' });
  }
  if (challenge.alwaysMessages?.length) {
    await deliverTopotinoMessages(toTopotinoMessages(challenge.alwaysMessages), { mode: 'conversation' });
  }
  applyChallengeEffects(challenge.effects || {});
  addUniqueMany(state.completedChallengeIds, [challenge.id]);
  saveState();
  renderAll();
  const nextConversationMessages = collectStoryConversationPromptMessages();
  if (nextConversationMessages.length) {
    await deliverTopotinoMessages(nextConversationMessages, { mode: 'conversation' });
    saveState();
    renderAll();
  }
}

async function resolveChallengeIncorrect(challenge, optionId = null, modelReply = '') {
  if (state.completedChallengeIds.includes(challenge.id)) return;
  const attempts = Math.min(2, (state.challengeAttempts[challenge.id] || 0) + 1);
  state.challengeAttempts[challenge.id] = attempts;
  if (optionId) {
    const wrong = state.challengeWrongOptions[challenge.id] || [];
    if (!wrong.includes(optionId)) wrong.push(optionId);
    state.challengeWrongOptions[challenge.id] = wrong;
  }
  state.shadowScore += 1;

  const actor = challenge.shadowActor || 'Topoloco';
  const messages = [
    modelReply || `Esa opción no coincide con lo que podéis ver o comprobar allí. ${challenge.hint || 'Mirad otra vez antes de elegir.'}`,
    `${actor} ha hecho subir la Sombra un punto. Podría colar otra interferencia, pero no se ha borrado nada: podéis volver a mirar y corregir.`
  ];
  if (attempts >= 2) {
    messages.push('Han sido dos intentos. Cambio de plan: aparece una comprobación física breve para que podáis continuar sin quedar atrapados.');
  }
  saveState();
  renderAll();
  await deliverTopotinoMessages(toTopotinoMessages(messages), { mode: 'challenge' });
  const conversationMessages = collectStoryConversationPromptMessages();
  if (conversationMessages.length) await deliverTopotinoMessages(conversationMessages, { mode: 'conversation' });
  saveState();
  renderAll();
}

async function resolveDailyRecovery(challenge, correct) {
  if (state.completedChallengeIds.includes(challenge.id)) return;
  addUniqueMany(state.completedChallengeIds, [challenge.id]);
  let messages;
  if (correct && getNetShadow() > 0) {
    state.recoveredShadow += 1;
    messages = challenge.successMessages || ['Habéis retirado una Sombra.'];
  } else {
    messages = challenge.failureMessages || ['Esta vez la Sombra permanece. Mañana habrá otra oportunidad.'];
  }
  saveState();
  renderAll();
  await deliverTopotinoMessages(toTopotinoMessages(messages), { mode: 'challenge' });
  saveState();
  renderAll();
}

async function askChallengeValidation(challenge, text) {
  setBusy(true, true);
  try {
    const response = await fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'validate-challenge',
        message: text,
        challenge: {
          id: challenge.id,
          kind: challenge.kind,
          place: challenge.place,
          prompt: challenge.prompt,
          options: challenge.options,
          correctOptionId: challenge.correctOptionId,
          explanation: (challenge.successMessages || []).map(chatMessageText).join(' ')
        }
      })
    });
    if (!response.ok) throw new Error('Challenge validation failed');
    const result = await response.json();
    const verdict = result.verdict || {};
    if (verdict.verdict === 'correct') {
      if (challenge.kind === 'daily-recovery') await resolveDailyRecovery(challenge, true);
      else await resolveChallengeSuccess(challenge);
      return;
    }
    if (verdict.verdict === 'incorrect') {
      if (challenge.kind === 'daily-recovery') await resolveDailyRecovery(challenge, false);
      else await resolveChallengeIncorrect(challenge, null, verdict.reply);
      return;
    }
    await deliverTopotinoMessages(toTopotinoMessages([
      verdict.reply || 'No estoy seguro de que eso sea vuestra respuesta. Podéis tocar una opción o explicármelo de otra manera.'
    ]), { mode: 'challenge' });
  } catch (error) {
    await deliverTopotinoMessages(toTopotinoMessages([
      'La señal de Luna no ha podido comprobar esa frase. No cuenta como error.',
      'Usad los botones o probad con un mensaje más corto.'
    ]), { mode: 'challenge' });
  } finally {
    setBusy(false, false);
    saveState();
    renderAll();
  }
}

function completeChallenge(challenge, { awardMemory = false } = {}) {
  addUniqueMany(state.completedChallengeIds, [challenge.id]);
  if (awardMemory) state.memoryScore += 1;
  applyChallengeEffects(challenge.effects || {});
}

function applyChallengeEffects(effects) {
  addUniqueMany(state.flags, effects.setFlags || []);
  if (effects.water) addWater(effects.water);
  if (effects.formulaWord) addFormulaWord(effects.formulaWord);
  if (effects.lockFinalRoute) state.finalRouteLocked = true;
  if (effects.nextEpisode) {
    const nextEpisode = getEpisode(effects.nextEpisode);
    if (nextEpisode) unlockEpisode(nextEpisode.meta.id);
  }
}

function getNetShadow() {
  return Math.max(0, Number(state.shadowScore || 0) - Number(state.recoveredShadow || 0));
}

function calculateEndingVariant() {
  const ratio = getNetShadow() / Math.max(1, Number(state.memoryScore || 0));
  if (ratio <= 0.25) return 'clean';
  if (ratio <= 0.6) return 'close';
  return 'incomplete';
}

function endingMessages(variant) {
  const endingPlace = 'aquí, al salir del Corral de Comedias de Isla Mágica';
  const shared = [
    { from: 'system', text: 'VENTANAS DEL MAPA: 12/12 · CUADERNO DE BITÁCORA ÚNICO: DESCONECTADO' },
    { from: 'system', text: 'BORRÓN: SIN CORTES · ECO: SIN VOZ · NIEBLA: SIN SEÑAL · MUSEO: ABIERTO' },
    { from: 'topoloco', text: '¡Esto no es una derrota! Es un ensayo técnico que ha salido corriendo en dirección contraria.' },
    { from: 'capitan_pico', text: 'Con corona de cartón y todo. Huida de gala confirmada.' },
    { from: 'topotina', text: 'Borrón, Eco y Niebla han perdido las conexiones. El museo está devolviendo cada recuerdo a quien lo vivió.' },
    { from: 'topotino', text: 'Tina… Recuerdo una caja de galletas. Construiste dentro mi primer comunicador.' },
    { from: 'topotino', text: 'Y yo mordí una pieza porque creí que era chocolate.' },
    { from: 'topotina', text: 'Dos piezas, hermano. Eran resistencias. Pero sí: has vuelto.' },
    { from: 'topotino', text: 'Paula, Hugo: lo hemos conseguido. No porque acertarais siempre, sino porque mirasteis, preguntasteis y corregisteis cuando apareció una prueba mejor.' },
    { from: 'topotino', text: 'Hugo, no he olvidado cómo te atreviste a actuar en la plaza. Paula, tampoco cómo encontrabas el camino cuando los demás dudábamos.' },
    { from: 'topotino', text: 'Y ayer supisteis parar antes de Santa Cruz. Un buen explorador también sabe cuándo descansar. Estoy orgulloso de los dos.' },
    { from: 'capitan_pico', text: 'Os nombro Exploradores de las Doce Aguas, Salvadores de Historias y Personas Autorizadas a Corregir al Capitán.' },
    { from: 'topotino', text: 'Ese último título lo necesitábamos desde hace tiempo.' },
    { from: 'topotino', text: `Topoloco puede copiar una imagen, pero nunca podrá decir que vivió la aventura por vosotros. La aventura principal termina ${endingPlace}.` }
  ];
  if (variant === 'clean') {
    return [{ from: 'system', text: 'VICTORIA: LAS DOCE AGUAS RECUPERADAS' }, ...shared, { from: 'topotino', text: 'Mis recuerdos vuelven con mucha claridad. El Cuaderno queda con vosotros. No se abre otra misión.' }, { from: 'topotino', text: 'Pero Sevilla sigue ahí: Santa Cruz, la antigua Fábrica de Tabacos, María Luisa y Plaza de España os esperan sin pruebas, villanos ni formularios de Topotina.' }];
  }
  if (variant === 'close') {
    return [{ from: 'system', text: 'VICTORIA: LAS DOCE AGUAS RECUPERADAS' }, ...shared, { from: 'topotino', text: 'Han vuelto los recuerdos importantes. Algunas esquinas siguen borrosas y las ordenaremos sin inventarlas.' }, { from: 'topotino', text: 'Seguid conociendo Sevilla a vuestro ritmo. Lo que quedó pendiente ya no es una misión: es una ciudad que podéis disfrutar.' }];
  }
  return [{ from: 'system', text: 'VICTORIA: LAS DOCE AGUAS RECUPERADAS' }, ...shared, { from: 'topotino', text: 'Topoloco ha perdido el museo. Algunos recuerdos tardarán más en ordenarse, pero ya no le pertenecen. No se abre otra amenaza.' }, { from: 'topotino', text: 'Cuando os apetezca, volved a mirar Sevilla sin perseguir a nadie. Por una vez, propongo turismo sin sabotajes.' }];
}

function toTopotinoMessages(texts) {
  return texts.filter(Boolean).map((message) => {
    if (typeof message === 'string') {
      return { from: 'topotino', time: nowTime(), text: message };
    }
    return {
      ...message,
      from: message.from || 'topotino',
      time: message.time || nowTime(),
      text: message.text || ''
    };
  });
}

function chatMessageText(message) {
  return typeof message === 'string' ? message : message?.text || '';
}

async function applyGuidedResponse(guided, sourceEpisode, userText = '') {
  const outboundMessages = [...(guided.messages || [])];
  state.hintMissCursor[sourceEpisode.meta.id] = 0;
  addUniqueMany(state.flags, guided.setFlags || []);

  if (guided.setLocation) setSimulatedLocation(guided.setLocation);
  if (guided.setRuntimeNow) setSimulatedRuntime(guided.setRuntimeNow);
  if (guided.clearRuntimeNow) clearSimulatedRuntime();
  if (guided.water) addWater(guided.water);
  if (guided.formulaWord) addFormulaWord(guided.formulaWord);
  if (guided.remember) recordStoryMemory(guided.remember, userText, sourceEpisode, guided);

  if (guided.nextEpisode) {
    const nextEpisode = getEpisode(guided.nextEpisode);
    if (nextEpisode) {
      const wasRendered = state.renderedEpisodes.includes(nextEpisode.meta.id);
      unlockEpisode(nextEpisode.meta.id);
      if (!wasRendered) outboundMessages.push(...eligibleMessages(nextEpisode.initialMessages));
    }
  }

  const activatedMessages = await evaluateActivations({ reason: 'guided', collectMessages: true });
  outboundMessages.push(...activatedMessages);

  await deliverTopotinoMessages(outboundMessages);
  saveState();
  renderAll();
}

async function fetchWithTimeout(resource, options = {}, timeoutMs = AI_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

async function askAiFallback(text, options = {}) {
  const activeEpisode = getActiveEpisode();
  if (!activeEpisode || activeEpisode.meta.ai?.enabled === false) {
    await deliverTopotinoMessages([{
      from: 'topotino',
      time: nowTime(),
      text: 'La señal tiembla un poco, como una linterna dentro de una ola. Probad con una pista más concreta, agentes.'
    }]);
    saveState();
    renderAll();
    return;
  }

  const requestedEpisodeId = activeEpisode.meta.id;
  const turnId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  activeConversationTurnId = turnId;
  const responsePromise = (async () => {
    const response = await fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        turnId,
        activeEpisodeId: activeEpisode.meta.id,
        activeEpisodeTitle: activeEpisode.meta.title,
        activeEpisodes: [activeEpisode].map((episode) => ({
          id: episode.meta.id,
          title: episode.meta.title,
          mission: episode.meta.mission,
          aiContext: episode.aiContext
        })),
        runtime: getRuntimeContext(),
        flags: state.flags,
        waters: state.waters,
        formulaWords: state.formulaWords,
        storyMemory: state.storyMemory.slice(-36),
        currentChallenge: summarizeChallengeForAi(getActiveChallenge()),
        pendingArrival: summarizeArrivalForAi(getPendingArrivalChallenge()),
        conversation: summarizeConversationForAi(options.conversationChallenge),
        allowedSpeakers: getAllowedAiSpeakers(activeEpisode, options.conversationChallenge),
        speakerMode: options.conversationChallenge?.allowedSpeakers ? 'exact' : undefined,
        recentMessages: recentMessagesForEpisode(activeEpisode.meta.id)
      })
    });

    if (!response.ok) throw new Error('AI request failed');
    const data = await response.json();
    if (data.turnId !== turnId || data.episodeId !== requestedEpisodeId) throw new Error('STALE_AI_RESPONSE');
    if (activeConversationTurnId !== turnId || getActiveEpisode()?.meta?.id !== requestedEpisodeId) return [];
    return (data.messages || []).map((message) => ({
      from: CHAT_SENDERS[message.from] ? message.from : 'topotino',
      time: nowTime(),
      text: message.text || ''
    })).filter((message) => message.text);
  })().catch(() => {
    if (activeConversationTurnId !== turnId) return [];
    const fallback = Array.isArray(options.fallbackMessages) && options.fallbackMessages.length
      ? options.fallbackMessages
      : [{ from: 'topotino', text: 'Vuestro último mensaje me ha llegado cortado. Repetid solo esa frase; no voy a contestar a ninguna conversación anterior.' }];
    return toTopotinoMessages(fallback);
  });

  await deliverTopotinoMessages(responsePromise, { mode: 'conversation' });
  saveState();
  renderAll();
}

async function askNarrativeSceneAi(text, { stage, allowedSpeakers, context }) {
  const turnId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const requestedStage = stage;
  activeConversationTurnId = turnId;
  const responsePromise = (async () => {
    const response = await fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        turnId,
        activeEpisodeId: TOPOLOCO_SCENE_EPISODE_ID,
        activeEpisodeTitle: 'Asalto al Comunicador Subterráneo',
        activeEpisodes: [{
          id: TOPOLOCO_SCENE_EPISODE_ID,
          title: 'Asalto al Comunicador Subterráneo',
          mission: 'Impedir que Topoloco controle la historia',
          aiContext: context
        }],
        runtime: getRuntimeContext(),
        flags: state.flags,
        waters: state.waters,
        formulaWords: state.formulaWords,
        storyMemory: [],
        currentChallenge: null,
        pendingArrival: null,
        conversation: { id: TOPOLOCO_SCENE_ID, stage: requestedStage, purpose: context },
        narrativeScene: { id: TOPOLOCO_SCENE_ID, stage: requestedStage, context },
        allowedSpeakers,
        speakerMode: 'exact',
        recentMessages: state.messages.slice(-10)
      })
    });
    if (!response.ok) throw new Error('Scene AI request failed');
    const data = await response.json();
    if (data.turnId !== turnId || activeConversationTurnId !== turnId) throw new Error('STALE_AI_RESPONSE');
    if (state.narrativeScene?.stage !== requestedStage) return [];
    return (data.messages || [])
      .filter((message) => allowedSpeakers.includes(message.from) && message.text)
      .map((message) => ({ from: message.from, time: nowTime(), text: message.text }));
  })().catch(() => {
    if (state.narrativeScene?.stage !== requestedStage) return [];
    if (requestedStage === 'takeover' || requestedStage === 'waiting-louri') {
      return [{ from: 'topoloco', time: nowTime(), text: 'Seguid hablando. Estoy anotando vuestra admiración en la columna correspondiente.' }];
    }
    return [
      { from: 'topoloco', time: nowTime(), text: 'Muy interesante. No tanto como yo, pero interesante.' }
    ];
  });
  await deliverTopotinoMessages(responsePromise, { mode: 'conversation' });
  saveState();
  renderAll();
}

async function completeTopolocoRoute() {
  if (state.narrativeScene?.stage !== 'route') return;
  state.narrativeScene.stage = 'takeover';
  state.narrativeScene.resumeAt = null;
  addUniqueMany(state.flags, [TOPOLOCO_ROUTE_FLAG, 'louri_emergencia_cerrada']);
  saveState();
  renderAll();
  await deliverTopotinoMessages([
    { from: 'louri', text: '¡Lagos! Mañana buscad un barco en su marina y seguid la señal entre los delfines y las cuevas del mar.' },
    { from: 'topotino', text: 'Recibido. Louri, cierra antes de que—' },
    { from: 'topoloco', text: '¡SE ACABÓ!' },
    { from: 'topoloco', text: '¡Fuera el dinosaurio! ¡Fuera la ingeniera! ¡Fuera el topo gritón!' },
    { from: 'system', text: 'Louri ha sido expulsado. Canal de emergencia cerrado definitivamente.' },
    { from: 'system', text: 'Topotina ha sido expulsada del canal.' },
    { from: 'system', text: 'Topotino ha sido expulsado del canal.' },
    { from: 'topoloco', text: 'Ahora sí. Paula y Hugo, hablemos como futuros colegas.' },
    { from: 'topoloco', text: 'Os ofrezco el cargo de Ayudantes del Ayudante del Doctor Topoloco. Incluye una placa pequeña y descansos de dos minutos y medio.' },
    { from: 'topoloco', text: 'Solo tenéis que admitir que yo fui el héroe de todas vuestras aventuras. Pensadlo. Yo estaré aquí… ocupando vuestro chat.' }
  ], { mode: 'scene' });
  saveState();
  renderAll();
  scheduleNarrativeSceneTimer();
}

function recentMessagesForEpisode(episodeId) {
  return state.messages
    .filter((message) => message.episodeId === episodeId)
    .slice(-10);
}

function summarizeConversationForAi(challenge) {
  if (!challenge) return null;
  return {
    id: challenge.id,
    place: challenge.place || '',
    prompt: (challenge.promptMessages || []).map(chatMessageText).join(' '),
    purpose: 'Reacciona a la respuesta de Paula y Hugo. No la evalúes como examen y no reveles todavía el siguiente destino.'
  };
}

function getAllowedAiSpeakers(episode, challenge = null) {
  const explicitSpeakers = Array.isArray(challenge?.allowedSpeakers)
    ? challenge.allowedSpeakers
    : null;
  const candidates = explicitSpeakers || ['topotino', ...(EPISODE_AI_SPEAKERS[episode?.meta?.id] || [])];
  const introduced = new Set(state.messages.map((message) => message.from));
  (challenge?.promptMessages || []).forEach((message) => introduced.add(message?.from));
  return [...new Set(candidates.filter((speaker) => {
    if (explicitSpeakers) {
      if (speaker === 'louri' && state.flags.includes('louri_canal_cerrado')) {
        return challenge?.allowClosedSpeaker === 'louri';
      }
      return true;
    }
    if (speaker === 'topotina') return introduced.has('topotina') || state.flags.includes(MACHINE_CLARIFIED_FLAG);
    if (speaker === 'louri' && state.flags.includes('louri_canal_cerrado')) return false;
    return introduced.has(speaker);
  }))];
}

function summarizeChallengeForAi(challenge) {
  if (!challenge) return null;
  return {
    id: challenge.id,
    kind: challenge.kind,
    place: challenge.place || '',
    title: challenge.title || '',
    prompt: challenge.prompt || ''
  };
}

function summarizeArrivalForAi(challenge) {
  if (!challenge?.location) return null;
  return {
    challengeId: challenge.id,
    discoveredPlace: challenge.location.label || challenge.place || ''
  };
}

function findGuidedResponse(text) {
  const normalized = normalizeText(text);
  const episode = getActiveEpisode();
  if (!episode || isStaleLuancoEpisode(episode) || isEpisodeCompleted(episode)) return null;

  const response = (episode.guidedResponses || []).find((candidate) =>
    responseMatches(candidate, normalized)
  );
  if (response) return { episode, response };

  return null;
}

function isEpisodeCompleted(episode) {
  const completionFlags = (episode.guidedResponses || [])
    .flatMap((response) => response.setFlags || [])
    .filter((flag) => flag.startsWith('completado_'));
  return completionFlags.some((flag) => state.flags.includes(flag));
}

function responseMatches(candidate, normalizedText) {
  const requiredFlags = candidate.requiredFlags || [];
  if (requiredFlags.length && !requiredFlags.every((flag) => state.flags.includes(flag))) {
    return false;
  }

  const blockedFlags = candidate.blockedFlags || [];
  if (blockedFlags.some((flag) => state.flags.includes(flag))) {
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

  const containsAnyGroups = candidate.containsAnyGroups || [];
  if (containsAnyGroups.length && !containsAnyGroups.every((group) =>
    Array.isArray(group) && group.some((term) => normalizedText.includes(normalizeText(term)))
  )) {
    return false;
  }

  const containsAny = candidate.containsAny || [];
  if (containsAny.length) {
    return containsAny.some((term) => normalizedText.includes(normalizeText(term)));
  }

  if (containsAll.length || containsAnyGroups.length) return true;

  return Boolean(candidate.openAnswer);
}

function nextSoftResponse(episode) {
  const key = episode.meta.id;
  const cursor = state.softResponseCursor[key] || 0;
  const response = episode.softResponses[cursor % episode.softResponses.length];
  state.softResponseCursor[key] = cursor + 1;
  return response;
}

function nextProgressiveHint(options = {}) {
  const activeEpisode = getActiveEpisode();
  if (!activeEpisode || isEpisodeCompleted(activeEpisode)) return null;
  const hints = activeEpisode?.progressiveHints || [];
  if (!hints.length) return null;

  const key = activeEpisode.meta.id;
  const misses = (state.hintMissCursor[key] || 0) + 1;
  state.hintMissCursor[key] = misses;

  if (!options.immediate && misses < 3) return null;
  return hints[options.immediate ? (misses - 1) % hints.length : (misses - 3) % hints.length];
}

function isExplicitHintRequest(text) {
  const normalized = normalizeText(text);
  return /\b(pista|ayuda|ayudanos|ayudame|no sabemos|no lo sabemos|no entendemos|no entiendo)\b/.test(normalized);
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

function shouldTopotinoStaySilent(text) {
  const normalized = normalizeText(text).replace(/[.!¡?¿]+$/g, '').trim();
  return new Set([
    'ok', 'okay', 'vale', 'de acuerdo', 'entendido', 'entendida',
    'perfecto', 'perfecta', 'gracias', 'muchas gracias', 'genial',
    'bien', 'esta bien', 'está bien', 'hasta luego', 'adios', 'adiós'
  ]).has(normalized);
}

function nextChatterWarning() {
  const response = CHATTER_WARNINGS[state.chatterWarningCursor % CHATTER_WARNINGS.length];
  state.chatterWarningCursor += 1;
  state.lastChatterWarningAt = Date.now();
  return response;
}

async function deliverTopotinoMessages(messagesOrPromise, options = {}) {
  setBusy(true, false);
  renderChallenge();

  try {
    const messagesPromise = Promise.resolve(messagesOrPromise);
    const timing = getReplyTiming(options.mode);
    await wait(getInitialReplyDelay(timing, options.mode));
    const messages = await messagesPromise;
    const firstSender = Array.isArray(messages)
      ? messages.find(Boolean)?.from
      : 'topotino';
    setBusy(true, true, firstSender);
    await wait(randomInt(timing.typingMin, timing.typingMax));

    const normalizedMessages = splitTopotinoMessages(
      Array.isArray(messages) ? messages.filter(Boolean) : []
    );
    for (let index = 0; index < normalizedMessages.length; index += 1) {
      appendMessage(normalizedMessages[index]);
      saveState();
      renderAll();
      if (index < normalizedMessages.length - 1) {
        setBusy(true, false);
        await wait(randomInt(timing.staggerMin, timing.staggerMax));
        setBusy(true, true, normalizedMessages[index + 1]?.from);
        await wait(randomInt(timing.nextTypingMin, timing.nextTypingMax));
      }
    }
  } finally {
    setBusy(false, false);
    renderChallenge();
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

  if (mode === 'epilogue') {
    return {
      silenceMin: 1200,
      silenceMax: 2800,
      typingMin: 800,
      typingMax: 2200,
      staggerMin: 450,
      staggerMax: 1000,
      nextTypingMin: 700,
      nextTypingMax: 1900
    };
  }

  if (mode === 'challenge') {
    return {
      silenceMin: 2000,
      silenceMax: 6000,
      typingMin: 900,
      typingMax: 2200,
      staggerMin: 500,
      staggerMax: 1100,
      nextTypingMin: 700,
      nextTypingMax: 1800
    };
  }

  if (mode === 'scene') {
    return {
      silenceMin: 1200,
      silenceMax: 3500,
      typingMin: 900,
      typingMax: 2400,
      staggerMin: 700,
      staggerMax: 1800,
      nextTypingMin: 900,
      nextTypingMax: 2600
    };
  }

  if (mode === 'conversation') {
    return {
      silenceMin: 4000,
      silenceMax: 35000,
      typingMin: 2500,
      typingMax: 7500,
      staggerMin: 1500,
      staggerMax: 4000,
      nextTypingMin: 2500,
      nextTypingMax: 7000
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

function getInitialReplyDelay(timing, mode) {
  const ordinaryDelay = randomInt(timing.silenceMin, timing.silenceMax);
  if (mode !== 'conversation' || Math.random() >= LONG_REPLY_CHANCE) return ordinaryDelay;
  return randomInt(LONG_REPLY_MIN_MS, LONG_REPLY_MAX_MS);
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
    applyLisbonArrivalRescue();
    const activationMessages = await evaluateActivations({ reason: 'location', collectMessages: true });
    const challengeArrivalMessages = collectChallengeArrivalMessages();
    const rescueMessages = [...startupRescueMessages];
    startupRescueMessages = [];
    saveState();
    if (rescueMessages.length || activationMessages.length || challengeArrivalMessages.length) {
      await deliverTopotinoMessages([...rescueMessages, ...activationMessages, ...challengeArrivalMessages], { mode: 'activation' });
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
  renderChallenge();
  renderAdultPanel();
}

function renderMessages() {
  els.messages.innerHTML = '';
  const fragment = document.createDocumentFragment();
  let lastDateKey = '';

  splitTopotinoMessages(state.messages).forEach((message) => {
    const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
    const dateKey = formatDate(messageDate);
    if (dateKey !== lastDateKey) {
      const separator = document.createElement('div');
      separator.className = 'date-separator';
      separator.textContent = formatChatDate(messageDate);
      fragment.appendChild(separator);
      lastDateKey = dateKey;
    }

    if (message.from === 'system') {
      const event = document.createElement('div');
      event.className = 'chat-event';
      event.textContent = message.text;
      fragment.appendChild(event);
      return;
    }

    const isUser = message.from === 'user';
    const sender = CHAT_SENDERS[message.from] || CHAT_SENDERS.topotino;
    const row = document.createElement('article');
    row.className = `message-row ${isUser ? 'user' : 'topotino'} sender-${message.from || 'topotino'}`;

    if (!isUser) {
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      if (sender.image) {
        const image = document.createElement('img');
        image.src = sender.image;
        image.alt = sender.name;
        image.addEventListener('error', () => { image.style.display = 'none'; });
        avatar.appendChild(image);
      } else {
        const initial = document.createElement('span');
        initial.className = 'message-avatar-initial';
        initial.textContent = sender.initial || sender.name.slice(0, 1);
        avatar.appendChild(initial);
      }
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    if (!isUser && message.from !== 'topotino') {
      const senderName = document.createElement('div');
      senderName.className = 'message-sender';
      senderName.textContent = sender.name;
      bubble.appendChild(senderName);
    }

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
  els.channelCode.textContent = APP_VERSION_CODE;
  els.missionActive.textContent = state.seenBroadcastIds.includes(DAY26_EPILOGUE_MARKER)
    ? 'Canal abierto · sin misión activa'
    : isTopolocoSceneActive()
    ? 'Recuperar el chat secreto'
    : meta.mission || meta.title || 'Reconexión';
  els.watersCount.textContent = `${state.waters.length}/12`;
  els.locationStatus.textContent = state.locationStatus;
  els.formulaDisplay.textContent = FORMULA_WORDS
    .map((word) => state.formulaWords.includes(word) ? FORMULA_LABELS[word] : '???')
    .join(', ');
  if (els.memoryScore) els.memoryScore.textContent = String(state.memoryScore || 0);
  if (els.shadowScore) els.shadowScore.textContent = String(getNetShadow());

  els.watersList.innerHTML = '';
  state.waters.forEach((water, index) => {
    const pill = document.createElement('span');
    pill.className = 'water-pill';
    pill.textContent = `Ventana ${index + 1}`;
    pill.title = 'Conexión recuperada del Mapa de las Doce Aguas';
    els.watersList.appendChild(pill);
  });
}

function renderChallenge() {
  if (!els.challengePanel) return;
  if (busy) {
    els.challengePanel.innerHTML = '';
    els.challengePanel.hidden = true;
    els.challengePanel.classList.remove('is-collapsed');
    return;
  }
  const challenge = getActiveChallenge();
  els.challengePanel.innerHTML = '';
  if (challenge?.kind === 'check-in') {
    els.challengePanel.hidden = true;
    return;
  }
  els.challengePanel.hidden = !challenge;
  if (!challenge) return;

  if (challenge.id !== renderedChallengeId) {
    challengePanelCollapsed = false;
    renderedChallengeId = challenge.id;
  }
  els.challengePanel.classList.toggle('is-collapsed', challengePanelCollapsed);

  const card = document.createElement('section');
  card.className = `challenge-card challenge-${challenge.kind}${challengePanelCollapsed ? ' is-collapsed' : ''}`;

  const heading = document.createElement('div');
  heading.className = 'challenge-heading';
  const place = document.createElement('span');
  place.className = 'challenge-place';
  place.textContent = challenge.place || 'Misión actual';
  const title = document.createElement('strong');
  title.textContent = challenge.title || {
    choice: 'Elegid una respuesta',
    destination: 'Descubrid la siguiente señal',
    'daily-recovery': 'Recordad lo que habéis visto hoy',
    conversation: 'Conversación pendiente'
  }[challenge.kind] || 'Decisión de la aventura';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'challenge-toggle';
  toggle.textContent = challengePanelCollapsed ? 'Ver prueba' : 'Ocultar';
  toggle.setAttribute('aria-expanded', String(!challengePanelCollapsed));
  toggle.addEventListener('click', () => {
    challengePanelCollapsed = !challengePanelCollapsed;
    renderChallenge();
    window.requestAnimationFrame(() => {
      els.messages.scrollTop = els.messages.scrollHeight;
    });
  });
  heading.append(place, title, toggle);
  card.appendChild(heading);

  const content = document.createElement('div');
  content.className = 'challenge-content';

  const attempts = state.challengeAttempts[challenge.id] || 0;
  const recoveryMode = attempts >= 2 && Boolean(challenge.recovery);
  if (challenge.kind === 'conversation') {
    const prompt = document.createElement('p');
    prompt.className = 'challenge-prompt';
    prompt.textContent = chatMessageText(challenge.promptMessages?.at(-1)) || 'Topotino espera vuestra respuesta para continuar.';
    content.appendChild(prompt);
    const help = document.createElement('small');
    help.textContent = 'Responded con una frase breve. No es un examen y cualquier respuesta sirve.';
    content.appendChild(help);
    const focusButton = document.createElement('button');
    focusButton.type = 'button';
    focusButton.className = 'challenge-complete';
    focusButton.textContent = 'Responder en el chat';
    focusButton.addEventListener('click', () => {
      els.chatInput.focus();
      els.chatInput.scrollIntoView({ block: 'nearest' });
    });
    content.appendChild(focusButton);
  } else if (recoveryMode) {
    const explanation = document.createElement('p');
    explanation.textContent = 'Dos intentos no han bastado. Haced esta comprobación y continuamos sin examen.';
    content.appendChild(explanation);
    content.appendChild(renderActionList(challenge.recovery.actions || []));
    content.appendChild(challengeCompleteButton('Ya hemos hecho la comprobación', challenge));
  } else if (challenge.kind === 'expedition' || challenge.kind === 'ending') {
    const intro = document.createElement('p');
    intro.textContent = challenge.intro || 'Realizad estas acciones con calma.';
    content.appendChild(intro);
    content.appendChild(renderActionList(challenge.actions || []));
    content.appendChild(challengeCompleteButton(
      challenge.completionLabel || (challenge.kind === 'ending' ? 'Abrir las doce ventanas' : 'Ya lo hemos hecho'),
      challenge
    ));
  } else {
    const prompt = document.createElement('p');
    prompt.className = 'challenge-prompt';
    prompt.textContent = challenge.prompt;
    content.appendChild(prompt);
    const options = document.createElement('div');
    options.className = 'challenge-options';
    const wrongOptions = state.challengeWrongOptions[challenge.id] || [];
    displayChallengeOptions(challenge).forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.challengeOption = option.id;
      button.textContent = option.text;
      button.disabled = busy || wrongOptions.includes(option.id);
      if (wrongOptions.includes(option.id)) button.classList.add('was-wrong');
      button.addEventListener('click', async () => {
        if (busy || button.disabled) return;
        await handleChallengeOption(challenge, option.id);
      });
      options.appendChild(button);
    });
    content.appendChild(options);
    const help = document.createElement('small');
    help.textContent = 'Podéis tocar una opción o escribir vuestra respuesta a Topotino.';
    content.appendChild(help);
  }

  card.appendChild(content);
  els.challengePanel.appendChild(card);
}

function renderActionList(actions) {
  const list = document.createElement('ol');
  list.className = 'challenge-actions';
  actions.forEach((action) => {
    const item = document.createElement('li');
    item.textContent = action;
    list.appendChild(item);
  });
  return list;
}

function challengeCompleteButton(label, challenge) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'challenge-complete';
  button.dataset.challengeComplete = '1';
  button.disabled = busy;
  button.textContent = label;
  button.addEventListener('click', async () => {
    if (busy || button.disabled) return;
    await handleChallengeCompletion(challenge);
  });
  return button;
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
    createdAt,
    episodeId: message.episodeId || getActiveEpisode()?.meta?.id || null
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

function applyTravelDayRescue() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) < AMARANTE_TRAVEL_DATE) return false;
  if (!STALE_LUANCO_EPISODE_IDS.has(state.activeEpisodeId)) return false;
  const routeEpisode = getEpisode(AMARANTE_ROUTE_EPISODE_ID);
  if (!routeEpisode) return false;

  unlockEpisode(routeEpisode.meta.id);
  saveState({ sync: false });
  return true;
}

function applyDay22FinaleMigration() {
  if (!state.unlocked) return false;

  const alreadyMigrated = state.flags.includes(DAY22_FINALE_MIGRATION_FLAG);
  const hadRetiredRoute = state.finalRoute !== DEFAULT_FINAL_ROUTE ||
    RETIRED_FINAL_EPISODE_IDS.has(state.activeEpisodeId) ||
    (state.unlockedEpisodeIds || []).some((id) => RETIRED_FINAL_EPISODE_IDS.has(id));
  const hadOldDay22Path = (state.completedChallengeIds || []).some((id) => [
    'dia22-pista-algar', 'algar-expedicion', 'algar-q1', 'algar-q2',
    'dia22-pista-jaima', 'jaima-expedicion', 'jaima-q1', 'jaima-q2'
  ].includes(id));
  const legacyFinalWasCompleted = state.flags.includes('completado_sevilla_alhambra_noche') ||
    state.flags.includes('topoloco_derrotado');

  state.finalRoute = DEFAULT_FINAL_ROUTE;
  if (legacyFinalWasCompleted) addUniqueMany(state.flags, ['completado_isla_magica']);
  state.finalRouteLocked = state.flags.includes('completado_isla_magica');
  state.unlockedEpisodeIds = (state.unlockedEpisodeIds || [])
    .filter((id) => !RETIRED_FINAL_EPISODE_IDS.has(id));
  state.scheduledAdultLaunches = (state.scheduledAdultLaunches || [])
    .filter((launch) => !RETIRED_FINAL_EPISODE_IDS.has(launch?.episodeId));

  if (RETIRED_FINAL_EPISODE_IDS.has(state.activeEpisodeId)) {
    addUniqueMany(state.unlockedEpisodeIds, [FINAL_EPISODE_ID]);
    state.activeEpisodeId = FINAL_EPISODE_ID;
  }

  if (legacyFinalWasCompleted) {
    addUniqueMany(state.completedChallengeIds, (CHALLENGE_PACKS[FINAL_EPISODE_ID]?.steps || []).map((step) => step.id));
  }

  if (!alreadyMigrated) addUniqueMany(state.flags, [DAY22_FINALE_MIGRATION_FLAG]);

  if (!alreadyMigrated && hadOldDay22Path && formatDate(getRuntimeNow()) === '2026-08-22') {
    startupRescueMessages = [...startupRescueMessages,
      { from: 'topotina', time: 'auto', text: 'He corregido la señal de hoy. Algar Seco queda solo como una parada opcional; la pista real continúa en el centro antiguo de Albufeira.' },
      { from: 'topotino', time: 'auto', text: 'No habéis perdido nada de lo que ya hicisteis. Seguimos desde la siguiente pista y sin repetir misiones.' }
    ];
  }

  if (!alreadyMigrated || hadRetiredRoute) {
    saveState({ sync: false });
    return true;
  }
  return false;
}

function applyFinaleClarityMigration() {
  if (!state.unlocked) return false;
  if (state.flags.includes(FINALE_CLARITY_MIGRATION_FLAG)) return false;

  const finaleIsOpen = state.unlockedEpisodeIds.includes('016-tavira-sevilla') ||
    state.unlockedEpisodeIds.includes(FINAL_EPISODE_ID);
  if (!finaleIsOpen) return false;

  const legacyTextWasShown = state.messages.some((message) =>
    ['016-tavira-sevilla', FINAL_EPISODE_ID].includes(message.episodeId) &&
    /Borrón ha reaccionado|Corvinho está sobre Tavira|Capitán Pico, América y Krim|Niebla ha combinado/i.test(message.text || '')
  );

  const resetConversationIfRoutePending = (conversationId, routeId) => {
    if (state.completedChallengeIds.includes(routeId)) return;
    state.completedChallengeIds = state.completedChallengeIds.filter((id) => id !== conversationId);
    state.seenBroadcastIds = state.seenBroadcastIds.filter((id) => id !== `dialogo-abierto-${conversationId}`);
  };

  resetConversationIfRoutePending('dialogo-dia24-pista-sevilla', 'dia24-pista-sevilla');
  resetConversationIfRoutePending('dialogo-ruta-dia25', 'ruta-dia25');
  addUniqueMany(state.flags, [FINALE_CLARITY_MIGRATION_FLAG]);

  if (legacyTextWasShown && !state.flags.includes('completado_isla_magica')) {
    startupRescueMessages = [...startupRescueMessages,
      { from: 'topotina', time: 'auto', text: 'He terminado de identificar la alteración. Antes lo nombramos demasiado pronto: Paula y Hugo no tenían por qué saber quién era Borrón.' },
      { from: 'topotina', time: 'auto', text: 'Borrón es un Oscurno de Francia. Cambia etiquetas y quita detalles hasta que todos repiten una sola versión. Primero veremos qué hizo; después seguiremos su rastro.' },
      { from: 'topotino', time: 'auto', text: 'Gracias por aclararlo. Nada de hablar como si los agentes hubieran leído mi archivo secreto, que además yo tampoco recuerdo.' }
    ];
  }

  saveState({ sync: false });
  return true;
}

function applySevillaCardRescue() {
  if (!state.unlocked) return false;
  if (state.seenBroadcastIds.includes(SEVILLA_CARD_RESCUE_MARKER)) return false;
  if (!state.unlockedEpisodeIds.includes('016-tavira-sevilla')) return false;
  if (state.flags.includes('completado_isla_magica')) return false;

  const completed = new Set(state.completedChallengeIds || []);
  const messageText = (state.messages || []).map((message) => message.text || '').join(' ');
  const hasReachedSierpes = completed.has('sevilla-ruta-sierpes') ||
    /Calle Sierpes\.\s*Recorredla hacia la Plaza de San Francisco/i.test(messageText);
  const hasReachedSevilla = hasReachedSierpes ||
    [...completed].some((id) => id === 'dia24-pista-sevilla' || id.startsWith('sevilla-')) ||
    /(?:Las Setas|Plaza de la Encarnaci[oó]n|once testigos)/i.test(messageText);
  if (!hasReachedSevilla) return false;

  const steps = CHALLENGE_PACKS['016-tavira-sevilla']?.steps || [];
  const lastCompletedIndex = steps.reduce((furthest, step, index) =>
    completed.has(step.id) && (step.id === 'dia24-pista-sevilla' || step.id.startsWith('sevilla-'))
      ? Math.max(furthest, index)
      : furthest, -1);
  const sierpesIndex = steps.findIndex((step) => step.id === 'sevilla-ruta-sierpes');
  const rescueThroughIndex = hasReachedSierpes ? Math.max(lastCompletedIndex, sierpesIndex) : lastCompletedIndex;
  addUniqueMany(state.completedChallengeIds, steps.slice(0, rescueThroughIndex + 1).map((step) => step.id));
  addUniqueMany(state.seenBroadcastIds, [SEVILLA_CARD_RESCUE_MARKER]);
  state.activeEpisodeId = '016-tavira-sevilla';
  startupRescueMessages = [...startupRescueMessages,
    { from: 'system', time: 'auto', text: '⚠ Interferencia cruzada retirada: una tarjeta antigua de Tavira se había pegado al canal de Sevilla.' },
    { from: 'topotina', time: 'auto', text: 'Topoloco mezcló dos casillas del mapa. Técnicamente es sabotaje. Técnicamente también es ordenar la historia como un cajón de calcetines.' },
    { from: 'topotino', time: 'auto', text: '¡Y encima ponía «señal segura»! Mi comunicador tiene la sinceridad de una tostadora. No repitáis Tavira: estamos en Sevilla y seguimos desde aquí.' },
    ...(hasReachedSierpes ? [{ from: 'topotina', time: 'auto', text: 'Posición narrativa recuperada: Calle Sierpes. Seguid hacia Plaza de San Francisco; la tarjeta correcta ya está fijada.' }] : [])
  ];
  saveState();
  return true;
}

function applySantaCruzRetreatRescue() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) < '2026-08-25') return false;
  if (state.seenBroadcastIds.includes(SANTA_CRUZ_RETREAT_RESCUE_MARKER)) return false;
  if (!state.unlockedEpisodeIds.includes('016-tavira-sevilla')) return false;
  if (state.flags.includes('completado_isla_magica')) return false;

  const day24Steps = CHALLENGE_PACKS['016-tavira-sevilla']?.steps || [];
  const day24Complete = day24Steps.every((step) => state.completedChallengeIds.includes(step.id));
  const stoppedBeforeSantaCruz = state.completedChallengeIds.includes('sevilla-ruta-santa-cruz') &&
    !state.completedChallengeIds.includes('sevilla-santa-cruz-expedicion');
  const santaCruzPromptWasVisible = (state.messages || []).some((message) =>
    /Santa Cruz|callejuelas.*estrechas|Callej[oó]n del Agua/i.test(message.text || ''));
  if (day24Complete || (!stoppedBeforeSantaCruz && !santaCruzPromptWasVisible)) return false;

  addUniqueMany(state.completedChallengeIds, day24Steps.map((step) => step.id));
  addUniqueMany(state.flags, [
    'completado_tavira_sevilla',
    'sevilla_siete_testigos_t25a0'
  ]);
  addWater('Agua de las Dos Orillas');
  addUniqueMany(state.seenBroadcastIds, [SANTA_CRUZ_RETREAT_RESCUE_MARKER]);
  unlockEpisode(FINAL_EPISODE_ID);
  startupRescueMessages = [...startupRescueMessages,
    { from: 'system', time: 'auto', text: 'CONTINUIDAD RECUPERADA · Última posición válida: entrada de Santa Cruz.' },
    { from: 'topotino', time: 'auto', text: 'Buenos días, Paula y Hugo. Ayer paramos justo antes de investigar Santa Cruz. Hicisteis bien: una aventura no mejora porque sus exploradores terminen arrastrándose.' },
    { from: 'topotina', time: 'auto', text: 'Recuperasteis siete testigos. Esta mañana los cuatro huecos pendientes tienen el sello de Borrón y cuatro cierres nuevos.' },
    { from: 'topotino', time: 'auto', text: 'No repetiremos Santa Cruz ni fingiremos que vimos lo que no vimos. Vamos a recuperar esos huecos donde Borrón los ha escondido.' },
    { from: 'topotina', time: 'auto', text: 'El rastro cruzó el Guadalquivir. Dejó seis marcas de zona, una carabela, «CARTU…» y el engranaje torcido que vimos en Magikland.' },
    { from: 'topotino', time: 'auto', text: 'Una isla dentro de otra isla. Como aparezca una tercera, pido migas de pan y un notario.' }
  ];
  saveState();
  return true;
}

function applyFinalePolishMigration() {
  if (!state.unlocked) return false;
  if (!state.unlockedEpisodeIds.includes(FINAL_EPISODE_ID)) return false;
  if (state.seenBroadcastIds.includes(FINALE_POLISH_MIGRATION_MARKER)) return false;

  const completed = new Set(state.completedChallengeIds || []);
  const hasCompletedAny = (ids) => ids.some((id) => completed.has(id));

  if (hasCompletedAny([
    'isla-q2', 'dialogo-final-isla', 'sevilla-lago-pista', 'sevilla-lago-expedicion',
    'sevilla-lago-q2', 'dialogo-corral-rey', 'corral-rey-expedicion',
    'corral-rey-q1', 'corral-rey-q2', 'final-sevilla-noche'
  ])) {
    addUniqueMany(state.completedChallengeIds, [
      'dialogo-pico-puerto', 'puerta-america-expedicion', 'puerta-america-q1'
    ]);
  }

  if (hasCompletedAny([
    'sevilla-lago-pista', 'sevilla-lago-expedicion',
    'sevilla-lago-q2', 'dialogo-corral-rey', 'corral-rey-expedicion',
    'corral-rey-q1', 'corral-rey-q2', 'final-sevilla-noche'
  ])) {
    addUniqueMany(state.completedChallengeIds, ['dialogo-niebla-senuelo', 'dialogo-topoloco-momento']);
  } else if (completed.has('dialogo-final-isla')) {
    addUniqueMany(state.completedChallengeIds, ['dialogo-niebla-senuelo']);
  }

  if (completed.has('final-sevilla-noche')) {
    addUniqueMany(state.completedChallengeIds, ['dialogo-corral-recuerdos']);
  }

  addUniqueMany(state.seenBroadcastIds, [FINALE_POLISH_MIGRATION_MARKER]);
  saveState({ sync: false });
  return true;
}

function applyFinaleFlexibleRouteMigration() {
  if (!state.unlocked) return false;
  if (!state.unlockedEpisodeIds.includes(FINAL_EPISODE_ID)) return false;
  if (state.seenBroadcastIds.includes(FINALE_FLEXIBLE_ROUTE_MIGRATION_MARKER)) return false;
  if (state.flags.includes('completado_isla_magica')) return false;

  const steps = CHALLENGE_PACKS[FINAL_EPISODE_ID]?.steps || [];
  const fuerteIndex = steps.findIndex((step) => step.id === 'puerta-america-q1');
  if (fuerteIndex >= 0) {
    addUniqueMany(state.completedChallengeIds, steps.slice(0, fuerteIndex + 1).map((step) => step.id));
  }

  const flexibleIds = [
    'dialogo-america-gobernadora', 'dialogo-zona-isla-hallazgo',
    'dialogo-zona-isla-siguiente', 'dialogo-zona-isla-hallazgo-2'
  ];
  const alreadyBeyondFlexibleRoute = [
    'isla-q2', 'dialogo-niebla-senuelo', 'dialogo-final-isla',
    'sevilla-lago-pista', 'sevilla-lago-expedicion', 'sevilla-lago-q2',
    'dialogo-corral-rey', 'corral-rey-expedicion', 'final-sevilla-noche'
  ].some((id) => state.completedChallengeIds.includes(id));
  if (alreadyBeyondFlexibleRoute) addUniqueMany(state.completedChallengeIds, flexibleIds);

  addUniqueMany(state.seenBroadcastIds, [FINALE_FLEXIBLE_ROUTE_MIGRATION_MARKER]);
  startupRescueMessages = [...startupRescueMessages,
    { from: 'system', time: 'auto', text: 'RUTA DEL PARQUE RECALCULADA · El recorrido ya no depende del orden del mapa.' },
    { from: 'topotina', time: 'auto', text: 'He quitado la ruta fija. América preguntará dónde estáis de verdad y ajustará la investigación a esa zona.' },
    { from: 'topotino', time: 'auto', text: 'Por fin. Mi mapa llevaba diez minutos intentando mandar un barco por una escalera.' }
  ];
  saveState({ sync: false });
  return true;
}

function applyFinaleSilenceRescue() {
  if (!state.unlocked) return false;
  if (!state.unlockedEpisodeIds.includes(FINAL_EPISODE_ID)) return false;
  if (state.seenBroadcastIds.includes(FINALE_SILENCE_RESCUE_MARKER)) return false;
  if (state.flags.includes('completado_isla_magica')) return false;

  const steps = CHALLENGE_PACKS[FINAL_EPISODE_ID]?.steps || [];
  const completed = new Set(state.completedChallengeIds || []);
  const silenceIds = [
    'dialogo-silencio-rescate', 'dialogo-silencio-momento',
    'dialogo-silencio-dos-miradas', 'dialogo-silencio-topoloco'
  ];
  const alreadyAtReception = [
    'dialogo-corral-rey', 'corral-rey-expedicion', 'corral-rey-q1',
    'corral-rey-q2', 'dialogo-corral-recuerdos', 'final-sevilla-noche'
  ].some((id) => completed.has(id));

  if (alreadyAtReception) {
    addUniqueMany(state.completedChallengeIds, silenceIds);
  } else {
    const lakeIndex = steps.findIndex((step) => step.id === 'sevilla-lago-q2');
    if (lakeIndex >= 0) {
      addUniqueMany(state.completedChallengeIds, steps.slice(0, lakeIndex + 1).map((step) => step.id));
    }
    state.activeEpisodeId = FINAL_EPISODE_ID;
    startupRescueMessages = [...startupRescueMessages,
      { from: 'system', time: 'auto', text: 'CANAL DE EMERGENCIA · Señal recuperada después de varias horas.' },
      { from: 'topotina', time: 'auto', text: 'He encontrado la causa: Paula y Hugo recorrieron Isla Mágica y Agua Mágica, pero sus respuestas no llegaron al registro.' },
      { from: 'topotino', time: 'auto', text: '¡Menos mal! Creíamos que os había tragado un galeón, una ola o —peor— una cola de cuarenta minutos.' }
    ];
  }

  addUniqueMany(state.seenBroadcastIds, [FINALE_SILENCE_RESCUE_MARKER]);
  saveState({ sync: false });
  return true;
}

function day26EpilogueMessages() {
  return [
    { from: 'system', time: 'auto', text: '26 DE AGOSTO · CONEXIÓN DESPUÉS DE LA VICTORIA' },
    { from: 'topoloco', time: 'auto', text: '¡Exijo una rectificación! Yo no perdí. Realicé una retirada científica en dirección opuesta al triunfo.' },
    { from: 'topotino', time: 'auto', text: '¡¿Cómo sigues dentro del chat?! Tina, dijiste que habías cerrado su acceso.' },
    { from: 'doctora_tecla', time: 'auto', text: 'Lo cerré. Este genio dejó abierta su sesión en mi portátil.' },
    { from: 'topoloco', time: 'auto', text: 'Se llama estrategia de permanencia digital.' },
    { from: 'doctora_tecla', time: 'auto', text: 'Se llama no saber cerrar una pestaña. Y la basura sigue esperando desde Lagos.' },
    { from: 'topoloco', time: 'auto', text: '¡Estoy redactando mis memorias! Capítulo uno: cómo casi vencí doce veces.' },
    { from: 'doctora_tecla', time: 'auto', text: 'Capítulo dos: cómo Tecla pulsó «expulsar usuario».' },
    { from: 'system', time: 'auto', text: 'DOCTOR TOPOLOCO EXPULSADO DEL CANAL' },
    { from: 'doctora_tecla', time: 'auto', text: 'Listo. No soy de vuestro equipo; solo quiero mi portátil y que baje la basura. Adiós.' },
    { from: 'system', time: 'auto', text: 'DOCTORA TECLA HA SALIDO DEL CANAL' },
    { from: 'topotina', time: 'auto', text: 'Canal limpio. He revisado el registro para recordar únicamente los lugares que recorristeis de verdad.' },
    { from: 'topotino', time: 'auto', text: 'Todo empezó con el eclipse. Yo desperté sin casi memoria y vosotros aceptasteis ayudarme con el Cuaderno de la Memoria.' },
    { from: 'topotino', time: 'auto', text: 'En Amarante seguisteis el Tâmega y el puente de São Gonçalo. Después llegaron Magikland, Curia, los jardines del Hotel do Parque y el bosque de Buçaco.' },
    { from: 'topotina', time: 'auto', text: 'En Portugal dos Pequenitos encontrasteis una Batalha diminuta. Fuisteis al monasterio real y después seguisteis la pista de los tres niños hasta Fátima.' },
    { from: 'gotas', time: 'auto', text: 'Luego investigasteis huellas de dinosaurio, bajasteis a las Grutas de Mira de Aire y convertisteis las murallas de Óbidos en vuestro refugio. Cero murciélagos adoptados. Excelente.' },
    { from: 'louri', time: 'auto', text: 'Grabación de Louri: en Dino Parque descubristeis al espía más peligroso, inteligente y compacto de la historia. Era yo. También descubrí que hacer preguntas no es estar roto.' },
    { from: 'topotina', time: 'auto', text: 'En Lisboa recorristeis Baixa y Rossio, experimentasteis en el Pavilhão y observasteis el océano con Vasco.' },
    { from: 'topotino', time: 'auto', text: 'También caminasteis por Alfama y Mouraria y seguisteis el río hasta Belém: los Jerónimos, la torre y el monumento a los navegantes.' },
    { from: 'vasco', time: 'auto', text: 'Desde Lagos buscasteis delfines salvajes y cuevas marinas. Después leísteis las rocas de Ponta da Piedade y aprendisteis en Zoomarine que ayudar no significa poseer.' },
    { from: 'topotino', time: 'auto', text: 'En Albufeira recuperasteis la parte de 1755 que Eco había borrado y dormisteis en el Refugio de Lona. En Tavira seguisteis el Gilão hasta la última pista portuguesa.' },
    { from: 'america', time: 'auto', text: 'En Sevilla perseguisteis a Borrón desde las Setas y Sierpes por las plazas del centro, la Catedral, la Giralda y la Plaza del Triunfo. Y supisteis parar antes de Santa Cruz.' },
    { from: 'capitan_pico', time: 'auto', text: 'Después recorristeis Isla Mágica y Agua Mágica sin contestar al chat. Casi organizo un rescate con un flotador en la cabeza. Era un plan naval avanzado.' },
    { from: 'america', time: 'auto', text: 'Terminasteis junto a nosotros cuando llegó Carlos I. Muchas voces, errores y ayuda demostraron que ninguna historia verdadera necesita un único dueño.' },
    { from: 'topotina', time: 'auto', text: 'El Corrector cayó, las doce ventanas se abrieron y cada recuerdo volvió a quien lo había vivido. Resultado técnico: victoria completa.' },
    { from: 'gotas', time: 'auto', text: 'Gracias por mirar el agua, la roca y los lugares con paciencia. Hasta yo he aprendido que una gota pequeña puede acabar metida en una aventura enorme.' },
    { from: 'vasco', time: 'auto', text: 'Gracias por observar a los animales sin creer que os pertenecían y por aceptar que no verlo todo también forma parte de investigar.' },
    { from: 'capitan_pico', time: 'auto', text: 'Gracias, exploradores. Conservo mi título de capitán gracias a que América se negó a revisar la documentación.' },
    { from: 'america', time: 'auto', text: 'La revisé. Está dibujada con lápiz de colores. Gracias, Paula y Hugo, por traer imaginación sin dejar de comprobar lo que veíais.' },
    { from: 'topotino', time: 'auto', text: 'Hugo, gracias por tu valor, tus preguntas y tus ganas de entrar en cada aventura. Paula, gracias por orientarnos, pensar con calma y descubrir detalles que a los demás se nos escapaban.' },
    { from: 'topotino', time: 'auto', text: 'Y gracias a toda la familia por llevarnos de un lugar a otro cuando nosotros solo enviábamos pistas bastante sospechosas.' },
    { from: 'topotino', time: 'auto', text: 'Hoy no hay misión. Guardad el Cuaderno de la Memoria: esta aventura termina, pero el canal secreto seguirá abierto.' },
    { from: 'topotino', time: 'auto', text: 'Porque algún día puede aparecer otra carta, una coordenada imposible o un ruido debajo de una maceta. Y entonces espero poder volver a decir: Paula, Hugo… os necesito.' }
  ];
}

function applyDay26Epilogue() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) < DAY26_EPILOGUE_DATE) return false;
  if (!state.flags.includes('completado_isla_magica')) return false;
  if (!state.completedChallengeIds.includes('final-sevilla-noche')) return false;
  if (state.seenBroadcastIds.includes(DAY26_EPILOGUE_MARKER)) return false;

  addUniqueMany(state.seenBroadcastIds, [DAY26_EPILOGUE_MARKER]);
  startupRescueMessages = [...startupRescueMessages, ...day26EpilogueMessages()];
  startupEpiloguePending = true;
  saveState({ sync: false });
  return true;
}

function applyZoomarineTransitionRescue() {
  if (!state.unlocked) return false;
  if (state.seenBroadcastIds.includes(ZOOMARINE_TRANSITION_RESCUE_MARKER)) return false;
  if (state.activeEpisodeId !== '015-zoomarine') return false;
  if (!state.completedChallengeIds.includes('zoomarine-q2')) return false;
  if (state.completedChallengeIds.includes('ruta-dia24')) return false;

  const conversationId = 'dialogo-ruta-dia24';
  const conversationWasOpened = state.seenBroadcastIds.includes(`dialogo-abierto-${conversationId}`);
  if (!conversationWasOpened && !state.completedChallengeIds.includes(conversationId)) return false;

  addUniqueMany(state.completedChallengeIds, [conversationId]);
  addUniqueMany(state.seenBroadcastIds, [ZOOMARINE_TRANSITION_RESCUE_MARKER]);
  startupRescueMessages = [...startupRescueMessages,
    { from: 'system', time: 'auto', text: 'Transición de Zoomarine recuperada. No tenéis que repetir ninguna respuesta.' },
    { from: 'topotina', time: 'auto', text: 'El canal se cortó justo después de vuestra conclusión, pero quedó guardada correctamente.' },
    { from: 'topotino', time: 'auto', text: 'Ya lo tengo claro: cuidar no convierte a nadie en dueño. Retener mis recuerdos no fue protegerlos.' },
    { from: 'topotina', time: 'auto', text: 'Esa conclusión ha hecho reaccionar a Borrón. Ha escrito una palabra falsa sobre un puente de siete arcos. La siguiente pista ya está preparada.' }
  ];
  saveState({ sync: false });
  return true;
}

function applyAmaranteCompletionRescue() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) !== AMARANTE_TRAVEL_DATE) return false;
  if (state.flags.includes('completado_amarante')) return false;
  if (state.seenBroadcastIds.includes(AMARANTE_RESCUE_MARKER)) return false;
  if (!state.unlockedEpisodeIds.includes(AMARANTE_EPISODE_ID)) return false;

  addUniqueMany(state.flags, [
    'amarante_historia_comprendida',
    'amarante_animal_tamega',
    'amarante_piedras_observadas',
    'diario_amarante',
    'completado_amarante'
  ]);
  addWater('Agua del Puente');
  addFormulaWord('COMIENZO');
  state.memoryScore = Math.max(1, Number(state.memoryScore || 0));
  state.seenBroadcastIds.push(AMARANTE_RESCUE_MARKER);
  startupRescueMessages = [
    { from: 'topotino', time: 'auto', text: 'Paula, Hugo: misión cumplida. Habéis investigado Amarante de verdad y no voy a pediros que repitáis ninguna respuesta.' },
    { from: 'topotino', time: 'auto', text: 'Habéis unido la ponte, la memoria de 1809, la tradición de São Gonçalo y distintas formas de mirar el Tâmega. Muy buen trabajo, agentes.' },
    { from: 'topotino', time: 'auto', text: 'La muestra queda guardada como Agua del Puente. Amarante está terminada.' },
    { from: 'topotino', time: 'auto', text: 'Para mañana recuerdo un lugar imposible: África, lejano Oeste, zoco, piratas y poblado medieval, todo junto. Tendremos que descubrir si existe.' },
    { from: 'topotino', time: 'auto', text: 'Preparad bañador, toalla, protector solar, agua y calzado cómodo. Ahora cenad y descansad. Seguimos mañana.' }
  ];
  saveState();
  return true;
}

function applyDay14SecurityCheckIn() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) !== SECURITY_CHECKIN_DATE) return false;
  if (state.flags.includes(SECURITY_CONFIRMED_FLAG)) return false;
  if (!state.flags.includes('completado_amarante') && !['005-amarante-puente', '006-magikland-curia'].includes(state.activeEpisodeId)) return false;

  addUniqueMany(state.flags, [SECURITY_ANNOUNCED_FLAG]);
  const existingTexts = new Set(state.messages.map((message) => message.text));
  const missingMessages = SECURITY_CHECKIN_MESSAGES
    .filter((message) => !existingTexts.has(message))
    .map((text) => ({ from: 'topotino', time: 'auto', text }));
  startupRescueMessages = [...startupRescueMessages, ...missingMessages];
  saveState();
  return true;
}

function applyDay14MachineClarification() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) !== SECURITY_CHECKIN_DATE) return false;
  if (state.flags.includes(MACHINE_CLARIFIED_FLAG)) return false;
  if (!state.completedChallengeIds.includes('magikland-q2')) return false;

  addUniqueMany(state.flags, [MACHINE_CLARIFIED_FLAG]);
  startupRescueMessages = [...startupRescueMessages,
    { from: 'topotino', time: 'auto', text: 'Alto, agentes. Antes de seguir tengo que explicar bien lo que acabamos de descubrir. Lo conté fatal.' },
    { from: 'topotino', time: 'auto', text: 'No había una máquina física que vosotros debierais encontrar en Magikland.' },
    { from: 'topotino', time: 'auto', text: 'Mientras observabais los movimientos, mis aparatos recibieron un programa escondido en la señal del mapa. Marcaba GIRO, IDA Y VUELTA, DESPLAZAMIENTO y RECUERDO.' },
    { from: 'topotino', time: 'auto', text: 'El programa se llama Cazarrisas. Topoloco lo usa para aprender qué convierte un momento vivido en un recuerdo que dura.' },
    { from: 'system', time: 'auto', text: 'Una conexión externa solicita acceso: TOPOTINA.' },
    { from: 'topotina', time: 'auto', text: 'Hola otra vez, Paula y Hugo. Soy Topotina. Y sí, Topotino: soy tu hermana.' },
    { from: 'topotino', time: 'auto', text: 'Eso todavía está por demostrar. Podrías ser una técnica muy informada.' },
    { from: 'topotina', time: 'auto', text: 'Yo construí las doce ventanas. Tú escondiste las rutas. Además guardas una galleta detrás del transmisor.' },
    { from: 'topotino', time: 'auto', text: '¡Información reservada! De acuerdo: «técnica misteriosa con mis orejas».' },
    { from: 'topotina', time: 'auto', text: 'Son nuestras orejas, hermano cabezota. He separado una coordenada del Cazarrisas y la ruta de Curia ya está guardada.' },
    { from: 'topotino', time: 'auto', text: 'Curia está descubierta, pero la misión del hotel seguirá cerrada hasta que lleguéis. Esta vez no me adelanto.' }
  ];
  saveState();
  return true;
}

function applyObidosArrivalRescue() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) !== OBIDOS_RESCUE_DATE) return false;
  if (state.seenBroadcastIds.includes(OBIDOS_RESCUE_MARKER)) return false;
  if (!state.unlockedEpisodeIds.includes(OBIDOS_EPISODE_ID)) return false;

  const reachedObidos = state.completedChallengeIds.includes('dia16-pista-obidos') ||
    state.completedChallengeIds.some((id) => id.startsWith('obidos-')) ||
    state.flags.includes('obidos_llegada') ||
    state.flags.includes('completado_huellas_mira_obidos');
  if (!reachedObidos) return false;

  const completedBeforeArrival = [
    'pegadas-expedicion',
    'pegadas-q1',
    'pegadas-q2',
    'dia16-pista-mira',
    'mira-q1',
    'mira-expedicion',
    'mira-q2',
    'dia16-pista-obidos'
  ];
  const resetChallengeIds = [
    'obidos-expedicion',
    'obidos-q1',
    'obidos-q2',
    'recuperacion-dia16',
    'ruta-dia17'
  ];

  addUniqueMany(state.completedChallengeIds, completedBeforeArrival);
  state.completedChallengeIds = state.completedChallengeIds.filter((id) => !resetChallengeIds.includes(id));
  resetChallengeIds.forEach((id) => {
    delete state.challengeAttempts[id];
    delete state.challengeWrongOptions[id];
  });
  state.flags = state.flags.filter((flag) => !['obidos_llegada', 'completado_huellas_mira_obidos'].includes(flag));
  state.waters = state.waters.filter((water) => water !== 'Agua del Tiempo Profundo');
  state.storyMemory = state.storyMemory.filter((item) => !String(item?.responseId || '').includes('obidos'));
  state.seenBroadcastIds = state.seenBroadcastIds.filter((id) => id !== OBIDOS_ARRIVAL_MARKER);
  state.seenBroadcastIds.push(OBIDOS_RESCUE_MARKER);
  state.activeEpisodeId = OBIDOS_EPISODE_ID;
  state.lastKnownPosition = {
    lat: 39.3605,
    lng: -9.1570,
    accuracy: 20,
    capturedAt: new Date().toISOString(),
    source: 'obidos-rescue-t21a1'
  };
  state.locationStatus = 'Llegada confirmada: Óbidos.';
  startupRescueMessages = [...startupRescueMessages,
    { from: 'topotina', time: 'auto', text: 'He recuperado la señal de llegada. Huellas y Mira de Aire siguen guardadas. Solo reinicio la misión de Óbidos.' },
    { from: 'topotino', time: 'auto', text: '¡Paula, Hugo: acabamos de llegar a Óbidos! Antes de investigar las murallas, hay una noticia importante.' },
    { from: 'topotino', time: 'auto', text: 'Topotino del pasado os dejó un refugio dentro de la muralla: Segredos da Muralha, Rua do Facho 35.' }
  ];
  saveState();
  return true;
}

function shouldCheckLisbonArrivalRescue() {
  if (!state.unlocked) return false;
  if (formatDate(getRuntimeNow()) !== LISBON_RESCUE_DATE) return false;
  if (state.seenBroadcastIds.includes(LISBON_RESCUE_MARKER)) return false;
  return state.activeEpisodeId === LISBON_RESCUE_EPISODE_ID;
}

async function refreshLocationForLisbonArrivalRescue() {
  if (!shouldCheckLisbonArrivalRescue() || !navigator.geolocation) return;
  if (lastLocationIsFresh(LOCATION_REFRESH_COOLDOWN_MS)) return;

  try {
    const position = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 30000
    });
    state.lastKnownPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: Math.round(position.coords.accuracy || 0),
      capturedAt: new Date().toISOString(),
      source: 'lisbon-continuity-rescue'
    };
    state.locationStatus = `Señal actualizada (${state.lastKnownPosition.accuracy || '?'} m).`;
    saveState();
  } catch (error) {
    state.locationStatus = locationErrorMessage(error);
  }
}

function applyLisbonArrivalRescue() {
  if (!shouldCheckLisbonArrivalRescue()) return false;
  if (!locationMatches(LISBON_RESCUE_LOCATION)) return false;

  addUniqueMany(state.completedChallengeIds, [
    'dinoparque-expedicion',
    'dinoparque-q1',
    'dinoparque-q2',
    'louri-cambio-bando',
    'dialogo-dia17-pista-lisboa',
    'dia17-pista-lisboa'
  ]);
  addUniqueMany(state.flags, ['louri_descubierto', 'louri_libre', 'louri_canal_cerrado']);
  addUniqueMany(state.seenBroadcastIds, [
    LISBON_RESCUE_MARKER,
    'dialogo-abierto-dialogo-dia17-pista-lisboa'
  ]);
  state.activeEpisodeId = LISBON_RESCUE_EPISODE_ID;
  state.locationStatus = 'Llegada confirmada: Lisboa.';
  startupRescueMessages = [...startupRescueMessages,
    { from: 'topotina', time: 'auto', text: 'Coordenada confirmada: LISBOA. La señal se había quedado enganchada a la última transmisión de Louri. Ya la he cortado.' },
    { from: 'topotino', time: 'auto', text: 'Dino Parque queda atrás. El canal de Louri está cerrado y no repetiremos nada de allí.' },
    { from: 'topotino', time: 'auto', text: 'Su fragmento nos ha traído hasta Lisboa. Topoloco estudia cómo esta ciudad se reconstruyó después de ser destruida.' },
    { from: 'topotino', time: 'auto', text: 'Ya estamos donde termina la coordenada. Ahora vamos a orientarnos en la Baixa y comprobar qué parte de la máquina escondió aquí.' }
  ];
  saveState();
  return true;
}

function isStaleLuancoEpisode(episode) {
  return STALE_LUANCO_EPISODE_IDS.has(episode?.meta?.id) &&
    formatDate(getRuntimeNow()) >= AMARANTE_TRAVEL_DATE;
}

function addWater(water) {
  if (!state.waters.includes(water)) state.waters.push(water);
}

function addFormulaWord(word) {
  const normalized = normalizeFormulaWord(word);
  if (!state.formulaWords.includes(normalized)) state.formulaWords.push(normalized);
}

function recordStoryMemory(config, userText, episode, guided) {
  const text = String(userText || '').trim().slice(0, 600);
  if (!text) return;

  const details = typeof config === 'string' ? { label: config } : (config || {});
  const id = String(details.id || `${episode.meta.id}:${guided.id}`);
  const item = {
    id,
    episodeId: episode.meta.id,
    episodeTitle: episode.meta.title || '',
    responseId: guided.id,
    kind: String(details.kind || 'observation').slice(0, 40),
    label: String(details.label || guided.id).slice(0, 120),
    text,
    createdAt: Date.now()
  };

  const existingIndex = state.storyMemory.findIndex((memory) => memory.id === id);
  if (existingIndex >= 0) state.storyMemory.splice(existingIndex, 1);
  state.storyMemory.push(item);
  if (state.storyMemory.length > MAX_STORY_MEMORY_ITEMS) {
    state.storyMemory.splice(0, state.storyMemory.length - MAX_STORY_MEMORY_ITEMS);
  }
}

function normalizeStoryMemory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-MAX_STORY_MEMORY_ITEMS).map((item, index) => ({
    id: String(item?.id || `legacy-memory-${index}`),
    episodeId: String(item?.episodeId || ''),
    episodeTitle: String(item?.episodeTitle || '').slice(0, 120),
    responseId: String(item?.responseId || ''),
    kind: String(item?.kind || 'observation').slice(0, 40),
    label: String(item?.label || 'Recuerdo del viaje').slice(0, 120),
    text: String(item?.text || '').slice(0, 600),
    createdAt: Number(item?.createdAt) || Date.now()
  })).filter((item) => item.text);
}

function eligibleMessages(messages) {
  return (messages || []).filter((message) => {
    const requiredFlags = message.requiredFlags || [];
    if (requiredFlags.length && !requiredFlags.every((flag) => state.flags.includes(flag))) return false;
    const blockedFlags = message.blockedFlags || [];
    if (blockedFlags.some((flag) => state.flags.includes(flag))) return false;
    return true;
  });
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

function dateTimeMatches(rule, now) {
  const current = now.getTime();
  const from = rule.from ? new Date(rule.from).getTime() : null;
  const to = rule.to ? new Date(rule.to).getTime() : null;
  if (Number.isFinite(from) && current < from) return false;
  if (Number.isFinite(to) && current > to) return false;
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
  const accuracyMargin = Math.min(Math.max(Number(pos.accuracy) || 0, 0), 500);
  return distance <= (rule.radiusMeters || 300) + accuracyMargin;
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

function setBusy(nextBusy, showTyping = nextBusy, senderId = 'topotino') {
  busy = nextBusy;
  if (showTyping && els.typingText) {
    els.typingText.textContent = senderId === 'topotino'
      ? nextTypingMessage()
      : senderId === 'system'
        ? 'El canal está conectando a alguien...'
        : senderId === 'topotina'
          ? 'Topotina está escribiendo...'
          : senderId === 'gotas'
            ? 'Gotas está escribiendo...'
            : senderId === 'louri'
              ? 'Louri está escribiendo con sus brazos tácticos...'
              : CHAT_SENDERS[senderId]
                ? `${CHAT_SENDERS[senderId].name} está escribiendo...`
                : 'Alguien está escribiendo...';
  }
  els.typing.hidden = !showTyping;
  els.sendButton.disabled = nextBusy;
  els.chatInput.disabled = nextBusy;
  els.challengePanel?.querySelectorAll('button').forEach((button) => {
    button.disabled = nextBusy || button.classList.contains('was-wrong');
  });
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
  if (isAdultMode && isAdultUnlocked()) {
    showAdultTools(true);
  } else {
    showAdultTools(false);
  }
  renderAdultPanel();
  if (isAdultMode && state.unlocked) {
    scheduleStateSync();
  }
}

function renderAdultPanel() {
  if (!isAdultMode || !els.adultPanel) return;

  if (els.adultSyncStatus) {
    els.adultSyncStatus.textContent = adultSyncLabel();
  }
  if (!isAdultUnlocked()) return;

  els.adultRecoveryCode.textContent = state.recoveryCode || 'Sin crear';
  els.adultSyncStatus.textContent = adultSyncLabel();
  els.adultLastSync.textContent = state.lastSyncedAt
    ? `Última copia: ${formatDateTime(new Date(state.lastSyncedAt))}`
    : 'Última copia: pendiente';
  renderAdultPhaseLauncher();
  renderAdultFinalRoute();
}

function adultSyncLabel() {
  if (state.syncStatus === 'synced') return 'Copia segura';
  if (state.syncStatus === 'syncing') return 'Sincronizando...';
  if (state.syncStatus === 'pending') return 'Pendiente de copia';
  if (state.syncStatus === 'offline') return 'Solo local';
  return 'Copia local';
}

function isAdultUnlocked() {
  return sessionStorage.getItem(ADULT_SESSION_KEY) === '1';
}

function showAdultTools(show) {
  if (els.adultLock) els.adultLock.hidden = show;
  if (els.adultTools) els.adultTools.hidden = !show;
}

async function unlockAdultTools() {
  const hash = await sha256Hex(String(els.adultPin?.value || '').trim());
  if (hash !== ADULT_PIN_HASH) {
    showAdultMessage('PIN adulto incorrecto.');
    return;
  }
  sessionStorage.setItem(ADULT_SESSION_KEY, '1');
  if (els.adultPin) els.adultPin.value = '';
  showAdultTools(true);
  renderAdultPanel();
  showAdultMessage('Panel adulto abierto.');
}

function renderAdultPhaseLauncher() {
  if (!els.adultPhaseSelect || !els.adultPhaseStatus) return;

  const selected = els.adultPhaseSelect.value;
  els.adultPhaseSelect.innerHTML = '';

  episodes
    .filter((episode) => !episode.meta.startsUnlocked)
    .forEach((episode) => {
      const option = document.createElement('option');
      option.value = episode.meta.id;
      const status = isEpisodeUnlocked(episode.meta.id) ? 'activa' : 'bloqueada';
      option.textContent = `${episode.meta.order || ''}. ${episode.meta.title || episode.meta.id} (${status})`;
      els.adultPhaseSelect.appendChild(option);
    });

  if ([...els.adultPhaseSelect.options].some((option) => option.value === selected)) {
    els.adultPhaseSelect.value = selected;
  }

  const pending = (state.scheduledAdultLaunches || [])
    .filter((launch) => launch && launch.episodeId)
    .sort((a, b) => Number(a.unlockAt) - Number(b.unlockAt));

  els.adultPhaseStatus.textContent = pending.length
    ? `Pendiente: ${pending.map((launch) => `${launch.episodeId} a las ${formatDateTime(new Date(launch.unlockAt))}`).join(' · ')}`
    : 'Sin lanzamientos pendientes.';
}

function renderAdultFinalRoute() {
  if (!els.adultFinalRoute || !els.adultFinalRouteStatus) return;
  els.adultFinalRoute.value = DEFAULT_FINAL_ROUTE;
  els.adultFinalRoute.disabled = true;
  els.adultFinalRouteStatus.textContent = state.finalRouteLocked
    ? 'Final completado en Isla Mágica.'
    : state.flags.includes(EARLY_SEVILLA_FINAL_FLAG)
      ? 'Cierre nocturno disponible desde ahora.'
      : 'Final preparado para la tarde del 25 en Isla Mágica.';
  if (els.adultOpenFinal) {
    els.adultOpenFinal.disabled = Boolean(state.finalRouteLocked || state.flags.includes(EARLY_SEVILLA_FINAL_FLAG));
  }
}

function updateAdultFinalRoute() {
  if (!isAdultUnlocked()) return;
  state.finalRoute = DEFAULT_FINAL_ROUTE;
  saveState();
  renderAdultFinalRoute();
  showAdultMessage('El final único está fijado en Isla Mágica, Sevilla.');
}

function openSevillaFinalNow() {
  if (!isAdultUnlocked() || state.finalRouteLocked) return;
  addUniqueMany(state.flags, [EARLY_SEVILLA_FINAL_FLAG]);
  saveState();
  renderAll();
  renderAdultFinalRoute();
  showAdultMessage('El diálogo final de Isla Mágica ya puede comenzar cuando llegue su turno.');
}

function scheduleAdultPhaseLaunch() {
  if (!isAdultUnlocked()) return;
  const episodeId = els.adultPhaseSelect?.value;
  const episode = getEpisode(episodeId);
  if (!episode) {
    showAdultMessage('Elige una fase válida.');
    return;
  }
  if (isEpisodeUnlocked(episodeId)) {
    showAdultMessage('Esa fase ya está activa en este móvil.');
    return;
  }

  const launchDelay = getAdultLaunchDelay();
  const unlockAt = Date.now() + launchDelay;
  state.scheduledAdultLaunches = (state.scheduledAdultLaunches || [])
    .filter((launch) => launch.episodeId !== episodeId);
  state.scheduledAdultLaunches.push({
    episodeId,
    unlockAt,
    createdAt: Date.now()
  });

  saveState();
  scheduleNextAdultLaunchTimer();
  renderAdultPanel();
  showAdultMessage(`${episode.meta.title || episodeId} se lanzará a las ${formatDateTime(new Date(unlockAt))}.`);
}

function getAdultLaunchDelay() {
  const customDelay = Number(params.get('launchDelayMs'));
  if (isAdultMode && Number.isFinite(customDelay) && customDelay >= 0) return customDelay;
  return ADULT_PHASE_DELAY_MS;
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
  sessionStorage.removeItem(ADULT_SESSION_KEY);
  localStorage.removeItem(STORAGE_KEYS.auth);
  localStorage.removeItem(STORAGE_KEYS.state);
  localStorage.removeItem(LEGACY_STATE_KEY);
  window.location.href = `${window.location.pathname}?topoadulto=1`;
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
    storyMemory: state.storyMemory,
    completedChallengeIds: state.completedChallengeIds,
    challengeAttempts: state.challengeAttempts,
    challengeWrongOptions: state.challengeWrongOptions,
    memoryScore: state.memoryScore,
    shadowScore: state.shadowScore,
    recoveredShadow: state.recoveredShadow,
    endingVariant: state.endingVariant,
    finalRoute: state.finalRoute,
    finalRouteLocked: state.finalRouteLocked,
    narrativeScene: state.narrativeScene,
    softResponseCursor: state.softResponseCursor,
    hintMissCursor: state.hintMissCursor,
    chatterWarningCursor: state.chatterWarningCursor,
    lastChatterWarningAt: state.lastChatterWarningAt,
    typingMessageCursor: state.typingMessageCursor,
    runtimeNowOverride: state.runtimeNowOverride,
    lastKnownPosition: state.lastKnownPosition,
    locationStatus: state.locationStatus,
    locationNoticeShown: state.locationNoticeShown,
    scheduledAdultLaunches: state.scheduledAdultLaunches,
    seenBroadcastIds: state.seenBroadcastIds,
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
    storyMemory: normalizeStoryMemory(remoteState.storyMemory),
    completedChallengeIds: remoteState.completedChallengeIds || [],
    challengeAttempts: remoteState.challengeAttempts || {},
    challengeWrongOptions: remoteState.challengeWrongOptions || {},
    memoryScore: Number(remoteState.memoryScore) || ((remoteState.flags || []).includes('completado_amarante') ? 1 : 0),
    shadowScore: Number(remoteState.shadowScore) || 0,
    recoveredShadow: Number(remoteState.recoveredShadow) || 0,
    endingVariant: remoteState.endingVariant || null,
    finalRoute: DEFAULT_FINAL_ROUTE,
    finalRouteLocked: Boolean(remoteState.finalRouteLocked || (remoteState.flags || []).includes('completado_isla_magica')),
    narrativeScene: remoteState.narrativeScene || null,
    softResponseCursor: remoteState.softResponseCursor || {},
    chatterWarningCursor: remoteState.chatterWarningCursor || 0,
    lastChatterWarningAt: remoteState.lastChatterWarningAt || 0,
    typingMessageCursor: remoteState.typingMessageCursor || 0,
    runtimeNowOverride: remoteState.runtimeNowOverride || null,
    lastKnownPosition: remoteState.lastKnownPosition || null,
    locationStatus: remoteState.locationStatus || 'Sin posición actualizada.',
    locationNoticeShown: Boolean(remoteState.locationNoticeShown),
    scheduledAdultLaunches: remoteState.scheduledAdultLaunches || [],
    seenBroadcastIds: remoteState.seenBroadcastIds || [],
    channelId: remoteState.channelId || state.channelId,
    recoveryCode: recoveryCode || state.recoveryCode,
    revision: Number(remoteState.revision) || state.revision,
    lastSyncedAt: remoteState.lastSyncedAt || state.lastSyncedAt,
    syncStatus: 'synced',
    syncError: null
  });
  applyDay22FinaleMigration();
  applyFinaleClarityMigration();
  applySevillaCardRescue();
  applySantaCruzRetreatRescue();
  applyFinalePolishMigration();
  applyFinaleFlexibleRouteMigration();
  applyFinaleSilenceRescue();
  applyDay26Epilogue();
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
    scheduleNextAdultLaunchTimer();
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
      storyMemory: normalizeStoryMemory(saved.storyMemory),
      completedChallengeIds: saved.completedChallengeIds || [],
      challengeAttempts: saved.challengeAttempts || {},
      challengeWrongOptions: saved.challengeWrongOptions || {},
      memoryScore: Number(saved.memoryScore) || ((saved.flags || []).includes('completado_amarante') ? 1 : 0),
      shadowScore: Number(saved.shadowScore) || 0,
      recoveredShadow: Number(saved.recoveredShadow) || 0,
      endingVariant: saved.endingVariant || null,
      finalRoute: DEFAULT_FINAL_ROUTE,
      finalRouteLocked: Boolean(saved.finalRouteLocked || (saved.flags || []).includes('completado_isla_magica')),
      narrativeScene: saved.narrativeScene || null,
      softResponseCursor: saved.softResponseCursor || {},
      hintMissCursor: saved.hintMissCursor || {},
      chatterWarningCursor: saved.chatterWarningCursor || 0,
      lastChatterWarningAt: saved.lastChatterWarningAt || 0,
      typingMessageCursor: saved.typingMessageCursor || 0,
      runtimeNowOverride: saved.runtimeNowOverride || null,
      lastKnownPosition: saved.lastKnownPosition || state.lastKnownPosition,
      locationStatus: saved.locationStatus || state.locationStatus,
      locationNoticeShown: Boolean(saved.locationNoticeShown),
      scheduledAdultLaunches: saved.scheduledAdultLaunches || [],
      seenBroadcastIds: saved.seenBroadcastIds || [],
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
    navigator.serviceWorker.register('service-worker.js?v=offline-v54').catch(() => {});
  }
}
