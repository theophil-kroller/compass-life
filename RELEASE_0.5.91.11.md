# Compass 0.5.91.11 · IronMaxx Proteinshake (Mixed Berries)

Basis: GitHub main 0.5.91.10, Commit `f8d3b33971f3e32a078455209466c2e0b055cf82`.

## Neuer Menüeintrag

- `IronMaxx 100% Vegan Protein Zero · Mixed Berries (Shake)` unter **Getränke**.
- Voreinstellung: 1 Glas aus **30 g Pulver und 300 ml Wasser**; Grammangaben beider Bestandteile im bestehenden Inspector editierbar. Die Flüssigkeit ist nur Wasser, keine zusätzlich angenommene Milch.
- Originalfotos des Nutzeretiketts vom 02.11.2026: **119 kcal, 22 g Protein, 1,4 g Kohlenhydrate, 2,4 g Fett, 0,4 g gesättigte Fettsäuren, 1,3 g Salz** je 30 g Pulver. Zucker **<0,5 g** wurde nicht als genauer Null- oder Mittelwert modelliert, Ballaststoffe sind nicht deklariert.
- Natrium ca. 520 mg aus 1,3 g Salz multipliziert mit 0,4. Wird als berechnet/geschätzt angezeigt, nicht als Etikettmesswert. Andere Mikronährstoffe und Vitamine fehlen auf dem gezeigten Nährwertetikett; keine erfundenen Angaben.
- Die 100-g- und 30-g-Etikettwerte sind leicht unterschiedlich gerundet; zum Skalieren wird die 30-g-Portion als Ausgangswert verwendet. Bei anderen Pulvergrammzahlen werden die Etikettangaben proportional hoch- oder heruntergerechnet.
- **Daily Dozen:** Wasseranteil = dokumentiertes Getränk (`ml≈g`), keine Beeren-, Hülsenfrucht-, Vollkorn- oder Nussportion aus dem Proteinpulver bzw. Aromageschmack.
- **Anti-Aging Eight:** 22 g dokumentiertes Protein erscheinen im Proteinprotokoll, ohne einen nachgewiesenen Anti-Aging-Effekt oder eine Proteinrestriktion zu behaupten.
- Der Eintrag wird erst beim Anklicken ins verschlüsselte Tagebuch geschrieben. Vorhandene Einträge bleiben unverändert; keine Migration.

## Prüfungen

- Tests für Etikettwerte, unbekannte Mikros, Natrium, Mengenanpassung, Getränkezuordnung und fehlende automatische Frucht-/Beerenzuordnung.
- `npm run check:deploy` und `npm test` werden im nächsten Schritt geprüft; Vite-Produktionbuild nur bei installierten Abhängigkeiten.
