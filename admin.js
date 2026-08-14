const API = '/api/story';
const MANIFEST = '/content/episodes.json?v=memory-v46';

const els = {};
const publishedEpisodes = new Map();
const liveEpisodes = new Map();
let story = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindElements();
  bindEvents();
  await checkSession();
}

function bindElements() {
  [
    'login-card', 'login-form', 'admin-password', 'login-status', 'workspace',
    'broadcast-form', 'broadcast-text', 'episode-select', 'new-episode-id',
    'new-episode', 'episode-source', 'story-updated', 'episode-editor',
    'save-episode', 'remove-override', 'reload-story', 'workspace-status', 'logout'
  ].forEach((id) => {
    els[toCamel(id)] = document.getElementById(id);
  });
}

function bindEvents() {
  els.loginForm.addEventListener('submit', login);
  els.broadcastForm.addEventListener('submit', sendBroadcast);
  els.episodeSelect.addEventListener('change', renderSelectedEpisode);
  els.newEpisode.addEventListener('click', createEpisodeDraft);
  els.saveEpisode.addEventListener('click', saveEpisode);
  els.removeOverride.addEventListener('click', removeOverride);
  els.reloadStory.addEventListener('click', loadWorkspace);
  els.logout.addEventListener('click', logout);
}

async function checkSession() {
  const response = await fetch(`${API}?admin=1`, { cache: 'no-store' });
  if (response.status === 401) return showLogin();
  if (!response.ok) {
    showLogin();
    return setStatus(els.loginStatus, 'No se puede abrir el editor: revisa Redis y las variables de Vercel.', 'error');
  }
  story = await response.json();
  await showWorkspace();
}

async function login(event) {
  event.preventDefault();
  setBusy(els.loginForm, true);
  setStatus(els.loginStatus, 'Abriendo…');
  try {
    const response = await api({ action: 'login', password: els.adminPassword.value });
    if (!response.ok) throw await apiError(response);
    els.adminPassword.value = '';
    story = await fetchJson(`${API}?admin=1`);
    await showWorkspace();
  } catch (error) {
    setStatus(els.loginStatus, error.message || 'No se pudo abrir la mesa de viaje.', 'error');
  } finally {
    setBusy(els.loginForm, false);
  }
}

function showLogin() {
  els.loginCard.hidden = false;
  els.workspace.hidden = true;
}

async function showWorkspace() {
  els.loginCard.hidden = true;
  els.workspace.hidden = false;
  await loadWorkspace();
}

async function loadWorkspace() {
  setStatus(els.workspaceStatus, 'Cargando capítulos…');
  try {
    const [manifest, live] = await Promise.all([
      fetchJson(MANIFEST),
      fetchJson(`${API}?admin=1`)
    ]);
    story = live;
    publishedEpisodes.clear();
    liveEpisodes.clear();

    await Promise.all(manifest.map(async (item) => {
      const markdown = await fetchText(`/${item.file}`);
      publishedEpisodes.set(item.id, markdown);
    }));
    (story.episodes || []).forEach((episode) => liveEpisodes.set(episode.id, episode));
    renderEpisodeOptions();
    renderSelectedEpisode();
    setStatus(els.workspaceStatus, 'Historia sincronizada.', 'success');
  } catch (error) {
    setStatus(els.workspaceStatus, error.message || 'No se pudo cargar la historia.', 'error');
  }
}

function renderEpisodeOptions(preferredId) {
  const selected = preferredId || els.episodeSelect.value;
  const ids = [...new Set([...publishedEpisodes.keys(), ...liveEpisodes.keys()])];
  ids.sort((a, b) => episodeOrder(a) - episodeOrder(b) || a.localeCompare(b));
  els.episodeSelect.replaceChildren();
  ids.forEach((id) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = liveEpisodes.has(id) ? `${id} · EN DIRECTO` : id;
    els.episodeSelect.appendChild(option);
  });
  if (ids.includes(selected)) els.episodeSelect.value = selected;
}

function renderSelectedEpisode() {
  const id = els.episodeSelect.value;
  const live = liveEpisodes.get(id);
  els.episodeEditor.value = live?.markdown || publishedEpisodes.get(id) || '';
  els.episodeSource.textContent = live ? 'Versión en directo' : 'Versión de GitHub';
  els.storyUpdated.textContent = live?.updatedAt
    ? `Guardado ${new Date(live.updatedAt).toLocaleString('es-ES')}`
    : story?.updatedAt
      ? `Historia actualizada ${new Date(story.updatedAt).toLocaleString('es-ES')}`
      : 'Sin cambios en directo';
  els.removeOverride.disabled = !live;
}

async function saveEpisode() {
  const episodeId = els.episodeSelect.value;
  if (!episodeId) return;
  setEditorBusy(true);
  setStatus(els.workspaceStatus, 'Validando y guardando…');
  try {
    const response = await api({
      action: 'saveEpisode',
      episodeId,
      markdown: els.episodeEditor.value
    });
    if (!response.ok) throw await apiError(response);
    story = await response.json();
    liveEpisodes.clear();
    (story.episodes || []).forEach((episode) => liveEpisodes.set(episode.id, episode));
    renderEpisodeOptions(episodeId);
    renderSelectedEpisode();
    setStatus(els.workspaceStatus, 'Capítulo publicado en directo.', 'success');
  } catch (error) {
    setStatus(els.workspaceStatus, error.message || 'No se pudo guardar.', 'error');
  } finally {
    setEditorBusy(false);
  }
}

async function removeOverride() {
  const episodeId = els.episodeSelect.value;
  if (!liveEpisodes.has(episodeId)) return;
  if (!window.confirm('¿Volver a la versión de GitHub de este capítulo?')) return;
  setEditorBusy(true);
  try {
    const response = await api({ action: 'removeEpisode', episodeId });
    if (!response.ok) throw await apiError(response);
    story = await response.json();
    liveEpisodes.delete(episodeId);
    renderEpisodeOptions(episodeId);
    renderSelectedEpisode();
    setStatus(els.workspaceStatus, 'Se restauró la versión de GitHub.', 'success');
  } catch (error) {
    setStatus(els.workspaceStatus, error.message || 'No se pudo restaurar.', 'error');
  } finally {
    setEditorBusy(false);
  }
}

function createEpisodeDraft() {
  const id = els.newEpisodeId.value.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(id)) {
    return setStatus(els.workspaceStatus, 'Usa un identificador como 005-nueva-pista.', 'error');
  }
  if (publishedEpisodes.has(id) || liveEpisodes.has(id)) {
    return setStatus(els.workspaceStatus, 'Ese identificador ya existe.', 'error');
  }
  liveEpisodes.set(id, { id, markdown: episodeTemplate(id), updatedAt: null });
  renderEpisodeOptions(id);
  renderSelectedEpisode();
  els.newEpisodeId.value = '';
  setStatus(els.workspaceStatus, 'Borrador creado. Revísalo y pulsa “Guardar en directo”.');
}

async function sendBroadcast(event) {
  event.preventDefault();
  setBusy(els.broadcastForm, true);
  try {
    const response = await api({ action: 'broadcast', text: els.broadcastText.value.trim() });
    if (!response.ok) throw await apiError(response);
    story = await response.json();
    els.broadcastText.value = '';
    setStatus(els.workspaceStatus, 'Mensaje enviado a los comunicadores.', 'success');
  } catch (error) {
    setStatus(els.workspaceStatus, error.message || 'No se pudo enviar el mensaje.', 'error');
  } finally {
    setBusy(els.broadcastForm, false);
  }
}

async function logout() {
  await api({ action: 'logout' });
  showLogin();
}

function episodeOrder(id) {
  const source = liveEpisodes.get(id)?.markdown || publishedEpisodes.get(id) || '';
  const match = source.match(/"order"\s*:\s*(\d+)/);
  return match ? Number(match[1]) : 999;
}

function episodeTemplate(id) {
  return `---
{
  "id": "${id}",
  "order": 6,
  "title": "Nueva pista",
  "channelCode": "T-12B0",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["completado_guimaraes"]
  },
  "mission": null,
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Escribe aquí qué sabe Topotino y qué no debe revelar.

## Mensajes iniciales

\`\`\`json
[
  { "from": "topotino", "time": "auto", "text": "Ha llegado una señal nueva." }
]
\`\`\`

## Respuestas guiadas

\`\`\`json
[]
\`\`\`

## Respuestas suaves si fallan

\`\`\`json
[
  "La señal todavía está despertando. Mirad un poco más."
]
\`\`\`

## Pistas progresivas

\`\`\`json
[]
\`\`\`

## Contexto para IA

Mantén el tono seguro, cercano y misterioso. No reveles destinos futuros.
`;
}

async function api(payload) {
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw await apiError(response);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`No se pudo cargar ${url}.`);
  return response.text();
}

async function apiError(response) {
  const data = await response.json().catch(() => ({}));
  const messages = {
    INVALID_PASSWORD: 'Contraseña incorrecta.',
    ADMIN_NOT_CONFIGURED: 'Faltan las variables privadas del editor en Vercel.',
    STORY_STORAGE_UNAVAILABLE: 'Redis no está disponible. Los cambios no se han guardado.',
    UNAUTHORIZED: 'La sesión ha caducado. Vuelve a identificarte.'
  };
  return new Error(data.message || messages[data.error] || data.error || 'Error inesperado.');
}

function setEditorBusy(busy) {
  [els.saveEpisode, els.removeOverride, els.reloadStory].forEach((button) => {
    button.disabled = busy;
  });
}

function setBusy(form, busy) {
  form.querySelectorAll('button, input, textarea').forEach((control) => {
    control.disabled = busy;
  });
}

function setStatus(element, text, type = '') {
  element.textContent = text || '';
  element.className = `status ${type}`.trim();
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
