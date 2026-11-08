# Compass Life 0.5.91.37 — Muskelkarte & dynamischer Entsperrstatus

**Basis:** GitHub main, Compass 0.5.91.36, SHA `0bcc507fd799808bcb6cef15409d1ccab16ceb75`.

## Muscle Map — vollständige Zuordnung
- Alle 68 Übungen haben eindeutige primäre, sekundäre und stabilisierende Anatomie-Regionen. Die kanonischen Tabellen wurden beibehalten und vollständig getestet.
- Verifizierte Coach-Sätze ohne gespeicherte Wiederholungszahl bleiben als bestätigte Satzbeteiligung sichtbar, **ohne** eine Wiederholungszahl oder Gewicht zu erfinden. Garmin-Summary ohne konkrete Übung bleibt unzugeordnet.
- Eindeutig identifizierte englische Namen wie „Dumbbell Reverse Fly“, „Reverse Dumbbell Fly“, „Seated Bent-Over Rear Delt Raise“ werden dem vorhandenen `reverse-fly`-ID zugeordnet. Nur tatsächlich identifizierte Namen werden übernommen, keine unspezifischen FIT-Kategorien oder unerkennbaren Übungen.
- Die Premium-Muskelkarte färbt heute bestätigte primäre Muskeln rot, unterstützende gelb, reine Stabilisatoren türkis; Vortag in den letzten 7 Tagen orange.
- Die Einzelübungsbibliothek zeigt dieselben 3 Muskelrollen einschließlich deutscher anatomischer Namen, damit die Zuordnung für jede Übung nachvollziehbar ist.
- Bestehende Workouts, Gewichte, RIR, gespeicherte Trainingshistorie, Fotos, Coach-Auswahl und aktuelle 25-Minuten-Planung bleiben unverändert.

## Lockscreen
- Reagiert auf die reale Formularübermittlung mit einer dezenten Navy-/Gold-Animation und sichtbaren Phasen: Tresor entschlüsseln, Entwürfe laden, Arbeitsraum vorbereiten, Eingangspuffer prüfen, Compass öffnen.
- Anzeige und Sperre des wiederholten Submit werden bei einem Fehler zurückgesetzt. Der Original-Entsperrvorgang bleibt alleiniger Wahrheits- und Verschlüsselungsweg.
- Kein Lesen, Speichern oder Protokollieren der Passphrase im UI; `prefers-reduced-motion` respektiert.
- Visualisiert laufende Arbeit. Diese Änderung behauptet keine beschleunigte Entschlüsselung; Performance kann separat optimiert werden.

## Teststand
- 7 neue gezielte Tests: bestanden.
- 84/84 weitere gezielte Tests inklusive neuer Tests: bestanden.
- 33/33 Deployment-Checks: bestanden, Importgraph 284 Module ohne fehlende relative Imports.
- Größerer Legacy-Regressionstest: 113/124 inklusive neuer Tests bestanden, **11 bekannte Testfehler**, gegen unveränderte Vorversion reproduziert (106/117 bestanden). Keine neu entstandenen Fehler in diesem Vergleich.
- `node --check` der geänderten JS-Dateien: bestanden.
- Lokaler Vite-Produktionsbuild nicht ausführbar (`vite: not found`, npm dependencies fehlen). GitHub Actions prüft beim Upload.
- Patch und Full-Source-Archiv: SHA-256/ZIP-Integrität und identischer Quellstand geprüft.

**Datenschutz:** Originale Fotos, Gesundheits- und Trainingsdaten sind nicht enthalten. Keine Änderungen direkt an GitHub vorgenommen.
