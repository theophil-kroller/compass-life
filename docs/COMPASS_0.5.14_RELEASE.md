# Compass 0.5.14 – Finance Trends & Review

**Basis:** GitHub `main`, Compass 0.5.13. **Releaseart:** reines Web-/PWA-Update, kein neues Worker-API, keine D1-Migration und kein Android-APK.

## Änderungen

- Finanzen → Überblick: separate Monatsvergleichsgrafik für bestätigten Konsum und **offene Abbuchungen**. Ungeklärte Zahlungseingänge sind kein Ausgabeanteil im Sankey mehr.
- Finanzen → Cashflow: Monatstabelle mit bestätigten Einnahmen und Erstattungen, bestätigtem Konsum, Transfers und offenen Abgängen. Die Zahlen sind **keine** vollständige Vermögens- oder Kontoabschlussrechnung.
- Finanzen → Ausgaben: Aufschlüsselung von Haupt- in Unterkategorien; Händlerübersicht nach bestätigten Ausgaben.
- Finanzen → Fixkosten: konservative Erkennung wiederkehrender Abbuchungen in importierten Monaten. Nutzer können jeden Kandidaten bestätigen, ausschließen und einen Ausschluss wieder zurücknehmen. Bestätigte Zahlungen bleiben weiterhin *beobachtete* Durchschnittswerte, keine vertraglich garantierten Kosten.
- Finanzen → Buchungen: neue durchsuchbare und filterbare Buchungsliste mit Einzelkorrektur auch bereits automatisch kategorisierter Umsätze. Die Korrektur ändert **nur diese eine Buchung**, nicht automatisch alle ähnlichen Zahlungen.
- Validierung: Einnahmen/Erstattungen müssen Gutschriften, Ausgaben/Bargeld müssen Abgänge sein. Händlerregeln werden nicht auf Zahlungseingänge falsch übertragen.
- Finanzdaten und Regeln bleiben Teil des AES-GCM-verschlüsselten lokalen Browser-Vaults. Es gibt **keinen** Cloud-Upload, keine Kontoverbindung und keine neue serverseitige Speicherung.

## Vor dem Update

1. Unter Compass → System einen verschlüsselten Vault-Export sichern. Bestehenden Vault weder neu anlegen noch Browserdaten löschen.
2. `Compass_0.5.14_GITHUB_PATCH.zip` entpacken und die Dateien **mit unveränderter relativer Pfadstruktur** in `theophil-kroller/compass-life` → `main` hochladen. Der Patch ist für den 0.5.13-Stand bestimmt.
3. Unter `https://github.com/theophil-kroller/compass-life/actions` den Workflow **Deploy Compass Web** prüfen.
4. Die PWA oder Website aktualisieren, den **bestehenden** Vault entsperren. Unter **Finanzen → Überblick, Ausgaben, Fixkosten, Buchungen** mit bereits importierten Raiffeisen-Umsätzen testen.
5. Es ist kein neuer Raiffeisen-Import nötig. Die alten `financeTransactions` und `financeRules` bleiben erhalten.

## Teststand

- 166/166 Node-Tests erfolgreich (`node --test tests/*.test.mjs`).
- Echte bereitgestellte Raiffeisen-Exporte nur lokal zu Diagnosezwecken geprüft: 15 CSV-Dateien, 1.986 deduplizierte Buchungen, 539 überlappende Exportzeilen, 37 Monate. **Keine privaten Originalbuchungen im ZIP**.
- Die sieben Finanzansichten gegen diesen Bestand gerendert. Desktop- und Smartphone-Layout zusätzlich im Headless Chromium mit **synthetischen**, nicht personenbezogenen Beispieldaten überprüft.
- `node --check` für geänderte JS-Dateien erfolgreich.
- `npm run build` konnte in dieser Laufzeit nicht abgeschlossen werden, da die Vite-Abhängigkeiten nicht installiert sind (`vite: not found`). Der GitHub-Actions-Lauf muss die eigentliche Produktionskompilierung bestätigen.

## Grenzen / spätere Ausbaustufen

- Reiner **Raiffeisen-Import**, weiterhin keine Amazon-/Temu-Belegdetails, N26, Revolut, DKB, flatex oder Kraken. Sie kommen in späteren Phasen.
- Reisen (China, Australien, Deutschland etc.) können erst dann sauber bepreist werden, wenn reisebezogene Buchungen bestätigte Reise-IDs besitzen, alle relevanten Konten und Wechselkurse berücksichtigt sind und Sammel-/Drittzahlungen nicht doppelt gezählt werden.
- Das Monatsdiagramm kennt den Umfang importierter Buchungen, aber nicht, ob tatsächlich ein ganzer Monat aus dem Konto exportiert wurde. Keine zuverlässige Sparquoten- oder vollständige Nettovermögensrechnung ohne Abgleich weiterer Konten, Verbindlichkeiten und Bestände.
- Wiederkehrende Zahlungspartner sind Vorschläge, keine bestätigten Abonnements, bis du sie entsprechend markierst.
