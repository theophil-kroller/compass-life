# Compass Life 0.5.91.36 – Zwei personalisierte Übungsbildpaare

Basierend auf dem auf GitHub verifizierten Quellstand **0.5.91.35**. Nur Bilder und die dazugehörigen Übungsvorschauen wurden erweitert.

- **Dumbbell Front Raise**: Eigenes, fotografisch wirkendes Bildpaar (START / ENDE) im Guided Workout und in der Übungsbibliothek.
- **Assisted Pull-Up**: Eigenes Bildpaar (START / ENDE) im Guided Workout und in der Übungsbibliothek. Übung bleibt bis zur ausdrücklichen Montage-Freigabe der Klimmzugstange gesperrt.
- Beide WebP-Dateien liegen unter `client/public/strength-visuals-v059136/` und werden über die bestehende Base-URL-Logik geladen. Auf mobilen Geräten bleiben Bilder innerhalb des scrollbaren Artwork-Bereichs und überdecken keine Satz-, RIR- oder Gewichtseingaben.
- Sämtliche bisherigen Grafiken und Trainingsdaten bleiben unverändert.
- Die KI-Illustrationen wurden aus den zuvor zusammen erstellten und freigegebenen Motiven zugeschnitten. Sie sind keine echten Fotos und keine biomechanisch validierten Technikreferenzen. Das ursprüngliche hochgeladene Privatfoto wurde NICHT in den Code aufgenommen.

## Installation

ZIP-Patch entpacken, alle enthaltenen Pfade unverändert im Repository `theophil-kroller/compass-life` auf `main` hochladen. Voraussetzung: Version **0.5.91.35**. Alternativ die Full Source als kompletten Quellstand verwenden. Nie Full Source als Unterordner hochladen.

## Prüfstatus

Siehe tatsächliche Testläufe im Veröffentlichungsbericht. GitHub Actions muss den echten Vite-Produktionsbuild und Pages-Deploy noch bestätigen.

## Test- und Paketprüfung (7. November 2026)

- 6/6 neue Bild- und Integrationstests bestanden.
- 113/113 relevante Strength-/Bildregressionstests bestanden (inklusive der 6 neuen).
- 33/33 vorhandene Release-/Deployment-Prüfungen bestanden.
- Die ursprünglichen historischen Bilddateien haben unveränderte SHA-256-Prüfsummen.
- Der lokal angeforderte Produktionsbuild mit `npm run build` konnte nicht durchgeführt werden: In der Arbeitsumgebung ist `vite` nicht installiert (`sh: vite: not found`). **GitHub Actions muss den tatsächlichen Build bestätigen.**
