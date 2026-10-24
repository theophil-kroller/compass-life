# Compass 0.5.77.41 – Einkauf, Wasseraktivitäten, Nutrition & Garmin-Tagesziele

**Voraussetzung:** GitHub-Stand 0.5.77.40, bei dem Workflow #201 erfolgreich war.

## Einkauf
- 🛒 Icon im App-Header **nur**, wenn eine aktive Einkaufsliste im Vault existiert.
- Zeigt offene Positionen der vorausgewählten aktiven Liste.
- Ein Tipp öffnet die ausgewählte Liste direkt. Archiviert man die letzte aktive Liste, verschwindet das Icon.
- Vorlagen oder abgeschlossene Listen lösen das Icon nicht aus.

## Muskelanalyse
- 🛶 Eigene Ansicht **Kajak / SUP** mit aus Garmin-Sessions erkannten Aktivitäten.
- Getrennte anatomische Zuordnungen: Kajak (Rumpfrotation, Latissimus, Rücken/Arme) und SUP (Rumpf, Rücken/Arme plus Balance-Stabilisatoren).
- In **Gemeinsam** erscheinen diese Regionen zusätzlich; es werden **keine Paddelminuten als Kraftsätze** gezählt.
- Die Anatomiegrafik aus 0.5.77.40 samt Hover-Namen bleibt erhalten.
- Quellen: PMC8353118 (Kayak-EMG), doi:10.3390/app10072356 und PMC5057214 (SUP).

## Ernährung
- **Hofer Germknödel**: 1 Stück (187 g), 496–503 kcal, Community-Datenbank; tatsächliche Packung prüfen.
- **Hofer Laugenbreze mit Butter**: 95 g Brezel + 10 g Butter als editierbare Annahmen. kcal-Spanne wegen widersprüchlicher Community-Daten (214–314 kcal/100 g Brezel); 10 g Butter ≈ 72–76 kcal.
- Quellen: https://www.fatsecret.at/Kalorien-Ern%C3%A4hrung/hofer/germkn%C3%B6del/1-portion und https://fddb.mobi/de/hofer_laugenbrezel_backbox.html sowie https://www.fatsecret.at/Kalorien-Ern%C3%A4hrung/hofer/laugenbrezel/100g

## Kalorienampel dynamisch nach Garmin
- Aktivierte persönliche Fitdays-/Garmin-Energieziele: pro Kalendertag eine dynamische Farbeinteilung und eine sichtbare Tageszielanzeige.
- Garmin **Aktivitätskalorien** werden um den geschätzten Ruheanteil während des Trainings bereinigt und mit dem üblichen 28-Tage-Sportvolumen verglichen; kein pauschales Addieren auf den bestehenden PAL-Faktor.
- Mindestdatenabdeckung: 10 Garmin-Monitoringtage (Schritte) + Aktivitäten mit Kalorien/Dauer. Sonst bleibt die bewährte Basis-Skala unverändert.
- Doppelimporte CSV/FIT zusammengeführt, sofern Zeit, Dauer und kcal nahe beieinanderliegen.
- Rückwirkende Berechnung für die erfassten Tage des 28-Tage-Beobachtungsfensters bei jedem Render; nichts an Mahlzeiteneinträgen überschrieben.
- Garmin-Definition: https://support.garmin.com/de-DE/?faq=lkl4cwCLlK7ox362uGQEV7

## Rechnungsimport: Forschungs- und Folgebaustein, noch nicht implementiert
- Kein unkontrolliertes Beobachten von Dateiordnern über die Browser-PWA.
- Vorschlag: Lokaler Vault-Desktop-Importer / DataHub liest PDFs direkt, Bilder via lokales OCR, LM Studio für strukturiertes JSON.
- Kassenbons erst nach manueller Vorschau und Abgleich mit Bank-Transaktionen, Einkaufslisten und Händlerregeln freigeben.
- Duplikate anhand Datei-Hash, Händler, Zeit und Gesamtbetrag vermeiden; Rabattpositionen separat behandeln.
- Kein automatisches Buchen unsicherer Zeilen und keine Pflicht zum Cloud-Upload.

## Qualität
- 12 gezielte lokale Tests bestanden sowie Syntaxprüfungen aller JS-Dateien.
- Vollständiger `npm run check` und `npm run build` **noch nicht lokal möglich** – dies muss GitHub Actions nach deinem Upload bestätigen.
