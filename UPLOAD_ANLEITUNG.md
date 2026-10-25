# Compass 0.5.77.59.18 – Makko-Ho Musikbibliothek

## GitHub-Upload

ZIP entpacken und die folgende Verzeichnisstruktur im Repository `theophil-kroller/compass-life` **genau beibehalten**:

**Ersetzen:**
- `client/src/makko-ho-guide-v5775910.js`
- `client/src/makko-ho-guide-v5775910.css`

**Neu hinzufügen:**
- `client/public/makko-ho-music-v5775918/sakura-dance.mp3`
- `client/public/makko-ho-music-v5775918/henshin-koto.mp3`
- `client/public/makko-ho-music-v5775918/japan-koto-folk.mp3`
- `tests/compass-05775918-makko-music-choice.test.mjs`

Die Datei `MUSIK_LIZENZEN.md` ist Dokumentation im ZIP; bei Bedarf im Repository unter `docs/` speichern.

## Verhalten

In **Makko-Ho** das kleine **⚙** neben „♫ Musik“ antippen und den gewünschten Titel auswählen. Die Auswahl bleibt **auf diesem Gerät im Browser gespeichert** und wird beim nächsten Öffnen wiederhergestellt. Die Lautstärke wird ebenfalls gespeichert, die Ein/Aus-Einstellung bleibt wie bisher erhalten.

Bei laufender Übung schaltet ein Titelwechsel sofort um. Bei pausiertem Timer wird der neue Titel gespeichert und erst nach ▶ wiedergegeben. Musikauswahl und Lautstärke haben keine Auswirkungen auf den Gong-Timer und den Screen Wake Lock.

**Standard beim ersten Start:** „Sakura Dance“.

Alle drei Aufnahmen werden *nicht* beim Start von Compass oder beim Öffnen des Makko-Ho-Players vorab geladen; sie werden nur beim Abspielen ihrer jeweiligen Auswahl angefordert. Die Dateien bleiben in Originalqualität und erhöhen lediglich die Größe des GitHub-Repositories bzw. des Deploy-Artefakts (zusammen etwa 14,4 MB). Offline-Wiedergabe ist abhängig vom Browser-Cache; ein vollständiger Offline-Audiocache wird nicht garantiert.

## Qualitätssicherung

- 30/30 gezielte Node-Regressionstests (einschließlich der vorherigen Makko-Ho-Verträge)
- Chromium-Browserprüfung bei 360, 390 und 1440 px
- Musikwechsel bei laufendem Timer, Auswahl und Lautstärke nach erneutem Öffnen, keine Audio-Ladeanforderung vor Play
- JavaScript-Syntaxprüfung

**Nicht geprüft:** kompletter GitHub-Actions-Produktionslauf nach dem Upload.

## Lizenzhinweis

Die drei vom Nutzer bereitgestellten Musikstücke stammen aus der Pixabay-Bibliothek. Details und Originalseiten stehen in `MUSIK_LIZENZEN.md`. Musik nicht als eigenständiges MP3-Produkt vertreiben; die Pixabay Content License gestattet ihre Verwendung als Hintergrundmusik in einem größeren Werk.
