# Compass 0.5.77.40 — Anatomische Muskelkarte & Muskel-Hover

Basierend auf dem erfolgreich veröffentlichten 0.5.77.39.

## Änderungen

- Die bisherige handgezeichnete, polygonale Körper-SVG wird **vollständig ersetzt**.
- Neu: professionell nachgezeichnete Muskelregionen aus der quelloffenen, lokal gebündelten Bibliothek `body-muscles` (Apache-2.0).
- Mehr als 70 einzelne SVG-Masken (Vorder- und Rückseite), gegenüber den groben früheren Körperflächen.
- Mapping der feineren Muskeln auf die bestehenden **Compass-Trainingsdaten** (25 interne anatomische Muskelregionen).
- Die Ansichten Kraft / Radfahren / Gemeinsam und Rollen / Belastung bleiben bestehen.
- Mit der Maus über eine Muskelregion: **deutscher Muskelname und dokumentierte Satzbeteiligung**.
- Auf Handy: **Antippen** blendet denselben Hinweis ein.
- Für Tastatur: Tab zur Muskelregion; Enter/Leertaste fixieren den Hinweis; Escape schließt ihn.
- Die externe Bibliothek wird in den Vite-Build aufgenommen; **kein CDN-Zugriff zur Laufzeit**.
- Apache-2.0-Lizenz und Attribution werden mit ausgeliefert.

## Sicherheit und Interpretation

- Eine Modellzuordnung aus Übungen ist keine gemessene Muskelaktivierung oder Erschöpfung.
- Radfahrminuten werden nicht in Kraftsätze umgerechnet.
- Keine Anpassungen an Verschlüsselung, Trainingsjournal, Ernährung oder Garmin-Import.

## Hinweis zu der Bildvorlage

Das ist eine neue, anatomisch wesentlich detailliertere Illustration; die zuvor gezeigte proprietäre Referenzgrafik wird nicht 1:1 als Datei kopiert.
