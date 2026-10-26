# Compass 0.5.77.59.40 – Context Intelligence Phase 2

Basis: erfolgreich deployter GitHub-Workflow #275 (0.5.77.59.39), Commit `6fe413ace621bb468ff0232f2103fecc80b6626e`.

## Änderungen
- In der kompakten Kontextleiste unter „Heute“ öffnet **✦ Was passt jetzt?** eine kleine, auf Wunsch berechnete Auswahlliste mit höchstens drei erklärten Next Actions.
- Der Recommender verwendet nur wirklich verfügbare Next Actions (kein Completed/Waiting For/On Hold/Defer/Template), explizite Orts-Tags, harte Fristen, Flagged, Planned, aktive Ziele, geschätzte Dauer und manuell angegebene Energie.
- Zeitbudget 15/30/60/120 Minuten und Energie Offen/Wenig/Mittel/Viel sind direkt anpassbar und verwenden die bestehenden Compass-Heute-Präferenzen.
- Kontext unbekannt: nur ortsunabhängige Vorschläge; abweichender Ort wird nicht als ausführbar dargestellt.
- **Ansehen** öffnet die Aufgabe im Heute-Inspector. **×** blendet einzelne Vorschläge für sieben Tage aus; **Ausgeblendete zurücksetzen** macht sie wieder sichtbar. Diese persönlichen Entscheidungen bleiben im lokalen verschlüsselten Vault.
- Kein Geo-Zugriff, keine zusätzliche Kalenderabfrage und keine Empfehlungen-Berechnung beim normalen Rendern, solange das Panel geschlossen ist.
- Bestehende Kontextleiste, Family Radar, Coach und Fokus-Layout bleiben unverändert.

## Installation
Nur PATCH entpacken, Dateien in gleicher Verzeichnisstruktur nach GitHub `main` hochladen und erfolgreichen GitHub Pages Deploy bestätigen. Full Source ist eine separate Sicherung.

## Grenzen
Zeitbudget wird vom Nutzer eingestellt. Es ist **keine** bestätigte freie Kalenderzeit. Vorschläge erzeugen keine neuen Fristen und planen oder erledigen nichts automatisch. Kein cloudübergreifendes Feedback; sieben-Tage-Ausblendungen sind gerätelokal.
