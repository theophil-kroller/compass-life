# Compass 0.5.77.35 · Muskelkarte & Berührungsjournal

**Voraussetzung:** Compass 0.5.77.34 ist vollständig auf GitHub installiert.
**Format:** Nur neue/ersetzte GitHub-Dateien, kein Full Source ZIP.

## Krafttraining
- Navigation: 💪 Muskel-Symbol statt generischem Balkendiagramm, sowohl in der Hauptnavigation als auch im kompakten Insights-Reiter.
- Eine **zweigeteilte Muskelkarte** zeigt Vorder- und Rückseite gleichzeitig, ohne zusätzliches Umschalten.
- Umschalter: **Haupt / Neben** (Rot = Hauptgruppe, Gelb = Unterstützung; Grau = ohne Zuordnung) und **Satzbelastung** (Gelb → Orange → Rot mit zunehmender *dokumentierter* Satzbeteiligung).
- Vorhandene Trainingseinheiten, FIT-Imports, manuelle Übungszuordnungen, Satzgewichte und Garmin-CSV-Summaries bleiben unangetastet.
- Beschriftungen aktualisiert: FIT-Dateien sind nicht mehr Voraussetzung für nachträgliche Übungszuordnung.
- Farben sind eine **visualisierte Zuordnung**, keine Muskelaktivierungsmessung oder individuelle Risiko-Bewertung.

## Berührung & Nähe
- **Neu:** Streicheln und Massage; Tanzen gab es bereits und bleibt nur ein Mal vorhanden.
- Optionale, nicht wertende Selbstauskunft nach der Begegnung: angenehm / neutral / unangenehm / unklar / keine Angabe.
- Neue kompakte 7-/30-/90-Tage-Übersicht: dokumentierte Begegnungen, Tage mit Eintrag, farbige Zeitleiste, Häufigkeit je Art, freiwillig beschriebene Erlebnisse.
- Leere Tage sind **nicht protokolliert** (kein Schluss auf Abwesenheit von Berührung); mehrere Arten je Begegnung sind möglich.
- **Kein** automatischer Beziehungsscore und keine automatisierte Berührungszuordnung aus Tanz-/Sportaktivitäten. Tanzen bedeutet nicht automatisch Körperkontakt.
- Neue Erlebnisangabe wird wie bisher im bestehenden privaten touchJournal gespeichert und via vorhandenem, versionsbasiertem Journal-Abgleich zusammengeführt.

## Wissenschaftlicher Hintergrund
Packheiser et al. (2024), *Nature Human Behaviour*, DOI 10.1038/s41562-024-01841-8. Metaanalyse zu Interventionen mit Berührung; diese Befunde rechtfertigen **keine** individuelle Wirkungsprognose aus einem freiwillig geführten Ereignisjournal.

## Qualität
- 7 gezielte Node-Tests erfolgreich: Transformationsanker, Desktop-/Mobilicon, bestehendes Tanzen, neue Arten, Valenzspeicherung, Datenlücken, beide Muskelkarten und Beispiel Hip Thrust/Curl to Press.
- Kein vollständiger Vite-Produktionsbuild in dieser Umgebung (das Repository ist hier nicht vollständig materialisiert). Vor Live-Betrieb den GitHub-Actions-Deploy-Status prüfen.
