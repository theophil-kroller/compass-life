# Compass 0.5.77.59.12 — Sakura Sakura & Makko-Ho Identity

Basis: erfolgreich deployte Compass 0.5.77.59.11. Upload durch Ersetzen/Hinzufügen der Dateien **an exakt denselben Pfaden**.

## Ersetzen

- `client/src/makko-ho-guide-v5775910.js`
- `client/src/makko-ho-guide-v5775910.css`
- `client/public/gtd-workspace-premium-v577599.js`
- `client/public/gtd-workspace-premium-v577599.css`
- `client/public/makko-ho-illustrations-v5775911/metal.webp`
- `client/public/makko-ho-illustrations-v5775911/earth.webp`
- `client/public/makko-ho-illustrations-v5775911/fire.webp`
- `client/public/makko-ho-illustrations-v5775911/water.webp`
- `client/public/makko-ho-illustrations-v5775911/innerfire.webp`
- `client/public/makko-ho-illustrations-v5775911/wood.webp`

## Hinzufügen

- `client/public/makko-ho-music-v5775912/sakura-sakura-compass.mp3`
- `tests/compass-05775912-sakura-mobile.test.mjs`

**Keine** `client/vite.config.js` ersetzen: Die Bridge-Reihenfolge bleibt identisch.

## Was geändert ist

1. Sechs neue KI-generierte, einheitliche Makko-Ho-Illustrationen: schwarzer Gi, Grüngürtel, langer Haarstil / Haarknoten. Die zweite Position zeigt die tiefe Rücklage **mit Kopf am Boden**. Diese tiefere Pose ist nur für entsprechend geübte Personen geeignet; alternative Ausführung bleibt im Hinweis beschrieben.
2. Musik: eigens erstellte instrumentale Koto-inspirierte Aufnahme der traditionellen, gemeinfreien Melodie *Sakura Sakura*. Eine Aufnahme aus fremden Quellen wird **nicht** verwendet.
3. Musik standardmäßig an (sofern nicht individuell ausgeschaltet). Nach Klick auf Makko-Ho Play wird die Audiodatei bei Bedarf geladen, lokal im Browser Cache Storage gespeichert und leise wiedergegeben. Signalton kurzzeitig priorisiert. Auf Geräten mit restriktiver Autoplay-Regel kann nach dem Laden ein Tippen auf „▶ Start“ nötig sein; dies wird im Player angezeigt.
4. Projekt-Plus auf Mobile: Auswahl „Neuer Ordner / Neues Projekt“. Bestehende `tree-add-folder`/`tree-add-project`-Aktionen werden unverändert verwendet.
5. Bilder sind mit `?v=5912` adressiert, damit bereits gecachte alte WebP-Dateien nicht angezeigt werden. Die originalen Bildpfade bleiben unverändert.

## Urheberrecht / Musik

Die Melodie *Sakura Sakura* ist traditionell/gemeinfrei, u.a. 1888 veröffentlicht: https://ja.wikisource.org/wiki/さくらさくら. Die hier beigefügte WAV-/MP3-Einspielung wurde **neu programmiert und selbst synthetisiert**, ohne Nutzung einer fremden Tonaufnahme. Es handelt sich um eine schlichte, ruhige Interpretation; das verwendete timbrale Klangbild ist nur Koto-inspiriert, keine authentische Koto-Einspielung.

## Tests

- JS-Syntax für Guide und GTD-UX geprüft.
- 8 lokale Node-Regressionstests inkl. bestehender .59.11-Fälle bestanden.
- Browser-Smoketests Chromium: Desktop 1300px und Smartphone 390px, alle sechs Übungsbilder, Audio nur nach Player-Aufruf, Timer, Mute/Unmute, Navigation, keine JS-Ausnahme.
- Mobiles Action Sheet: Projekt- und Folder-Erstellung rufen unveränderte Datenaktionen auf.

Der vollständige GitHub-Actions-Workflow ist **nicht** lokal ausgeführt und muss beim Upload bestehen.
