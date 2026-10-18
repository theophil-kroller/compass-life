# Compass 0.5.17.1 – Hierarchischer Sankey & Visual Lab

Ausgangsbasis: **0.5.17 FULL_SOURCE**. Patch enthält ausschließlich neue/geänderte Projektdateien relativ zur Repository-Wurzel.

## Behoben
- Die Cashflow- und Ausgaben-Sankeys haben jetzt drei echte Ebenen: Abgänge → Hauptkategorien → Unterkategorien.
- Kategorien mit echten Bankbeträgen, verwandten Farbtönen, Tooltips und anklickbarer Unterkategorie (öffnet Buchungen).
- Transfers, Bargeld und Ungeklärtes werden nicht als Konsumausgaben ausgegeben.

## Neu: Visual Lab
- Sunburst mit getrennten positiven/negativen Bankbewegungen; Radial-Sankey; echte gewichtete Voronoi-/Power-Treemap.
- Chord und Spider-/Radar-Diagramm zum Vergleich derselben Kategorien (keine fiktiven Kategorie-zu-Kategorie-Transfers).
- Zeitvergleichsmodi: aktueller Monat vs Vorjahresmonat, vs Vormonat oder Ø der Vorjahresmonate; aktuelles Quartal vs Vorquartal oder Vorjahresquartal; meteorologische Jahreszeit vs Vorjahr; Jahr vs Vorjahr.
- Calendar Heatmap, Spiral-Plot, Horizon-Chart, Streamgraph und zeitliches Alluvial (gleiche Kategorie über mehrere Monate).

## Methodische Grenzen
- Alle Grafiken beruhen ausschließlich auf importierten Bankbuchungen und lokal gespeicherten Kategorien. Kein Cloud-Tracking oder externer SVG-Renderer.
- Kein Kontostand- oder Vermögensabgleich, kein erfundener Geldfluss zwischen Ausgabenkategorien.
- Keine automatische Bestätigung vollständiger Monatsabdeckung; helle Tage ohne Buchung sind nicht nachweislich ausgabenfrei.
- Vorjahresvergleiche richten laufende Zeiträume am aktuellen Kalendertag aus. Der Ø-Modus basiert ausschließlich auf Monaten mit beobachteten Buchungen.
- Gewichtet-voronoiartige Flächen sind numerisch angenähert, exakte Beträge stehen in Tooltips.
- Health-Visualisierungen sind Teil des gesondert geplanten Health UX Builds 0.4.17.5; dieser Hotfix verändert keine Gesundheitsdatenmodelle.

## Installation
1. Lokales **verschlüsseltes Vault-Backup** erstellen.
2. `Compass_0.5.17.1_GITHUB_PATCH.zip` entpacken und Dateien mit unveränderten Pfaden ins Repository `compass-life` auf `main` übernehmen.
3. GitHub Actions Deployment abwarten. Bei einem PWA-Cache zunächst die Anwendung neu laden.
4. Finanzen → Cashflow oder Ausgaben für den hierarchischen Sankey öffnen; Finanzen → Visual Lab für weitere Diagramme.
