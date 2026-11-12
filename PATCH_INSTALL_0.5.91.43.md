# Patch Compass Life 0.5.91.43

Basis: genau Compass Life 0.5.91.42.

1. Vorhandenes Repository sichern.
2. Patch-ZIP ins Repository-Root entpacken, Ordnerstruktur beibehalten. Dateien ersetzen.
3. `npm ci` (Node 20+) und `npm run check:deploy`, anschließend `npm run build` auf einem Rechner/CI mit installierten Abhängigkeiten.
4. GitHub Actions/Pages-Deployment erst nach erfolgreichem Workflow als validiert betrachten.

Alle Trainings- und Smart-Tape-Messungen bleiben unverändert. Kein User-Tresor im ZIP.
