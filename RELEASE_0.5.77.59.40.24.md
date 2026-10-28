# Compass Web 0.5.77.59.40.24 — Ars Vivendi Knowledge Edition

## Editorial research
Original German knowledge passages in a fixed, versioned source catalog. Nutrition draws primarily on [NutritionFacts.org](https://nutritionfacts.org/) (Dr. Michael Greger); European reference quantities are explicitly identified as EFSA population guidance, not personalized medical targets. Financial literacy is separately sourced from Eurostat and CFPB.

## Personalized editorial spreads
- Fat classes: saturated, monounsaturated, polyunsaturated, trans fats; partial recorded totals and **coverage/estimated status**.
- Essential fats: ALA versus EPA/DHA and omega-6, including Greger's algae guidance without an unvalidated deficiency diagnosis.
- Water: EFSA adequate *total* water versus Daily Dozen 355-ml drinks; volume totals only for documented glasses.
- Nutrients: B12, D, calcium, iron, iodine, vitamin C, fibre; actual partial sums and how many journal days contain known values.
- Matcha, catechins and antioxidants: observed manufacturer minimum values distinct from true analyses; no fictitious antioxidant score.
- Fitdays body fat: why no single universal ideal percentage and why standardized BIA measurement conditions matter.
- Finance (explicit opt-in): categories/amounts, Eurostat 40% statistical housing-overburden definition, CFPB 50/30/20 *heuristic*, housing-to-classified-income only when income exists; transfers are excluded from consumer spending and are not interpreted as an investment quota.

## Security and methodology
All personal measurements remain within the unlocked local Compass browser. Public scientific references are static HTTPS hyperlinks in generated PDF/HTML, no runtime data transfer. When logs are sparse, the report does not annualize them or present missing nutrients as zero. Any local AI narrative remains subordinate to evidence.

## QA
Node regression suite, 69-stage build-transform chain, sample A4 layout/PDF pass where available; full Vite and real Windows printing require deployment-side verification.
