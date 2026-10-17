# Compass – Today-first + Inbox-Klärung + Dreams

**Version 0.1.3 · 17. Oktober 2026**

## Produktprinzipien

1. **Capture ist voraussetzungslos.** Ein freier Satz genügt. Weder Termin noch Projekt oder Energieklasse dürfen Pflichtfelder sein.
2. **Optionaler Kontext direkt beim Capture.** In der Inbox kann schon jetzt eine frei formulierte Notiz mitgegeben werden. Diese wird im vorhandenen `note`-Feld des lokalen Tresors und über die bestehende Sync-API gespeichert.
3. **Klärung in einem separaten Schritt.** Die Inbox enthält noch unentschiedene Dinge. Im Weekly Review werden sie sichtbar und künftig geordnet; kein ungeklärter Eintrag wird automatisch zur Tagesaufgabe.
4. **Dreams = Someday / Maybe.** Bücher, Kurse, Weiterbildung, Reisen und unfertige Ideen werden geparkt, ohne harte Fristen, rote Warnungen oder unfreiwillige Einplanung.
5. **Energie und mentale Anforderung sind verschieden.** Niedriger physischer/psychischer Energiebedarf und hoher Bedarf an geistiger Klarheit dürfen kombiniert sein. Eine Routine kann ebenfalls hohen Zeitaufwand haben.
6. **Wichtigkeit und Dringlichkeit getrennt bewerten.** Zielrelevanz bleibt relativ stabil; zeitliche Dringlichkeit kann dynamisch steigen. Die KI gibt nur Vorschläge mit nachvollziehbarer Begründung, keine erzwungenen Zuordnungen.

## UX / Inbox-Review

**Erfassen → Inbox → Klären → Organisieren → Review**

- Inbox-Eingang kann ohne weitere Angaben erfolgen.
- Zusätzliches freies Notizfeld ist optional und funktioniert bereits.
- In der Inbox kann ein Eintrag für die künftige Klärung ausgewählt werden; diese Auswahl verändert die Daten nicht.
- Ein eigener Wochenreview ist als Navigationsziel und geführte Ansicht vorhanden. Seine fünf Bereiche lauten: Inbox klären; nächste Schritte; Waiting For & Agendas; Termine & Fristen; Dreams & Möglichkeiten.
- Klärung schlägt zukünftig Zieltypen vor: Next Action / Projekt / Agenda-Person / Waiting For / Dreams / Referenz / bewusst verwerfen. Das Archivieren ist derzeit schon möglich, ist aber noch keine GTD-Kategorisierung.
- Jedes Aufgabenobjekt soll über strukturierte Felder für `energy_level`, `cognitive_demand`, `importance`, `context`, `target_date`, `defer_until`, `due_at`, `review_after` verfügen.
- Auf Basis eines harten Fälligkeitstermins, verbleibender Kapazität und Arbeitsaufwand darf die **Dringlichkeit dynamisch** neu vorgeschlagen werden. Fehlende Deadlines dürfen ausdrücklich fehlen.
- Im späteren Review ist eine *Verschiebung in Dreams* eine echte statusändernde Aktion: Das Item soll anschließend weder in der Inbox noch in Today auftauchen, und es darf nicht als abgeschlossen gezählt werden.

## Implementierungsstatus in 0.1.3

**Funktioniert**: Heute als Standardeinstieg; lokaler Tresor; Schnellerfassung; optionale Freitext-Notiz beim Inbox-Capture; vorhandene Inbox-Einträge anzeigen und auswählen; Titel bearbeiten; archivieren; Navigation Heute / Forecast / Inbox / Übersicht / Dreams / Wochenreview; Wetter auf Abruf; verschlüsseltes Backup; bestehende API-Sync-Verarbeitung unverändert.

**Nur UI-Vorschau, bewusst inaktiv**: Entscheidungen im Inbox-Review (Next Action, Projekt, Agenda, Waiting For, Dreams, Referenz), Energie-/Kognitions-/Wichtigkeits-/Dringlichkeitsfilter, harte und weiche Fristen, KI-Vorschläge, automatischer wöchentlicher Review, Dashboard-Zählungen anderer Module, externe Kalenderdaten. Hier werden keine Scheinwerte gespeichert.

## Technische Konsequenz für Phase B

- Vor schreibenden Klärungsaktionen: Versionierte D1-Migration, API-Validierung, Sync-Protokoll-Update und konfliktfähige lokale Speicherung der neuen Felder.
- Strukturierte Typen/Status müssen synchronisiert werden. **Nicht** als JSON-Sonderblöcke in die freie `note`-Spalte schreiben; das würde die spätere Migration erschweren und die bestehenden Nutzernotizen vermischen.
- Optionales Review-Intervall für Dreams (z. B. monatlich / quartalsweise / nur bei manueller Öffnung), nicht als Fälligkeit.
- Prioritätsvorschläge dürfen manuell gesetzte Today-Reihenfolgen nicht still überschreiben.
- Recommender muss erklären, ob eine Empfehlung wegen Datum, Zielrelevanz, verfügbarer Zeit, Energie oder Kontext erfolgt.

## Schutz der bestehenden Installation

Patch verändert nur `client/src/main.js` und `client/src/style.css`. Es werden keine Änderungen an `worker`, D1, Google OAuth, `runtime-config.json` oder IndexedDB-Schlüsseln vorgenommen.

## Tests

- `node --check client/src/main.js`: bestanden.
- `npm test`: 6/6 vorhandene Tests bestanden.
- Browser-UI-Rauchtest (Desktop 1480 px / Mobile 390 px, simuliertes lokales Vault-Modell): bestanden – Unlock, Inbox Capture mit Notiz, Review, Dreams; keine Laufzeitfehler und keine horizontale Überbreite.
- Vollständiger npm-Produktionsbuild muss nach GitHub-Commit durch GitHub Actions bestätigt werden; kein E2E-Cloud-Sync-Test in diesem Schritt.
