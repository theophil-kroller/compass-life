# Compass 0.5.17.3 – N26, DKB Giro & Visa und Kontenflüsse

## Basis und Umfang

Basis: Compass 0.5.17.2 (inkl. Health-UX Zwischenrelease 0.4.17.5). Reiner Webclient-Patch, keine neue Worker-Migration. Die bestehende lokale AES-GCM-Vault-Speicherung bleibt erhalten.

- Erkennt aus den tatsächlichen Spaltenüberschriften **N26**, **DKB Giro** und **DKB Visa** automatisch; der Dateiname ist nicht maßgeblich. Unterstützt weiterhin Raiffeisen und Revolut.
- N26 Giro und benannte **Spaces** sind getrennte Konten. DKB Giro und DKB Visa sind ebenfalls getrennt, Kartenkennung wird lokal verarbeitet.
- Mehrfachimporte behalten unveränderte Buchungs-IDs und überspringen Duplikate. Null-Euro-Einträge werden nicht als Ausgaben gebucht.
- DKB Visa: explizite **Habenzinsen** als Kapitalerträge und **Abgeltungsteuer** als Kapitalertragsteuer erkannt. Die vorliegende DKB-Visa-CSV enthält nur diese Typen und **keine Kartenumsätze oder nachgewiesenen Giro/Visa-Gegenbuchungen**.
- Neue Finanzansicht **Kontenflüsse** zeigt ausschließlich von der Nutzerin/dem Nutzer beidseitig bestätigte interne Transfers und bestätigte externe Investment-Transfers. Kraken/flatex werden nur bei entsprechend kategorisierten und konkret erkennbaren Buchungen namentlich zugeordnet.
- Vorschläge für interne Überträge priorisieren beidseitige Transfermerkmale und erlauben, falls nur die Ausgangsbuchung als Transfer erkennbar ist, eine noch ungeklärte eingehende Gegenbuchung. **Einfache Konsumbuchungen dürfen nicht allein wegen ähnlicher Beträge als Transfer zugeordnet werden.**
- Ausgabensankey bleibt vom Kontenfluss getrennt. Umbuchungen zwischen eigenen Konten zählen nicht als Einkommen oder Konsum.

## Für die vollständige Vermögenssicht noch offen

Die importierten Bankdaten decken nicht zwangsläufig alle Kontenbewegungen ab. Ohne vollständige Gegenbuchungen und Anfangs-/Endbestände gibt es noch keine nachgewiesene Gesamtvermögensbilanz.

**Kraken API – geplanter Folgebuild**: schreibgeschützte Authentifizierung für Kontostände, Ledger und Trades, lokal signierter Zugriff über einen vertrauenswürdigen lokalen Helfer statt frei zugängliche API-Secrets im Webclient oder Cloudflare-Worker. Minimale Kraken-Berechtigungen (Funds Query, Ledger Entries Query, optional Closed Orders & Trades Query), niemals Trade oder Withdraw. Synchronisation zunächst nur manuell und mit Vorschau; erst später optional zeitgesteuert. Vor einer Implementierung muss die unterstützte lokale Laufzeit/CORS-Verbindung geprüft werden.

## Datenschutz und Kontrollen

Keine persönlichen IBANs, Bankumsätze, Exporte oder Kraken-Zugangsdaten im GitHub-Code und in den Tests. Dateien werden lokal eingelesen; Depot-/Kraken-Umbuchungen bleiben von Kursgewinnen und konsumtiven Ausgaben getrennt.

## Installieren

1. Verschlüsseltes Vault-Backup erstellen.
2. GitHub-Patch **pfadgleich** auf Compass 0.5.17.2 einspielen; bei GitHub Actions auf Fehler prüfen.
3. In Compass unter Finanzen → „Datenquellen, Bank-Import & private Regeln“ DKB Giro, DKB Visa, N26 und optional Revolut/Raiffeisen CSV auswählen. Compass erkennt das Konto automatisch.
4. Importvorschau und offene Vorgänge prüfen, bevor du sie bestätigst.
5. In Finanzen → Prüfen bestätigbare Eigenüberträge einzeln kontrollieren. Finanzen → Kontenflüsse zeigt danach die bestätigten Bewegungen.
