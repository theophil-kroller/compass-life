# Compass 0.5.91.7 · Persönliches Gericht: Ofenkartoffeln mit Olivenöl, schwarzem Sesam & Chili

**Ausgangsbasis:** GitHub `main`, Compass 0.5.91.6, Commit `2e51dea1b0610f0ade622f9672bd72b9a076c687` (geprüft 1. November 2026). Keine Vault-Migration und kein rückwirkender Eintrag in das Ernährungstagebuch.

## Neues Standardgericht unter Ernährung → Mahlzeiten

- `oven-potatoes-sesame-personal`: Meine Ofenkartoffeln mit Olivenöl, schwarzem Sesam & Chili (🥔).
- Eine Portion = **eine breite Suppenschüssel**, ohne behauptete Waagenmessung.
- Editierbare Anfangsmengen: 300 g **Bio-Kartoffeln roh, mit Schale**, 20 g **Olivenöl insgesamt** für beide Ölübergüsse (nicht zweimal 20 g), 10 g schwarzer Sesam, 0,5 g Chiliflocken, 1 g Salz.
- Die generische Rezeptschätzung beträgt **ca. 467 kcal**, **ca. 8 g Eiweiß**, **55 g Kohlenhydrate**, **25 g Fett** sowie **ca. 8 g Ballaststoffe** bei diesen Anfangsmengen. Öl ist der größte Unsicherheitsfaktor: 5 g zusätzliches Öl ≈ 44 kcal. Die Werte sind **keine gemessenen Nährwerte**; Rohgewicht der Kartoffeln ist nicht das Endgewicht nach dem Backen.
- Zutatenmengen sind im bestehenden Ernährungs-Inspektor individuell editierbar; nach einer Anpassung werden kcal, Makro- und vorhandene Mikronährstoffe neu berechnet. Auch `2 Portionen` oder `2 Schüsseln` wird für dieses Rezept korrekt skaliert.
- Die vorhandene Daily-Dozen-Zutatenlogik zählt dokumentierte Sesam- und Chili-Mengen anteilig, aber die ungewogene Kartoffelschüssel nicht automatisch als belegte Gemüse-Portion. Keine fiktiven Vitamin-C-Werte für die gegarten Kartoffeln.

## Integration

- Bestehender `PERSONAL_RECIPE_PRESETS`-Katalog; keine neue Datenbank.
- Mit `nutritionFoods`, `nutritionKcalEstimate`, `nutritionDay`, Nutrition Insights, Daily Dozen und dem bestehenden Rezepteditor integriert.
- Bestehende Rezept-IDs und gespeicherte Ernährungseinträge bleiben erhalten; ältere Rezepte behalten ihre bisherige Mengenlogik.

## Tests & Qualitätsstatus

- 7/7 neue Rezepttests bestanden.
- `npm run check:deploy`: **33/33** Deployment-Tests, Importgraph und Worker-Check bestanden.
- `npm test`: **1.927/1.962 bestanden**, weiterhin **35 historische Fehler** (Baseline 0.5.91.6: 1.920/1.955; kein neuer Fehler).
- Patch auf das unveränderte Full-Source-Archiv 0.5.91.6 auflegbar und bytegenau mit dem neuen Full-Source-Archiv verglichen.
- `npm run build` kann in diesem Container mangels installierter `vite`-Abhängigkeit nicht erfolgreich ausgeführt werden (`vite: not found`); der produktive Vite-Build muss über GitHub Actions beim Upload validiert werden. Daher keine Behauptung eines erfolgreichen lokalen Produktionsbundles.
