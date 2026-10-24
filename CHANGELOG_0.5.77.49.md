# Compass Life 0.5.77.49 – Body Transformation Intelligence & CI-Repair

**Basis:** GitHub `main` nach Upload der Quellcode-Dateien für 0.5.77.48 (Commit `184e8b0`). Letzter erfolgreicher GitHub-Actions-Deploy war 0.5.77.47 (#208). Build #209 von 0.5.77.48 schlug nach 1180/1181 Tests fehl; der Produktionsbuild wurde übersprungen.

## 1. Reparatur der .48-Deployment-Blockade

- Ein Test blockierte pauschal alle Arbeitsblöcke am 26.10.2026, weil er ein festes `+01:00` verwendete, obwohl die Capacity Engine Stunden in der **lokalen Laufzeit-Zeitzone** erzeugt. Im UTC-Runner entstand dadurch eine scheinbar freie Reststunde.
- Testereignisse werden nun zur lokalen Arbeitszeit passend mit `new Date('2026-10-26T09:00:00').toISOString()` konstruiert. Dadurch gilt auf CI-Runnern und in Wien/Graz die gleiche Fachlogik: Kalenderpuffer blockieren tatsächlich die betroffene Arbeitszeit.
- Die zugehörigen älteren Regressionstests berücksichtigen den neuen Bridge-Eintrag vor `VitePWA`.
- Die produktive Kalender-Engine wird hierfür nicht unnötig geändert.

## 2. Sicherung der Kapazitätseinstellungen

- Speichern des Fokusstundenbudgets nutzt nun `saveCapacitySettings749`, das die in .48 hinzugefügten **Arbeitspakete pro GTD-Aufgabe** erhält. Vorher überschrieb der ältere .47-Handler die gesamten `capacityGuardian`-Einstellungen, einschließlich `packets`.
- GTD-Aufgaben und der verschlüsselte Vault werden nicht migriert oder neu geschrieben.

## 3. Körper, Krafttraining und Ernährung

- Im bestehenden **Insights → Gesundheit → Körper** steht jetzt direkt oben „Körper, Training & Ernährung“.
- Fitdays-Tageswerte: einzelne, nicht interpolierte Dot-Plots für Körpergewicht, BIA-Körperfettanteil und BIA-Muskelmasse. Die jeweils letzte Messung eines Tages wird verwendet.
- Veränderungen zeigen den Abstand zwischen erster und letzter Messung **innerhalb des gewählten Zeitfensters**, keine linearisierte Trend- oder Wachstumsaussage.
- Garmin-Krafttrainingssessions und dokumentierte Sätze aus der bereits vorhandenen FIT/CSV-Zusammenführung. CSV-Satzzahlen werden bei bekannten FIT-Einzelsätzen nicht doppelt summiert.
- Proteindaten stammen aus dem existierenden Ernährungs-Index; unvollständige/geschätzte Tage werden offen gekennzeichnet. Keine Nullwerte für Tage ohne Protokoll.
- Datenabdeckung, tatsächlicher letzter Datenstand jeder Quelle und Tage mit gleichzeitig dokumentiertem Protein & Krafttraining werden sichtbar.
- Keine Kausalbehauptungen, Diagnosen, automatische Trainingspläne oder Kalorienbedarfsberechnungen.

## Datenschutz, Deployment und Prüfstatus

- Rein clientseitige Auswertung bestehender bereits entschlüsselter lokaler Vault-Daten, **kein neuer Cloud-Endpunkt, keine neue D1-Migration, keine neuen Netzwerkzugriffe**.
- 8/8 fokussierte neue lokale Modultests im isolierten Testgerüst bestanden, außerdem Node-Syntaxchecks und Zeitzonen-Sanity-Checks (UTC, Europe/Vienna, America/New_York).
- Die isolierte Testumgebung verwendete einen kleinen .47-Abhängigkeitsstub; die echte Integration aller Repository-Dateien und der vollständige Vite-Produktionsbuild können erst in GitHub Actions nach Upload des Patches bestätigt werden. **Nicht als bereits erfolgreich deployt ausweisen.**
