# 0.5.48 – Compact Day Planner / Urgency Intelligence

## Warum
Die Forecast-Ansicht soll Heute/Morgen und jeden Forecast-Tag in wenige nachvollziehbare
Arbeitsblöcke übersetzen. GTD-Next-Actions bleiben die einzige Quelle für planbare To-dos.
Die Tagesplanung ist bewusst klein, aufklappbar und verändert niemals den Google-Kalender.

## UX
- Forecast-Kalendertag anklicken oder Heute/Morgen im aufklappbaren Plan auswählen.
- Relevante nächste Aktionen, sortiert nach Deadline-Druck, markieren/ziehen.
- Freie Slots im eingestellten Arbeitszeitrahmen und mit Meetings/Puffern bereinigt.
- Klick auf Aufgabe + Klick auf Slot ist als zugängliche Alternative zum Ziehen möglich.
- Planblöcke lokal merken, wieder verschieben, als gearbeitet markieren oder entfernen.
- Tagesstatus und fehlende hard deadlines bewusst trennen.

## Urgency Score
Der Score 0–100 ist eine **Heuristik**, keine exakte Eintrittswahrscheinlichkeit.
Berücksichtigt Deadline-Abstand und *bei lückenlos bekanntem Horizont* den kumulativen
Restaufwand im Verhältnis zur verbleibenden Kalenderkapazität. Farben Grün/Gelb/Orange/Rot;
'Gefährdet' **nur** wenn belegbare verfügbare Zeit kleiner als kumulierte fällige Arbeit
ist oder eine echte Deadline bereits überschritten ist. Fehlende Aufwandsschätzungen
und Kalenderlücken sind als unbekannt zu kennzeichnen, nicht als machbar oder unmöglich.

## Fehlt ein Datum?
Eine verfügbare Next Action ohne eigene/geerbte Hard Deadline **und** ohne Planned-Date
erscheint mit 'Datum prüfen'. Per Inline-Form lässt sich ein Planned-Date (unverbindlich)
oder eine echte Deadline bewusst setzen; Someday/Maybe, Waiting For und blockierte
Aufgaben erscheinen nicht als planbare Aufgaben. Echte Deadlines werden nicht erfunden.

## Datenschutz und Sicherheit
- Google Calendar weiterhin read-only; keine automatisch erstellten Termine.
- `uiPreferences.dailyPlanBlocks` liegt im verschlüsselten lokalen Vault, nicht in D1.
- Einträge werden vor dem Speichern gegen aktuelle Kalenderabdeckung, GTD-Status,
  Zeitfenster, vorhandene Blöcke und Restaufwand geprüft.
- Keine Platzierung bei veraltetem/unvollständigem Kalender.
- Block 'erledigt' ist eine Bestätigung eines geplanten Zeitfensters, keine automatische
  Erledigung der zugrundeliegenden GTD-Aufgabe.
- Tagesplanung ist keine tatsächliche Arbeitszeiterfassung.

## Grenzen und Nachtest
- Nur primärer Google-Kalender, nicht automatisch alle Kalender.
- Keine Drag-and-drop-Autotests im realen Browser (UI-Logik durch Quelltextchecks,
  pure Module durch 20 fokussierte Tests geprüft).
- Native HTML5 Drag-and-drop auf Touchgeräten nicht überall verfügbar; Touch/Keyboard
  fallback über Aufgabe wählen → freien Slot anklicken.
- Der Tagesplan wird nicht geräteübergreifend synchronisiert.
- Vite-Produktionsbuild und visuelle Live-Browserabnahme fehlen in Testumgebung.
