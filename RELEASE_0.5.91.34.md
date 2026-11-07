# Compass Life 0.5.91.34 – Dr. Goerg Kokosmilch & Copaya Rohkakao

Ausgangsstand: **0.5.91.33**, unveränderte Vorlage aus der Full Source 0.5.91.33.

## Neue Einträge im Essensmenü

1. **Dr. Goerg Bio-Kokosmilch (100 % Kokos)** – Zutat mit Standardportion **100 ml**; eine 200-ml-Packung ergibt zwei Portionen. Etikett je 100 ml: 186 kcal, 17 g Fett, 14 g gesättigte Fettsäuren, 5,8 g KH, 3 g Zucker, 2,1 g Protein, 0,05 g Salz. Eingaben `50 ml`, `100 ml`, `150 ml`, `200 ml`, `1 Portion`, `2 Portionen`, `1 Packung` usw. sind proportional berechenbar.
2. **Copaya Bio-Rohkakaopulver (Criollo)** – Zutat mit Standardportion **1 gestrichener EL ≈ 6 g** (angenommene Grammmenge, bei Bedarf durch tatsächlich abgewogene Menge ersetzen). Etikett je 100 g: 330 kcal, 11 g Fett, 6,9 g gesättigte Fettsäuren, 14 g KH, 0,3 g Zucker, 28,1 g Protein und 0,1 g Salz. 1 EL ≈ 20 kcal, 2 EL ≈ 40 kcal. Freie Grammwerte möglich.

Makros nach den vom Nutzer fotografierten Produktetiketten. Die nicht deklarierten Mineralstoffe für Kokosmilch und die Ballaststoff-/Mineralstoffschätzungen für Kakao basieren auf generischen Referenzprofilen und sind im Produktprofil als **geschätzt** ausgezeichnet. Fehlt eine Vitaminangabe, bleibt sie unbekannt statt auf null gesetzt. Die Menge an Kakao-Flavanolen, Theobromin und Koffein ist nicht deklariert und daher *nicht quantifiziert*.

## Dr. Greger / Anti-Aging Eight

Reine Kokosmilch und Kakaopulver erhalten *keine automatische* Daily-Dozen-Gutschrift als Hülsenfrüchte, Nüsse, Samen, Gewürze oder Wasser. Die Pflanzenstoffe des Kakaos sind qualitativ dokumentiert; Wirkungen auf microRNA oder NAD+ sind nicht messbar und werden nicht behauptet. Die Makros erscheinen korrekt in Protein- und Fettqualitätsauswertungen.

## Hinweise

Die Copaya-Packung auf dem Foto trägt augenscheinlich ein Mindesthaltbarkeitsdatum **01.04.2025**. Vor dem Verzehr Lagerbedingungen, Geruch und Zustand prüfen; Mindesthaltbarkeit bedeutet nicht automatisch gesundheitsschädlich, ist aber deutlich überschritten. Dies betrifft nur die Prüfung des realen Produkts, nicht die Nährwert-Datenbank.

Die Produkte werden dem Katalog hinzugefügt, **nicht als gegessen protokolliert**. Vorhandene Einträge werden nicht verändert.

## Tests

- Neue Mengen- und Mikronährstoff-Regressionstests: 8/8 bestanden.
- Kombinierte Ernährungs-Kompatibilität: 57/59 bestanden; die 2 alten Fehler reproduzieren sich unverändert auf 0.5.91.33.
- `npm run check:deploy`: 33/33 bestanden.
- ZIP-CRC und exakte Patch-Rekonstruktion werden beim Packen geprüft.
- Kein lokaler Vite-Produktionsbuild (npm-Abhängigkeiten sind nicht installiert); Produktionsbuild muss GitHub Actions bestätigen.
