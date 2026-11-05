# Compass Life 0.5.91.23 – BRAINEFFECT C8 MCT Oil (1 EL)

**Base:** Compass 0.5.91.22. New stable food ID: `braineffect-mct-c8-oil`.

- `Zutaten` menu entry: **BRAINEFFECT MCT C8 Öl**, default `1 EL (15 ml ≈ 14 g)`.
- Manufacturer source: https://brain-effect.com/de-eu/products/rocket-c8-mct-oel; 900 kcal, 100 g fat and 100 g saturated fat per 100 g, 0 g protein/carbs/sugar/fiber/salt. >97 % caprylic acid (C8) in fatty-acid profile, not 97% of the oil mass.
- Portion density assumption: 14 g per 15 ml. Therefore default 126 kcal, 14 g total/saturated fat. Volume measures are estimates, not manufacturer-verified gram portions.
- Dose parser supports e.g. `0,5 EL`, `1 EL`, `2 EL`, `1 TL`, `15 ml`, `28 g`; any malformed input stays unknown. One code path serves energy and macro calculations.
- Micronutrients not quantified; unknown never reported as 0. Daily Dozen and Anti-Aging Eight receive no direct credit. In fat quality overview, C8 is distinguished from omega oils.
- Added product detail, source and fasting/tolerance caveats. No historical meal entries changed. Existing Matcha recipe remains unchanged: log MCT as its own ingredient.
- This is a complete source archive; GitHub Actions must perform and verify a production deployment.
