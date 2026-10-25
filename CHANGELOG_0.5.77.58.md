# Compass Life 0.5.77.58 — Projects & Inbox GTD

## Projects: Drei-Spalten-Ansicht (OmniFocus-inspiriert)

- Links: Ordner, Unterordner und Projekte. Folder-Caret öffnet die enthaltenen Projekte; die Aufgaben erscheinen hier **nicht**.
- Mitte: Aufgaben-Outline des ausgewählten Projekts; bei Auswahl eines Ordners die enthaltenen Projekte. Checkbox, Heute-Vormerkung, Flagging, Unteraufgaben, Reihenfolge und vorhandene Task-Handler weiterbenutzt.
- Rechts: Projekt-Inspector oder Aufgaben-Inspector. Schließen blendet nur den Inspector aus – die Projektauswahl bleibt erhalten.
- Kein gleichzeitig gerendertes globales Projektbaum- und Aufgaben-Outline mehr.
- Projektwerkzeuge (Austausch, Lebensziele, Projektgesundheit) nur nach ausdrücklichem Klick berechnet und angezeigt.
- Neue Projekte, Ordner und Aufgaben nutzen die vorhandenen Formulare / Aktionen. Der separate Vorlagenbereich bleibt unverändert.
- Mobile: kompakte aufklappbare Ordner-/Projektnavigation, darunter Aufgabenliste und Inspector.

## Inbox → Dreams / Someday–Maybe

- Im Inbox-Inspector: Kategorie wählen und **Zu Dreams** klicken.
- Titel und Notiz sowie freie Tags bleiben erhalten; `dreams`/`dream-<Kategorie>` kennzeichnen den bestehenden verschlüsselten Record.
- Anders als bei `Als Aufgabe übernehmen` wird **kein Task** erzeugt und **keine Deadline** gesetzt.
- Die Änderung erfolgt atomar über den vorhandenen Vault-/Sync-Mutationspfad.
- Inbox zeigt nur weiterhin ungeklärte Einträge; der umklassifizierte Eintrag erscheint in Dreams.

## Sicherheit / Performance / Tests

- Keine Änderungen an Verschlüsselung, Cloud API oder Datenschema.
- Die Projekttasks werden nur für das ausgewählte Projekt gerendert; Tools werden nicht ungefragt gebaut.
- Eigene Tests zu Nested Folder, Aufgabe vs. Projekt-Inspector, Inspector-Schließen, Inbox-Dreams-Konversion und Source-Transform.
- Die vier älteren, versionsbezogenen CI-Tests sind auf `.58` aktualisiert.
- 28/28 lokale Tests in einer isolierten, aus den bisher ausgelieferten Bridge-Dateien zusammengesetzten Testumgebung erfolgreich.
- **Kein vollständiger lokaler Vite-Produktionsbuild**: Die einzige verbindliche Produktionsprüfung ist GitHub Actions nach dem Upload.
