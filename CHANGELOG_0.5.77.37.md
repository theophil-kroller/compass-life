# Compass Life 0.5.77.37 · Feine Muscle Map, Radfahren, persönliche Rezepte

**Basis:** Compass 0.5.77.36. Version .37 ergänzt bestehende Module und behält die bis .36 installierten Bridges unverändert.

## Krafttraining & weitere körperliche Aktivität
- **25 Muskelregionen** statt der bisherigen 11 groben Gruppen, darunter vordere/seitliche/hintere Schulter, Pectoralis, Latissimus, Trapez/Rhomboiden, Brachialis, Quadrizeps, Gastrocnemius und Soleus.
- Eigene SVG-Geometrie für die feinere Karte, ohne fremde Garmin-Grafiken zu kopieren. Hauptmuskel rot, Nebenmuskel gelb, stärkere dokumentierte Satzbeteiligung gelb–orange–rot.
- Manuelle Übungszuordnung im bereits vorhandenen Kraftsatz-Editor steuert die Detailkarte. Unklassifizierte Garmin-Sätze bleiben unbekannt.
- **Radfahren wird zusätzlich berücksichtigt**: Umschaltung zwischen **Gemeinsam**, **Krafttraining** und **🚲 Radfahren**. Vorder- und Rückseite bleiben gleichzeitig sichtbar. Kraft und Radbelastung werden NICHT als vergleichbare Sätze zusammengerechnet. Die anatomisch typischerweise aktivierten Regionen aus Radfahren werden orange (wesentliche Beteiligung) bzw. gelb (weitere Beteiligung) eingezeichnet. Bei Überschneidungen zeigt ein goldfarbener Umriss Radbeteiligung zusätzlich zur Kraftsatzfarbe.
- Garmin FIT/Activities-CSV-Radfahrten werden in die ausgewählte Zeitspanne gefiltert und bei passendem Startzeitpunkt und Dauer dedupliziert. Zwei echte Fahrten bleiben getrennt. Es werden nur importierte Garmin-Session-Zusammenfassungen verwendet; fehlende Tage sind keine Nulltage.
- **Fischer-E-Bike ohne Motorunterstützung:** Deine Angabe wird als Kontext ausgewiesen; die FIT/CSV-Importe beweisen den tatsächlichen Motorstatus oder Widerstand nicht. Daher keine erfundenen Leistungspunkte oder „Satzäquivalente“.

## Ernährung · persönliche Gerichte
- **🥗 Mein großer grüner Salat:** grüner Salat, Kürbiskernöl, Balsamico, Sojasauce, Kreuzkümmel, Koriandersamen, schwarzer Sesam und standardmäßig **20 g Erdnüsse**. Karotten, roter Spitzpaprika und Avocado sind optional (0 g in der Standardrezeptur; je Eintrag ergänzbar).
- **🫘 Mein Käferbohnensalat:** eine vorläufig mit 240 g Abtropfgewicht angenommene Dose, Knoblauchpulver, Oregano, Kürbiskernöl, Balsamico und Salz.
- **🍳 Mein Spiegelei:** Ei in nativem Olivenöl extra, Kala Namak, Kurkuma und Chiliflocken. Die alte generische „Spiegelei“-Kachel bleibt für alte Einträge erhalten; die persönliche Kachel erscheint im Frühstücksbereich vorn.
- Alle drei Rezepte sind Ein-Tipp-Kacheln. Zutaten werden getrennt als Schnappschuss **pro Mahlzeiteneintrag** gespeichert; Änderungen am jeweiligen Tagebucheintrag überschreiben keine älteren Rezepte. Zuletzt verwendete Mengen werden bei einer neuen Erfassung vorgeschlagen.
- Per-Zutat-Nährwerte werden mit markierten generischen Lebensmittelreferenzen aggregiert. Nicht verfügbare Spurenelemente/Polyphenole sind *unbekannt*, keine angenommenen Nullen. In der Energiebilanz erscheint bei Teilabdeckung ausdrücklich eine **unvollständige Teilsumme**.
- Automatische Daily-Dozen-Erkennung berücksichtigt konservativ grünen Salat, bestätigte andere Gemüsebestandteile, Erdnüsse und Käferbohnen. Nur nachvollziehbare Mengen; explizite manuelle Daily-Dozen-Eingaben behalten Vorrang.

## Tests
15 fokussierte Tests bestanden: Radfahren-Deduplizierung und Zeitfenster, keine fiktiven Kraftsätze, Wadenbeteiligung, SVG-Geometrie, Hypothesen der Übungszuordnung, drei Rezepte, optionale Zutaten, Grammkorrekturen, nicht bekannte Nährstoffe und Source-Bridge-Anker. **Kein vollständiger Vite-Produktionsbuild** in dieser Laufzeit: die gesamte Repository-Arbeitskopie und installierte Vite-Abhängigkeiten stehen nicht lokal zur Verfügung. Die Upload-Pfade wurden geprüft, die Bridge bricht bei abweichenden Upstream-Ankern ab.

## Fachliche Grenzen
Die Muskelkarte ist ein dokumentationsbasiertes Modell, kein EMG, nicht gemessene Ermüdung und keine individuelle Muskelaufbau- oder Verletzungsdiagnose. Radfahrminuten, Herzfrequenz oder Kilowattstunden werden nicht als Trainingssätze oder harte hypertrophiespezifische Effektpunkte behandelt. Rezeptnährwerte sind generische Schätzungen und keine verifizierten Hofer-Markenetiketten. Alle Standardportionen sind editierbare Annahmen.
