# Compass Life 0.5.91.67 – Nudelbox mit Gemüse & Thai-Curry-Soße (Imbiss-Schätzung)

Quelle: Nutzerbeschreibung des Mittagessens am **23.11.2026**. Ausgehend von der **unveränderten Full-Source-Version 0.5.91.66**. Keine automatische Änderung persönlicher Ernährungstagebucheinträge. Die Auswahl in Compass muss das Mittagessen selbst protokollieren.

## 1. Menüeintrag

**Nudelbox vom Chinesen · Gemüse & Thai-Curry-Soße (geschätzt)** · Kategorie **Mahlzeiten / Gerichte & Beilagen**. Standardportion **1 Box (ca. 550 g)**; Skalierung: ½ Box, 1 Box, 2 Boxen oder direkt Grammangabe. Suche: Nudelbox, Asia Nudelbox, Thai-Curry, gebratene Nudeln, Gemüsenudeln.

Es ist ausdrücklich KEIN bestimmtes Markenprodukt; die Zutaten-/Gewichtsanteile sind nicht verifiziert. Es wird keine Fleisch- oder Tofuzutat angenommen. Die Nudelsorte und die genaue Currysoße sind unbekannt. Insbesondere kann Fischsoße in Thai-Currysoße enthalten sein: Der Eintrag ist **nicht garantiert vegetarisch/vegan**.

## 2. Rezeptannahmen für 1 Box (nicht gemessen)

| Bestandteil | Modellgewicht | Hinweise |
|---|---:|---|
| Gegarte Nudeln | 300 g | generischer Nährwert-Proxy: USDA FDC 168926 für gekochte Eiernudeln; keine Aussage über tatsächliche Eizugabe |
| Gemischtes Gemüse | 130 g | z. B. Karotten, Kraut, Paprika, Zwiebel; konkrete Mischung nicht bekannt |
| Thai-Currysoße | 105 g | Kokosmilch-/Curry-Proxy, Sauceart nur vermutet; Fett-/Salzgehalt stark variabel |
| Aufgenommenes Bratöl | 15 g | Bratölmenge nur Modellannahme |
| **Gesamt** | **550 g** | 1 übliche Nudelbox |

**Wichtiger Unterschied:** Die angegebenen Makro-/Mikrowerte sind geschätzte Referenzwerte. Nicht als Herstelleretikett oder echte Analyse ausgeben. Etwa **550–950 kcal** sind für unterschiedlich gefüllte/ölige Boxen als grobe Orientierung denkbar; **742 kcal** ist der rechenbasierte Standardwert zum praktischen Tagebuch-Tracking. Bei abweichender Portion die Grammzahl korrigieren.

## 3. Nährstoffe pro Standardbox (alle geschätzt)

| Makronährstoff | Geschätzter Wert |
|---|---:|
| Energie | 742 kcal (intern 741,5) |
| Protein | 17,5 g |
| Kohlenhydrate | 93,1 g |
| Zucker | 9,7 g |
| Fett | 33,6 g |
| davon gesättigt | 10,4 g |
| Ballaststoffe | 7,2 g |
| Salz (aus modelliertem Natrium) | 2,4 g |

| Mikronährstoff | Näherungswert |
|---|---:|
| Calcium | 100 mg |
| Magnesium | 111 mg |
| Kalium | 563 mg |
| Phosphor | 310 mg |
| Eisen | 3,7 mg |
| Zink | 1,5 mg |
| Folat | 83 µg |
| Vitamin C | 28 mg |
| Vitamin A | 156 µg RAE |
| Vitamin B6 | 0,20 mg |
| Selen | 72 µg (unsicherer Getreide-Proxy) |

Weitere Mikronährstoffe ohne verlässliche Grundlage sind **unbekannt, nicht Null**. Alle gespeicherten Makro-/Mikroschlüssel sind als `estimatedNutrients` markiert. Nährwerte je nach Soße, Öl und Gemüse können erheblich abweichen.

Datenbasis: USDA FoodData Central / SR Legacy **cooked egg noodles (FDC 168926)** nur als Nudel-Proxy; die übrigen Komponenten sind generische Rezeptmodelle. Beispiele für Thai-Curry-Soßen liegen in Handelsprodukten etwa bei 99 kcal/100 g (Tesco Green Thai Cooking Sauce) und anderen Werten bei kokosreicheren Rezepturen. **Kein Etikett einer bestimmten Imbissbox wurde verwendet**.

## 4. Daily Dozen / Anti-Aging Eight

- Die **geschätzten 130 g Gemüse** entsprechen bei 80 g pro Gemüseportion **1,625 Gemüseportionen**, sofern die angenommene Menge tatsächlich enthalten war; im Score auf 1,6 gerundet.
- Keine automatische Vollkornportion für nicht als Vollkorn bestätigte Nudeln; keine gesicherten Hülsenfrüchte, Kräuter-/Gewürzmengen, Beeren, Nüsse, Kreuzblütler oder Getränke.
- Anti-Aging Eight nutzt vorhandene Mengen nur als **Ernährungs-Teilinformation** (Protein und Ballaststoffquelle); keine behauptete Messung des Mikrobioms, von NAD⁺ oder von Langzeitwirkungen.
- Gutschriften erfolgen nur nach **aktiver Buchung** des Eintrags, nicht allein durch die Existenz im Katalog.

## 5. Umsetzung / Tests

- `client/src/takeaway-noodlebox-v059167.js`: Zutaten/Schätzprofile, Makros, ausgewählte Mikros, Metadaten, Gramm- und Portionsparser.
- Additive Integration in `food-additions-v059148.js`, `food-menu-v059148.js`, `daily-dozen-evidence-v57759404.js`, `anti-aging-eight-v57734.js`.
- `tests/compass-059167-noodlebox.test.mjs`: **7/7 bestanden**.
- Modulgraph: **315 Module, keine fehlenden relativen Imports**.
- Gesamttest 0.5.91.67: **2.392 bestanden / 2.459 Tests; 67 fehlgeschlagen**.
- Unveränderte Baseline 0.5.91.66: **2.385 bestanden / 2.452 Tests; 67 fehlgeschlagen**.
- **Alle 67 Fehlertestnamen sind identisch; keine neuen fehlgeschlagenen Tests.**
- Vite-Produktionskompilierung hier mangels npm-Vite-Abhängigkeit nicht geprüft; bitte nach GitHub-Actions-Deployment kontrollieren.
- Keine D1- oder Tresor-Migration; alle bisherigen Funktionen und Speiseeinträge bleiben erhalten.
