# Compass 0.5.77.45 – Einkaufsauswertung nach Produktgruppen

Basis: erfolgreich veröffentlichte Version 0.5.77.44 (GitHub Actions #205).

## Neu
- Kassenbons werden automatisch in **16 Warenkategorien** eingeordnet: Brot & Grundnahrungsmittel, Obst & Beeren, Gemüse & Salat, Hülsenfrüchte, Milchprodukte, Eier, pflanzliche Alternativen, Nüsse & Samen, Öle & Würzmittel, Fertiggerichte, Süßes & Desserts, Snacks & Knabbereien, Getränke, Drogerie & Hygiene, Haushalt, Noch zu prüfen.
- **Monatsübersicht oben im Einkaufsbereich**, mit kompakten Ausgabenbalken, Euro-Beträgen, Prozentanteilen und Navigation zwischen Monaten.
- Unklare Produktkürzel **nicht erraten**: Die betreffenden Zeilen landen unter „Noch zu prüfen“.
- Im aufklappbaren Bereich **Produktgruppen prüfen und korrigieren** lassen sich gespeicherte Bonpositionen manuell umklassifizieren.
- Korrekturen werden nach **Händler + Original-Produktbezeichnung** wiederverwendet und mit dem bestehenden E2EE-Gerätejournal abgeglichen. „Automatisch“ hebt eine Korrektur auf, ohne dass ein älteres Gerät sie wiederherstellt.
- Vor der Speicherung zeigt auch die GPT-Vorschau die vorgeschlagene Kategorie.
- Originalbontexte, Preise, Stückzahlen, Bon-IDs, Finanztransaktionen und Ernährungsjournal bleiben unverändert. Fehlende Preise sind keine Nullwerte.
- Die bestehenden älteren Tests aus .43 und .44 wurden für den zusätzlichen Vite-Baustein aktualisiert.

## Testdaten (nur lokal geprüft, nicht im Upload-ZIP)
Die zwei nutzereigenen Hofer-Bons mit 19 bzw. 14 Positionen wurden lokal getestet: zusammen 91,40 €, 31 Positionen automatisch klassifiziert, zwei zur manuellen Prüfung offen (BBQ Burgersch. 200g und Cerealino 166,5g). Diese persönlichen Bon-Daten sind **nicht** in der GitHub-Datei enthalten.

## Qualitätsstand
22/22 gezielte Tests bestanden, inklusive Regressionstests aus .43 und .44, Vite-Bridge-Syntaxtest und E2EE-Regelzusammenführung. Node-Syntaxprüfung aller geänderten JS-Dateien erfolgreich. Vollständiger CI-Testlauf und Vite-Produktionsbuild erst nach GitHub-Upload überprüfbar.
