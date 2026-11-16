# Compass Life 0.5.91.54 – Nutrition Intelligence: Lebensmittelgruppen & Kalorien-Donut

Basis: 0.5.91.53. **Full Source** ist der vollständige Quellcode, kein vorkompiliertes Web-PWA-Paket.

## Neu
- Der Ernährungsüberblick zeigt jetzt ein **Donut-Diagramm mit tatsächlich dokumentierten Kalorienanteilen** je Lebensmittelgruppe. Daneben stehen farbgleiche **Prozentzahlen**, Kategorie-Namen und passende Icons. Die Kategorien behalten in jedem Zeitraum dieselbe Farbe.
- Enthalten sind Gemüse, Obst/Beeren, Hülsenfrüchte/Tofu, Getreide/Vollkorn, Nüsse/Samen, Milch-/Proteinprodukte, Mensa/Mischgerichte, Brot/Gebäck, Süßes, Öle/Aufstriche, Getränke, Supplemente und Sonstiges (jeweils nur wenn Einträge vorliegen).
- Kategorien werden nach ihrem quantifizierten Kalorienbeitrag geordnet. Aufgeklappt zeigen sie die einzelnen protokollierten Produkte, kcal, Protein, Ballaststoffe, Salz und dokumentierte Mengen, sofern bekannt.
- Auch das Donut-Segment ist anklickbar und öffnet die zugehörige Kategorie **ohne Neuberechnung, Cloud-Abfrage oder Datenmutation**. SVG-Segmente sind als Tastatur-Links erreichbar; die Kategorien verwenden native HTML-Details.
- Unbekannte Kalorien bleiben unbekannt. Für diese Einträge werden keine fiktiven Prozentanteile erzeugt. Bei gemischten Mensa-Gerichten zählt die Gerichtskategorie für kcal, die belegten Zutaten zählen gesondert zur Daily Dozen (keine doppelte Energiezählung).
- Bestehende Ernährungsübersicht, Tageserfassung, Mensa, V-Taper Nutrition Coach, Daily Dozen und bisherige Menüeinträge bleiben unverändert.

## Technische Grenzen
- Die Prozentzahlen sind Anteile **der quantifizierten Kalorien**, kein Gesamtbild einer nicht vollständig dokumentierten Ernährung oder eine Ernährungsqualitätsbewertung.
- Die Ernährungsauswertung bleibt lazy geladen; **Heute, Inbox, Planen** enthalten keine neue Import- oder Analyseabhängigkeit. Manuelle Nutrition Coach-Empfehlungen starten weiterhin ausschließlich per Klick.
- Keine Änderungen an Tresor, Food-IDs, Journal- oder Mensa-Einträgen. Keine Migration.

## Tests
- **33/33 Release-/Deployment-Tests** bestanden, Import-Graph geprüft.
- **2.300 Tests bestanden; exakt dieselben 66 bekannten historische Fehltests** wie bei 0.5.91.53; keine neuen Fehler (gleicher Node-Testbefehl in beiden Ständen).
- Zusätzliche Unit-Tests für Farbgleichheit, Prozentberechnung, Kategorien, fehlende Kalorien, manuelles Aufklappen und ausbleibende Datenmutation.
- Eine lokale Vite-Produktionskompilierung wurde hier nicht durchgeführt, da die npm-Abhängigkeiten nicht installiert sind. Deployment über GitHub Actions muss die Produktion bestätigen.
