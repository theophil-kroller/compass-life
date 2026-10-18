# Compass 0.5.15 · Finance Reisen und Kostenanalyse

## Ausgangsbasis

Patch für den vollständigen GitHub-Stand **0.5.14.2**; ZIP enthält nur neue/geänderte Dateien mit Pfaden relativ zur Repository-Wurzel. `Compass_0.5.15_FULL_SOURCE.zip` enthält den gesamten veröffentlichbaren Quellcode.

## Installation

1. Im Browser ein **verschlüsseltes Backup** des Compass-Tresors sichern.
2. Patch ZIP entpacken und die enthaltenen Dateien in das Repository `compass-life` auf Branch `main` mit unveränderten Ordnerpfaden hochladen.
3. GitHub Actions → **Deploy Compass Web** muss grün werden.
4. Compass neu laden; lokalen Vault entsperren.
5. **Finanzen → Reisen** öffnen; eine Reise mit Namen und Start-/Enddatum anlegen.
6. Die Vorschläge *einzeln prüfen*: Flug- und Hotelvorauszahlungen aus dem Vorjahr können erscheinen. Relevante Buchungen mit **Zuordnen** bestätigen; unpassende **Ausblenden**.
7. Für einen älteren Einkauf außerhalb der Standardvorschläge über **Alle Bankbuchungen durchsuchen** und Suche nach Händler/Verwendungszweck arbeiten.

## Enthalten

- Lokale Reiseliste mit Datum, Anlage und Löschung; keine fest codierten privaten Reiseorte.
- Explizite Verknüpfung einer vorhandenen Bankbuchung mit maximal einer Reise. Die ursprüngliche Buchung und ihre Kategorie werden **nicht** verändert.
- Vorschläge für Ausgaben während der Reise und für vorab bezahlte Flüge/Unterkünfte aus bis zu 365 Tagen vor Beginn, niemals automatische Reisebuchungen.
- Reisedetails: bestätigte Ausgaben, Erstattungen, Nettoausgaben, separate Bargeldbehebungen, unklare Zuordnungen, Ausgabenkategorien und Übersicht aller Reisen.
- Um Buchungen vorab bezahlter Reisen oder Wochenendausflüge zu sehen, stehen Such- und Filterfunktionen zur Verfügung.
- Link und Ablehnung werden im **AES-GCM-verschlüsselten lokalen Vault** gespeichert.
- Keine neue API, keine Cloudflare D1 Migration, kein Android-Update; die exportierten Bankdaten bleiben lokal.
- `node --test tests/*.test.mjs` enthält neue Regressionstests einschließlich Sicherheitsprüfungen.

## Grenzen

**Das ist keine vollständige automatische Reisekostenrechnung.** Es wird nur mit den in Compass vorhandenen Raiffeisen-EUR-Transaktionen gerechnet. Buchungen aus N26, Revolut, DKB, Kreditkarten, bar getätigte Käufe und Belege von Amazon/Temu fehlen noch. Eine Zahlung am Reiseort kann beispielsweise eine Miete sein; deshalb muss sie ausdrücklich bestätigt werden. Kein automatischer Standort-Abgleich, keine Speicherung von GPS-Rohdaten und keine Geolokalisierung einzelner Zahlungen. Bei Mehrwährungen, Gemeinschaftsausgaben und auf mehrere Personen verteilten Beträgen ist eine spätere Erweiterung erforderlich.

Nach Umkategorisierung bleibt eine bestätigte Reisezuordnung bestehen; eine als Transfer umkategorisierte Buchung wird nicht als Reisekonsum gezählt. Eine Reise zu löschen entfernt nur ihre lokalen Zuordnungen, nicht die Banktransaktionen.

## Produkt-Idee: spätere Ausbaustufen

- Konten N26/Revolut/DKB und interne Transfer-Dubletten.
- Fremdwährungstransaktionen, FX-Gebühren, Amazon/Temu-Rechnungen, Flug-/Hotelbelege.
- Reisebelege, mehrteilige Reisen und geteilte Reisekosten pro Person.
- Optionaler, bestätigungspflichtiger Abgleich mit Aufenthaltstagen aus dem Standort-Timeline-Import.
- CASHFLOW-Cockpit: validierte Vermögenswerte, Verbindlichkeiten, Kapitalerträge und passive Deckungsquote.

## Qualität

Die Node-Test-Suite läuft vollständig; der Vite-Produktionsbuild hängt von den in GitHub Actions zu installierenden npm-Abhängigkeiten ab. GitHub Pages deployt nur nach erfolgreicher Workflow-Ausführung. Die Android-App und Worker bleiben unverändert.
