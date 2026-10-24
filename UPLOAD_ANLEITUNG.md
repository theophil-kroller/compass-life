# Compass 0.5.77.27 · Dateien direkt zu GitHub hochladen

1. Dieses ZIP entpacken.
2. Die **vier Dateien** aus dem Verzeichnis `client/` in deinem Repository `theophil-kroller/compass-life` unter **denselben relativen Pfaden** hochladen. `client/vite.config.js` muss dabei die bisherige Datei ersetzen.
3. Das Changelog und der Test unter `tests/` sind optional, aber empfohlen. Die `local-module-smoke.mjs` ist nur ein Entwicklungsprüfwerkzeug und muss nicht hochgeladen werden.
4. Auf dem Branch `main` startet der bestehende Deploy-Workflow automatisch. Nach dem Build im App-Menü die Versionsnummer **0.5.77.27** kontrollieren.
5. `Insights → Ernährung → 🔗 Zusammenhänge` öffnen. Für erste Punkte müssen sowohl Ernährungseinträge als auch die entsprechenden Garmin- oder Gefühlsdaten importiert sein.

**Wichtig:** Dies ist eine **Upload-Überlagerung für Full Source 0.5.77.26**, kein vollständiger neuer Snapshot aller Repository-Dateien. Alle übrigen Dateien aus deiner installierten Basis bleiben unverändert. Die Integration erfolgt während Vite-Build/Dev über eine geprüfte Bridge; `client/src/main.js` wird nicht überschrieben. Es gibt keine neuen Cloudflare-Migrationen und keine Datenlöschung.
