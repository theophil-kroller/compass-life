# Compass 0.5.12 · Orte & Reisen — local-first

## Was neu ist

Unter **Insights → Orte** gibt es erstmals eine lokale Weltkarten- und Aufenthaltsauswertung. Die Karte ist bewusst schematisch und lädt **keine** Kartendaten von fremden Servern. Sie zeigt aggregierte Aufenthaltsgruppen aus tatsächlichen Google-Maps-Timeline-Besuchsintervallen oder selbst eingetragenen Aufenthalten, keine vermuteten Reiserouten.

Neue Module:

- **Weltkarte und Ortsliste:** Gruppen in einem groben Koordinatenraster (~0,25°; ortsabhängige Kilometerentfernung), Aufenthaltsanzahl und erfasste Dauer. Ortsnamen lassen sich selbst vergeben.
- **Reiseverlauf:** Zeitlich sortierte Besuchsintervalle mit Beginn/Ende und Quelle. Es werden keine Verbindungsrouten zwischen Orten erfunden.
- **Schlaf nach Ort:** Eine Garmin-Schlafnacht wird nur dann einem Ort zugewiesen, wenn ihr Zeitmittelpunkt eindeutig in genau einem Aufenthaltsintervall von wenigstens zwei Stunden liegt. Das ist eine *explorative Zuordnung*, kein Nachweis des tatsächlichen Schlaforts. Überlappende oder fehlende Daten bleiben unzugeordnet.
- **Bulk-Import:** Modernes Android-Timeline-JSON (`semanticSegments` mit `visit`) und ältere Google-Takeout-Formate (`timelineObjects` mit `placeVisit`). Mehrere JSON-/ZIP-Dateien (bis zu 12 pro Durchlauf), Vorschau vor Übernahme, Dublettenprüfung.
- **Manueller Aufenthalt:** Ort, Koordinaten sowie Start- und Endzeit eintragen und bestätigen. Einträge und eigene Ortsnamen können wieder gelöscht werden.

## Export / Import

Bei Google Maps auf Android: **Profilbild → Meine Zeitachse → Menü → Einstellungen & Datenschutz → Zeitachsendaten exportieren.** Die genaue Benennung hängt von Android-/Maps-Version ab. Teile dein Original-Timeline-Archiv nicht öffentlich. Selektiere in Compass ausschließlich die gewünschten Dateien; ein kompatibler Geräteexport ist nicht auf allen Android-Versionen garantiert.

**Einschränkungen:**

- Nur echte Besuchsintervalle, keine Roh-GPS-Punkte, `timelinePath` oder Bewegungsrouten.
- In einigen aktuellen Google-Exporten liegen nur Place-IDs und Koordinaten vor. Compass behauptet daher keine Stadt-/Straßennamen; benenne Orte bei Bedarf manuell.
- Bestehende Garmin-FIT-Dateien werden hier nicht als Nachweis für den Übernachtungsort herangezogen.
- Aus großen, alten oder anders strukturierten Timeline-Archiven können Teile unlesbar sein. Warnungen erscheinen in der Importvorschau. Für den ersten Test empfiehlt sich ein einzelner Zeitraum.
- Die App synchronisiert die präzisen Standortdaten **nicht** auf andere Geräte und sendet sie nicht zum Worker.

## Installation

1. Vorher ein verschlüsseltes Backup des lokalen Compass-Vault erstellen.
2. `Compass_0.5.12_GITHUB_PATCH.zip` **entpacken**. Dateien mit unveränderten relativen Pfaden nach `theophil-kroller/compass-life` (`main`) hochladen, nicht die ZIP selbst.
3. [GitHub Actions – Deploy Compass Web](https://github.com/theophil-kroller/compass-life/actions) muss erfolgreich durchlaufen.
4. Auf dem PC dieselbe bestehende PWA im Browser neu öffnen und den vorhandenen Vault entsperren. Unter **Insights → Orte** einen Timeline-JSON-/ZIP-Export auswählen, die Vorschau prüfen und bestätigen.
5. Karte, Reiseverlauf und Ortszuordnung prüfen. Nur wenn der Aufenthaltszeitraum eine importierte Garmin-Nacht eindeutig umfasst, kann Schlaf nach Ort angezeigt werden.

**Keine neue D1-Migration. Kein neuer Cloudflare-Worker. Keine Android-APK.** Web/PWA-only.

## Datenqualität, Statistiken und Schutz

Alle genauen Standort- und Schlafdaten verbleiben im lokal verschlüsselten Vault. Der Import verarbeitet die Datei im Browser. Originalarchive werden nicht im Vault gespeichert. Keine externe Karten-API, kein Reverse Geocoding und kein Standort-Cloud-Sync.

Aufenthaltsgruppen verwenden ein räumliches Raster statt Geocoder-Adressen; ein Gruppenname ist daher nur ein eigener Titel oder ein vom Export stammender Hinweis. Schlafmittelwerte nach Ort sind deskriptiv. Kleine Stichproben, wechselnde Zeitverschiebungen und mehrdeutige Aufenthalte begrenzen die Aussagekraft. Nicht aus einer Korrelation auf die Ursache schließen.

## Qualitätsprüfung

- `node --test tests/*.test.mjs`: **150/150 erfolgreich** einschließlich Tests für neue und ältere Timeline-Formate, Dubletten, Ungültigkeiten, Schlaf-Matching und HTML-Escaping.
- `node --check` für die geänderten JavaScript-Module erfolgreich.
- Visuelle Layoutprobe mit Chromium bei **1440 px Desktop / 390 px Mobil**: Karten und Weltkarte sichtbar; kein horizontales Seiten-Overflow.
- Der echte Vite-Produktionsbuild steht bis zum grünen GitHub-Actions-Deploy aus. Kein Live-Test mit einem persönlichen Google-Timeline-Geräteexport, weil ein solcher noch nicht vorliegt.

## Weiterer Ausbau

Später: Standort-/Schlafstatistiken mit Mindestdatenmenge, Ort × Produktivität und Stress; optional verschlüsselte Monats-/Jahresaggregate. Für Finanzen sind bislang nur Konzepte und Exporthilfen angelegt; kein Import von Raiffeisen-Buchungen in dieser Version.
