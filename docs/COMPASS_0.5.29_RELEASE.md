# Compass 0.5.29 — Finance UX Refresh

**Basis:** 0.5.28. **Keine D1-Migration.** Bestehende Datenstruktur, Charts, Gauges, Merchant Inspector und Sync-Protokolle bleiben erhalten.

## Umfang

1. **Monatlicher Ausgabenverlauf (Spending Pace)** unter Finanzen → Überblick: aufsummierte, bestätigte Konsumausgaben je Kalendertag. Vergleich mit dem Vormonat oder dem Durchschnitt der letzten drei Monate (jeweils zum gleichen Kalendertag, kürzere Monate nur bis zu deren Ende). Echte Konsumausgaben ohne offene Fälle, Transfers, Bargeld oder Rückerstattungen. Ein Vergleich erscheint nur für beobachtete Referenzmonate; drei Vorperioden sind für den Dreimonatsschnitt nötig. Datenlücken in importierten Auszügen bleiben als Einschränkung genannt. Der Vergleich bezieht sich **immer auf den aktuellen Kalendermonat** – unabhängig vom allgemeinen Filter für weitere Diagramme.
2. **Kontenübersicht** als eigener Finanz-Tab: echte Importquellen nach Bankkonten, Karten und Unterkonten. Quelle antippen, um die Buchungen dieses Kontos zu filtern. Angezeigt werden Umsätze und Abgänge (keine erfundenen Salden). Manuell dokumentierte Konto-/Depotbestände werden ausdrücklich getrennt mit ihren jeweiligen Stichtagen gezeigt und können über das bestehende Portfolio bearbeitet werden.
3. **Sankey-Politur**: lebhaftere, differenzierbare Kategorienfarben, mehr Freiraum zwischen den vier Ebenen und etwas kräftigere, weiterhin transparente Geldflussbänder. Alle bestehenden Charts und das Zusammenführen bestätigter Händleraliases bleiben unverändert funktionsfähig.

## Grenzen / Sicherheit

- Der Vergleich kann nicht nachweisen, dass sämtliche Monatsumsätze aus allen Banken lückenlos importiert wurden. Keine Hochrechnung fehlender Tage.
- Nicht von der App als Verbrauch klassifizierte Geldbewegungen werden nicht in den Ausgabenverlauf eingebaut. Rückerstattungen werden nicht gegen Konsum saldiert.
- Die Kontenübersicht schätzt aus Konto-Umsätzen **keinen Kontostand**.
- Finanzziele / Flex-Budgeting im Monarch-Stil sind ein **separater Folge-Build**, nicht Bestandteil von 0.5.29.
- Es werden keine neuen externen Services oder Netzwerkanfragen aktiviert.

## Tests

- `npm test`: 339/339 erfolgreich, inkl. 7 neue Tests für Pace/Accounts/Sankey.
- `npm run check`: erfolgreich.
- `npm run build`: hier **nicht abgeschlossen** (`vite: not found` in dieser Containerumgebung); in GitHub Actions/CI nach Installation der NPM-Abhängigkeiten ausführen.
- Chromium-Screenshotlauf konnte lokal nicht beendet werden; Live-UX-Abnahme noch offen.
