// Shared local report: the game owns this key; the communicator only reads it.
export const SANTIAGO_PROGRESS_KEY = 'topotino_santiago_secrets_v1';
export function santiagoReport(value) {
  const found = value?.version === 1 && Array.isArray(value.found)
    ? [...new Set(value.found.filter(id => Number.isInteger(id) && id >= 1 && id <= 12))] : [];
  return { count:found.length, complete:found.length === 12 };
}
export function readSantiagoReport(storage) {
  try { return santiagoReport(JSON.parse(storage.getItem(SANTIAGO_PROGRESS_KEY) || 'null')); }
  catch { return {count:0, complete:false}; }
}
