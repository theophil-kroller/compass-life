/** Compass .40.10 — repair deleted-project sync without bypassing worker safety.
 * A project is only permanently erased after the API acknowledges the trash
 * transition. The intermediate server version is saved for offline retries.
 */
export const NEEDS_TRASH410='project-not-in-trash';

export async function syncProjectWithTrash410(payload, send, onTrashAcknowledged, unchanged=()=>true) {
  if (payload?.status !== 'deleted') return await send(payload);
  // The normal path is one request: if trash has already been acknowledged,
  // the worker can safely accept deletion with optimistic version checking.
  try { return await send(payload); }
  catch (error) {
    if (error?.status!==400 || error?.message!==NEEDS_TRASH410) throw error;
  }
  // The 400 indicates that the worker has NOT acknowledged the trash state.
  // Only stage the trash; never weaken server-side permanent-delete safeguards.
  if (!unchanged()) return { deferred: true };
  const staged=await send({...payload,status:'trash'});
  const version=staged?.project?.version;
  if (!Number.isSafeInteger(version) || version<1 || staged.project.status!=='trash')
    throw Error('Papierkorb konnte nicht bestätigt werden. Lokale Löschung bleibt vorgemerkt.');
  // Store the intermediate version BEFORE a second network operation. A
  // timeout/reload now retries directly from the server-confirmed trash state.
  await onTrashAcknowledged(version);
  if (!unchanged()) return {deferred:true};
  return await send({...payload,baseVersion:version});
}
