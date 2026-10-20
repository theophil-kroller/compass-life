# Compass 0.5.59 — Inspector 2.0 & Quick-Capture-Schutz

**Basis: Compass 0.5.58.** Kein D1-Upgrade, kein Vault-Reset, keine neue Remote-API.

## Inspector 2.0
- Kompakter gemeinsamer Aufgaben-Inspector für die bereits geteilten Aufgabenansichten (Heute, Next Actions, Projekte und andere GTD-Listen): Stückfortschritt als Einzeiler, sofort sichtbare Datumssteuerung für **Defer**, **Geplant** und **Due**, Dauer und Kontexte; Notiz bei Bedarf aufklappbar.
- Direkte Schnellaktionen **+1d**, **+1w**, **+1m** und Datum löschen. Änderungen der Schnellaktionen bleiben im Formular, bis »Speichern« gedrückt wird. Ohne vorhandenes Datum beginnt die Berechnung heute, ansonsten am bestehenden Datum. +1m addiert einen Kalendermonat (Monatsende sauber begrenzt); keine künstliche Deadline.
- Titel, Projekt, GTD-Status und weitere Meta-Angaben unten in einem standardmäßig geschlossenen Bereich. Fortschrittsziel bei Bedarf aufklappbar. Die kompakten Speichern/Archivieren-Aktionen bleiben im Inspector sichtbar.
- Titelbearbeitung direkt in Aufgabenzeilen und Projektbaum: Stiftsymbol, Eingabe, ✓/×, Enter/Escape; Speicherung über bestehende Vault- und Synchronisationsroutine. Vorhandene Konflikt- und Template-Sperren bleiben wirksam.
- Weitere passende Inspector-Bereiche verwenden die kompakten Datumssteuerungen. Im Inbox-Inspector bleibt der Eingangstext direkt sichtbar, Projekt/GTD-Status werden eingeklappt; bei Projektmetadaten bleiben projektspezifische Felder erhalten.

## Quick Capture: kein Textverlust durch Hintergrund-Rendering
- Beim Neuaufbau der Oberfläche, etwa nach Synchronisation, Wetter- oder Geräteaktualisierungen, werden ungesendeter Quick-Capture-Titel, Notiztext, ausgeklappter Notizbereich und Cursorposition wiederhergestellt.
- Der noch nicht erfasste Entwurf bleibt nach Schließen mit Escape, X oder außerhalb des Modals bis zum erneuten Öffnen **im Speicher** erhalten. Erst nach erfolgreicher Inbox-Erfassung wird er geleert.
- Gilt ebenfalls für das Eingabefeld der Schnellerfassung auf der Übersicht.
- **Datenschutz:** Keine Klartextentwürfe in localStorage/sessionStorage, keine neue Cloud-Synchronisation. Ein Browser-Reload, eine Tabsitzung nach Beenden oder Vault-Sperre kann weiterhin einen ungesendeten Entwurf verwerfen: rechtzeitig in der Inbox erfassen.

## Qualität
- **604/604** automatisierte Node-Tests erfolgreich, inklusive neuer Tests zum Rerender-Schutz und Datum am Monatsende. Worker-Syntax- und clientseitige JavaScript-Syntaxprüfung erfolgreich.
- Nicht ausgeführt: Vite-Produktionsbuild (`vite` ist in der Laufzeit nicht installiert), visuelle Browser- und echte Vault-/PWA-Abnahme.
