# Compass Life 0.5.85 · Ars Vivendi: experiences, stars and KitKat

## Ausgangspunkt
GitHub `main` 0.5.84, commit `eb797c3247ac9ef4470596eb79a67e84b33b86f0`. Keine persönlichen importierten Lebenslaufdaten in dieser öffentlichen Quellversion.

## My Life in Weeks
- Nur die Erlebnis-Kategorien `travel`, `abroad`, `family`, `other` füllen Wochenfelder flächig. Längere Beziehungen, Studium, Ausbildung, Beruf und Ehrenamt erhalten vier schmale, dezent eingefärbte Zeitspuren pro Lebensjahreszeile.
- Goldener ★ markiert explizite `milestone`-Ereignisse an ihrem Startdatum (z.B. Geburten) und Abschlussmonate bestimmter Ausbildungsarten, sofern der Monat aus dem Eintrag belegbar ist. Bei reinen Jahresangaben wird kein genauer Abschluss behauptet.
- Jahres-Zoom, Hover-Texte, Auswahl/Inspector, Ongoing, Importvorschau, Google-Calendar-Vorschläge, Zoomstufen und Privatsphäreeinstellungen bleiben unverändert.
- Einseitiger Vektor-PDF-Export (A4/A3) verwendet identische Erfahrung-/Phasen-/Sternlogik. Private Beziehungen bleiben standardmäßig im PDF ausgeschlossen.

## Ernährung
- `KitKat Chunky Peanut Butter` als Snack mit `1 Riegel (42 g)`; **222 kcal** pro Riegel.
- Herstellerangaben je Riegel: Fett 12,7 g (gesättigte Fettsäuren 6,4 g), Kohlenhydrate 21,9 g (Zucker 18,1 g), Ballaststoffe 1,2 g, Eiweiß 4,5 g, Salz 0,26 g.
- Herstellerquelle: https://www.kitkat.de/produkt/kitkat-chunky-peanut-butter (KitKat/Nestlé). Packungsetikett hat Vorrang bei Varianten/Rezepturen.

## Testabdeckung
- `tests/compass-0585-life-experiences-kitkat.test.mjs` prüft die Ebenentrennung, echte Meilensteine, Monate statt erfundener Abschlussdaten, PDF-Sterne und KitKat-Nährwerte.
- Deployment-Tests 33/33. Historische Vollsuite 1.796/1.829, 33 bekannte Legacy-Fehler; lokaler Vite-Build mangels node_modules nicht bestätigt.
