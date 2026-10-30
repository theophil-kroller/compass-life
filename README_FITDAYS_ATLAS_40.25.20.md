# Compass Life .40.25.20 · Fitdays-Report-Atlas

**Ausgangsstand:** GitHub Actions #331, Commit `b3f0e02de92996fbbfb0aa2664adf28e20ecc853` (erfolgreich). Diese ZIP ist nicht bereits auf GitHub eingespielt. Nach Upload den GitHub-Actions-Produktionsbuild prüfen.

## Installation

- **Patch:** Dateien aus `Compass_40.25.20_FITDAYS_REPORT_ATLAS_PATCH_FROM_331.zip` entpacken und mit ihren relativen Pfaden im GitHub-Repository ergänzen/ersetzen. Keine Ordnerstruktur flachziehen.
- **Full Source:** Enthält den vollständigen Quellstand #331 einschließlich dieser Änderungen; ausschließlich alternativ zum Patch verwenden.
- Es werden weder gespeicherte Fitdays-Messungen noch Tresor-/Journal-Daten verändert. Keine Migration.

## Änderungen

1. `Insights > Gesundheit & Körper > Körperanalyse`: bisherige 4-Quadranten-Matrix durch eine mobile/desktopfähige SVG-Matrix mit allen elf englischen Fitdays-Feldbezeichnungen ersetzt: Athletes, Muscular fat, Overweight, Muscle, Fit, Slightly fat, Muscular slim, Slim, Invisible fat, Too thin, Thin.
2. BMI- und Körperfettachsen mit 10/20% Körperfett und BMI 18,5/25,0; dynamische Position aus der letzten echten Messung. Nur im dargestellten Wertebereich gibt es einen Positionspunkt. Aktuelles Feld wird türkis hervorgehoben.
3. Drei segmentierte, Fitdays-artige Balken für BMI, Körperfett und Gewicht/Zielgewicht. Für den BMI gelten allgemeine Erwachsenenkategorien. Die *anderen* Kategorien und die elf Feldgrenzen sind eine visuelle Annäherung an den vom Anwender gelieferten Screenshot, **nicht** die verifizierte herstellerspezifische oder medizinische Bewertung. Keine Risikoaussagen daraus ableiten.
4. `Other indicators`: Viszeralfett-Index, BMR und fettfreie Masse. Fehlende Exportwerte bleiben leer. Fettfreie Masse wird, falls nicht importiert, rechnerisch aus Gewicht und Körperfett geschätzt und gekennzeichnet.
5. Gewicht/Zielgewicht: nur bei vorhandenem Zielgewicht berechnen. Ein 116%-Wert aus dem Fitdays-Screenshot ist **nicht** als aktueller Messwert hinterlegt.
6. Körperanalyse benutzt explizit die vom Nutzer bestätigte Größe von **184 cm**, statt den früheren 185-cm-Wert aus einem älteren Nutrition-Profil zu übernehmen. Der alte gespeicherte Profilwert wird **nicht** eigenmächtig verändert; diesen im Ernährungsprofil zusätzlich auf 184 cm korrigieren, damit weitere Berechnungen konsistent sind.
7. Bisherige Dot-Plots, Garmin-Trainingsdiagramme, detaillierte Fitdays-Messwertskalen und Segmentanalysen bleiben unverändert unterhalb der Ergänzung erhalten. Auf kleinen Displays ist die elfteilige Karte innerhalb des Panels seitlich verschiebbar.
8. Sichtbare Release-Anzeige am Login und im App-Chrome nutzt denselben zentralen Versionswert `0.5.77.59.40.25.20`.

## Qualitätssicherung

- `npm test`: **1763/1763 bestanden**.
- `node --check`: beide bearbeiteten JS-Module bestanden.
- Manuelle Browser-Renderkontrolle für 1400px Desktop und 390px Mobilbreite: 11 Felder, drei Statusbalken und Positionsmarker sichtbar.
- `npm run build -w client` konnte hier **nicht** ausgeführt werden: Vite-Abhängigkeit fehlt in der Laufzeit (`vite: not found`). Produktion daher erst mit GitHub Actions bestätigen.

## Dateiänderungen

- `client/src/fitdays-interpretation-v57759402517.js`
- `client/src/fitdays-interpretation-v57759402517.css`
- `client/src/main-full-v57759402510.js`
- `client/src/compass-release-v57759402519.js`
- `tests/compass-40-25-18-body-first-height.test.mjs`
- `tests/compass-40-25-19-foods-login-fitdays.test.mjs`
- `tests/compass-40-25-20-fitdays-report-matrix.test.mjs` (neu)
- `README_FITDAYS_ATLAS_40.25.20.md` (neu)
