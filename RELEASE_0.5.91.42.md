# Compass Life 0.5.91.42 · Aktiver V-Taper-Coach & verständliche Progression

Baseline: 0.5.91.41. Repository unverändert; keine persönlichen Daten exportiert.

## Was neu ist

- **Coach fordert aktiv heraus:** Bei dokumentierter guter Leistungsreserve (mehrere Sätze mit RIR ≥ 3) und realistisch verfügbarer Hantelstufe erscheint im Workout-Preview ein konkreter Vorschlag für den nächsten Arbeitssatz. Auch bei zweimal über mehrere Tage erreichten Obergrenzen sind vorsichtige Versuche ohne ausdrücklich dokumentierte RIR denkbar. Es werden keine RIR erfunden.
- **Gewichtsvorschlag ist voreingestellt, aber nicht als geleistet gespeichert.** Der Nutzer kann vor Satzbestätigung den Vorschlag ändern; keine automatische Bestätigung, keine Änderung der Historie. Frühere selbst gewählte höhere Gewichte gehen als neue Basis ein.
- **Belastungsgrenzen:** Bei Schmerzen, Erholungswarnungen, Deload oder zu großem tatsächlichem Lastsprung kein riskanter erhöhter Versuch; stattdessen Wiederholungsziel oder Erholungsaufgabe. Bestehende StrongLifts-5x5-Logik bleibt unberührt.
- **Klare Kraftprogression:** Gruppierung Schultern, Bauch & Rumpf, Rücken, Unterkörper, Brust & Arme. Anzeige der Veränderungen zwischen erster und letzter dokumentierter Einheit sowie der einzelnen Kurven und kurzen V-Taper-Motivationssätze. Keine unbegründete Gleichsetzung von höherem Gewicht mit größerem Muskel.
- Unterbrochene Workouts übernehmen Challenge und vorgeschlagenes Gewicht aus dem verschlüsselten Snapshot.

## Tests

- `node --check` der geänderten JavaScript-Dateien erfolgreich.
- `npm run check:deploy`: 33/33 Tests bestanden.
- `npm test` abschließend: 2.226 bestanden, 66 geerbte Altfehler. Die 66 Fehlschläge sind anhand ihrer Namen identisch mit der vorherigen Version; keine neuen Fehltests.
- Vite-Produktionsbuild wurde in diesem Container nicht abgeschlossen (fehlende installierte Vite-Dependencies). GitHub Actions muss nach dem Upload den Deployment-Build validieren.

## Installation

Patch ausschließlich auf exakt 0.5.91.41 anwenden, Dateien mit Verzeichnisstruktur ins Repo hochladen. Andernfalls Full-Source-Archiv verwenden. Nach GitHub-Upload automatischen Deploy prüfen. Kein persönlicher Tresor enthalten.
