# Compass 0.5.77.59.11 – Makko-Ho Premium Illustrationen

**Basis:** erfolgreich deploytes Compass 0.5.77.59.10 im GitHub-Repository `theophil-kroller/compass-life`.

## GitHub-Upload (Pfadstruktur exakt beibehalten)

### Drei bestehende Dateien ersetzen

- `client/src/makko-ho-guide-v5775910.js`
- `client/src/makko-ho-guide-v5775910.css`
- `client/vite.config.js`

### Sieben Dateien neu hinzufügen

- `client/public/makko-ho-illustrations-v5775911/metal.webp`
- `client/public/makko-ho-illustrations-v5775911/earth.webp`
- `client/public/makko-ho-illustrations-v5775911/fire.webp`
- `client/public/makko-ho-illustrations-v5775911/water.webp`
- `client/public/makko-ho-illustrations-v5775911/innerfire.webp`
- `client/public/makko-ho-illustrations-v5775911/wood.webp`
- `tests/compass-05775911-makko-premium.test.mjs`

**Wichtig:** Die sechs Bilder müssen in genau diesem Unterordner landen. Nicht ins Repo-Hauptverzeichnis legen und nicht unter `client/src/` verschieben.

## Änderungen

1. Sechs eigenständige, hochwertige Ganzkörperillustrationen ersetzen schematische SVG-Strichfiguren. Die traditionelle sechsteilige Makko-Ho-Folge und ihre Reihenfolge bleiben erhalten.
2. Jede Illustration zeigt die Zielhaltung mit sichtbaren Armen, Knien und Beinen; größere Grafik auf Desktop und Mobile, ruhiges Apple-inspiriertes Layout.
3. Barrierefreiheit: sinnvolle deutsche Alt-Texte pro Übung; Beschriftung 'Zielhaltung'.
4. Der Timer, Audio-Signal, Pause, Dauerwahl, Schrittwechsel und Habit-Abschluss bleiben unverändert.
5. **On-demand:** Makko-Player wird weiterhin erst auf Play per `import()` geladen; danach wird jeweils nur die aktuell angezeigte WebP-Datei angefordert. Insgesamt 93,772 Byte für alle sechs Bilder (~91.6 KiB).
6. Service-Worker cached die WebPs via `CacheFirst` erst nach dem tatsächlichen Aufruf (der vorhandene Install-Precache enthält kein WebP), danach sind die jeweils gesehenen Bilder offline verfügbar.
7. Keine neue Bridge, keine DB-Migration, keine Eingriffe in andere Habits oder Strength-Coach-Funktionen.

## Teststatus

- `node --check` für JS und Vite-Konfiguration: PASS.
- Neue Tests: 4/4 PASS.
- Bisherige `.59.10`-Tests gegen identische .59.10-Vite-Bridge/Testumgebung: 7/7 PASS.
- Chromium-UI-Smoke: sechs Bilder pro Gerät laden, keine vorherigen Bildrequests, Timer läuft, Weiter bis Abschluss, kein horizontaler Überlauf bei 1320 px und 390 px: PASS.
- Vollständiger produktiver Build und die gesamte GitHub-CI-Suite werden erst nach GitHub-Upload geprüft.

## Inhaltliche Grenzen

- Die Originalillustrationen sind visueller Haltungskompass, keine überprüfte therapeutische Übungsanleitung. Besonders die kniende Rücköffnung zeigt die **tiefere** Variante; langsam und nur innerhalb des schmerzfreien Bereichs ausführen, alternativ aufrecht bleiben.
- Bei Perikard/Dreifacherwärmer und Holz zur Halbzeit Seite wechseln (die bestehenden Tipps bleiben erhalten).
- Die traditionelle Zuordnung zu Meridianen ist ein Shiatsu-Konzept, keine gemessene physiologische Wirkung.

## Rollback

Im Problemfall nur `client/src/makko-ho-guide-v5775910.js`, `.css` und `client/vite.config.js` aus der vorherigen erfolgreich deployten Version `.59.10` wiederherstellen. Die sechs neu hinzugefügten WebP-Dateien können zunächst im Repo bleiben, da sie nicht automatisch geladen werden.
