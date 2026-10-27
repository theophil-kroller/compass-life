# Compass Web 0.5.77.59.40.9 – Heute-Reihenfolge und sichtbarer Archiv-/Papierkorb-Hotfix

Ausgangspunkt: Full Source 0.5.77.59.40.8. Das N-of-1-Experiment-Tracking und alle bisherigen Coach-Funktionen bleiben erhalten.

## Korrekturen
- **Ursache des 0.40.8-Fehlers:** Archiv/Papierkorb waren in einem historischen, nicht mehr sichtbaren Projektbaum verankert. Die aktuelle 3-Pane-Ansicht (`compass58ProjectLayout`) rendert sie nun separat unter der echten linken Liste. Die Liste scrollt; die zwei Schaltflächen bleiben dauerhaft erreichbar.
- Im Projekt-Inspector **Archivieren/Papierkorb**; direkt neben Aufgabenzeilen im Projekt kleine Archiv- und Papierkorb-Aktionen; ebenso im Aufgabeninspektor.
- Im Archiv und im Papierkorb lassen sich Projekte und Aufgaben wiederherstellen. Projekt-Löschen bleibt in Version 0.40.8 auf leere Ordner/Projekte und Synchronisations-Tombstones beschränkt. Aufgaben im Papierkorb können sicher inhaltlich redigiert werden, die technische Synchronisations-ID verbleibt. Das ist kein physisches Löschen aller DB-Metadaten.
- Heute: ↑/↓ für die Tagesreihenfolge, gespeichert in synchronisierbarem `sortOrder`. Neue Aufgaben ohne Sortierung erscheinen nach bereits manuell sortierten Aufgaben. Keine Termin- oder Deadline-Änderung.
- GPS-Pin/Kontext auf zwei kleine 30-Pixel-Schalter verkleinert und auf Desktop rechts in der Datumskopfzeile ausgerichtet; Mobil bleibt das Layout responsiv.

## Sicherheit und Synchronisation
- Bestehende Task-Felder `archived`, `tags`, `sortOrder` – **keine neue Datenbankmigration**. Für Projektstatus `archived`/`trash` muss der Worker aus **0.40.8 oder neuer** bereits ausgerollt sein.
- Eine Aufgabe im Papierkorb trägt das zulässige reservierte Tag `CompassPapierkorb` und wird aus aktiven Listen entfernt; Wiederherstellung entfernt den Marker.
- Keine automatische Vernichtung von vorhandenen Aufgaben, Projekten oder Workout-Daten.

## Prüfung
- `npm run check`: **1556/1556 bestanden**, einschließlich kompletter Vite-Transformationskette und JS-Syntaxprüfung.
- `npm run build`: nicht ausgeführt, da Vite im Container nicht installiert ist (`vite: not found`). Muss in GitHub Actions geprüft werden.
- Produktions-/Mobil-/Cloud-Synchronisationstests nicht durchgeführt.
