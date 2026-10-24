# Compass 0.5.77.43 – GitHub-Upload

**Voraussetzung: Compass 0.5.77.42 im Repository, GitHub Actions erfolgreich.**

1. Bitte zuerst ein **verschlüsseltes Vault-Backup** anfertigen, vor allem vom Desktop mit den bereits klassifizierten Garmin-Kraftübungen.
2. ZIP entpacken und die unten genannten Dateien unter exakt denselben Pfaden im Repository hochladen.
3. `client/vite.config.js` ersetzen. Die bestehenden `.41`/`.42`-Module NICHT löschen oder mit früheren Fassungen überschreiben.
4. Unter GitHub Actions den Workflow **Deploy Compass Web** prüfen.
5. Auf beiden Geräten die gleiche Version **0.5.77.43** verwenden; Vault entsperren und den verschlüsselten Geräteabgleich verbunden lassen.
6. Nach dem Wiederöffnen der App wird der E2EE-Journalabgleich selbstständig ausgelöst. Die manuelle Schaltfläche bleibt als Fehlerbehebung bestehen.

## Neu/ersetzt

- `client/compass743-bridge.js` (**neu**)
- `client/src/dream-journal-v57743.js` (**neu**)
- `client/src/dream-journal-v57743.css` (**neu**)
- `client/src/receipt-gpt-v57743.js` (**neu**)
- `client/src/receipt-gpt-v57743.css` (**neu**)
- `client/vite.config.js` (**ersetzen**)
- `tests/compass-057743-bridge-integration.test.mjs` (**neu**)
- `tests/compass-057743-dream-receipts.test.mjs` (**neu**)

## Nachprüfen

- Unter Insights: Traumwelt öffnen, Nachttraum speichern, auf einem zweiten Gerät nach dem Öffnen nachsehen.
- Eine vorher am Desktop klassifizierte Garmin-Kraftaktivität auf dem Handy öffnen. Bei verbundenem Geräteabgleich sollen die manuellen Übungsnamen/Gewichte erscheinen.
- Einkaufsliste öffnen: Bereich „Kassenbons“; Prompt kopieren, Beispielbon in ChatGPT auslesen lassen, JSON einfügen, Vorschau prüfen, bestätigen.
- Derselbe Bon darf nicht zweimal importierbar sein.
- Im Monatsüberblick gelten Kassenbonpositionen als **gekauft**, nicht als gegessen.

Bei fehlender E2EE-Verbindung werden Einträge weiterhin **nur im lokalen Vault** gespeichert; die App überträgt sie nicht unverschlüsselt.
