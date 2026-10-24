# Compass 0.5.77.37.1 · Nutrition-Pille + Übungsgewichte merken

Basis: Compass 0.5.77.37. Dies ist ein gezielter Hotfix, **noch nicht** das angekündigte Muskelkarten-Redesign 0.5.77.38.

## Ernährung · Tagesverlauf
- Entfernt den unter jedem betroffenen Tag breit dargestellten Aufklappbalken "Fehlende Energieangaben anzeigen".
- Ersetzt ihn durch eine dezente, **rechtsbündige Pille direkt unter dem kcal-Tageswert**: `💊 1 ohne kcal` oder `ⓘ N ohne kcal`.
- Desktop: Überfahren mit dem Mauszeiger zeigt die genauen Namen (etwa Bluebonnet ONE for Men); Tastatur: Fokus; Smartphone: Pille antippen.
- Keine Änderung der Ernährungswerte: fehlende kcal-Deklaration bleibt unbekannt und wird **nicht als null** gezählt; Nährstoffdaten bleiben erhalten.

## Krafttraining · Satzeditor
- Sobald beim Bearbeiten eines neuen Satzes eine Übung ausgewählt wird, schlägt Compass **die zuletzt gespeicherten Wiederholungen und das zuletzt gespeicherte Gewicht genau dieser Übung** vor.
- Wenn der neueste Satz ohne kg-Angabe gespeichert wurde, fällt das System für das Gewicht auf den letzten tatsächlich erfassten kg-Wert derselben Übung zurück.
- Vorschläge werden nur in leere Felder eingesetzt; vorhandene Garmin-Werte, aktuelle Eingaben und manuelle Korrekturen bleiben erhalten.
- Beim Übungswechsel werden nur automatisch vorgeschlagene, **unverändert** gebliebene Werte ersetzt. Bereits getippte Werte werden nicht überschrieben.
- Neu hinzugefügte Sätze erhalten dieselbe Funktion; bereits gespeicherte Trainings werden niemals rückwirkend verändert.
- Die letzten Satzwerte werden aus dem bestehenden **lokal verschlüsselten** `strengthJournal.annotations` gelesen; kein neues externes Tracking.

## Installation
- GitHub-Dateien unter genau den ZIP-Pfaden hochladen; die vorhandene `client/vite.config.js` ersetzen.
- Keine zusätzlichen Bibliotheken oder Datenbankmigrationen erforderlich.
- Nach Deployment Anzeige `0.5.77.37.1` prüfen und bei einer Krafttrainingseinheit das Auswahlmenü öffnen.
- Hinweis: Geräteübergreifende Synchronisierung der Kraftannotationsdaten muss weiterhin gesondert abgesichert werden.

## Teststatus
- `node --experimental-default-type=module --test tests/compass-0577371.test.mjs`: 7 von 7 bestanden.
- Syntaxprüfung der neuen JS-Dateien erfolgreich.
- Vollständiger Vite-Produktionsbuild und Smartphone-Praxistest nicht ausgeführt.
