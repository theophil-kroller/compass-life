# Compass Life 0.5.86 · Ars Vivendi: sieben Jahre statt grauer Mikrokästchen

## Ausgangspunkt
Verifizierter öffentlicher GitHub-Stand 0.5.85, Commit `2240de67ac1ad5467ccea6d7117bbe5b83e41a82`. Keine persönliche Lebenschronik oder importierte privaten Beziehungsdaten im öffentlichen Quellarchiv.

## Sichtbarer Unterschied
- Compass öffnet `Insights → Leben & Orte → My Life in Weeks` jetzt im **7-Jahres-Panorama**. Die aktuelle Phase (am 31.10.2026: Alter 42–48, 2025–2032) wird als gut lesbare Auswahl von sieben Jahrgängen angezeigt.
- Alle 7 Jahre erhalten 53 größere Wochenfelder, eine Monatsskala mit klaren Monats-/Jahreswechselgrenzen und ausgeschriebene, anklickbare Erlebnis-/Meilenstein-/Lebensphasen-Etiketten unter den Wochen.
- Am oberen Rand lässt sich über eine horizontale Auswahl zwischen 7-Jahresphasen wechseln (0–6, 7–13, …). Vor/Zurück-Tasten blättern um sieben Jahre; der Jahreszeitstrahl folgt dem gewählten Abschnitt.
- Phasen aus Bildung, Beruf, Ehrenamt und Beziehungen bleiben als schmale, zurückhaltende Linien codiert. Reisen und andere konkrete Erlebnisse füllen Wochen farbig, Lebensmeilensteine erhalten ★.
- In der vergrößerten Darstellung wurden vergangene Wochen absichtlich aufgehellt, damit besondere Erlebnisse sichtbar sind. Graue Wochen sind keine Bewertung der gelebten Zeit.
- **Gesamtes Leben · Matrix** schaltet jederzeit zur bisherigen vollständigen 80-/100-/110-Jahresdarstellung mit Zoomstufen zurück.
- Der einzelne Jahreszeitstrahl, Google-Kalender-Import, JSON-Prüfvorschau, Beziehungseinträge, A4/A3-Vektor-PDF-Export, Vault-Sync, Finanz- und Ernährungsfunktionen bleiben erhalten.
- PDF erzeugt weiterhin die vollständige Matrix, nicht nur die aktuell ausgewählten sieben Jahre. Private Beziehungen bleiben standardmäßig ausgeblendet.

## Teststatus
- 6 neue automatisierte Regressionstests für Geburtstag-gebundene 7-Jahresphasen, Grenzen bei 80/110, Navigation, Stern-/Phasendarstellung, UI-Umschaltung und PDF-Weiterverfügbarkeit.
- 34 von 34 gezielten Tests für Life in Weeks, PDF, Import, sieben Jahre und KitKat bestanden.
- `npm run check:deploy`: 33 von 33 Tests bestanden.
- `npm test`: 1.802 von 1.835 bestanden; 33 bereits bekannte historische Tests weiterhin fehlerhaft.
- `node --check` für geänderte JS-Module erfolgreich. Kompletter lokaler Vite-Build mangels node_modules nicht bestätigt; GitHub Actions kann die Produktionskompilierung prüfen.

## Installation
**PATCH** nur über genau 0.5.85 / Commit `2240de67ac1ad5467ccea6d7117bbe5b83e41a82` legen. Bei abweichendem Repository-Stand PATCH nicht ungeprüft überlagern; besser FULL SOURCE abgleichen.
- Performance: Im Siebenjahresmodus werden die 80–110 unbenutzten Matrixzeilen gar nicht erst als HTML aufgebaut. „◎ Zu meiner Lebenswoche“ navigiert zur aktuellen Siebenjahreszeile.
