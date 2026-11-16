# Compass Life 0.5.91.50 — Relaxed Control: Deadlines & Mensa

Base: 0.5.91.49.

## Fixes
- Offene GTD-Deadlines bleiben im Tagesbereich **Heute** nach dem Fälligkeitsdatum sichtbar, ausdrücklich auch über Wochenenden hinweg, bis sie erledigt, verschoben oder entfernt werden. Historische Tagesansichten bleiben unverändert.
- **Menü-Recherche** in Heute schaltet beim Klick einmalig in **Extended** um und navigiert direkt zu **Insights → Ernährung → Mensa** (nur ein Render; kein zweiter Klick). Kein zusätzliches Laden oder Netzwerkabrufen beim Öffnen von Heute: das Mensa-Modul wird weiterhin erst bei Navigation zu Insights Ernährung dynamisch importiert.
- Der Mensa-Importer akzeptiert JSON, Markdown-Codeblöcke und kopierte rich-text-Zeilen mit `&#x20;`, Backslash-Zeilenfortsetzung und doppelt escapten Anführungszeichen. Der tatsächliche bereitgestellte GPT-Export für 16.–20. November 2026 wurde erfolgreich mit fünf Menüs geparst.
- Bei einem als offizielles Menü bezeichneten Screenshot ohne verifizierbaren HTTPS-Link wird die Quelle ehrlich als `estimated_from_source` übernommen, statt eine Online-Verifikation vorzutäuschen oder den Import wegen fehlender URL zu blockieren. Kein Eintrag wird automatisch als gegessen gebucht.

## Unverändert
- Bestehendes Lebensmittelmenü, Produkt-IDs, Ernährungstagebuch und alle anderen bestehenden Vault-Daten. Keine Datenmigration.
- Keine neuen Services oder Nachladevorgänge beim regulären Öffnen von Heute.

## Tests
- Gezielte Tests: 5/5.
- Volltest: 2.275 erfolgreich; 66 bekannte Altfehler, keine neuen Fehler gegenüber 0.5.91.49.
- Deployment-Checks: 33/33 erfolgreich.
- Der echte Vite-Produktionsbuild konnte mangels lokal installierter Abhängigkeiten nicht ausgeführt werden; GitHub Actions muss ihn bestätigen.
