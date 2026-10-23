# Compass Life 0.5.77.9 – Persönliche Stressmuster (vor · während · nach Aktivitäten)

## Neuer Insight auf der Stress-Seite

**Nach UI-Feedback überarbeitet:** Stressspitzen und konkrete Termine erscheinen zuerst; vier große Stressstufen-Tabellen sind aufklappbare Detaildaten. Terminkontext kurz vor/nach einem hohen Messpunkt wird zeitlich explizit markiert (bis 45 Minuten), nicht als überlappender Termin ausgegeben. Wiederholte Vorher-/Nachher-Beobachtungen stehen vor den technischen Kategorien; nur drei Kategorien zuerst, weitere optional.

Unter `Insights → Gesundheit → Stress` ergänzt die neue Sektion **„Was fällt bei meinen Aktivitäten wiederholt auf?“** die vier Stressstufen und die Raincloud-Plots aus 0.5.77.8.

- **Zeitfenster:** 30 Minuten vor Beginn, während der eingetragenen Aktivität / des Kalendereintrags und 60 Minuten danach. Alle Werte stammen ausschließlich aus tatsächlich gemessenen Garmin-Stresspunkten. Für jeden Abschnitt sind mindestens **2 gültige Messpunkte** erforderlich; fehlende Werte bleiben unbekannt.
- **Persönliche Typen:** Arbeitsmeetings, Forschung/Schreiben, Lehre/Unterricht, Arbeitsphasen, Sauna/Therme, Tanzen, Sport/Bewegung, Erholung, soziale Kontakte sowie weitere Termine. Die Erkennung nutzt die vorhandenen Kalenderklassifizierungen und Stichwörter aus den Aktivitätsnamen.
- **Pro Ereignis statt pro Messpunkt:** Ein Vergleich „vorher/nachher“ benutzt stets Werte *aus demselben Ereignis*. In der Kategorie-Zusammenfassung zählt jedes Ereignis einmal, unabhängig davon, wie lang der Termin ist oder wie viele Garmin-Messpunkte innerhalb des Fensters vorhanden sind.
- **Währenddessen:** Durchschnittlicher gemessener Stresswert und Anteil der tatsächlich beobachteten hohen Werte (Garmin über 75); beide nur für Ereignisse mit ausreichenden Messungen währenddessen.
- **Vorher → Danach:** Mittlere Änderung in Garmin-Stresspunkten aus gepaarten Ereignissen. Ein wiederholt beobachtetes Muster wird erst bei **mindestens drei Ereignissen an zwei verschiedenen Tagen** als solches bezeichnet; das ist *kein* Signifikanznachweis und *kein* Kausalnachweis.
- **Beispiele und Kontrolle:** Unter jeder Kategorie können individuelle Termine mit Datum, Titel, Uhrzeit und verfügbaren Werten davor/während/danach aufgeklappt werden.
- **Datenqualität:** Kein Vergleich für Kalendertermine außerhalb vollständig synchronisierter Kalendertage; keine Schlussfolgerung aus fehlenden Messpunkten. Garmin-CSV-Zeiten ohne Zeitzone werden als unsicher markiert. Sensorlücken während Sport werden ausdrücklich erklärt. Abgesagte, ganztägige und versteckte Termine sowie ungültige Sitzungen werden ausgeschlossen.
- Nur lokale Auswertung im entsperrten Vault. Kein externer KI-Aufruf, kein neuer Netzwerk-Endpunkt, keine Änderung an D1, Worker oder persönlichen Planungsdaten.

## Technik

- Neu: `client/src/stress-patterns-v5779.js`, `tests/gtd-05779-stress-personal-patterns.test.mjs`.
- `client/src/stress-context-v5778.js` stellt die vorhandene Normalisierung zeitlicher Kontexte zur Wiederverwendung bereit.
- `client/src/insights-wellness.js`: neue Sektion auf der Stress-Seite.
- `client/src/style.css`: responsive, kompakte Musterkarten und Detailansicht.
- Versionsupdates, Tests und diese Dokumentation.

## Verifikation

- Vollständige Node-Testsuite: 865/865 erfolgreich.
- Worker-Syntaxprüfung erfolgreich.
- Syntaxprüfung geänderter JavaScript-Dateien erfolgreich.
- Lokaler Vite-Produktionsbuild nicht durchführbar (`vite` nicht installiert); GitHub Actions muss erfolgreich durchlaufen.
