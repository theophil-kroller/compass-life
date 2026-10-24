# Compass 0.5.77.44 – GitHub-Upload

**Voraussetzung:** 0.5.77.43 ist im Repository installiert (erfolgreicher GitHub-Lauf #204).

**Geänderte Dateien mit exakter Pfadstruktur hochladen:**

- `client/vite.config.js` – ersetzen
- `client/compass744-bridge.js` – neu
- `client/src/receipt-gpt-v57743.js` – ersetzen
- `client/src/receipt-gpt-v57743.css` – ersetzen
- `tests/compass-057743-dream-receipts.test.mjs` – ersetzen
- `tests/compass-057744-fixes.test.mjs` – neu

`KASSENBON_GPT_PROMPT.txt` und `CHANGELOG_0.5.77.44.md` sind optionale Informationsdateien.

Nach Upload GitHub Actions prüfen, erst danach die App öffnen / ggf. auf Handy neu starten. App-Version sollte **0.5.77.44** anzeigen.

**Praxistest:**

1. Mit entsperrtem Tresor auf 🌙 in der Titelleiste tippen: Traumwelt öffnet sich, Eingabefeld wird fokussiert.
2. Den Einkaufswagen anklicken, auch wenn keine Einkaufsliste aktiv ist: Einkaufslisten und Kassenbons sind erreichbar.
3. GPT-JSON mit zwei `compass_receipt_v1`-Objekten in einem Array einfügen. Die Vorschau zeigt beide Bonpositionen getrennt, anschließend gemeinsam bestätigen.
4. Gleichen JSON-Block erneut importieren: Es werden keine weiteren Bonbuchungen angelegt.

Das Paket enthält KEINE persönlichen Bons. Der separate nutzerspezifische JSON-Download wird nicht automatisch ins GitHub-Repository veröffentlicht.
