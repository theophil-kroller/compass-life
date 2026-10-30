# Compass Life 0.5.79 — Mobile Finanzen, direkte Buchungszeilen und E2EE-Klassifizierungen

**Basis:** Vollständiger Compass-0.5.78-Quellstand. Kein Neuaufsetzen oder Löschen des Tresors.

## Funktion

- Die Reiter **Übersicht · Buchungen · Unklassifiziert (Anzahl)** sind unmittelbar über der Finanzansicht erreichbar, am Handy horizontal scrollbar/sticky. „Ungeklärte Beträge“ in der Übersicht ist ebenfalls ein direkter Link nach „Unklassifiziert“.
- Auf Mobilgeräten bis 760 px öffnet „Unklassifiziert“ eine kompakte, touchfreundliche Liste mit 10 Buchungen pro Seite, lesbarem Betrag, Datum, Konto, aufklappbarem Buchungstext, Kategorie, Geldfluss und **„Zuordnen & nächste Buchung“**. Kein Scrollen durch Cashflow-Grafiken nötig.
- Bereits vorgemerkte Buchungen werden nicht mehr als offene Arbeitsschritte angeboten. Der ausstehende Übertrag wird angezeigt.
- Auf dem bisherigen **Empfangsgerät/Handy** bleiben `financeTransactions` vollständig lesend. Ein bearbeiteter Buchungssatz erzeugt ausschließlich einen neuen `financeMobileDecisions`-Datensatz mit Original-Fingerprint im bestehenden Ende-zu-Ende-verschlüsselten persönlichen Journal. Keine neue Worker-API und keine D1-Migration.
- Beim nächsten **Journalabgleich auf dem Hauptgerät** wird jede Buchung einzeln anhand ID und Originalfeldern geprüft. Unverändert: Übernahme mit bestehender `categorizeTransaction`-Validierung, Rückmeldung `applied`, danach verschlüsseltes Finanz-Snapshot des Hauptgeräts. Zwischenzeitlich geändert: `conflict` statt Überschreiben. Wiederholte Replays sind idempotent.
- Explizit gewählte **Händlerregel für künftige Buchungen** wird erst nach der erfolgreichen Übernahme auf dem Hauptgerät erzeugt; generische Zahlungsdienste bleiben davon ausgeschlossen.
- Ohne Netz bleibt die Korrektur lokal **im verschlüsselten Tresor** als `pending` erhalten. Ein Cloud-Abgleich erfolgt, sobald beide Geräte wieder online sind, die bestehende Authentifizierung gültig ist und die App dort synchronisiert. **Kein automatischer Hintergrundabgleich bei geschlossener PWA**.

## Datenschutz und Grenzen

- Kein Bearbeiten des gesamten Finanzbestands durch ein Zweitgerät; kein stilles Zurückspielen alter Bankimporte.
- Das Hauptgerät bleibt maßgeblich. Die App am Hauptgerät muss auf **0.5.79** aktualisiert werden, um die neuen Journal-Aufträge verarbeiten zu können.
- Eine vorgemerkte Zuordnung ist **noch keine bestätigte Bankklassifizierung**. Status wird erst nach Quellgeräte-Abgleich final. Ein verändertes Ausgangsrecord wird nicht überschrieben.
- Beim Gerätetausch / Abmelden vorher Tresorbackup erstellen. Die bestehende E2EE-Gerätepaarung bleibt unverändert.

## Tests

- **33/33** `npm run check:deploy` (Importgraph, Worker-Syntax, 9 neue Funktionstests, ältere Release-Integrationsprüfungen).
- **1.750/1.779** allgemeine historische Node-Tests bestanden; 29 Legacy-Transform-/Versions- und Reporttests fehlgeschlagen. Der Gesamtstand ist ausdrücklich **nicht** vollständig regressionsfrei.
- Importgraph: 255 JS-Module ohne fehlenden relativen Import, `node --check` auf allen neu bearbeiteten JS-Dateien erfolgreich.
- **Vite-/PWA-Produktionsbuild lokal nicht ausführbar**, weil `npm install` mangels Zugriff auf `registry.npmjs.org` (`EAI_AGAIN`, Paket `body-muscles`) scheiterte. GitHub Actions führt `npm install`, `check:deploy` und `npm run build` aus; diese Schritte nach Upload prüfen.

## Smoke-Test nach Deployment

1. Am Handy Finanzübersicht öffnen: drei Reiter sofort sichtbar; auf den Betrag „Ungeklärte Beträge“ tippen und offene Buchung anzeigen.
2. Eine Kategorie zuordnen. Die offene Buchung verschwindet aus der lokalen Arbeitsliste, „vorgemerkt“ erscheint; Bankbetrag bleibt unverändert.
3. Auf dem PC mit **0.5.79** Tresor entsperren und **Synchronisieren**. Bei unveränderter Buchung wird der Entscheid übernommen und ein neuer verschlüsselter Finanz-Snapshot publiziert.
4. Handy synchronisieren: kategorisierte Buchung und Status werden aus dem Hauptgerät übernommen. Konflikttest mit zwischenzeitlicher Desktop-Korrektur: kein Überschreiben, Konfliktmeldung.
5. Offline-Fall: Handy ohne Netz Kategorie vormerken, App neu öffnen, Eintrag bleibt vorhanden; nach Wiederverbindung und Synchro wird er übertragen.

**Nicht Bestandteil dieses Builds:** unbekannte Lebensmittelhälfte des Abendsnacks; mangels identifizierbarem Produkt wird kein Lebensmittel erfunden.
