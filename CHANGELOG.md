# 0.5.77.59 – Insights visual consolidation

Pure CSS. A single calm, Apple-inspired interface language across the already established 5 Insights groups. No new data source, no change to user actions, chart points, tooltips, source legends, vault, or sync.

### Why this uses the existing last stylesheet

Recent Vite-bridge transforms failed because of brittle text anchors. This patch adds only scoped CSS to the last already imported stylesheet; it changes no JS execution, version tests, or Vite plugin ordering. Its source comments clearly delimit the new Insights rules for eventual architectural consolidation.
