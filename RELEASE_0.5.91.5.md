# Compass 0.5.91.5 — Finanzprüfung und Monatsaufschlüsselung

**Ausgangsbasis:** Compass 0.5.91.4, unveränderter Vault.

## Korrektur: Auswahl bestätigen

Das Review-UI arbeitet seit 0.5.91.4 mit einer konservativen, virtuellen Wirtschafts-Klassifikation. Bisher griff der Speicher-Handler auf den Originalwert `needsReview` zu und brach bei virtuellen Prüffällen still ab. Der neue Handler ermittelt die Auswahl anhand genau der Projektion, die auch gerendert wird, und validiert jede tatsächlich betroffene Buchung vor dem verschlüsselten Speichern. Ein Speichervorgang verändert nur ausgewählte IDs und bereits bestätigte Buchungen bleiben unverändert. Bei fehlerhafter Vorzeichen-/Kategorie-Kombination erscheint ein Hinweis direkt im betroffenen Formular.

Bei positiven Buchungen sind Einnahme-, Rückerstattungs- und Transferkategorien wählbar, bei negativen Ausgaben-, Bargeld- und Transferkategorien. Die Art wird bei der Kategoriewahl entsprechend aktualisiert. Sammelbestätigungen bleiben ausdrücklich opt-in. Händlerregeln für künftige Buchungen werden nur bei gewähltem Häkchen erstellt. **Wichtig:** Zahlungspartner allein belegt keinen gemeinsamen Buchungszweck; bei heterogenen Gegenparteien vor dem Sammelbestätigen alle Buchungsdetails prüfen.

## Transparenz der Monatskennzahlen

Die Zeilen für Einnahmen, Rückerstattungen und Konsumausgaben lassen sich direkt öffnen. Jede Zahlung wird mit Datum, Zahlungspartner, Kategorie, Konto und Betrag angezeigt; lange Listen sind scrollbar. Der externe Netto-Cashflow erklärt die Gleichung in einem separaten Klappbereich. Die Zeilen sind von derselben Economic-Klassifikation, Kontoauswahl und Monatsbegrenzung abgeleitet wie die KPI-Berechnung; neutrale Transfers und ungeklärte Zahlungen erscheinen nicht als Einnahmen oder Konsum. IBAN-Muster in angezeigten Buchungstexten werden maskiert.

**Keine Migration**; Originaltransaktionen werden nur nach manueller Kategorisierung überschrieben. Lokale Vault- und Sync-Mechanismen bleiben unverändert.

## Tests

- Neue gezielte Tests in `tests/compass-05915-finance-review-drilldown.test.mjs` decken virtuelle Review-Fälle, Vorzeichen-Fehler, Gruppenbegrenzung, unabhängige bestätigte Buchungen, Monatsaufschlüsselung und HTML-Escaping ab.
- Das gesamte Deployment und die Regressionstests werden separat kontrolliert.
