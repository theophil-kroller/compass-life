# Patch 0.5.91.10 installieren

**Voraussetzung:** GitHub `theophil-kroller/compass-life`, `main`, Version **0.5.91.9** (Basiscommit `b836076c505f9f175715912cf997e8ee734bff49`).

1. Das Patch-ZIP entpacken und enthaltene Dateien unter **unveränderter Verzeichnisstruktur** ins Repository hochladen; vorhandene Pfade überschreiben. Alternativ das Full-Source-ZIP als vollständig ersetzbaren Projekt-Quellstand verwenden, nicht beide Pakete zugleich.
2. GitHub Actions (`Deploy Compass Web`) auf erfolgreichen Produktionsbuild prüfen. Lokal wurden Source- und Deployment-Prüfungen ausgeführt; `vite build` scheitert hier an fehlenden Abhängigkeiten (`vite: not found`).
3. In Compass: Ernährung → Snacks → **Mein selbstgebackener Mohnkuchen mit Schokolade** bzw. Ernährung → Mahlzeiten → **Basmatireis mit Linsendal, Curry & Brokkoli**. Nach Auswahl kann der Zutateneditor individuelle Mengen übernehmen.
4. Der neue Speiseeintrag ist zunächst nur ein **Preset**. Er wird erst nach deiner bewussten Auswahl mit Datum ins verschlüsselte Ernährungstagebuch geschrieben; es werden keine älteren Einträge verändert.

**Datenqualität:** Mohnkuchen-Gewicht/Rezept nicht bestätigt; alle Nährstoffe nur Näherungen. Beim Dal gelten gekochte Gewichte. Daily Dozen/Anti-Aging werden aus Zutatenannahmen abgeleitet und sind **keine medizinische Prognose**.
