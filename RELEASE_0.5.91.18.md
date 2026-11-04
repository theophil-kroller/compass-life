# Compass Life 0.5.91.18 · Fitdays+ Smart Tape: Körperkarte, Umfangsverlauf & Health Import Hub

**Basis:** GitHub `theophil-kroller/compass-life`, Branch `main`, Version `0.5.91.17`, Commit `4878948460728faf9a2108ac8fc6c0c51c0ce4ff` (04.11.2026).

## Live-Import aus Fitdays+

- Erstes Fitdays+-Smart-Tape-Exportformat anhand einer echten Exportdatei verifiziert. Die Datei trägt `.csv`, enthält aber tatsächlich einen **Excel-OLE2/BIFF-XLS-Container**. Der Health Import Hub erkennt den Dateiinhalt und liest ihn mit dem vorhandenen XLS-Parser ein, unabhängig vom irreführenden Dateisuffix.
- Verifiziertes Tabellenlayout: `Time`, `Head`, `Neck`, `Shoulder`, `Chest`, `Waist`, `Hip`, `L Arm`, `R Arm`, `L Thigh`, `R Thigh`, `L Calf`, `R Calf`, `Waist-to-Hip Ratio`.
- Die zwölf echten Umfangsspalten werden einzeln in Zentimeter übersetzt und mit Datum, Uhrzeit und Quelle versehen: Kopf, Hals, Schulter, Brust, Taille, Hüfte, linker/rechter Oberarm, linker/rechter Oberschenkel, linke/rechte Wade. Importiert werden nur tatsächlich vorhandene Messwerte, keine erfundenen Werte. Die gerundete Hersteller-WHR-Spalte wird nicht als eine zusätzliche Umfangsmessung interpretiert.
- **Ein bestehender Speicher:** `nutritionJournal.bodyMeasures88` (verschlüsselte Journal-Persistenz, identisch zur vorbereiteten Coach-Messwertstruktur). Keine neue Datenbank, keine Datenmigration, kein Überschreiben älterer Coach-Werte.
- Wiederholter Import derselben Datei produziert keine Dubletten. Ein zweiter wirklicher Messzeitpunkt am selben Tag bleibt eine eigene Beobachtung. Fitdays+-Waagen- und Garmin-Import bleiben getrennt und unverändert.
- Importvorschau und Bestätigung zeigen die Anzahl erkannter und neu gespeicherter Tape-Umfänge. Die bestehende Smart-Import-/Health-Import-Review-Oberfläche ist der Einstiegspunkt.

## Insights → Körper

- Körperübersicht als interaktive Silhouette mit zwölf klickbaren Punkten und zugänglichen, daneben angeordneten Bereichskarten.
- Rechts auf Desktop, unter der Silhouette auf Mobilgeräten: gewählte Region mit letztem Umfang, Δ in cm/% gegenüber vorheriger Messung, Änderung seit Beginn des gewählten Zeitraums und echte gemessene Kurvenpunkte (Dot-/Linienplot).
- Bei nur einem Messzeitpunkt eindeutig **Baseline – noch kein Vergleich möglich**. Beobachtete Steigung erst ab mindestens fünf Messpunkten an vier Tagen über mindestens 14 Tagen; keine Extrapolation.
- Schulter-/Taillen- und Taillen-/Hüft-Verhältnis aus jeweils zugehörigen echten Messwerten. Links/rechts aus Sicht der gemessenen Person, nicht der betrachtenden Person.
- Erklärender Hinweis: Umfangsveränderung beweist noch keinen Muskelzuwachs oder Fettabbau. Keine automatische Coach-Progressionsänderung aus Tape-Daten.
- Vorhandene Fitdays-Körperkompositionsgrafiken und dynamische Körperdarstellung bleiben erhalten. Karte wird auch angezeigt, wenn ausschließlich Tape-Daten und keine Fitdays-Waagenwerte vorliegen.

## Datenschutz und Installation

- Die persönliche Beispielmessdatei wurde **nicht** in die öffentlichen ZIP-Archive aufgenommen. Tests arbeiten ausschließlich mit synthetischen Werten bei identischer bestätigter Exportstruktur.
- Vorhandene Daten des Tresors, Garmin-Sessions, Nutrition, Finanzen und Zeitjournal bleiben unverändert. Es findet **kein automatischer Import** der im Chat hochgeladenen Datei in die persönliche Compass-App statt: Datei im Health Import Hub auf dem eigenen Gerät auswählen und bestätigen.
- Patch nur auf Version 0.5.91.17 anwenden; Full Source alternativ vollständig installieren. Nach dem GitHub-Upload GitHub Actions auf echten Vite-Build und Deploy kontrollieren.

## Prüfstatus

- `node --test` mit gezielten Smart-Tape-, Coach-Preparation-, Garmin- und Body-Layout-Tests: **24/24 erfolgreich**.
- `npm run check:deploy`: **33/33 erfolgreich**, Importgraph und Worker-Checks erfolgreich.
- `node --check`: neue Tape-Datei, Health-Import und Hauptanwendung syntaktisch gültig.
- Der gesamte historische Testlauf (`npm test`) wurde gestartet, überschritt in dieser Umgebung jedoch das 120-Sekunden-Limit. In den bis dahin protokollierten 1.893 Tests traten die **35 bereits bekannten historischen Altfehler** auf. **Kein vollständiger Gesamtabschluss** wird behauptet.
- Der kompilierte Vite-Produktionsbuild war lokal nicht möglich, da die npm-Abhängigkeiten einschließlich Vite nicht installiert sind. Der Full-Source-ZIP ist **vollständiger Quellcode**, kein bereits kompilierter Dist-Ordner.
