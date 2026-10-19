# Compass 0.5.21.1 – Calm Workspace UX Polish

## Änderungen
- Heute und Next Actions: zuerst Aufgaben, neues Eingabeformular erst über Plus.
- Flagged: nur bestehende markierte Aufgaben; aufklappbare Markierung anderer Aufgaben.
- Menschen: getaggte Inbox-Einträge bei zugeordneter Person als ungeklärt anzeigen.
- Inbox: doppelte Überschrift reduziert.
- Übersicht: zusätzliche Karten unter *Weitere Übersichten anzeigen*.
- Dreams: doppelte Erklärung entfernt.
- Insights Gesundheit: vier direkte Symbolschalter mit Hover-/Fokus-Tooltip,
  zugänglichem Namen und aktivem Zustand; mobil aktive Bezeichnung sichtbar.
- Freizeit/Erholung: Mehrfachauswahl von Veranstaltungskategorien via Checkboxen.
- Finance Überblick: aussagekräftige Einnahmen-/Ausgaben-KPIs zuerst; manuelle
  Vermögenswerte/Kraken-Null- oder unvollständige Bewertung nur auf Wunsch öffnen.
- Wochenreview: Symbol zu jedem Schritt, Schrittzahl bleibt sichtbar.

## Integrität & Grenzen
- Keine Änderungen an D1, Cloudflare Worker oder Kryptografie.
- Keine finanziellen oder gesundheitsbezogenen Nutzerdaten in Release-Archiven.
- Tests für Klassifizierung, Tag-Verknüpfung, Filter und GUI-Struktur ergänzt.
- Produktionsbuild/Realgeräteprüfung separat durch GitHub Actions und Nutzer.
- Importierte Inbox-Tags sind keine bereits akzeptierten Next Actions.
