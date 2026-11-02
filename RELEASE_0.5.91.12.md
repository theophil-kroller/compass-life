# Compass 0.5.91.12 · Vier neue Speisen für Frühstück & Mahlzeiten

**Basis:** `theophil-kroller/compass-life`, `main`, Version **0.5.91.11**, Commit `a8e349768f32b679c1dd4c48ddf8718fb4d5cb45` (02.11.2026).

## Menü & Portionsannahmen

| Name / ID | Vorbelegtes Gewicht | Energie | Protein | Kohlenhydrate | Fett | Quelle |
|---|---:|---:|---:|---:|---:|---|
| `spar-freefrom-bio-skyr-250g` | 250 g | 155 kcal | 27,5 g | 10 g | ca. 0,75 g | Skyr-Nutzerfoto: Energie, Protein, KH; Fettgrenze <0,5 g/100 g |
| `bio-magertopfen-250g` | 250 g | 175 kcal | 30 g | 10,25 g | 0,5 g | Magertopfen-Nutzerfoto: Etikett pro 100 g |
| `homemade-topfentorte-slice` | 160 g, ungewogen | ca. 371 kcal | ca. 15,9 g | ca. 40,4 g | ca. 16,7 g | Foto- und generischer Rezeptproxy |
| `korean-spicy-tofu-vegetable-strudel` | 288 g, ungewogen | ca. 521 kcal | ca. 21,0 g | ca. 45,8 g | ca. 30,5 g | Foto- und generischer Rezeptproxy |

- Skyr (SPAR free from laktosefreier Bio-Skyr) Etikett je 100 g: 62 kcal, 11 g Protein, 4,0 g Kohlenhydrate/Zucker, Fett **<0,5 g**, davon gesättigt **<0,1 g**, Salz 0,10 g. Fett/gesättigt werden rechnerisch mit konservativen Mittelwerten geschätzt (0,3/0,05 g je 100 g); nicht als exakter Etikettwert ausgeben.
- Magertopfen Etikett je 100 g: 70 kcal, 12 g Protein, 4,1 g KH/Zucker, 0,2 g Fett, gesättigt 0,1 g, Salz 0,10 g.
- Beide Etikette geben **keine quantifizierte Calcium-, Kalium-, Phosphor-, Magnesium- oder B12-Konzentration** an. Diese fünf Werte sind grobe Nährwertprofile vergleichbarer Milchprodukte und als *estimatedKeys* markiert. Vitamin D und nicht verfügbare Werte bleiben unbekannt, nicht Null.
- Topfentorte: geschätzt 125 g gebackene Topfenfüllung + 35 g Boden; tatsächliches Stückgewicht, Eier-/Zucker-/Rahmanteile, Teig und Rezept unbekannt. Calcium ~134 mg, Vitamin B12 ~0,69 µg und andere Mikros sind reine generische Schätzwerte.
- Strudel: geschätzt 80 g blättriger Teig, 90 g Tofu, 100 g Gemüse, 6 g zusätzliches Öl und 12 g scharfe Würzung. Ob Blätterteig, Gochujang oder bestimmte Gemüse/fermentierte Lebensmittel enthalten sind, ist **nicht bestätigt**. Eisen ~3,4 mg, Calcium ~108 mg, Kalium ~355 mg, Vitamin C ~22 mg und andere Mikros generische Schätzungen. Der Calciumgehalt von Tofu variiert besonders mit dem Gerinnungsmittel.

## Daily Dozen, Anti-Aging Eight & Datenschutz

- Die beiden Milchprodukte und Topfentorte erhalten keine automatisch bestätigten Beeren-, Nuss-, Hülsenfrucht- oder Vollkornportionen.
- Der Strudel erhält in der gemeinsamen Zutaten-Evidenz aus 90 g geschätztem Tofu ca. **0,72 Hülsenfruchtportionen** und aus 100 g Gemüse ca. **1,25 vorläufige Gemüseportionen**. Wegen unbekannter Gemüsesorten gibt es keine automatische Kreuzblütlerportion. Die Mengen werden nach Zutatenkorrektur neu berechnet.
- Anti-Aging Eight berücksichtigt den aus den Einträgen errechneten Proteinwert und Tofu/Gemüse als indirekte Nahrungsindikatoren, nicht als bestätigte Langlebigkeitswirkungen, Proteinrestriktion oder gemessene Postbiotika.
- Die Gerichte erscheinen nur im **Menükatalog**; morgen geplantes Frühstück wird **nicht automatisch ins Tagebuch eingetragen**. Vorhandene Einträge, Fitdays-, Garmin- und Finanzdaten bleiben unverändert. Keine Datenmigration, kein neuer Speicher, kein externer Upload.

## Technische Prüfungen

- `node --test tests/compass-059112-skyr-topfen-torte-tofu-strudel.test.mjs`: **8/8** bestanden.
- `npm run check:deploy`: **33/33** Deployment-Tests bestanden; Importgraph und Worker-Syntaxprüfung bestanden.
- `npm test`: **1968/2003**; 35 historische Fehler. Gegen die ungeänderte Version 0.5.91.11 (`1960/1995`) wurden **exakt dieselben 35 fehlgeschlagenen Testnamen** abgeglichen, **0 neue Fehler**.
- `npm run build`: **nicht erfolgreich ausführbar**, weil im lokalen Quellbaum Abhängigkeiten fehlen: `vite: not found`. Dies ist kein getesteter Vite-Produktionsbuild; GitHub Actions muss den echten Build bestätigen.
- Der Patch wird durch einen exakten Inhaltsvergleich mit der Ausgangsversion gegen Full Source überprüft. ZIP-CRC wird geprüft.
