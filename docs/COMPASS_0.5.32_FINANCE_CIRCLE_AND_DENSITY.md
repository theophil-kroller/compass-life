# Compass 0.5.32 — Finance compactness and observed circular flows

## UX
Navigation, period selection and filter disclosure share a single desktop row. Category pattern cards use a 4/3/2/1 responsive mini-card grid and a compressed SVG reference scale. Drilldown into the existing category detail view remains available; the larger financial charts are not deleted.

## New circular chart
Accessible via **Finanzen → Mehr → Geldkreislauf**, with a link from **Cashflow**. A bespoke local SVG chord renderer uses only transaction metadata already present in the encrypted Vault. It draws confirmed account-to-account transfer pairs once, and categorised one-sided negative transfers to named investment destinations. The latter are dashed and labelled differently. Clicking an SVG ribbon or its corresponding accessible button opens exact underlying transaction rows; keyboard Enter/Space works on chart ribbons.

## Accounting integrity
No implied opening/closing balances, source-to-spend narratives, fictitious returns, closed loops, or double-counted flatex/Kraken portfolio balances. Portfolio snapshots, when present, are shown in a distinct summary with explicit date/coverage limits. A time filter can exclude one counterpart of a paired transfer at the interval boundary; do not infer one never existed.

## Verification
372/372 Node automated tests pass. Browser headless screenshot attempt was inconclusive due to Chromium startup failure in the evaluation environment. No complete Vite build as dependencies aren't provisioned; CI production build still required.
