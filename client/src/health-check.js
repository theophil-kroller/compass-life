// Keep API readiness independent of database migration diagnostics.
// Cloud Worker 0.4.10 publishes apiVersion 6.
export const MIN_WORKER_API_VERSION = 12;
export function assertCompatibleWorker(health) {
  const api = health?.apiVersion;
  if (!Number.isInteger(api) || api < MIN_WORKER_API_VERSION) {
    throw new Error(`Cloud-Worker veraltet (API ${Number.isInteger(api) ? api : 'unbekannt'}, benötigt mindestens ${MIN_WORKER_API_VERSION}). SQL allein aktualisiert den Worker nicht: Cloudflare Worker compass-api deployen. Lokale Änderungen bleiben sicher.`);
  }
  if (health?.schema?.ready !== true) {
    const migration = String(health?.schema?.requiredMigration || '0013');
    throw new Error(`Cloud-Datenbank noch nicht bereit (Migration ${migration} erforderlich). Bitte D1-Migrationen auf der Remote-Datenbank prüfen. Lokale Änderungen bleiben sicher.`);
  }
  return true;
}
