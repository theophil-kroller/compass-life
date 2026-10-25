# Compass 0.5.77.59.22 – Ars Vivendi Lockscreen

## Upload nach GitHub (`theophil-kroller/compass-life`)

Entpacke die ZIP. Lade **nur** diese fünf Dateien jeweils unter exakt dem vorhandenen Verzeichnispfad ins Repository hoch:

| Datei | Zweck |
|---|---|
| `client/index.html` | Ein zusätzlicher Module-Import nach `main.js`; alle bisherigen Imports bleiben erhalten |
| `client/src/ars-vivendi-lock-v5775922.js` | Visueller Lockscreen und Anbindung an das echte Vault-Formular |
| `client/src/ars-vivendi-lock-v5775922.css` | Responsive Vollbildgestaltung und entsperrbares Passphrase-Sheet |
| `client/public/ars-vivendi-lock-v5775922.png` | Dein dunkelblaues Originalmotiv, für PWA-Precache verkleinert (unter 2 MiB) |
| `tests/compass-05775922-ars-vivendi-lock.test.mjs` | Security-/UX-/Build-Regressionsprüfungen |

**Wichtig:** ZIP nicht selbst in GitHub hochladen. `client/public` ist der richtige Ordner – nicht das Root-Verzeichnis. Es sind keine Vault-, Worker-, Datenbank- oder Vite-Konfigurationsdateien zu ändern.

## Verhalten

1. Compass startet bei gesperrtem Vault mit der großen „Ars Vivendi“-Illustration.
2. Auf den goldenen Kreis „ENTSPERREN“ tippen (auch per Tastatur erreichbar).
3. Das bereits bestehende Passphrase-Formular öffnet sich als dunkles Sheet.
4. Erst wenn `vault.unlock()` über den bestehenden Handler erfolgreich ist, verschwindet der Lockscreen.
5. Beim erneuten Sperren erscheint dasselbe Motiv wieder.
6. Auf einem noch nicht eingerichteten Gerät öffnet derselbe Kreis die reguläre Ersteinrichtung mit Passphrase-Wiederholung.

**Sicherheit:** Es gibt keinen neuen Authentifizierungspfad. Die echten Passphrase-Inputs werden aus dem bestehenden Vault-Formular verschoben, nicht kopiert. Die Bild-Tap-Zone ruft `vault.unlock()` nicht auf. Der Hintergrund ist währenddessen nicht bedienbar.

**Offline:** Das PNG ist kleiner als die bestehende Workbox-Precache-Grenze und wird vom vorhandenen `*.png`-Glob erfasst. Der Lockscreen benötigt nach Installation keinen externen Bild-Host.

## Qualitätssicherung

- `node --test tests/compass-05775922-ars-vivendi-lock.test.mjs`
- Chromium-Mockprüfung bei 360 × 800, 390 × 844 und 1440 × 900: Sperrbildschirm → Dialog → korrekte Passphrase → App → erneutes Sperren.
- Das gesamte GitHub-Actions-Deployment muss nach dem Upload noch erfolgreich bestätigt werden; der komplette Compass-Vite-Build wurde hier nicht ausgeführt.
