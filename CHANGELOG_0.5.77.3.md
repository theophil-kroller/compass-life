# Compass 0.5.77.3 — Kino: Poster, Tagesansicht und echte Kurzbeschreibungen

Ausgangsbasis: 0.5.77.2.

## Neu

- Kinoprogramm beginnt nach Klick auf den Kinobutton in einer tagesbezogenen Ansicht. Mit ←/→ tageweise blättern, Heute sowie Alle Tage; Ansicht auf Poster oder kompakte Liste umschalten.
- Vier-Spalten-Poster-Grid für breite Bildschirme (responsive mit drei, zwei oder einer Spalte). Poster werden ausschließlich aus importierten `imageUrl`-Einträgen geladen. Ohne Bild bleibt das 🎬-Fallback, ohne falsche Plakate zu erfinden.
- Jede Filmkarte enthält die konkrete Inhaltskurzbeschreibung, sofern eine solche verifiziert vorliegt, mit Quelle zum Inhalt, sofern mitgeliefert. Generische Importtexte wie „Kinovorführung“, „Dokumentarfilm“ oder reine OmU-Sprachangaben werden nicht als Handlung ausgegeben.
- Neue Aktion „🔎 Filmtexte & Poster recherchieren“ erzeugt einen ChatGPT-Rechercheprompt für bis zu 20 bereits importierte Filmtitel ohne vollständige Film-Metadaten. Wiederholtes Auslösen führt zum nächsten Block, bis die fehlenden Filme abgearbeitet sind.
- Bestehendes Importfeld erkennt zusätzlich `{ "films": [...] }` mit Filmtitel, verifizierter `description`, `sourceUrl` und optionalem `imageUrl`. „Import prüfen“ zeigt zugeordnete Titel und betroffene Vorführungen; erst bestätigter Import ergänzt diese Daten an allen passenden bestehenden Vorführungen, ohne Termine oder gespeicherte Präferenzen zu löschen.
- Kinoprogramm-Rechercheprompt fordert 2–3 echte Inhaltsangabe-Sätze aus überprüfbaren Quellen und optional ein zulässig verwendbares, direktes HTTPS-Filmposter. Unbelegte Inhaltsangaben und Fantasie-Links sollen ausgelassen werden.
- Nachfolgende reguläre Kinoimporte überschreiben bereits vorhandene konkrete Handlungstexte nicht mehr mit reinen Genre-/Platzhalter-Angaben und löschen vorhandene Poster nicht bei ausgelassenem Bildfeld.

## Grenzen / Datenschutz

- **Keine automatische Filmdatenbankabfrage:** Die App erfindet weder Filmbeschreibungen noch Poster. Für ältere JSON-Dateien müssen fehlende Angaben einmalig mit dem neuen Rechercheprompt nachrecherchiert und importiert werden.
- HTTPS-Bildlinks sind keine Rechtsgarantie. Es sollen nur Originalquellen mit erlaubter Posteranzeige genutzt werden; falls nicht verifizierbar, Bild weglassen.
- Filmname-Zuordnung arbeitet nach normalisiertem **exakten** Titel, damit nicht versehentlich andere Filme angereichert werden. Abweichende Titel müssen vor dem Import abgeglichen werden.
- Die bestehenden Spielzeiten, `eventKey`s, Merkliste, Sync-Queue und gespeicherte Gesundheits-/Finanzdaten bleiben unverändert. Es gibt keine D1-Migration und keine neue API.
- Keine Live-Kinoverfügbarkeit; verifizierte Quellen beim Kino vor Besuch nachprüfen.
