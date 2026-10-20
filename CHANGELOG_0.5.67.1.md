# Compass 0.5.67.1 – Life Balance Radar: Arbeitsbalance-Hotfix

Basis: **0.5.67**, ohne Datenmigration oder Änderung der importierten Arbeitszeiteinträge.

## Behobener Fehler

Die Radarberechnung nahm bislang ein gleitendes Fenster von sieben Tagen und bildete innerhalb dieses Fensters ISO-Kalenderwochen. Bei einem typischen Mittwoch war die Vorwoche dadurch um Montag und Dienstag beschnitten; eine vollständig importierte Arbeitswoche wurde womöglich verworfen.

## Korrektur

- **7-Tage-Modus:** Die letzte ausreichend dokumentierte und abgeschlossene ISO-Kalenderwoche dient als Referenz. Hierzu darf die Suche bis zum Montag der Woche zurückgreifen, in der das sichtbare 7-Tage-Fenster beginnt (maximal sechs zusätzliche Tage).
- **30-Tage-Modus:** Durchschnitt der ausreichend dokumentierten, abgeschlossenen ISO-Kalenderwochen des Zeitraums mit entsprechendem Wochenrand.
- Ausreichend dokumentiert heißt mindestens drei tatsächlich erfasste Kalendertage; fehlende Tage werden nicht als arbeitsfrei angenommen. Laufende Wochen werden nicht fälschlich auf eine vollständige Woche hochgerechnet.
- Der Radar zeigt nun die berücksichtigten ISO-Wochen, Daten und Anzahl dokumentierter Tage. Ohne brauchbare jüngere Woche erscheint ein konkreter Grund statt einer irreführenden pauschalen Meldung.
- Die bisherige persönliche Grenze für Wochenstunden bleibt unverändert; unter dem Wert zu liegen bedeutet nicht automatisch Erholung oder Gesundheit.
- Historische Zeitspuren nutzen jeweils ihre eigenen abgeschlossenen Wochen. Keine aktuellen Stunden werden rückwirkend kopiert.

## Abgrenzung

Das ist ein lokaler Hotfix für den **Life Balance Radar**, nicht für die Arbeitszeit-Importlogik. Bereits importierte Excel-Zeiten seit 2023 bleiben bestehen. Für die aktuelle Arbeitsbalance braucht Compass dennoch ausreichend *aktuelle* Wochen; aus historischen Daten allein lässt sich keine aktuelle Belastung ableiten.

## Prüfungen

- Neue Tests reproduzieren den Fehler am 21.10.2026 und prüfen Jahres-/Wochenübergang, Teilwochen, Überlastung, Historie und fehlende Einträge.
- Vollständige Node-Tests und JavaScript-Syntaxprüfungen ausführen.
- Vite-Produktionskompilierung und Live-Abnahme im Browser bleiben offen, sofern Vite im Arbeitscontainer nicht bereitsteht.
