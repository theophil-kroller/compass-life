# Compass Life 0.5.91.41 · Visueller V-Taper-Fortschritt & Kraftprogression

Baseline: Compass Life 0.5.91.40 (Smart Tape Pump Context), unveränderte lokale Tresordaten. Kein Repository-Write.

## Highlights

- **Insights → Körper:** Neues V-Taper-Dashboard an erster Stelle vor allen bisherigen Diagrammen. Zwei echte Smart-Tape-Check-ins liefern Schulter/Taille-Ratio, Wochenänderung, zwei modellierte Silhouetten und eine Erklärung einschließlich Post-Workout-/Pump-Hinweis. Keine künstliche Normzahl oder medizinische Diagnose; nur vorhandene synchronisierte Messungen. Keine Vorhersage sichtbaren Muskelaufbaus aus einer einzelnen Woche.
- **Insights → Krafttraining:** Die vorhandene V-Taper-Ansicht bleibt zuerst. Danach kommt unmittelbar die anatomische Vorder-/Rückseiten-Muskelkarte; anschließend die neuen Progressionskurven pro Übung, danach unverändert Trainingsstatistiken, Editor, Trainingsrhythmus und Journal.
- **Muskelkarte:** Berühren/Anklicken zeigt zugeordnete Übungstitel mit letztem dokumentierten Arbeitsgewicht, Wiederholungen und Trainingstag. Gewicht wird **nicht** fälschlich einem einzelnen Muskel zugeordnet oder mit anderen Übungen addiert.
- **Kraftprogression:** Pro Übung ein visueller, datumsbasierter Verlauf des schwersten dokumentierten Arbeitssatzes je Tag (bzw. Wiederholungen ohne Zusatzlast), Bestlast und nächste Veränderung zu vorheriger Einheit. Bei gleichem Gewicht werden zusätzliche Wiederholungen ausdrücklich gewürdigt. Höhere Last bei weniger Wiederholungen wird nicht automatisch als Kraftzuwachs interpretiert. Mit noch zu wenigen Daten erscheint kein künstlicher Trend.
- **V-Taper-Motivation direkt im Workout-Preview:** Zu jeder klassifizierten Übung steht ein anatomisch begründeter, kurzer Satz: etwa Seitliche-Schulter-Training für eine breitere Schulterlinie und einen 3D-Effekt. Gleiche Erklärung in optionaler vierter Übung, Einzelübungs-Vorschau, aktivem Satzbild und Übungsprogression. Kein Versprechen lokaler Fettverbrennung; auf schmalen Displays bleibt der Satz lesbar und verdeckt keine Satzbedienung.
- **Datengüte:** Bestätigte Coach-Sätze sowie bereits abgeglichene Garmin-Sätze nutzen dasselbe read-only `strengthPeriod`-Modell; fehlende oder unklassifizierte Übungsgewichte bleiben fehlend. Kein Eingriff in Übungsspeicherung, Ernährungsdaten oder Vault.

## Prüfung

- `node --check` für alle geänderten JS-Module erfolgreich.
- 33/33 Deployment-Prüfungen erfolgreich (`npm run check:deploy`).
- Voller `npm test`: 2.220 erfolgreich, 66 alte Fehlschläge. Gegenüber 0.5.91.40 **keine neuen Fehlschläge**.
- Vite-Build benötigt die Projekt-Dependencies und ist hier nicht als erfolgreicher Produktions-Build validiert; GitHub Actions muss nach Upload prüfen und deployen.

## Installation

Patch nur auf exakt 0.5.91.40 anwenden, ansonsten das Full-Source-ZIP verwenden. Dateien mit Pfadstruktur ins Repository hochladen. Kein persönlicher Tresor im Archiv.
