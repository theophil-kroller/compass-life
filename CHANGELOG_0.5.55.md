# Compass 0.5.55 — Conference Radar, Arbeitszeitvergleich & Navigation

Basis: Compass 0.5.54. **Keine neue D1-Migration.**

## Wichtigste Änderungen

1. **Projektzugang in der linken Navigation:** Der Eintrag »Projekte« ist als echter Link mit JavaScript-Navigation und `?view=projects`-Fallback ausgeführt. Alte Projekte bleiben über den geschützten Projekt-Renderer erreichbar. Bitte den echten Klick nach der Veröffentlichung prüfen.
2. **Mobile Navigation wieder als einzeilige Wischleiste:** Das mehrzeilige Vier-Spalten-Raster wurde für kleine Bildschirme entfernt. Hauptbereiche und Unterbereiche erscheinen jeweils in derselben horizontalen Leiste; »Menü« führt aus einem Unterbereich zurück. Auch die mobile Insights-Navigation bleibt einzeilig.
3. **Projekt-Aufgabenzeilen:** Der Fortschrittsbalken verdeckt auf engen Zeilen keine Titel mehr. Rechts wird ein kompakter `x/y`-Stand mit weiter nutzbarem `+1`-Bedienelement angezeigt; Details behalten den vollständigen Fortschritt.
4. **Arbeitszeitguthaben:** Überzeit mit Uhr-Symbol, Urlaub mit dezentem Insel-/Palmen-SVG.
5. **Mehrjahresvergleich der Arbeitszeit:** 2024/2025/2026 nebeneinander als Monatsbalken. Über den Pfeil in die Wochenansicht wechseln: Wochenpunkte in Jahresfarben, vorsichtiges 95-%-Konfidenzband für den geschätzten mittleren Trend bei ausreichender Datengrundlage. Offene/future Monate werden gekennzeichnet statt als abgeschlossene Vergleichswerte behandelt.
6. **Conference & Opportunity Radar:** Filter nach Forschungsthema und Region, kuratierte Calls mit Quellenlinks und Standdatum, Frist-/Kapazitäts-Hinweis, Merkliste und manueller Ergänzung. Ein Projektentwurf wird *nur über die bestehende Importvorschau* und nach ausdrücklicher Bestätigung übernommen. Keine Live-Web-Recherche, kein autonomer Hintergrundagent, keine automatisch erzeugten Kalendereinträge.

## Prüfungen

- 580/580 automatisierte Node-Tests erfolgreich.
- Cloudflare-Worker-Syntaxprüfung erfolgreich.
- Regressionstests für Projekt-Navigation, Conference Radar, mehrjährigen Wochen-/Monatsvergleich sowie mobile Einzeilen-Navigation.
- **Noch offen:** Vite-Produktionskompilierung, tatsächliche mobile Browserdarstellung und Live-Abnahme mit bestehendem Vault/echten Kalenderdaten. Ein headless Browseraufruf wurde von der Umgebung blockiert; daher keine Behauptung einer visuellen Abnahme.

## Sicherheit und Daten

- Keine neue D1-Migration, keine verpflichtende Server-Schemaänderung.
- Die Merkliste und selbst hinzugefügte Calls liegen im vorhandenen verschlüsselten Vault; Quellenlinks werden als HTTPS-Links validiert.
- Veröffentlichte CFP-Fristen können sich ändern. Vor einer tatsächlichen Einreichung immer die verlinkte offizielle Quelle öffnen und bestätigen.
