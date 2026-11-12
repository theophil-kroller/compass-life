# Compass Life 0.5.91.43 · Überlagerte V-Taper-Proportionen & Oberkörper-Fokus

Baseline: vollständiger Compass-Life-Quellstand **0.5.91.42** (lokales Source-ZIP). Keine direkte GitHub-Schreiboperation; kein verschlüsselter persönlicher Tresor im Paket.

## Sichtbarer Körpervergleich

- Insights → Körper: **eine Überlagerung** der ersten und letzten passenden Smart-Tape-Messung statt zwei kleiner, nebeneinander gezeichneter Figuren.
- Blaugrau = vorher, Gold = aktuell; grün markiert im 2D-Querschnittsmodell größer gewordene Körperbreiten, blau kleiner gewordene.
- Umschalter: **Originalmaßstab (Standard)**, **Unterschiede ×5** (klar als optisch überbetont gekennzeichnet) und **Ganzer Körper**.
- Schultern, Brust, Taille, Hüfte werden mit Original-Umfangsdifferenzen in Zentimetern beschriftet; die Modelle verwenden außerdem getrennte Arm-, Oberschenkel- und Wadenumfänge, soweit vorhanden.
- Gleicher Ursprung, gleiche 2D-Modellannahmen und gleiche metrische X-Skalierung an beiden Tagen. **Wichtig:** Umfänge bestimmen keine anatomisch exakte 3D-Körperkontur oder gemessene Frontalbreite. Elliptische Tiefe und Segmenthöhe sind angenommene Modellparameter. Ein optisch schmaler Unterschied bedeutet keine Beweiskraft für Muskelwachstum.
- Bereits vorhandene Pump-Kontextdaten bleiben sichtbar. Die gespeicherten Zentimeter werden nicht verändert.

## Muskelkarte

- **Gestern:** dunkles Bordeauxrot `#a63e53` statt blassrosa. **Heute:** kräftiges Rot `#ed4b42`. Die Priorität heutiger Sätze bleibt erhalten.

## V-Taper-Coach: gezieltere Übungsauswahl

- Für 25-Minuten-V-Taper-Einheiten werden nach Möglichkeit **mindestens 2 von 3 Übungen** aus Rücken/Lat, Schultern, Brust, Bizeps oder Trizeps ausgewählt.
- Heim-Pool enthält nun ausdrücklich Liegestütz-Varianten, Kurzhantel-Bodendrücken, Bizepscurls, Hammercurls, Trizepsstrecken und liegendes Trizepsstrecken; Schulterseiten und hintere Schultern bleiben relevante Hauptziele.
- Kernmuskulatur wird weiterhin regelmäßig eingeplant. Beinübungen werden als gelegentliche **Kraft-Erhaltungseinheiten** angeboten, statt dauerhaft knappe Oberkörper-Slots zu verdrängen. Radfahren wird nicht als Kraftsatz umgedeutet.
- Die Rotation berücksichtigt gemeldete und bestätigte Sätze, 7-Tage-Exposition, zuletzt beanspruchte Regionen und die vorhandenen Sicherheits-/Regenerationssperren.
- Workout-Preview zeigt nun die Oberkörper-Priorität und den gewählten Übungsanteil. StrongLifts 5×5 bleibt unabhängig und unverändert.

## Qualitätskontrolle

- Neue Tests zur 2D-Überlagerung, cm-Skalierung, Farbpriorität, Körperdaten-Unveränderlichkeit, Trainingsauswahl und 22 aufeinanderfolgenden exemplarischen Tagen erfolgreich.
- `npm run check:deploy` **33/33 bestanden**.
- `npm test` **2.233 bestanden / 66 fehlgeschlagen**; die 66 Testnamen sind identisch mit 0.5.91.42 (keine neuen Fehltests).
- Vollständiger lokaler Vite-Produktionsbuild **nicht bestätigt**: `vite` ist in dieser Laufzeit nicht installiert (exit 127). Bitte GitHub Actions vor Nutzung kontrollieren.

## Installation

**Patch-ZIP nur auf exakt 0.5.91.42 anwenden.** Archiv im Repository-Root entpacken und die Verzeichnisstruktur erhalten. Bei abweichender Basis vollständiges Source-ZIP verwenden. Keine Vault-Daten enthalten.
