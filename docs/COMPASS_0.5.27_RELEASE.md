# Compass 0.5.27 – Minimal Planning Workspace & Project Templates

## Ziel
OmniFocus-inspirierte Reduktion: Struktur und echte Arbeit vor Metadaten. Die Dreiteilung (Navigation, Liste, Inspector) bleibt bestehen; offene Formulare werden eingeklappt.

## Umsetzung
- Kompakte Seitenköpfe ohne doppelte Statuszeile und redundante Untertitel.
- Planen → Projekte: geschachtelte Ordner/Projekte/Aufgaben/Unteraufgaben mit Drag-and-drop und alternativer Aktion „Verschieben nach …“, Plus-Aktionen am passenden Ort.
- Inspector: Titel/Notiz, Projekt/Status im Vordergrund, übrige Einstellungen unter „Weitere Einstellungen“.
- Vorlagen sind echte Projekte mit `isTemplate`-Feld, zusätzliche Ansicht „Planen → Vorlagen“. Kopien werden mit offenen Häkchen und ohne alte Datumsangaben erstellt; Original bleibt unangetastet.
- Inbox: direkter Projekt- und Statuswechsel im Inspector; Übernahme zu einer Aufgabe tombstoned den Inbox-Eintrag, keine Verlustschreibweise bei zu langen Titeln/Notizen.
- Flaggen per Zeilenbutton in Projektbaum und Inbox; markierte ungeklärte Inbox-Einträge erscheinen auch in Flagged. Bei Übernahme wird der Flag-Wert vererbt.

## Daten- und Sicherheitsentscheidungen
- D1-Migration `0013_project_templates.sql` additiv (`is_template` mit Default 0). **Migration vor Worker-Deploy**.
- Für Inbox Flags bleibt das bisherige Record-Schema kompatibel: reservierter Tag `compass-system-flag` im bestehenden Tags-Sync. Internes Tag wird im Inspector und in der Tag-Autovervollständigung verborgen. Wenn 12 normale Tags vorhanden sind, wird das Markieren verweigert statt einen Tag zu verlieren.
- Keine automatische Priorisierung/Deadline durch Flag.

## Prüfung und Grenzen
- `npm run check` mit Node- und SQLite-Migrationstests. Der lokale Vite-Build wurde mangels installierter Vite-Abhängigkeiten nicht ausgeführt.
- Keine Live-Abnahme mit persönlichem Vault, GitHub Pages oder Cloudflare-D1.
- Browserwarnungen sind nicht durch statische Dateiintegrität als unbedenklich nachgewiesen. Vorerst nicht umgehen.
