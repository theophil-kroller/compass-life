# Compass Life 0.5.77.15 — Waiting For & Überwindung

## Waiting For aus abgeschlossener Aufgabe

- Nach dem Abhaken im Aufgaben-Inspector unter **„Auf Antwort warten“** einen eigenständigen, verknüpften Waiting-For-Eintrag erzeugen. Die abgeschlossene Ausgangsaufgabe bleibt erledigt.
- Prüfdatum: **Nächster Werktag**, **3 / 5 / 10 Werktage**, und individuell wählbares Datum. Österreichweite gesetzliche Feiertage, Samstag und Sonntag werden übersprungen. Bei einem manuell gewählten freien Tag wird auf den nächsten österreichischen Werktag verschoben. Gültig für die österreichweiten Feiertage inklusive Ostermontag, Christi Himmelfahrt, Pfingstmontag und Fronleichnam. Keine Annahmen über betriebsinterne oder regionale Sonderregelungen.
- Die neue Aufgabe verwendet `workflow='waiting'`, `plannedDate=Prüftag`, `dueDate=null`. Sie ist **kein** selbst erfundenes Versprechen des Empfängers und keine harte Deadline.
- Unter **Heute → Meine Aufgaben** erscheint ab dem Prüftag eine kompakte, eigenständige **„Auf Antworten warten · heute prüfen“**-Liste. Sie bleibt bis zur Erledigung sichtbar, einschließlich überfälliger Tage. `+5 Werktage`, `Details` und `Antwort da ✓` stehen direkt zur Verfügung.
- Verknüpfung der beiden Aufgaben anhand einer internen Notizmarkierung. Bestehende Projekte, Task-API, Cloudflare-Worker-Tabellen und Backups bleiben kompatibel. Der Marker wird im Notiz-Editor ausgeblendet, aber beim Bearbeiten erhalten.
- Kein Zugriff auf Outlook oder E-Mail-Inhalte, kein automatischer Mailversand, keine automatische Erledigung.

## Optionale Aufgabenreflexion

- Im Inspector zwei getrennte Auswahlfelder: **Überwindungsgrenze** und **Energieaufwand** (jeweils nicht festgelegt / gering / mittel / hoch).
- Optionaler Hinderungsgrund: nächster Schritt unklar, unangenehme Kontaktaufnahme, Scham/lange Funkstille, mögliche Konflikte, anderer Grund.
- Keinerlei automatische Bewertung, psychologische Zuschreibung oder Übernahme in einen Urgency-Score.
- Erhalten über bestehende Task-Notizen, einschließlich Cloud-Abgleich. Die Oberfläche informiert darüber, dass solche optionalen Angaben mit der Aufgabe synchronisiert werden. **Keine gesonderte Ende-zu-Ende-Verschlüsselung für die Task-Synchronisierung eingeführt.**
- Die vorhandene GPT-Aufgabenhilfe liest die Angaben erst beim ausdrücklichen Kopieren des Prompts und schlägt bei hoher Überwindung kleine erste Schritte vor; interne Marker erscheinen nicht im Prompt.

## Qualität

- Vollständige Node-Testsuite, inklusive neuer Grenztests für österreichische Feiertage, freie Tage, bestehende Waiting-For-Verknüpfungen, Wiederholungen und strukturiertes Hürdenprofil.
- Worker-Syntaxprüfung.
- Keine D1-Migration, keine Serverfunktion für Outlook.
- Vite-Produktionsbuild in dieser Umgebung nicht bestätigt (fehlende lokale Vite-Abhängigkeiten); über GitHub Actions prüfen.
