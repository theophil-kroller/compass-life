# Compass Life 0.5.91.56 — Smart Tape & V-Taper-Prognose korrigiert

Basis: **0.5.91.55**. Source-ZIP, kein vorkompilierter PWA-Build.

## Ursache und Behebung

- **Schulter / Taille im Krafttraining:** Der alte V-Taper-Kasten las nur die manuellen Alt-Felder `shoulderCm` und `waistCm`, nicht die Fitdays+-Smart-Tape-Zeilen mit `regionId`, `valueCm` und Messtimestamp. Er verwendet jetzt den gemeinsamen Smart-Tape-Reader und bildet die Ratio aus Schulter und Taille **desselben Messtermins**. Werte aus verschiedenen Terminen, Quellen oder Messprotokollen werden nicht gemischt. Alte manuelle Paare bleiben kompatibel.
- **kg/Woche vs. kg/30 Tage:** Die Hauptanzeige zeigte vorher die Trainingsphase und einen separaten langfristigen historischen Vor-Trainings-Trend nebeneinander. Jetzt kommen *beide Einheiten* aus **demselben seit Trainingsbeginn beobachteten Fitdays-Trend** (slope ×7 bzw. ×30). Die alten historischen Werte werden nicht als vermeintlich vergleichbare Rate angezeigt.
- **Vorausschau:** Die ehemalige 90-Tage-Gewichtsfenster-Szenariorechnung konnte die Zeit **vor** dem Trainingsbeginn einbeziehen. Jetzt basiert die Vorausschau nur auf der aktiven Trainingsphase. Erst ab >=8 verschiedenen Fitdays-Messtagen über >=45 Tage seit Trainingsbeginn und einem maximal 14 Tage alten Waagenwert werden Szenarien angezeigt. Andernfalls bleibt die Vorausschau aus und der tatsächlich beobachtete Trend wird weiterhin gezeigt.
- **Mehrjahresrechnung:** Selbst bei ausreichenden Daten werden Monatsraten nicht linear auf 12 oder 24 Monate verlängert. Szenarien verwenden einen jüngeren Median als Startpunkt und bremsen den beobachteten Trend für längere Horizonte ab. Sie sind *Planungsszenarien*, keine sicheren Gewichtsprognosen. Fitdays-Rohdaten und bisherige Tresor-Einträge werden nicht geändert.

## Prüfungen

- 6 zusätzliche gezielte Tests (Smart-Tape-Kopplung, Quellen-/Termin-Trennung, Altformat, Wechsel der historischen Gewichte, Mindestzeitraum, langfristige Szenario-Begrenzung) bestanden.
- 33/33 Release-Tests und Import-Graph-Prüfung bestanden.
- Vollständiger Node-Testlauf: **2.311 bestanden, 66 bestehende Altfehler**. Direkter Vergleich mit dem Original-Source-ZIP 0.5.91.55: **exakt dieselben 66 fehlschlagenden Tests, keine neuen**.
- Kein lokaler Vite-Produktionsbuild: die npm-Abhängigkeit Vite ist nicht installiert. GitHub Actions muss den Produktions-Build nach Upload bestätigen.
