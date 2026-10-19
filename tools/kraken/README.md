# Kraken Spot API Connector (Compass 0.5.17.4)

No dependencies beyond Python 3.9+. Run `START_WINDOWS.bat` on Windows or `sh START_MAC_LINUX.sh` on macOS/Linux.

The connector calls ONLY `Balance`, `Ledgers`, and `TradesHistory` on `https://api.kraken.com`; it has no trading or withdrawal code. Create a distinct API key in Kraken Pro with only Query Funds, Query Ledger Entries, and Query Closed Orders & Trades. Do NOT activate any trading, withdrawing, Earn allocation or deposit permissions. If the key has API-specific 2FA enabled, this initial connector does not yet support it. Never paste API credentials in a chat, issue, commit, browser field, or website.

The key and secret are requested in the terminal without echo, used only in process memory and never saved. Connection is directly from your computer to Kraken using HTTPS. The export JSON is saved to your local Downloads folder and **is not encrypted**; after importing it into the unlocked Compass Vault, remove that local plaintext file securely. Compass does not communicate with Kraken itself in this version and never transmits these results to Cloudflare, GitHub, or any external AI.

Latest Spot balances and up to 4,000 Ledger and 4,000 Trade records are retrieved, limited to 80 API pages per collection. Large histories show a partial-import warning. The import is idempotent and merges records by Kraken's stable entry IDs; repeat after exporting more history if required. This is an API data bridge (manual run), not a scheduled automated cloud integration.

Balances are holdings in asset units, not a verified EUR net worth. Earn, staking, futures and external-wallet holdings may be excluded. Kraken ledger entries are not categorized as consumptive bank purchases or salary. Bank-to-Kraken matching requires explicit user review.

## Compass 0.5.17.5: Local Bridge + EUR asset valuation

The new `START_LOCAL_CONNECTOR_WINDOWS.bat` or `START_LOCAL_CONNECTOR_MAC_LINUX.sh`
starts an opt-in local companion bound to `127.0.0.1:18757`. Type your exact
Compass origin (for GitHub Pages this is `https://USERNAME.github.io`, not the
full URL with repository path). Enter the existing read-only Kraken key and
secret in your **local terminal only**. The temporary pairing code is not the
API secret. Paste it into Compass > Finance > Portfolio and click **Jetzt lokal
synchronisieren**. The browser receives only the read-only exported snapshot;
it cannot obtain your Kraken credentials, place trades, or withdraw funds.

An optional setting allows automatic refresh at most every 12 hours **while
Compass is open, unlocked, the Portfolio view is active, and the local helper
is running and paired**. Nothing runs in the background after closing Compass;
no API secrets are stored to disk. Browser Local Network restrictions can
prevent this cross-origin localhost workflow; the `START_WINDOWS.bat` JSON
export remains a supported fallback.

Public Kraken spot EUR quotes (`AssetPairs` + `Ticker`, no API credentials) are
requested by the *local helper*, with a timestamp. Holdings without an
available EUR quote are **not** silently valued at zero. Only wholly priced
snapshots count for historical portfolio-value plots. These prices are
approximate last-traded market observations, not realizable proceeds or
reconstructed historical asset values. Earn, staking, futures, external wallets,
fees and taxes can cause differences from a complete net worth statement.
