# Compass 0.5.77.48 – Kalendergestützte Kapazitätsplanung

Basis: Compass 0.5.77.47 (GitHub Actions #208 erfolgreich).

## Neu

- Ergänzung unter **Insights → Fristen & Kapazität**: Vorschläge für realistische Kalender-Zeitblöcke.
- Nutzt die bereits vorhandene Google-Calendar-Kapazitätsfunktion. Termine gelten nur als verlässlich geprüft, wenn die gespeicherte Kalenderabdeckung vollständig und höchstens zwei Stunden alt ist.
- Belegte Termine mit Puffer und ganztägige Termine werden ausgespart.
- Vorschläge bleiben **unverbindlich**: keine automatischen Kalendertermine, keine neuen GTD-Aufgaben.
- Berücksichtigt das in 0.5.77.47 definierte wöchentliche Fokusbudget und die Sicherheitsreserve zusätzlich zur reinen Kalenderverfügbarkeit.
- Zerlegt Aufgaben mit Stückzahl (z. B. 60 Prüfungen, 8 Minuten je Prüfung) in Zeitpakete. Wenn ein GTD-Fortschrittszähler vorhanden ist, nutzt Compass die *noch offenen* Einheiten.
- Aufgaben ohne verlässliche Aufwandsschätzung bleiben ausdrücklich als unbekannt markiert.
- Ein Knopf zum expliziten erneuten Kalenderabgleich erscheint, sobald die Kalenderbasis unvollständig, veraltet oder nicht verbunden ist.
- Der frühere 0.5.77.47-Fristenüberblick verwendet für die Darstellung dieselben Paket-Aufwandsschätzungen, ohne gespeicherte GTD- oder Budgetwerte zu verändern.

## Datenschutz und Abgleich

- Aufgaben- und Paketeingaben werden im lokalen Vault gespeichert; hier kein neuer eigener Cloud-Sync für `uiPreferences.capacityGuardian`.
- Google-Kalender wird für die Übersicht nur gelesen, niemals automatisch beschrieben.
- Keine Schlussfolgerungen über heutige Leistungsfähigkeit aus alten Garmin-/Fitdays-Importen.

## Dateien

- `client/vite.config.js` (ersetzen)
- `client/compass748-bridge.js` (neu)
- `client/src/capacity-calendar-v57748.js` (neu)
- `client/src/capacity-calendar-v57748.css` (neu)
- `tests/compass-057747-capacity.test.mjs` (ersetzen; bisherige starre Vite-Nachbarschaftsprüfung erweitert)
- `tests/compass-057748-calendar-packets.test.mjs` (neu)

## Prüfumfang

- 28 gezielte Unit- und Integrationstests inklusive der früheren 0.5.77.47-Regressionen bestanden in der Testumgebung.
- Vite-Erweiterungen in syntaktisch gültiger Form gemeinsam angewendet und geprüft.
- Keine vollständige Integration des gesamten, verbundenen GitHub-Repositories in einen lokalen Produktionsbuild: Verifikation des GitHub-Actions-Laufs steht nach dem Upload aus.
