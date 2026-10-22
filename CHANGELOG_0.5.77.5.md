# Compass 0.5.77.5 – Poster Repair & Source Transparency

Basis: Compass 0.5.77.4.

- Ursachenanalyse: vorhandene Film-JSON-Antworten enthielten zwar descriptions, aber keine `imageUrl`; kein Browser-Rendering-Fehler.
- Neues bewusst auszulösendes „Poster automatisch suchen“: Cinemeta/Stremio-Katalog (bis 12 Filme je Nutzeraktion), nur exakte, eindeutige Filmtitel; Vorschau und Checkbox-Auswahl vor Übernahme. Externer Dienst ohne Verfügbarkeitsgarantie.
- Bild wird im Browser tatsächlich testgeladen, bevor der Link für alle vorhandenen Vorstellungen eines Films gespeichert wird. Bei Ladefehler erfolgt keine Übernahme.
- Manuell: „Posterlink ergänzen/ersetzen“ pro Film, direkter HTTPS-Bildlink mit Browser-Bildprüfung.
- Importvorschau für `films`-JSON zählt Posterlinks und Texte separat und warnt deutlich bei null Posterlinks.
- Rechercheprompt priorisiert Bild-URLs statt bereits recherchierte Inhaltsangaben erneut zu erzeugen; `films: []` ist bei null Treffern zulässig.
- Bereits importierte Vorführungen bleiben bestehen; keine D1-Migration, kein Worker-Update.
- Externe Poster dürfen nur unter den jeweils gültigen Nutzungsbedingungen angezeigt werden; keine lokalen Bildkopien.
