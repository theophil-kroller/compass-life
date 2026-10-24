# Compass 0.5.77.36 — Adaptive Nutrition · Smoothie · Pflanzenstoffe

**Voraussetzung:** 0.5.77.35 ist bereits in GitHub installiert. Dies ist ein **additiver GitHub-Upload-Build**, kein Full Source.

## Funktionsumfang

1. **Adaptive Ernährungs-Schnellerfassung** — Vor 11 Uhr bleibt Frühstück oben, von 11–15 Uhr stehen Mahlzeiten/Getränke/Snacks vorn und ab 15 Uhr Getränke/Snacks/Mahlzeiten. Abends ebenfalls Getränke/Snacks. Alle Kategorien bleiben erhalten. Grüntee und persönlicher Smoothie stehen in der Getränkekategorie im Schnellzugriff. Keine erneute Vollansicht bei jeder Uhrzeitänderung; die Reihenfolge gilt beim Öffnen des Dialogs.
2. **Mein Smoothie** — neuer Favorit mit acht Zutaten: Banane, schwarzer Sesam, Blütenpollen, Zimt, Ingwerpulver, gefrorene Blaubeeren, Pfefferminze und Nussmix. Die Erstannahmen werden **bei jeder Erfassung als eigener Rezeptschnappschuss** gespeichert und können anschließend unter Ernährungstagebuch → Eintrag bearbeiten in Gramm verändert werden. Änderungen an einem Tag verfälschen keine früheren Einträge; neue Smoothies übernehmen die Zutatenmengen aus dem zuletzt erfassten korrigierten Rezept.
3. **Mikronährstoffe** — USDA-orientierte generische Mineralstoffprofile für aufgebrühten Grüntee (Kalium, Magnesium, Mangan, Riboflavin) und Filterkaffee (Kalium, Magnesium, Niacin), ausdrücklich als Schätzung. Bereits vorhandene Koffeinprofile bleiben erhalten.
4. **Pflanzenstoffe** — neuer Unterreiter unter Ernährung. Zeigt *unterschiedliche Klassen getrennt*: Catechine (Grüntee), Chlorogensäuren (Kaffee), Anthocyane (Blaubeeren im persönlichen Smoothie), jeweils als Literatur-basiertes Intervall mit direktem Quellenlink. 7/30/90-Tage-Perioden und Transparenzliste für nicht bestimmte Lebensmittel. **Kein ORAC-Gesundheitsscore**, keine erfundene Tagesdosis.
5. **Daily Dozen** — Banane, Blaubeeren und Nussmix können aus gespeichertem Smoothie-Rezept mengenbasiert zugeordnet werden. Falls die Mengen bisher nur geschätzt wurden, wird dies in der Quellenbegründung kenntlich gemacht. Manuelle Korrekturen behalten Vorrang.

## Annahmen und Datenlücken

- **Sesam-Schöpfer:** 15 g nur vorläufig — bitte bei Gelegenheit einmal abwiegen.
- **Handvoll Blaubeeren:** 75 g nur vorläufig.
- **Handvoll Nussmix:** 30 g vorläufig.
- **1 TL Blütenpollen:** 5 g vorläufig. Keine belastbare pauschale Nährwert- oder Polyphenolmenge; wird nicht als gemessene Null behandelt.
- **Pfefferminze:** 2 g, Nährstoffprofil dieser Menge nicht ausreichend gesichert.
- Die Summe der bisher bezifferbaren Zutaten beträgt ca. **433 kcal**; Blütenpollen und Minze kommen hinzu, ihr Beitrag ist in dieser Zahl **nicht enthalten**. Damit ist dies **keine vollständige kalorische Analyse**.
- Brand-spezifische Werte für Hofer Heidelbeeren und schwarze Sesamsamen liegen nicht vor; Referenzwerte können abweichen.
- Verschiedene Pflanzenstoffklassen werden nicht zu einer scheinbar wissenschaftlichen einzelnen Antioxidantienzahl aufsummiert.

## Technik und Daten

- Reines Browser-/Vault-Modul, keine externe Nutrition-API, keine Übertragung der Ernährungsdaten.
- Guarded Vite-Source-Bridge wird **nach** der Version .35 registriert.
- Ergänzt bestehende `nutritionJournal.entries` um optionales `recipe`-Array je Smoothie-Eintrag; damit sind bereits bestehende Daten kompatibel.
- Kein automatisches Umschreiben älterer einfacher `smoothie`-Einträge.
- Vite-PWA Konfiguration bleibt ansonsten unverändert.

## Qualität

10 neue gezielte Tests mit Node.js bestanden; zusätzlich syntaktische Prüfung der neuen Module. **Kein vollständiger Vite-Produktionsbuild** (Repository nicht über lokalen Netzwerkzugriff klonbar). Tests der Integration in den verschlüsselten Live-Tresor und mobil auf realem Gerät sind noch erforderlich.

## Katalogabdeckung

Die beigefügte `PFLANZENSTOFFE_DATENABDECKUNG.csv` enthält für alle bestehenden Lebensmittel eine qualifizierte Abdeckung / explizite Datenlücke. Eine nicht quantifizierte Lebensmittelzeile ist **nicht antioxidantienfrei**. MatchaTherapy 30+ hat einen deklarierten EGCG-Mindestgehalt, der als eigener Mindestwert dargestellt wird; ein Mindestwert darf nicht zu einem exakten Catechin-Mittelwert addiert werden.
