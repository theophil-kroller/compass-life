# Compass 0.5.77.29 · Garmin Strength CSV Recognition

**Patch-Basis:** `0.5.77.28` (Nutrition 3 `0.5.77.27` remains unchanged).

## Fehlerursache

Der bisherige `garmin-activities-csv.js`-Importer hat die von Garmin Connect gelieferten Spalten `Total Sets` und `Total Reps` nicht in die lokale Aktivitätsdatenbank übernommen. Das Krafttrainings-Dashboard wertete außerdem bisher ausschließlich detaillierte `garminStrength`-Sätze aus FIT-Aktivitätsdateien aus – die bereits importierten CSV-Krafttrainingseinheiten wurden dort nicht angezeigt.

## Behebung

- Garmin Activities CSV: `Total Sets` und `Total Reps` als nullable, plausibilisierte Zahlen übernehmen. Kein 0-Ersatz bei fehlenden Angaben.
- Muscle Map: Krafttrainingseinheiten aus der vorhandenen lokalen `healthImports.garminSessions`-Sammlung berücksichtigen; Trainingsdatum, Anzahl Einheiten und gemeldete Satz-/Wiederholungszahlen im Journal anzeigen.
- Trainingsrhythmus: exakte tägliche CSV-Set-Gesamtzahlen als Punkt darstellen, **ohne** Übungs- oder Muskelgruppen zu erfinden.
- Muskelkarte/Balance: CSV-Sätze ohne Einzelübung bleiben *nicht zugeordnet*. Für Muskelbalance nur eindeutig zuordenbare FIT-Sätze verwenden.
- Importabgleich: CSV-Zusammenfassung und spätere Aktivitäts-FIT anhand des Session-Starts in derselben Trainingseinheit zusammenführen. Wenn das FIT nur einen Teil der Sätze liefert, verbleibt ausschließlich die Differenz vorläufig ohne Muskelgruppe. Kein Summieren derselben Einheit aus zwei Quellen.
- Heute bleibt offen: Spätere CSV- und FIT-Imports ergänzen den Tag.
- Anzeigenhinweis, dass Wellness-/Daily-FIT-ZIPs **keine** Krafttrainings-Einzelübungen enthalten müssen.

## Erforderlicher einmaliger Schritt nach Upload

**Dieselbe Garmin-Activities-CSV erneut importieren.** Ältere Compass-Versionen hatten `Total Sets` und `Total Reps` beim ersten Import verworfen; die Zahlen lassen sich nicht allein aus dem lokal gespeicherten Aktivitätseintrag rekonstruieren. Beim erneuten CSV-Import werden die bestehenden Aktivitäten anhand ihrer stabilen Import-ID aktualisiert, nicht doppelt angelegt.

Für einzelne Übungsnamen, Gewichte und Muskelgruppen ist weiterhin die **Original-FIT-Datei der konkreten Garmin-Krafttrainings-Aktivität** nötig (Garmin Connect → Aktivität öffnen → Original exportieren). Ein täglicher Wellness-/Metriken-ZIP reicht nicht.

## Tests

14/14 Node-Modultests (8 bestehende + 6 neue) bestanden. Kein vollständiger Cloudflare-/Vite-Produktionsbuild ausgeführt; Live-Test mit einem echten Garmin-Strength-Aktivitäts-FIT steht aus.
