# Compass 0.5.77.20 – Menschenbereiche & sichere Sync-Entlastung

## Grundlage: reale Laptop-Messung (Compass 0.5.77.19)

Die vom Nutzer exportierte Datei umfasste 240 Messpunkte; **180 gehören zur Finanzansicht, 58 zum Review, 2 zu System**. Sie enthält keine repräsentativen Messreihen für Heute, Inbox, Planen oder Menschen.

| Gemessener Vorgang | Anzahl | Mittelwert | Maximum |
| --- | ---: | ---: | ---: |
| Cloud-Abgleich (Finanzen) | 4 | 21.820 ms | 22.884 ms |
| Cloud-Abgleich (Review) | 1 | 14.616 ms | 14.616 ms |
| Tresor speichern (Finanzen) | 41 | 1.329 ms | 2.447 ms |
| Tresor speichern (Review) | 16 | 1.253 ms | 1.466 ms |
| Journal-Abgleich (Finanzen) | 4 | 1.729 ms | 1.874 ms |
| Review-Assistent: Schritt | 9 | 760 ms | 872 ms |
| System-Seite darstellen | 1 | 2.055 ms | 2.055 ms |
| Finanzansicht rendern | 42 | 92 ms | 330 ms |

Interpretation: Hohe Gesamtdauern für Cloud-Abgleiche **beweisen keine durchgehend blockierte UI**; die Protokollierung misst die Wall-Clock-Dauer der Synchronisierung. Häufige Vollspeicherungen sind ein nachweisbarer erheblicher Arbeitsaufwand, insbesondere bei großen verschlüsselten Vaults. Der aktuelle Patch vermeidet bestimmte unnötige Saves; eine echte Vorher/Nachher-Messung bleibt erforderlich.

## Funktion: Menschen nach Arbeitskollegen/Privat filtern

- Schneller, sichtbarer Drei-Wege-Schalter **Alle / Arbeitskollegen / Privat**, jeweils mit Anzahl.
- Grundlage ist ausschließlich die von der Person **selbst festgelegte Beziehungsart** (`relationKind==='colleague'`); keine Inferenz aus Titel, Nähe, Kalender oder Personen-Tag.
- **Privat = alle anderen**, einschließlich fehlender Klassifizierung. Damit verschwinden bestehende Kontakte nicht wegen leerer/neuer Metadaten.
- Filter gilt für **Kontakte UND Beziehungslandkarte** und behält „Offene To-dos zuerst“ bei.
- Bei leeren gefilterten Bereichen wird ein verständlicher Filter-Leerzustand angezeigt, keine irreführende „0 Kontakte im Tresor“-Meldung.
- Neues Kontaktprofil aus Arbeitskollegen-Filter erhält ausdrücklich diese Beziehungsart. Über „Beziehung & Nähe“ später änderbar.
- Filter ist eine rein lokale **Ansichtseinstellung im Arbeitsspeicher**, hat keine Auswirkungen auf bestehende Kontakte, deren IDs, Cloud-Synchronisierung oder Notizen.

## Performance: weniger unnötige Vollverschlüsselungen

- Projekt- und Aufgaben-Snapshot-Abrufe mit **bereits bekannter identischer Version** erzeugen kein erneutes Überschreiben des lokalen Objekts und keinen überflüssigen Vollspeicherauftrag.
- Neue Versionen, fehlende Datensätze und bestätigte ausstehende Änderungen werden weiterhin übernommen und dauerhaft verschlüsselt gespeichert.
- Leere Inbox-Pull-Antworten mit unverändertem Cursor lösen keinen Tresorspeichervorgang mehr aus.
- **Keine Änderung an** `vault.js`, Verschlüsselung, Sync-Konfiguration, Schlüsselableitung, Worker oder D1. Vorhandene E2EE-Kontaktsynchronisierung aus .19 bleibt bewusst opt-in.
- **Bewusst nicht angefasst:** Allgemeine Speicherstrategie/Schreibqueue, Journal-Merge, Finanzdaten, aggressive Debounces. Die Messwerte sind noch kein Beleg, dass ein breiter Umbau sicher wäre.

## Qualität und Installation

- Basis: **0.5.77.19**; Ziel: **0.5.77.20**.
- `node --test tests/*.test.mjs`: **923 von 923 bestanden**, einschließlich neuer UI-Tests für gefilterte Kontakte und Beziehungslandkarte sowie Versions-/No-op-Snapshot-Schutz.
- Syntaxprüfung `client/src/main.js`, `client/src/tasks.js`, `worker/src/index.js` erfolgreich.
- Kein D1- oder Worker-Update erforderlich. Für die Installation Patch-Inhalt ab Repository-Wurzel hochladen.
- Einen echten Vite-Produktionsbuild und repräsentative Leistungswerte auf dem Nutzergerät ersetzt dieser Testlauf nicht.
- Bitte vor Kontakt-Synchronisierungsänderungen zuerst **verschlüsseltes Laptop-Vault-Backup** erstellen; Handy-Tresor nicht zurücksetzen. Die neue Filterfunktion benötigt selbst keine Migration.
