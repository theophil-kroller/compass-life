# Compass Life 0.5.91.63 — Gerätesperre, Outlook/Google-Duplikate, Daily-Dozen-Kompaktanzeige

**Ausgangsbasis:** Full Source `0.5.91.62` (REALMIX Ube Latte enthalten). Dies ist ein quellcodebasierter Build, der noch im gewöhnlichen GitHub-Pages-Workflow kompiliert und veröffentlicht werden muss.

## 1. Tresorsperre · weniger Unterbrechungen

- Bisher: Automatische Sperre standardmäßig nach 15 Minuten Inaktivität; im Tresor speicherbare Optionen 15, 30, 60 Minuten.
- Neu: **Standard 60 Minuten** für Browser ohne Geräte-Einstellung. Wählbar sind 15, 30, 60, 120 oder 240 Minuten.
- Unter **System → Lokaler Tresor** erhält die Auswahl ausdrücklich den Zusatz **dieses Gerät**.
- Die Dauer wird als **unkritischer Zahlenwert in der lokalen Browser-Speicherung** abgelegt, getrennt von Cloud und verschlüsseltem Tresor. Auf anderen Geräten kann eine andere Dauer gesetzt werden. Bei blockiertem localStorage gilt der Wert nur für die laufende Sitzung.
- Bestehende verschlüsselte Tresordaten und Verschlüsselung bleiben unverändert. Manuelles Sperren, automatische Routine-Ausnahme und Schonfrist bleiben erhalten. Die App ist während der gewählten Zeit entsperrt: nur auf einem vertrauenswürdigen Gerät eine längere Zeit wählen. Verschlüsselter Tresor wird nach Ablauf weiterhin gesperrt.

## 2. Google + Outlook nur einmal im Kalender anzeigen

Die bestehende `outlookCalendarDedup61`-Sicht entfernt ausschließlich **redundante Outlook-Anzeigeeinträge**. Das Archiv, der Cloud-Kalender, Outlook-Originale, gesicherte `source_id`s, JSON-Export- und Delta-/Bestätigungslogik bleiben erhalten.

- Bisher: Duplikate bei exakt gleichem Titel (nur case/whitespace) und Zeit erkannt.
- Neu: `Marketing (GRO)` versus `Marketing ()`/`Marketing` oder Groß-/Kleinschreibung wird bei gleichem Beginn/Ende unterdrückt.
- Zeitabgleich: Identische Zeitspanne bis maximal 5 Minuten Abweichung am Anfang **und** Ende (mit Zeitzonenvergleich). Ganztägige Termine müssen exakt gleiche Datumsgrenzen haben.
- Unterschiedliche sinnvolle Klammerzusätze wie `Marketing (GRO)` vs `Marketing (HR)`, eindeutig andere Titel, andere Zeitspannen oder anderer Ganztagsstatus bleiben separat. Zur Vermeidung unnötiger Suche indiziert der Vergleich Google-Termine nach normalisiertem Grundtitel.
- Vorhandene explizite Google-Event-ID-Links behalten Vorrang.

## 3. Daily Dozen klein neben Protein auf „Heute“

- Im bestehenden, kompakten Protein-Inspector wird ein **kleiner 🌿 Daily Dozen X/24-Button** angezeigt – kein weiterer breiter Banner.
- Quelle: exakt derselbe `dailyDozen5930`-Nachweis für den ausgewählten Tag wie in der Daily-Dozen-Detailansicht. Bruchteile bleiben erhalten (z. B. `6,2/24`).
- Ein Klick öffnet **Insights → Ernährung → Daily Dozen** für den angezeigten Tag.
- Der Stand ist eine **dokumentierte Teilbilanz** und **kein Gesundheitsscore**; nicht protokolliertes Essen wird nicht angenommen. Daily-Dozen-Quellen, Lebensmittelzuordnung und Anti-Aging-Eight-Regeln bleiben unverändert.

## Technisches

- Keine Cloudflare-D1-Migration, kein Tresor-Reset, kein neuer Login-Mechanismus.
- Unveränderte Windows-Outlook-Bridge, keine geänderten Python-Pakete.
- Neue Tests: `tests/compass-059163-idle-dedup-dozen.test.mjs`.
- Verifizierung: siehe `TESTRESULTS_0.5.91.63.txt` (gezielte Tests, Gesamtlauf, Importgraph). GitHub-Vite-Produktionsbuild, Live-PWA und Windows COM müssen in der Zielumgebung geprüft werden.
