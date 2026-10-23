# Compass Life 0.5.77.12 — Nutrition Intelligence und GTD-Klärung

## Nutrition Intelligence

- Neuer Tab **Makro & Mikro** unter Insights → Ernährung mit Tagesnavigator, summierten bekannten Nährstoffwerten, Datenabdeckung und detaillierten Produktprofilen.
- Nährstoffwerte aus tatsächlich protokollierten Produkten; ein fehlender Wert zählt niemals als Null. Bei Rezepten mit unvollständigen Zutaten wird „teilweise unbekannt“ angezeigt. Die Summen sind keine vollständige Ernährungsbilanz oder medizinische Mangelanalyse.
- Branded profiles: My Vay Barista Haferdrink, Monin Salted Caramel, MorgenLand Bio Kerniger Nuss Mix, Hofer gesalzene Erdnüsse (geschätzt), SPAR Vital Bio-Mangohälften, S-BUDGET Milchreis Zimt, Better Pistachio Butter Cups, SPAR Würziger Cheddar, Hofer BBQ Cheddar, Zurück zum Ursprung Bio Nur-Kornbrot, Hofer Bio-Butter (geschätzt), MatchaTherapy Matchapulver (Mengen fehlen) und FürstenMED Kombinationspräparat.
- Tagesspezifische Aufschlüsselung: kcal, Protein, Kohlenhydrate, Zucker, Fett, gesättigte Fette, Ballaststoffe, Salz; Calcium, B2, B12, D, C, E, Niacin, Zink, Selen sofern bekannt.
- Matcha-Catechine EGC und EGCG, Koffein und L-Theanin als Informationen **ohne unbestätigte quantitative Werte**.
- FürstenMED-Extrakte pro deklarierter Tagesportion (4 Kapseln), davon-Untergruppen explizit markiert; bei Quick Capture standardmäßig **1 Kapsel** und proportional je dokumentierter Kapselzahl. Vitamin D3 und Niacin wegen unleserlicher Werte nicht geschätzt.
- Personalisierte Standardportionen: gewogene Handvoll MorgenLand 30 g, vorläufig Hofer Erdnüsse 30 g, ganze Mango-Packung 200 g, Milchreisbecher 200 g, 3 Pistachio Cups (39 g), Monin-Sirup 10 ml, Matcha mit 75 ml My Vay Barista, Käse/Brot/Butter mit teilweise geschätzten Scheibengewichten.
- Bestehende Food-IDs und Ernährungseinträge bleiben lesbar. Alte Mengenangaben, z. B. 50-g-Nüsse, behalten ihre individuelle Portionsangabe. Neue Produktprofile sind im Programm hinterlegt; die protokollierten Verzehrdaten bleiben im verschlüsselten Ernährungstagebuch.

## GPT-Hilfe in Aufgaben

- Sichtbare Schaltfläche **✦ GPT-Hilfe für diese Aufgabe** im Task-Inspector, somit auch unter Heute.
- Klick kopiert freiwillig einen kurzen Gesprächsstart mit Aufgabentitel, optionaler Notiz und Projektkontext. Das Prompt bittet um eine einzige Frage pro Schritt und bietet Hilfe beim Formulieren von E-Mail/DM sowie beim Finden des nächsten GTD-Schritts.
- Separater Link „ChatGPT ↗“; keine automatische Übertragung, kein E-Mail-Versand und keine Änderung des Aufgabenstatus.

## Qualität

- 882/882 Node-Tests erfolgreich. Worker-Syntaxcheck erfolgreich. JavaScript-Syntaxcheck erfolgreich.
- Vite-Produktionsbuild in dieser Umgebung **nicht** ausführbar (Node-Abhängigkeiten nicht installiert: `vite: not found`); GitHub Actions muss den Deployment-Build prüfen.
- Keine D1-Migration / kein Worker-Update erforderlich.

## Offene Grenzen

- Für noch unbekannte Herstelleretikettwerte (MatchaTherapy, Hofer-Erdnüsse, Hofer-Butter) bleiben nur vorsichtige Näherungen bzw. unbekannte Mikro- und Wirkstoffmengen.
- Bilder/Mensamenü-Fotoanalyse und interaktiver Editor für Produkt-Nährwertprofile sind **nicht** in diesem Build implementiert; für den variablen Study-Teller wird weiterhin nur die bisherige Kalorienspanne erfasst.
- Das Kopieren der Aufgabe benötigt Clipboard-Berechtigung, sonst manueller Kopierdialog.
