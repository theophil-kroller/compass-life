# Compass Life 0.5.77.17 – Action-first People & GTD Fast Paths

## Schwerpunkt

Die täglichen Kernbereiche **Heute, Inbox, Planen und Menschen** sollen schnell und ohne Eingabeabbrüche arbeiten. Der zuvor eingeführte verschlüsselte Formularentwurfsschutz aus 0.5.77.16 bleibt bestehen.

## Menschen: offene To-dos statt Nähe im Vordergrund

- Im normalen **Menschen**-Tab erscheinen **offene Aufgaben, Waiting For und ungeklärte Inbox-/Gesprächspunkte vor den Beziehungseinstellungen**.
- Die linke Kontaktliste ist nach der Zahl offener Aufgaben und Inbox-Einträge sortiert; innerhalb gleicher Anzahl alphabetisch. Markierte Vorlagen-, archivierte und erledigte Aufgaben werden nicht als offene Personen-To-dos gezählt.
- Die ersten 80 Kontakte werden zunächst gerendert; bei Bedarf lassen sich alle anzeigen. Die vorhandene Beziehungslandkarte bleibt über ihren eigenen Tab erreichbar.
- Relationship Radar, Nähe-Slider und Kontaktrhythmus befinden sich in einem bewusst einblendbaren **„Beziehung & Nähe“**-Bereich. Der kompliziertere Profil-Inspector wird im Listenmodus erst nach Öffnen gebaut.
- Die Zuordnung von To-dos und Inbox über Personentags wird einmal pro Darstellung indiziert (statt Aufgaben/Inbox je Person einzeln mehrfach zu durchlaufen). Vorhandene Tags und Verknüpfungen bleiben unverändert.

## Performance-Fixes

- **Planen:** Die sichtbare Projekt- und Aufgabenhierarchie wird aus einmalig aufgebauten Maps rekursiv gerendert. Dadurch werden die teuren Vollscans aller Projekte/Aufgaben für jeden Baumknoten vermieden; auch Vorlagen-Zähler nutzen den Index.
- **Inbox:** Synchronisierungsanzeigen verwenden ein Set der ausstehenden IDs statt einer linearen Suche für jede Inbox-Zeile.
- **Heute / Navigation:** Die Inbox-Anzahl in der Navigation benötigt kein Sortieren aller Inbox-Einträge. Die Projektgesundheit ermittelt die Zuordnung von Aufgaben zu Projekten nur einmal.
- **Menschen / Kontaktnotizen:** Der alte 300-ms-Autosave verschlüsselte den kompletten Vault während des Tippens. Jetzt hält Compass die laufende Eingabe im Speicher und sichert sie über den vorhandenen separaten AES-GCM-Entwurfsspeicher aus 0.5.77.16 nach Schreibpause. Die explizite Bestätigung eines Kontakts schreibt weiterhin in den Vault.

## Kompatibilität

- Patch von 0.5.77.16; für ältere Installationen den **Full Source**-Stand verwenden.
- Keine Änderungen am Worker, den D1-Migrationen, an Cloud-APIs oder bestehenden Daten.
- Keine neuen Nutzerrechte und keine Netzwerkweitergabe privater Entwürfe.
- Gezielte Regressionstests der alten VM-Testharnesses auf die neuen reinen Index-Module umgestellt. Frühere Tests bezüglich automatischer Voll-Vault-Speicherung von Kontaktentwürfen aktualisiert, da diese teure Speicherung durch den verschlüsselten Mini-Entwurf ersetzt wurde.

## Prüfstand

- `npm test`: **912/912 erfolgreich** (inklusive fünf neuen Tests zum Tag-Index, großen Datenmengen, Agenda-Reihenfolge, lokalem Notizspeichern und Projektbaum-Index).
- `npm run check -w worker`: erfolgreich.
- `node --check client/src/main.js`: erfolgreich.
- Ein echter Browser-Benchmark mit deinem persönlichen Datenbestand und `vite build` war in dieser Umgebung nicht verfügbar. Deshalb sind Verbesserungen strukturell und über Unit-/Regressionstests bestätigt, nicht durch gemessene Endnutzer-Latenzen garantiert.
