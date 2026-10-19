# Compass 0.5.26 – optionale lokale Erfassung

Compass benötigt **keine Notion-Verbindung**. Meeting-Protokolle können im bisherigen Notizsystem bleiben. In Compass gelangen nur konkrete Folgepunkte.

## Ohne KI

In Compass **Inbox → Mehrere Folgepunkte erfassen** öffnen, Stichpunkte eingeben und die Vorschau einzeln bestätigen.
Beispiel:

```
- [Aktion] Präsentation an das Team senden
- [Waiting] Rückmeldung zur Freigabe abwarten
- [Agenda] Offene Frage bei der nächsten Besprechung ansprechen
```

Alle ausgewählten Punkte kommen als zunächst **ungeklärte Inbox-Einträge** in den Vault, nicht automatisch als Aufgaben.

## Optional: lokal mit LM Studio

1. Auf dem eigenen Rechner LM Studio installieren, ein Modell laden und den lokalen OpenAI-kompatiblen Server unter `http://127.0.0.1:1234` starten.
2. Eine Textdatei mit **ausgewählten** Ergebnissen / Folgepunkten erstellen (keine vollständigen oder vertraulichen Gesprächsprotokolle notwendig).
3. Im Projektordner ausführen:

```
python tools/capture/local_ai_capture.py --input meeting-punkte.txt --output compass-entwurf.json
```

4. Das erzeugte JSON selbst prüfen und in Compass unter **Inbox → Mehrere Folgepunkte erfassen → Strukturierter lokaler KI-Entwurf** einfügen. Nichts wird ohne explizite Auswahl übernommen.

Der Helfer hat nur den lokalen Endpoint fest einprogrammiert; es gibt keinen Cloud-Fallback. Lokale Modelle können falsch oder unvollständig extrahieren. Es werden **keine** Deadlines, Personen oder Zusagen automatisch erfunden.
