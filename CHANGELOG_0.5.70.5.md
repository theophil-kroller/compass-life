# Compass 0.5.70.5 – Gefühlsnetzwerk & ungesüßter Tee

## 1. Zweiter Zugang zum emotionalen Check-in
- „In eigenen Worten“ ergänzt das bestehende sechssegmentige Feeling Wheel.
- Lokale Suche nach verwandten Emotionen, Zuständen, Körperwahrnehmungen, Bedürfnissen und Impulsen.
- Anklickbare Gefühlswolke: Verbundene Begriffsknoten am Desktop, große auswählbare Begriffskacheln auf kleinen Bildschirmen.
- Der Benutzer entscheidet selbst, welche Assoziationen passen – automatische Vorschläge sind keine Diagnose.
- Alltagseingaben wie „Ich bin gerade gestresst“, „Ich bin genervt“, „aufgeregt“, „leer“, „eifersüchtig“ sind als Suchanlässe enthalten.
- Scham, Schuld, Eifersucht und Neid werden nicht fälschlich den sechs Wheel-Segmenten zugeordnet.
- Die originalen Worte können **auch ohne eindeutige Emotionszuordnung** gespeichert werden.
- Verknüpfte Begriffe und Originaltext bleiben in Chronik, Inspector, encrypted Sealed Capture und bestehendem Journal-Sync erhalten.
- Die bestehende fünfstufige Gefühlsqualität (z. B. Erfreut…Euphorisch) und der 1–10-Intensitätsslider bleiben bestehen.
- Suchnetz-Begriffe erhalten stabile IDs, sodass gespeicherte Wortbezüge auch bei Gerätewechseln nachvollziehbar sind.
- Eingeben aktualisiert nur das Netzwerk, damit das Smartphone die virtuelle Tastatur nicht bei jedem Buchstaben verliert.

## 2. Ernährung
- Neue Schnellkachel **Tee ungesüßt** zusätzlich zu Tee mit Honig.

## Schutz und Quellen
- Der Wortschatz wurde eigenständig kuratiert und ist **keine Kopie** der DEI-Wortliste von Karla McLaren / Dynamic Emotional Integration®.
- Verschiedene Arten von Erleben werden unterschieden; keine KI- oder externe Textübertragung für die Suche.
- Bereits bestehende Check-ins und Synchronisierungsformate bleiben lesbar.

## Technisch
- Neue Datei `client/src/feeling-network-v5705.js`.
- Aktualisiert: `feeling-interface-v5681.js`, `feeling-wheel-v565.js`, `main.js`, `vault.js`, `style.css`, `personal-journal-v5692.js`, Versionen.
- Ergänzte gezielte Regressionstests `tests/gtd-05705-feeling-network-and-tea.test.mjs`.
- Keine neue D1-Migration oder Workeränderung erforderlich.
