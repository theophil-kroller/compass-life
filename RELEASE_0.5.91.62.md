# Compass Life 0.5.91.62 – REALMIX Ube Latte im Getränkemenü

## Umfang

Basis: originaler GitHub-Stand 0.5.91.61, Commit `1aaff79d5681b35cc81295575e68d68d63d10599`. Additive Ergänzung zu Getränken mit stabiler ID `realmix-ube-latte-stick-16g`. Keine Änderung bestehender Einträge, keine Vault- oder D1-Migration.

## Makros pro 1 Stick (16 g Pulver), Originaletikett 19.11.2026

| Kennzahl | je 100 g | je 16 g |
|---|---:|---:|
| Energie | 503 kcal | 80,48 kcal (Anzeige 80) |
| Fett | 27 g | 4,32 g |
| Gesättigte Fettsäuren | 26 g | 4,16 g |
| Kohlenhydrate | 66 g | 10,56 g |
| Zucker | 50 g | 8,00 g |
| Ballaststoffe | 0,56 g | 0,0896 g |
| Eiweiß | 3,0 g | 0,48 g |
| Salz | 0,08 g | 0,0128 g |

- Zutaten: Zucker, Kokosmilchpulver, violette Süßkartoffel 7 % (1,12 g/Stick), Maltodextrin, E551, E1450; vegan; mögliche Spuren Gluten, Soja, Milch.
- Mikronährstoffe: auf Etikett **nicht angegeben**, daher nicht erfunden und nicht als Nullwerte gezählt. Anthocyane ebenfalls nicht quantifiziert.
- Daily Dozen: keine Gemüseportion aufgrund 1,12 g Süßkartoffelpulver; kein ungesüßtes Getränk.
- Anti-Aging Eight: keine Wirkungs-/Portionsgutschrift.
- Mit Wasser gerechnet. Milch / Barista-Drink / Honig separat protokollieren.

## Tests / Installation

Neue Unit-Tests prüfen Menü, Suche, Kategorie, Portion, Makros, ungemessene Mikros, Daily Dozen und Anti-Aging Eight. `PATCH_INSTALL_0.5.91.62.md` enthält Installation.

## Verifizierung in dieser Arbeitsumgebung

- Produktspezifischer Regressionstest + ältere Food-Tests: **10/10 bestanden**.
- Gesamttest Basis 0.5.91.61: 2.419 Tests, 2.352 bestanden, **67 bereits vorhandene Fehler**.
- Gesamttest 0.5.91.62: 2.423 Tests, 2.356 bestanden, **dieselben 67 Fehler**; keine neuen fehlgeschlagenen Testfälle.
- JavaScript-Syntaxchecks der geänderten Module: bestanden.
- Importgraph: **310 Module**, keine fehlenden relativen Imports.
- Vite-Produktionskompilierung: **nicht geprüft**, da `vite` im lokalen Container nicht installiert ist. GitHub-Actions-`Deploy Compass Web` nach Upload prüfen.
- Windows Outlook-COM-Betrieb / Live-Vault: nicht vor Ort getestet. Outlook-Bridge unverändert.
