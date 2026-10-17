export const MAX_BATCH = 25;
const idPattern = /^[a-zA-Z0-9-]{8,80}$/;
export function validateMutation(m) {
  if (!m || typeof m !== 'object' || Array.isArray(m)) return 'invalid-object';
  if (typeof m.mutationId !== 'string' || !idPattern.test(m.mutationId)) return 'invalid-mutation-id';
  if (typeof m.id !== 'string' || !idPattern.test(m.id)) return 'invalid-item-id';
  if (!Number.isSafeInteger(m.baseVersion) || m.baseVersion < 0) return 'invalid-base-version';
  if (m.deleted !== true && m.deleted !== false) return 'invalid-deleted-flag';
  if (typeof m.title !== 'string' || !m.title.trim() || m.title.trim().length > 1000) return 'invalid-title';
  if (typeof m.note !== 'string' || m.note.length > 10000) return 'invalid-note';
  return null;
}
export function validCursor(value) {
  return typeof value === 'string' && /^\d{1,15}$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null;
}
export function cleanMutation(m) {
  return {mutationId:m.mutationId,id:m.id,baseVersion:m.baseVersion,
    title:m.title.trim(),note:m.note,deleted:m.deleted};
}
