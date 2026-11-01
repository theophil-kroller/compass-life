# Compass Life 0.5.91.6 · Sicherer Duplikatabgleich für Bankimporte

**Ausgangsbasis:** 0.5.91.5, GitHub `5987fe27856f94e545f22ea1d6dc9e412ecde37d` (`main`, geprüft 2026-11-01). Keine Änderung am verschlüsselten Vault-Schema und keine irreversible Löschung.

## Fehlerursache

Die bisherige Duplikatprüfung verließ sich hauptsächlich auf `transaction.id`. Raiffeisen erzeugt diesen Identifikator als Hash aus allen CSV-Feldern. Sprachlich verschieden aufbereitete Belegtexte (etwa `Client: … Purpose of use: Lohn/Gehalt …` gegenüber `Auftraggeber: … Verwendungszweck: Lohn/Geha …`) erzeugen verschiedene Hashes für dieselbe Bankbuchung. So wurde derselbe Gehaltseingang von 2.609,51 € am selben Tag doppelt angezeigt und in den Geldfluss eingerechnet.

## Umsetzung

- Der neue Modul `finance-duplicate-guard-v05916.js` bildet zusätzlich einen konservativen, sprachunabhängigen **wirtschaftlichen Fingerabdruck** aus Konto, Buchungstag, Centbetrag, Währung, eindeutigem Referenzkennzeichen und normalisiertem Zahlungspartner.
- Das entspricht ausdrücklich **nicht** einer unsicheren Regel `gleicher Tag + gleicher Betrag = Dublette`. Unterschiedliche Konten, andere Referenznummern, andere Monate und unzureichend belegte Wiederholungen werden nicht automatisch zusammengefasst.
- Die Importvorschau prüft sowohl gegen vorhandene Vault-Daten als auch mehrere gleichzeitig importierte Dateien. Beim **finalen Bestätigen** wird der aktuelle Vault nochmals geprüft (Race-/Synchronisationsschutz).
- Bereits importierte, eindeutig erkannte Dubletten erscheinen in einem neuen aufklappbaren Prüfabschnitt und werden in der Finanzübersicht, den aufklappbaren Einnahmen-/Ausgabenlisten, den Kategorien, Finanzdetails und der Saldo-Fortschreibung rechnerisch einmal berücksichtigt.
- Originalbuchungen werden **nicht gelöscht oder überschrieben**. Mit **„Als separate Buchung zählen“** können falsch positive Vorschläge nach Bestätigung manuell freigegeben werden; die Entscheidung wird im verschlüsselten State `financeDistinctTransactionIds` gespeichert und kann rückgängig gemacht werden.
- Angemessene Sonderregel: *ohne verlässliche Referenz* kein automatisches Unterdrücken ähnlicher Buchungen, damit reguläre Wiederholungen (z. B. zwei echte Kartenkäufe am selben Tag) geschützt bleiben.

## Rechnung des abgebildeten Beispiels (unter der Voraussetzung, dass keine anderen Dubletten vorliegen)

- Gehalt 2.609,51 € (statt zweimal 2.609,51 €)
- Kapitalerträge 8,98 €
- Summe Einnahmen 2.618,49 € statt 5.228,00 €.

Das entspricht lediglich der im Screenshot erkennbaren Konstellation, **nicht** einem Abruf des persönlichen Bank-Vaults. Gesamt-Cashflow und Kontostände hängen von den übrigen tatsächlich gespeicherten Buchungen und bestätigten Salden ab.

## Qualitätssicherung

- 9/9 neue gezielte Tests erfolgreich.
- 33/33 Deployment-Tests erfolgreich (Worker Check und Import-Graph erfolgreich).
- Gesamtsuite: 1.920 von 1.955 bestanden; exakt dieselben 35 vorbestehenden Fehlertests wie in 0.5.91.5, 0 neue Regressionen.
- Original-Source-Archiv gegen Patch+Full Source bytegenau abgeglichen.
- **Grenze:** Ein Vite-Produktionsbundle konnte lokal nicht gebaut werden, weil `vite`/npm-Abhängigkeiten nicht vorliegen und die Registry im Arbeitscontainer nicht erreichbar ist. Nach dem GitHub-Upload muss das normale GitHub-Actions-Deployment erfolgreich sein.
