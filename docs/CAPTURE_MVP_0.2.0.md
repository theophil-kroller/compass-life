# Compass 0.2.0 – Capture Everywhere (MVP 1)

Stand: 17.10.2026. Basis: GitHub-Commit `f1818a6e71cfb1abfdb09c4549800e8e31bbcb50` (Compass 0.1.3). **Nur Frontend**, kein Worker-/D1-Schemawechsel.

## Implementiert

- Komplette Inbox-Arbeitsansicht (Suche, auswählen, Titel und Notiz speichern, archivieren).
- Schnell erfassen ohne zusätzliche Pflichtfelder; zentrale Erfassungsoberfläche über Kopfzeile oder `Ctrl/⌘ + K` (außerhalb von Texteingaben auch `N`).
- Mobile Quick-Capture-Schaltfläche und PWA-App-Shortcuts: `?capture=1`, `?view=inbox`.
- Verschlüsselter lokaler Tresor und persistente Offline-Warteschlange bleiben bestehen. Speicherung wird erst nach lokaler Bestätigung angezeigt; bei Fehlern wird kein Erfolg behauptet.
- Captures können während eines laufenden Cloud-Abgleichs angenommen werden; Änderungen werden danach erneut abgeglichen.
- „Heute“ bleibt Standardeinstieg, Dashboard unter „Übersicht“, GTD-Zuordnung bewusst noch inaktiv.
- Worker-Adresse bleibt konfiguriert, Google-OAuth-Client-ID bleibt Platzhalter bis zu deiner Freigabe.

## Ausdrücklich noch nicht implementiert

- Echte GTD-Verarbeitung in Next Actions/Projekte/Dreams, Kalendertermine in Today, geräteübergreifende Sync-Abnahme, Android-Live-Widget, Garmin-Anwendung, lokale KI.
- Der Startbildschirm-Kurzbefehl öffnet eine PWA-Ansicht, **kein natives Android-Widget**. Je nach Android-Launcher erscheinen App-Kurzbefehle erst nach Installation/Neustart oder gar nicht; der Floating-Button funktioniert unabhängig davon.
- Google Calendar ist ausschließlich für den späteren **lesenden** Zugriff vorgemerkt. Der angegebene Kalender ist in der ChatGPT-Kalenderverbindung als Hauptkalender verfügbar; der Kalenderlink allein autorisiert Compass nicht. Der Kalender-Identifier wird aus Datenschutzgründen nicht in GitHub-Dateien geschrieben.

## Einrichten – Code hochladen

1. `Compass_Capture_MVP_0.2.0_PATCH.zip` herunterladen und **entpacken**.
2. In GitHub `theophil-kroller/compass-life` die relativen Dateien aus dem Patch am gleichen Ort ersetzen: `client/src/main.js`, `client/src/style.css`, `client/vite.config.js`; diese Release-Notes liegen optional unter `docs/`.
3. Auf `main` committen. GitHub Actions → „Deploy Compass Web“ muss grün sein.
4. Auf dem Desktop `https://theophil-kroller.github.io/compass-life/` öffnen, ggf. Browser einmal neu laden (PWA-Service-Worker kann eine vorherige Version noch anzeigen).

## Sofort lokal testen

1. Tresor mit der ursprünglichen Passphrase öffnen – **keinen neuen Tresor anlegen**, wenn schon einer vorhanden ist.
2. `Ctrl + K` drücken, Gedanken mit optionaler Notiz erfassen und unter Inbox ansehen.
3. In der Inbox Inhalt ändern, speichern und Browser schließen. Wieder öffnen, Tresor entsperren; Eintrag muss vorhanden sein.
4. Offline-Betrieb testen, nachdem die PWA einmal online geladen wurde: Internet kurz trennen, Eintrag erfassen, danach wieder verbinden.
5. Über `System & Sync` ein **verschlüsseltes Backup** erstellen und sicher verwahren.

## Noch erforderlich für Cloud-Sync (bitte keine Werte in diesem Chat teilen)

1. In Google Cloud Console eine OAuth-App/Webclient für **Google Sign-In** erstellen.
   - Authorized JavaScript origin: `https://theophil-kroller.github.io`
   - Für lokale Entwicklung ggf. zusätzlich `http://127.0.0.1:5173`
   - Noch **keine Calendar-API-Scopes** für den reinen Login erforderlich.
2. Die dabei erzeugte **Client-ID** (kein Secret, endet auf `.apps.googleusercontent.com`) in `client/public/runtime-config.json` und `worker/wrangler.jsonc` unter `GOOGLE_CLIENT_ID` eintragen; Commit löst Frontend/Worker-Deploys aus.
3. In Cloudflare → Worker `compass-api` → Settings → Variables and Secrets den Secret-Namen `OWNER_EMAIL` mit der genauen E-Mail-Adresse des **gewünschten Google-Logins** hinterlegen; nicht ins öffentliche GitHub-Repository schreiben. Google Sign-In kann auch mit einer Nicht-Gmail-Adresse betrieben werden, wenn diese als Google-Konto eingerichtet ist.
4. Teste `/api/me` via Compass-Sign-In, danach Inbox-Sync zwischen zwei Geräten. Beide Geräte benötigen einen eigenen lokalen Tresor; die Cloud-Zuordnung erfolgt über dasselbe Google-Konto.
5. Offline-Sync-Konflikt und verschlüsselten Backup-Restore vor Produktivnutzung verifizieren.

**Datenschutz-Hinweis:** Der lokale Tresor ist AES-GCM-verschlüsselt; die derzeitige private D1-API speichert Task-Text nach erfolgreichem Sync allerdings **nicht Ende-zu-Ende-verschlüsselt**. Bis die Authentifizierung und Sicherheits-/Backup-Checks vollständig abgenommen sind, bitte nur Testeinträge bzw. unkritische Inhalte verwenden.

## Kalender – nächster Ausbau

Geplant: Google Calendar read-only (`https://www.googleapis.com/auth/calendar.events.readonly`), Kalenderauswahl durch den Benutzer, Today/Forecast als Ansicht, ohne Aufgaben in den Google-Kalender zu schreiben. Getrennter OAuth-Access-Token, der nicht als Sign-In-ID-Token verwendet werden darf. Erst nach diesem eigenen OAuth-Flow sind Termine in der Compass-Oberfläche verfügbar.

## Tests

- `node --check client/src/main.js` und `node --check client/vite.config.js` bestanden.
- `npm test`: 6/6 bestehende Sync-/Validierungstests bestanden.
- Isolierte Desktop-/Mobil-Browser-Tests mit simuliertem Tresor: Unlock → Capture → Inbox → Notiz bearbeiten, jeweils ohne JavaScript-Fehler oder horizontalen Overflow.
- Kein vollständiger npm/Vite-Installations-Build im aktuellen Container möglich (keine npm-Abhängigkeiten/netzwerkbasierte Paketinstallation); Produktions-Build und D1-/OAuth-End-to-End-Test stehen noch aus.
