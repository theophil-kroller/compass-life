# Compass Life 0.5.91.52 – Nutrition Intelligence, Phase 1

**Baseline:** 0.5.91.51.  **Scope:** add-on read-only interface, no migrations.

## Neue Ernährungsübersicht
- **Insights → Gesundheit & Körper → Ernährung → Überblick** (erster Untertab).
- Zeiträume **7 / 14 / 42 / 90 Tage**, mit **‹ / ›** unabhängig von Kalenderwochen.
- Ø kcal, Protein, Salz, Ballaststoffe und Detailwerte für gesättigte Fette/Vitamine/Mineralstoffe auf den **Tagen mit quantifizierten Angaben**.
- Wahlweise Kalorien-, Protein-, Salz-, Ballaststoff- und gesättigte-Fett-Zeitreihe. Nicht quantifizierte Nährstoffe erscheinen niemals als 0.
- Daily Dozen nach Kategorie: tägliche dokumentierte Portionen, Anteil der protokollierten Tage mit Zielerreichung, Mini-Heatmap und beobachtbare Anti-Aging-Aspekte (Beeren, Nüsse, Blattgemüse).
- Häufigste Lebensmittel mit Häufigkeit und summierbaren Gramm-/ml-/Stück-/Becherangaben (keine erfundene Umrechnung).
- **„Meine Ernährung analysieren“**: ausschließlich nach Klick. Der lokale Recommender nennt konkrete produktbezogene Salzbeiträge (g und prozentualer Anteil aller quantifizierten Salzquellen), erkennbare Daily-Dozen-Muster und passende vorhandene Produktnamen, ggf. Protein-/ALA-Hinweise mit Datenabdeckung.

## Sicherheit, Interpretation und Leistung
- Daten bleiben im lokalen, entsperrten Tresor; keine Netzwerk-/LLM-Anfrage, keine automatische Tagebuch-/Habit-/Mensa-Änderung.
- Ein einzelner salzreicher Tag führt nicht zu einer Anpassungsaufforderung. Hohe Schätz-/Datenlücken senken die Sicherheit der Aussagen.
- Ein fehlender Nährwert ist **nicht Null** und eine nicht protokollierte Daily-Dozen-Portion nicht bewiesen „nicht gegessen“. EU-NRV sind keine persönlichen Mangelgrenzen.
- Keine Behauptungen über gemessene Anti-Aging-Effekte, NAD+, microRNA, medizinische Diagnosen oder Kausalität.
- Overview-JS und -CSS werden als separate Chunks erst beim tatsächlichen Besuch des Overview-Tabs importiert. **Heute**, Inbox, Planen und das normale Ernährungsjournal erhalten keine zusätzlichen Ernährungs-Aggregationen beim Laden.

## Bewusste Folgeetappen
- Korrelationen mit Garmin-Schlaf, HRV, Krafttraining, Fastenzeiten, Arbeitszeiten, Habits oder Kontakten sind noch **nicht** implementiert. Vorher sind Datumszuordnung und Datenabdeckung zu testen; Kontakte nur mit ausdrücklicher Auswahl.
- 42 Tage = rollierender Betrachtungszeitraum, noch keine automatische Bindung an die Start-/Enddaten des Krafttrainingsblocks.

## Tests
- 8 neue gezielte Tests erfolgreich (Datum, Paging, benannte Quellen, keine Einzeltag-Moralisierung, Unbekannte≠0, Lazy Loading, Invalidation, Erhalt der Tabs).
- Full Regression: **2.287 bestanden**, exakt die gleichen **66 bereits bekannten Altfehler** wie 0.5.91.51, kein neuer Fehltest.
- 33/33 Release-/Deployment-Checks bestanden.
- Lokaler Vite-Produktionsbuild mangels installierter Vite-Abhängigkeit nicht ausführbar; bitte GitHub Actions prüfen.
