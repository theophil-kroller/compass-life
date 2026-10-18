# Compass 0.5.7 · Personal Analytics – Phase 1

**Basis:** Compass 0.5.6 auf GitHub `main`.
**Umfang:** Nur Web/PWA. Android-Widget und Cloudflare Worker bleiben unverändert. **Keine neue D1-Migration, kein Wrangler-Deploy, keine neue APK.** Die Worker-API bleibt auf Version 11 (`release: 0.5.5`).

## Was neu ist

- **Neue Hauptnavigation „Insights“:** acht ikonbasierte Themen-Tabs: Schlaf, Body Battery, Stress, Aktivität, Produktivität, Körper, Orte, Explore. Der Schlaf-Tab ist funktionsfähig; die anderen Tabs sind bewusst als bevorstehende Ausbauphasen gekennzeichnet und enthalten keine simulierten Messwerte.
- **Schlaf & HRV aus echten Garmin-Importen:** Schlafdauer (Tief-/Leicht-/REM-Minuten, Wachzeit ausgeschlossen), zeitliche Konsistenz von Ein-/Aufwachzeiten mit nächtlicher Achse, nächtliche HRV und direkt aus Garmin gelieferte 7-Tage-HRV-Werte, gewichtungsrichtige Wochenmittel je vorhandener Nacht, auswählbare Einzel-Nacht mit Stadien-Zeitachse.
- **Zeiträume:** 7 Tage / 4 Wochen / 90 Tage / 1 Jahr / gesamter Verlauf. Fehlende Tage sind keine Null-Messungen und werden in der Linienansicht nicht überbrückt.
- **Visuelles Konzept:** editorial gestaltete Kennzahlen, SVG-Linienplots, ruhige Gitternetzlinien, Farblegenden und mobil responsives Tab-Raster. Grafiken lesen die vorhandenen verschlüsselten Garmin-Werte unmittelbar nach dem Entsperren des lokalen Vaults. Keine erneute Datenübertragung.
- **Import-Hilfen:** Direktlink zu `https://connect.garmin.com/app/settings/accountInformation` und ein aufklappbarer Fitdays-Export-Hinweis auf der bestehenden Gesundheits-Import-Seite.

## Installation

1. Vor Updates **verschlüsseltes Vault-Backup** in Compass erstellen. Browserdaten keinesfalls löschen, PWA nicht deinstallieren. Garmin- und Fitdays-Detailimporte liegen **nur im lokalen Vault des jeweiligen Browsers**; sie sind **noch nicht** zwischen PC und Telefon synchronisiert.
2. `Compass_0.5.7_GITHUB_PATCH.zip` lokal entpacken. Die enthaltenen Dateien **mit erhaltenen Ordnerstrukturen** in GitHub `theophil-kroller/compass-life` / Branch `main` hochladen (keine ZIP-Datei als Repository-Datei hochladen).
3. Unter GitHub Actions den **Deploy Compass Web** abwarten, bis er grün ist. **Keine Android-APK installieren, kein Cloudflare-SQL und kein Worker-Deploy** für 0.5.7 nötig.
4. Compass-PWA normal neu laden, Tresor entsperren, über **Insights → Schlaf** die Zeiträume wechseln; vorhandene Garmin-Daten werden direkt benutzt. Bei nur wenig Garmin-Historie sind entsprechend wenige Messpunkte sichtbar.
5. Über **Gesundheit** Garmin-/Fitdays-Daten nachimportieren. Danach zurück zu Insights wechseln – die Auswertungen aktualisieren sich direkt.

## Grenzen und statistische Transparenz

- **Sleep Score, Sleep Need, HRV-Baseline/Status, Stress und Body Battery sind aus den aktuell gespeicherten Detail-FIT-Datensätzen in Compass noch nicht zuverlässig verfügbar**. Sie werden **nicht** geschätzt. Die nächsten Phasen erweitern den Garmin-Dekoder gezielt und entwickeln zusätzliche Diagramme.
- Nacht-Zeiten verwenden die **aktuelle Gerätezeitzone des Browsers**. Die exportierten FIT-Zeitstempel enthalten nicht immer die historische Ortszeitzone; bei Reisen wird ein ausdrücklicher Hinweis gezeigt. Insbesondere ein späterer „Orte & Schlaf“-Vergleich benötigt verlässlich bestätigte Übernachtungsorte und Zeitzonen.
- **Keine 95%-Konfidenzintervalle in 0.5.7**, weil für echte longitudinale CIs ein statistisches Verfahren mit Umgang mit Autokorrelation, Messlücken und Mindeststichprobenumfang nötig ist. Echte Garmin-7-Tage-HRV-Records sind keine Konfidenzbänder.
- Die Wochenbalken zeigen Durchschnittsschlafdauer **je gültiger, gemessener Nacht**; fehlende Tage werden nicht als normale Null-Tage gezählt.
- 0.5.7 lädt keine detaillierten Gesundheitswerte in die Cloud. Die älteren Health-Connect-Tageswerte in Cloudflare D1 sind davon unabhängig und bleiben im alten Schutzmodell.

## Qualitätssicherung

- `node --test tests/*.test.mjs`: **114 von 114 Tests erfolgreich**.
- `node --check` für alle geänderten JavaScript-Dateien erfolgreich.
- `npm run build` kann lokal ohne installierte Node-Abhängigkeiten nicht ausgeführt werden (`vite: not found`). Der GitHub-Actions-Produktionsbuild muss vor Freigabe auf Geräten grün sein.
- Keine Änderung am Garmin-Importer, Worker, Android-Manifest, D1-Schema oder Tresor-Kryptografie.

## Geplante weitere Phasen

0.5.8 detailliertere Schlaf-/HRV-Auswertung; 0.5.9 Stress/Body Battery (nach Dekodierung echter FIT-Felder); 0.5.10 Fitness und Körperreport; 0.5.11 Produktivität × Gesundheit; 0.5.12 bestätigte Orte/Schlaf; 0.5.13 Statistik-Explorer und datenschutzschonend verschlüsselte Cloud-Aggregate.
