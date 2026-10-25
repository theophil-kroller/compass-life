# Compass 0.5.77.59.15 – Deployment Test Repair

## Diagnose
GitHub Actions Deploy Compass Web #242 (commit `375045f`) stoppt bei `npm run check`.
1 von 1305 Tests schlägt fehl: `Makko guide has six named positions and a paused, adjustable timer`
(`tests/compass-05775910-strength-habits.test.mjs`, Zeile 70).

Die alte Testfassung verlangte `AudioContext` für einen synthetischen Signalton. In
0.5.77.59.14 ist der Gong absichtlich auf eine echte Audioaufnahme (`new Audio(GONG_DEFAULT_URL)`)
umgestellt worden. Es ist ein veralteter Testvertrag, kein Grund, einen synthetischen Gong wieder
in die App einzubauen.

## GitHub-Upload
Nur diese Datei ersetzen:
`tests/compass-05775910-strength-habits.test.mjs`

**Nicht** `package.json`, `client/vite.config.js` oder den Makko-Ho-Player ändern.
Im ZIP sind ausschließlich die korrigierte Testdatei und diese Anleitung enthalten.

## Prüfung
Die Originalversion des Tests ist mit identischem Git-Blob-Hash
`92803994baf145511638150e45f34c5533d744d5` aus dem Repository übernommen worden.
Die aktuelle Player-Datei mit Hash `cb9cb6209358f5310f900537bd201b2c19d3a786`
ist in der lokalen Testumgebung unverändert.

- Reproduktion vor Patch: 6/7 bestanden; 1 Fehler bei `AudioContext`.
- Nach Patch: 7/7 bestanden.
- `node --check` erfolgreich.
- GitHub #242: 1304/1305 Tests bestanden; **vollständiger erneuter Actions-Lauf nach Upload erforderlich**.

## Inhaltliche Teständerung
- Alte, überholte Erwartung an `AudioContext` entfernt.
- Prüfung für aufgenommene Gongquelle, einmaliges Auslösen bei Zielzeit,
  Weiterzählen und Abwesenheit von Oszillator-/Synthesizer-Fallback ergänzt.
- Sechs Übungen, Timer, Pause, nächste Übung und Abschluss bleiben geprüft.

Die Änderungen beeinflussen nur den Test, nicht die produktive App.
