# Compass 0.5.53 – Arbeitszeit & Sleep Trends

## Arbeitszeit in Insights

- Neues schlankes Insights-Untermenü „Arbeitszeit“; kein neues Hauptmenü.
- Import der vorhandenen Monatsblätter (`2026_Okt`, `2025_Sept`, `2023_Dec` usw.) aus einer `.xlsx`-Datei. Der lokale Import verwendet die bereits im Client definierte `xlsx`-Abhängigkeit. Original-Excel wird weder kopiert noch an den Worker übertragen.
- Datum wird aus Blattname und Tages-Spalte erzeugt, **nicht** aus der Excel-Zeile 8 (alte Cachewerte können 2017 anzeigen).
- Nur Buchungen bis zum heutigen Tag. Heutige Arbeitszeit wird nur übernommen, wenn die erfasste Endzeit bereits vergangen ist. Leere Tage und vorbereitete Zukunftsmonate werden ignoriert. Arbeitsstunden stammen aus der täglichen Arbeitsstundenzeile, nicht aus dem Blatt „Graphical Analysis“.
- Der bestätigte Excel-Überzeitsaldo aus Zeile 30 wird übernommen. Konsumierter ZA wird nicht erneut davon abgezogen.
- Urlaubsguthaben mit manuell bearbeitbarem Stichtag (voreingestellt: 192 Stunden am 20.10.2026); der Import erfasst konsumierte Urlaubstage, aber bereits vor dem Stichtag liegender Verbrauch wird nicht doppelt abgezogen.
- Idempotenter Reimport nach Tagesdatum; bestehende Tagesdatensätze werden aktualisiert.
- Kompakte KPI-Karten, echte ISO-Kalenderwochen, individuell markierbarer Überlastschwellenwert (35–55 h), gleitender 4-Wochen-Trend, Jahresumschaltung und Monatsauswertung.
- Arbeitszeit wird im verschlüsselten lokalen Vault gespeichert; bei aktivem, E2E-verschlüsseltem privatem Geräteabgleich dem Bereich „Health“ hinzugefügt. Keine Klartextübertragung von Arbeitsstunden über eine API.

## Schlaf

- Wochnavigation in der 7-Nächte-Ansicht: vor/zurück/heute, ohne künstliche Nächte.
- 12-Monats-Boxplots und Wochen-Boxplots nach Jahreszeiten eingefärbt: Winter blau, Frühjahr grün, Sommer orange, Herbst rotbraun.
- Jahrestages-Dotplot mit gleitendem 28-Tage-Median (mind. sieben Messnächte) und transparentem persönlichem Jahres-Interquartilsband; länger fehlende Aufzeichnungen werden im Trend nicht künstlich verbunden.
- Schlafphasen-Detailgrafik zeichnet je kontinuierlichem Messblock **nur noch einen** feinen, gerundeten SVG-Pfad, mit integriertem Verlauf über die Stadien statt zusätzlicher farbiger Übermalungen. Zeitangaben bleiben im SVG zugänglich.

## Technische Prüfung

- 561/561 automatisierte Tests bestanden, inklusive neuer Parser-/Saldo-/Wochen-/SVG-Tests.
- Worker-Syntaxprüfung bestanden; keine neue Worker-API und **keine neue D1-Migration gegenüber 0.5.52**.
- Realistische Tabellenstruktur der übergebenen Arbeitsmappe mit 37 Monatsblättern geprüft; 684 Buchungstage bis 19.10.2026, fortlaufender Excel-Saldo 125,76 h (≈ 125 h 46 min).
- Einschränkung: Ein produktiver Vite-Build und die tatsächliche Chrome-/Windows-Live-Abnahme waren hier nicht möglich; ein isolierter Chromium-Screenshotversuch lief in ein Timeout. Lokaler Excel-Import muss nach dem Deployment im Browser durch Importvorschau und gespeicherte Guthaben bestätigt werden.

## Geplanter nächster Build

**0.5.54 – Recovery & Time-off Recommender:** ZA-/Urlaubstage aus echten Kalenderfenstern, GTD-Deadlines, Kapazität und Schlaf-/Arbeitslast zunächst nur simulieren; ohne automatische Buchung.
