# Compass Life 0.5.91.65 – Rösti-Toast und Rohkakao mit Hafermilch

Ausgangsbasis: **0.5.91.64 Full Source**, additiv, keine Datenbank-/Vault-Migration. Die beiden Einträge erscheinen im bestehenden Essensmenü und sind über Namen/Aliasse suchbar. Es wird **kein** Essen automatisch gebucht.

## 1. All Seasons Rösti-Toast (Preiselbeeren & Camembert)

- Eine Packung **400 g = 2 Stück**, Standardportion **1 Stück = 200 g**, Kategorie **Mahlzeiten**.
- Vom fotografierten Etikett pro 200 g (zubereitet im Backofen): **455 kcal, 11 g Protein, 51 g Kohlenhydrate, 6,4 g Zucker, 22 g Fett, 7,8 g gesättigte Fettsäuren, 1,8 g Salz**. Natrium daraus rechnerisch **720 mg**.
- Zutaten: Kartoffeln 64 %, Schmelzkäsezubereitung 15 % (u. a. Camembert 4,5 %), Preiselbeerfüllung 10 % (Preiselbeeren 6,5 %). Zubereitung und weitere Zutaten auf Packung.
- Ballaststoffe, Vitamine und Mineralstoffe **nicht deklariert**. Ergänzte **grobe, als geschätzt markierte Mikronährstoffe** pro Stück: Calcium 170 mg, Magnesium 43 mg, Kalium 575 mg, Phosphor 230 mg, Eisen 1,1 mg, Zink 1,3 mg, Vitamin C 8 mg, Vitamin B6 0,27 mg, Folat 30 µg, Vitamin B12 0,3 µg. Diese Werte sind *keine* Produkt-/Labordaten und haben deutliche Schwankungsbreiten.
- `1 Stück`, `2 Stück`, `1 Packung`, `½ Stück` und Grammangaben skalieren. Bei Zubereitung mit zusätzlichem Fett dieses getrennt erfassen.
- Daily Dozen: **keine automatische Vollkorn-, Kartoffel-, Beeren- oder andere Gutschrift**. Die 13 g Preiselbeeren pro Stück stammen aus einer gesüßten Füllung und werden in den Evidenzhinweisen transparent erwähnt. Anti-Aging Eight: keine unbelegte Gutschrift.

## 2. Rohkakao mit Hafermilch, hausgemacht

- Standardportion **1 Tasse**, angenommene Mischung **200 ml Haferdrink Barista + 8 g feste, gehackte Rohkakaomasse** (ca. 2 TL). **Nicht** Kakaopulver. Haferdrink-Marke und Kakaoetikett wurden nicht angegeben.
- **Reine Rezeptschätzung** pro Tasse: **168 kcal, 3,2 g Protein, 14,2 g Kohlenhydrate, 8,15 g Zucker, 10,3 g Fett, 3,2 g gesättigte Fettsäuren, 2,4 g Ballaststoffe, 0,2 g Salz**.
- Orientierende Mikronährstoff-Schätzungen pro Tasse, ausdrücklich als *estimated* markiert: Calcium 30 mg (Annahme **nicht** angereicherter Haferdrink), Magnesium 60 mg, Kalium 270 mg, Phosphor 110 mg, Eisen 1,2 mg, Zink 0,7 mg, Kupfer 0,2 mg, Mangan 0,3 mg, Vitamin B1 0,09 mg, Folat 10 µg. Bei angereicherter Hafermilch können Calcium, B2, B12 und D erheblich anders sein; B12 und D werden **nicht erfunden**.
- Kakaoflavanole, Theobromin und Koffein bleiben **unbekannt**, nicht Null. Keine erfundenen Daily-Dozen-Vollkorn-/Getränke-/Nuss-/Gewürzportionen oder Anti-Aging-Wirkungen. Das Ernährungsprotokoll erkennt dennoch die Makros/Mikros und den Gesamtproteinbeitrag.
- `½ Tasse`, `1 Tasse`, `2 Tassen`, `200 ml`, `250 ml` sowie Grammangaben skalieren die *ganze Rezeptportion* proportional.

## Integration und Vertrauensgrenzen

- `client/src/roesti-cocoa-v059165.js`: ausschließlich additive Presets, Nährstoffprofile, dokumentierte Ausgangsdaten, Gramm-/Portionsparser.
- Integration über `food-additions-v059148.js` im bestehenden Nutrition-Journal, `nutrition-intelligence` und dem Menüfilter.
- `daily-dozen-evidence-v57759404.js`: **Evidenzhinweise ohne automatische Gutschrift**, skalierbar ohne doppelte Zählung.
- `HOMEMADE_148` markiert ausschließlich den hausgemachten Kakao; Rösti ist Fertigprodukt.
- Vorherige Lebensmittel, Outlook Bridge, Sperrintervall, Kalender-Deduplizierung, Daily-Dozen-Komptaktanzeige und Rote-Rüben-Kartoffelsalat werden nicht überschrieben oder entfernt.
- Die gespeicherten Nährstoffschätzungen sind Näherungen, keine exakten individuellen Analysen. Nutzer können Produktangaben später nachreichen.

## Qualitätskontrolle

- Neue gezielte Tests: `tests/compass-059165-roesti-raw-cocoa.test.mjs` (5 Tests) plus Vorversionsregressionen.
- Relative Importgraph-Prüfung mit 313 Modulen erfolgreich. Vite-Produktionsbuild benötigt installierte npm-Abhängigkeiten und ist bei der GitHub-Action zu prüfen.
- Testdaten bleiben im verschlüsselten bestehenden Tresor; keine Migration oder Datenlöschung.
