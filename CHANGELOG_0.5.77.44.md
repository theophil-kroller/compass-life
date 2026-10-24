# Compass 0.5.77.44 – Traumwelt, permanenter Einkaufswagen, Kassenbon-Mehrfachimport

Baut auf der erfolgreich veröffentlichten 0.5.77.43 auf.

## Änderungen

- **Traumwelt:** Der Mond-Schnellzugriff und die Traumwelt-Navigation erhalten einen direkten Klickhandler, der das Formular öffnet und fokussiert. Keine Änderung bestehender Journaleinträge oder Verschlüsselung.
- **Einkaufswagen:** Immer in der Titelleiste sichtbar, unabhängig von aktiven Einkaufslisten. Bei aktiver Liste weiterhin Badge mit offenen Positionen. Ohne aktive Liste öffnet der Knopf die Einkaufslisten-/Kassenbon-Ansicht statt einer Fehlermeldung.
- **Kassenbon-GPT-Import:** Akzeptiert sowohl ein einzelnes `compass_receipt_v1`-Objekt als auch ein Array aus mehreren solchen Objekten. Unterstützt ` ```json `-Codeblöcke und die von ChatGPT-Kopien bekannten Soft-Linebreak-/`&#x20;`-Artefakte.
- **Mehrfachvorschau:** Vor dem Speichern werden jeder Bon mit Datum, Händler, Positionen, Summen und Hinweisen separat gezeigt. Erst nach Bestätigung werden validierte Bons ins verschlüsselte Journal geschrieben. Dubletten werden übersprungen, nicht mehrfach importiert.
- **Kompatibilität:** Alte `parseReceiptJSON`-Schnittstelle für Einzelbons bleibt erhalten. Ein historischer Reihenfolgen-Test für das Vite-Plugin-Array wurde aktualisiert.

## Einschränkungen

- Kein automatischer OCR-Dienst und keine automatische Finanzbuchung.
- Es werden ausschließlich überprüfte JSON-Bons importiert; die Herkunftsqualität der GPT-Auslesung muss weiterhin mit dem Originalbon abgeglichen werden.
- **Teststatus:** 15 lokale gezielte Tests inkl. Modul-/Syntax-/Mock-Integration; kein vollständiger Vite-Produktionsbuild in dieser isolierten Arbeitsumgebung.
