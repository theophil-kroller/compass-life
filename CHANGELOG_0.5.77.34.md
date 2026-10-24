# Compass Life 0.5.77.34 · Grüner Tee, Greger Anti-Aging Eight, automatische Daily Dozen und Krafttraining mobil

Basis: GitHub-Stand 0.5.77.33 vom 24. Oktober 2026. Nur neue/geänderte Dateien, keine App-Neuinstallation und kein neues D1-Schema.

## 1. Grüner Tee
- Neue Kachel „🍃 Chinesischer Grüntee · ungesüßt“, 1 Tasse = 250 ml, mit 0–3 kcal als grober Schätzwert.
- In der Makro-/Mikro-Nährstoffberechnung generischer BfR/EUFIC-Richtwert etwa 38 mg Koffein pro 250 ml, als **Schätzung**, nicht als gemessener Teegehalt.
- „Teein“ und Koffein sind dieselbe Substanz; Zubereitung, Blattmenge und Ziehzeit verändern den tatsächlichen Wert.
- Keine Zuckerzugabe. Der Tee wird im Daily Dozen als ein protokolliertes Getränk erkannt.

## 2. Dr. Michael Greger: Anti-Aging Eight
Neuer Unterreiter `Insights → Ernährung → 🌱 Anti-Aging Eight` mit den tatsächlichen acht Kapiteln aus *How Not to Age*:
1. Nüsse
2. Grünes Blattgemüse
3. Beeren
4. Xenohormesis und microRNA-Manipulation
5. Präbiotika und Postbiotika
6. Kalorienrestriktion
7. Proteinrestriktion
8. NAD⁺

Die acht Kategorien sind **nicht acht Blutwerte und kein validierter Gesundheitsscore**. Das Modul zeigt deshalb je Bereich den Status „dokumentiert“, „Teildaten“, „nicht belegt“ oder „nicht messbar“.
- Gesicherte Nussmengen aus protokollierten Erdnüssen/Nussmix und dokumentierte Daily-Dozen-Portionen werden angezeigt.
- Nächtliches Fasten: Eine Zeitlücke zwischen zwei Tagebucheinträgen ist **kein Nachweis**, dass wirklich gefastet wurde. Darstellung nur als dokumentierte Erfassungslücke.
- Protein: nur protokollierte, unvollständige Grammzahl, **keine** Empfehlung zur Reduktion bei gleichzeitigem Muskeltraining.
- Präbiotika: Bohnen-Einträge als grober Ernährungsindikator; keine Darmflora- oder Postbiotika-Messung.
- NAD⁺ und microRNA: nicht aus Garmin oder Lebensmittellogs messbar. Keine Scheinscores.

**Quellen:**
- Greger erklärt seine acht Themen: https://www.vegansociety.com/get-involved/research/research-news/how-not-to-age
- ErnährungFacts Buchseite: https://nutritionfacts.org/book/how-not-to-age/
- Buch TOC, Kapitel „Anti-Aging Eight“ ab S. 485: https://catalog.camdencountylibrary.org/cgi-bin/koha/opac-detail.pl?biblionumber=617707

## 3. Daily Dozen – konservative automatische Bestätigung
- Klar identifizierte Einträge (z. B. Apfel, ungesüßter Grüntee, Tee, Kaffee) werden automatisch zugeordnet.
- Nüsse werden nur bei mindestens **ca. 30 g** als vollständige Daily-Dozen-Nussportion bestätigt; für die separate Anti-Aging-Nussorientierung werden auch dokumentierte **20 g** angezeigt.
- Keine pauschale automatische Bestätigung für gemischte Mensamenüs, Snacks oder unquantifizierte Zutaten.
- Manuelle +/- Eingaben können die automatische Zuordnung ausdrücklich überschreiben, **auch auf 0**.
- Der verschlüsselte Journal-Abgleich der manuellen Kategorien bleibt erhalten.
- Beobachtungen sind kein Beleg, dass der gesamte Tag vollständig protokolliert wurde.

## 4. Krafttraining auf dem Smartphone
- Übungen in jeder Satz-Auswahlliste als *⭐ Häufige Übungen* vorangestellt: Hip Thrust, Bizepscurls, Military Press, French Press/Trizepscurls, Hammercurls, Hammer Curl to Press, Curl to Press sowie die StrongLifts-5×5-Grundübungen.
- Auf schmalen Displays die **Übung als breite erste Zeile**, darunter **Wdh. und kg**, jeweils touchfreundlich (48px, 16px Eingabefont).
- Speichern- und Satz-hinzufügen-Schaltflächen bleiben beim mobilen Scrollen am unteren Rand des Editors erreichbar.
- Hip Thrust ist in der bisherigen Übungsdatenbank bereits vorhanden (`hip-thrust`) und trainiert primär das Gesäß.
- Garmin-CSV als Aktivitätsquelle reicht aus, um die Einheit zu erfassen; einzelne Übungen/Sätze bleiben manuell editierbar.

## Tests und Grenzen
- `node --test tests/gtd-057734-longevity-tea-mobile.test.mjs` → **14/14 erfolgreich**.
- `node --check` der neuen JS-Module und Brücke erfolgreich.
- Eine vollständige Vite-Buildprüfung und Tests auf einem tatsächlichen Smartphone sind aus dieser Umgebung **nicht** möglich, da nicht der gesamte GitHub-Quellbaum lokal vorliegt. Die Brücke stoppt bei nicht passenden Integrationsankern mit expliziter Fehlermeldung.
- Keine Altdateien löschen; keine Datenmigration. Die Daten bleiben lokal verschlüsselt.
