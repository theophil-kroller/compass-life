# Compass 0.5.17.4 — Kraken Spot Local API Bridge

- Dedicated **read-only** Kraken Spot connector with verified HMAC-SHA512 signature (simulated request test). `Balance`, `Ledgers`, `TradesHistory` only; uses Python standard library.
- Keys entered locally via hidden terminal prompt and kept out of GitHub Pages/Cloudflare. Kraken API helper sends HTTPS requests directly to Kraken, not through a server proxy. Output is local **unencrypted JSON** in `~/Downloads`, and must be removed after import.
- `Finanzen → Portfolio` provides file selection, validated preview, idempotent local encrypted import, balances in original crypto/fiat units, ledger and trade counts, latest entries, and explicit delete.
- `Wochenreview → Datenquellen` links to Kraken portfolio and reminds the user to re-sync.
- Strict validation: no credentials imported, numeric values must be decimal strings, limits on records and file size, safely escaped descriptions.
- Bank flows and exchange holdings are kept strictly separate. A bank-to-Kraken deposit is not salary and not a new expense.
- New tests cover validation, dedup, security, UI, and key-signing. No live Kraken account could be checked without local credentials.
- **Limitations:** manual local helper, only Spot REST endpoints, max 80 history pages (4,000 records each for ledger/trades), no coin valuation, no automatic balance sync, no Euro net worth, no Earn/Futures/staking coverage guarantee.

## Next product decisions

- Detailed expense attribution `category → subcategory → merchant / beneficiary / purpose` with local editable overlays. Treat general payment processors such as Remitly as **not definitive** proof of specific purpose; explicitly distinguish support vs travel when confirmed.
- Fitdays body composition: stacked **fat + lean mass** is mathematically valid if the reported fat mass is available, but overlapping body water, protein and muscle should remain alternative lines / plots, not summed as disjoint compartments.
- Later fully integrated local Kraken companion can allow browser one-click sync without API secrets traversing the Worker.
