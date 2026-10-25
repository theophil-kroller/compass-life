# Compass 0.5.77.59.14 – Deploy Repair & Makko-Ho Premium

**Abgleich:** GitHub main Commit `1c16708` (#241 fehlgeschlagen).

## Upload: Pfade exakt beibehalten

1. ERSETZEN `client/public/gtd-workspace-premium-v577599.js` (Fix #240/#241: nur ein globaler Keydown-Listener).
2. ERSETZEN `client/src/makko-ho-guide-v5775910.js` (Dehnzonen, Koto und aufgenommener Gong).
3. ERSETZEN `client/src/makko-ho-guide-v5775910.css` (Overlay).
4. ERSETZEN `client/public/makko-ho-illustrations-v5775911/metal.webp` (Hände/Finger in Pose 1).
5. NEU `tests/compass-05775914-makko-deploy.test.mjs`.

Keine Änderungen an Vite-Plugins, D1, Vault oder Synchronisierung.

## Wichtige Audio-Details

Die bisherige synthetische Sakura MP3 wird **nicht** mehr abgespielt. Neue Standardmusik: "Koto Traditional Japanese Music" von Prettysleepy (Pixabay), abgespielt vom originalen CDN erst nach dem Öffnen des Players. Browser benötigt für den ersten Aufruf Internet, anschließend ist Cache möglich (je nach CORS-/Browser-Verhalten). Die Aufnahme ist nicht in diesem ZIP, sie ist extern gehostet.

Quelle: https://pixabay.com/music/world-koto-traditional-japanese-music-264711/
Direkte offizielle CDN-Audiodatei: https://cdn.pixabay.com/download/audio/2024/11/15/audio_157298f798.mp3?filename=koto-traditional-japanese-music-264711.mp3
Lizenz: https://pixabay.com/service/license-summary/ – bitte aktuelle Nutzungsbedingungen prüfen.

**Echter Gong standardmäßig online**: Aufgenommene Gong-MP3 (Alexander / Orange Free Sounds, CC BY 4.0), Quelle https://orangefreesounds.com/large-gong-struck-once/ – die Aufnahme wird erst nach Player-Start lazy geladen und nach Möglichkeit lokal zwischengespeichert; der Urheber ist im Player genannt. Bei fehlendem Internet und noch leerem Cache ist der Gong möglicherweise stumm. Du kannst alternativ über `Gong-Aufnahme` eine eigene lizenzierte MP3/WAV/OGG auswählen; sie wird nur lokal im Browser-Cache gespeichert. **Keine synthetischen Sinustöne mehr.**

Die beiden echten Aufnahmen sind externe Assets. Sie sind **nicht im ZIP gebündelt**, weil die Binärdateien in dieser Umgebung nicht heruntergeladen werden konnten. Die App lädt sie im Player direkt von den Anbieter-URLs; bei Online-Ausfall kann das Audio daher stumm bleiben.

## Tests

`node --test tests/compass-0577599-gtd-workspace.test.mjs tests/compass-05775914-makko-deploy.test.mjs`

Das ZIP enthält nur Änderungen; bestehende Bilder der anderen fünf Posen unverändert lassen.
