# Compass 0.5.77.6 — Recherche-Importvertrag & Poster-Vorschau

## Importieren muss bei allen generierten Rechercheprompts funktionieren
- Gemeinsamer `events`-Parser entfernt nur unzulässige, von ChatGPT eingefügte URL-Escape-Zeichen INNERHALB von JSON-Strings (z. B. `https\://www\.museum-joanneum.at/projekt\_2026`). Valide JSON-Formatierung und strukturelle Escape-Sequenzen bleiben erhalten.
- Zusätzlich wird ein bereits JSON-gültiger, aber in der URL noch doppelt escaped Link nach dem Parsing normalisiert.
- `startDate` bzw. `start_date` wird als Alternativfeld für das Pflichtfeld `date` akzeptiert; analog `end_date`, `start_time`, `sourceURL`, `posterUrl`. Die gespeicherte Eventstruktur bleibt unverändert.
- `films`-Nachimporte für Filmtexte/Poster verwenden denselben toleranten JSON-Parser. Vorhandene Filmvorführungen werden nicht umgeschrieben, solange kein bestätigter Import erfolgt.
- Der generierte Prompt beschreibt das gemeinsame Schema für **alle** 10 Recherchebuttons eindeutig: `date` ist stets Pflicht (auch bei laufenden Ausstellungen und Wintersport-Saisonangaben), `endDate` optional, korrekt formatierte HTTPS-URLs ohne zusätzliche Backslashes.

## Klare Rückmeldung statt stiller Importfehler
- Das JSON-Eingabefeld behält seine Eingabe über „Import prüfen“ und Fehler hinweg.
- Parse-/Validierungsfehler werden in einem gut sichtbaren Fehlermeldungsbereich direkt am Importformular angezeigt. Bei erfolgreicher Prüfung erscheint die Vorschau inklusive neu/bekannt und die Bestätigung.
- Eingaben werden erst nach ausdrücklich bestätigtem Import geleert.

## Kinoposter-Vorschau (Fix aus dem noch nicht ausgelieferten Zwischenstand)
- Ein vorgeschlagenes Poster gilt nur dann als ladbar, wenn die Browser-Bildprüfung erfolgreich ist. Defekte URL-Vorschläge sind unmarkiert, können manuell ersetzt werden, und es gibt eine Möglichkeit den nächsten Batch zu prüfen.

## Verifikation
- Nutzeroriginal „Museen · Kunst & Kultur“ vom 22.10.2026: 132 von 132 Events wurden inklusive ihrer zuvor nicht parsebaren Quellenlinks erfolgreich normalisiert, validiert und für die Sync-Warteschlange vorbereitet.
- Contract-Tests für alle 10 Recherchebuttons, für Film-Metadaten-JSON und für rückwärtskompatible Datumsfelder.
- `npm test`: 839/839 bestanden.
- Worker Syntaxprüfung: erfolgreich. Vite-Produktion nicht lokal gebaut (`vite` in der Umgebung nicht installiert); GitHub Actions prüfen.
- Keine D1-Migration; kein Worker-Update gegenüber 0.5.77.5 erforderlich.

**Wichtig:** Der Parser repariert bekannte Escape-Tippfehler, aber er erfindet weder Termine noch fehlende Belege. Ungültige Datumsangaben oder unvollständige Events werden präzise gemeldet und nicht stillschweigend übernommen.
