# Compass 0.5.26 – Local Capture & People-first Agendas

**Basis:** 0.5.25. Keine Worker-, D1-, Vault-Kryptografie- oder Sync-Schemaänderung.

## Neue Funktionen

- **Menschen:** Offene Aufgaben und unbestätigte Inbox-Gesprächspunkte stehen vor Kontaktverlauf und persönlichen Angaben. Aufgaben können unmittelbar mit einem Haken erledigt werden. Direkte Gesprächsnotizen bleiben an der jeweiligen synchronisierten Aufgabe bzw. dem Inbox-Eintrag. Wenn beim Abhaken bereits eine Notiz bearbeitet wurde, wird sie atomar mitgespeichert.
- **Unterschiedliche Semantik:** Eine bestätigte Aufgabe ist „Erledigt“. Ein noch nicht geklärter Inbox-Eintrag kann mit Gesprächsnotiz gespeichert oder ausdrücklich als „Besprochen & archivieren“ markiert werden. Kein Inbox-Text wird ungefragt zu einer Aufgabe.
- **Inbox:** Optionale Mehrfacherfassung von kurzen, strukturierten Meeting-Folgepunkten (Aktion, Waiting For, Gesprächspunkt, Beschluss, Idee, Ungeklärt). Entwürfe werden zunächst mit Dublettenhinweis in der Vorschau gezeigt. Nur bestätigte Vorschläge werden als normale synchronisierte Inbox-Einträge angelegt, ohne künstliche Deadlines.
- **Lokale KI (optional):** `tools/capture/local_ai_capture.py` fragt ausschließlich den explizit gestarteten LM-Studio-Server auf `127.0.0.1:1234` ab und liefert prüfbare JSON-Entwürfe. Keine Notion-Anbindung, keine Cloud-Ausweichverbindung. Ohne laufendes lokales Modell funktioniert die manuelle Mehrfacherfassung unverändert.

## Datenschutz und Architektur

- Keine Übertragung vollständiger Meeting-Protokolle oder dauerhafte zweite Notizdatenbank.
- Klassifikation ist ein Vorschlag: Es entstehen ohne Bestätigung keine Next Actions, Termine oder Waiting-For-Aufgaben.
- Bereits bestehende Aufgaben-/Inbox-Synchronisation wird verwendet; die lokale Kontakthistorie aus 0.5.24 bleibt wie zuvor nur auf diesem Gerät.
- Das Erfassen und Abhaken unter „Menschen“ löst denselben Sync-Weg aus wie in der Aufgaben- und Inbox-Ansicht. Bestehende Aufgabenkonflikte müssen vor Änderungen aufgelöst werden.

## Qualität und Grenzen

- 310 automatisierte Tests bestanden (305 Bestand + 5 neue 0.5.26-Tests).
- JavaScript-Syntaxprüfung und Worker-Check erfolgreich.
- Personenansicht mit synthetischen Beispielwerten in Chromium bei 1440 px und 390 px geprüft; keine horizontale Seitenüberbreite.
- Die vollständige Live-PWA-/Vault-Abnahme muss auf dem Endgerät erfolgen. `npm run build` lokal nicht verfügbar: `vite: not found` (fehlende installierte npm-Abhängigkeiten). GitHub Actions vor Produktion prüfen.
