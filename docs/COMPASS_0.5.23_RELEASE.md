# Compass 0.5.23 – Advanced GTD & Review + Aktivitätsaggregation

**Basis:** 0.5.22.1. Diese Version verändert ausschließlich clientseitigen Code und Tests; keine neue Cloudflare-D1-Migration.

## Neu

- **Projektgesundheit:** Aktive Projekte mit fälligen (individuell eingestellten) Review-Intervallen, vorhandenen/fehlenden ausführbaren Next Actions und echten, überschrittenen Projektfristen. Die Einstufung erzeugt keine neuen Fälligkeitsdaten.
- **GTD-Übersicht:** kompakte Angaben zu fälligen Projektreviews, blockierten Projekten und Waiting For (Hinweise, keine Terminbehauptung).
- **Waiting For:** sieben Tage ohne Bearbeitung erscheinen als unverbindlicher Review-Hinweis; keine automatische Statusänderung.
- **Einmalige Wiederholung:** abgeschlossene, nicht archivierte Aufgabe explizit als neue Next Action anlegen. Geplante Termine, Due Date und Defer werden **nicht** übernommen. Dies ist **keine automatische Synchronisations-Wiederholung**.
- **Garmin-Aktivitäten nach Sportart:** Aggregierte Trainingsaktivitäten **vor** der Einzelliste. Tanzen, Radfahren, Disc Golf, Sauna, etc. mit Stunden, Anzahl der Einheiten, Ø Dauer und dokumentierter Distanz. Auch unter Aktivitäten sichtbar; der Insights-Zeitraumfilter gilt weiterhin. Einzelne Sessions sind hinter einem aufklappbaren Detailabschnitt erreichbar, nicht standardmäßig offen.
- **Fehlerkorrektur:** Fehlende Distanz (`null`) nicht mehr als `0 km gemessen` darstellen.

## Datenqualität / Grenzen

- Bereits importierte CSV-/FIT-Trainingseinheiten werden anhand vorhandener Felder gruppiert. Keine ungeprüfte Ableitung von Trainingsstrecke, keine Rekonstruktion aus Timeline-Daten oder Geopositionen.
- Garmin Activities.csv exportiert Uhrzeiten ohne explizite Zeitzone und eventuell andere Distanz-Anzeigeeinheiten; dies bleibt gekennzeichnet.
- Doppelte Einträge derselben Activities.csv werden beim Import anhand ihrer stabilen IDs dedupliziert. Zwei separate Datenquellen mit unterschiedlichen IDs können dieselbe Aktivität beschreiben; eine vollständige geräteübergreifende Erkennung ist noch nicht gewährleistet.
- Trainingseinheiten mit nicht erkennbarer Aktivitätsart werden als „Sonstige Aktivitäten“ zusammengefasst. Fehlen Dauer oder Datum, werden sie nicht als dokumentierte Trainingseinheit gezählt.
- Eine Wiederholung wird erst nach expliziter Nutzerbestätigung erstellt, damit das bestehende D1-/Worker-Sync-Modell unverändert bleibt. Automatisch wiederkehrende Regeln sind ein späterer Ausbau.

## Prüfung

- `npm test` / `node --test tests/*.test.mjs`: **295 bestanden, 0 fehlgeschlagen**.
- `node --check client/src/main.js` und relevante JS-Module sowie Worker-Syntax: erfolgreich.
- Garmin-CSV-Parser und Sportaggregation lokal mit dem vom Nutzer zur Verfügung gestellten Export getestet: 40 Aktivitäten erkannt. **Keine privaten Activities.csv oder Kontodaten in den Release-Archiven.**
- `npm run build` lokal **nicht ausführbar**, weil Vite-Abhängigkeit fehlt (`vite: not found`). GitHub-Actions-Deployment und Live-PWA sind noch auf dem Gerät zu prüfen.

## Installation

1. Verschlüsseltes Vault-Backup erstellen. Browserdaten/PWA-Tresor nicht löschen.
2. Dateien des `Compass_0.5.23_GITHUB_PATCH.zip` direkt auf **0.5.22.1** mit gleicher Ordnerstruktur einspielen.
3. GitHub Actions Web Deployment auf grünen `npm run build` prüfen.
4. In Compass nach dem Update unter Insights → Aktivitäten die Sportaggregation im gewählten Zeitraum und die ausklappbaren einzelnen Garmin-Sessions prüfen; unter Planen → Projekte / Wochenreview die GTD-Hinweise überprüfen.

