# Compass Life 0.5.77.59.40.4 — Automatische Zutatenzuordnung (Daily Dozen & Anti-Aging Eight)

## Warum
Im ursprünglichen Stand gab es zwei nicht konsistente Daily-Dozen-Quellen: die erweiterte .59.30-Evidenzansicht und die editierbare .33/.34-Liste. Das persönliche Smoothie-Rezept wurde nur in der älteren der beiden Berechnungen teilweise erkannt. Nussmix und Beeren konnten teilweise zugeordnet werden, Sesam und Gewürze jedoch nicht. Die Anzeige wirkte dadurch, als würden nur Getränke berücksichtigt.

## Behoben
- Gemeinsames, **read-only** Zutaten-Ledger für die .59.30-Daily-Dozen-Ansicht, die reguläre Daily-Dozen-Liste und dadurch automatisch auch Anti-Aging Eight (Nüsse, Beeren; bei passenden Rezepten Blattgemüse und Hülsenfrüchte als Ernährungshinweise).
- Gespeicherte Smoothies werden über die tatsächlichen **pro Eintrag gespeicherten Zutatenmengen** berechnet: 75 g Blaubeeren ≈ eine Beerenportion; 120 g Banane ≈ eine Obstportion; 30 g Nussmischung + 15 g schwarzer Sesam ergeben zusammen 45 g Nüsse/Samen (eine Daily-Dozen-Portion, Anti-Aging-Eight-Nusshinweis); gemischte Kräuter/Gewürze zählen als geschätzte Gewürzportion.
- Kurkuma ergänzt die **bearbeitbare Smoothie-Zutatenliste**. Standard bei neuen Rezepten 0,4 g; in bisher gespeicherten Rezept-Snapshots ohne Kurkuma dagegen ausdrücklich 0 g, damit keine früher nicht protokollierte Zutat erfunden wird.
- Salatrezepte mit im Snapshot gespeicherten Blattgemüse-, Bohnen-, Samen- und Kräutermengen werden ebenfalls erkannt. Bekannte Snacks (Nussmix, Erdnüsse, Apfel) und Getränke bleiben kompatibel.
- Änderungen am Tagebuch, der Rezeptmenge, dem Datum oder das Löschen eines Eintrags ändern beide Listen **sofort bei der nächsten Darstellung**, ohne doppelte gespeicherte Zähler, Datenmigration oder neues Importieren.
- Die manuellen Daily-Dozen-Korrekturen in der bestehenden interaktiven Liste haben weiterhin Vorrang. Durch versehentlich manuell auf 0 gestellte Kategorien nicht zwanghaft überschreiben.
- Ein Smoothie wird **nicht** automatisch als Wasser/Getränkeportion verbucht: Seine Zutaten sind Lebensmittel, Flüssigkeitsmenge ist nicht belegt. Von unspezifizierten Mensamenüs werden keine Zutaten erfunden.
- Anti-Aging Eight bleibt eine Übersicht der beobachteten Ernährung (z.B. Nüsse und Beeren); NAD⁺, microRNA, Fasten- und Restriktionsstatus werden nicht als gemessen dargestellt.

## Technische Umsetzung
- `client/src/daily-dozen-evidence-v57759404.js`: gemeinsame reine Berechnung aus verschlüsseltem lokalem Tagebuch (nach Entsperren).
- `client/src/daily-dozen-v5775930.js`: nutzt dieselbe Berechnung wie die reguläre Liste.
- `client/compass59404-nutrition-bridge.js`: spätes Vite-Plugin nach .36, delegiert die ältere .34-Automatik an das gemeinsame Ledger; aktualisiert sichtbare Version auf .40.4.
- `client/src/nutrition-smart-smoothie-v57736.js`: Kurkuma als editierbare Zutat mit sicherem Umgang für ältere Snapshots.

## Qualität
- **1.521/1.521** Node-/Regressionstests erfolgreich, Worker-JavaScript-Syntaxcheck erfolgreich.
- Produktions-Vite-Build nicht lokal ausführbar (keine installierten Vite-Abhängigkeiten). Das **GitHub-Actions-Deployment** mit `npm install`, `npm run check` und `npm run build` muss nach Upload grün durchlaufen. Visuelle Prüfung mit echtem entschlüsselten Tagebuch muss auf dem Smartphone stattfinden.
- Keine D1-, Worker-, Tresorformat- oder Kalender-Migration. Persönliche Daten verbleiben lokal verschlüsselt.
