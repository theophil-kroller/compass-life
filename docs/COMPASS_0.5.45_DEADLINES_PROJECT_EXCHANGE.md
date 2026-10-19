# Compass 0.5.45 – Deadline Intelligence & Project Exchange

## Ziel / UX
- Keine neue Hauptnavigation. Prognose erscheint **nur bei Fristrisiko oder fehlender Dauer** als leise aufklappbare Zeile in „Was passt jetzt?“ und Forecast.
- `Planen → Projekte → Projektplan mit ChatGPT austauschen` ist eingeklappt. Keine Daten verlassen den Browser allein durch das Öffnen.
- Das Kalenderfenster wird **read-only** analysiert, keine automatisch angelegten Termine, keine künstlichen Deadlines.

## Deadline Intelligence (erste konservative Stufe)
- Betrachtet alle **offenen, aktiven** Aufgaben mit Hard Deadline (`dueDate`) oder einer Projekt-Deadline, die ererbt wird. Für Aufgaben mit Stückzähler reduziert sich die verbleibende Zeit proportional, sofern die eingetragene Gesamtschätzung tatsächlich auf alle Stücke bezogen ist.
- Warte-/Hold-Aufgaben werden **nicht** als planbare Arbeitszeit behandelt. Elternaufgaben mit offenen Unteraufgaben werden nicht doppelt gezählt.
- Jede Deadline wird gegen die bisherige freie Zeit im von Google Calendar **vollständig geladenen** 14-Tage-Arbeitsfenster gestellt. Andere Kalender, Mittagspausen und private Aktivitäten außerhalb des Kalenders können fehlen.
- Status: überfällig, rechnerischer Kapazitätskonflikt, wenig Puffer, ausreichend, außerhalb Prognosehorizont.
- Wunschtermin/Planned ist **keine** Hard Deadline.
- Aufgaben ohne Schätzung werden separat ausgewiesen. **Keine Aussage „alles schaffbar“, wenn nicht alle Aufwände bekannt sind.**
- Das ist eine erste Engpasswarnung, noch **kein vollständiger globaler Scheduler** mit Sequenzabhängigkeiten oder Belastungsmodellen.

## Projektplanung zusammen mit ChatGPT
1. In Compass unter Planen → Projekte einen Ordner oder ein Projekt auswählen (oder „Alle“), dann **JSON exportieren**.
2. Datei in ChatGPT hochladen und z.B. diesen Auftrag geben: 
   > „Plane dieses Projekt realistisch neu. Erhalte die `id` und `key` bestehender Einträge. Schlage fehlende Arbeitspakete, Unteraufgaben und Aufwandsschätzungen vor. Ändere echte `dueDate` nur, wenn ich ein Datum bestätigt habe. Nutze `plannedDate` für weiche Wünsche. Halte dich exakt an das Austauschformat und gib eine Import-JSON-Datei zurück. Rechne bei Zeitabschätzungen Review, Abstimmung und Puffer transparent ein.“
3. Die zurückgegebene Datei im ausgeklappten Projekt-Austausch importieren oder JSON einfügen und **Vorschau öffnen**.
4. Gruppen gezielt auswählen; bestehende IDs werden standardmäßig NICHT überschrieben. Nur mit gesondertem Opt-in werden vorhandene Einträge aktualisiert. Projekte ohne gewählte Eltern werden übersprungen, nicht unbemerkt umgehängt.
5. Nach expliziter Bestätigung werden alle validierten Einträge lokal im verschlüsselten Vault gespeichert und über den vorhandenen synchronisierten Projekt-/Aufgabenpfad übertragen.

## JSON-Format
- `format: "compass-project-exchange"`, `version: 1`
- `projects`: `{key, id?, parentKey?, title, outcome?, category?, status?, kind?, folderIcon?, projectType?, dueDate?, reviewIntervalDays?, sortOrder?}`
- `tasks`: `{key, id?, projectKey, parentTaskKey?, title, note?, category?, workflow?, plannedDate?, dueDate?, deferUntil?, estimateMinutes?, tags?, contextTags?, progressCurrent?, progressTarget?, sortOrder?, completed?}`
- `key`: eindeutiger Bezeichner innerhalb der Datei (max. 80 erlaubte Zeichen). Für neue Datensätze **kein** `id` vergeben, Compass erstellt eine UUID.
- Exportierte vorhandene IDs unverändert lassen, wenn eine bestehende Aufgabe gezielt aktualisiert werden soll.
- Keine frei formulierten Abhängigkeiten werden als Ausführungslogik importiert. Für lineare Abläufe `projectType: "sequential"` verwenden; vorhandene GTD-Regeln gelten weiterhin.
- Bis 120 Projekte, 1200 Aufgaben und 1 MB JSON. Validierungsfehler verhindern eine Teilübernahme.

## Sicherheits- und Produktgrenzen
- Niemals sensible Projekt-/Klientendaten ohne ausdrückliche Auswahl an ChatGPT weitergeben.
- Die Importvorschau wird lokal analysiert; keine KI- oder Cloud-Verbindung durch den Import.
- Ein ChatGPT-Projektplan enthält **Schätzungen**, keine wissenschaftlich garantierten Bearbeitungszeiten.
- Update im Sync-Konflikt wird zurückgewiesen. Gleichzeitige Änderungen nach der Vorschau verhindern die Übernahme.
- Vor großem Bulk-Import verschlüsseltes Vault-Backup erstellen.
- Wenn Projekte bereits synchronisierte IDs haben, werden Änderungen als normale ausstehende Mutationen verarbeitet; auf anderen Geräten nur nach erfolgreicher Synchronisation sichtbar.

## Test-/Deployment-Stand
- Keine neue D1-Migration, keine Worker-Schnittstellenänderungen.
- `npm run check` und 454 Unit-/Integrationstests bestanden.
- `npm run build` hier noch nicht möglich (Vite in der bereitgestellten Umgebung nicht installiert). Visuelle Live-Abnahme offen.
