/* ═══════════════════════════════════════════════════════════
   TOPOTINO — OPERACIÓN LONDRES
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'topotino_op_v2';
const DEADLINE = new Date('2026-04-26T10:00:00+01:00'); // Europe/London BST

// Agents (case-insensitive comparison)
const AGENT1 = 'paula';
const AGENT2 = 'hugo';
const SECRET_CITY = ['carcasone', 'carcasona']; // accept both spellings
const LOCATION_BYPASS_CODE = 'topotino1942';

// The hidden phrase: LONDRESBRILLA
// 12 missions → letters assigned in missions.js
// Tower Bridge = "L", Covent Garden = "LA" (2 letters for the finale)
const FULL_PHRASE = 'LONDRESBRILLA';

// ── STATE ────────────────────────────────────────────────────
let state = {
  authenticated: false,
  missions: {},
  lettersCollected: [],  // array of collected letter strings, in order collected
  timeoutAcknowledged: false
};

let currentMissionId = null;
let currentQuestionIndex = 0;
let questionAnswered = false;
let prevScreen = 'map';

// Hidden restart: tap logo 7 times within 2s
let tapCount = 0;
let tapTimer = null;
let revealTapCount = 0;
let revealTapTimer = null;
let missionResetTapCount = 0;
let missionResetTapTimer = null;
let fullResetTapCount = 0;
let fullResetTapTimer = null;
let locationBypass = false;

// ── INIT ─────────────────────────────────────────────────────
function initApp() {
  loadState();
  registerServiceWorker();
  bindStaticButtons();
  setupHiddenRestart();
  setupHiddenFullReset();
  setupHiddenMissionReset();
  setupHiddenLocationBypass();
  bindImageLightbox();
  startCountdownTick();

  if (state.authenticated) {
    renderMap();
    if (isDeadlineExpired() && !state.timeoutAcknowledged && getCompletedCount() < MISSIONS.length) {
      showScreen('timeout');
    } else {
      showScreen('map');
    }
  } else {
    showScreen('auth');
  }
}

function setupHiddenRestart() {
  const logo = document.getElementById('topotino-tap');
  if (!logo) return;
  logo.addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 2000);
    if (tapCount >= 7) {
      tapCount = 0;
      if (confirm('¿Reiniciar la operación completa? Se borrará todo el progreso.')) {
        resetGame();
      }
    }
  });
}

function setupHiddenFullReset() {
  // Secret gesture for mobile: 6 taps in <= 2.4s on map telemetry labels
  const secretTargets = ['countdown-map', 'map-letters-display'];
  secretTargets.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', triggerHiddenFullReset);
  });
}

function triggerHiddenFullReset() {
  fullResetTapCount++;
  clearTimeout(fullResetTapTimer);
  fullResetTapTimer = setTimeout(() => { fullResetTapCount = 0; }, 2400);
  if (fullResetTapCount >= 6) {
    fullResetTapCount = 0;
    if (confirm('Modo secreto: ¿reiniciar toda la operación desde cero?')) {
      resetGame();
    }
  }
}

function setupHiddenMissionReset() {
  // Secret gesture: 5 taps in <= 2.2s on mission-only labels
  const secretTargets = ['mission-codename', 'reveal-name', 'q-counter'];
  secretTargets.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', triggerHiddenMissionReset);
  });
}

function triggerHiddenMissionReset() {
  if (!currentMissionId) return;
  missionResetTapCount++;
  clearTimeout(missionResetTapTimer);
  missionResetTapTimer = setTimeout(() => { missionResetTapCount = 0; }, 2200);
  if (missionResetTapCount >= 5) {
    missionResetTapCount = 0;
    if (confirm('Modo secreto: ¿reiniciar esta misión desde cero?')) {
      resetCurrentMission(currentMissionId);
    }
  }
}

// ── SCREENS ──────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
}

function maskLetters(letra) {
  if (!letra) return '?';
  return letra.length === 1 ? '□' : '□ '.repeat(letra.length).trim();
}

function setLocationStatus(text, tone) {
  const el = document.getElementById('location-check-status');
  if (!el) return;
  el.textContent = text;
  el.className = 'location-check-status ' + (tone || 'info');
}

function formatParagraphs(text) {
  if (!text) return '<p>Sin informe disponible.</p>';
  return text
    .split(/\\n\\s*\\n/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => `<p>${block}</p>`)
    .join('');
}

function typewriterInto(el, text, speed = 26) {
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

function launchVictoryParticles() {
  const box = document.getElementById('victory-celebration');
  if (!box) return;
  box.innerHTML = '';
  const colors = ['gold', 'ink', ''];
  for (let i = 0; i < 34; i++) {
    const p = document.createElement('span');
    p.className = 'victory-particle ' + colors[i % colors.length];
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--drift', `${(Math.random() * 120) - 60}px`);
    p.style.animationDelay = `${Math.random() * 380}ms`;
    p.style.animationDuration = `${1300 + Math.random() * 1400}ms`;
    box.appendChild(p);
  }
}

function playVictorySequence() {
  const victoryScreen = document.getElementById('screen-victory');
  const surprise = document.getElementById('victory-surprise');
  if (!victoryScreen || !surprise) return;

  victoryScreen.classList.remove('cinematic');
  void victoryScreen.offsetWidth;
  victoryScreen.classList.add('cinematic');

  launchVictoryParticles();
  const cinematicText = 'Agentes Paula y Hugo: otra vez lo habeis conseguido. Habeis salvado Londres una vez mas, letra a letra, mirada a mirada. Topotino no puede estar mas orgulloso de vosotros.';
  typewriterInto(surprise, cinematicText, 20);
}

// ── AUTH ──────────────────────────────────────────────────────
function bindStaticButtons() {

  // AUTH STEP 1
  document.getElementById('btn-auth-1').addEventListener('click', () => {
    const a1 = document.getElementById('auth-agent1').value.trim().toLowerCase();
    const a2 = document.getElementById('auth-agent2').value.trim().toLowerCase();
    const err = document.getElementById('auth-error-1');

    if (a1 === AGENT1 && a2 === AGENT2) {
      err.style.display = 'none';
      document.getElementById('auth-step-1').style.display = 'none';
      document.getElementById('auth-step-2').style.display = 'flex';
      document.getElementById('auth-city').focus();
    } else {
      err.style.display = 'block';
      err.classList.remove('shake');
      void err.offsetWidth;
      err.classList.add('shake');
    }
  });

  // Enter key on auth fields
  ['auth-agent1','auth-agent2'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('btn-auth-1').click();
    });
  });

  // AUTH STEP 2
  document.getElementById('btn-auth-2').addEventListener('click', () => {
    const city = document.getElementById('auth-city').value.trim().toLowerCase();
    const err = document.getElementById('auth-error-2');

    if (SECRET_CITY.includes(city)) {
      err.style.display = 'none';
      state.authenticated = true;
      saveState();
      renderMap();
      showScreen('carta');
      // carta-back will go to map
      prevScreen = 'map';
    } else {
      err.style.display = 'block';
      err.classList.remove('shake');
      void err.offsetWidth;
      err.classList.add('shake');
    }
  });

  document.getElementById('auth-city').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-auth-2').click();
  });

  // CARTA
  document.getElementById('carta-back').addEventListener('click', () => {
    showScreen(prevScreen || 'map');
  });

  // Open carta from map
  document.getElementById('btn-map-carta').addEventListener('click', () => {
    prevScreen = 'map';
    showScreen('carta');
  });

  const btnMapOverview = document.getElementById('btn-map-overview');
  if (btnMapOverview) {
    btnMapOverview.addEventListener('click', () => {
      showScreen('londonmap');
    });
  }

  const londonMapBack = document.getElementById('londonmap-back');
  if (londonMapBack) {
    londonMapBack.addEventListener('click', () => {
      renderMap();
      showScreen('map');
    });
  }

  // Carta → go to map
  const btnCartaToMap = document.getElementById('btn-carta-to-map');
  if (btnCartaToMap) {
    btnCartaToMap.addEventListener('click', () => {
      renderMap();
      showScreen('map');
    });
  }

  // MAP → MISSION
  document.getElementById('mission-back').addEventListener('click', () => {
    renderMap();
    showScreen('map');
  });

  document.getElementById('reveal-back').addEventListener('click', () => {
    showScreen('mission');
  });

  document.getElementById('questions-back').addEventListener('click', () => {
    renderMap();
    showScreen('map');
  });

  document.getElementById('btn-reveal').addEventListener('click', () => {
    if (currentMissionId) showReveal(currentMissionId);
  });

  document.getElementById('btn-start-questions').addEventListener('click', () => {
    if (currentMissionId) validateMissionLocationAndStart(currentMissionId);
  });

  document.getElementById('btn-reward-to-map').addEventListener('click', () => {
    renderMap();
    showScreen('map');
    checkVictory();
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    if (confirm('¿Reiniciar toda la operación? Se borrará el progreso.')) {
      resetGame();
    }
  });

  document.getElementById('btn-timeout-continue').addEventListener('click', () => {
    state.timeoutAcknowledged = true;
    saveState();
    renderMap();
    showScreen('map');
  });

  document.getElementById('btn-next-question').addEventListener('click', () => {
    nextQuestion();
  });
}

function setupHiddenLocationBypass() {
  const revealName = document.getElementById('reveal-name');
  if (!revealName) return;
  revealName.addEventListener('click', () => {
    revealTapCount++;
    clearTimeout(revealTapTimer);
    revealTapTimer = setTimeout(() => { revealTapCount = 0; }, 2200);
    if (revealTapCount >= 7) {
      revealTapCount = 0;
      const code = prompt('Codigo de mando para modo manual:');
      if (code && code.trim().toLowerCase() === LOCATION_BYPASS_CODE) {
        locationBypass = true;
      }
      if (locationBypass) {
        setLocationStatus('Modo manual activo. Podeis iniciar pruebas sin control de posicion.', 'success');
      } else {
        setLocationStatus('Codigo invalido. Modo manual no activado.', 'error');
      }
    }
  });
}

function bindImageLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const closeBtn = document.getElementById('image-lightbox-close');
  if (!lightbox || !closeBtn) return;
  closeBtn.addEventListener('click', closeImageLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeImageLightbox();
  });
}

function openImageLightbox(src, caption) {
  const lightbox = document.getElementById('image-lightbox');
  const img = document.getElementById('image-lightbox-img');
  const cap = document.getElementById('image-lightbox-caption');
  if (!lightbox || !img || !cap) return;
  img.src = src;
  img.alt = caption || '';
  cap.textContent = caption || '';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeImageLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
}

// ── MAP ───────────────────────────────────────────────────────
function renderMap() {
  const grid = document.getElementById('missions-grid');
  grid.innerHTML = '';

  const completed = getCompletedCount();
  document.getElementById('map-pieces').textContent = completed + '/12';
  const pct = (completed / 12) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';

  // Build letters display
  const lettersDisplay = buildLettersDisplay();
  document.getElementById('map-letters-display').textContent = lettersDisplay;

  MISSIONS.forEach(m => {
    const ms = state.missions[m.id] || { status: 'pending' };
    const card = document.createElement('div');
    card.className = 'mission-card ' + (ms.status === 'completed' ? 'completed' : '');

    if (ms.status === 'completed') {
      card.setAttribute('data-letra', m.letra);
    }

    const statusLabel = ms.status === 'completed' ? 'COMPLETADA'
      : ms.status === 'in_progress' ? 'EN CURSO' : 'PENDIENTE';
    const statusClass = ms.status === 'completed' ? 'status-completed'
      : ms.status === 'in_progress' ? 'status-in-progress' : 'status-pending';

    card.innerHTML = `
      <div class="card-codename">${m.nombreClave}</div>
      <span class="card-status ${statusClass}">${statusLabel}</span>
    `;

    if (m.imagen) {
      const thumb = document.createElement('div');
      thumb.className = 'card-thumb';
      thumb.setAttribute('data-role', 'thumb');
      card.prepend(thumb);

      const imageEl = document.createElement('img');
      imageEl.src = m.imagen;
      imageEl.alt = m.nombreReal;
      imageEl.onerror = () => {
        thumb.remove();
      };
      thumb.appendChild(imageEl);
      thumb.addEventListener('click', (event) => {
        event.stopPropagation();
        openImageLightbox(m.imagen, m.nombreReal);
      });
    }

    card.addEventListener('click', () => openMission(m.id));
    grid.appendChild(card);
  });
}

// Build the collected letters display string
function buildLettersDisplay() {
  let display = '';
  // Go through missions in order and collect letters for completed ones
  MISSIONS.forEach(m => {
    const ms = state.missions[m.id];
    if (ms && ms.status === 'completed') {
      display += m.letra + ' ';
    } else {
      // show a dash for each letter slot
      for (let i = 0; i < m.letra.length; i++) {
        display += '— ';
      }
    }
  });
  return display.trim();
}

// Build condensed collected letters (no spaces) for progress display
function buildCollectedLetters() {
  let letters = '';
  MISSIONS.forEach(m => {
    const ms = state.missions[m.id];
    if (ms && ms.status === 'completed') {
      letters += m.letra;
    }
  });
  return letters;
}

// Build phrase progress showing collected vs unknown
function buildPhraseProgress() {
  let display = '';
  let pos = 0;
  MISSIONS.forEach(m => {
    const ms = state.missions[m.id];
    for (let i = 0; i < m.letra.length; i++) {
      if (ms && ms.status === 'completed') {
        display += m.letra[i] + ' ';
      } else {
        display += '— ';
      }
    }
    pos += m.letra.length;
  });
  return display.trim();
}

function getCompletedCount() {
  return Object.values(state.missions).filter(m => m.status === 'completed').length;
}

// ── MISSION ───────────────────────────────────────────────────
function openMission(missionId) {
  const m = MISSIONS.find(x => x.id === missionId);
  if (!m) return;

  currentMissionId = missionId;
  currentQuestionIndex = 0;

  if (!state.missions[missionId]) {
    state.missions[missionId] = { status: 'in_progress' };
    saveState();
  }

  document.getElementById('mission-codename').textContent = m.nombreClave;
  document.getElementById('mission-pista').innerHTML = `<p>${m.pista}</p>`;
  document.getElementById('mission-historia').innerHTML = formatParagraphs(m.historia);
  document.getElementById('mission-encaje').innerHTML = formatParagraphs(m.encajeEnMisterio);
  document.querySelector('.letter-hint-box').textContent = maskLetters(m.letra);
  document.querySelector('.piece-name').textContent = maskLetters(m.letra);

  showScreen('mission');
}

function showReveal(missionId) {
  const m = MISSIONS.find(x => x.id === missionId);
  if (!m) return;

  const img = document.getElementById('reveal-image');
  const emoji = document.getElementById('reveal-emoji');

  img.src = m.imagen || '';
  img.style.display = 'block';
  emoji.style.display = 'none';
  emoji.textContent = m.emoji;

  img.onerror = () => {
    img.style.display = 'none';
    emoji.style.display = 'flex';
  };

  document.getElementById('reveal-name').textContent = m.nombreReal;
  document.querySelector('.piece-name').textContent = maskLetters(m.letra);
  if (locationBypass) {
    setLocationStatus('Modo manual activo. Podeis iniciar pruebas sin control de posicion.', 'success');
  } else {
    setLocationStatus('Confirmad vuestra posicion para desbloquear las pruebas de campo.', 'info');
  }
  showScreen('reveal');
}

function haversineDistanceMeters(lat1, lng1, lat2, lng2) {
  const toRad = (n) => (n * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getCurrentPositionPromise(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function validateMissionLocationAndStart(missionId) {
  const m = MISSIONS.find(x => x.id === missionId);
  if (!m) return;

  const triggerBtn = document.getElementById('btn-start-questions');
  triggerBtn.disabled = true;

  try {
    if (locationBypass) {
      setLocationStatus('Modo manual activo. Entrando al bloque de preguntas.', 'success');
      startQuestions(missionId);
      return;
    }

    if (typeof m.lat !== 'number' || typeof m.lng !== 'number') {
      setLocationStatus('Objetivo sin coordenadas validas. Bloqueo de seguridad activo.', 'error');
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('Este dispositivo no permite geolocalizacion. No es posible validar posicion.', 'error');
      return;
    }

    setLocationStatus('Comprobando posicion segura... manteneos quietos unos segundos.', 'info');
    const pos = await getCurrentPositionPromise({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    });

    const distance = haversineDistanceMeters(
      pos.coords.latitude,
      pos.coords.longitude,
      m.lat,
      m.lng
    );
    const radius = typeof m.radioMetros === 'number' ? m.radioMetros : 250;

    if (distance <= radius) {
      setLocationStatus(`Posicion validada (${Math.round(distance)} m del objetivo). Acceso concedido.`, 'success');
      startQuestions(missionId);
      return;
    }

    setLocationStatus(`Fuera de zona segura (${Math.round(distance)} m). Acercaos mas al objetivo (radio ${radius} m).`, 'error');
  } catch (err) {
    if (err && err.code === 1) {
      setLocationStatus('Permiso de ubicacion denegado. Activadlo en el navegador para continuar.', 'error');
    } else if (err && err.code === 2) {
      setLocationStatus('No se pudo determinar la ubicacion. Revisad GPS o conexion e intentad de nuevo.', 'error');
    } else if (err && err.code === 3) {
      setLocationStatus('Tiempo de espera agotado al obtener ubicacion. Reintentad en unos segundos.', 'error');
    } else {
      setLocationStatus('Error al validar la ubicacion. Reintentad en unos segundos.', 'error');
    }
  } finally {
    triggerBtn.disabled = false;
  }
}

// ── QUESTIONS ─────────────────────────────────────────────────
function startQuestions(missionId) {
  currentMissionId = missionId;
  currentQuestionIndex = 0;
  showQuestion();
}

function showQuestion() {
  const m = MISSIONS.find(x => x.id === currentMissionId);
  if (!m) return;

  const q = m.preguntas[currentQuestionIndex];
  questionAnswered = false;

  document.getElementById('q-location').textContent = '// ' + m.nombreReal + ' //';
  document.getElementById('q-text').textContent = q.texto;
  document.getElementById('q-counter').textContent = (currentQuestionIndex + 1) + '/3';
  document.getElementById('q-feedback').style.display = 'none';

  // Update dots
  const ms = state.missions[currentMissionId];
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.className = 'dot';
    if (ms && ms.answeredQuestions && ms.answeredQuestions[i]) dot.classList.add('answered');
    else if (i === currentQuestionIndex) dot.classList.add('current');
  });

  // Render options
  const optionsEl = document.getElementById('q-options');
  optionsEl.innerHTML = '';
  q.opciones.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => answerQuestion(idx));
    optionsEl.appendChild(btn);
  });

  showScreen('questions');
}

function answerQuestion(selectedIndex) {
  if (questionAnswered) return;
  questionAnswered = true;

  const m = MISSIONS.find(x => x.id === currentMissionId);
  const q = m.preguntas[currentQuestionIndex];
  const isCorrect = selectedIndex === q.correcta;

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correcta) btn.classList.add('correct');
    else if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
  });

  const feedback = document.getElementById('q-feedback');
  const feedbackText = document.getElementById('q-feedback-text');
  feedback.style.display = 'block';

  if (isCorrect) {
    feedbackText.className = 'feedback-text correct';
    feedbackText.textContent = '✓ PARTE VALIDADO — OBSERVACION IMPECABLE, AGENTES';

    if (!state.missions[currentMissionId]) state.missions[currentMissionId] = { status: 'in_progress' };
    if (!state.missions[currentMissionId].answeredQuestions) {
      state.missions[currentMissionId].answeredQuestions = [false, false, false];
    }
    state.missions[currentMissionId].answeredQuestions[currentQuestionIndex] = true;
    saveState();

    const isLast = currentQuestionIndex >= 2;
    document.getElementById('btn-next-question').textContent = isLast ? 'VER PARTE FINAL ➜' : 'SIGUIENTE PARTE ➜';
  } else {
    feedbackText.className = 'feedback-text wrong';
    feedbackText.textContent = '✗ PARTE RECHAZADO — REVISAD EL ENTORNO Y REPETID';
    document.getElementById('btn-next-question').textContent = 'REPETIR PARTE ↩';
  }
}

function nextQuestion() {
  const ms = state.missions[currentMissionId];
  const wasCorrect = ms && ms.answeredQuestions && ms.answeredQuestions[currentQuestionIndex];

  if (!wasCorrect) {
    // retry same question
    questionAnswered = false;
    document.getElementById('q-feedback').style.display = 'none';
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('correct', 'wrong');
    });
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.className = 'dot';
      if (i === currentQuestionIndex) dot.classList.add('current');
      else if (ms && ms.answeredQuestions && ms.answeredQuestions[i]) dot.classList.add('answered');
    });
    return;
  }

  if (currentQuestionIndex < 2) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    completeMission(currentMissionId);
  }
}

// ── COMPLETE MISSION ──────────────────────────────────────────
function completeMission(missionId) {
  const m = MISSIONS.find(x => x.id === missionId);
  state.missions[missionId].status = 'completed';
  saveState();

  // Show reward
  document.getElementById('reward-letter').textContent = m.letra;
  document.getElementById('reward-badge').textContent = m.insignia;
  document.getElementById('reward-message').innerHTML = `<p>${m.mensajeRecompensa}</p>`;

  // Build phrase progress for reward screen
  const phraseProgress = buildPhraseProgress();
  document.getElementById('reward-phrase-display').textContent = phraseProgress;

  showScreen('reward');
}

// ── VICTORY CHECK ─────────────────────────────────────────────
function checkVictory() {
  const completedLetters = buildCollectedLetters();
  if (getCompletedCount() >= MISSIONS.length && completedLetters === FULL_PHRASE) {
    setTimeout(() => {
      showScreen('victory');
      playVictorySequence();
    }, 400);
  }
}

// ── RESET ─────────────────────────────────────────────────────
function resetGame() {
  state = { authenticated: false, missions: {}, lettersCollected: [], timeoutAcknowledged: false };
  locationBypass = false;
  saveState();
  // Show auth again from the start
  document.getElementById('auth-step-1').style.display = 'flex';
  document.getElementById('auth-step-2').style.display = 'none';
  document.getElementById('auth-agent1').value = '';
  document.getElementById('auth-agent2').value = '';
  document.getElementById('auth-city').value = '';
  document.getElementById('auth-error-1').style.display = 'none';
  document.getElementById('auth-error-2').style.display = 'none';
  showScreen('auth');
}

function resetCurrentMission(missionId) {
  const exists = MISSIONS.some(m => m.id === missionId);
  if (!exists) return;
  delete state.missions[missionId];
  saveState();
  currentQuestionIndex = 0;
  questionAnswered = false;
  renderMap();
  openMission(missionId);
}

// ── COUNTDOWN ─────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }
function isDeadlineExpired() { return Date.now() >= DEADLINE.getTime(); }

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const mn = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}D ${pad(h)}:${pad(mn)}:${pad(s)}`;
  return `${pad(h)}:${pad(mn)}:${pad(s)}`;
}

function startCountdownTick() {
  function tick() {
    const remaining = DEADLINE - Date.now();
    const text = formatCountdown(remaining);
    const el = document.getElementById('countdown-map');
    if (el) el.textContent = '⏱ ' + text;

    if (remaining <= 0 && !state.timeoutAcknowledged && getCompletedCount() < MISSIONS.length) {
      const active = document.querySelector('.screen.active');
      if (active && active.id !== 'screen-auth' && active.id !== 'screen-victory' && active.id !== 'screen-timeout') {
        showScreen('timeout');
      }
    }
  }
  tick();
  setInterval(tick, 1000);
}

// ── PERSISTENCE ───────────────────────────────────────────────
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
    if (typeof state.timeoutAcknowledged !== 'boolean') state.timeoutAcknowledged = false;
  } catch(e) {}
}

// ── SERVICE WORKER ────────────────────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

// ── BOOT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initApp);
