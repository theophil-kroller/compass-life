# Compass Life 0.5.91.53 – Ernährung interpretieren & Mensa Daily Dozen

**Basis:** 0.5.91.52. **Lieferumfang:** Quellcode plus Patch, keine bereits kompilierte Web/PWA-Distribution.

## Ernährungsoverview
- Verlaufsdiagramm mit echter numerischer **Y-Achse (kcal/g)**, Datumswerten auf der X-Achse, Tageswert-Tooltips und Anzeige des Mittelwerts bzw. der Datenabdeckung. Für Salz (<5 g/Tag, WHO), Ballaststoffe (ca. 25 g/Tag) und Protein (persönliche Trainingsorientierung, falls berechenbar) werden Orientierungslinien angezeigt, keine pauschalen Kalorienziele.
- Lebensmittel-Häufigkeitsliste priorisiert echte **Speisen/Mahlzeiten**. Getränke und Supplemente bleiben vollständig erhalten, sind aber getrennt aufklappbar; dokumentierte Häufigkeit und Menge bleiben ersichtlich.
- Manuell gestarteter Nutrition Recommender zeigt maximal drei priorisierte Befunde, weitere aufklappbar. Nur zwei übergeordnete Daily-Dozen-Lücken statt eines endlosen Stapels ähnlicher Empfehlungen. Vorhandene produktbezogene Salzquellen, geschätzte ALA- und Proteinbefunde bleiben erhalten.

## Mensa und Daily Dozen
- Tatsächlich verzehrte Menüs werden nach ihrer gespeicherten Zutatenliste und ggf. **modellierten Zutatengewichten** ausgewertet. Ein Menü im Katalog allein gibt keinerlei Daily-Dozen-Gutschrift.
- Beispiel Frühlingsrolle + 210 g Wokgemüse + 190 g Basmatireis: Gemüse ist ein ausdrücklich **geschätzter** Daily-Dozen-Beitrag, Basmati ist **ohne Vollkorn-Nachweis keine Vollkornportion**.
- Bei einem explizit benannten Gemüse-/Hülsenfruchtanteil ohne Grammzahl entsteht maximal eine **vorläufige halbe Portion**; ohne benannte Zutat keine automatisch bestätigte Portion. Einzige Rückwärtskompatibilität: ältere Ratatouille-/Gemüse-Teller mit erfasstem Konsum und Gemüse-Kandidaten behalten ihre halbe Teilportion.
- Neue Mensa-Tagebucheinträge erhalten Zutaten und Mengenschätzung als unveränderlichen Snapshot. Bereits erfasste Mensagerichte werden ohne Datenmigration über den Mensa-Katalog ergänzt, falls dessen ursprüngliche Gewichtsannahmen noch vorliegen.
- Die neue Mensa-Gutschrift gilt in der langfristigen Ernährungsauswertung sowie der bestehenden Daily-Dozen-Tagesansicht. Änderungen der Zutaten-/Mengenbasis invalidieren die manuell gestartete Coach-Analyse, ohne sie automatisch zu wiederholen.

## Performance, Sicherheit, Grenzen
- **Heute**, Inbox, Planen: keine zusätzliche Import- oder Datenabfrage. Der bestehende Nutrition-Overview-JS/CSS-Chunk bleibt lazy geladen; die ausführliche Empfehlung startet **nur per Button**.
- Keine neue Speicherung von Essensdaten, keine Anpassung oder Löschung historischer Einträge. Keine Datenmigration; Katalog-/Journal-IDs bleiben erhalten.
- Geschätzte Menüanteile sind keine verwogenen Portionen. Versteckte Zutaten und unbekannte Mengen erzeugen keine sicher belegten Daily-Dozen-Portionen. Ohne ausdrückliche Bestätigung ist gewöhnlicher Reis, Couscous oder Dinkelnudeln nicht Vollkorn.
- Interaktionen mit Schlaf, Arbeitsbelastung, HRV und Kontakten sind noch nicht implementiert. Es werden keine medizinischen Mangelbehauptungen oder Ursachen aus zeitlichen Korrelationen abgeleitet.

## Tests
- **33/33 Release-Tests**, Import-Graph ohne fehlende Module.
- **2.294 erfolgreich**, exakt **66 bekannte Altfehler** wie bei der letzten vollständig bestätigten Version, **keine neuen Fehler**.
- 7 neue Mensa-/Dashboard-Tests sowie bestehende Nutrition-Tests erfolgreich.
- Produktionsbuild (Vite) in dieser Umgebung mangels installierter Abhängigkeiten nicht geprüft; GitHub Actions muss die tatsächliche Veröffentlichung bestätigen.
