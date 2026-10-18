# Compass 0.5.17.2 – Organic Sankey & Mehrkonten-Import

## Ausgangsbasis

Compass 0.4.17.5 (Health-UX-Zwischenrelease; basiert auf 0.5.17.1).

## Was neu ist

- **Organischer Sankey:** dreistufige Flüsse `Abgänge → Hauptkategorien → Unterkategorien` als kubische SVG-Farbbänder mit eigener Gewichtung und Abstand je Ebene. Unterkategorien bleiben bei schmalen Bändern in der Detailtabelle zugänglich. Keine erfundene Zuordnung von Einnahmen zu Ausgaben.
- **Bankkonten klar getrennt:** Kontofilter für Raiffeisen, Revolut, N26 und DKB. Bestehende Raiffeisen-Buchungen werden über einen kompatiblen Fallback ihrem Konto zugeordnet. N26/DKB sind bis zur Prüfung ihrer Originalexporte **nur vorbereitete Kontoeinträge**.
- **Revolut CSV:** automatisches Erkennen des konkreten Revolut-Formats (Type, Product, Started Date, Completed Date, Description, Amount, Fee, Currency, State, Balance). Importiert nur abgeschlossene EUR-Buchungen, ignoriert stornierte/ausstehende Zeilen und erfasst Gebühren zusätzlich als separate Ausgabe. Für Fremdwährungen wird keine fiktive Konversion durchgeführt.
- **Eigenübertrag-Kandidaten:** Beträge gleicher Höhe, Gegenrichtung und Bankkonten innerhalb von drei Tagen werden bei erkennbaren Transferhinweisen zur manuellen Bestätigung vorgeschlagen. Erst bei Bestätigung werden beide Buchungen als interne Transfers markiert. Kein automatisches Zusammenführen.
- **Mehrkonten-Analyse:** Filter je Konto, Gesamtansicht; keine Vermischung von Transfers mit externem Konsum. Die Neuvorklassifizierung bewahrt Revolut-eigene Transfer-Typen.

## Datenschutz

Private Kontonummern/IBANs, Bankbuchungen und rohe Revolut-/N26-/DKB-CSV-Dateien gehören **niemals** in das öffentliche GitHub-Repository. Kontometadaten und importierte Buchungen werden ausschließlich in Compass lokal im verschlüsselten Vault gehalten. Das Release beinhaltet nur generische Account-IDs und synthetische Tests.

## Grenzen

- N26 und DKB können bereits im Kontofilter angezeigt werden; ihre CSV-Importer sind **noch nicht aktiviert**. Dafür wird jeweils ein echter Export zur Formatprüfung benötigt.
- Der Kontofilter betrifft Finanzstatistiken und Buchungslisten; Reiseauswertungen berücksichtigen weiterhin alle Konten, damit Reisebuchungen nicht verschwinden.
- Revolut-PENDING/REVERTED wird nicht übernommen; keine Wechselkursumrechnung.
- Überträge mit abweichenden Beträgen, Fremdwährung oder Laufzeiten >3 Tagen erfordern manuelle Prüfung außerhalb der Kandidatenliste.
- Der organische Sankey ist rein lokal gerendertes SVG und verwendet keine Drittanbieter-Karten-/Analyse-API.
- Nur Code- und Modultests sind hier ausführbar; Vite-Produktionsbuild ist wegen fehlender npm-Abhängigkeiten nicht lokal ausgeführt.

## Qualität

211 Node-Tests bestanden, einschließlich fünf neuer Tests für Revolut, Fee-/Reverted-Handling, Transferkandidaten, organische Sankey-Hierarchie, N26-/DKB-Kontentrennung und sicheren Reclassify.

## Installation

1. Vorher verschlüsseltes Vault-Backup erstellen.
2. `Compass_0.5.17.2_GITHUB_PATCH.zip` entpacken und Inhalte mit **gleicher Ordnerstruktur** in `compass-life/main` übernehmen.
3. GitHub Actions / Pages-Build prüfen.
4. In Compass unter **Finanzen → Datenquellen** deine Revolut-CSV importieren. Vor dem Übernehmen prüfen, insbesondere ungeklärte Transfers und Kartenzahlungen.
5. Im Bereich **Prüfen** mögliche Eigenüberträge einzeln bestätigen.
6. N26-/DKB-Dateien nicht als Raiffeisen importieren; Formatunterstützung folgt nach Analyse der Original-CSV-Dateien.
