# Compass 0.5.77.26 — Nutrition Insights 2 & „ohne Wert“ verständlich auflösen

## Erweiterung bestehender Ernährungs-Insights

- Vorhandene Navigation unter **Insights → Ernährung** um **📊 Nährstoff-Trends** erweitert. Tagebuch, Makro & Mikro und Timing & Trends bleiben erhalten; bisherige Symbole/Kacheln unverändert.
- Pro Nährstoff exakte **Tages-Dotplots** statt Verdichtung der Originaltage, für Protein, Kohlenhydrate, Fett, Ballaststoffe, Zucker, gesättigte Fette, Salz und Koffein. Woche, Monat und Gesamt, Blätterpfeile. In der Gesamtansicht horizontal scrollbare echte Einzelpunkte statt kaschierter Kompression.
- Optional aktivierte persönliche Protein-/Fett-/Kohlenhydrat-Orientierungen als gestrichelte Linien. Salz (5 g/Tag, WHO) und Koffein (400 mg/Tag, EFSA, gesunde Erwachsene) ausdrücklich als Sicherheits-/Höchstorientierung, **nicht** als Einnahmeziel.
- Mikronährstoff-Ø pro Tag mit tatsächlich beziffertem Wert; allgemeine EU-NRV als Vergleich, 100 % nicht als toxikologische Obergrenze. Quellenabdeckung je Nährstoff und geschätzte/teilweise unbekannte Teilbilanzen gekennzeichnet. Fehlend ≠ 0.
- Wochentags-Dotplots: jedes dokumentierte Tagesergebnis bleibt einzeln sichtbar, ergänzende kleine Mittelwertstriche. Keine vermeintliche Präzision bei zu wenigen Tagen.
- Performance: temporärer RAM-Tagesindex pro Vault-Objekt, Fingerprint von Einträgen und Produktprofilen, gezielte Rekalkulation nur betroffener Tage; kein zusätzlicher verschlüsselter Speicher, keine Migration. Perioden- und Nährstoffwechsel aktualisieren nur den betreffenden Teilbaum.

## Bugfix „1 ohne Wert“ aus Screenshot

- Die Kalorienhistorie zeigte pauschal `1 ohne Wert`, selbst wenn klar war, welches Lebensmittel gemeint war. Stattdessen zeigt sie pro Tag aufklappbar **Produktname, tatsächlich protokollierte Menge und Ursache**.
- Nahrungsergänzungsmittel mit **nicht deklariertem Energiegehalt** werden gesondert angezeigt und zählen weiter mit ihren bekannten Vitaminen/Mineralstoffen, aber **nicht als fehlende vollwertige Mahlzeit** oder künstlich als `0 kcal`.
- Korrekte Kalorienumrechnung bei Produkten mit Doppelportionen wie **„1 Scheibe (25 g)“** und Eintrag **„25 g“** (zuvor fälschlich „ohne Wert“), auch für Brot, Packungen und Becher.
- `MatchaTherapy 30+ · 1 TL` wird mit ca. 2 g Pulver für Energie **und** die vorhandenen Hersteller-Mindestgehalte an Koffein, EGC und EGCG erkannt.
- **Supplements ohne Energiedeklaration** beeinflussen allein durch ihre Existenz nicht mehr die Essenszeit- und Fastenfensterberechnung. Das ist **keine** Bestätigung eines realen Fastenintervalls.
- Beim Anlegen eigener Lebensmittel können nun optional eine konkrete Standardportion und kcal-Minimum/-Maximum eingetragen werden. Unbekannte Werte werden nicht automatisch erfunden.

## Validierung und Grenzen

- 965 automatisierte JavaScript-Tests bestanden; Worker-Syntaxprüfung bestanden. Einschließlich 8 neuer Ernährungstrends-/Fehlwerte-Tests und Rückwärtskompatibilität der bestehenden Tests.
- An deinem verschlüsselten persönlichen Datensatz wurden keine Einträge gelesen oder verändert; welcher konkrete Eintrag im Screenshot die „1“ erzeugte, zeigt die neue Aufklappansicht **nach Installation**.
- Alle Diagramme beruhen auf dokumentierten Lebensmitteln. Nicht erfasste Mahlzeiten und fehlende Etikettwerte machen die Tageswerte zu **Teilbilanzen**. Eine fehlende Angabe wird nicht als 0 interpretiert.
- Kein vollständiger Vite-Produktionstest oder echter Browser-Smoke-Test in dieser Umgebung mangels installierter Vite-Abhängigkeiten. Nach GitHub-Commit den Deploy-Workflow prüfen.
- Keine D1-, Worker- oder Tresorformat-Migration.
