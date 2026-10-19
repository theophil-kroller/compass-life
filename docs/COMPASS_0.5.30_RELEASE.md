# Compass 0.5.30 — Finance UX Compact, Flex Budgeting and Optional E2EE Device Mirror

Base version: 0.5.29.

## Finance-first-fold
- Spending-pace comparison is the main chart at the top, ahead of help, imports and Sankey.
- Four compact KPIs and three top spending categories fit in a denser first-fold layout.
- Monarch is an *interaction inspiration*, while existing Compass gauges and charts remain.

## Flex budgets and manual savings goals
- Monthly Fixed and Flexible category budgets; yearly Non-Monthly budgets with monthly reserve equivalent.
- Confirmed consumer spending only. Money transfers and pending transactions do not count as discretionary expenditure.
- Manual saving-goal progress; Compass never fabricates a bank balance from transactional flow.

## Sensitive data device mirror (opt-in)
- Imported bank transactions, rules, corrected merchants, trips, financial planning and manual asset snapshots.
- Imported Garmin/Fitdays history, manual activity edits and manual activity entries.
- Browser-side encryption (AES-256-GCM) with a separate user-defined sync passphrase (PBKDF2-SHA-256/350k).
- Ciphertexts are compressed before encryption when supported; database sees only ciphertext, salt, IV, version, size and updated time.
- Authenticated, owner-scoped Worker route `/api/private-device/{finance|health}`; D1 `0014_private_device_mirror.sql`.
- Optimistic version checking protects against unintended concurrent source writes.
- Primary computer sends; phone reads, decrypts, stores in its encrypted IndexedDB Vault and works offline.
- The read-only receiving device intentionally does not upload conflicting financial corrections.
- Initial setup refuses to silently overwrite existing receiver imports; encrypted Vault backup is advised.
- Manual cloud delete (source device); already-offline secondary copies must be deleted on those devices separately.

## Known limitations / security boundaries
- **This is not zero-configuration sync**: it must be explicitly enabled separately on the computer and phone.
- No bidirectional merging of finance/health edits; use the designated primary device to edit.
- Cloud Worker cannot recover the sync passphrase or plaintext.
- Logged-in service can still observe metadata such as transfer size and time.
- Payloads exceeding the encrypted size cap are rejected with an error, not truncated.
- A successful first Cloudflare/PWA end-to-end live deployment remains to be validated.
- Worker and D1 migration are mandatory for private device sync, unlike 0.5.29.
