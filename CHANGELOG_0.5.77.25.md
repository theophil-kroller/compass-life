# Compass 0.5.77.25 · Nutrition Insights 1

## Bereits bestehende Insights erweitert

- Ernährung in Insights: die bestehenden Tabs **Tagebuch** und **Makro & Mikro** bleiben unverändert. Dritter Tab **🕒 Timing & Trends**.
- Wochennavigation (Montag–Sonntag), Monatsnavigation (Kalendermonat) und Gesamtansicht. Links-/Rechtspfeile; im aktuellen Zeitraum keine Navigation in die Zukunft.
- Echter **Essenszeit-Dotplot**: pro gespeicherter kalorischer Aufnahme ein auswählbarer Punkt an der exakten lokalen Uhrzeit. 24-h-Uhrzeitachse, Date/Week/Month-Zeilen, Tageszeitsegmente mit dezenten Linien, Symbolen und Farben Orange → Rot → Blau. Gesamtansicht gruppiert zur Lesbarkeit nach Kalendermonaten, behält einzelne Ereignispunkte mit Uhrzeiten und Tooltip bei.
- **Fasten-/Essfenster**: täglicher 24-h-Streifen mit erster/letzter protokollierter Kalorienaufnahme, beobachtete Nachtpause zum direkten Vortag. Bei fehlendem Vortag keine Fastendauer; bei nur einem Eintrag unbekanntes Essfenster. Lokale Uhrzeit & DST berücksichtigt.
- **🏆 Längste protokollierte Esspause der Woche** (aktueller/ausgewählter Kalenderwoche), dazu Ø erste/letzte Aufnahme, Ø dokumentiertes Essfenster, Ø Nachtpause, Ø kcal/erfasstem Tag und Datenvollständigkeit.
- **Kalorientrend**: kcal pro dokumentiertem Tag mit einzelnen Messpunkten, 7-Tage-Trend wenn mindestens drei Tage mit erfassten Werten; Gesamtzeitraum Monatsmittel **je protokolliertem Tag** (nicht Monatssummen). Fehlende Tage sind keine 0-kcal-Tage; unvollständige Schätzungen werden erklärt.
- **Datenmodell bleibt unverändert**, keine D1- oder Tresormigration. Journaldaten bleiben verschlüsselt.
- **Schneller lokaler Tagescache**: pro Eintrag Fingerprint, aktualisiert nur betroffene Tage nach Editieren, Verschieben, Löschen, Ergänzen. Nur Darstellungs-Cache im Speicher, nichts zusätzlich in Tresor/Cloud.
- Umschalten von Woche/Monat/Gesamt und Auswahl von Dotplot-Punkten ersetzt nur den betroffenen Chart-Unterbaum statt globaler Re-Render der gesamten PWA.
- 9 neue Tests für Timestamp-Dots, Tag-/Monatsnavigation, Fasten-Adjazenz, Löschung und Verschiebung, Leerwerte, Farben/Icons, Jahresdaten, DST und bestehende Insights-Integration.

### Bewusst nicht enthalten

- Keine Koffein-Schlaf- oder Stimmungs-Korrelation; keine neue Makro- oder Mikronährstoff-Zeitreihe (spätere Nutrition Insights).
- Eine protokollierte Esspause ist **keine bestätigte Fastenzeit**. Fehlende Snacks, Drinks und unquantifizierte Lebensmittel können sie verfälschen. Bei nur einem Tagesereignis ist das Essfenster nicht verlässlich.
- Produktions-Browser-Smoke-Test / Vite-Build ohne npm-Abhängigkeiten lokal nicht durchführbar. Nach Push GitHub Actions prüfen.
