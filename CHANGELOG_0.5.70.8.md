# Compass 0.5.70.8 – Aufgaben-Inspector: Datumslayout

## Korrektur
- **Heute → Aufgabe bearbeiten:** Die drei Datumszeilen `Defer`, `Geplant` und `Due` ragen nicht mehr aus dem rechten Inspector.
- Ursache: Die CSS-Regel aus 0.5.59 orientierte sich an der *Breite des gesamten Browserfensters* und setzte ab 520px eine dritte Spalte für `+1d / +1w / +1m / ×`, obwohl der rechte Inspector bei Desktop-Darstellung nur 228–285px breit ist.
- Neue Darstellung: Pro Datum **Beschriftung links, Datumsfeld rechts**, die kompakten Datumsaktionen in einer **eigenen Zeile darunter**. Aktionen umbrechen bei Bedarf, ohne aus dem Inspector zu laufen.
- Die übrigen Felder `Dauer`, `Kontexte` und Metadaten werden auf die tatsächlich verfügbare Spaltenbreite begrenzt.
- Keine Änderungen an Aufgaben-, Tresor- oder Cloud-Daten. Keine D1-Migration und kein Worker-Update.

## Qualität
- 754/754 automatisierte Node-Tests bestanden, davon drei neue Layout-Regressionsprüfungen.
- JavaScript-Syntaxprüfung bestanden.
- Browser-/Vite-Produktionsabnahme in dieser Umgebung nicht durchgeführt.
