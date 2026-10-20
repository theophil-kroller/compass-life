# Compass 0.5.54 – Projektnavigation, Wochenbelastung und Recovery-Planung

## 1. Kritische Regression in der Projektliste behoben
- **Ursache**: `current.isTemplate!==false` stufte reguläre Projekte ohne optionales `isTemplate`-Feld fälschlich als Vorlagen ein. Die Auswahl wurde sofort wieder gelöscht.
- Jetzt prüft die Ansicht `Boolean(current.isTemplate)!==templates`. Ein Projektname öffnet den Inspector und klappt das Projekt auf, auch wenn es zuvor eingeklappt war. Die Projektbearbeitung ist sofort sichtbar.
- „Heute“-Kästchen, Aufgabenstatus, Stückzähler, Ordner-Icons und Auf-/Zuklappen bleiben getrennte Aktionen.
- Ein zusätzlicher Browser-Simulationstest öffnet ein zuvor geschlossenes Projekt tatsächlich, statt nur Quelltextzeichenfolgen zu prüfen.

## 2. Wochenbelastung nach Monaten lesbar
- Die X-Achse zeigt **alle zwölf Monatsnamen** (Jan–Dez), ausgerichtet an den realen Monatsanfängen, mit sehr dezenten Monatsbändern und Grenzlinien.
- Wochenbalken liegen an tatsächlichen Kalenderdaten; Wochen ohne Einträge werden nicht zusammengeschoben.
- Beim Überfahren eines Balkens erscheinen Kalenderwoche (KW), Datumsbereich, erfasste Stunden und ggf. Schwellenwertüberschreitung.
- Die wählbare 35–55-Stunden-Marke und der Vier-Wochen-Trend bleiben erhalten.

## 3. Recovery & Time-off Recommender (erste konservative Version)
- Unter **Planen → Forecast**: aufklappbare, kompakte **„Freien Tag prüfen“**-Simulation mit Umschalter ZA/Urlaub.
- Vergleicht für potenzielle Arbeitstage bis zu 14 Tage voraus denselben GTD-/Deadline-Plan **mit und ohne** Entfernung der Arbeitszeit am jeweiligen Tag.
- Kennzeichnet nur *zusätzliche* Fristkonflikte als Konsequenz des freien Tags; vorhandene Konflikte, fehlende Aufwandsschätzungen und manuell vormerkte Arbeitsblöcke bleiben sichtbar unsicher.
- „Work“-Kalenderblöcke bleiben verfügbare Zeit, Meetings blockieren. Für Empfehlungen sind eine frische, vollständige Google-Kalenderabdeckung und ein erfasstes Stunden-/Urlaubskonto nötig.
- Zeigt einen begrenzten Erholungskontext aus dokumentierten Wochenstunden und gemessenen Schlaftrends, sofern Daten vorhanden sind. Keine Diagnose, keine ausgedachten Ursachen.
- **Keine Änderungen** an Google Kalender, Aufgaben, Arbeitszeiterfassung, ZA/Urlaubsguthaben oder D1.

## Grenzen / nächster Ausbau
- Die Freizeit-Simulation nutzt ausschließlich den **primären Google-Kalender**, die derzeit geladenen 14 Tage, hinterlegte Aufwandsschätzungen und bestehende GTD-Abhängigkeiten; nicht bekannte Verpflichtungen fehlen.
- Keine automatische Beantragung oder Buchung von ZA/Urlaub; eine formelle Genehmigung liegt außerhalb von Compass.
- Technische Tests prüfen Funktionslogik und UI-Navigation; eine Produktionskompilierung mit Vite und eine vollständige visuelle Live-Abnahme müssen auf einem Entwicklungsrechner erfolgen.

## Prüfstand
- **573/573** Node-Tests; Worker-Syntaxprüfung erfolgreich.
- Kein neues Cloudflare-Worker-API und **keine neue D1-Migration**. Die für 0.5.52 benötigte Migration **0017** muss beim Update eines älteren Stands bereits vorhanden sein.
- PATCH ab 0.5.53.1 und FULL SOURCE bytegenau gegengeprüft.
