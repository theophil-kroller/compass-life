# Compass 0.5.47 – Proactive Planning & Smart Recommender

## In Compass
- **Heute → Was passt jetzt?**: dezenter Hinweis auf ein passendes Zeitfenster **heute** (wenn der primäre Google-Kalender frisch und vollständig geladen ist).
- **Planen → Kalender & Forecast**: schmaler, standardmäßig eingeklappter Abschnitt **Planvorschlag**. Bis zu zehn geplante Zeitblöcke, Frist-Risiken und fehlende Aufwandsschätzungen. Alle Aufgaben-/Projekt- und Kalenderansichten bleiben unverändert zugänglich.
- **Vormerken**: setzt nach aktiver Benutzerentscheidung nur die bestehende `plannedDate` der Aufgabe auf den vorgeschlagenen Tag. Bestätigte Änderungen werden wie andere Aufgabenänderungen über den bisherigen sicheren Aufgaben-Sync synchronisiert. Die Uhrzeit wird **nicht** in den Kalender geschrieben; Hard Due, Workflow, Aufgabeninhalt und andere Aufgaben bleiben unverändert. Falls bereits ein anderer Wunschtermin gesetzt ist, verlangt Compass eine Bestätigung.

## Berechnungslogik
1. Nur bei vollständiger und frischer Google-Calendar-Abdeckung (primärer Kalender, readonly) werden Planblöcke berechnet. Sonst keine fiktiven freien Stunden und keine Planvorschläge.
2. Arbeitsfenster aus den vorhandenen Capacity-Einstellungen. Exakt `Work` und weitere vom Nutzer eingetragene Titel gelten als verfügbar; Meetings und andere belegte Termine blockieren mit den eingestellten Puffern. Das blockierende Verhalten ausgeblendeter Termine bleibt erhalten.
3. GTD-Verfügbarkeit wird für jeden möglichen Tag geprüft: inaktive/archivierte/erledigte Aufgaben, Waiting For, Hold, Defer, nicht bereite sequenzielle Projekte und Parent-Aufgaben mit offenen Subtasks erhalten keinen Vorschlagsblock.
4. Bis zu 14 Tage, prioritär Aufgaben mit echter Deadline, danach datierte bzw. markierte andere Next Actions. `plannedDate` bleibt ein Wunsch, keine harte Deadline. Übergeordnete Projektfristen sind bei der Priorisierung berücksichtigt.
5. Für Aufgaben mit Stückfortschritt wird Restaufwand proportional zur hinterlegten geschätzten **Gesamt**dauer berechnet (z. B. 15 von 40 Stück erledigt => 25/40 der Gesamtdauer). Fehlt eine Schätzung, wird sie nicht erfunden; solche Aufgaben erscheinen als Klärungsbedarf, wenn sie eine nahende Frist haben.
6. Längere Aufgaben können in bis zu zweistündige Vorschlagsblöcke geteilt werden. Zwischen aufeinanderfolgenden Blöcken derselben Zeitspanne liegen zehn Minuten Wechselpuffer. Kein Vorschlagsblock überschneidet einen anderen.
7. Nur maximal 80 % der bereits berechneten freien Tageskapazität werden für Empfehlungen verwendet. Das ist eine konservative **Vorschlags**grenze, keine garantierte verfügbare Arbeitszeit und kein Ersatz für echte Pausen oder andere Kalender.
8. Der gewählte Kontext und das subjektiv angegebene Energielevel beeinflussen nur die heutigen Blöcke; aus einer heutigen Energieangabe wird keine Prognose für spätere Tage abgeleitet.
9. Bei unzureichenden Möglichkeiten vor Hard Deadlines erscheinen Engpässe; bei Fristen außerhalb des abgedeckten Zeitraums werden keine falschen Prognosen erzeugt.
10. Die Vorschau wird bei neuer Kalenderabfrage, geänderten Aufgaben und neuem Seitenaufruf aus den lokalen Daten neu berechnet (read-only Replanning).

## Datenschutz und Sicherheit
Kein neuer Cloudflare-Endpunkt, keine D1-Migration, keine neu angeforderten Google-Berechtigungen. `proactivePlan()` ist eine reine Funktion ohne Seiteneffekte und sendet keine Kalenderdetails an den Compass Worker oder externe KI. Es werden keine Termine, Käufe oder Aufgaben ohne explizite Entscheidung angelegt.

## Einschränkungen
- Prognose berücksichtigt derzeit nur den **primären** Google-Kalender. Andere Kalender, Reisewege, Krankheit und nicht erfasste Arbeitsanforderungen können fehlen.
- Eine vorgeschlagene Uhrzeit ist **nicht reserviert**. "Vormerken" setzt lediglich den Tag; eine spätere Sessionplanung/Buchung von konkreten Zeitblöcken ist ein eigener, explizit zu bestätigender Folge-Build.
- Aufwandsschätzungen bleiben Schätzungen. Stückzähler-Umrechnung ist nur dann sinnvoll, wenn `estimateMinutes` die Gesamtarbeit bezeichnet.
- Für nicht spezifizierte Termine oder fehlende Kontextangaben wird keine Sicherheit vorgetäuscht.
- Live-Browser-/GitHub-Actions-Produktionskompilierung ist ausstehend, wenn `vite` lokal nicht installiert werden kann.

## Tests
`npm test` und `npm run check` sowie `node --check client/src/main.js` und `node --check client/src/proactive-planner-v47.js`.
Neue Tests unter `tests/gtd-0547-proactive-planner.test.mjs`: Work-Verfügbarkeit bei tatsächlichen Meetings, Überschneidungsfreiheit, Deadline-Priorität, Defer/Sequencing, Stückfortschritt, Engpässe, nicht verbundene Kalender, 80%-Puffer und unveränderte Daten.
