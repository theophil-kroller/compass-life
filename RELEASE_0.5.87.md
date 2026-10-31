# Compass Life 0.5.87 · Erlebniszeitstrahl + Arbeitszeitkorrektur

**Basis:** GitHub theophil-kroller/compass-life, Commit `9baae1c4505393ce4f956594dd588e20b967b3e9` (0.5.86).

## My Life in Weeks

- Siebenjahresansicht: Ereignisse als chronologisch positionierte, durchgängige Zeitbalken statt lose Beschriftungen.
- Reisen, Auslandsaufenthalte und prägende Erlebnisse stehen im Vordergrund. Dauer und zugehöriger Titel erscheinen zusammen; überlappende Beschriftungen werden auf mehrere Spuren verteilt.
- Beruf, Studium, Ehrenamt und Beziehungen sind zunächst ausgeblendet und können über „Lebensphasen einblenden“ sichtbar gemacht werden.
- Goldene Sterne zeigen beim Hover ausschließlich den jeweiligen Meilenstein und sein Datum, nicht nebenher laufende Berufs- oder Beziehungseinträge.
- Die bisherige Gesamtmatrix, der Jahresdetail-Zoom, PDF-Export und der JSON-Import bleiben vorhanden.

## Zeitjournal / Arbeitszeit

- Die Kurzstatistik „Tatsächliche Arbeitszeit“ summiert nur berufliche Arbeit (`work`), nicht die Kategorien `leisure`, `health`, `project`, `family`, `personal` oder `other`.
- Die Berechnung berücksichtigt Zeitjournal-Korrekturen, überlappende Arbeitsintervalle und tagesübergreifende Einträge.
- Sport/Erholung bleiben als andere Lebensbereiche im Zeitjournal sichtbar, statt gelöscht zu werden.
- Die Schnellerfassung ist klarer als „Zeit erfassen“ benannt und zeigt berufliche versus andere Zeit getrennt.
- Garmin-Aktivitäten mit Kategorie „Freizeit“ oder „Erholung“ werden im Zeitjournal nicht länger pauschal als Arbeit klassifiziert.

## Tests

- 33/33 Deployment-Tests erfolgreich.
- Gezielte neue Tests für Zeitbalken, Sterne, Kategorien und Integration erfolgreich.
- `npm test`: 1820/1853 bestanden, die übrigen 33 sind historische Altfehler, keine neuen Fehler durch 0.5.87.
- Ein historisches Plugin `client/compass594024-annual-knowledge.js`, das im vorherigen FULL-Archiv fehlte, wurde aus dem identischen GitHub-Commit wiederhergestellt. SHA/Git-Blob: 880d1e4f40503e377d8d29555457fe00726a5462.
- Ein kompletter Vite-Build wurde ohne lokale Abhängigkeiten nicht ausgeführt. GitHub Actions muss die tatsächliche Produktivkompilierung bestätigen.

## Installation

- PATCH nur auf exakt dem Commit `9baae1c` (Compass 0.5.86) anwenden; Quellpfade im ZIP sind relativ zum Repository-Root.
- Alternativ FULL SOURCE entpacken und vollständig in das Repository hochladen.
- **Nicht** beide ZIP-Dateien zusammen über denselben Stand kopieren.
- Persönliche Lebenschronik-JSON gehört nicht ins öffentliche Repository und ist nicht in den Quellarchiven enthalten.
