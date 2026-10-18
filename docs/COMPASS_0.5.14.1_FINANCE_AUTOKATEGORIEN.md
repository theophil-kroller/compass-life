# Compass 0.5.14.1 – Finanz-Kategorien: weniger Zwangsprüfungen

## Ziel
Die Version verbessert bestehende Raiffeisen-Umsätze im **lokalen verschlüsselten Vault**, ohne manuell bestätigte Kategorien zu überschreiben. Einmal monatlich neue CSVs nachzuladen soll keine stundenlange manuelle Kategorisierung erfordern.

## Für bestehende Compass-0.5.14-Nutzer
1. Verschlüsseltes Vault-Backup erstellen und 0.5.14.1-Patch mit den relativen Verzeichnissen über den GitHub-Repository-Inhalt hochladen.
2. GitHub Actions: Workflow `Deploy Compass Web` abwarten; PWA neu laden.
3. Tresor entsperren; **Finanzen → „Bestehende Buchungen neu vorklassifizieren“** klicken. **Kein erneuter CSV-Import nötig.**
4. Danach **Finanzen → Prüfen** öffnen. Die Liste enthält nur noch Buchungen, deren Klassifizierung tatsächlich offen bleibt.
5. In **Finanzen → Buchungen** über „Grobe Kategorien (nachbearbeitbar)“ die präzisionsärmeren automatischen Kategorien filtern. Auf eine Buchung klicken, um **vollständigen Buchungstext, Kategoriegrund und Bearbeitungsformular** zu sehen.
6. Bei einem Zahlungspartner, dessen Buchungen tatsächlich dieselbe wirtschaftliche Bedeutung haben, optional die Checkbox **„Kategorie für diesen Zahlungspartner merken“** aktivieren. Das übernimmt die Kategorie für seine anderen noch nicht manuell bestätigten Buchungen **derselben Richtung**, und speichert eine Händlerregel lokal für neue Importe. Niemals bei PayPal, Klarna, Stripe, SumUp oder unklaren Sammel-Händlern.

## Kategorisierung: drei unterschiedliche Qualitäten
- **Spezifisch erkannt:** z.B. SPAR, Panda Asia, Mensa, Biogast, Tanzschule, Bujinkan, Therme/Sauna, Mass Response (spusu), T-Mobile, öffentlicher Verkehr, Kapitalertragsteuer, ORF-Beitrag, Bankomat, flatex oder Payward/Kraken.
- **Grob, aber nicht pflichtig:** z.B. Amazon (Produkt unbekannt), PayPal (gekaufte Leistung unbekannt), private Überweisung (Zweck unbekannt), geringere unidentifizierbare Zahlung. In Auswertungen ausdrücklich als grob kennzeichnen; keine Behauptung einer exakten Artikel- oder Leistungskategorie.
- **Prüfpflichtig:** relevante große unklare Buchungen, bei denen Ausgabe, Eingang oder Vermögenstransfer verwechselt werden könnte.

**Bargeldbehebung**: Geldabfluss und kein bewiesener Konsum. **Private Überweisung**: Transfer mit offener Verwendung. **Kapitalertragsteuer**: Steueraufwand, nicht Depotkauf. **Biogast**: Lebensmittelzweck laut Nutzervorgabe; Geldflüsse bei expliziter Erstattung gesondert behandeln. **Amazon und Temu**: Onlinekauf, keine Aussage über konkretes Produkt. **Zahlungsdienst**: keine automatische Verteilung auf einzelne Konsumgüter.

## QA mit bereitgestellten Bankexports (nur lokal, nicht im Release enthalten)
15 CSV-Dateien / 1.986 einzigartige Transaktionen / 539 Dubletten / 37 Monate:
- 1.131 spezifische Zuordnungen
- 847 grobe, als grob markierte Zuordnungen
- 8 prüfpflichtige Fälle

Dies ist ein **vollständiger Neuimport-Test mit den CSV-Originalen**, keine Aussage über bereits manuell kategorisierte Inhalte eines bestehenden Vault. In der bestehenden Installation kann die Anzahl abweichen; persönliche Änderungen bleiben ausdrücklich unverändert.

Die Klassifikationsregeln stammen aus beobachtbaren Buchungstextmustern und Händlerinformationen. Keine Bankdaten, Kontonummern oder Namen privater Zahlungspartner sind im Patch eingebettet; gespeicherte Regeln und Buchungen bleiben im privaten Vault.

## Wichtige Grenzen
- Große, aber wiederkehrende Privatüberweisungen können in einer groben Transferkategorie landen. Das bedeutet **nicht**, dass die Zahlung sicher kein Konsum war. Für belastbare Sparquoten zuerst die größten, häufigsten groben Kategorien klären.
- Kategorisierte Einnahmen können fremde Kontotransfers enthalten; Gesamt-Cashflow eines einzelnen Kontos ist nicht automatisch frei verfügbares Einkommen.
- Beträge auf Bank- und Kreditkartenexporten können Überträge enthalten. Nicht doppelt zählen.
- Karten-/Marktplatzdaten verraten ohne Belege keine Einzelartikel.
- Keine automatische Internet-/LLM-Suche aus der PWA, keine Bank-API, keine Konten-Verknüpfung. Local-first, regelbasiert, nachvollziehbar.

## Technisch
Client/PWA-only. **Keine SQL-Migration, kein Worker-Deploy, keine neue APK**. JavaScript-Tests via `node --test tests/*.test.mjs` und Syntaxprüfung. Der vollständige Vite-Build wird nach Upload in GitHub Actions bestätigt (lokal ist Vite nicht installiert).

Weiterführende öffentliche Händlerquellen: https://www.pandaasiashopgraz.at/ ; https://www.biogast.at/ ; https://www.spusu.at/impressum ; https://orf.beitrag.at/impressum .
