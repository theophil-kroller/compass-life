# Compass 0.5.13 · Explore + Raiffeisen Finance (local-first)

**Basis:** 0.5.12, GitHub `main`. Dieses Update verändert nur die Web/PWA-Dateien und lokale Vault-Daten.

## Installation

1. In Compass zuerst **System → verschlüsseltes Vault-Backup** ausführen. Unbedingt Passphrase sicher aufbewahren.
2. Archiv `Compass_0.5.13_GITHUB_PATCH.zip` entpacken, **Ordnerstruktur beibehalten** und den Inhalt auf `main` in `theophil-kroller/compass-life` hochladen. Nicht versehentlich einen zusätzlichen ZIP-Unterordner ins Repository erzeugen.
3. Unter GitHub **Actions → Deploy Compass Web** den grünen Abschluss abwarten. Diese Veröffentlichung enthält weder neue Android-Dateien noch Worker-Code, und es ist **keine SQL-Migration / kein Cloudflare-Deploy** nötig.
4. Compass PWA aktualisieren, vorhandenen Tresor entsperren. **Insights → Explore** prüfen. **Finanzen → Raiffeisen-Umsätze importieren** öffnen.
5. Mehrere Original-CSV-Dateien gleichzeitig auswählen. Vorschau mit Zahl neuer Buchungen, Überschneidungen und ungeklärten Kategorien kontrollieren, erst dann „übernehmen“ drücken.
6. Im Finanzbereich den Tab **Prüfen** öffnen. Gleiche Zahlungspartner werden gruppiert; eine Sammelbestätigung ist nur mit eigenem Häkchen möglich. Eine Händlerregel für zukünftige Umsätze wird ebenfalls nur auf explizite Freigabe gespeichert. Spezifische Zahlungsdienste wie PayPal werden *nicht* global mit einer Händlerregel versehen.

## Finance 1: Welche Daten werden jetzt eingelesen?

- Raiffeisen-Umsatzliste, UTF-8, BOM optional, Semikolon, sechs Spalten, deutsches Dezimalkomma, deutsche Datumsangaben; die tatsächlichen Ursprungszeilen werden im **lokalen verschlüsselten Vault** gespeichert.
- Hochgeladene Privatdaten sind **niemals im Quellcode oder Test-Fix­tures enthalten**; das Nutzerarchiv muss in der eigenen Compass-PWA importiert werden.
- Identische Original-Buchungszeilen können erneut importiert werden und zählen nur einmal. Transaktionen mit gleichem Datum/Betrag, aber unterschiedlicher bankseitiger Referenz werden bewusst erhalten; das sind nicht automatisch Duplikate.
- Startregeln für Supermärkte, Drogerien, Verkehr, Tanken, Fitness, Versicherungen, Telekommunikation, Energie, Restaurant, Cash, Transfers etc. Unklare Zahlungstexte bleiben sichtbar und unter „Prüfung ausstehend“, auch wenn eine **unbestätigte Vorschlagskategorie** gezeigt wird.
- Nach dem eigenen Prüfentscheid können mehrfache offene Buchungen mit identischem Empfänger/Art übernommen werden; **nur nach Bestätigung**. Gegenparteien wie PayPal sind absichtlich aus solchen automatischen Regeln ausgeschlossen.
- Kategorien und Geldflussarten bleiben getrennt: echte Ausgaben, Einnahmen, interne Transfers/Anlagen, Bargeld und Rückerstattungen. Die Bankbuchungen sind **keine verlässliche vollständige Vermögensbilanz**.
- Vorläufige Finanzansichten: Überblick, Cashflow, Ausgaben mit **Sankey-Abflussdiagramm**, Kandidaten für wiederkehrende Kosten, Sparpotenzial, Portfolio/Bilanz-Grundstruktur, Prüfliste. Später: Kraken/flatex, Verbindlichkeiten, korrekte Vermögensbestände, vollständige CASHFLOW-Logik.

## Sankey: was wird exakt gezeigt?

Nur die **gebuchten Abflüsse** der ausgewählten Periode nach bestätigten Ausgabenkategorien; Vermögenstransfers, Bargeld und die noch zu prüfenden Abgänge werden separat ausgewiesen. Die Einnahmen stehen getrennt als KPI/Monatsbalken. Ein vermeintlicher Einkommen→Ausgaben-Sankey ohne Anfangs-/Endsaldo wäre irreführend und wird nicht erfunden.

## Insights → Explore

- Interaktive X-/Y-Auswahl (Schlaf, HRV, Stress, morgendliche Body Battery, Fokuszeit, Pomodoros, erkannte Meetingminuten), gleichzeitiger Tag oder Zeitversatz. Nur tatsächlich gemeinsam beobachtete Datumswerte, **kein** Missing=0.
- Bei ≥3 beobachteten Wertepaaren: Scatterplot. Bei ≥20 Wertepaaren und ausreichend X-Variation: explorative OLS-Trendlinie mit **zirkulärem Block-Bootstrap-Konfidenzband (95 %, geschätzte Mittelwertlinie)**. Kein Vorhersageintervall, keine Kausalitäts- oder Gesundheitsdiagnose.
- Kontextkritisch: Garmin-Nacht gehört zum **Tag des Aufwachens**; für Arbeit am Tag des Aufwachens „Gleicher Tag“ verwenden. Die Statistik berücksichtigt nicht automatisch sämtliche Störgrößen oder Arbeitszeit, die gar nicht aufgezeichnet wurde.
- Alle Auswertungen lokal im Browser. Keine externe KI und kein Cloud-Upload privater Buchungen.

## Tests und bekannte Grenzen

- `npm run check` führt die Worker- und Client-Tests aus; im lokalen Prüflauf liefen alle Tests inklusive neuer CSV-, Sankey-, Kategorisierungs- und Statistiktests grün.
- Ein vollständiger Vite-Produktionsbuild benötigt installierte npm-Abhängigkeiten und wird über GitHub Actions bestätigt. Android-Build ist für diese Version nicht erforderlich.
- **Keine automatische Finance-Synchronisierung** zwischen Geräten. Daten auf einem anderen Gerät nur über das gesicherte Vault-Backup verfügbar. Ein vollständiger Bankimport aus verschiedenen Banken, automatische Verbindlichkeiten-Erkennung und echte passive Deckungsquote folgen in späteren Builds.
- Mehrfachzuordnungen von Zahlungen zu verschiedenen Haushaltsmitgliedern/Projekten, Händlerdetailaufteilung sowie Kontoauszug-Saldoabgleich sind noch nicht implementiert.
