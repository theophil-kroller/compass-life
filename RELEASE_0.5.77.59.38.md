# Compass Life 0.5.77.59.38 — Family Evening & Life Balance

Basis: GitHub Workflow #273, Commit d79ab67b9cc3b534aba979c98429aa22a58c7c13.

## Änderungen
- Dezent bedienbare vorheriger/nächster Tag Navigation auf Heute; Zurück zum aktuellen Tag.
- Ferien/mehrtägige Schultermine mit erstem und letztem Tag. Google All-Day Enddatum exklusiv.
- Familienhinweis: 🔮 direkt neben Forecast-Icon, getrennte Sprungziele mit Tooltip.
- Nathanaels Lernfenster am Abend: ab ca. 20 Uhr nach Ankunft, mindestens 45 Minuten Fußball und 15 Minuten Übergang, keine Vorschläge nach 21:30 Uhr. Zeiten sind Vorschläge, Anwesenheit nie angenommen.
- Optionaler Abendrhythmus und Wochentage im People/Family-Radar-Profil; Einstellungen fließen in den bestehenden verschlüsselten Familienabgleich.
- Life Balance: umschaltbare Perspektiven Gesamtbalance/Gesundheit/Lebensqualität; Bewegung bevorzugt erfasste Trainingsminuten, Radfahren über Garmin-Trainingssessions möglich. Krafttraining separat. Keine Doppelzählung HC/Garmin, keine angenommenen Daten. Im Fokus-Modus bleibt der bisherige Radar, neue Perspektiven nur im erweiterten Modus.

## Einspielen
Nur die Dateien aus dem PATCH mit ihren Pfaden nach GitHub main hochladen. Full Source dient als separate vollständige Sicherung, NICHT zusätzlich einspielen.

## Qualität
npm run check: 1.487/1.487 Tests bestanden. Vollständige Vite-Quelltext-Transformationskette einschließlich .38 syntaktisch geprüft. Vite-Produktion mangels node_modules/installierbarer npm-Abhängigkeiten in dieser Offline-Umgebung nicht ausgeführt; GitHub Actions muss diesen Schritt bestätigen.

## Grenzen
Frische/Vollständigkeit des Google-Kalenders bleiben Voraussetzung verifizierter Zeitfenster. Bestätigung der tatsächlichen Anwesenheit eines Kindes ist erforderlich. Keine Google-Kalenderbuchung ohne Nutzeraktion.
