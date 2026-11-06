# Compass Life 0.5.91.25 – Muscle Map Farbprioritäten & Protein-Skala

Basis: GitHub `main` 0.5.91.24 (`4822c053efcb77aed1cd6a59ce894deb886ae88f`).

Die Kartenfarbe richtet sich jetzt zuverlässig nach der **aktuellsten Rolle**:
1. Heute primär → Rot
2. Heute unterstützend → Gelb
3. Heute stabilisierend → Türkis (kein Wachstumssatz)
4. Letzte 7 Tage primär oder sekundär → Orange
5. Letzte 7 Tage ausschließlich stabilisierend → Türkis
6. Ohne zugeordnete Beteiligung im angezeigten Zeitfenster → Neutral/Dunkel

Beispiel: Goblet Squat heute (Bauch unterstützend), Plank gestern (Bauch primär): Der Bauch wird **gelb** statt orange angezeigt. Ein Muskel kann innerhalb des gewählten Zeitraums mehrere Rollen einnehmen; die Tooltip-Textangabe nennt die aktuelle farbgebende Rolle und die aggregierten Satzbeteiligungen.

Nur die Darstellung ist geändert. Es wurden weder Trainingssätze, RIR, Muskelvolumen, Trainings- oder Regenerationslogik noch bestehende Farbtöne verändert.

## Tests
- Neue deterministische Regressionstests für Überlagerung und Prioritäten
- Vorhandene Muskelkarten- und Trainingsrollentests
- `npm run check:deploy`

Die eigentliche GitHub-Pages-Publikation wird durch GitHub Actions geprüft.

## Protein in Heute: Bereiche statt binärem Ziel

Die kompakte Proteinanzeige in Heute zeigt nun die erfassten Gramm als Marker auf einer fünfteiligen Skala: darunter, **Grundlage**, **optimal**, **optional**, darüber. Bei etwa 86 kg lauten die praktischen Orientierungsbereiche ungefähr 100–120 g, 120–140 g und 140–150 g. Die Grenzen passen sich dem zuletzt bis zum angezeigten Tag in Fitdays gemessenen Körpergewicht an (1,2 / 1,4 / 1,6 / 1,75 g/kg; grafisch gerundet). Ohne gemessenes Gewicht werden die Beispielbereiche ausdrücklich als vorläufig gekennzeichnet.

Die früheren manuell konfigurierbaren Proteinziele bleiben erhalten, bestimmen aber nicht mehr eine binäre rote/grüne Tagesampel. Unbekannte Nährwertangaben und nicht erfasste Mahlzeiten werden nicht als null Gramm behandelt. Kein Zwang zur optionalen Menge und keine Änderung an Ernährungslogs.

Wissenschaftliche Einordnung: Die ISSN nennt 1,4–2,0 g/kg/Tag als ausreichenden Bereich für viele Trainierende; eine große Meta-Regression deutet auf abflachenden Zusatznutzen oberhalb ca. 1,6 g/kg/Tag hin, mit erheblicher individueller Unsicherheit. Diese UI-Bereiche sind kein medizinisches Minimum. Quellen: https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/ und https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/ .
