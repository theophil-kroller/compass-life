# Compass Web 0.5.77.59.40.15 — Smoothie: kcal und Blütenpollen

Basis: 0.5.77.59.40.14 (Web) + Watch Bridge 0.5.12.5 (unverändert). Garmin 0.5.12.6 bleibt unverändert.

## Korrektur

- `smoothie-personal` hatte zwar ein Zutatenrezept, aber keinen Energie-Eintrag in `nutritionKcalEstimate`. Dadurch erschienen aufgezeichnete Smoothies unter „ohne kcal“ und fehlten in kcal-Balken und Tagesbilanz. Jetzt wird auf Basis der gespeicherten Zutatenmengen gerechnet.
- Historische Einträge werden **beim Lesen** neu berechnet (kein destruktiver Migrationslauf, bestehende Zeitstempel oder Mengen werden nicht überschrieben).
- In den Rezeptwerten ist **ein Löffel Bio-Blütenpollen** enthalten. Die Annahme ist 5 g mit ca. 350 kcal pro 100 g, also rund 17,5 kcal; Marke und Löffelgröße nicht gemessen.
- Standardmengen: Banane 120 g, schwarzer Sesam 15 g, Hofer-Heidelbeeren 75 g, Blütenpollen 5 g, Zimt/Kurkuma/Ingwer je 0,4 g. **Keine** ungefragt hinzugefügten Nüsse oder Minze. Ältere, nur automatisch angenommene Nuss-/Minzwerte werden nicht mehr mitgerechnet. Explizit individualisierte Mengen bleiben erhalten.
- Standard: ca. 257 kcal und eine Schätzspanne von 210–328 kcal. Andere dokumentierte Zutatenmengen verändern die Rechnung sofort.
- Betroffene Ausgaben: persönliches Energieziel, kcal-Historie inklusive „ohne kcal“, Nutrition-Timing-Dot-Plots samt Cache-Invalidierung, Nährstoffprofil und die allgemeine kcal-Zusammenfassung.
- Kachel und Datensatz bleiben wiederverwendbar; bestehende Journaleinträge und Synchronisation bleiben unverändert.

## Installation

1. Komplettbestand **0.5.77.59.40.14** vorausgesetzt. Inhalt des Patch-ZIP im GitHub-Repository-Root hochladen, vorhandene Dateien ersetzen und zusätzliche Dateien ergänzen.
2. Commit auslösen, auf grünen Webdeploy warten, Compass im Browser/PWA neu laden.
3. Ernährung → kcal-Historie öffnen: Einträge „Mein Smoothie“ sollten nicht mehr unter „ohne kcal“ stehen. Frühere Tage und aktueller Tag zeigen die aus ihrem Rezept errechneten Schätzwerte.
4. Ernährungstagebuch → Smoothie → Zutatenmengen öffnen: den Schöpfer Sesam und den Blütenpollenlöffel bei Bedarf wiegen und Gramm korrigieren.

**Keine Cloudflare-D1-Migration, kein Worker-Deploy und keine Garmin-Änderung.**

## Prüfung

1.590/1.590 Node-Tests erfolgreich (inkl. kompletter Vite-Transformationskette). JavaScript-Syntax der neuen Module geprüft. **Kein echter Vite-Produktionsbuild oder Browser-/Hardwaretest** in dieser Umgebung (Vite-Abhängigkeiten fehlen). Das Produkt ist eine belastbare Rechnung mit Annahmen, keine Nährwertmessung.
