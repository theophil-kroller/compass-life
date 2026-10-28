# Compass Web 0.5.77.59.40.16 — Essen: Apfelkuchen und Glas Wasser

Basis: Version 0.5.77.59.40.15. Zwei dauerhafte Kacheln im normalen Nutrition-Capture; keine Sonderbuttons.

- 🍰 **Apfelkuchen mit Mürbteig**, Gruppe Snacks, 1 Stück (125 g, geschätzt). Die amtliche BLS-Referenz für gedeckten Apfelkuchen mit Mürbeteig ist 219 kcal/100 g; daraus ca. 274 kcal pro angenommenem Stück. Der Menü-Kalorienbereich 230–350 kcal pro Portion berücksichtigt Portions-/Rezeptunsicherheit. Etwaige Mikro-Nährstoffe werden nicht ohne Daten als Null ausgegeben.
- 💧 **Wasser**, Gruppe Getränke, 1 Glas (250 ml), 0 kcal. Im Dot Plot als Getränk und ohne Essens-/Fastenereignis erfasst. In Daily Dozen als Getränkemenge berücksichtigt (250/350 Portion in der quellenbezogenen Ledger-Ansicht).
- Wiederholtes Tippen erstellt jeweils einen eigenen Zeitstempel im vorhandenen verschlüsselten Ernährungstagebuch. Portionen im Tagebuch änderbar, auch rückwirkend.
- Keine DB-Migration / kein Worker-Update; nicht in Garmin geändert.

**Installation:** Patch in Repository-Stammverzeichnis entpacken, relative Verzeichnisse behalten, bestehende Dateien ersetzen, git commit und GitHub Pages Deploy; die Full Source ist eine Alternative zum Patch, nicht zusätzlich installieren. Browser/PWA nach Deploy neu laden.

**Quellen:** Bundeslebensmittelschlüssel 4.0, Apfelkuchen gedeckt (Mürbeteig), Code D181300, 219 kcal/100 g: https://blsdb.prod.se.ble.de/food?foodId=39276 . Nährwerte und Portionen sind Schätzungen, kein abgewogenes Nutzerprodukt.
