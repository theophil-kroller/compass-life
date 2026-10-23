# Compass Life 0.5.77.16 – Editor Stability & UI Performance

## Warum dieser Patch?

Beim Erstellen von Projekten, Vorlagen und Aufgaben konnte das gesamte UI im Hintergrund neu gezeichnet werden. Dadurch gingen der Fokus und nicht abgeschickte Formulardaten verloren. Mehrere Hintergrund-Updates verursachten außerdem vermeidbare großflächige Renderings und teueres JSON-Serialisieren umfangreicher historischer Daten.

## Änderungen

- **Verlässliche ungespeicherte Entwürfe** für neue und bestehende Aufgaben, Projekt-/Vorlagenformulare, Waiting-For-Formular, Inbox-Einträge, Dreams und aus Personen erstellte Projekte. Formularwerte, angezeigte Details, Fokus und Cursorposition werden bei unvermeidbaren Neuaufbauten wiederhergestellt.
- **Während der Texteingabe keinen unnötigen Voll-Render** auf demselben Screen. Navigation und ausdrücklich ausgelöste Aktionen bleiben möglich.
- **Separat verschlüsselter lokaler Entwurfsspeicher** (`edit_drafts_v57716` in der vorhandenen IndexedDB) mit AES-GCM und demselben aktiven Vault-Key. Dadurch ist bei Schreibpausen kein teurer, vollständiger Verschlüsselungsdurchlauf durch jahrelange Gesundheits- und Finanzdaten mehr nötig. Kein Upload an den Worker; keine Passwörter in Entwürfen.
- **Automatische Sicherung nach 2,8 Sekunden Eingabepause**; beim Sperren wird der Entwurf zuerst gespeichert und der Klartext-Cache zurückgesetzt. Erfolgreiches Speichern eines Formulars entfernt den Entwurf; bei fehlgeschlagener Mutation wird er wiederhergestellt.
- **Keine unnötigen Hintergrund-Renders**: Antworten von Garmin, Health und Android-Widget bauen nur relevante Ansichten neu auf.
- **Weniger JSON-Serialisierung bei gewöhnlichen Aufgabenänderungen**: teure Vergleiche großer importierter Finanz-/Gesundheitsbestände laufen nur bei aktiviertem privatem Gerätemirror. Journal-Vergleiche sind nur bei konfigurierter E2EE-Journal-Synchronisierung notwendig.
- Keine D1-Migration, keine Änderung der Server-API.

## Sicherheits- und Kompatibilitätshinweise

- Die separate Verschlüsselung ist lokal und an den entsperrten Browser-Vault gebunden. Vor dem Entsperren sind die Entwürfe nicht lesbar.
- Entwürfe werden nur für die explizit aufgeführten Formularfelder gespeichert; Dateiuploads und Passwörter sind ausgenommen.
- Ein Absturz innerhalb der 2,8-Sekunden-Speicherfrist kann die letzten Zeichen kosten; ein UI-Neurender während der Arbeit verliert sie nicht.
- Der Patch ist für **0.5.77.15**. Wird ein älterer Stand betrieben, stattdessen den vollständigen Quellstand verwenden.

## Validierung

- `npm test`: **907 von 907 Tests** erfolgreich, einschließlich fünf neuer Regressionstests zum Formularschutz und Rendering.
- `npm run check -w worker`: erfolgreich.
- `vite build`: hier nicht ausgeführt, da die Node-/Vite-Abhängigkeiten in diesem Container nicht installiert sind. GitHub Actions / Cloudflare Deployment prüfen.
