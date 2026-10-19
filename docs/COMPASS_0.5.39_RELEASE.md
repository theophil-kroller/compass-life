COMPASS 0.5.39 – KRAKEN EUR-KURSE & HISTORISCHE CHARTS / FINANZEN KOMPAKTER
19. Oktober 2026

VORAUSSETZUNG: bestehende Compass 0.5.38 (inklusive bisheriger Migrationen).
Vorher verschlüsseltes Vault-Backup erstellen.

UPGRADE
1) PATCH_FROM_0.5.38.zip entpacken und mit relativen Pfaden über die bestehende Repository-Dateistruktur legen. Alternativ FULL_SOURCE.zip als Projektbasis benutzen.
2) npm install && npm test && npm run build && npm run check -w worker.
3) GITHUB PAGES und CLOUDFLARE WORKER BEIDE deployen. Der neue /api/market/kraken/ohlc-Endpunkt läuft im Worker und ist für historische Coin-Charts zwingend nötig.
4) Keine neue D1-Migration. Keine Kraken-Zugangsdaten an den Worker; öffentlicher Kurs-Endpunkt verwendet ausschließlich Marktsymbol und Kerzenintervall.
5) Cache/Service Worker im Browser neu laden; bestehenden Vault entsperren.

BENUTZUNG
- Finanzen → Portfolio: Bei entsperrtem Portfolio und importierten Spot-Beständen versucht Compass öffentliche EUR-Ticker beim Öffnen und danach maximal alle 15 Minuten zu aktualisieren (sofern nicht zuvor ausdrücklich ausgeschaltet). Wenn Kraken nicht erreichbar ist, bleiben Kurse alt oder unbewertet und als solche ausgewiesen.
- Unter Kraken → Krypto-Vermögen eine Coin-Zeile anklicken: Preis-Chart und Zeiträume 1 Tag / 7 Tage / 1 Monat / 3 Monate / 1 Jahr / bis etwa 2 Jahre. Preisentwicklung ist KEINE rückgerechnete Entwicklung des persönlich gehaltenen Bestands.
- Öffentliche Kraken OHLC-Spot-Historie begrenzt auf 720 Kerzen; lange Zeiträume und Lücken nicht hochrechnen. Inaktive oder unsupported EUR-Paare werden nicht künstlich bewertet.
- Finanzen → Überblick: Sankey ausklappen, Händler anklicken und bearbeiten; Aufklappzustand über Rerender/Bearbeitung bewahrt. Die Grafik bleibt standardmäßig zunächst geschlossen.
- Finanznavigation links kompakter. Geldkreislauf und Kontenflüsse bleiben über Cashflow direkt erreichbar, ohne zweimal in der Seitenleiste aufzutauchen.

SICHERHEIT / GRENZEN
- Es werden keine Bank- oder Kraken-Zugangsdaten, persönlichen Holdings oder Handelsjournale an den öffentlichen Kursdienst gesendet.
- Der laufende Kryptobestand stammt weiterhin aus dem zuletzt importierten/abgeglichenen Snapshot und wird NICHT über öffentliche Kursdaten aktualisiert. Die Bewertung ist nur dann tagesaktuell, wenn die zugrundeliegenden Stückzahlen ebenso aktuell sind.
- Kraken Spot berücksichtigt keine externen Wallets, Earn, Staking oder Futures. Fehlende Kurse ergeben eine ausdrücklich partielle Summe.
- Ein aktueller Preis ist nicht immer handelbarer Ausführungskurs; Zeitstempel vorhanden.
- Die OHLC-Kurse sind öffentliche historische Marktpreise, nicht die historische Rendite eines persönlichen Portfolios.

QUALITÄT
- Node-Tests 409/409 bestanden (inklusive 6 neue Kurs-, Worker-, Sicherheits-, Menü- und Sankey-Tests).
- JavaScript-Syntaxprüfungen erfolgreich.
- Produktionskompilierung in dieser Laufzeit nicht abgeschlossen: vite fehlt. In GitHub Actions nach npm install ausführen; End-to-End-Live-Charts in Production manuell prüfen.
