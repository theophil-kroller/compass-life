# Architektur und Sicherheitsentscheidung — Phase A

## Zweck und Scope

GTD-Kern noch nicht implementiert. Phase A beweist Capture, lokal verschlüsselte Speicherung, Sync und Zugriffsschutz. Die Architektur ist strikt unabhängig von Beziehungsdynamiken. Keine sensiblen Daten in GitHub Pages oder in Quellcodedateien.

## Vertrauenszonen

1. **Browser / lokaler Tresor**: Passphrase → PBKDF2 (310.000 Iterationen, SHA-256, individuelles Salt) → AES-256-GCM. Lokal verschlüsselte Daten in IndexedDB. CryptoKey nicht exportierbar, nur flüchtiger Speicher. Automatische Inaktivitätssperre 15 Minuten (kein vollständiger Schutz gegen manipulierte Browser-Erweiterungen, kompromittiertes Gerät oder aktiven XSS).
2. **Google Identity Services (GIS)**: Nutzer meldet sich mit dem Google-Konto an. Das ID-Token lebt im Browser-Speicher und wird an die API mit `Authorization: Bearer` gesendet. Keine Speicherung in LocalStorage, IndexedDB oder Cookies. Nach etwa einer Stunde kann eine neue Anmeldung nötig sein.
3. **Worker API**: JWT-Signatur wird serverseitig über öffentliche Google JWKS mit `jose` geprüft; zusätzlich `aud`, `iss`, `exp`, `email_verified` und strikt konfigurierte `OWNER_EMAIL` (ggf. `OWNER_GOOGLE_SUB`). CORS erlaubt genau eine Web-Origin; CORS allein ersetzt Auth nicht. Keine Fremdzugriffe ohne JWT.
4. **Cloudflare D1**: Privater relationaler Datenspeicher in eigenständigem Konto. Daten im aktuellen Prototyp serverseitig im Klartext, nicht E2EE.
5. **GitHub Pages**: öffentlich abrufbare statische Dateien, niemals Clientdaten. `runtime-config.json` enthält ausschließlich öffentliche API-URL und Google OAuth-Client-ID.

## Sync-V1-Protokoll

API `GET /api/health` (öffentlich), `GET /api/me`, `GET /api/sync/pull?cursor=<int>`, `POST /api/sync/push` (authentifiziert). Alle privaten Responses `Cache-Control: no-store`. Nutzlast-Limits und serverseitige Feldprüfung. Nur `inbox`-Datensätze erlaubt.

Mutationen: `{id, mutationId, baseVersion, title, note, deleted}`. `mutationId` identifiziert Retry-Aktionen stabil; `baseVersion` ist die zuletzt bestätigte Server-Version. Ein INSERT/UPDATE löst SQLite-Trigger aus, die atomar Change Log und Receipt schreiben. Für parallele Schreibvorgänge wird die vorhandene Version im UPDATE geprüft.

Pull: Cursor auf autoincrementierendem Server-Change-Log, in Batches. Gelöschte Items bleiben als Tombstones für andere Geräte erhalten. Bei konkurrierenden lokalen und entfernten Änderungen entsteht ein expliziter Konflikt. Kein „letzter Schreibender gewinnt“.

## Bewusste Alpha-Limitationen / offene Punkte

- **Kein umfassender externer Penetrationstest**. Vor realer Nutzung mit hochsensiblen Informationen Security-Review durchführen.
- **D1-Klartext**: Verschlüsselung gilt nur für lokale Daten. Für private Beziehungsnotizen oder später Garmin-Gesundheitsdaten ein erweitertes Datenschutz-/Key-Management-Konzept entwickeln.
- **Lokal ein einzelner verschlüsselter Snapshot**: für Inbox-Prototyp ausreichend; ab GTD-Phase B skalierbarere per-Entity-Persistenz und schema-versionierte Client-Migrationen planen.
- **Keine Multi-Tab-Leaderwahl**: Browser-Tabs nicht gleichzeitig zum Bearbeiten benutzen. Vor Gate A zusammen mit Cross-Device-Tests bewerten.
- **Kein automatischer Google-Token-Refresh**. Bei Ablauf neu authentifizieren; lokaler Capture bleibt verfügbar.
- **Keine serverseitige Rate-Limit-Bindung** und noch kein vollständiges Backup/Restore des D1-Zustands. Vor breiter Nutzung nachrüsten.
- **Keine Hintergrund-Synchronisation** bei geschlossener App.
- **D1 change_log wächst** ohne Retention/Compaction; bei späterer Nutzung Snapshot-/Pruning-Strategie entwickeln.
- **Kein Mehrnutzer- oder Teammodell**; absichtlich Single-Owner.
- **Keine eigenen Cloudflare- oder Google-Accounts durch diesen Build erstellt**. User führt Infrastruktursetup aus.

## Nächste Migrationen nach Gate A

Phase B ergänzt Entitäten für Areas, Goals, Projects, Tasks, Dependencies, Contexts, People, Agenda Items und Reviews mit klar getrennten Due-, Defer- und Review-Daten. Nicht durch ein einziges generisches Task-JSON ersetzen. Sync-Envelope später generalisieren und Versionierung Migrationsfähig halten.
