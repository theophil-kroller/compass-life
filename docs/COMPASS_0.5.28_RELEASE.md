# Compass 0.5.28 – Finanz-Sankey: Händler korrigieren und zusammenführen

## Änderung
- Ein Klick auf einen Händlerknoten im vierstufigen Sankey öffnet einen lokalen Inspector **auf derselben Seite**, nicht mehr automatisch die Ledger-Perspektive.
- Im Inspector lassen sich gezielt ausgewählte Umsätze umbenennen (z. B. kryptischer Banktext → „Jetstar“). Die unveränderten ursprünglichen Felder `merchant`, `description`, `id`, `amountCents` und `accountId` bleiben erhalten.
- Wahlweise wird zusätzlich die bestätigte Ausgabenkategorie pro ausgewähltem Umsatz korrigiert (z. B. `Wohnen / Miete & Betriebskosten`).
- Zwei Zuordnungen mit gleichem Anzeigenamen werden im Sankey und in der Händlerstatistik **aggregiert**. Auch mehrere Unterkategorien können in einen einzigen gemeinsamen Endknoten führen, während jeder wirtschaftliche Betrag nur einmal gezählt wird.
- Die bisherige Buchungsliste erlaubt ebenfalls einen individuellen Anzeigenamen. Bei einer Kategoriekorrektur kann weiterhin explizit eine sichere bestehende Regel erzeugt werden.
- Mit „Originalnamen wieder anzeigen“ können angelegte Aliasse gezielt rückgängig gemacht werden.
- **Keine automatische Zuordnung von Klarna, PayPal oder Überweisungen zu Händlern.** Der ursprüngliche Text und die bestätigte Zahlungskategorie bestimmen nicht automatisch den Einkauf dahinter.

## Datenmodell
Die einzige neue Eigenschaft ist optional `merchantDisplayName` je lokal gespeicherter Finanzbuchung. Keine D1-Migration, kein Worker-Endpoint, kein neuer Cloud-Sync für private Finanzbuchungen.

## Installationsbasis
Patch setzt **0.5.27** voraus. Migration 0013 für 0.5.27 muss, soweit bei dessen Installation erforderlich, bereits ausgeführt worden sein. Vor Änderung Vault-Backup erstellen.

## Prüfungen
`npm test` + `npm run check`: 332 Tests bestanden. Tests prüfen Zusammenführen auf 1 Endknoten, Erhalt und korrekte Summierung der Flüsse, Rückgängigmachen, Kategorien, Suche im Ledger und HTML-Escaping. Vollständiger Vite-Produktionsbuild in dieser Umgebung nicht möglich, wenn `vite` nicht installiert ist. Live-Test mit echtem Vault nicht durchgeführt.
