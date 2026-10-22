# Compass 0.5.71 — Morning Intelligence

Baseline: Compass 0.5.70.8

## Neue Benutzeroberfläche
- Insights → Habits enthält jetzt **Routine**, **Gestalten** und **Insights** unter einem gemeinsamen Miracle-Morning-Bereich.
- Die vorhandenen Schnellzugriffe und die sechs SAVERS-Schritte bleiben erhalten.
- Keine weitere Schaltfläche in der globalen Titelzeile.

## Gestalten
- Affirmationen einzeln hinzufügen oder entfernen. Bisherige Affirmationen bleiben erhalten.
- Zielkarten anlegen: eigenes Symbol, Titel, kurze Visualisierung, optionales Bild und optionale Verknüpfung zu einem bereits vorhandenen Lebensziel.
- Bilder werden lokal im Browser auf maximal 520 Pixel verkleinert, als JPEG komprimiert (max. ca. 110 KB) und im verschlüsselten Vault gespeichert. Bilder und Zieltexte erscheinen nicht im gesperrten Player.
- Dauer aller sechs Schritte, Kurzhantel-/Ab-Wheel-Übungen, Reading-Buch und Journaling-Frage in einem kompakten Bereich anpassen.

## Scribing & Journal
- Eigene Journaleinträge erstellen, lesen, bearbeiten und löschen.
- **Autosave im lokalen verschlüsselten Vault** mit Verzögerung, ohne die Texteingabe und mobile Diktatur nach jedem Zeichen neu aufzubauen.
- Verschlüsselte Geräte-Zusammenführung mit stabilen Eintrags-IDs und Bearbeitungszeitpunkt; Löschungen als Tombstones.
- Bestehende Scribing-Texte abgeschlossener v0.5.70-Routinen werden in der neuen Chronik sichtbar, ohne Duplikate zu erzeugen.
- Scribing-Text aus neu abgeschlossenen Morning-Routinen erscheint im Journal.
- Laufende Scribing-Texte werden bei entsperrtem Vault als verschlüsselter lokaler Entwurf gespeichert. Im Sperrmodus kann ein Scribing-Text weiterhin mit der abgeschlossenen Routine als versiegelter Eintrag übernommen werden.

## Insights
- Tatsächliche Routinen, durchschnittliche erfasste Zeit, Tage mit dokumentierter Routine und aktuelle Serie.
- Durchführungsquoten je SAVERS-Schritt; übersprungene Schritte zählen nicht als abgeschlossen.
- Echte 7-, 30- und 90-Tage-Verläufe ohne erfundene Daten, mit explizit gekennzeichneten Aufzeichnungslücken.
- Spätere Auswertung möglicher Beziehungen zu Schlaf und Gefühlswelt vorbereitet, keine Kausalbehauptungen.

## Daten & Kompatibilität
- Keine D1-Migration erforderlich; der verschlüsselte Journal-Abgleich aus 0.5.69.2 transportiert die neuen Felder im bestehenden `miracleMorning`-Objekt.
- Abwärtskompatible Erweiterung von `miracleMorning.config`, `sessions` und `notes`.
- Persönliche Texte und Bilder werden nicht in öffentliche Quick-Capture-Statusdaten geschrieben.
- Gegenüber dem ursprünglichen 0.5.70.8-Test korrigiert ein versionsgebundener Inspector-Test seine Erwartung auf eine gültige spätere Versionsnummer.

## Prüfstatus
- 762/762 Node-Tests erfolgreich.
- Node-Syntaxprüfungen der geänderten Module erfolgreich.
- Ein vollständiger Vite-Produktionsbuild und die mobile, reale Browserabnahme waren in dieser Laufzeit nicht möglich (kein installierter Vite-Toolchain/Lockfile).
- Zwei-Geräte-Livesynchronisierung der neuen Journal- und Bilddaten wurde nicht auf echten Geräten überprüft.
