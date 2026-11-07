# Compass Life 0.5.91.33 – Skyr-Makros und selbstgekochte Muskatkürbissuppe

**Patch-Basis:** 0.5.91.32 (`main`, GitHub SHA `e2b1328cd7acbf6c422d05197427b1e21aa29dd6`). Der Build ändert keine bisherigen Journal-Einträge, keinen Coach-Trainingssatz und keine GitHub-Pages-Workflowdatei.

## Neue Einträge in Ernährung

- **Milsani Skyr Maracuja, 150 g:** 1 Becher = 150 g; 71 kcal, 12 g Protein, 8,25 g KH, 4,5 g Zucker, Fett unter 0,75 g (0,3 g nur Schätzannahme), Salz 0,15 g. Fotoetikett: 47 kcal, 8 g Protein, 5,5 g KH, 3 g Zucker, Fett <0,5 g je 100 g.
- **Ehrmann High Protein Skyr Natural, 450 g:** 1 Becher = 450 g; rund 230 kcal, 40,5 g Protein, 16,2 g KH/Zucker, 0,45 g Fett, 0,45 g Salz. Hersteller rundet auf 40 g Protein pro Becher.
- **Meine Muskatkürbis-Suppe** als persönliches Rezept mit 10 individuell editierbaren Zutaten: Muskatkürbis (350 g angenommen für ½ Scheibe), 2 kleine Kartoffeln mit Schale (150 g), 3 Karotten (150 g), Stangensellerie (50 g), Knoblauch (4 g), Ingwer (10 g), Muskat (0,2 g), Chiliflocken (0,3 g), Butter (10 g), zubereitete Brühe (600 g). **Nicht gewogen.** Das Rezept ist ein Topf mit **3 angenommenen Schüsseln**. `1 Portion` = ein Drittel Topf, `1 Topf` = gesamtes Rezept, `½ Topf` möglich. `400 g` bedeutet ungefähr 400/1325 des angenommenen Gesamtgewichts; die Verdampfung beim Kochen kann abweichen.

## Indikative Suppe-Nährwerte

**1/3 Topf:** ca. 131 kcal, 3,6 g Protein, 24,1 g KH, 3,3 g Fett, 4,3 g Ballaststoffe, 1 g Salz; ca. 832 mg Kalium, 907 µg Vitamin A (RAE-Schätzung), 16 mg Vitamin C **vor Abzug möglicher Garverluste**. **Ganzer Topf:** ca. 393 kcal. Stark unsicher besonders Kürbisscheibe, Brühe-Salz, Butter und Garverluste. Alle Mikronährstoffe beruhen auf generischen Lebensmitteldaten, nicht auf einer spezifischen Analyse.

## Dr. Greger

Milchprodukte werden **nicht** als Daily-Dozen-Pflanzenportionen gezählt. Ein Maracuja-Aroma wird **nicht** automatisch als Fruchtportion behandelt. Kürbis, Karotten und Sellerie der Suppe zählen proportional zu dokumentierten Gramm als *andere Gemüse*; Knoblauch, Ingwer, Muskat und Chili als Gewürze. Kartoffeln zählen weder als Vollkorn noch als Hülsenfrüchte. Die Anti-Aging-Eight-Anzeige dokumentiert nur Ernährungsevidenz (z. B. geschätztes Protein/Ballaststoffe), keine gemessenen NAD+-Effekte, Postbiotika oder Langlebigkeitswirkung.

## Speicherverhalten

Alle drei Lebensmittel werden **nur im Katalog ergänzt**. Es erfolgt keine automatische Buchung als gegessene Portion. Der bestehende verschlüsselte Ernährungsjournal-Datensatz und alle bestehenden Einträge bleiben unverändert.

## Prüfungen

`node --test tests/compass-059133-skyr-label-portion.test.mjs tests/compass-059133-skyr-muscat-soup.test.mjs`: 16/16 erfolgreich.

`npm run check:deploy`: 33/33 erfolgreich.

Erweiterte Ernährungsprüfung: 63/64 erfolgreich; der einzelne ältere `compass-0581-nutrition-inspector`-Test schlägt auf der unveränderten Basis 0.5.91.32 ebenfalls fehl (3/4). Kein zusätzlicher Fehler in dieser geprüften Gruppe. Ein echter Vite-Produktionsbuild und die Pages-Veröffentlichung sind erst nach dem Hochladen in GitHub Actions nachzuweisen.
