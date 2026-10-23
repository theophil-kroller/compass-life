# Compass 0.5.77.13 — Bearbeitbare Vorlagen & Einkaufslisten

## Reparatur: Aufgabenerstellung in Vorlagen

- Die neue Aufgabenmaske hält eine ausgewählte Vorlage explizit als `projectId` fest; für Vorlagen wird ein verstecktes, fest zugeordnetes Formularfeld verwendet, nicht mehr die Auswahl der normalen Projekte.
- Die Validierung der Unteraufgaben-Hierarchie bleibt aktiv. Vorlagen können regulär mit Haupt- und Unteraufgaben ergänzt werden, ohne die Meldung „Aufgabenfelder bzw. Hierarchie prüfen“ aufgrund einer verlorenen Projektzuordnung.
- Vorlageneinträge lassen sich direkt im Inspector bearbeiten, insbesondere mit einem sichtbaren Titelfeld, Notizen und vorhandenen Zusatzfeldern.
- Auf der Vorlagen-Seite steht neben „Neue Liste“ nun „+ Eintrag“. Checklisten-Kontrollen in der Stammliste sind bewusst durch neutrale Symbole ersetzt; abhaken geschieht nur in einer erzeugten Liste.

## Neu: Einkaufslisten im GTD-Bereich

- Navigationspunkt **Planen → Einkaufslisten**.
- Bei Einkaufs-Vorlagen wird „Neue Liste“ zu einer unabhängigen Kopie im Ordner „Einkaufslisten“. Aufgaben (auch hierarchische) werden mit neuen IDs kopiert; erledigte, datierte oder markierte Zustände aus der Vorlage werden nicht übernommen.
- Der Einkauf lässt sich in einer auf Smartphones nutzbaren großen Checkliste abhaken. Fortschritt und die aktuell aktive Liste sind sofort sichtbar.
- **Liste bearbeiten** öffnet die konkrete Kopie in Projekten. **Vorlage bearbeiten** öffnet die unveränderte Stammliste.
- **Einkauf archivieren** schließt die Liste auf Projekt-Ebene ab (`status: completed`). Das unterscheidet sich von Datenlöschung: Historie und Status bleiben gespeichert, und die Kopie kann über „Archivierte Einkaufslisten → Wieder öffnen“ wieder aktiviert werden.
- Bei noch offenen Positionen fragt Compass vor dem Archivieren nach. Die ursprüngliche Vorlage bleibt in jedem Fall unverändert.
- Ältere Einkäufe mit `Einkauf` im Namen sind im neuen Einkaufsbereich sichtbar, auch ohne Migration.

## Technik und Rückwärtskompatibilität

- Nur bestehende Projekt- und Aufgabenfelder mit bestehender Cloud-Synchronisierung: kein neues D1-Schema, kein Worker-Update.
- Neue pure Funktionen in `client/src/shopping-lists-v57713.js`, UI in `main.js`, Styling `shopping-lists-v57713.css`.
- Browser-Render-Smoke-Test um die Einkaufsansicht erweitert; weitere Tests prüfen Vorlage → Kopie → Abhaken → Archivieren → Wiederöffnen.
- Alle bestehenden GTD-, Finanz-, Health- und Ernährungsmodule bleiben enthalten.
- 887 von 887 Node-Tests erfolgreich; Worker-Syntaxprüfung erfolgreich. Vite-Produktionsbuild nicht lokal ausgeführt (fehlende installierte Vite-Abhängigkeiten), GitHub Actions nach Upload prüfen.
