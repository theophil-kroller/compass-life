# Compass Web 0.5.77.59.40.10 — Project Trash Sync Recovery

**Basis:** `Compass_0.5.77.59.40.9_FULL_SOURCE_READY.zip`.

## Problem und Ursache

Beim unmittelbaren endgültigen Löschen eines Projekts aus dem Papierkorb konnte die Web-App bereits `status=deleted` im lokalen verschlüsselten State haben, während Cloudflare/D1 den Zwischenschritt `status=trash` noch nicht bestätigt hatte. Der Worker verweigert absichtlich direkte permanente Löschungen aus anderen Zuständen mit `project-not-in-trash` (HTTP 400). Die Fehlermeldung blieb beim nächsten Abgleich bestehen.

## Korrektur

- `syncProjects()` sendet den Löschwunsch zuerst wie bisher; ist das Projekt serverseitig bereits im Papierkorb, wird normal endgültig gelöscht.
- Nur bei **HTTP 400 + exakt `project-not-in-trash`** wird die fehlende Zwischentransition `status=trash` bei unveränderter lokaler Löschabsicht nachgereicht.
- Nach erfolgreicher Serverbestätigung speichert Compass **sofort** die neue Projektversion im verschlüsselten lokalen Tresor, bevor der endgültige Lösch-Request folgt. Ein Abbruch dazwischen ist deshalb wiederaufnehmbar.
- Wurde die lokale Löschabsicht während des Zwischenabgleichs geändert (z.B. Wiederherstellen), erfolgt keine weitere endgültige Löschung durch diese zweistufige Operation.
- Andere Projektaktionen werden weiterhin nur einmal synchronisiert. Ein Server-Konflikt (409) wird **nicht** automatisch überschrieben, und die Sicherheitsprüfungen für Projekte mit Kindern/Aufgaben bleiben serverseitig aktiv.
- Bereits lokal vorgemerkte Löschungen (`projectPending`) werden ohne manuelles erneutes Löschen abgearbeitet.

## Wichtig

- **Keine Datenmigration, keine Änderung am Worker, keine Änderungen an Projektdaten durch Installation.**
- Der Cloudflare Worker aus Compass 0.5.77.59.40.8 oder neuer muss bereits bereitgestellt sein; die Meldung `project-not-in-trash` zeigt, dass der Worker die Sicherungsregel kennt.
- Endgültiges Löschen bedeutet wie bisher redaktionelles Entfernen von Projektinhalten mit verbleibendem Synchronisations-Tombstone; keine vollständige physische Löschung des Datenbankdatensatzes.
- Die Freigabe der Test-Suite belegt keinen bereits durchgeführten Live-Cloudflare-Abgleich.

## Prüfungen

- `npm run check`: **1.563/1.563 Tests**, inkl. Worker-Syntaxprüfung, Release-Kette, Sync-Wiederanlauf und 409-Konfliktschutz.
- `npm run build`: in dieser Ausführungsumgebung nicht abgeschlossen (`vite: not found`, Build-Abhängigkeiten fehlen). Produktionsbuild über GitHub Actions erforderlich.
