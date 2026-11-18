# Compass Life 0.5.91.60 — Heute: Kalorien & Defizit auf einen Blick

## Änderungen gegenüber 0.5.91.59

- Direkt unter der vorhandenen Proteinanzeige im rechten Heute-Inspector eine zweite, äußerst kompakte Kalorien- und Defizitzeile: bereits erfasste kcal, Differenz zum individuell geschätzten Gesamtenergiebedarf, verständliche Einordnung, miniaturisierter farbiger Energiebalken.
- **Gleiche Berechnung wie die existierende Ernährungsansicht:** `dayEnergyStatus()` verwendet die vorhandenen `nutritionKcalEstimate()`-Lebensmittelprofile, die persönlichen Fitdays-Werte und die Garmin/PAL-Schätzung von `personalEnergyEstimate()`. Damit gibt es keine parallele Kalorienformel.
- Praktische Orientierung: Erhaltung (unter 200 kcal Defizit), sanft (200–399), moderat (400–599), ambitioniert (600–799), sehr ambitioniert (800–900), sehr hoch (>900); Überschüsse werden klar rot angezeigt. Negative Werte sind keine Defizite. Alle Stufen beschreiben ausschließlich den dokumentierten Zwischenstand, nicht eine Aufforderung, Essen auszulassen.
- Energieaufnahme als Bereich, sofern das Lebensmittelprofil eine kcal-Spanne hat; der resultierende Defizitbereich wird ebenfalls sichtbar. Nicht bekannte Einträge werden nicht mit null kcal verwechselt; bei noch gar keinen oder ausschließlich kalorienfreien Einträgen erscheint keine fiktive Erfolgsmeldung.
- Wenn ein persönliches Energieziel nicht aktiv oder nicht berechenbar ist, erscheint statt einer erfundenen Defizitzahl ein klarer kurzer Hinweis.
- Liest ausschließlich vorhandene verschlüsselte Daten, ist read-only, erzeugt keine Aufgaben oder Ernährungseinträge, und startet keinerlei Insights-Analysen. Bestehende Protein-Skala, '+ Essen', Food-Journal und übrige Today-UX bleiben unangetastet.

## Qualitätssicherung

- Neun neue gezielte Tests und bestehende Protein- / Energieformel-Tests.
- 33 Release-Prüfungen + Importgraph.
- Vollständiger Regressionstest und Vergleich zur 0.5.91.59 werden im Packaging-Protokoll festgehalten.

## Deployment

- Patch ausschließlich auf die unveränderte 0.5.91.59 oder stattdessen Full Source verwenden.
- Der lokale Vite-Produktionsbuild benötigt installierte Abhängigkeiten und wird von GitHub Actions geprüft; Darstellung auf Android nach Deployment testen.
