# Compass 0.5.77.59.39 · Context Intelligence & Radar Layout

Basis: GitHub Actions #274 (erfolgreicher Source-/Deploy-Snapshot von 0.5.77.59.38, Commit b836b99550669a8eaabff4e512b60e5b7c72aa13).

## Neuer Standortkontext

- Dezente Kontext-Leiste in **Heute** mit passenden Schnellzugriffen für Zuhause, Arbeit und unterwegs.
- Manuelle Wahl jederzeit, ohne Berechtigungsdialog möglich. Anfangszustand ist **Unbekannt**.
- Die Ortszonen **Zuhause** und **Arbeit** müssen an den jeweiligen Orten ausdrücklich per Gerät festgelegt werden (100 bis 1.500 m Radius; Grundeinstellung 300 m).
- Optionale automatische Standortprüfung nur nach Aktivierung. Beim Anzeigen von „Heute“ höchstens alle 30 Minuten; nur bei **bereits gewährter Browser-Freigabe** und sichtbarer App. Keine permanente Hintergrundüberwachung.
- Unklare, ungenaue oder überlappende GPS-Messungen ergeben „Unbekannt“, keine frei erfundene Zuordnung.
- Die Ortszentren bleiben ausschließlich im lokal verschlüsselten Compass-Tresor; kein Upload der Koordinaten, keine Laufstrecke oder Standortliste gespeichert. Ein letzter erkannter Kontext (ohne GPS-Koordinaten) läuft nach 2 Stunden ab.
- Die Schnellzugriffe verwenden vorhandene GTD-Kontext-Tags und bestehende Tab-Routen. Es gibt keine neuen Pflichtkategorien.
- Die Browser-/PWA-Geolocation benötigt HTTPS und Zustimmung. Bei geschlossener App gibt es keine verlässliche automatische Erkennung.

## Visuelle Korrektur

- Die neue Kontextleiste verwendet einen sehr kompakten Kopf und eine einklappbare Einstellungsfläche mit begrenzter Höhe, statt breite Formulare in der Heute-Ansicht zu platzieren.
- Responsives Life-Balance-Radar: längere Achsenbeschriftungen bekommen größere SVG-Außenränder; die Detailspalte wandert bei schmalen Fenstern unter das Diagramm; Umbrüche und Überläufe werden reduziert.

## Bestehende Funktionen

Family Radar (Nathanael), Kalendercache, Forecast, persönlicher Abendrhythmus, Daily Dozen, Coach und lokaler Tresor bleiben erhalten. Der Familie-/Abendroutine-Designer selbst wird nicht neu gestaltet; dieser Build konzentriert sich auf Kontext und Layout.

## Teststatus

`npm run check`: 1.495 Tests bestanden (inklusive 8 neuer Tests zu Geofencing, Datenschutz, GTD-Kontexten und Integration). Die vollständige bestehende Vite-Plugin-Quelltextkette wurde im Rahmen der Regressionstests auf dem realen `main.js` ausgeführt und auf Syntax geprüft.

Der vollständige `vite build` konnte mangels installierter npm-Abhängigkeiten hier nicht ausgeführt werden. GitHub Actions prüft `npm install`, `npm run check` und `npm run build` beim Deployment.

## Upload

Für ein Update nur die Inhalte des Patch-Archivs in das Rootverzeichnis von `theophil-kroller/compass-life` hochladen. Die Ordnerstruktur **muss erhalten bleiben**. Full Source nur alternativ für einen vollständigen Quellcode-Snapshot verwenden, nicht zusätzlich über den Patch hochladen.
