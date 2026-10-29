Compass 0.5.77.59.40.25.13 – Rooftop-Mensavorschau + Fokusfarbe
Basis: GitHub Actions #324, SHA 2b1605440117770df65325ff32ecd528ef0f2d31

1. Mensa: In Insights → Ernährung → Mensa werden die gespeicherten Angebote der laufenden und vier kommenden Kalenderwochen gezeigt. Nicht veröffentlichte Gerichte werden nicht erfunden.
2. GPT-Rechercheprompt: Fragt veröffentlichte Menüs der nächsten Wochen mit Quellen/Nährwertschätzungen ab. Manueller JSON-Prüf-/Importprozess bleibt unverändert.
3. Modus-Zielscheibe: Grün im Focus-Modus, leuchtend Orange im erweiterten Modus, auf Desktop und Smartphone.
4. Keine Änderungen am Vault-Schema, persönlichem Datenbestand, Importmodus oder Cloud-Sync.

Installation: Dateien aus PATCH-ZIP mit gleichem Pfad im Repository ersetzen und neue Testdatei ergänzen. Patch nicht über den Stand vor #324 installieren.
Prüfung: npm test = 1731/1731 bestanden, node --check erfolgreich. Vite-Produktionsbuild hier ohne installierte node_modules nicht ausführbar. Deployment via GitHub Actions nach Upload prüfen.
