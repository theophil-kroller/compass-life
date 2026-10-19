# Compass 0.5.21 – Calm Workspace

**Basis:** Compass 0.5.20 (Frontend-only, kein neues D1-Schema, keine API-/Worker-Änderung).

## Änderungen

- **Hauptnavigation:** Reduzierte, visuell ruhigere Hauptansicht. Heute, Inbox, Menschen, Finanzen, Wochenreview und Einstellungen direkt; Planen und Insights enthalten kontextsensitive aufklappbare Unteransichten. Gleichzeitig höchstens eine Gruppe geöffnet.
- **Insights:** Fünf sichtbare Bereiche (Gesundheit, Aktivität, Orte, Produktivität, Explore). Gesundheit behält Schlaf, Body Battery, Stress und Körper als wählbare Unteransichten. Datenquellen sind über eine separate Aktion erreichbar. Der sich wiederholende große Hero-Banner wird entfernt.
- **Finanzen:** Fünf primäre Reiter (Überblick, Cashflow, Ausgaben, Prognose, Portfolio); die acht übrigen bisherigen FINANCE_TABS im Menü „Mehr“. Es werden keine Ansichts-IDs gelöscht oder umbenannt.
- **Filter und Aktionen:** Zeitraum, Konto und Datenabdeckung in einer kompakten Leiste. Importieren und offene Zuordnungen stehen oben. Umkategorisieren verbleibt im aufklappbaren Datenabdeckungsbereich. Bankimport und private Regeln bleiben im Datenmanager erreichbar.
- **Navigation merken:** Nur die drei nicht-sensiblen UI-Kennungen für Hauptansicht/Insights/Finance werden in der Browser-Session vorgehalten. Explizite Deep Links (`?view=`) behalten Vorrang. Keine Kontodaten, Gesundheitssamples oder Zugangsschlüssel.
- **Mobile:** Scrollbare primäre Finanznavigation, aufklappbares „Mehr“ und schmale mobile Hauptnavigation ohne Seitenüberbreite.

## Sicherheits- und Abwärtskompatibilitätsregeln

- `financeTransactions`, `healthImports`, private Kategorien, Vault-/Sync-Protokolle, Worker und Android Companion bleiben unverändert.
- Bestehende `data-action`-IDs für Finanzen und Insights werden weiterverwendet, einschließlich `finance-pane`, `insights-tab`, `finance-period`, `finance-account` sowie der lokalen Import- und Reviewfunktionen.
- Keine Cloudflare/D1-Migration erforderlich; vor dem Update verschlüsseltes Vault-Backup erstellen.

## Qualität

- `npm test`: 269/269 bestanden, einschließlich vier neuer 0.5.21-Tests.
- `node --check` für geänderte JS-Module erfolgreich.
- Visuelle Smoke-Prüfung: echtes Chromium auf statischem HTML mit **künstlichen** Finanzdaten bei 1440 × 900 und 390 × 844. Kein horizontaler Document-Overflow auf der Mobilansicht; fünf Haupt- und acht sekundäre Finanzreiter gerendert.
- Grenzen: Vollständiger Vite-Produktionsbuild lokal nicht ausführbar, weil npm-Abhängigkeiten hier nicht offline installiert werden konnten (`ENOTCACHED`). In GitHub Actions `npm install`, `npm run check` und `npm run build` prüfen. Live-PWA-/Vault-Bedienung auf dem Endgerät zusätzlich abnehmen.
