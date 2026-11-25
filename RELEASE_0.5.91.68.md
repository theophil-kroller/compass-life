# Compass Life 0.5.91.68 – BILLA Sahnepudding, nöm PRO Vanille und Rapunzel Cranberries

Ausgangslage: unveränderter **Full Source 0.5.91.67**, direkt ergänzt durch drei fotografierte Produkte vom **25.11.2026**. Persönliche Ernährungseinträge werden **nicht** automatisch geschrieben. Alle neuen Einträge sind wiederverwendbar, Portionsmengen skalierbar.

## Menüeinträge: Standardportion = kompletter Becher / ganze Packung

| Produkt | Packung | kcal | Protein | Kohlenhydrate | Zucker | Fett | gesättigt | Salz | Ballaststoffe |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| BILLA immer gut Sahnepudding Vanille | 500 g | 755 | 13,50 g | 75,00 g | 60,00 g | 44,00 g | 30,00 g | 0,75 g | n. d. |
| nöm PRO 20 Topfencreme Vanille | 235 g | 112,8 | 19,74 g | 7,99 g | 7,05 g | ca. 0,59 g | 0,235 g | 0,235 g | n. d. |
| Rapunzel Bio Cranberries mit Apfeldicksaft | 100 g | 331 | 0,90 g | 73,00 g | 56,00 g | 0,90 g | 0,10 g | 0,04 g | 5,80 g |

Die Makros stammen vom **Originaletikett auf den Nutzerfotos** und beziehen sich auf die jeweilige komplette Packungsgröße; Werte werden intern in das Referenzmaß 100 g umgerechnet. Ausnahme nöm Fett: Etikett **<0,5 g je 100 g** (nicht exakt angegeben); die interne Mittelwert-Schätzung verwendet **0,25 g/100 g**, der dokumentierte Höchstwert ist **<1,175 g pro 235-g-Becher**. Nicht deklarierten Ballaststoffen darf kein Nullwert unterstellt werden.

## Zutaten und Ernährungsbezug

- **BILLA Sahnepudding:** 88 % Sahne (10 % Fett), Zucker, modifizierte Stärke, 0,6 % Bourbon-Vanilleextrakt, Laktose sowie weitere Zutaten laut Foto. **Kein Daily-Dozen-Pflanzencredit**.
- **nöm PRO Vanille:** Magertopfen, Wasser, 8 % Magermilchjoghurt, Stärke, Johannisbrotkernmehl, Vanillearoma/-pulver, Sucralose und Acesulfam K. **Kein Daily-Dozen-Pflanzencredit**. Die Blueberry-Cheesecake-Variante aus früherem Build bleibt unverändert und getrennt.
- **Rapunzel Cranberries:** 60 % getrocknete Cranberries, 39 % Apfeldicksaft, ca. 1 % Sonnenblumenöl. Nur die **60 g echten Cranberries** pro voller 100-g-Packung ergeben konservativ ca. **1,5 getrocknete Beerenportionen** à 40 g als *zutatenbasierte Schätzung*. Apfeldicksaft ist keine eigene Fruchtportion, und die gesüßte Variante ist kein Ersatz für ungesüßte Beeren. Die 56 g Zucker sind vollständig in der Bilanz enthalten. Official Daily Dozen: https://nutritionfacts.org/daily-dozen/ ; Produkt: https://shop.rapunzel.de/313200/Cranberries-ganze-Beeren/

## Mikronährstoffe (Schätzung auf Basis ähnlicher Lebensmittel, ausdrücklich keine Herstelleranalyse)

| Nährstoff | BILLA / 500 g | nöm / 235 g | Rapunzel / 100 g |
|---|---:|---:|---:|
| Calcium | ca. 525 mg | ca. 247 mg | ca. 9 mg |
| Magnesium | ca. 50 mg | ca. 28 mg | ca. 6 mg |
| Kalium | ca. 625 mg | ca. 329 mg | ca. 49 mg |
| Phosphor | ca. 450 mg | ca. 376 mg | ca. 13 mg |
| Vitamin B2 | ca. 0,60 mg | ca. 0,49 mg | n. d. |
| Vitamin B12 | ca. 2,0 µg | ca. 1,65 µg | n. d. |
| Eisen | n. d. | n. d. | ca. 0,40 mg |
| Mangan | n. d. | n. d. | ca. 0,30 mg |

`estimatedNutrients` listet alle Mikronährstoffe und beim nöm auch den unpräzisen Fettmittelpunkt. Fehlende Angaben werden als **unbekannt, nicht null** behandelt. Es erfolgt keine Diagnose oder Anti-Aging-Wirkungsbehauptung.

## Technische Umsetzung

- Neue Datei `client/src/food-desserts-cranberries-v059168.js`: Lebensmittelstammdaten, originalgetreue Makros, geschätzte Mikros, Labels und ein isolierter Portionsparser (z. B. `1 Becher`, `½ Packung`, `100 g`).
- Additive Registrierung in `food-additions-v059148.js`, Menüfilter und Proteintag in `food-menu-v059148.js`.
- Daily-Dozen-Zutatenledger in `daily-dozen-evidence-v57759404.js` plus ältere Checkbox-Ansicht in `daily-dozen-v57733.js` konsistent; Anti-Aging Eight zieht das Beeren-Evidence über die bestehende Summary-Logik.
- Release-Banner und `package.json`-Versionen auf **0.5.91.68** angehoben. Alte Einträge, Kalender, Outlook-Bridge, Tresor und Fitness bleiben unverändert.
- **Keine** Vault-, D1- oder Journaldatenmigration. **Keine** automatische Buchung des Essens von heute. Nach Deployment manuell als gegessen markieren.

## Qualitätssicherung

- Neue, gezielte Tests: **9/9 erfolgreich**.
- Relativer Importgraph: **316 Module, keine fehlenden Imports**.
- Gesamttest des neuen Quellstands: **2.401 bestanden / 2.468 gesamt; 67 fehlgeschlagen**.
- Unveränderter vorheriger Quellstand: **2.392 bestanden / 2.459 gesamt; 67 fehlgeschlagen**.
- Die **67 Fehlertestnamen sind exakt identisch**; **0 neu fehlgeschlagene Tests**.
- Vite-Produktionsbuild lokal **nicht ausgeführt** (Vite nicht installiert); über GitHub Actions bei Deployment prüfen.
- Voll- und Patch-ZIP werden auf Bytegleichheit nach Patch-Anwendung geprüft.

## MHD-Hinweis

Auf dem Foto der Rapunzel-Packung scheint **20.02.2026** als Mindesthaltbarkeitsdatum aufgedruckt. Das ist **keine automatische Lebensmittel-Sicherheitsaussage** und kein Verfallsdatum; bitte bei tatsächlichem Konsum/weiteren Packungen Zustand, Lagerung und sichtbaren Verderb beachten. Das Datum wird nur als Produkt-Hinweis gespeichert und gilt nicht als universelles MHD für jedes zukünftige Paket.
