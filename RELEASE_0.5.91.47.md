# Compass Life 0.5.91.47 · Two photographed high-protein cup foods

**Baseline:** Compass Life 0.5.91.46. No existing vault records or schema are modified.

## Added to nutrition menu (Snacks)

1. **Ehrmann High Protein Vegan Chocolate Flavour Pudding**, **200 g = 1 Becher**. Label per 100 g: 75 kcal; protein 10 g; carbohydrates 2.5 g (sugars 0.2 g); fat 2.5 g (saturates 2.1 g); fibre 1.3 g; salt 0.25 g. Per whole cup: **150 kcal and 20 g protein**.
2. **SPAR Natur*pur Bio-Skyr Mango-Maracuja**, **400 g = 1 Becher** (user-confirmed). Label per 100 g: 72 kcal; protein 9 g; carbohydrate 8.4 g (sugars 6.6 g); salt 0.10 g. Per whole cup: **288 kcal and 36 g protein**. The label reports fat <0.5 g, saturates <0.1 g and fibre <0.5 g per 100 g: these are upper limits, NOT numeric zeroes or exact measurements. Undeclared vitamins and minerals remain unknown.

## Integration

- Both foods use unique, stable food IDs. No duplicate or overwrite of earlier Ehrmann Skyr / Alpro / Milsani presets.
- Default serving **1 Becher** uses the full package weight for each product. Explicit `0,5 Becher`, `2 Becher`, or gram amounts work and scale both calories and macros.
- Shared food profiles power Daily Nutrition, Nutrient Trends and the V-Taper Nutrition Coach's concrete product suggestions.
- No automatic logging, no new supplement or fruit-portion credit, and no fabricated micronutrients or anti-aging benefits.

## Verification (2026-11-12)

- New + related focused tests: **18/18 passed**.
- `npm run check:deploy`: **33/33 tests passed**, import graph **296 modules**, worker syntax validation passed.
- Full test suite: **not completed** in this environment despite two attempts; a 120-second run and a bounded-concurrency run both exceeded time limits. Existing baseline has 66 known failures; no new-failure count can honestly be verified from an unfinished test run.
- Vite production compilation was not confirmed locally (dependencies unavailable). GitHub Actions should confirm production bundling after upload.
