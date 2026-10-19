# Compass 0.5.17.6 — Händlerdetails und beobachtete Vermögenswerte

## Bankdaten → Händler (vierte Auswertungsebene)

In Ausgaben sowie auf dem Überblick unter dem Sankey folgt auf die Unterkategorie
`Supermarkt` ein nach Händler aggregierter Drilldown für Hofer, Spar, Billa,
Lidl usw. Derselbe Aufbau funktioniert für andere Hauptkategorien. Verglichen
werden die bereits importierten, nicht als offen markierten Konsumumsätze,
kontenübergreifend oder gefiltert. Ungeprüfte Transfers erscheinen nicht als
Konsum. Es werden keine Einzelprodukte erfunden; dafür wären Rechnungspositionen
oder strukturierte Kassenbons nötig.

## Portfolio Consolidation

Ergänzend zum bewerteten Kraken-Spot-Teil lassen sich tatsächliche EUR-Snapshots
von Bankguthaben, flatex-Depotmarktwerten und Verbindlichkeiten im lokalen Vault
hinterlegen. Der zuletzt datierte Snapshot einer Quelle zählt. Das ist eine
**Teilübersicht mit potenziell unterschiedlichen Stichtagen**, kein Kontostand
aus der Transaktionssumme und kein gesichertes Nettovermögen. flatex ist ohne
echten Export nicht automatisch angebunden.

## Grenzen

Keine börsenhistorische flatex-Bewertung, keine automatisierte Depotanbindung,
keine automatischen Kassenzettel/OCR, keine aus Bank-CSV rekonstruierbaren
Lebensmitteleinzelpositionen. Private Konten-/Empfängerzuordnungen gehören nicht
in öffentlichen Code.
