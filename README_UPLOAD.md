# COMPASS LIFE 0.5.77.59.28 — V-Taper / Ars Vivendi / Wim Hof / BCAA

**Fertiger GitHub-Upload. Keine lokalen Skripte ausführen.**

Basis: Commit `bfdb2f6d2bddee910894f861076cc1a6ef0ff69f` (erfolgreicher Workflow #258).

## Installation

1. ZIP entpacken.
2. Im Repository `theophil-kroller/compass-life` auf Branch `main` den Inhalt des ZIPs **mit derselben Ordnerstruktur** hochladen.
3. Nur `client/vite.config.js` wird ersetzt. Alle anderen Dateien im Paket sind neu. Bestehende 7 Premium-WebP-Fotos bleiben unverändert.
4. GitHub Actions abwarten und den neuen Workflow kontrollieren. Wenn der CI-Check fehlschlägt, bitte die Logzeilen übermitteln.

## Änderungen

- **V-Taper statt StrongLifts als Primärziel**: einmalige Migration der Coach-Präferenz auf V-Taper (danach frei änderbar). Latissimus, laterale/hintere Schultern und Rumpf im Fokus; StrongLifts bleibt opt-in.
- **Bodyweight-Übungen**: Pike Push-up, Decline Push-up, Prone Y-Raise, inklusive 3 neuer Premium-WebP-Doppelfotos. Nur für die neuen Übungen; alte Grafiken bleiben erhalten.
- **Trainingsstatus**: konservativer Score 0–100 zur **Abdeckung der bestätigten Daten**, keine Fitness-/Muskelreife-Messung. Anfänger-, geübte und länger dokumentierte Routine als vorläufige Kategorien; keine willkürliche Maximalgewicht-Schwelle für Madcow.
- **Ars Vivendi**: drei goldene Touch-Ringe mit Bewegung, kein sichtbarer quadratischer Touch-Rahmen, angezeigte Buildnummer am Lockscreen. Die reale Verschlüsselung und Passphrase-Form bleiben unverändert.
- **Version sichtbar**: `COMPASS_CLIENT_VERSION` nach allen historischen Build-Transforms = 0.5.77.59.28; Footer zeigt dieselbe Nummer.
- **Wim Hof**: während tatsächlicher Wiedergabe verhindert eine Routine-Markierung das App-interne Auto-Lock nach 15 Minuten. Nach regulärem Ende 5-Minuten-Sperrfrist. Fortschritts-Checkpoint alle 15 Sekunden und Wiedereinstieg bei Unterbrechung. Eine nur gestartete/pausierte Routine wird **nicht** fälschlich als beendet gezählt.
- **Geführtes Krafttraining**: derselbe App-internen Sperrschutz während aktiver Übung und 5 Minuten nach Abschluss.
- **BCAA Alphaminos 2:1:1 Wassermelone**: Nutritions-Kachel mit Portion 13 g, 35 kcal, 6,9 g Eiweiß; Leucin 5 g, Isoleucin 2,5 g, Valin 2,5 g und BCAA gesamt 10 g. Angaben nach fotografiertem Etikett. Nach abgeschlossenem Workout erscheint eine optionale Erinnerung (ohne erfundene exakte Timing-Frist oder automatisches Protokollieren).
- **Bild-Offline-Cache**: nur beim Öffnen geladene V-Taper-Fotos werden nach Erstansicht offline gespeichert.

## Noch nicht enthalten

- Biometrische Entsperrung. Für einen sicheren Fingerprint-/Passkey-Unlock ist ein separates Key-Wrapping-/WebAuthn-PRF-Verfahren samt Rückfalloption und Sicherheitsprüfung erforderlich. Der Patch enthält **keinen** Fake-Fingerabdruck-Login.
- Klinische Schätzung der Regeneration oder physiologisches 'Advanced' basierend auf wenigen Trainingsdaten.
- Kein automatischer Nachtrag einer Wim-Hof-Habit, wenn Android die App vor dem tatsächlichen Audio-Ende beendet.

## Teststatus

- 7 gezielte Node-Tests erfolgreich auf den festgehaltenen Quellankerstrukturen; dazu Syntaxprüfung der Plugin- und Hilfsdateien.
- Quellanker gegen aktuellen GitHub-Stand überprüft; die beiden bestehenden Coach-Dateien im Vergleichsstand stimmen bytegenau mit GitHub überein.
- **Vollständige `npm run check`-/Vite-Deployment-Suite kann nur mit allen Repository-Abhängigkeiten über GitHub Actions bestätigt werden.** Keine Aussage über Deployment-Erfolg vor CI.

## Quellen (Orientierung)

- StrongLifts: Madcow 5×5, FAQ / Intermediate – Wechsel, wenn lineare Steigerung bei guter Technik/Erholung länger stockt; keine universelle starre kg-Grenze.
- ACSM (2026), Resistance Training Prescription for Hypertrophy – individualisierte Progression und Trainingsvolumen.
- ISSN, Position Stand Protein and Exercise; systematic review zu BCAA (2025): Gesamtprotein und essentielle Aminosäuren wichtiger als ein enges BCAA-Zeitfenster.
