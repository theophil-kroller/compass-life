# Compass 0.5.68 – Secure Quick Capture, Relationship Intelligence & Calendar Hints

Basis: 0.5.67.2. Keine neue Cloudflare-D1-Migration; keine Änderung an bestehenden Bank-, Gesundheits- oder Aufgabenfeldern.

## Verschlüsselte Schnellerfassung bei gesperrtem Tresor

- Öffnen per sichtbarem Button oder Capture-FAB auch bei gesperrtem Tresor, sobald die Funktion einmal bei entsperrtem Vault eingerichtet wurde.
- Hybrid-Verschlüsselung: pro Notiz frischer AES-256-GCM-Schlüssel; dieser wird mit dem gerätespezifischen RSA-OAEP-Public-Key verschlüsselt. Der private RSA-Schlüssel liegt ausschließlich AES-GCM-verschlüsselt unter dem aktiven Vault-Schlüssel in IndexedDB. Keine Klartext-Notizen in localStorage oder sessionStorage.
- Beim Entsperren: verifizierte Queue lesen, Einträge mit ursprünglicher UUID in Inbox + Sync-Queue übernehmen, **zuerst** verschlüsselt im Vault speichern, **danach** Queue quittieren. Crash zwischen Save/Acknowledge erzeugt durch UUID-Prüfung keine Dublette.
- Inhalt bleibt bei Verbindungsunterbrechung offline in IndexedDB erhalten; maximal 100 noch nicht übernommene Schnellnotizen. Kein automatisch vorgespielter Speichervorgang.
- Export/Import des vollständigen verschlüsselten Vault-Backups umfasst ab sofort auch die versiegelten Schlüssel und die ausstehenden verschlüsselten Schnellnotizen. Alte Backups enthalten diese neuen Felder nicht.
- Sicherheitshinweis: Auf einem Gerät, auf dem diese Funktion noch nicht eingerichtet wurde, ist die gesperrte Schnellerfassung bis zum ersten Entsperren nicht verfügbar. Die verschlüsselten Notizen sind nur mit dem zugehörigen Tresorpasswort wieder lesbar.

## Kontaktpflege passend zum Alltag

- Pro Person unter **Erweiterte Kontaktpflege** die Kontaktmodi: bewusst Kontakt halten, regelmäßiger Alltagskontakt, gelegentlich, pausiert. Optionaler gemeinsamer Haushalt schaltet auf Alltagskontakt.
- Beziehungstyp (Kollegin, Familie usw.) und Nähe bleiben unabhängig vom Kontaktmodus. Keine automatische Kontaktpflicht für Haushaltsmitglieder oder Kollegen.
- Bestehende freiwillige Kontaktintervalle bleiben beim Upgrade aktiv; fehlende Intervalle werden nicht automatisch zu Aufgaben.
- Life Balance Radar „Kontakte“ berücksichtigt nur aktiv gewählte Rhythmen mit bestätigten Kontakten. Alltagskontakt und Pausen zählen weder als überfällig noch als fiktiv erfüllt. Im rechten Inspector: letzte dokumentierte Interaktionen, fällige Kontaktimpulse, Menschen ohne dokumentierten Kontakt sowie optional frühere Kontakte mit signifikant längerer Protokolllücke.
- Berichte über Kontakte sagen ausdrücklich nur etwas über **dokumentierte** Interaktionen, nicht über die Gedanken oder Beziehungsqualität.

## Google Calendar – nach Bestätigung

- Im People Inspector erscheinen zu einer Person passende **vergangene Google-Termine** als mögliche Treffen. Der Benutzer bestätigt ausdrücklich, ob sie stattfanden. Abgesagte/ausgeblendete, zukünftige, ignorierte und bereits über Kalender-ID importierte Einträge erscheinen nicht.
- Im Heute- und Forecast-Bereich werden mögliche Prüfungen, Abgaben und Deadlines der kommenden 90 Tage erkannt; vorhandene Projektüberschriften werden heuristisch abgeglichen. Projektanlage ausschließlich nach Bestätigung. Vorschläge können ignoriert werden.
- Kalenderheuristiken nutzen Namen/Termintexte, keine externen KI-Dienste. Sie können falsch-positive Vorschläge oder übersehene Zuordnungen enthalten; keine automatische Fristgarantie.
- Google Calendar-Zugriff bleibt sitzungsgebunden; nach erneuter Anmeldung/Tab-Neustart muss die Kalenderverbindung gegebenenfalls neu autorisiert/aktualisiert werden. Abgelehnte Vorschläge bleiben lokal verschlüsselt in der Vault-State erhalten.

## Bedienung & Zuverlässigkeit

- Kontakteinträge: Duplikatprüfung bei identischem Tag/Art/Notiz, deaktivierter Speicherbutton während des Speicherns, sichtbarer Erfolgs-/Fehlerstatus nach lokalem Vault-Save.
- In der People-Ansicht werden Fenster- und Panel-Scrollpositionen nach einem Re-Render wiederhergestellt, wenn die gewählte Person unverändert bleibt.
- Kontaktmodus bleibt in einem aufklappbaren Einstellungsbereich, nicht als ständige Vollflächen-Auswahl.

## Tests / Grenzen

- 682/682 Node-Regressions- und neue Feature-Tests erfolgreich.
- Gesonderter IndexedDB/WebCrypto-Test prüft gesperrtes Schreiben, keine Klartextablage, gesperrtes Lesen, Entsperren und Verschieben in den Vault sowie verschlüsseltes Backup und Import.
- JavaScript/Worker Syntaxchecks erfolgreich.
- Kein vollständiger Vite-Produktionsbuild oder Live-Browser-Abnahmetest möglich, weil der notwendige Vite-Abhängigkeitsbaum hier nicht installiert ist. Vor Produktivdeployment `npm ci && npm run build` sowie Test auf dem Zielgerät ausführen.
