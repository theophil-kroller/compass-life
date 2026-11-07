# Compass Life 0.5.91.35 – V-Taper-Schulterbalance und Homegym-Optionen

**Ausgangsstand:** GitHub `main`, Compass 0.5.91.34, Commit `6206d760d0145f941bdeabf61a26bac2f1c0c8eb` (07.11.2026).  
**Lieferung:** Patch + Full Source. Keine direkten Schreibzugriffe auf GitHub. Bestehende Benutzer-/Trainingsdaten werden weder migriert noch überschrieben.

## Quellcodebefund

- Home-V-Taper-Plan hatte das Kurzhantel-Seitheben, aber kein eingeplantes Reverse Fly. Die bestehende Schulter-/Wochenlogik fasste alle Deltateile zusammen.
- `face-pull` und `reverse-fly` waren im Übungskatalog, nicht jedoch in der bisherigen täglichen Home-V-Taper-Auswahl. `dumbbell-shoulder-press` war nur in anderen Zielplänen, nicht in der V-Taper-Heimauswahl.
- Für Frontheben fehlte eine eigene kanonische Übungs-ID. `coach34RecommendedSets` war importiert, jedoch bei der täglichen Planung nicht angewendet.
- Vorhandene RIR-, Gewichts-, Satz- und Recovery-Pipelines bleiben erhalten.

## Änderungen

1. Neues read-only Schultermodell `strength-vtaper-balance-v059135.js`, auf bestätigten und bereits deduplizierten Coach-/Garmin-Sätzen. Für die Schulterköpfe anterior/lateral/posterior: direkte Zielmuskelarbeit = 1 Satzbeteiligung, indirekte synergistische Arbeit = 0,35. Stabilisations-/Anti-Rotationsarbeit erhält keinen Schulter-Hypertrophie-Credit. **Heuristik, keine EMG-Messung, keine objektive Regenerationsdiagnose.**
2. Dynamische Smart-V-Taper-Auswahl für drei Übungen in 25 Minuten, mit Priorität seitliche/hintere Schulter, Rücken, zugleich Rotation von Beine, Brust, Rumpf und Waden. Keine tägliche pauschale Anfügung der fünf Schulterübungen; Frontheben bleibt freiwillig. Auch 45/65-Minuten-Pläne sind weiterhin möglich.
3. Kanonische Übungsdatenbank erweitert von 66 auf 68 Übungen um `dumbbell-front-raise` und `assisted-pullup`. Neue Anatomie- und Stabilisierungsrollen sowie START-/ENDE-Techniktexte. Für diese beiden Bewegungen wurden **keine neuen fotorealistischen Bildpaare** erstellt; der Coach zeigt stattdessen explizit textbasierte START-/ENDE-Hinweise. Alle bisherigen Bilddateien bleiben unverändert.
4. `reverse-fly` im automatischen Home-V-Taper-Pool, mit HWS-schonender sitzender/gestützter Technikvariante als Hinweis. Bestehende `dumbbell-lateral-raise`, Shoulder Press und Face Pull korrekt berücksichtigt. Bei gemeldeten HWS-/Schmerzbeschwerden keine neue Überkopf-Press-Planung und keine Laststeigerung.
5. Bestehende adaptive Satzlimitierung `coach34RecommendedSets` **in die reale Planerstellung** eingebaut. Schwere/entlastete Trainingstage und bestätigte RIR-Evidenz wirken weiterhin über die unveränderte Progressionsberechnung. HWS-Schonung und Soft-Caps verhindern blindes Mehrvolumen.
6. Optionales Homegym-Modul `strength-home-attachments-v059135.js`: Kabelzug mit Umlenkrolle, Stahlseil, Loading Pin und Seilgriff sowie Wand-Klimmzugstange/Assistenzbänder werden als **vorhanden, aber standardmäßig NICHT montiert/freigegeben** geführt. Ausschließlich nach ausdrücklicher Geräteprüfung/-bestätigung per Checkbox werden Kabelzug- und Band-Klimmzugübungen zu Hause freigeschaltet; die Studioübungen bleiben normal nutzbar. Dieser Gerätestatus wird wie der vorhandene Scheibenbestand **lokal im Browser** gespeichert (nicht automatisch über Geräte hinweg synchronisiert).
7. Übungsbibliothek kann die neuen Übungen im bisherigen verschlüsselten Trainingserfassungspfad starten; neue Geräte werden für Home nur mit gesichertem Montageflag angeboten. Bestehender Guided Player, Checkpoints, Set-Kreise, Satzgewichts- und RIR-Korrekturen bleiben unverändert.
8. Vorhandene Scheibenübersicht bleibt eingeklappt und verändert keine Player-Overlays.
9. Standardziel bei noch nicht existierenden Coach-Präferenzen ist V-Taper. Bereits gespeicherte Trainingseinstellungen bleiben unverändert.

## Qualitätsprüfung

- Neue Schulter-/Equipment-/Vorbereitungs-Tests: 17/17 bestanden.
- Realer `planNextWorkout` mit CSS-Testloader: 5/5 bestanden, einschließlich acht aufeinanderfolgender bestätigter Trainingstage und unverändertem StrongLifts A/B.
- Relevante Strength-/Player-/Anatomie-Regression: 118/118 bestanden (historische Testannahmen nur an 68 kanonische IDs / aktualisierte Version / moderne Coach-Architektur angepasst).
- Release-/Deploy-Checks: 33/33 bestanden.
- `node --check` der geänderten JS-Dateien: bestanden.
- **Produktionsbuild lokal nicht verfügbar**, da `vite`/npm-Abhängigkeiten hier nicht installiert sind (`sh: vite: not found`); der GitHub-Actions-Build ist noch nicht bestätigt. Release-Checks und Syntaxprüfungen ersetzen den echten Produktionsbuild nicht.
- Patch-/Full-Source-Rekonstruktion, ZIP-CRC und Versionsidentität nach dem Packen geprüft.

## Grenzen und Sicherheit

- Es handelt sich um evidenzbasierte Planungsheuristiken, nicht um die Messung einzelner Muskelaktivierung, klinische Therapie oder eine Trainingsfreigabe bei akuten Beschwerden.
- Die Montageverfügbarkeit ist nicht fernprüfbar. Vor Aktivierung muss die sichere Befestigung, Tragfähigkeit und Seilführung vor Ort überprüft werden.
- Für die zwei neuen Übungen existieren noch keine freigegebenen personalisierten Fotos. Bis dahin zeigt Compass statt generischer Strichmännchen zwei genaue Bewegungstexte.
- Keine automatische Änderung historischer Trainingsdaten oder Gewichtsangaben; Nutzer bestätigt jeden Satz wie zuvor.
