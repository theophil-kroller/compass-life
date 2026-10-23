# Compass 0.5.77.21 — Fast Planning Input & Bioactive Nutrition

Ausgangsstand: 0.5.77.20. Reiner Client-Build, keine Cloudflare-D1-Migration und keine Änderung am Verschlüsselungsformat.

## Spürbar schnellere GTD-Erfassung

- **Vorlagenitem + neue Projekte:** Sofortige Darstellung des neuen Elements vor der teuren Verschlüsselung des vollständigen lokalen Tresors. Der Speichervorgang selbst bleibt verpflichtend, seriell und verschlüsselt; die Erfolgsmeldung erscheint **erst nach** erfolgreicher Speicherung.
- Neuer *schmaler Planungs-Checkpoint* für diese beiden kontrollierten Erzeugungsvorgänge. Anders als die bisherige allgemeine `structuredClone(state)`-Sicherung kopiert der Checkpoint nur die Planungsbereiche. Die anschließende dauerhafte Speicherung enthält weiterhin **alle** Daten im regulären verschlüsselten Tresor.
- Kann der Tresor nicht gespeichert werden, wird die Planungsänderung zurückgenommen und der Formularentwurf sowie die vorherige geöffneten Erstellungsansicht wiederhergestellt. Der Benutzer bekommt eine Fehlermeldung, keine falsche Erfolgsmeldung.
- Automatische Synchronisierung wird während aktiver Textbearbeitung in Projekt- und Aufgabenformularen um zwölf Sekunden verschoben. Explizit angestoßene Synchronisierung bleibt möglich.
- Neue Laufzeitmessungen **Eingabe: Vorlagenitem**, **Eingabe: Neue Aufgabe**, **Eingabe: Neues Projekt** und weitere Inspector-Eingaben. Bei aktivierter Messung wird nur jede vierte Eingabe gemessen. Keine Inhalte/Namen werden protokolliert.

## Ernährung

- Kleine Symbole nun auch bei allen Vitaminen und Mineralstoffen.
- Neue Tagessektion **Bioaktive Stoffe & Supplement-Inhaltsstoffe**; Matcha-Catechine **EGC** und **EGCG** werden getrennt dokumentiert. Koffein und L-Theanin ebenfalls. Die tatsächliche Tagesmenge ist als *Nicht bestimmt* ausgewiesen, solange kein verifizierter MatchaTherapy-Analysemesswert vorliegt; niemals fälschlich `0 mg`.
- Zusätzliche deklarierte Pflanzen- und Enzymbestandteile eingenommener Nahrungsergänzungen sind in der Tagesansicht aufklappbar und werden unabhängig von den Mikronährstoffen geführt. Deklarierte Einzelmengen werden proportional zur tatsächlich protokollierten Portion skaliert; unbekannte Einzelmengen bleiben unbekannt.

## Grenzen / nächster Architektur-Schritt

- Die **1–2 s teure vollständige Tresorverschlüsselung** und teilweise **14–20 s langen Cloud-Abgleiche** aus den realen Perf-Logs verschwinden damit nicht. Für einen grundlegend schnelleren Datenspeicher ist eine gesonderte, rückwärtskompatible Migration zu **verschlüsselten Teilbereichen und inkrementellen Writes** erforderlich, mit Backup, Wiederherstellung und Multi-Geräte-Konflikttests.
- Noch keine browserbasierten Lasttests mit dem persönlichen Datenbestand; gemessene Verbesserungen nach Installation erneut prüfen.

## Qualitätssicherung

- `npm test`: 929/929 erfolgreich (inklusive 6 neuer Tests).
- `npm run check -w worker`: erfolgreich. Worker unverändert.
- Für `npm run build` sind externe Vite-Abhängigkeiten erforderlich, die in der Arbeitsumgebung nicht installiert sind. GitHub Actions nach Deployment kontrollieren.
