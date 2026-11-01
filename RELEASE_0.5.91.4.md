# Compass 0.5.91.4 · Finance: external flows and anchored balances

Basis: 0.5.91.3, GitHub `b5347d1ab2a6611401f8cb44c9a88700a0df55be`.

## Fachliche Abgrenzung

- Die Monatsübersicht visualisiert Ausgabenanteil und rechnerischen Sparspielraum relativ zu externen Zuflüssen.
- Nur bestätigte externe Einnahmen, Rückerstattungen und Ausgaben bilden den Netto-Cashflow/Sparspielraum. Das ist **kein** tatsächlich gesparter Betrag und keine Liquiditätsprognose.
- `Transfer / …`, `flow=transfer`, `linkedTransferId`, explizite Eigenüberträge/Kreditkartenabrechnungen sowie Bargeldbewegungen sind neutral. Auch `Sonstiges / Überweisung ohne klaren Zweck`, `Sonstiges / Zahlung ohne klaren Zweck` und `Einnahmen / Eingang ohne klare Herkunft` gelten bei nicht bestätigten Auto-Kategorien **nicht** als gesicherte externe Flüsse. Gleiche Gegenbuchungen aus eigenen Konten werden nur mit Evidenz als Transfer bewertet, ansonsten als ungeklärt. Keine Transaktion wird automatisch umgeschrieben.
- „Sonstiges“ darf echte ausdrücklich zugeordnete externe Ausgaben enthalten; anonyme Pauschal-Abflüsse ohne belegte wirtschaftliche Zuordnung gehören nicht mehr dorthin.
- Buchungen bleiben auf den einzelnen Konto-Ledgern unverändert; ein Übertrag verändert je Konto den Saldo und ist wirtschaftlich nicht zugleich Konsum.

## Kontostand nach Stichtag

- Für jedes exakt benannte Konto wird der jüngste bestätigte Banksnapshot am oder vor dem Stichtag (andernfalls der früheste spätere Snapshot) gesucht. Eine Überleitung auf den gewählten Monatsletzten addiert bzw. subtrahiert die signierten, zum Konto gehörenden importierten Buchungen. Bei einem direkten Snapshot gibt es keine Fortschreibung.
- Ohne Snapshot gibt es keinen errechneten Saldo. Unvollständige Exporthistorie kann abgeleitete Salden verfälschen; daher sichtbar als **fortgeschrieben / nicht bankbestätigt** gekennzeichnet. Snapshots unter nicht zuordenbaren Freitextnamen werden nicht rückgerechnet.
- Beim Durchblättern wird die Ansicht anhand des ausgewählten Monats neu berechnet. Zukunft nach aktuellem Monat nicht zulässig.

## QA

Siehe `tests/compass-05914-economic-cashflow-anchor.test.mjs` sowie `npm run test`, `npm run check:deploy`, `npm run build`. Keine Behauptung über echte Kontosalden ohne vollständigen Export/Bankabgleich.

## Durchgeführte Prüfung

- `npm run check:deploy`: **33/33**, Worker-Check und Importgraph bestanden.
- `npm test`: **1904/1939**; identische **35 historische Fehler** wie Ausgangsversion. Keine neuen Fehler.
- `npm run build`: `vite: not found` wegen nicht installierter Node-Abhängigkeiten; GitHub CI muss den echten Produktionsbundle-Build verifizieren.
