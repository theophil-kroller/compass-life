# Compass 0.5.42 – Fortschritt in Stückzahlen

**Use Case:** „Prüfungen korrigieren“ – 36 Stück insgesamt, 12 bisher korrigiert.

- Im Aufgaben-Inspector einmal unter **Stückfortschritt** das Ziel und ggf. den bereits erreichten Stand eintragen.
- In **Projekte** und **Next Actions** erscheint ein dezenter Fortschrittsbalken samt `12/36` und `+1`.
- Ein Klick auf `+1` verändert ausschließlich den Zählerstand; die Aufgabe bleibt offen, bis man sie regulär abschließt.
- Bei Zielerreichung wird die Schaltfläche deaktiviert und eine Nachricht angezeigt; im Inspector ist mit `−1` eine Korrektur möglich.
- Für kopierte Projektvorlagen und wiederholte abgeschlossene Aufgaben werden Zähler zurückgesetzt, das Ziel bleibt erhalten.
- Aufgaben, die keinen Stückzähler nutzen, bleiben optisch und funktional unverändert.

**Datenmodell:** `planning_tasks.progress_current` (integer, default 0), `progress_target` (integer, nullable). API und Vault verwenden `progressCurrent`, `progressTarget`. Zulässige Ziele 1–100000; Status 0 bis Ziel. Kein Target erfordert Status 0. D1-Migration `0016_task_progress_counters.sql`, vor Worker-Deployment.

**Datenfluss und Sicherheit:** Zähler wird wie Aufgaben synchronisiert, mit bestehender optimistischer Versionskontrolle und Konflikterkennung. Keine zusätzlichen Drittanbieter oder Datenübermittlung. Keine automatische Frist oder Aufgaben-Erledigung.

**Validierung:** 430 von 430 Tests bestanden (`npm test`), Worker-Checks bestanden (`npm run check`). Produktion (`vite build`) und Browser-E2E hier mangels installierter Vite-Abhängigkeiten nicht ausführbar.
