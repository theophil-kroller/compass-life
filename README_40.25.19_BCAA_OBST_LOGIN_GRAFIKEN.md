Compass 0.5.77.59.40.25.19 — Patch für letzten erfolgreichen GitHub-Deploy #330 (SHA 549ec7afae037dc080c792b8bf19801db7d8fd7d)

A. Wieder im Schnellmenü: PROFUEL Alphaminos BCAA (13 g, 35 kcal, Leucin 5 g, Isoleucin 2,5 g, Valin 2,5 g), Banane roh (120 g Essanteil), vorhandener Apfel unverändert.
B. Makro- und Mikronährstoffprofil für Banane und bestehenden Apfel; BCAA separat als isolierte Aminosäuren, NICHT automatisch als 10 g vollwertiges Protein. Unbekannte Werte bleiben unbekannt. Daily Dozen zählt Banane und Apfel als Obst, Supplement nicht. Anti-Aging-Eight zeigt Obst-Ballaststoff-Evidenz nur als Teilinformation.
C. Ein gemeinsamer, zentraler sichtbarer Release-String für Login, App-Seitenleiste und Footer. Beim nächsten Release client/src/compass-release-v57759402519.js EINMAL aktualisieren; alte historische Build-Konstante im Snapshot bleibt aus Kompatibilitätsgründen erhalten.
D. Fitdays-inspirierte Einordnungsbalken mit Beschriftungen, größerem Marker und Matrix mit Feldern/Kreuzhair. BMI-Referenz laut allgemeinen Erwachsenenkategorien; übrige Spalten ohne erfundene Fitdays-Risikozonen. Bereits vorhandene Dot-Plots, Segmentgrafiken unverändert.

Sicherheit: Keine Migration, kein neues persistiertes Feld, keine Änderung an Vault/Journal-Cloud-Sync und keine Modifikation vorhandener Einträge.

Prüfung: npm test: 1.758 Tests bestanden; gezielte Profil-/Mengen-/Daily-Dozen-/Versions-/Grafiktests grün; Syntax okay.
Produktions-Vite-Build lokal NICHT ausgeführt (Abhängigkeiten sind in der Laufzeit nicht installiert). GitHub Actions nach Upload prüfen.
Patch: ZIP-Root entspricht Repository-Root; Dateien mit bestehender Ordnerstruktur ersetzen/ergänzen. Nicht gleichzeitig Full Source hochladen.
