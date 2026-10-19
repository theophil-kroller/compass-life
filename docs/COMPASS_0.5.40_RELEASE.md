# Compass 0.5.40 — Advanced Market Charts

## Marktdaten und Chart

- Candlesticks (Open/High/Low/Close), Volumen und Crosshair, Keyboardpfeile, optionaler Line-Modus.
- MA20/50/200, Bollinger Bands, RSI(14, Wilder), MACD 12/26/9 und historische Pivot-Unterstützungs-/Widerstandslinien sind separat ein-/ausschaltbar.
- Bitcoin BTC/EUR: 1 Tag, 7 Tage, 1 Monat, 3 Monate, 1 Jahr, ungefähr 2 Jahre aus Kraken Spot; 3 Jahre als Tageskerzen und 5 Jahre, 10 Jahre, MAX als Wochenkerzen aus Coinbase Exchange. MAX beginnt mit dem frühesten verfügbaren BTC/EUR-Kurs der Coinbase-Abfragen, nicht mit Bitcoin-Genesis.
- Aggregation von Coinbase-Tageskerzen zu UTC-Montag-bis-Sonntag-Wochenkerzen: Open der ersten, Close der letzten Kerze, tatsächliche High-/Low-Extrema, aufsummierte Volumina.
- Alle Overlays werden mit der tatsächlichen Frequenz der dargestellten Kerzen berechnet (langfristige MA20 == 20 Wochen, nicht 20 Tage). Kein künstliches Auffüllen fehlender Kerzen.
- Chartquelle und tatsächlicher Zeitraum werden offen ausgewiesen. Kraken- und Coinbase-Daten werden innerhalb eines Charts nicht unsichtbar vermischt.
- Änderungen am persönlichen Bestand, historische Trades und Steuerrechnungen werden durch technische Indikatoren nicht ersetzt.

## Sicherheit und Betrieb

- Neuer Worker-Endpunkt: `GET /api/market/bitcoin/history?symbol=BTC&period=3y|5y|10y|max`. Nur BTC/EUR an fester öffentlicher Coinbase-URL; keine beliebigen Proxyziele. Weiterhin keine Benutzer-Credentials oder Bestände.
- Coinbase-Daten werden über maximal 299 Kalendertage pro Abruf paginiert und ab fünf Jahren wöchentlich verdichtet.
- HTTP-Antwort `Cache-Control: public, max-age=3600` und Browser-HTTP-Caching; Frontend-Memory-Cache 60 Minuten für langfristige Charts.
- Keine D1-Migration. Worker- und Frontend-Deployment erforderlich.

## Qualität und Grenzen

- 424 automatisierte Tests grün, inkl. Marktindikatoren, Coinbase-Reihenfolge (low/high/open/close), Wochensummen, Zeitraumauswahl und Client-Worker-Anbindung mit Stubdaten.
- Kein erfolgreicher Live-HTTP/Cloudflare-E2E-Nachweis in dieser Umgebung; Vite nicht installiert. Echtes Browser-/Deployment-Rendering und die Coinbase-Abfrage sind noch im Zielsystem abzunehmen.
