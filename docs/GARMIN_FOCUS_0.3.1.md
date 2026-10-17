# Compass Focus Garmin 0.3.1 — runde fēnix 7S

**Status:** Quellcode-Build zur lokalen Abnahme. **Garmin-SDK/Simulator und echte Uhr wurden in dieser Umgebung nicht ausgeführt.**
Die funktionierende D4-Eingabebehandlung (ein `InputDelegate`, `.equals()` bei Strings)
ist übernommen; **D4** wurde durch den Nutzer zuvor im Garmin-Simulator bestätigt.

## Änderungen 0.3.1

- Ruhiges rundes UI für 240 × 240 Pixel, ohne dauerhafte Tasten-Erklärungszeile.
- Farbige Kategoriesymbole: Forschung (Türkis), Lehre (Gold), Prüfungen (Terrakotta/Orange),
  Verwaltung (Blaugrau), Meetings (dezentes Grau), Weiterbildung (Lila),
  Familie (Salbeigrün), Beziehungsdynamiken (Terrakotta).
- Sammelkategorien `Lehre` und `Prüfungen`; Unterscheidung Vorbereitung/Korrektur
  bzw. Projektzuordnung ist eine **spätere Compass-Funktion**, noch keine Uhr-Funktion.
- Kleine lokale Uhrzeit/Datum oben auf der Uhr.
- Pomodoro 25/5 als Countdown; freier Timer zählt aufwärts. Fokus nach 25 Minuten
  bleibt bei `00:00` bis START die Pause aktiviert. Nach 5 Minuten startet START
  die nächste Fokusphase. Die Uhr vibriert bei Phasenende.
- Pausieren/Fortsetzen über START. BACK öffnet ein Aktionsmenü mit Fortsetzen,
  Pausieren, Beenden & speichern. BACK im Menü kehrt ohne Änderung zurück.
- Herz-Symbol mit Pulswert (oder `--`) sowie liegende Batterie mit ganzzahliger
  Body Battery (oder `--`). Body Battery wird bei Beginn, periodisch und am Ende
  aus unterstützter SensorHistory gelesen, nicht sekündlich aus der UI.
- `X POMODOROS HEUTE`: lokal je Gerätekalendertag gespeichert; nur vollendete
  25-Minuten-Fokusblöcke zählen. **Noch kein plattformübergreifender Tageszähler.**
- Bestehende, lokal gespeicherte Sessions und Watch-Token bleiben erhalten.
- Keine Datenbankmigration gegenüber 0.3.0.

## Bedienung

| Situation | Taste | Wirkung |
| --- | --- | --- |
| Auswahl | UP/DOWN | Vorherige/nächste Kategorie, rundlaufend |
| Auswahl | START | Zeitmessung starten |
| Auswahl | MENU | Pomodoro / freier Timer |
| Auswahl | BACK oder LAP | Koppeln (wenn noch nicht gekoppelt) / Sync |
| Session | START | Pause / Weiter (an Phasengrenze nächste Phase) |
| Session | BACK | Aktionsmenü |
| Aktionsmenü | UP/DOWN | Menüpunkt auswählen |
| Aktionsmenü | START | Ausführen |
| Aktionsmenü | BACK | Zur Session zurück, ursprünglichen Pausenzustand bewahren |
| Kopplung | UP/DOWN | Ziffer ändern |
| Kopplung | START | Nächste Ziffer bzw. Code absenden |

## Wichtig: API vor neuen Kategorien aktualisieren

Das bisherige Worker-Backend 0.3.0 erlaubt nur die ursprünglichen Aktivitäts-IDs.
Compass 0.3.1 sendet `Lehre` oder `Pruefungen`, sofern diese auf der Uhr
gewählt wurden. **Vor der Synchronisierung dieser Kategorien** muss
`worker/src/watch.js` aus dem Repo-Patch 0.3.1 in GitHub übernommen und der
Cloudflare Worker `compass-api` erfolgreich neu bereitgestellt sein.
Alte IDs `Pruefungskorrektur` und `Pruefungserstellung` bleiben zulässig.
`client/src/main.js` und `client/src/style.css` zeigen danach die neuen Kategorien
mit Umlaut und farbigem Marker an.

Das heißt: Der **Garmin-PATCH** ist für den lokalen Simulator-Test ausreichend.
Für einen echten Upload mit Lehre/Prüfungen ist außerdem der **Repo-PATCH**
mit anschließendem Worker-Deployment nötig.

## Lokale Installation / Test

1. Bereits funktionierendes Garmin-Projekt `CompassWatch` und Developer Key sichern.
2. Garmin-Simulator schließen.
3. Aus dem Garmin-PATCH nur `source/CompassApp.mc` im vorhandenen Projekt ersetzen.
   `manifest.xml`, `resources/strings/strings.xml`, `resources/icon.png` aus
   der erfolgreichen 0.3.0-Compilerfix-Serie beibehalten.
   **Alternativ:** Garmin-FULL als neues Projekt öffnen (enthält alles Nötige).
4. VS Code: `Monkey C: Build for Device`, Ziel `fenix7s`, Modus `Debug`.
5. Bei `BUILD SUCCESSFUL` aus `CompassApp.mc` mit `Ctrl + F5` im `fenix7s_sim`
   starten. Falls der Build scheitert, **nur den neuesten Compilerblock** senden.
6. Testen: DOWN (Lehre), DOWN (Prüfungen), UP, START (Countdown 25:00),
   START (pausiert), START (läuft), BACK (Menü), DOWN + START (Pausieren),
   BACK -> UP/ DOWN bis Beenden & speichern -> START (zur Auswahl).
7. Übertragung, Kopplung und Sync erst nach bestandenem Simulator-Test und
   erfolgreichem Cloudflare Worker Deployment testen.

## Aktuelle Grenzen

- **Noch nicht implementiert:** Heute-Liste, Deadlines, Forecast, Zuordnung zu
  konkreten Projekten/Aufgaben, Aufgabenabhaken, optionale Tagesziele.
  Geplant für spätere Builds (ab Garmin 0.4.0).
- Die Uhr-Session-Daten liegen lokal in Garmin Storage, **nicht** im verschlüsselten
  Compass-Tresor; die Watch-Bridge speichert hochgeladene Messwerte in einer
  zugriffsgeschützten D1-Datenbank, nicht Ende-zu-Ende-verschlüsselt.
- Die SensorHistory-API und Pulsmessung können je nach Uhr, Firmware und
  Simulator unterschiedliche Werte liefern oder leer bleiben.
- Maximale lokale Upload-Warteschlange: 20 Sessions. Noch keine globale
  Tages-Pomodoro-Synchronisierung und kein fortgesetzter Timer über App-Neustarts.
