# Compass Life 0.5.77.52 — Chart-first Health & Body

Basis: GitHub `main`, 0.5.77.51 (Commit `b42e627`, GitHub Actions #213 erfolgreich).

## Sichtbare Änderungen

- **Schlaf:** Der vorhandene Sleep-Intelligence-Bereich wird vor Hinweisen und Herkunftstext angezeigt. Schlafkonsistenz, Wochenverteilung, HRV-Referenz und Schlaf-HRV-Streudiagramm erscheinen beim ersten Öffnen **ausgeklappt**. Quellen/Provenienz hinter einer freiwillig öffnbaren Detailsektion; andere Befunde bleiben sichtbar.
- **Stress:** Der tatsächlich importierte Garmin-Tagesplot mit Tagesschalter steht vor der Messwertstatistik und langen Erklärungen. Distribution, Stresshistorie und Rolling-Median bleiben erhalten und werden in einer übersichtlicheren Komposition dargestellt.
- **Body Battery:** Der tatsächliche Tagesverlauf steht vor den Tageshöchst-/Tiefwerten und Quervergleichen; Lücken und tatsächliche Messpunkte bleiben unverändert.
- **Körper:** Gewicht-Dot-Plot als große Hauptgrafik; Körperfett/Muskelmasse darunter. Garmin-Krafttraining, Protein, Fitdays-Segmentanalyse und Zusammensetzungsdiagramme bleiben sichtbar. Lediglich die danach nochmals wiederholten Gewicht-/Fettverlaufsgrafiken im historischen Fitdays-Block werden optisch unterdrückt (exakte Duplikate der Hauptgrafiken).
- Kompaktere Titel-, Filter-, KPI- und Chart-Abstände, ruhiges Green/Copper-Design, mobil einspaltig.

## Wichtig

Die UI-Vorschau aus dem vorherigen Chat war eine Designvision, **kein Screenshot des tatsächlichen Builds**. Dieser Build modernisiert gezielt die bestehenden Gesundheitsgrafiken und stellt keine vollständige Neuerstellung der Oberfläche dar.

## Technische Umsetzung

- `client/compass752-bridge.js`: fail-closed Vite-Integration für `main.js` und `insights.js`. Keine großen Quellcode-Forks.
- `client/src/chart-first-v57752.css`: CSS auf Gesundheit-/Körper-Insights begrenzt, ohne „Heute“ oder andere Appbereiche zu verändern.
- `client/vite.config.js`: Reihenfolge .50 → .51 → .52, historische Tests bleiben gültig.
- Alle Nutzdaten, Importe, Periodenfilter, Vault-/Worker-/D1-Schemas und GTD-Funktionen unverändert.

## Validierung

17/17 Regressionstests für 0.5.77.50/.51/.52 lokal erfolgreich; JS-Syntaxprüfungen erfolgreich; CSS ohne Parsingfehler. **Ein vollständiger Vite-Produktionsbuild ist hier nicht ausführbar, ohne das vollständige Repository und seine Dependencies. GitHub Actions bestätigt den Build erst nach dem Upload.**

## Geplante Roadmap

- 0.5.77.53: Finance Dashboard — wichtige Diagramme zuerst und mehr Daten pro Bildschirm.
- 0.5.77.54: Intelligence-Cockpit als anpassbares visuelles Dashboard.
- 0.5.77.55: Arbeitszeit, Zeitjournal & GTD-Lesefluss.
- 0.5.77.56: visuelle Regression, Responsive QA & Performance.
