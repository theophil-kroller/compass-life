# Compass 0.5.77.48 – GitHub-Upload

**Voraussetzung:** Compass 0.5.77.47 ist im Repository vorhanden. Das letzte bestätigte GitHub-Actions-Deployment dafür war #208 erfolgreich.

Dieses ZIP enthält **fertige GitHub-Dateien**, kein selbst auszuführendes Patchskript.

## Ersetzen

- `client/vite.config.js`
- `tests/compass-057747-capacity.test.mjs`

## Neu hochladen

- `client/compass748-bridge.js`
- `client/src/capacity-calendar-v57748.js`
- `client/src/capacity-calendar-v57748.css`
- `tests/compass-057748-calendar-packets.test.mjs`

Die Pfade müssen identisch bleiben. Im ZIP enthaltene `.md`-Dateien sind optional und informieren über Änderung und Prüfung.

## Funktionstest nach erfolgreichem GitHub-Deploy

1. In **Insights → Fristen & Kapazität** öffnen. Unter dem bisherigen Fristenmodul erscheint die kalendergestützte Vorschau.
2. Fokusbudget aus 0.5.77.47 setzen (z. B. 10 h/Woche, 20 % Puffer).
3. Für eine vorhandene Aufgabe Stückzahl/Minuten pro Einheit und gewünschte Blocklänge einstellen und speichern.
4. Über **Kalender verbinden / aktualisieren** die Daten bei Bedarf erneuern.
5. Mit gültigem, vollständigem Kalender sollten Vorschläge erscheinen, die nicht mit bestehenden Ereignissen kollidieren.
6. Ist der Kalender veraltet oder unvollständig, zeigt Compass stattdessen einen Hinweis und **keine** vermeintlich freien Zeitfenster.
7. Beispiel mit GTD-Fortschrittszähler prüfen: 60 Prüfungen, davon 20 korrigiert, bedeuten 40 offene Einheiten.

## Einschränkungen

- Vorschläge sind **keine** Termine im Google Calendar; ein Klick reserviert noch nichts.
- Die Schätzwerte werden im lokalen Vault gespeichert; eine neue geräteübergreifende Synchronisation dieser Planungseinstellungen wurde **nicht** eingebaut.
- Wochenstunden sind deine bewusst vorgegebene konzentrierte Arbeitskapazität, keine Prognose aus Gesundheitsdaten.
- Der echte vollständige Vite-Produktionsbuild muss durch GitHub Actions bestätigt werden.
