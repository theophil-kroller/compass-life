# Compass Life 0.5.77.8 – Stress × Kalender × Aktivität

## Neue lokale Kontextanalyse auf der Stress-Seite

- Unterhalb des Raincloud-Plots erscheint „Was war bei meinen Stresswerten los?“
- Die vier Garmin-Stresszonen **Ruhe (0–25), Niedrig (>25–50), Mittel (>50–75), Hoch (>75–100)** vergleichen ausschließlich gemessene Stresspunkte mit zeitlich überlappenden Kalendereinträgen und Aktivitäten.
- Der Vergleich nennt konkret erkannte Kalendereinträge und protokollierte Aktivitäten sowie die Häufigkeit ihrer Überschneidung (in Messpunkten).
- „Hohe Stressphasen“ zeigt die letzten zwölf zeitlich zusammenhängenden Phasen ab einem Wert über 75, mit Datum, Uhrzeit, gemessenem Spitzenwert, Kalender und Aktivität.
- Bezieht Google-Calendar-Einträge (nur Termine mit Uhrzeit), lokale/Garmin-Watch-Aktivitätsaufzeichnungen und aus FIT/Activities.csv importierte Garmin-Trainingssessions ein.
- Ignoriert abgesagte, ganztägige und ausgeblendete Kalendereinträge. Doppelte Kalender-Occurrences sowie offenkundig doppelte Garmin-Sportaktivitäten werden reduziert.
- Beachtet Gerätezeitzone und die zeitliche Abdeckung des geladenen Google-Kalenders. Fehlende Kalenderdaten werden ausdrücklich als **unbekannt** ausgewiesen.
- Datenverarbeitung nur lokal im entsperrten Vault: keine neuen Worker-/D1-Endpunkte und keine externen KI-Aufrufe.

## Einschränkungen

Die Auswertung vergleicht **Zeitfenster**, keine nachgewiesenen Ursachen. Ein Kalendereintrag beweist keine Teilnahme; fehlende Aktivitäten sind keine Ruhephasen. Der Garmin-Stresswert misst physiologische Reaktionen, nicht negative Emotionen. Garmin-Activities.csv kann lokale Uhrzeiten ohne Zeitzoneninformation enthalten; diese Matches werden gekennzeichnet. Sehr alte Kalendertage außerhalb des synchronisierten Kalenderfensters sind nur teilweise zuordenbar.

## Qualität

- Node-Testlauf: 854/854 erfolgreich.
- Worker-JS-Syntax: erfolgreich.
- JavaScript-Syntax (neues Modul, Main, Wellness): erfolgreich.
- Vite-Produktionsbuild lokal nicht möglich, da `vite`/`node_modules` hier fehlen; GitHub Actions überprüfen.
