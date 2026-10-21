# Compass 0.5.70.2 – Kontaktentwürfe & Journal-Sync-Diagnose

## Beziehungslandkarte und Kontaktverlauf
- Datumswähler und Notizfeld bleiben während der Bearbeitung stabil: Hintergrund-Renders werden nicht über einen fokussierten Formulareingang gelegt.
- Datum, Kontaktart, Notiz und neue Initiator-Angabe werden als **Entwurf im verschlüsselten lokalen Vault** automatisch gespeichert. Ein Entwurf ist noch kein bestätigter Kontakt. Erst „Kontakt festhalten“ schreibt in die Chronologie. Beim Bestätigen wird der Entwurf entfernt.
- Kontaktinitiierung: **von mir / andere Person / gemeinsam / nicht erfasst**.
- Vorhandene Kontakte bleiben unverändert und zeigen bei fehlender Initiator-Angabe „Nicht erfasst“. Keine automatische Zuschreibung.

## Arbeitszeiterfassung / Geräteabgleich
- Zeiterfassungs-Popover zeigt Gerätetyp, Anmeldestatus, die zuletzt gelesene verschlüsselte Cloud-Journalversion, ggf. den bestätigten Cloud-Timerbeginn sowie den Fehlertext des Journal-Abgleichs.
- „Jetzt abgleichen“ direkt beim Timer. Bei fehlender Schlüsselkonfiguration wird der Setup-Bedarf sichtbar.
- Erfolgsanzeige konkretisiert: „Journal auf diesem Gerät abgeglichen“ statt implizit beide Geräte.
- Journal-Abgleich wird auch nach erfolgreichem Wiederherstellen einer bestehenden Anmeldesitzung angestoßen.

**Wichtig**: Dies ist eine Diagnose-/Stabilitätskorrektur. Die Cross-Device-Synchronisierung setzt weiterhin voraus, dass auf **beiden** Geräten die neueste Compass-Version läuft, der Tresor entsperrt und derselbe verschlüsselte private Geräteabgleich eingerichtet ist. Bei gesperrtem Tresor werden neue Einträge zunächst nur auf dem betreffenden Gerät verschlüsselt vorgemerkt. Eine „grüne“ allgemeine Planungssynchronisierung bedeutet noch nicht, dass der Timer des zweiten Geräts übertragen wurde.

## Prüfungen
- 722/722 Node-Testfälle einschließlich 4 neuer Tests zu Initiatoren, Entwurfspersistenz und Remote-Timerdiagnose.
- JavaScript-Syntaxprüfung für Hauptanwendung und Kontaktmodul.
- Produktionsbuild und synchronisierter Echtversuch zwischen zwei Geräten in dieser Umgebung nicht verifiziert.
- Keine D1-Migration und kein Vault-Reset notwendig.
