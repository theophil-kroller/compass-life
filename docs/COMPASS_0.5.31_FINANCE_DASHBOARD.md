# Compass 0.5.31 — Finance information density

## Goal
Display finance insight on first fold, not empty framing and repeated metadata. Keep actionable accounting controls and Sankey drill-down available.

## Layout
1. Leading **Spending Pace** comparison + 4 compact KPI values and top expense categories (0.5.30).
2. Second row: **Monthly trend** (only months with recorded transactions) and **5 recent transactions** (shows genuine review status).
3. Third row: **Configured budgets/goals** and **personally confirmed recurring charges**. No synthetic goals, fabricated account balances or future payment due dates.
4. Further analyses via disclosures and specialist tabs.

## Accounting constraints
- Categories represent confirmed expenses, with transfers/cash excluded from consumption.
- Pending transactions are not silently included in consumption.
- Missing months are omitted from monthly mini bars, never treated as proof of zero expenses.
- For recurring transactions, average is descriptive rather than future payment forecast.
- For selected accounts the cross-account budget does not pretend to be account specific.
- Labels and merchant names are HTML-escaped.

## Verification
`npm test` (366 passing), `npm run check` passing. Production Vite bundle and live PWA visual QA not executed in environment lacking Vite installation.
