# Compass 0.5.77.7 — Recherche-Wiedervorlagen und Poster-Sammelsuche

Basis: Compass 0.5.77.6. Keine D1-Migration, keine Worker-Änderung, keine automatisch angelegten GTD-Aufgaben.

## Recherche-Wiedervorlage in Heute und Weekly Review
- Jeder der 10 Recherchebuttons erhält eine eigene, für seinen Horizont passende Aktualisierungslogik.
- Aus letzter bestätigter JSON-Übernahme und letztem Veranstaltungstag werden die nächsten Prüfzeitpunkte berechnet. Bei nahendem Ablauf (bis drei Tage) oder Fälligkeit erscheint ein Vorschlag.
- In „Heute“ werden maximal zwei Hinweise angezeigt, mit Link zu den übrigen im Weekly Review. Im Weekly Review stehen alle fälligen Bereiche.
- Button „Prompt öffnen“ wechselt direkt zu Erholung/Recherche, bereitet den passenden Prompt vor und kopiert ihn nach Möglichkeit in die Zwischenablage. „Import prüfen“ und Übernahme bleiben bewusst manuell.
- Kurzlebige Angebote: Kino sieben Tage, Sport/Wintersport 14 Tage. Andere Recherchen 30–45 Tage, abhängig von Kategorie. Ist der jüngste recherchierte Veranstaltungstag früher erreicht, folgt die Wiedervorlage schon davor (2–7 Tage Vorlauf).
- Lange Ausstellungen/Retreats/Festivals werden zwar mit Enddatum gespeichert, blockieren aber keine neue Prüfung der übrigen Programme. Es handelt sich um redaktionelle Prüfintervalle, NICHT um Verfalls- oder Buchungsfristen.
- Nur bereits durchgeführte Recherchen erzeugen Wiedervorlagen, keine zehn Einträge bei frischer Compass-Installation. Eine erfolgreiche Importbestätigung setzt die jeweilige Wiedervorlage zurück.
- Importhistorie merkt sich ab jetzt auch ersten/letzten erfassten Veranstaltungstag und das späteste Enddatum der importierten Teillieferung. Mehrere JSON-Batches desselben Tages werden hinsichtlich ihrer Datumsspanne zusammengeführt. Für ältere Imports wird auf im Tresor gespeicherte Metadaten zurückgegriffen.

## Poster-Sammelsuche
- „Alle fehlenden Poster suchen“ führt mehrere bislang einzeln anzustoßende 12er-Prüfungen mit EINER bewussten Benutzeraktion durch (höchstens 72 Film-Titel je Durchlauf). Für weitere Titel steht weiterhin „Nächste Filme prüfen“ zur Verfügung.
- Sichtbarer Fortschritt pro Batch; die App ruft den externen Cinemeta-Katalog nur nach Klick ab und prüft das Laden der Poster im Browser.
- Ergebnisse werden gesammelt, aber niemals unbemerkt übernommen. Filmidentität, Poster und Nutzungsrecht müssen vor „Übernehmen“ durchgesehen werden; defekte Bilder bleiben ausgeschlossen.

## Daten / Technik
- Neues reines Modul `client/src/discovery-freshness-v5777.js` und leichtgewichtige CSS-Klassen.
- Der neue Metadatenblock liegt ausschließlich im bestehenden verschlüsselten Vault. Bestehende Events, Favoriten, Vorführungen und Filmtexte bleiben erhalten. Keine zusätzliche Cloud-Datenbank, kein Hintergrunddienst, keine automatischen Push-Benachrichtigungen.
- Bestehende UI-Smoke-Tests an neue Modul-Abhängigkeit und dynamische Versionskennung angepasst.

## Verifikation
- 849/849 Node-Tests grün, darunter 10 neue Regressionstests; Worker-Syntaxcheck erfolgreich.
- Vite-Paket ist lokal nicht installiert; der Produktionsbuild muss in GitHub Actions geprüft werden.
