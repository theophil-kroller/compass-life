# Compass 0.5.8 · Insights Phase 2: Schlaf, HRV, gemeinsame Gesundheits-Navigation

**Basis:** Compass 0.5.7 auf GitHub `main`. **Nur Web/PWA.** Kein Android-/Garmin-Update, keine D1-Migration, kein Cloudflare-Worker-Deploy. Die Worker-API bleibt auf `apiVersion: 11` / `release: "0.5.5"` (kein 0.5.8-Worker versprochen).

## Was sich ändert

- **Nur ein Navigationspunkt „Insights · Gesundheit“.** Der alte separate Menüeintrag „Gesundheit“ wird entfernt. Ein älterer Deep-Link `?view=health` öffnet jetzt automatisch `Insights → Datenquellen`.
- **Datenquellen**: Garmin-/Fitdays-Bulk-Import mit Vorschau, Löschung und den bisherigen Export-Hilfen; Health-Connect-Synchronisation, Geräte-Verbindungen und Widget-Kopplungen bleiben dort erreichbar. Import bleibt lokal und verschlüsselt im Vault; die vorhandenen Health-Connect-Tagesdaten in D1 bleiben unabhängig davon bestehen.
- **Körper**: Der existierende Fitdays-Report (Gewicht, Fettanteil, Muskelmasse, Körperwasser, Viszeralfett, Segmentanalyse) ist als eigenständiger Insights-Tab erreichbar. Die Werte werden nicht neu importiert, sondern direkt aus `state.healthImports` gelesen.
- **Aktivität**: Vorhandene Health-Connect-Tageswerte (Schritte/Trainingsminuten) werden im Insights-Tab angezeigt und gehen beim Umzug aus „Gesundheit“ nicht verloren. Der weitergehende Garmin-FIT-Aktivitätsimport bleibt eine kommende Phase.
- **Schlaf**: Neu sind eine wöchentliche Schlafverteilung als Median + Interquartilsbereich (ab drei Nächten je Woche), eine empirische HRV-Spanne als 20.–80. Perzentil ab mindestens 14 HRV-Nächten und eine Schlafdauer-×-HRV-Streugrafik nur für Tage mit echten Wertepaaren. Bereits vorhandene Schlafphasen, Schlafkonsistenz, HRV-Werte und Zeiträume bleiben erhalten.
- **„Finanzen“ als geplante Übersicht:** Sechs anklickbare Kapitel (Überblick, Cashflow, Ausgaben, Fixkosten, Sparpotenzial, Portfolio) mit Quellhinweisen zu Bank-CSV, Kraken und flatex. **Noch keine Dateiimporte, Bankverbindungen, KI-Kategorisierung oder Finanzspeicherung.**

## Statistik & Datenschutz

- Die HRV-Spanne ist eine **deskriptive empirische Verteilung aus deinen importierten HRV-Werten**. Sie ist **keine Garmin-Baseline oder Garmin-Statusklassifikation**, kein medizinischer Referenzbereich und kein 95%-Konfidenzintervall.
- Wochenmedian und IQR zeigen beobachtete Verteilungen, nicht 95%-CIs. Fehlt eine ausreichende Anzahl Nächte, bleibt das Band leer. Fehlende Daten werden nie als Nullwerte behandelt.
- Der Schlaf/HRV-Scatter zeigt nur tatsächlich gemeinsam vorhandene Messungen je Nacht, keine ausgedachten Trends, Kausalität oder Korrelationen.
- Zeitstempel werden weiterhin in der Browser-/Gerätezeitzone angezeigt; historische Reisezeitzonen sind nicht zuverlässig abgeleitet. Die Rohdaten bleiben im lokalen Vault. Keine neue Cloud-Synchronisierung von Garmin/Fitdays.
- Health-Connect-Tageswerte sind getrennt davon bisher **zugriffsgeschützt, aber nicht Ende-zu-Ende-verschlüsselt** in D1 gespeichert. Daran ändert diese Version nichts.

## Installation

1. **Vorher ein verschlüsseltes Vault-Backup erstellen.** Keine Browserdaten löschen, PWA nicht deinstallieren – deine lokalen Garmin-/Fitdays-Detailimporte liegen ausschließlich im bestehenden lokalen Vault dieses Browsers.
2. `Compass_0.5.8_GITHUB_PATCH.zip` auf deinem PC **entpacken**. Alle enthaltenen Dateien mit unveränderten relativen Verzeichnissen ins Repository `theophil-kroller/compass-life` im Branch `main` hochladen, nicht die ZIP selbst.
3. Den Workflow **Deploy Compass Web** in GitHub Actions abwarten, bis er grün ist. Kein Cloudflare-SQL, kein Wrangler-Deploy und keine neue Android-APK für diesen Build.
4. Compass neu laden, Tresor entsperren, **Insights · Gesundheit → Schlaf, Körper, Aktivität, Datenquellen** ausprobieren. Falls ein altes Android-Widget „Gesundheit“ öffnet, leitet der alte Health-Link intern zu den Datenquellen weiter.
5. Unter **Finanzen** vorerst nur die Kapitel und offiziellen Export-Anleitungen prüfen; dort keine echten Finanzdateien hochladen, da der Importer noch nicht existiert.

## Qualität

- `node --test tests/*.test.mjs`: **122/122 Tests bestanden** (inkl. 8 neuer Integrations- und Statistikprüfungen).
- `node --check` für die geänderten JavaScript-Dateien erfolgreich.
- Die lokalen npm-Abhängigkeiten/Vite konnten in dieser Umgebung nicht rechtzeitig nachinstalliert werden; **der Vite-Produktionsbuild wurde deshalb nicht erfolgreich lokal nachgewiesen**. Erst ein grüner GitHub-Actions-Lauf bestätigt die Web-Buildbarkeit.
- Kein Worker-, SQL-, Android-, Garmin- oder Vault-Kryptografie-Code wurde geändert.

## Geplante nächste Phase

0.5.9: Stress und Body Battery aus echten Wellness-FIT-Datensätzen robust dekodieren; bei bestätigter Feldsemantik Garmin-artige Tageskurven und High-/Low-Verläufe aufbauen. Bei unvollständiger Datenlage zuerst die Dekodierung testen und keine Werte simulieren.
