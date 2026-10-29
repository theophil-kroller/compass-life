Compass .40.25.15 — Satzeditor wiederherstellen

Basis: erfolgreicher GitHub-Actions-Deploy #326, commit 3a096cc52c0a680cd4b724d1564b54a2d50ce6f5.

- Repariert einen Full-Source-Renderingfehler aus .40.25.11: Das Muskelatlas-Modul ersetzte die ältere Ansicht, aber der vorhandene Trainingseditor wurde nicht wieder eingefügt.
- „Übungen & Gewichte nachtragen“ erscheint direkt bei den erkannten Trainings über der Muskelkarte; ein CSV-Training ohne Satzdetails hat nun im Trainingsjournal einen direkten Bearbeiten-Button.
- Ein Klick öffnet exakt diese Trainingseinheit und scrollt zum Editor; Übung, Wiederholungen und Gewicht werden pro Satz zugeordnet; neue Sätze können ergänzt werden.
- Speichert wie früher als Stärke-Annotation lokal im verschlüsselten Tresor; Garmin-Originale und FIT/CSV-Daten werden nicht überschrieben.
- Trainingsgrafik und Kennzahlen aktualisieren sich nach dem Speichern. Neue Rohimporte führen nicht zur Doppelzählung.
- Weder Journal-Sync noch Mensa, Kassenbons, GTD, Garmin-Worker oder bestehende Datenmigrationen geändert.

Installation: Inhalt des PATCH-ZIP ins Repository mit identischer Verzeichnisstruktur einfügen (Basis #326).
GitHub Actions muss den Produktionsbuild danach noch grün bestätigen.
