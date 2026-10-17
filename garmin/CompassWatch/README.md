# Compass Focus 0.3.3 — fēnix 7S

**Status: Quellcode-Vorabversion. Noch nicht auf Garmin SDK 9.2.0 kompiliert oder auf echter Uhr getestet.**

## Änderungen gegenüber 0.3.2
- Rot-grüne Tomate unabhängig von der gewählten Kategorie (Tomatenrot `#E65B50`).
- Bessere Unterscheidung von Verwaltung (Blau), Meetings (gedämpftes Stahlblau),
  Weiterbildung (Lila), Familie (Grün), Forschung (Türkis), Lehre (Gold),
  Prüfungen (Orange) und Counseling (Koralle).
- Body-Battery-Symbol vollständig als einheitlicher liegender Rahmen gezeichnet;
  der untere Füllbalken repräsentiert den Wert von 0 bis 100. Kein Satz von 100 Grafiken.
  Zahl steht auf dunklem Hintergrund im Symbol; unbekannt = `--`.
- MENU in der Tätigkeitsauswahl öffnet jetzt die COMPASS-Navigation:
  FOKUS, HEUTE, FORECAST, TIMER-MODUS und SYNCHRONISIEREN.
- Nach START bei TIMER-MODUS wird Pomodoro/freier Timer für die gewählte
  Kategorie umgeschaltet, wie vorher mit MENU direkt.
- Heute/Forecast sind **ausdrücklich leere Informationsansichten**. Sie zeigen
  keine erfundenen Aufgaben. Die echte Datenquelle ist in Compass noch nicht da.
- Im Session-Menü heißt die letzte Option kurz `Beenden` (speichert weiterhin lokal).

## Navigation
1. In der Kategorienauswahl weiterhin UP/DOWN zur Kategorie, START zum Beginnen.
2. MENU öffnet das Hauptmenü; dort UP/DOWN auswählen, START bestätigen.
3. `HEUTE`/`FORECAST`: BACK führt ins Hauptmenü zurück.
4. Im Hauptmenü BACK zur Tätigkeitsauswahl.
5. Während einer Session START = Pause/Weiter; BACK = Session-Menü;
   dort BEENDEN sichert die Sitzung lokal und lädt sie ggf. hoch.

## Noch nicht möglich (keine Fake-Daten)
Die derzeitige Compass-PWA speichert nur undatierte Inbox-Captures. Sie hat zwar
Heute- und Forecast-Ansichten, aber noch keine synchronisierbaren Task-Felder
für `planned_for`, `due_at`, `target_date`, Fälligkeitsstatus oder Projektreferenzen.
Ohne ein versioniertes Compass-Datenschema und sichere Watch-Read-API können wir
keine echten Tagesaufgaben oder Deadlines auf die Garmin übertragen.

## Test in VS Code
PATCH: `source/CompassApp.mc` in bestehendem Projekt ersetzen; FULL: neues Projekt
öffnen. `Ctrl+F5` für fenix7s_sim, ggf. `Build for Device` zuerst. TEST:
Kategorienfarben, Pomodoro-Tomate, Body-Battery-Umriss, MENU, UP/DOWN,
HEUTE/FORECAST mit ehrlich leerem Zustand, BACK und Session-Menü.
In der Simulation zeigt Body Battery ggf. keinen verfügbaren Wert.

Die Cloudflare-API und D1-Datenbank werden von diesem UI-Patch nicht verändert.
