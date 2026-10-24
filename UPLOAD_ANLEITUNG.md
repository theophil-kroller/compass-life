# Compass 0.5.77.38 – GitHub Actions Hotfix

**Basis:** Commit `e62be0e` (fehlgeschlagener Workflow-Lauf #196).

## Upload

Lade **nur diese eine Datei** in dasselbe GitHub-Repository hoch und **ersetze** dort die gleichnamige Datei:

`tests/gtd-057726-nutrition-trends-missing.test.mjs`

Keine anderen Dateien aus älteren Paketen erneut hochladen. Der App-Quellcode einschließlich des Muskelkarten-Redesigns 0.5.77.38 bleibt unverändert.

## Diagnose

Workflow #196 scheiterte bei `npm run check`: Ein Ernährungstest aus der alten Oberfläche erwartete „1 Lebensmittel ohne kcal-Schätzung“, „Supplement(e) ohne Energiedeklaration“ und den früheren großen Aufklappbalken. Die aktuelle Oberfläche verwendet eine kleine Pille und zeigt korrekt beide datensatzbezogenen Lücken als „2 ohne kcal“ mit den Produktnamen. Der neue Test prüft gerade diese wichtigen Eigenschaften.

## Kontrolle

Nach dem Upload: GitHub → Actions → `Deploy Compass Web` → neuester Lauf. `npm run check`, `npm run build` und `deploy-pages` sollten jeweils grün werden. Sollte ein weiterer Fehler bei `npm run build` auftreten, muss dessen exakter Log getrennt geprüft werden; für den neuen Lauf liegt noch kein Ergebnis vor.

Die gespeicherten Compass-Vault-Daten werden durch diesen Testdatei-Fix nicht berührt.
