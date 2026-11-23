# Compass Life 0.5.91.66 – Hirse-Ei-Auflauf und optionale Birne

Ausgangsbasis: **0.5.91.65 Full Source**. Additive Menüeinträge, bestehender Tresor und Kalenderfunktionen bleiben unverändert. **Keine automatische Buchung** für 23./24.11.2026 oder einen anderen Tag; erst die Auswahl im Ernährungsmenü bucht das Essen.

## 1. Was bekannt ist – und was nicht

Der Nutzer erhielt einen Hirse-Auflauf von einer Freundin, der nach Hörensagen aus Hirse, Eiern und *sehr wenig Dattelsirup* besteht. Weder die exakten Mengen, das Gesamtgewicht, die Stückzahl, zusätzliches Fett/Milch noch das genaue Obst sind bestätigt. **Die in Compass hinterlegten Werte sind eine exemplarische Rezeptschätzung, keine Analyse des tatsächlich erhaltenen Auflaufs.** Die Birne ist optional und wird ausdrücklich **nicht** als bestätigte Zutat des Geschenks ausgegeben.

### Explizite Modellannahme (für den gesamten Auflauf)

- **500 g in Wasser gekochte Hirse** (~170 g trocken – Wasseraufnahme schwankt; nicht gemessen).
- **3 Eier = 150 g essbarer Anteil**.
- **10 g Dattelsirup insgesamt**, als Schätzung für „sehr wenig“.
- Kein zusätzliches Öl/Butter oder Milch angenommen; Zubereitungsverluste gering, Gesamtgewicht ca. **660 g**.
- **4 Portionen à 165 g**, einschließlich der mengenmäßig angenommenen Eier und des Sirups.
- Variante „mit Birne“: **1 Portion Hirse-Auflauf (165 g) + 100 g frische Birne** (insgesamt 265 g). Keine Behauptung, dass die Birne im Ausgangsrezept enthalten ist.

## 2. Menüeinträge und Nährwerte pro Standardportion

| Wert | Hirse-Ei-Auflauf pur · 165 g | Mit 100 g Birne · 265 g |
|---|---:|---:|
| Energie | **209 kcal** | **266 kcal** |
| Protein | **9,1 g** | **9,5 g** |
| Kohlenhydrate | **31,6 g** | **46,8 g** |
| davon Zucker | **1,9 g** | **11,7 g** |
| Fett | **4,8 g** | **5,0 g** |
| gesättigte Fettsäuren | **1,4 g** | **1,4 g** |
| Ballaststoffe | **1,6 g** | **4,7 g** |
| Salz | **0,14 g** | **0,14 g** |
| Calcium | **24,8 mg** | **33,8 mg** |
| Magnesium | **59,5 mg** | **66,5 mg** |
| Kalium | **129 mg** | **245 mg** |
| Phosphor | **199 mg** | **211 mg** |
| Eisen | **1,44 mg** | **1,62 mg** |
| Zink | **1,62 mg** | **1,72 mg** |
| Folat | **41 µg** | **48 µg** |
| Vitamin B12 | **0,33 µg** | **0,33 µg** |
| Vitamin D | **0,75 µg** | **0,75 µg** |
| Vitamin C | **nicht quantifiziert** | **4,3 mg** |

Bei ALLEN diesen Angaben handelt es sich um **geschätzte, generische Lebensmittelwerte**; sie sind im Profil als `estimatedNutrients` markiert, einschließlich kcal/Protein. Nicht enthaltene Mikronährstoffschlüssel sind **unbekannt, nicht Null**.

Referenzdaten (generische Grundlagen): USDA FoodData Central / USDA SR Legacy **millet, cooked (168871)**, **egg, whole, raw (171287)**, **pears, raw (169118)**. Dattelsirup ohne Herstelleretikett wurde mit 280 kcal/100g und 70g KH/100g modelliert. Daten für rohe Eier sind nur eine Zutatenbasis; gegarte Werte und Zubereitung können abweichen.

## 3. Daily Dozen und Anti-Aging Eight

- Bei Auswahl des puren Auflaufs: ca. **125 g gekochte Hirse pro Portion**; vorsichtige Berechnung mit 100 g pro ganzer Vollkornportion = **1,25 Vollkornportionen**. Annahme: *ganze* (nicht raffinierte) Hirsekörner; falls anders zubereitet, korrigieren.
- Obst wird **nur in der Variante mit Birne** gebucht: 100 g / 120 g = ca. **0,83 Obstportionen**. Andere Früchte sind nicht automatisch als Birne zu werten.
- Eier und Dattelsirup bringen keine Daily-Dozen-Gutschrift. Keine Nuss-, Beeren-, Hülsenfrucht- oder Gewürzportion erfunden.
- Anti-Aging Eight verwendet die protokollierten Nährwerte und nennt ballaststoffhaltige Pflanzenanteile als Teilinformation; es behauptet keine NAD⁺-/Mikrobiom-/Lebensdauerwirkung.
- Daily-Dozen-Werte werden erst **beim protokollierten Verzehr** berechnet, nicht schon beim Vorhandensein des Katalogeintrags.

## 4. Bedienung

Unter **Frühstück**, Filter **Gerichte & Beilagen** (oder Suche „Hirse-Auflauf“):
- `Hirse-Ei-Auflauf · wenig Dattelsirup (hausgemacht)` – Standard **1 Portion (ca. 165 g)**.
- `Hirse-Ei-Auflauf mit Birne · Frühstück` – Standard **1 Portion (ca. 265 g; mit 100 g Birne)**.

Unterstützte Portionen: `½ Portion`, `1 Portion`, `2 Portionen`, `1 Stück`, `100 g` usw.; beide Profile skalieren ihre jeweilige Komposition proportional. Für andere tatsächliche Obstsorten besser **puren Auflauf + separates Obst** buchen. Falls die Freundin Rezeptdetails/Portionsgewicht nachreicht, Werte in `client/src/millet-egg-bake-v059166.js` anpassen.

## 5. Technische Integration und Qualität

- `client/src/millet-egg-bake-v059166.js`: deklarierte Annahmen, aus generischen Referenzen errechnete Makro-/Mikrowerte, zwei Menüpresets, Portionsparser, Rezeptdokumentation.
- Integration in `food-additions-v059148.js`, `food-menu-v059148.js`, `daily-dozen-evidence-v57759404.js` und `anti-aging-eight-v57734.js`.
- Unveränderte übrige Funktionen (Outlook-Bridge, Kalender-Deduplikation, Entsperrintervall, Workout, alle bisherigen Lebensmittel).
- `tests/compass-059166-millet-egg-bake.test.mjs` (7 neue Tests) erfolgreich; Importgraph 314 Module erfolgreich.
- Gesamttests: **2.385 / 2.452 bestanden; 67 bekannte Altfehler**, die denselben Testnamen wie im unveränderten Vorgänger (2.378 / 2.445, 67 Altfehler) haben. Es sind **0 neue Fehler** hinzugekommen.
- Lokaler Vite-Produktionsbuild **nicht ausgeführt**, da `vite` in der aktuellen Umgebung nicht installiert ist. GitHub Actions führt `npm install`, `npm run check:deploy` und `npm run build` beim Deploy aus.
- Keine Datenbank-/D1-/Vault-Migration; kein automatisches Umschreiben persönlicher Daten. 
