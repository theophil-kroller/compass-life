# Compass Life 0.5.77.10 – Stress-Tageszeitstrahl & Gestern geplant

## 1. Stress im Tagesablauf

In **Insights → Gesundheit → Stress** zeigt die neue Sektion **„Was stand an, als mein Stress stieg?“** für den ausgewählten Messtag eine gemeinsame Zeitachse:

- Nur tatsächlich aufgezeichnete Garmin-Stresspunkte und hohe Spitzen (über 75); Messlücken bleiben erkennbar und werden nicht geschätzt.
- **Konkrete Kalendereinträge** (Lehrveranstaltung, Besprechung, Veranstaltung …) als geplante Blöcke, mit Start/Ende und vollständigen Titeln im Tooltip sowie einer aufklappbaren Liste.
- Allgemeine Einträge wie `Work`, `Arbeitszeit` oder `Research Blocker` erscheinen höchstens als **grauer Hintergrund „Arbeitsblock · ohne konkrete Tätigkeit“**. Sie werden nicht länger als eigenständige Ereignisse für Stressspitzen- oder Mustererklärungen ausgewertet. Die echten Kalendereinträge bleiben davon unabhängig sichtbar.
- Garmin-Trainings, protokollierte Compass-Aktivitäten und aktuelle Einträge des lokalen Zeitjournals/Quick-Worktime, soweit sie **einen konkreten Titel und einen wirklichen Zeitraum** haben.
- Morgen (06–12), Tag (12–18), Abend (18–24): arithmetische Durchschnittswerte nur bei mindestens drei tatsächlich gemessenen Stresspunkten; Anzahl und hohe Messpunkte je Tageszeit.
- Tageswechsel über die bereits bestehende Messtag-Navigation. Kalenderlücken sind ausdrücklich unbekannt; ein Kalendereintrag belegt nicht die tatsächliche Teilnahme. Es gibt keine Diagnose oder Kausalinterpretation.

Die Darstellung wird aus vorhandenen lokal entschlüsselten Daten berechnet, ohne Serverzugriff oder neue Datenbankfelder.

## 2. Heute und Next Actions: gestern geplant

- Unter **Heute → Meine Aufgaben** erscheint **„Gestern geplant · noch offen“**, sofern genau am vorherigen Kalendertag Aufgaben geplant, aber nicht abgeschlossen wurden. Unfertige Tagesplanblöcke werden ebenfalls berücksichtigt.
- Knöpfe **Ansehen** (Inspector) und **Heute +** (bewusst neu vormerken, `plannedDate` aktualisieren, `dueDate` unverändert).
- Unter **Next Actions** erscheint für diese Aufgaben die dezente Kennzeichnung **↶ Gestern geplant**.
- **Kein automatisches Fortschreiben:** Zwei Tage alte nicht neu vorgemerkte Aufgaben erhalten die Kennzeichnung nicht mehr; die eigentlichen Aufgaben werden niemals gelöscht oder auf den heutigen Tag verschoben, bevor die Person „Heute +“ auswählt.
- Erledigte, archivierte und Vorlagen-Aufgaben werden nicht vorgeschlagen. Nicht verfügbare Aufgaben können angesehen, aber nicht direkt wieder eingeplant werden.

## Technik & Qualität

- Neu: `client/src/stress-day-timeline-v57710.js`, CSS, `client/src/yesterday-intentions-v57710.js`.
- Erweitert: `insights-wellness.js`, `main.js`, `stress-context-v5778.js`, `stress-patterns-v5779.js`.
- Neue Tests für zeitliche Überlagerung, generische Arbeitsblöcke, Zeitjournal, Datenlücken sowie exaktes 1-Tages-Gedächtnis.
- **870/870 automatisierte Node-Tests grün**, Worker-Syntaxprüfung bestanden, geänderte JavaScript-Dateien syntaktisch geprüft.
- Vite-Produktionsbuild in dieser Umgebung nicht möglich (Abhängigkeiten fehlen); bitte GitHub Actions nach Upload prüfen.
- Kein Worker-Update und keine D1-Migration erforderlich.
