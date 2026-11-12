# Compass Life 0.5.91.45 · Proteinoptionen aus deinem Menü

Baseline: **0.5.91.44**, vollständiges Source-ZIP `Compass_Life_0.5.91.44_VTAPER_NUTRITION_COACH_FULL_SOURCE.zip`. Kein Schreibzugriff auf GitHub oder persönliche Tresordaten.

## Neu unter Insights → Körper → V-Taper-Fortschritt → Ernährung

- Nach der bestehenden Coach-Einschätzung erscheinen **vier konkrete proteinreiche Produkte aus dem bestehenden Compass-Menü** mit *Originaltitel, vorgeschlagener Portion, Protein in Gramm und geschätzten Kilokalorien*. Drei weitere Produkte sind aufklappbar.
- Bewusst heterogene Vorschläge (Milchprodukt, veganer Shake, pflanzlicher Snack) statt nur eines generischen Skyr-Ratschlags. Beispiele aus bereits vorhandenen Produktdaten: SPAR free from Bio-Skyr, Bio-Magertopfen, Ehrmann High Protein Skyr, IronMaxx Vegan Protein Zero, Alpro Plant Protein Vanille/Schokolade, Milsani Skyr Maracuja.
- Werte werden **durch die bestehenden `nutritionFoods()`- und `nutrientEntry()`-Berechnungen** für die angezeigte Portion abgerufen, nicht in der Empfehlung hart kodiert. Fehlende Lebensmittel oder fehlende Protein-/Kalorienwerte werden übersprungen.
- Die 7-, 14- und 42-Tage-Ansicht hat jeweils die eigene Proteinlücke. Erreicht der Zeitraum die Proteinorientierung, bleibt die Auswahl als freiwillige Alternative sichtbar, ohne Aufforderung zum Mehressen.
- Kein pseudo-genaues „Heute verbleibendes Kalorienbudget“ aus historischen Durchschnittswerten; keine automatische Eintragung oder Änderung der Ernährung, kein Kalorien-Kompensationsvorschlag für einzelne Tage.
- Bestehende V-Taper-, Muskel-, Ernährungs- und Trainingsansichten bleiben unverändert.

## Tests und Grenzen

- Neue spezifische Tests für echte Produkt-IDs, Portion/Makros, vegetarische Auswahl, Zeithorizonte, Schreibfreiheit, geringe/ausreichende Proteinzufuhr.
- `npm run check:deploy`: 33/33 erfolgreich.
- Volle Regression im ersten Durchlauf: 2245 Tests bestanden, 67 fehlgeschlagen; davon 66 bereits bekannte Altfehler. Der eine neue Fehler war eine alte statische Versionsnummer-Erwartung im Dashboard-Test. Dieser Test wurde auf den Paketversionsvergleich korrigiert und besteht nun mit den gezielten Tests. Ein erneuter vollständiger Testlauf wurde angestoßen, konnte in der Laufzeitumgebung wegen Zeitlimits nicht vollständig beendet werden.
- Lokaler Vite-Produktionsbuild nicht verfügbar, weil `vite` in der Testumgebung nicht installiert ist. GitHub Actions muss den Deploy bestätigen.

## Installieren

Patch auf 0.5.91.44 anwenden, Verzeichnisstruktur erhalten. Alternativ das Full-Source-ZIP verwenden. Keine Vault-, Ernährungslog- oder persönlichen Dateien enthalten.
