Compass UI-Reparatur: Muskelkarte vorne/hinten + Prüfungen direkt zuordnen + Bücher
Basis: aktueller GitHub-Stand nach erfolgreichem Workflow #322 (Commit 04988e5).

Enthaltene Änderungen:
  client/src/strength-insights-full-repair-v57759402511.js  [neu]
  client/src/main-full-v57759402510.js
  client/src/focus-productivity-v57759402510.js
  client/src/focus-productivity-v57759402510.css
  client/src/receipt-categories-v57745.js
  client/src/receipt-gpt-v57743.js
  tests/compass-40-25-11-premium-exams-books.test.mjs [neu]

1. Gesundheits-Insights > Krafttraining: reale Premium-Muskelkarte vorne UND hinten nebeneinander.
   Bestehende Daten, Trainingsansichten und importierte Garmin-Sets werden nicht verändert.
   Die 70+ anatomischen Pfade stammen weiterhin aus bereits installierter Dependency 'body-muscles'.

2. Zeit & Produktivität > Fokus: "Prüfungen – bitte zuordnen" und "Jetzt zuordnen"
   sind anklickbar; öffnen direkt die erste von mehreren nicht klassifizierten Sessions.
   Nach Speichern einer Sitzung wird automatisch die nächste angeboten.
   Nicht nach Kalender, Notizen oder Titeln geraten; nur manuell gespeicherte Wahl.
   Historische Garmin-Daten bleiben erhalten; Bearbeitung im lokalen E2EE Tresor.

3. Einkaufslisten > Statistik & Rechnungsimport: eigene Kategorie 📚 Bücher
   in Produktzuordnungen und monatlichem Ausgabenbild; eindeutige Buchbezeichnungen
   werden erkannt, unbekannte Titel sind weiterhin manuell klassifizierbar.
   Bestehende Bontexte, Preise und E2EE-Kategorisierungsregeln bleiben unverändert.

Installation: nur Dateien aus dem PATCH-Archiv im GitHub-Repo ersetzen/ergänzen,
mit identischen relativen Pfaden. Keine Datenbankmigration, kein Cloudflare-SQL.
Vollquelle nur als Alternative, nicht zusammen mit dem Patch importieren.

Nach Upload unbedingt GitHub Actions: Deploy Compass Web auf grün prüfen.
Das ist keine abgeschlossene Live-Deployment-Bestätigung.

Verifizierung in dieser Umgebung:
  npm run check : 1.721 Tests bestanden, 0 fehlgeschlagen
  node --check  : geänderte JS-Dateien bestanden
  ZIP CRC / sha256 geprüft
  Vite-Produktionsbuild: NICHT lokal ausgeführt, da NPM-Registry nicht erreichbar
    (EAI_AGAIN bei npm install). GitHub Actions soll den Vite-Build prüfen.

Hinweis zum sichtbaren Versionslabel: Wegen bestehender historischer
Full-Source-Assertions bleibt der eingefrorene Entry intern auf 0.5.77.59.40.25.10.
Der Release-Dateiname dient allein der Patch-Kennung, nicht einer vorgetäuschten
Versionssteigerung. Keine Änderung des Service-Worker-Caches oder PWA-Migrationsverhaltens.
