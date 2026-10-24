# Compass Life 0.5.77.57 — Mobile Workflow & Shopping-first

Grundlage: erfolgreicher GitHub Pages Build #220, Compass 0.5.77.56.

- Globaler Focus/Extended Zielscheiben-Schalter befindet sich **rechts in der Desktop-Toolbar** beziehungsweise **oben rechts beim Compass-Brand auf Mobile**. Kein zusätzlicher Sidebar-Block.
- Mobile Primärnavigation nutzt nur Symbole. Beschriftungen bleiben für Screenreader vorhanden; Inbox-Zähler bleibt sichtbar.
- Der vorhandene Schnellzugriff **Berührung & Nähe** bleibt auf Mobile und auch in Focus verfügbar, genauso wie Gefühle, Ernährung, Arbeitszeit und Habits. Keine neuen Capture-Pfade.
- Einkaufen hat zwei Untertabs: **Einkaufsliste** (immer zuerst, abhaken ohne Ausgabenanalyse) und **Statistik & Rechnungsimport** (Berechnung erst beim Öffnen). Der Rechnungsknopf führt zum bestehenden Smart Import Hub.
- Statistik zählt ausschließlich im laufenden Monat als Lebensmittel/Einkauf klassifizierte Ausgaben; ohne fehlende/ungeklärte/transfers zu erfinden.
- Kein Vault-, D1-, Worker- oder Datenschemawechsel.

QA: siehe beigefügte lokale Smoke-Tests. Der komplette Vite-Produktionsbuild kann erst im GitHub-Actions-Lauf bestätigt werden.
