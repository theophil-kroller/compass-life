# Compass Life 0.5.77.59.34 – Family-Radar Safety & V-Taper Feedback

Basis: GitHub Actions #268 (successful), Commit `a49d1d401e9a229955b12cab38c65ec59ef89a3a`.

## Family Radar – Fehlerbehebung
- Das alte Family Radar nahm fälschlich an, dass **jede Person** automatisch Family- und Mathe-Unterstützung erhält. Dadurch konnte eine erwachsene Freundin wie Bettina als Kind erscheinen.
- Neue sichere Voreinstellung: bekannte Kinder Nathanael und Seraphina bleiben automatisch zugeordnet. Für weitere Kinder ist eine ausdrückliche Klassifizierung als **Familie** und die neue Rolle **Kind – Lern- und Fristunterstützung** erforderlich.
- Erwachsene Freunde werden **nicht** automatisch zu Familien-Lernvorschlägen zugeordnet. Alte Einstellungen ohne Child-Rolle reichen für eine Aktivierung nicht aus. Auch das Erzeugen privater Aufgaben wird erneut geprüft.
- Beim Öffnen eines bereits als Familie klassifizierten Kontakts lassen sich Family-Radar-Rolle und Unterstützung konfigurieren. Es werden keine Kontakte gelöscht oder verändert.
- Bereits manuell angelegte, fälschliche Aufgaben werden **nicht** automatisch gelöscht: bitte bei Bedarf manuell entfernen.

## V-Taper Coach
- Nach Bestätigung eines Satzes RIR-Wert (verbleibende Wiederholungen) 0, 1, 2, 3 oder 4+ mit einem Tipp festhalten. Vorherige Sätze korrigierbar. Optional; niemals erfundene RIR-Werte.
- Dokumentiertes Wochenvolumen (Rücken, Schultergruppe, Brust, Beine, Beinrückseite, Rumpf) sichtbar mit transparenten, vorläufigen Richtwerten.
- Bei hohem dokumentiertem Wochenvolumen, sehr schwerem Feedback oder gleichzeitig niedrigen persönlichen Schlaf- und HRV-Trends wird der Vorschlag zur Satzanzahl **konservativ begrenzt**, ohne eigenmächtig Gewichte zu verändern. Coach dokumentiert den Grund, ohne physiologische Regeneration exakt zu behaupten.
- RIR-Verlauf fließt in textliche Wiederholungs-/Last-Hinweise ein.
- Kein geänderter Fokus-Modus, keine Google-Kalender-Schreibzugriffe, keine D1-Migration.

## Prüfung
- `npm run check`: JavaScript-Worker-Prüfung und **1.445/1.445** Node-Regressionsfälle erfolgreich, einschließlich realer Produktions-Transformationskette.
- `npm run build`: lokal nicht erfolgreich ausführbar – `vite: not found` aufgrund fehlender installierter npm-Pakete im GitHub-Quellcode-Snapshot. Der endgültige Produktionsbuild muss beim GitHub-Deployment bestätigt werden.
- Vollständiger Quellcode und Patch stammen aus dem identischen Zustand. **Nicht beide auf einmal auf GitHub hochladen.**

## Installation
1. `Compass_0.5.77.59.34_PATCH_READY_UPLOAD.zip` entpacken und Dateien in unveränderter Repo-Pfadstruktur auf `main` hochladen.
2. Den Full Source Build als Backup und Grundlage weiterer Versionen aufheben – bei normalem Upgrade nur den Patch hochladen.
3. Nach GitHub Actions prüfen, ob die neue App-Version und das RIR-Panel sichtbar sind.
