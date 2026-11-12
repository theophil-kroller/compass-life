# Compass Life 0.5.91.39 · Muskelkarte über Mitternacht & HOFER Laugenbreze mit Butter

Baseline: GitHub `main` commit `0ad17396307c23f28c8c47de28bef03f4d01b596` (0.5.91.38). Keine Repository-Schreibaktion.

## Muskelkarte
- Heutige primäre Muskelbeanspruchung: kräftiges Rot `#ed4b42`.
- Gestern dokumentierte primäre/sekundäre Beanspruchung: gedämpftes Rot `#bc7474`.
- Heute unterstützend: Gelb; heute nur stabilisierend: Türkis; 2–7 Tage vorher: Orange.
- Ein Muskel, der an beiden Tagen trainiert wurde, zeigt den heutigen Rollen-Farbton. Die historische Information bleibt im Datenmodell erhalten.
- Sets über Mitternacht werden über den vorhandenen Set-Tag-Mechanismus beiden lokalen Kalendertagen zugeordnet; kein Überschreiben des Session-Starts.
- Tooltip und Legende unterscheiden gestern von den vorigen Tagen.

## Ernährung
- Neuer Snack: **HOFER BACKBOX Laugenbreze mit Butter**, Standard 95 g Breze + 10 g Butter, beides editierbar.
- Pro Standardportion ~372 kcal, ~8.1 g Protein, ~53.9 g Kohlenhydrate, ~13.1 g Fett und ~1.7 g Salz (Schätzung). Butteranteil über den vorhandenen Butter-HOFER-Referenzdatensatz.
- Laugenbrezen-Werte aus *unbestätigten* FDDB-Community-Referenzdaten, **nicht** HOFER-Herstelleretikett. Andere Mikronährstoffe bewusst unbekannt statt Null. Keine unbelegte Vollkorn-/Anti-Aging-Portion.

## Pakete
- Patch enthält nur geänderte/neu ergänzte Quell- und Testdateien.
- Full Source enthält den gesamten Quellbaum ohne `node_modules`, `dist`, Vaults, Zugangsdaten, persönliche Daten oder Git-Metadaten.
- Empfohlene Validierung nach Installation: `npm ci` (bei vorhandenem Lockfile), `npm run build`, `npm test`, `npm run check:deploy`.
