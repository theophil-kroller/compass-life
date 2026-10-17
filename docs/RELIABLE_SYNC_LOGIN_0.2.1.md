# Compass 0.2.1 – Reliable Sync & Login

**Stand:** 17. Oktober 2026. Aufbauend auf Compass Capture MVP 0.2.0. Dies ist ein Build mit **Frontend + Worker + D1-Migration**. Bei der Veröffentlichung die Reihenfolge unbedingt einhalten.

## Was sich ändert

- **Compass-Gerätesitzung statt kurzlebigem Google-Token:** Erster Login weiterhin über Google. Der Worker prüft das Google-ID-Token, erzeugt danach einen zufälligen 256-Bit-Geräteschlüssel und speichert **nur dessen SHA-256-Hash** in D1. Der Rohschlüssel wird im Browser **AES-GCM-verschlüsselt im lokalen Tresor**, getrennt von Aufgaben und der normalen Vault-Exportdatei, abgelegt.
- **Wiederkehrendes Entsperren:** Nach einem normalen Neuladen oder Browser-Neustart muss nur der lokale Tresor wieder entsperrt werden. Die App stellt die bestehende Compass-Sitzung wieder her, sofern sie serverseitig gültig ist. Eine erste Google-Anmeldung nach diesem Update ist **einmalig** erforderlich. Sitzungen gelten 30 Tage und werden bei Nutzung innerhalb der letzten sieben Tage vor Ablauf verlängert; „Google trennen“ löscht die Sitzung lokal und widerruft sie serverseitig (bei erreichbarem Worker).
- **Sparsamer Auto-Sync:** ca. 7 Sekunden nach Änderungen (während die Web-App sichtbar und online ist), spätestens alle 15 Minuten bei sichtbarer, entsperrter App. Beim Wiederauftauchen aus Hintergrund/Offline wird bei Bedarf synchronisiert. Ist die App geschlossen, versteckt, offline oder der Tresor gesperrt, gibt es kein dauerhaftes Polling. Der Button „Jetzt synchronisieren“ bleibt jederzeit verfügbar.
- **Konflikte:** Gleiche Titel, Notizen und Archivzustände werden ohne künstliche Konfliktmeldung als identisch erkannt. Echte Unterschiede werden nicht überschrieben; die Konfliktansicht zeigt jetzt auch unterschiedliche Notizen. Ein bereits bestehender alter Konflikt kann nach Backup mit „Meine Version behalten“ oder „Cloud übernehmen“ aufgelöst werden. Der alte Konflikt verschwindet nicht zwangsläufig alleine durch das Upgrade, denn die lokale Konfliktliste hat schon Bestand.
- **Unverändert:** Cloudflare-D1-Einträge und Sync-Cursor, `OWNER_EMAIL`-Secret, Google-Client-ID, Worker-URL, lokale Passphrase und Vault-Datenmodell (`format:1`). Keine zusätzlichen Berechtigungen gegenüber Google.

## WICHTIG: Installationsreihenfolge

1. **Vorher Backup:** Am Laptop unter **System & Sync** → **Verschlüsseltes Backup herunterladen**. Die Datei sicher ablegen. Das gleiche auf dem Samsung für einen getrennten Sicherheitsstand.
2. **Zuerst D1-Tabelle anlegen:** Cloudflare Dashboard → D1 → `compass-db` → Console. Folgende SQL-Kommandos aus `worker/migrations/0002_auth_sessions.sql` ausführen (bei Bedarf einzeln). Sie ändern **keine** vorhandenen Inbox-Einträge:

   ```sql
   CREATE TABLE IF NOT EXISTS auth_sessions (
     token_hash TEXT PRIMARY KEY NOT NULL,
     owner_sub TEXT NOT NULL,
     owner_email TEXT NOT NULL,
     created_at TEXT NOT NULL,
     expires_at TEXT NOT NULL
   );
   CREATE INDEX IF NOT EXISTS idx_auth_sessions_expiry ON auth_sessions(expires_at);
   ```

3. **PATCH entpacken und hochladen:** Dateien aus `Compass_Reliable_Sync_Login_0.2.1_PATCH.zip` an denselben Pfaden in GitHub `theophil-kroller/compass-life` ersetzen bzw. neu anlegen, Commit auf `main`.
4. **Deployments prüfen:** GitHub → Actions → „Deploy Compass Web“ muss grün werden; Cloudflare → Worker `compass-api` → Deployments muss die neue Version ebenfalls erfolgreich ausrollen. Worker-Konfiguration `wrangler.jsonc` ist **nicht** im Patch enthalten, weil deine bereits eingerichtete Google-ID bestehen bleiben muss.
5. **Migrationstracking optional nachziehen:** Wenn du später `npx wrangler d1 migrations apply compass-db --remote` ausführst, ist die SQL bewusst idempotent (`IF NOT EXISTS`). Wrangler kann den vorher in der Console ausgeführten Schema-Schritt so nachträglich als Migration vermerken. Bitte keinen bestehenden DB-Speicher oder `d1_migrations` manuell löschen.
6. **Abnahme Laptop:** Compass laden, lokalen Tresor entsperren. Unter System & Sync **ein einziges Mal** mit Google verbinden. Jetzt wird eine Compass-Sitzung sicher gespeichert; `Jetzt synchronisieren`, Konfliktzahl prüfen. Normal neu laden (auch Strg+F5) → Vault-Passphrase erneut → **kein neuer Google-Login** nötig.
7. **Abnahme Samsung:** PWA öffnen, Tresor entsperren und einmalig Google verbinden. Einen Testeintrag auf einem Gerät erfassen und bis zur Bestätigung synchronisieren lassen (oder manuell „Jetzt synchronisieren“). Auf dem anderen Gerät über manuelles Synchronisieren denselben Eintrag kontrollieren.

## Kosten / Kontingent

- Zwei Geräte, beide 24 Stunden sichtbar und entsperrt: maximal ungefähr `2 × 24 × 4 = 192` periodische Polls pro Tag, zuzüglich POSTs bei tatsächlichen Änderungen, Authentifizierungen und manuellen Syncs. Tatsächlich ist es wegen Inaktivitätssperre und versteckter App üblicherweise deutlich weniger.
- Nicht jeder Poll führt zu Writes: ohne Änderungen nur authentifizierte D1-SELECTs. Worker-Anfragen/D1-Abfragen bleiben messbar; Cloudflare-Dashboard in den ersten Tagen überprüfen.
- Stand Oktober 2026: Free Workers haben 100.000 Requests/Tag. Das ist keine Garantie, wenn andere Projekte ebenfalls dasselbe Account-Limit verbrauchen. Das Rate-/Quota-Verhalten des verwendeten Cloudflare-Tarifs ist maßgeblich.

## Sicherheitsgrenzen / bekannte Einschränkungen

- Die Compass-Sitzung ist ein Bearer-Token und nur so gut wie die Sicherheit eines entsperrten Browsers. Deshalb bleibt die lokale Vault-Sperre nach 15 Minuten Inaktivität erhalten.
- Löschung der lokalen Browserdaten entfernt den verschlüsselten Sitzungsschlüssel. Dann ist eine neue Google-Anmeldung nötig. Die herkömmliche verschlüsselte Vault-Backupdatei enthält **keinen** Sitzungsschlüssel.
- Durch einen Wechsel von `OWNER_EMAIL` oder `OWNER_GOOGLE_SUB` werden bestehende Sessions serverseitig nicht mehr akzeptiert.
- Der D1-Server speichert Inbox-Titel/Notizen aktuell nicht Ende-zu-Ende-verschlüsselt; lokal ist der Tresor weiterhin verschlüsselt. Nicht als fertige Hochsicherheitslösung für vertrauliche Klientendaten verwenden.
- Der Session-Revoke beim Klick „Google trennen“ erfordert Internet. Ist der Worker gerade nicht erreichbar, wird die lokale Sitzung beendet und die Oberfläche zeigt eine Warnung. Alte serverseitige Sessions laufen spätestens nach Inaktivität ab; es gibt noch keinen globalen „Alle Geräte abmelden“-Dialog.
- Kein nativer Hintergrund-Sync, wenn die Android-PWA vollständig geschlossen ist. Kalenderintegration, Garmin und Android-Live-Widget sind **nicht** Bestandteil dieses Builds.

## Getestet / offen

- `node --check` auf Client, Worker, Vault und Sync.
- `npm test`: **14 von 14** Tests bestanden, darunter Server-Sitzung, Revocation, 30-Tage-Ablaufverlängerung, Owner-Check und Identitätskonflikte.
- Ein lokaler Ende-zu-Ende-Browserlauf mit dem Browser in dieser Umgebung war durch Zugriffsrestriktionen blockiert (`ERR_BLOCKED_BY_ADMINISTRATOR`). Ebenso war ein lokaler Vite-Installationsbuild ohne Registry-Verbindung nicht möglich. **GitHub Actions und der echte Cloudflare-Deploy bilden daher die noch ausstehenden Endtests.**
