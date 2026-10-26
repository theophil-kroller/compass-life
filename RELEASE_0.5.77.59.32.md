# Compass Life 0.5.77.59.32 – Menüerweiterung & Mondschein-Lockscreen

Ausgangsbasis: erfolgreicher GitHub Actions Workflow #266, Commit df13c0c5e453421d2a81c8c486c325dbe1d29f30.

## Lebensmittel im schnellen Ernährungstracker
- Pizza Margherita – ganze Pizza, vorläufig 300 g, geschätzte 650–900 kcal.
- Krautsalat mit Dressing – vorläufig 150 g, geschätzte 70–200 kcal.
- Stangenbohnensalat – vorläufig 150 g, geschätzte 65–180 kcal.
- Champagner – Glas mit 125 ml, geschätzte 85–115 kcal.
- Chocolate Cookie – vorläufig 80 g, geschätzte 330–450 kcal.
- Schlagsahne / Schlagobers – vorläufig 40 g, geschätzte 100–145 kcal.
- Chocolate Cookie mit Schlagsahne – 80 g Cookie + 40 g Sahne, geschätzte 440–600 kcal.

Portionsmengen sind im Ernährungstagebuch bearbeitbar. Beim kombinierten Dessert können die Grammangaben von Cookie und Sahne getrennt angepasst werden, z. B. „50 g Cookie + 10 g Sahne“. Die Angaben sind grobe Rezeptschätzungen, keine konkreten Verpackungswerte.

Daily Dozen: Krautsalat wird vorsichtig der Kreuzblütler-Kategorie, Stangenbohnensalat den sonstigen Gemüsen zugeordnet; als höchstens eine Portion je 150 g. Champagner, Pizza und Dessert erhalten keine unberechtigten Daily-Dozen-Gutschriften.

## Desktop-Sperrbildschirm
- Statt schwarzer Desktop-Ränder: Mondlicht über nächtlichem Ozean aus dem ausgewählten Motiv.
- Der bestehende zentrale Ars-Vivendi-Kompass, die Entsperr-Interaktion und die mobile Gestaltung bleiben erhalten.
- Optimiertes 150-KB-WebP, für die PWA auch offline eingebunden.
- Sichtbare Version im App-Header und Lockscreen: 0.5.77.59.32.

## Installation
PATCH: ZIP entpacken und nur die enthaltenen Dateien mit ihrer Ordnerstruktur in das GitHub-Repository auf `main` hochladen und gleiche Namen ersetzen.
FULL SOURCE: Vollständiger Repository-Quellcode-Stand mit allen bisherigen Dateien und den oben genannten Änderungen. Wenn du ein vollständiges Re-Upload benötigst, diesen ZIP-Inhalt verwenden. Nicht beide ZIPs hochladen.
Kein lokales Skript und keine Datenbankmigration erforderlich. GitHub Pages aktualisiert sich erst nach erfolgreichem GitHub Actions Deploy. Für das Handy kann zusätzlich das PWA-Update nötig sein.

## Qualitätsprüfung
- npm run check: 1429 Tests bestanden, 0 fehlgeschlagen.
- Vollständige bestehende Vite-Plugin-Transformationskette im Regressionstest durchlaufen und JavaScript geparst.
- Neue Funktions- und Regressionstests: 8 von 8 bestanden.
- Syntaktische Prüfung der geänderten JS-Dateien bestanden.
- npm run build: in dieser lokalen Laufzeit nicht ausführbar (der Quellcode-Snapshot enthält keine node_modules, Vite nicht vorhanden). Die Vite-Produktion muss im GitHub Actions Workflow ausgeführt werden; kein Deployment-Erfolg wird vorab behauptet.
