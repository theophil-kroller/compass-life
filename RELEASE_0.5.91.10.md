# Compass 0.5.91.10 · Mohnkuchen mit Schokolade & Basmatireis mit Linsendal/Brokkoli

**Ausgangsbasis:** GitHub `theophil-kroller/compass-life` auf `main`, Compass **0.5.91.9**, Commit `b836076c505f9f175715912cf997e8ee734bff49`, geprüft am 2. November 2026. Keine Änderungen an bestehenden verschlüsselten Ernährungsdaten und kein automatisches Nachtragen von Mahlzeiten.

## Zwei neue Speisen im bestehenden Menü

### Snacks: Selbstgebackener Mohnkuchen mit Schokolade

- ID: `homemade-poppy-cake-chocolate-personal`; 1 Stück: **7 × 6 × 4 cm** (Volumen ~168 cm³). Ohne gewogenes Gewicht werden **140 g** als hypothetische Ausgangsmenge angenommen: 125 g Kuchenbasis und 15 g Schokolade/Glasur. Diese Trennung ist ein Berechnungsproxy, **keine behauptete Kenntnis des tatsächlichen Backrezepts**.
- Schätzung: **573 kcal**, Eiweiß **8,7 g**, Kohlenhydrate **55,3 g** (davon Zucker **35,8 g**), Fett **36,1 g** (gesättigt **10,1 g**), Ballaststoffe **4,8 g**.
- Nur grobe, selektive **Mikronährstoff-Schätzungen**, z. B. Calcium **150 mg**, Magnesium **90 mg**, Eisen **2,1 mg**, Phosphor **163 mg**. Diese Mikronährstoffe sind ohne Mengenangaben zu Mohn, Mehl, Eiern und Schokolade **sehr unsicher**, andere nicht erfasste Mikronährstoffe bleiben *unbekannt* (nicht null).
- Daily Dozen: Mohn ist prinzipiell ein Samen, aber die tatsächliche Mohnmenge ist nicht bekannt; daher **keine automatische Nüsse-/Samenportion**, keine Vollkorn- oder Obstportion. Anti-Aging Eight: nur dokumentierte Lebensmittel-/Makro-Daten, **kein vermeintlicher Anti-Aging-Score** oder behaupteter Effekt der Schokolade.
- Mit dem Zutateneditor lassen sich die angenommene Kuchenbasis und die Schokoladenschicht einzeln ändern. Falls das Originalrezept oder Gewicht später vorliegen, muss dieses Referenzprofil entsprechend präzisiert werden.

### Mahlzeiten: Weißer Basmatireis mit Linsendal, Curry und Brokkoli

- ID: `basmati-lentil-dal-broccoli-personal`; 1 Portion = **ein flacher Suppenteller**, ungefähr **440 g**: 170 g weißer *gekochter* Basmatireis, 160 g *gekochte* Linsen, 100 g gekochter Brokkoli, 8 g Öl, 2 g Currygewürze und 1 g Salz. Unbekannte Dal-Flüssigkeit und Saucenanteile sind nicht gesondert gewogen.
- Schätzung: **519 kcal**, Eiweiß **21,7 g**, Kohlenhydrate **88,4 g**, Fett **9,8 g**, Ballaststoffe **17,3 g**.
- Geschätzte Mikronährstoffe: Folat **403 µg**, Vitamin C **65 mg**, Vitamin B6 **0,64 mg**, Eisen **6,5 mg**, Magnesium **103 mg**, Kalium **943 mg**, Calcium **87 mg**, Zink **3,3 mg**. **Vitamin C und andere hitzeempfindliche Nährstoffe** variieren mit der Garzeit. Nicht quantifiziert: Sulforaphan, Curcumin, tatsächliche Postbiotika, NAD+.
- Daily Dozen: aus *dokumentierter Mahlzeit mit geschätzten Zutaten*: Linsen **ca. 1,78 Hülsenfruchtportionen**, Brokkoli **1,25 geschätzte Kreuzblütler-Teilportionen**, Currypulver **1 Gewürzportion** in der vorhandenen Nachweislogik. Der weiße Basmatireis **zählt nicht** als Vollkorn. Bestehende manuelle Bestätigungen behalten Vorrang.
- Anti-Aging Eight: Brokkoli/Kreuzblütler als Ernährungskategorie und Linsen/Ballaststoffe als *indirekte* präbiotische Indikatoren; **keine direkte Messung von Altern, Mikrobiom, Sulforaphan oder Postbiotika**.
- Editierbare Einzelgewichte in bestehenden Rezept-Eingabefeldern; zweite Portion über `2 Portionen` oder `2 Teller` skaliert, ohne neue Datenbank oder Duplikate.

## Evidenz und methodische Grenzen

Generische Lebensmitteldaten orientieren sich an USDA FoodData Central: gekochte Linsen FDC 172421, Brokkoli FDC 169967, weißer (nicht angereicherter) gekochter Reis analog FDC 20445. Sowie generische Öl- und Currypulverwerte. Offizielle Daily-Dozen-Gruppen und Portionsbeispiele: https://nutritionfacts.org/daily-dozen/ .

Beispielhafte Referenzseiten:
- https://www.logixpathchef.com/app/food/getfoodnutrition?fdcid=172421
- https://www.logixpathchef.com/app/food/getfoodnutrition?fdcid=169967
- https://www.cooks.com/rec/nutrition?nwal=20445

Der Mohnkuchen ist ausdrücklich eine **Küchen-/Portionsannahme** ohne Originalrezept, kein validierter Nährstoffdatensatz. Mengen, Sorte, Backverfahren und Glasurdicke können die Nährstoffe stark verändern. Das Gericht ist als Auswahl im Menü vorhanden, aber nicht bereits gegessen oder ins Tagebuch gebucht.

## Qualitätssicherung

- Neue Tests: **9/9** (Menü, kcal/Makros/Mikros, Kennzeichnung fehlender Werte, Zutatenänderungen, Daily Dozen, Anti-Aging, Portionen, Alt-Rezepte, keine automatische Erfassung).
- `npm run check:deploy`: **33/33** (Importgraph, Worker-Check und Release-Tests).
- `npm test`: **1.954/1.989 bestanden**; genau dieselben **35 historischen Fehler** wie im unveränderten Basispaket 0.5.91.9 (1.945/1.980), **keine neuen Regressionen**.
- `npm run build` ist mangels installierter Dependencies nicht möglich (`vite: not found`); daher wurde **kein produktives Vite-Bundle** lokal gebaut. GitHub Actions muss den Produktionsbuild nach Upload bestätigen.
