# Compass 0.5.11 · Personal Analytics: Produktivität × Gesundheit

## Was neu ist

Compass Insights → **Produktivität** ist jetzt ein funktionierender Tab. Die lokale Auswertung verknüpft:

- Garmin-/manuelle Arbeitssessions und protokollierte Pomodoro-Zähler;
- aus FIT-Dateien importierte Schlafdauer nach Aufwachdatum;
- Garmin-Stress-Tagesmittel (nur mit wenigstens zwölf gültigen 5-Minuten-Punkten);
- Garmin-Body-Battery-Vormittagswerte (6–11 Uhr, wenigstens zwei echte Messungen);
- Google-Calendar-Termine mit erkennbaren Meeting-, Lehr- oder Forschungstiteln (nur in der gerade aktiven Lesesitzung).

Der Tab zeigt acht Karten: erfasste Arbeitszeit, Fokuszeit nach Wochentag/Uhrzeit, Schlaf × Arbeit, Schlaf × Pomodoros, Stress × Arbeit, Body Battery am Morgen × Arbeit, Meetings × Arbeit und Kalender-Arbeitstypen. Scatterplots zeigen Einzelpunkte und Anzahl der tatsächlich gepaarten Tage – **keine ausgedachten Korrelationen, Garmin-Scores oder 95%-Konfidenzintervalle**.

Die Google-Calendar-Abfrage liest nun maximal 90 Tage zurück und 90 Tage voraus (jeweils ab dem aktuellen Datum). Standardmäßig lädt sie maximal fünf Seiten à 200 Termine; bei einem unvollständigen Kalenderergebnis werden keine Kalendertage als vollständig gezählt. Kalenderhistorie wird **nicht persistent in Compass gespeichert**. Kalenderzugriff bleibt read-only, OAuth-Token bleibt im Speicher. Kalendervergleiche sind nur verfügbar, wenn der Kalender erfolgreich geladen wurde.

Die bestehende Garmin-Session-API liefert gegenwärtig nur einen begrenzten Bestand zuletzt aufgezeichneter Sessions. Es können deshalb durchaus mehr Schlaf- als Arbeitstage verfügbar sein. Ein Tag ohne erfasste Arbeitssession gilt **nicht** als arbeitsfrei oder unproduktiv. Die Arbeitssessions bezeichnen erfasste Dauer, nicht Leistung oder Ergebnisqualität. Unter „Arbeit“ werden nur Sessions mit der Aktivitätskategorie Arbeit ausgewertet. Meeting-/Lehr-/Forschungstitel werden vorläufig über klar deklarierte Schlüsselwörter klassifiziert und können unvollständig sein.

## Installation

1. Vorher den verschlüsselten lokalen Compass-Tresor sichern.
2. `Compass_0.5.11_GITHUB_PATCH.zip` lokal **entpacken**, Dateien relativ zur Repository-Wurzel unverändert ins GitHub-Repository `theophil-kroller/compass-life` auf Branch `main` hochladen. ZIP selbst **nicht** als Datei ins Repo hochladen.
3. Den Workflow [Deploy Compass Web](https://github.com/theophil-kroller/compass-life/actions) bis zum grünen Ergebnis abwarten.
4. Compass neu öffnen, den **bestehenden** Vault entsperren, Insights → Produktivität auswählen.
5. Über **Arbeitssessions laden** deine Garmin-Pomodoros abrufen und über **Kalender verbinden / aktualisieren** Google-Termine einlesen. Zum Vergleich der letzten Wochen Garmin-Wellness-ZIPs unter Datenquellen importiert lassen.

**Kein neues SQL. Kein D1-Migrationsschritt. Kein Worker-Deploy. Keine neue Android-APK.** Ausschließlich clientseitige, rückwärtskompatible Änderungen.

## Datenschutz und Datenqualität

- Gesundheits-Rohdaten verbleiben im verschlüsselten lokalen Tresor.
- Auswertungen finden lokal im Browser statt. Der neue Tab sendet keine Gesundheitsdaten oder Kalendertitel an den Worker.
- Bestehende Uhr-Sessions werden wie bisher über die bereits vorhandene API abgerufen; keine zusätzliche Übermittlung dieser Sessions.
- Kalenderdetails werden ausschließlich von Google Calendar angefordert und im Arbeitsspeicher gehalten, nicht in D1 gespeichert.
- **Keine** Tagesnullen bei fehlenden Sessions oder abgebrochener Kalenderpagination.
- Alle Vergleiche sind deskriptiv; ohne experimentelle Kontrollen oder geeignete statistische Zeitreihenmethoden sind keine kausalen Schlussfolgerungen zulässig.

## Qualitätsprüfung

- `node --test tests/*.test.mjs`: 141/141 bestanden.
- `node --check client/src/main.js` und `client/src/insights-productivity.js`: bestanden.
- Chromium-Layoutprobe Desktop 1400 px und Mobil 390 px: kein horizontales Seitenoverflow.
- Ein echter Vite-Produktionsbuild konnte lokal wegen nicht verfügbarer npm-Abhängigkeiten nicht durchgeführt werden. **GitHub Actions** bleibt der entscheidende Produktions-Build-Check.

## Nächste Phase

0.5.12: Orte/Reisen – zunächst eine datenschutzbewusste Auswertung bestätigter Aufenthalte. Danach Explorer, Unsicherheitsmaße/95%-KI nur bei ausreichender Datenlage sowie freiwillig verschlüsselte Monats-/Jahresaggregate.
