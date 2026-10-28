# Compass Life · 0.5.77.59.40.25 · Ars Vivendi Editorial Rebuild

**Patch-Basis:** `0.5.77.59.40.24` · **Ziel:** gedruckter, redaktionell gestalteter Jahresreport.

## Inhalt

- Umschlag: PRIVATE ARCHIVE / PERSONAL CHRONICLE / Ars Vivendi; Werbe-Untertitel entfernt.
- Die meisten fast leeren Zwischenblätter durch Kapitelmarker ersetzt; redaktionelle Wissenstexte vor die passenden persönlichen Grafiken gesetzt.
- Life-Balance-Radar: druckfertige Achsenerklärung mit Indikatorwerten und tatsächlicher Datenbasis; Finanz-/Personendetails sind auch in der Radarberechnung nur bei Freigabe zugänglich.
- Wissenschaftliche Reportartikel zu Arbeitsbelastung (WHO/ILO), Schlaf (AASM), HRV (Garmin), Muskeltraining (ACSM 2026), Körperfett/Viszeralfett (NICE), Chrononutrition, Daily Dozen, Makros, Omega-3/6, gesunden Fetten, Healthy Aging (NutritionFacts.org), Emotionsdeutung (Karla McLaren) und Finanzbildung/Rich Dad Poor Dad.
- Neues **illustriertes** Doppelseitenkonzept: abdominales Unterhautfett versus viszerales Fett, die gemessene Fitdays-Körperkomposition, ohne den Anschein persönlicher Bildgebung.
- Neustrukturierter Ernährungsteil, vollständiger funktionsorientierter Mikronährstoffatlas inklusive erfasster Pflanzen-/Supplementbestandteile und Datenabdeckung; fehlende Nährstoffwerte sind **nicht** automatisch 0.
- Flatex-Wertpapierpositionen und Kraken-Kryptowährungen mit separaten, proportionalen Portfolio-Treemaps sowie EUR-Bewertungstabellen. Beide Kapitel nur mit aktivierter Finanzfreigabe; keine Hochrechnung fehlender Coins.
- Monatsvergleich von dokumentierten Einkommen und klassifizierten Konsumausgaben; interne Transfers sind kein Konsum.
- Schlafdauer in **Stunden mit Y-Achse ab 0**, ergänzt um Datenanzahl und Streuung. Body-Battery-Grafik mit Monatsgrenzen und gemittelten Extremwerten.
- Entfernt überflüssige generische Kommentarblöcke („Was die Grafik aussagt“, „Redaktioneller Grundsatz“); Methodik bleibt nachvollziehbar.
- In den Originalcharts verfügbare Grafiken für Finanzkategorien, Muskelkarte, Aktivität, Schlafphasen und Ernährung werden weiterhin verwendet; zusätzliche Grafiken als **statische Print-Rekonstruktionen** aus denselben Datenmodellen.

## Verifikation

- `node .verify-transform.mjs`: 72/72 release transforms, Zielversion `.40.25`.
- `node --test tests/*.test.mjs`: 1.658/1.658 Tests erfolgreich.
- Synthetischer gesamter Jahresreport: 60 A4-Seiten, 44 SVG-Grafiken. WeasyPrint-Layoutcheck auf 60 gedruckte Seiten ohne ungewollte Zusatzseiten.
- Der Testbericht enthält **ausschließlich synthetische Daten**. Keine privaten lokalen Compass-Vault-Daten wurden ausgelesen.

## Noch nicht unabhängig verifiziert

- Windows-/Chrome-PDF-Druck des Nutzers und der komplette Vite-Produktionsbuild (lokal keine installierten Vite-Dependencies). GitHub Actions / Nutzerdeployment müssen dies abschließend bestätigen.
- Die externe wissenschaftliche Quellenbasis ist in den Reportseiten als anklickbare Links dokumentiert; das nächste redaktionelle Review sollte Quellenpflege und jährliche fachliche Aktualisierung als eigenen Prozess pflegen.
- Einzelne vollständig interaktive Dashboard-Grafiken benötigen für druckfertige Ausgaben weiterhin statische SVG-Ausleitungen.

## Installation

Patch ZIP auf dem vorhandenen `.40.24`-Repository entpacken und die geänderten Dateien an ihre relativen Stellen kopieren bzw. in GitHub hochladen. Alternativ vollständiges Full-Source-ZIP nutzen. GitHub Actions prüfen; Report mit den eigenen entsperrten lokalen Daten und den gewünschten Freigaben erneut erzeugen.
