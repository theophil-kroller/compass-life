# Compass Web 0.5.77.59.40.22 — Ars Vivendi Report Atlas

Base: 0.5.77.59.40.21. No data migrations.

- Reuses the detailed installed `body-muscles` anatomy path library from the Compass premium strength UI for the report, loading it before the popup document is written. The source is embedded as static SVG for offline printing. If unavailable, a labeled regional SVG fallback is used; never a loading indicator.
- Financial category atlas with absolute category totals and precise percentages, subcategory ledger and top merchant ledger (only confirmed expenses). Existing detailed Sankey, Sunburst, Streamgraph retained; radial category flow and Voronoi added.
- Additional verified findings on workweek load, expense share, measured body change and Daily Dozen documentation coverage.
- Print styles for anatomies, full-width category graphics and data tables. Independent privacy opt-in remains.

QA: run `node --test tests/*.test.mjs`, tests/compass-0577594022-annual-atlas.test.mjs, browser smoke print with real-like large dataset. Production Vite build remains to be confirmed in CI if dependencies not installed.
