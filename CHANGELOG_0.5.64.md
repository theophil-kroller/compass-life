# Compass 0.5.64 — Relationship Radar

Basis: 0.5.63. Keine D1-Migration, kein Vault-Reset.

## Menschen / Relationship Radar

- Neue Tabs **Kontakte** und **Beziehungslandkarte**. Die Karte zeigt die Person im Zentrum, fünf Distanzstufen als Kreise und alle im lokalen Vault vorhandenen Kontakte. Stable Positionierung aus Kontakt-ID; Drag-and-drop schreibt Nähe (0–100) und Winkel zurück. Der Nähe-Slider ist die barrierearme Alternative zum Drag-and-drop.
- Im People Inspector: frei wählbare Beziehungsart, optionale Geschlechtskennung zur Darstellung auf der Karte (männlich / weiblich / divers / keine Angabe), Gradient-Slider **❄️ Distanz → ❤️ Nähe**, eigener Slider für freiwilligen Kontaktrhythmus inklusive 365-Tage-Kompatibilität.
- **Pause/Play** für freiwillige Kontaktimpulse. Während Pause keine Kontaktimpulse; Wiederaufnahme erzeugt weder fingierten Kontakt noch Rückstand an alten Erinnerungen.
- Freiwilliger Kontaktimpuls im Weekly Review. Erwarteter Kontaktrhythmus bleibt entscheidend; emotionaler Nähe-Wert beeinflusst die Reihenfolge nur leicht. Kein Streak-System und keine Push-Benachrichtigungen.
- **Kanalspezifische Kontaktgewichte:** persönliches Treffen 5, Video 4, Telefonat 3, Nachricht 2, E-Mail 1. Das beeinflusst die Schonfrist für den nächsten Kontaktimpuls, nicht die emotionale Nähe oder den Wert einer Beziehung. Ausschließlich selbst bestätigte Kontakte zählen.
- Direkte Schnellaktionen je Person und im Inspector zum Erfassen eines Telefonats, Treffens oder einer E-Mail. Klick öffnet ein Formular mit vorgewählter Kontaktart; erst ausdrückliches Speichern dokumentiert den Kontakt.
- Eingabebereich für persönliche Merkpunkte: Partner:in, Kinder/Familie, gemeinsame Hobbys, wichtige Ereignisse und Gesprächsnotizen fürs Catch-up (freiwillig).
- Bestehende Projekte lassen sich Personen zuordnen; neue Projekte können direkt beim Menschen angelegt werden. Die Referenz wird im privaten Vault der Person gehalten; das Projekt bleibt ein eigenständiges GTD-Projekt und die Aufgaben werden nicht kopiert.
- Bestehende Kontaktverläufe, Notizen, Birthday-Daten, Tags und Person-Agenda bleiben erhalten.

## Datenschutz und Grenzen

- Neue Personen-Metadaten bleiben im verschlüsselten lokalen Vault wie die übrigen People-Daten. Keine neue Cloud-Migration.
- Keine automatische Übernahme von Google-Kalenderterminen als stattgefundener Kontakt, keine automatische Mail- oder Anrufanalyse.
- Die Gewichtung ist ein heuristischer Kontaktimpuls, keine wissenschaftliche Beziehungsmessung. Künftige Builds können persönliche Gewichtungswünsche ermöglichen.
- Freiwillige Geschlechtsangaben sind nur ein Kartensymbol und werden nie aus Namen abgeleitet.

## Prüfungen

- 639/639 automatisierte Node-Tests erfolgreich; zusätzliche Tests für Kanalgewichte, Pause/Play, stabile Karte, Drag-Entfernung und persönliche Merkpunkte.
- JavaScript- und Worker-Syntaxprüfung erfolgreich.
- Vite-Produktionskompilierung lokal nicht ausführbar: `vite` fehlt in der Laufzeit. Live-Browsertest mit vorhandenem Vault noch ausstehend.
