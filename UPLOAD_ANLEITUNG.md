# Compass 0.5.77.59.23 – Strength Coach UX / Pause 90+90

## GitHub Upload (Dateipfade beibehalten)

1. `client/src/strength-guided-v5775920.js` (ersetzen)
2. `client/src/strength-guided-v5775920.css` (ersetzen)
3. `client/src/strength-coach-v5775910.js` (ersetzen)
4. `client/src/strength-coach-v5775910.css` (ersetzen)
5. `client/public/strength-visuals-v5775920/dumbbell-pullover.webp` (NEU)
6. `tests/compass-05775923-coach-rest-ux.test.mjs` (NEU)

## Änderungen

- 3-Minuten-Ruhepause: erste 90 Sekunden und zweite 90 Sekunden; einmaliger kurzer Vibrationsimpuls nach 90 Sekunden, sofern Android/Browser Vibration API erlauben.
- Countdown läuft bis 0 und wechselt nie automatisch zur nächsten Übung.
- Größeres Bild im geführten Workout, weniger Leerraum.
- Pullover als Foto/Einzelphase statt Strichmännchen; hier noch **kein** überprüftes Start-End-Bewegungspaar.
- Coach-Einstieg deutlich gekürzt; Equipmentdetails und Datenlage bei Bedarf aufklappen.
- Garmin-FIT, Vault, Makko-Ho, Wim-Hof und Lockscreen unverändert.

## Hinweise

- Die Aufnahme des Pullovers ist eine beispielhafte Illustration, keine vollständige Technikschulung; der sichere Bewegungsumfang ist individuell.
- iOS/Safari und manche Energiesparmodi erlauben `navigator.vibrate` nicht. Die Pause funktioniert ohne Vibration identisch.
- Vor Veröffentlichung GitHub Actions kontrollieren: lokale Checks ersetzen nicht den vollständigen Repo-Build.
