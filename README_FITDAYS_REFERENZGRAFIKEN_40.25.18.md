# Compass 0.5.77.59.40.25.18 – Fitdays-Referenzgrafiken sichtbar + BMI 184 cm

Basis: letzter erfolgreicher GitHub Actions-Deploy #329, Commit e5b9215934e3ff07f4654829acaffc5711f599bb.

## Sichtbare Änderungen

* Unter Insights → Gesundheit & Körper → Körperanalyse stehen die Referenzbalken als ERSTER Inhaltsabschnitt, vor den vorhandenen Dotplots und Segmentgrafiken.
* Gut sichtbare Positionsmarker, BMI-Abschnitte Untergewicht/Normalbereich/Übergewicht/Adipositas (allgemeine Kategorien für Erwachsene), und ergänzende Positionen für Fitdays-Körperfett, Viszeralfett, Subkutanfett und WHR – ohne unbelegte Hersteller-Grenzwerte.
* Die BMI-×-Körperfett-Grafik zeigt jetzt deine Position, auch wenn der Fitdays-Export keinen eigenen BMI hat: Aus der ausdrücklich mitgeteilten Körpergröße 184 cm und tatsächlichem Fitdays-Gewicht wird BMI berechnet. Bestehender Fitdays-BMI hat Vorrang. Ist im bereits vorhandenen Ernährungsprofil eine Körpergröße hinterlegt, wird diese bevorzugt verwendet.
* Weitere Kennzahlen und Erklärungen sind ausklappbar. Bestehende Training- und Ernährungskurven, segmentale Fett- und Muskelgrafiken bleiben unverändert.
* Keine Änderungen an gespeicherten Messdaten, Kassenbons, Journal-Sync, Garmin oder Mensa.

## Installation

Patch-ZIP ins Repository-Hauptverzeichnis über die vorhandenen Pfade legen. Nicht die Full-Source zusätzlich hochladen. Danach GitHub-Actions-Build kontrollieren und Compass hart neu laden. Die App-Versionsanzeige bleibt absichtlich auf der letzten eingefrorenen Version (der Patch ist .40.25.18).

## Prüfung

Alle 1.753 lokalen Node-Tests bestehen, JS-Syntax der beiden betroffenen Module und Worker-Check bestanden. Vite-Produktionsbuild in dieser Umgebung nicht ausführbar (vite nicht installiert), nach Upload durch GitHub Actions zu prüfen.
