# Compass 0.5.53.1 – Konkrete Aufgaben für Heute auswählen

- Projektbaum: Kleines, separat gekennzeichnetes **Heute**-Auswahlkästchen pro offener, tatsächlich ausführbarer Aufgabe. Kein neues Hauptmenü und keine zusätzlichen Ansichten.
- Das Kästchen setzt beziehungsweise entfernt ausschließlich `plannedDate` (Wunschtag). Der separate Erledigt-Kreis und der bestehende harte Fälligkeitstermin bleiben unverändert. Falls bereits ein anderer Wunschtag gesetzt ist, wird vor dem Überschreiben gefragt.
- Verfügbarkeitsregeln werden wiederverwendet: abgeschlossene, archivierte, Someday/Maybe-/Waiting-For-/On-Hold-, pausierte, vorläufig zurückgestellte, sequentiell blockierte oder Vorlagen-Aufgaben können nicht neu für heute gewählt werden.
- Nach dem Hinzufügen steht **dieselbe Aufgaben-ID** unter **Heute → Meine Aufgaben**. Bestehende Stückzähler mit `+1` erscheinen direkt dort und aktualisieren den identischen Aufgabenstand (z. B. 14/36 Prüfungen).
- Erneutes Anklicken hebt die reine Heute-Vormerkung wieder auf. Bei einer echten, heute fälligen Deadline bleibt die Aufgabe erwartungsgemäß in der Tagesansicht.
- Tastatur/Screenreader: `button` mit `aria-pressed` und dynamischer zugänglicher Beschriftung; kein irreführendes Erledigt-Häkchen.
- Aufgabe wird normal über bestehende verschlüsselte Vault-Speicherung und Aufgaben-Sync aktualisiert. Keine Worker-/D1-/Health-Migration.

## Prüfung

- 565/565 automatisierte Tests bestanden, einschließlich neuer Fälle für die Unabhängigkeit von Aufgabe/Erledigung, heutiges Planungsdatum und wiederverwendeten Stückzähler.
- Worker-Syntaxprüfung und Client-JavaScript-Syntaxprüfung bestanden.
- Visuelle Prüfung am installierten Browser und vollständiger Vite-Produktionsbuild stehen mangels lokal installierter Vite-Abhängigkeiten noch aus.
