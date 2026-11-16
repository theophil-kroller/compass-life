# Compass Life 0.5.91.51 — Mensa-Lade-Hotfix

**Base:** 0.5.91.50.

## Ursache
In 0.5.91.50 wurde das dynamisch geladene Mensa-Modul zwar gesetzt, aber der neue Render erst nach `mutate()` (verschlüsseltes Speichern) und optional `syncPersonalJournal()` (Netzwerk) ausgelöst. Auf langsamen Systemen blieb deshalb der Text „Mensa-Datenbank wird geladen …“ sichtbar. Bei einem gescheiterten Modulimport war der Fehler nicht sichtbar; die UI zeigte denselben Ladehinweis.

## Korrektur
- Nach erfolgreichem dynamischem Import die Mensa-Ansicht **sofort zeichnen**.
- Initialisierung des Seed-Katalogs und optionalen Journal-Abgleich **nach dem ersten Paint** ohne Blockieren der Ansicht ausführen.
- Versagender oder hängender Chunk-Import: Nach spätestens 12 Sekunden eine sichtbare Fehlermeldung mit **Erneut laden**; keine unendliche Retry-Schleife.
- Mensa-Modul nur beim Öffnen von **Insights → Ernährung → Mensa** importieren. Das Öffnen von „Heute“ startet weder den Import noch einen Mensa-Netzwerkaufruf.

## Unverändert
- Focus → Extended beim Mensa-Rechercheklick, Offenhalten überfälliger Aufgaben und JSON-Import mit GPT-rich-text-Daten.
- Bestehender Lebensmitteldatenbestand, Mensa-Katalog, Ernährungsjournal und alle Vault-Daten. Keine Datenmigration.

## Prüfungen
- 4 neue Lade-Tests (erster Render vor Seed & Sync, dynamischer Importfehler, Navigation, Wiederholaktion) bestanden.
- Release-Checks: 33/33.
- Gesamttest: 2.279 bestanden; die gleichen 66 historischen Fehltests wie in 0.5.91.50; keine neuen Fehltests.
- Lokaler Vite-Produktionsbuild mangels Abhängigkeiten nicht ausführbar; nach dem Hochladen GitHub Actions prüfen.
