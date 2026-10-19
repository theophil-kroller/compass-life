# Compass 0.5.20 – Advanced Wealth & Financial Intelligence

## Inhalt
- Wealth Goals: lokal gespeicherte Ziele für erfasstes Nettovermögen bzw. Bankliquidität.
- Cash buffer: Verhältnis von bestätigten Monatskosten zu erfassten Bank-Bestandsständen.
- Passive Coverage: Verhältnis *manuell bestätigter* passiver Nettozuflüsse zu manuell eingegebenen Monatskosten. Kraken-Trades, Kursgewinne, Kapitalverschiebungen und Gehalt werden nicht automatisch als passive Nettozuflüsse klassifiziert.
- Rechenmodell für Vermögensszenarien mit monatlicher Einzahlung am Monatsende und ausgewählten jährlichen Wertänderungen (Basis +/- 3 Prozentpunkte). Erst nach Bestätigung der Annahmen und bei einem erfassten Ausgangsbestand wird eine Kurve berechnet.
- Lokales Speichern via bestehendem verschlüsselten Compass-Vault, keine neue Worker-API oder D1-Migration.

## Qualitätsprüfung
- Vollständige Node-Test-Suite; zusätzlich gezielte 0.5.20-Tests für Modell, Datenlücken, Annahmen, HTML-Escaping und UI-Verkabelung.
- SVG/HTML durch statische Inspektion überprüft. Browser-Screenshotprüfung und Vite-Build im hier genutzten Container nicht erfolgreich abgeschlossen.

## Grenzen
- Die Summe beobachteter Bestände ist keine vollständige geprüfte Vermögensbilanz.
- Assets / Verbindlichkeiten und Kraken-Preise können verschiedene Stichtage haben.
- Die +/- 3 Prozentpunkte sind Szenarioannahmen, **keine Konfidenzintervalle**.
- Renditeannahmen enthalten keine Steuern, Gebühren, Kursrisiken und Kontoentnahmen.
