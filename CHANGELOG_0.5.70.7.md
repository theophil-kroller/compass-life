# Compass 0.5.70.7 – Heute: Fokus-Inspector

## Geändert

- Die rechte Spalte in **Heute** zeigt im Normalzustand nur **„Was passt jetzt?“** an.
- Beim Auswählen einer Aufgabe ersetzt **der Aufgaben-Inspector** diesen Bereich vollständig. Die bislang dauerhaft zusätzlich angezeigten Blöcke „Aufgabendetails“, „Offene Gesprächsthemen“ und „Große Übersicht ansehen“ entfallen in der Heute-Seitenleiste.
- Ein klares **X / Inspector schließen** schließt den Inspector und zeigt sofort wieder „Was passt jetzt?“ an.
- Beim Wechsel zum aktuellen Tag über die Navigation oder bei der Auswahl eines anderen Kalendertags wird die Standardansicht wiederhergestellt.
- Auf schmalen Bildschirmen scrollt die App beim Auswählen einer Aufgabe zum Inspector, statt ihn weit unterhalb der Liste unerreichbar zu lassen.
- Die Aufgabenliste, der bestehende Editor, Speicherlogik, Projekte und Cloud-Synchronisierung bleiben unverändert.

## Technik

- Reine Frontend-UX-Korrektur, **keine Worker- oder D1-Migration**, kein Vault-Reset.
- Basis: **0.5.70.6**.
- Teststand: 751/751 Node-Tests (einschließlich vier neuer UI-Regressionsprüfungen); JS-Syntaxprüfung erfolgreich.
- Vite-Produktionsbuild und manuelle Browserabnahme nicht in dieser Umgebung verifiziert.
