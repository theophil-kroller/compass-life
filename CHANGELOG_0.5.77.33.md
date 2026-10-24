# Compass 0.5.77.33 — Greger-Fettampel, Daily Dozen, StrongLifts & Curl to Press

## Fettqualität – aus Kennzahlen werden nachvollziehbare Hinweise
- Vor die bisherigen Fettkennzahlen setzt Compass eine kompakte **Ampel-Kachelübersicht** mit acht Gesundheits-/Orientierungskennzahlen: pflanzliches Omega‑3/ALA, EPA+DHA, MUFA+PUFA, Omega‑6, Omega‑6:ALA-Verhältnis, gesättigte Fettsäuren, Transfettsäuren und Nahrungscholesterin.
- **Grün:** in Greger-orientierter Vollwertkost bevorzugte Fettquellen bzw. belegter EPA+DHA-Fortschritt. **Rot:** konzentrierte Quellen gesättigter Fettsäuren/Transfette/Cholesterin reduzieren. **Orange:** Omega‑6 als essenzieller Nährstoff, noch offene/ungenügende Daten oder deskriptives Verhältnis.
- Das **Omega‑6:ALA-Verhältnis** ist sichtbar, wird aber *nicht* an einer erfundenen idealen Quotengrenze gemessen. Dr. Greger empfiehlt eher Vollwertlebensmittel sowie tägliche Leinsamen und Walnüsse als eine pauschale mathematische Zielzahl.
- **250 mg EPA+DHA / Tag** als von Greger empfohlene *Erwägung* für Algen-/Hefe-Omega‑3. Bei fehlenden Daten ausdrücklich **„Nicht bestimmbar“** statt falscher 0-Prozent-Fortschritt.
- Falls die heutige Nahrungsaufnahme oder Produktanalyse unvollständig ist, nennt Compass dies und behauptet keine vollständige Tagesbilanz. Alle übrigen Fett-Punktdiagramme und die Quellenübersicht aus 0.5.77.31 bleiben vorhanden.

## Daily Dozen
- Eigener Unterreiter **🌿 Daily Dozen** bei **Insights → Ernährung**.
- 12 Kategorien mit insgesamt 24 Portionen/Häkchen: Hülsenfrüchte 3, Beeren 1, anderes Obst 3, Kreuzblütler 1, grünes Blattgemüse 2, weiteres Gemüse 2, gemahlene Leinsamen 1, Nüsse/Samen 1, Kräuter/Gewürze 1, Vollkorn 3, Getränke 5, Bewegung 1.
- Kategorieweise `+` / `−`, Tagesnavigation, Fortschrittsbalken und „x/24“. **Nur bewusste Häkchen zählen; keine automatische Vollständigkeit aus lückenhaften Ernährungseinträgen.**
- Speicherung im lokalen verschlüsselten `nutritionJournal.dailyDozen`, zusammenführbar im vorhandenen Geräte-Journal-Abgleich auf **Tages- und Kategorieebene** nach Änderungszeit.

## Krafttraining
- Über 40 wählbare Übungen, darunter neue **Hammer Curl to Press**, **Curl to Press**, **Military Press**, **Trizeps-Curl / French Press**, **Skull Crushers**, Reverse Curls und weitere.
- Klassische **StrongLifts 5×5**-Bewegungen verfügbar: Kniebeugen, Bankdrücken, Langhantelrudern, stehendes Schulterdrücken und Kreuzheben.
- A/B-Übungsfolgen und Satzvorgaben (A: Kniebeugen 5×5, Bankdrücken 5×5, Rudern 5×5; B: Kniebeugen 5×5, Military Press 5×5, Kreuzheben 1×5) als Datendefinition hinterlegt; die Übungen sind im Satzeditor auswählbar. *Noch kein automatischer Trainingsplan-Generator.*
- Bestehende Satz- und Gewichtsangaben sowie Garmin-Originaldaten werden durch dieses Upgrade nicht verändert.

## Qualität
- 22 gezielte Tests (.32 Regression und .33 Erweiterung) erfolgreich. Kein verifizierter vollständiger Vite-Produktionsbuild (vertraulicher Quellcode liegt nur im verbundenen GitHub, Container ohne GitHub-Netzzugriff). Die Bridge prüft eindeutige Integrationsanker.

## Originalquellen
- NutritionFacts.org: https://nutritionfacts.org/topics/daily-dozen/
- NutritionFacts.org: https://nutritionfacts.org/optimum-nutrient-recommendations/
- NutritionFacts.org: https://nutritionfacts.org/questions/what-would-you-suggest-as-an-ideal-omega-369/
- NutritionFacts.org: https://nutritionfacts.org/video/what-are-the-healthiest-foods/
- NutritionFacts.org: https://nutritionfacts.org/video/how-to-lower-cholesterol-with-dr-gregers-portfolio-plus-powder-recipes/
- StrongLifts Originalprogramm: https://stronglifts.com/stronglifts-5x5/workout-program/
