# Compass 0.5.9 – Personal Analytics / Garmin Stress & Body Battery

**Basis:** Compass **0.5.8** auf GitHub `main`. **Reines Web-/PWA-Update.** Es gibt keine neue Cloudflare-D1-Migration, keinen Worker-Deploy und keinen Android-APK-Build. Die Worker-API bleibt `apiVersion: 11`, Worker-Release `0.5.5`.

## Neuer Umfang

- Der lokale FIT-Decoder unterstützt Garmin-Nachricht **227 (`stress_level`)** mit Zeitstempel (Feld 1), Stresswert (Feld 0) und `body_energy`/Body Battery (Feld 3). Garmin verwendet negative Stress-Codes als ungültig / nicht messbar, insbesondere bei Aktivität. Diese werden **nicht** zu Stresswert 0 umgedeutet. Werte >100 / ungültige Body-Energy-Werte bleiben leer. Die Feldbelegung wurde mit den tatsächlichen Garmin-WELLNESS-Dateien vom 15. und 17. Oktober 2026 sowie veröffentlichtem Garmin-FIT-Mapping gegengeprüft.
- Um langfristige Tagesarchive effizient lokal zu speichern, fasst Compass Werte **in fünfminütigen UTC-Zeitfenstern** zusammen: Stress als Median gültiger Messungen und Body Battery als letzter gültiger Messwert des Fensters. **Fehlende Messungen werden nicht geschätzt oder interpoliert.** Timestamps werden in ISO-UTC gespeichert; Tagesansicht und Zeitangaben folgen der aktuellen Gerätezeitzone. Das ist keine nachträgliche Rekonstruktion historischer Reiselokalzeit.
- **Insights → Stress:** Durchschnitt aus vorhandenen Messungen, Anzahl Messtage, tatsächliche Messpunktzahl, vier Stresszonen nach Messpunktanteil, historische Tages-/Wochenübersicht, wählbare Garmin-Tageskurve.
- **Insights → Body Battery:** Beobachtete Tageshoch/-tief-Werte, Summe kurzer gemessener Auflade- bzw. Entladeintervalle, historische High-/Low-Grafik, wählbare Garmin-Tageskurve mit Stress-Overlay. Die Charged/Drained-Summen überbrücken keine Messlücken über 15 Minuten und sind daher nicht automatisch identisch mit Garmins Tagesbilanz.
- Zeiträume: 7 Tage, 4 Wochen, 90 Tage, 1 Jahr und Alles. Große Zeiträume werden in der Historie als Wochenblöcke gerendert. Die Diagramme sind responsiv, scrollbar bei engen Displays und mit SVG-Beschreibungen versehen.
- **Insights → Datenquellen:** Vorschau zeigt zusätzlich Stress-/Energie-Messpunkte an. Das Importangebot erwähnt ausdrücklich den Nachimport bereits importierter Garmin-ZIPs. Der Import kann mehrere ZIPs oder FIT-Dateien sammeln und bleibt idempotent nach Zeitfenster.

## Bereits importierte Monate erneut einlesen

WICHTIG: Der alte Importer von 0.5.8 hat Stress/Body Battery **noch nicht gespeichert**. Erst wenn du die bereits gespeicherten Garmin-ZIP-Dateien unter **Insights → Datenquellen → Mehrere Exportdateien auswählen** erneut auswählst, stehen die Stress- und Energie-Messwerte für Juli, August, September und Oktober bereit. Du musst die Daten **nicht neu bei Garmin herunterladen**, solange du die Original-ZIPs noch hast. Eine erneut importierte Nacht überschreibt keinen detaillierteren bereits gespeicherten FIT-Schlafverlauf. Bereits erfasste Fünfminutenfenster werden nicht doppelt angelegt.

Fitdays-Daten brauchen keinen erneuten Import. **Original-FIT-Dateien werden weder im Vault noch in der Cloud gespeichert**, nur die dekodierten Zeitfenster im bestehenden verschlüsselten lokalen Vault dieses Browserkontexts. Health Connect bleibt ein getrennter Cloud-Übertragungsweg für Tagesdaten und wurde in dieser Version nicht verändert.

## Installationsreihenfolge

1. Im vorhandenen Compass auf demselben PC/Browser ein **verschlüsseltes Vault-Backup erstellen**.
2. `Compass_0.5.9_GITHUB_PATCH.zip` am PC entpacken. Inhalte **pfadgleich** nach GitHub `theophil-kroller/compass-life`, Branch `main` hochladen. **Nicht** die ZIP als einzelne Datei ins Repository hochladen.
3. GitHub Actions → **Deploy Compass Web**: grünen Build abwarten.
4. Compass-PWA neu laden, vorhandenen Tresor entsperren. **Keinen Cache löschen und die PWA nicht deinstallieren.**
5. **Insights → Datenquellen**: bisherige Garmin-ZIPs für Juli–Oktober gesammelt erneut hochladen. Vorschau mit Stress-/Energiepunkten prüfen, anschließend **Import übernehmen**.
6. Unter **Insights → Stress** und **Body Battery** die Tages- und 4-Wochen-Ansichten prüfen. Etwaige Datenlücken sind ehrlich; Body-Battery-/Stressdiagramme brauchen FIT-Dateien mit entsprechenden Messungen.

**Keine** D1-SQL-Migration, **kein** Wrangler-Worker-Deploy, **keine** neue Android-APK.

## Qualität und Grenzen

- `node --test tests/*.test.mjs`: 128 automatisierte Tests grün.
- Echter Garmin-WELLNESS-FIT-Dekodiertest mit den zwei bereitgestellten Tagen: 506 5-Minuten-Fenster mit Body-Battery-Werten und 425 mit gültigem Stress erkannt (vor der globalen Zusammenführung über überschneidende Exportteile). Die privaten FIT-Dateien sind **nicht** Bestandteil der ZIPs.
- Desktop-/Mobile-HTML-Renderings im Headless-Chromium: keine globale horizontale Seitenüberbreite in den QA-Ansichten; die kleinen SVG-Diagramme dürfen innerhalb der eigenen Karte horizontal scrollen.
- Keine lokale Vite/npm-Produktionskompilation nachgewiesen: erforderliche npm-Abhängigkeiten sind hier nicht installiert. GitHub Actions muss die Buildbarkeit bestätigen.
- Physiologischer Garmin-Stress und Body Battery sind Geräteschätzungen. Es handelt sich nicht um medizinische Diagnosen, es gibt **keine** KI-Interpretationen, nicht validierte Confidence-Ribbons oder synthetischen Garmin-Scores.
- Bei Kontodatenexporten im JSON-Format werden weiterhin nur Schlafwerte eingelesen. Stress/Body Battery werden aus den hier bestätigten **WELLNESS-FIT-Datensätzen** importiert; andere Garmin-Exportformate bedürfen gesonderter Validierung.

## Als nächstes

Compass 0.5.10: Aktivität/Fitness und Fitdays-Report-Vertiefung. Garmin-Aktivitäts-/Routen-Daten nur nach Formatprüfung, keine erfundenen GPS-Daten.
