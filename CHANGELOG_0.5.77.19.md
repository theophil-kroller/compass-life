# Compass 0.5.77.19 – Sicherer Kontakte-Abgleich, mobiles Planen & Performance-Messung

## Fehlerdiagnose

- Die App zeigte auf dem Smartphone eine leere Beziehungslandkarte (`0 von 0 Menschen`), obwohl Planung und Inbox als synchronisiert gemeldet wurden. Quellcodeprüfung: `state.people` ist bisher ausschließlich im lokalen verschlüsselten IndexedDB-Vault gespeichert. Weder die allgemeine Aufgaben-/Inbox-Synchronisierung noch der private E2EE-Journal-Payload enthielten bisher Kontaktprofile. Ein grünes Synchronisierungsbanner war daher für „Menschen“ missverständlich. **Der Screenshot allein beweist weder eine Löschung noch vorhandene Kontakte auf einem anderen Gerät.**
- Die mobile Projektansicht zeigte auf einer Zeile Abhaken, Drag-Handle, Titel, Fortschritt, „Heute“, Flagge und Unteraufgabe. Auf schmalen Screens war der Titel abgeschnitten; zusätzlich wurde die nicht erledigte Checkbox mit einem zweiten Kreiszeichen versehen.

## Korrekturen

1. **Kontakte nicht blind überschreiben.** Ein neuer `mergePeopleDirectory` führt Profile anhand ihrer unveränderten IDs zusammen und berücksichtigt Änderungszeitpunkte. Leere Handy-Daten überschreiben die PC-Kontakte nicht. Tombstones verhindern, dass ein im aktivierten Kontaktabgleich gelöschtes Profil durch ältere Cloud-Daten erneut auftaucht. Legacy-Profile ohne Zeitstempel werden bevorzugt erhalten; bei Gleichstand wird deterministisch verglichen. Kein automatischer Rückgriff auf die Benutzeridentität oder fremde Accounts.
2. **Privacy by design.** Kontaktprofile einschließlich Beziehungsnotizen werden erst nach ausdrücklicher Bestätigung unter **System & Synchronisation → Kontaktprofile geräteübergreifend** in den bestehenden E2EE-Journal-Payload aufgenommen. Bereits eingerichteter privater Geräteabgleich mit gemeinsamem Schlüssel ist Voraussetzung, Opt-in auf **beiden Geräten** nötig. Bestehende Kontakte bleiben ohne Opt-in vollständig lokal; kein automatischer Klartext-Export und keine Änderungen an D1/Worker.
3. **Verständliche Leermeldung.** „Menschen“ unterscheidet jetzt zwischen „lokal 0 Kontakte“ und einem erfolgreich abgeglichenen Aufgaben-/Inbox-Bestand. Bei leerer Liste wird statt einer großen leeren Landkarte eine Diagnose mit Link zu den Einstellungen eingeblendet. Das grüne Sync-Banner bezeichnet die synchronisierten Datentypen präziser.
4. **Mobile Projekthierarchie.** Auf schmalen Displays werden Drag-Griffe, Flagge und „Heute“-Schaltfläche aus der Zeile entfernt (im Inspector weiterhin bedienbar). Checkbox, zweizeiliger Titel, Einrückung und Unteraufgabe bleiben. Das doppelt gerenderte leere Kreiszeichen entfällt.
5. **Echte Messwerte.** Unter System → Laufzeitmessung ein- und ausschaltbare, im Arbeitsspeicher gehaltene Messungen für Click-to-Paint je Aktion, Navigation, Formular, synchronen Renderaufbau, Render bis Darstellung, Vault-Verschlüsselung/Schreiben, Cloud- und Journal-Synchronisierung sowie Entsperren. Zusammenfassung nach Ansicht / Vorgang (Anzahl, Durchschnitt und Maximum). JSON-Export per explizitem Klick. Keine Aufgabeninhalte, Kontakt-, Projekt- oder E-Mail-Namen, keine URLs oder externen Telemetrie-Endpunkte; bei Neuladen verworfen.

## Wichtiger Migrationshinweis

1. **Vor dem Aktivieren:** Auf dem Gerät, auf dem die Kontakte vorhanden sind (meist Desktop), **System → Lokaler Tresor → Verschlüsseltes Backup herunterladen**. Auf dem Smartphone keine Daten löschen, keine neuen Personen als Ersatz anlegen.
2. Bestehenden privaten Geräteabgleich auf PC und Handy mit derselben Passphrase verwenden bzw. bewusst einrichten (beachte auch dessen übrige Datenkategorien).
3. Auf dem PC im System-Bereich **Kontaktsynchronisierung aktivieren**, **Kontaktprofile jetzt abgleichen** klicken.
4. Auf dem Handy ebenfalls aktivieren und abgleichen. Erst nach erfolgreichem Einlesen sollten Kontakte und Beziehungslandkarte angezeigt werden.
5. Falls `Kontakte 0` auch am PC: Nichts importieren oder zurücksetzen; zuerst ältere Tresor-Backups / Gerätezustand untersuchen.

## Grenzen und Tests

- Es ist ein **Opt-in E2EE Sync**, keine Wiederherstellung bereits gelöschter Daten. Ohne eine existierende Quellkopie lassen sich Kontakte nicht herbeizaubern.
- Bei paralleler Bearbeitung desselben Kontaktprofils ist eine neuere Fassung maßgeblich; die vorhandene Implementierung bietet noch keine visuelle Feldkonfliktauflösung.
- Performancewerte kommen erst nach Nutzung der aktualisierten App auf dem tatsächlichen Gerät zustande. Synthetische Tests sind kein Nachweis für die Geschwindigkeit mit dem persönlichen Datenbestand.
- `node --check` und die komplette `npm test` Suite erfolgreich. Worker-Check separat. Der Produktions-Vite-Build kann hier ohne installierte Vite-Abhängigkeiten nicht ausgeführt werden und ist beim GitHub-Deployment zu verifizieren.
- **Basisversion:** 0.5.77.18; **Zielversion:** 0.5.77.19. Keine D1-Migration, keine Worker-Änderung, keine Modifikation von `client/src/vault.js`.
