# Compass 0.5.41 — Portfolio als Arbeitsbereich

## Navigation

Die lange, vertikal gestapelte Portfolio-Seite wird in fünf fokussierte Ansichten gegliedert:

- **Übersicht:** kompakte Kennzahlen, Flatex-Allokation, datierte Depotbeobachtungen, Kraken-Bestand (maximal fünf Coins als Vorschau).
- **Positionen:** Flatex-Depotpositionen mit Sortierung (Name, relativer/absoluter Buchgewinn, Wert, Gewichtung) sowie Kraken-Positionen. Ein Klick auf die Analyse-Aktion führt zur jeweiligen Marktanalyse.
- **Analyse:** Performance-Treemap und Gewinnbeiträge der Flatex-Positionen, Flatex-OHLC-Chart mit Indikatoren; Unterauswahl Flatex/Kraken verhindert zwei übereinander gestapelte Trading-Charts.
- **Entwicklung:** belegte Flatex-Snapshots, konsolidierter Vermögensverlauf und nur belegte Kraken-Bewertungstage; keine nachträglich erfundene historische Entwicklung des persönlichen Bestands.
- **Einstellungen & Import:** Flatex-Bestand und Kontoauszug, Kraken-Connector/JSON, manuelle Bestandspflege, kontobezogene Optionen. Globale Bank-Importverwaltung hier statt unter jeder Depotansicht.

## Marktdaten & Zuverlässigkeit

- **BTC/EUR:** kürzere Kraken-OHLC-Daten; längere Serien über öffentliche Coinbase-Exchange-Daten, bei Verfügbarkeitsfehlern alternativer CryptoCompare-Marktdatenabruf. Quelle im Chart benannt; kein garantierter Live-Abruf.
- **Flatex:** historische OHLC-Abfrage via eigenen Twelve-Data-Key und **verifizierten Börsenticker**. ISIN allein ist keine eindeutige handelbare Notierung; Basic-Tarif kann europäische Titel ausschließen.
- **Technisches Chart:** rechter Achsenraum für formatierte EUR-Preislabels verbreitert; Crosshair und Indikatoren aus tatsächlich geladenen Kerzen.
- **Allokation:** Treemap-Fläche proportional zum Positionswert, Farbe entsprechend Buchgewinn/-verlust in Prozent; zusätzliche absoluten Gewinnbeiträge. Keine Behauptung einer geldgewichteten Rendite.

## Sicherheit & Grenzen

Keine neue Migration; Worker-Deploy ist nötig. Private Flatex- oder Kraken-Dateien gehören nicht ins Repository. Weder API-Keys noch Passwörter ins GitHub-Repo committen.

Automatisierte Tests: 427 erfolgreich. Vite-Build und Live-Browsertest in der gegebenen Arbeitsumgebung nicht ausgeführt.
