# Compass 0.5.77.43 — Traumwelt, Bon-JSON-Import und automatischer Journalabgleich

Basis **0.5.77.42** (GitHub Actions #203 erfolgreich). Dieses ZIP ist ein **differenzielles Upload-Paket**, keine ZIP des gesamten Repositories.

## 1 · Traumwelt (Insights)

- Drei getrennte Kategorien: Nachttraum, Tagtraum, bewusste Fantasie.
- Schnellerfassungs-Kachel in der Titelzeile und neuer Unterreiter **Traumwelt** unter Insights.
- Kurztext/Titel, Datum/Uhrzeit, Gefühl (optional), Lebendigkeit (1–5, optional), Klartraum-Flag, eigene Tags.
- Chronik für 7/30/90 Tage mit präzisen Tagespunkten statt erfundener Ruhe- oder Traumlos-Tage.
- Bearbeiten, Löschen (Synchronisations-Tombstone) und Merge zwischen Geräten.
- Keine automatische Traumdeutung, keine psychologische Diagnose.
- Von GTD-„Dreams/Someday/Maybe“ vollständig getrennt.

## 2 · Gerätesynchronisierung automatisch bei App-Fokus

- Bei erneuter Sichtbarkeit, Fensterfokus und Online-Rückkehr startet der **bestehende verschlüsselte Journalabgleich** automatisch, wenn der Vault entsperrt und die Verbindung konfiguriert ist.
- 25-s-Drosselung und Schutz vor gleichzeitigen Journalflights.
- Kein erzwungener Refresh während der Bearbeitung von Traum-, Bon- oder Kraftsatz-Formularen.
- Speichern löst weiterhin den automatischen Journal-Push aus; die manuelle Abgleichen-Schaltfläche ist nur ein Retry.
- E2EE-Schema um `dreamJournal` und `receiptJournal` mit konfliktfester per-ID-Zusammenführung ergänzt.

## 3 · Kassenbon → ChatGPT → JSON → Compass

- Einkaufslistenansicht um **Kassenbons** ergänzt.
- Prompt zum Kopieren und Verwendung mit einer Kassenbon-Fotografie/PDF.
- JSON-Schema `compass_receipt_v1`; nur nachvollziehbare Beträge und Produktinformationen.
- Lokale Parsing-/Plausibilitätsprüfung, Importvorschau und ausdrücklich bestätigter Import.
- Strikte Dublettenprüfung, Sicherung als verschlüsseltes `receiptJournal`.
- Monatsübersicht zu Bons, Gesamtausgaben (bekannte Summen), Produktbezeichnungen und Einkaufshäufigkeit.
- **Keine automatische** Erstellung von Banktransaktionen, Lebensmitteleinträgen oder Mahlzeiten.
- GPT-gestützte Bildverarbeitung erfolgt außerhalb von Compass; Nutzer entscheidet über das Hochladen des Kassenbons an ChatGPT.

## Teststatus

- 34 gezielte Tests einschließlich der relevanten Legacy-Tests zu `.41` und `.42` bestanden.
- Ein vollständiger CI-Testlauf inklusive Vite-Produktionsbundle ist **hier nicht ausführbar**, da die Repo- und npm-Abhängigkeiten lokal nicht vollständig vorliegen.
- Nach dem GitHub-Upload Buildstatus unter Actions prüfen.
