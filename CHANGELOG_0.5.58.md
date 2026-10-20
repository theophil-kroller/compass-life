# Compass 0.5.58 — Arbeitszeit-UX, zentraler Import und Datenaktualität im Weekly Review

**Basis: 0.5.57.** Kein D1-Upgrade, kein Vault-Reset, keine neue Remote-API.

## Arbeitszeit
- Resturlaub: Palmen-/Insel-Icon von 18 auf 27 Pixel vergrößert; an breiten und schmalen Ansichten lesbar.
- Reihenfolge Insights > Arbeitszeit: KPIs → Wochenbelastung → Jahresvergleich (Monat/Woche) → Excel-Zeiterfassung und Urlaubsguthaben. Der redundante Detailblock „Monatsvergleich & Arbeitszeitkonten“ entfällt.
- Genauere Werte werden weiterhin durch die vorhandenen SVG-Tooltips der Balken/Wochenpunkte angezeigt; keine künstlich extrapolierten Wochenwerte.

## Smart Import Hub
- Neuer Dateityp **Arbeitszeit-Excel**. Bekannte Bezeichnungen wie `Arbeitszeit_2026.xlsx`, `Zeiterfassung.xlsx` oder `time-tracking-template.xlsx` werden vorsichtig zugeordnet. Anderen `.xlsx`-Dateien kann der Typ manuell zugewiesen werden.
- Weiterleitung an vorhandene `inspectWorktimeFile`-Prüfung mit Monatsblättern; erst nach ausdrücklicher Bestätigung `mergeWorktime`, kein automatisches Schreiben nach Dateiauswahl.
- Nach erfolgreichem Import: importierter Dateihash im Smart-Hub-Verlauf (falls Dateigröße Hash zulässt) und Zeitpunkt im verschlüsselten Vault. Bei manueller Änderung der Excel-Auswahl wird eine vorherige Smart-Hub-Zuordnung verworfen.
- Zusätzliche einklappbare Datenaktualitätsübersicht im Import Hub.

## Weekly Review
- Neuer sichtbarer Block **Datenaktualität aller Quellen**: Arbeitszeit, Garmin/Fitdays, Bank, Timeline, flatex, Kraken und importierte Projektpläne.
- Zwei **unabhängige Angaben**: Datum/Uhrzeit des letzten erfolgreichen Imports und fachlich letzter Datenstand, sofern aus gespeicherten Daten belegbar. Historische Importe ohne Zeitstempel werden nicht nachträglich datiert.
- Informationshinweise „Aktuell“, „Aktualisierung prüfen“, „Noch kein Import“ und „Datum bisher nicht erfasst“ (orientierende Intervalle je Quelle). Keine Pflichtaktion, keine automatischen Erinnerungen oder Datenübertragung.
- Direkter Link zum **Smart Import Hub** und zur Arbeitszeitansicht. Bestehende Einzelimporte in einem optionalen aufklappbaren Bereich weiterhin verfügbar.

## Qualität und Sicherheit
- 596/596 automatisierte Node-Tests bestanden (591 bestehende + fünf neue) und Worker-Syntaxprüfung erfolgreich.
- Produktions-Vite-Build nicht ausgeführt: `vite` ist in der Testumgebung nicht installiert (`sh: vite: not found`). Live-Browser-, Bildschirm-/PWA- und Echtdatenprüfung stehen aus.
- Kein Migrationsbedarf. Bestehende lokale Vault-Daten bleiben erhalten. Es wird ausschließlich lokale, verschlüsselt gespeicherte Import-Metadaten ergänzt.
