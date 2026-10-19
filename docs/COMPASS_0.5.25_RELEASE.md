# Compass 0.5.25 – Activity Insights Redesign

**Ausgangsbasis:** 0.5.24. Reine Client-Änderung: keine D1-, Worker-, Vault-Kryptografie- oder API-Migration.

## Änderungen
- Sportarten-Kacheln statt primärer Langliste: Gesamtstunden, Einheiten, durchschnittliche Dauer, aktive Tage und für sinnvolle Sportarten Distanz.
- Umschalter für Kalenderwoche, Kalendermonat, Quartal, Kalenderjahr, letzte 12 Kalendermonate und gesamte vorhandene Historie.
- Vorher-/Nächster-Zeitraum-Pfeile, die nicht in die Zukunft springen, und Umschalter nach Zeit, Anzahl oder sinnvoll interpretierbarer Distanz.
- Gestapelter Periodenverlauf nach Sportart, mit Kachel-Drilldown auf eine einzelne Sportart; vollständige Sessionliste bleibt aufklappbar.
- Bei Garmin-Activities-CSV wird die Entfernung für Open Water Swimming (meterbasierter Export) in km umgerechnet. Bei **bereits gespeicherten** Garmin-CSV-Swims mit meterartigen Werten (> 30) erfolgt die Korrektur bei Anzeige, ohne den gespeicherten Datensatz heimlich umzuschreiben. FIT-Trainingskilometer bleiben unverändert.
- Die gesamte Aktivitätsnavigation verwendet dieselbe Zeitspanne, wenn ein Sports-Modus gewählt ist. Eigenständiger Bereich Aktivitäten zeigt die Kacheln vor der Verwaltungs-/Sessionliste.
- Distanzen aus Tanzen/Sauna etc. werden nicht als sportlich aussagekräftige Strecken aggregiert. Kein Hochrechnen fehlender Distanzen, unklare Einheit einzelner Exporte offenlegen.

## Prüfung
- `npm test`: 305/305 bestanden, inklusive vier neuer 0.5.25-Tests.
- `npm run check -w worker` und `node --check` für geänderte Frontendmodule erfolgreich.
- Reale Garmin Activities(1).csv lokal testweise geparst: 1740 Datensätze, meterbasierte Open-Water-Swim-Distanzen korrekt umgerechnet. Keine privaten Aktivitäten in den Archiven.
- Bitte vollständigen Vite-Build und echte PWA-Interaktionen nach Deployment prüfen; lokale npm-Abhängigkeiten sind im Release-Arbeitsverzeichnis nicht installiert.

## Bekannte Grenzen
- Garmin-CSV enthält für die meisten Aktivitäten keine explizite Distanz-Einheit; außer offensichtlich meterbasiertem Open-Water-Schwimmen werden die exportierten Zahlen als km behandelt. Garmin-Export-Profile können abweichen.
- Ein Tag kann mehrere Aufzeichnungen/Sessions enthalten. „Aktive Tage“ zählen einmal pro Datum.
- Schätzungen und Lücken werden nicht automatisch ergänzt, saisonale Vergleiche hängen von der Datenabdeckung ab.
