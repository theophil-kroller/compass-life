# Compass Life 0.5.77.55 — Lightning-Fast Today · Focus / Extended

Basis: GitHub `main`, 0.5.77.54, erfolgreicher Workflow #216.

## GTD / „Heute“

- **Gezielter Inspector-Wechsel**: Das Öffnen/Schließen einer Aufgabe ersetzt nur die rechte Inspector-Spalte statt der ganzen App-Oberfläche. Bestehende Editor-/Wiedervorlage-Aktionen werden am neuen Teilbereich wieder gebunden.
- **Sofortige Checkbox-Reaktion**: Beim Abhaken in „Heute“ aktualisieren sich Aufgabenzeile, Häkchen und Tageszähler direkt. Der bereits vorhandene lokale Vault-Speicherpfad läuft anschließend weiter.
- **Sicherer Schnellpfad**: Für die schnelle Änderung wird ein einzelner Aufgaben-Datensatz *ersetzt* statt in-place mutiert. Dadurch bleibt der bisherige schmale Rollback-Checkpoint bei Speicherfehlern korrekt. Bei aktivem Haupt-/Empfangsgeräte-Mirror nutzt die Änderung aus Sicherheitsgründen weiterhin den konservativen Speicherpfad.
- **GTD-Messpunkte**: „Inspector aktualisieren“ und „Checkbox aktualisieren“ können in den vorhandenen optionalen Performance-Einstellungen gemessen werden. Keine Aufgabennamen oder Daten werden aufgezeichnet.

## Navigation

- **Focus / Extended** direkt unter dem Compass-Branding in der Seitenleiste.
- Standard: **Focus** – GTD-Navigation, Heute, Inbox, Planen, Menschen und Wochenreview. Insights/Finanzen und ihre Unterbereiche verschwinden aus der Seitenleiste; Inhalte/Daten bleiben unverändert.
- **Extended** – zusätzlich Insights und Finanzen. Beide werden weiterhin wie in .54 erst beim Öffnen geladen.
- Auswahl wird lokal im Browser als harmlose UI-Präferenz gespeichert; kein Vault-/Worker-Schema geändert.
- Beim Wechsel von Insights/Finanzen zu Focus erfolgt eine Rückkehr nach „Heute“. Alte Deep-Links auf Analysen können Focus nicht umgehen.

## Platzgewinn

- Die redundante globale Kopfzeile mit Seitentitel und Datum entfällt auf allen App-Seiten. Der Seitentitel bleibt für Screenreader unsichtbar erhalten.
- Das ausgewählte Datum bleibt in der bestehenden Tages-/Kalendernavigation von „Heute“ erkennbar.
- Die eigentlichen Arbeitsinhalte beginnen höher im verfügbaren Fenster.

## Kompatibilität & Grenzen

- Vorhandene GTD-Daten, Kalender, Finanz-/Garmin-Importe und PWA-Synchronisation unverändert.
- Änderungen über `compass755-bridge.js` erfolgen streng geprüft nach dem .54-Plugin. Die große `main.js` muss NICHT manuell ersetzt werden.
- Der Cloud-Abgleich kann am Ende weiterhin einen Voll-Render auslösen; dies wird separat als nächster Performance-Schritt überprüft.
- 34/34 lokale Regressionstests bestanden; Syntaxprüfung erfolgreich. Der vollständige `npm run build` auf GitHub muss nach Upload erfolgreich sein.
