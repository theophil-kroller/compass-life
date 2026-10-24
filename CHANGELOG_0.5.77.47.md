# Compass 0.5.77.47 – Deadline & Capacity Intelligence

**Basis:** Compass 0.5.77.46. Keine Änderung an bestehenden Garmin-, Fitdays-, Ernährungs-, Finanz- oder Task-Daten.

## Neu

1. **Insights → Fristen & Kapazität** in der linken Navigation und als kompakter Insights-Reiter.
2. Im **Wochenkompass** öffnet ein kurzer Hinweis den Fristen- und Kapazitätsbereich.
3. Alle noch offenen GTD-Aufgaben mit Fälligkeit der nächsten **14 Tage** werden gesichtet; überfällige Aufgaben erscheinen separat.
4. Freiwillige **Aufwandsschätzung in Stunden pro Aufgabe** und **wöchentliches Fokusstundenbudget** mit Sicherheitsreserve (Standard 20 %), gespeichert im lokalen verschlüsselten Vault.
5. Ein vorsichtiger Szenariovergleich zeigt, ob **bekannter** Arbeitsaufwand bis zu einzelnen Deadlines rechnerisch in das eingetragene Budget passt. Aufgaben ohne Aufwandsschätzung bleiben ausdrücklich sichtbar und verhindern eine unbegründete Entwarnung.
6. Auf Werktage verteilter Fokuszeit-Vorschlag; **keine** fingierte Kalenderverfügbarkeit oder tatsächliche Buchung.
7. Projekt-Meilensteine separat, markierte Aufgaben ohne Deadline ebenfalls separat. Keine künstlichen Fristen.
8. Keine heutigen Schlaf-/Energie-Einschätzungen aus möglicherweise veralteten Importen.

## Wichtiges zu Datenstand und Synchronisation

Die Aufwandsschätzungen und das Fokusbudget werden zunächst in `uiPreferences.capacityGuardian` des **lokalen verschlüsselten Tresors** abgelegt. Der Build macht **keine neue Zusage**, dass diese Einstellungen bereits vom E2EE-Journalabgleich zwischen allen Geräten erfasst werden. Die Fristen stammen aus dem vorhandenen GTD-Aufgabenstand. Eine spätere Erweiterung kann den Einstellungsabgleich ergänzen, ohne bestehende Aufgaben umzuschreiben.

## CI-Regressionsfix

Die Tests für 0.5.77.43 bis 0.5.77.46 prüfen nun die Vite-Plugin-Reihenfolge ohne die starre Annahme, dass die jeweilige frühere Version unmittelbar vor `VitePWA` stehen muss.

## Prüfstatus

- 50/50 gezielte Modul- und Integrationstests (0.5.77.43 bis 0.5.77.47)
- Node-Syntaxprüfung, Vite-Integrations-Mock
- Visuelle Desktop- und Handyvorschau (Chromium), kein horizontaler Überlauf
- Vollständiger npm/Vite-Produktionsbuild ist erst nach dem Upload auf GitHub zu bestätigen.
