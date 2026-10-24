# Compass 0.5.77.31 · Nutrition Insights 4 – Fettqualität

- Bestehenden **Insights → Ernährung**-Reiter um **🥑 Fettqualität** erweitert. Keine neue Hauptnavigation.
- **Fett gesamt, gesättigt, MUFA, PUFA, Omega-3-ALA, Omega-3-EPA, Omega-3-DHA, Omega-6-Linolsäure, Cholesterin und Transfette** getrennt sichtbar.
- Quelle und Datenqualität je erfasstem Eintrag: Etikett/Referenztabelle/Schätzung/fehlend. **Fehlend ist nie 0.** PUFA enthält Omega-3 und Omega-6 bereits; nicht erneut addieren.
- Exakte gemessene persönliche Portionsgröße für `peanuts`: **1 Handvoll gesalzene Erdnüsse = 20 g** statt 30 g. Bereits explizit mit 30 g erfasste Portionen bleiben 30 g; andere Handvoll-Standards unverändert.
- Generische Referenzprofile aus USDA / Canadian Dairy Commission für **Erdnüsse, Cheddar, Butter und ein generisches Spiegelei (46 g)**; immer als Schätzung für konkrete Marke. Keine erfundenen Omega-Daten für unbekannte Marken/Speisen.
- 7/30/90/365 Tage/Gesamt; **taggenaue Punktdiagramme** und Tooltip mit Abdeckung (offene Punkte bei unvollständigen Daten).
- DGE/ÖGE-Referenzwerte für Fett/Energie, SFA, ALA, Linolsäure, EPA+DHA, Transfette; bewusst keine simplifizierende Omega-6:3-Gesundheitsampel.
- Aufklappbare Übersicht **aller 40 katalogisierten Standardlebensmittel** sowie vorhandener eigener Lebensmittel; Quellenstatus im CSV `FETTQUALITAET_DATENABDECKUNG.csv`.
- Local-first: keine Übertragung von Ernährungseinträgen, keine Datenbankmigration und keine Server/API-Abfragen.
- Version 0.5.77.31 über die bestehende Vite-Bridge-Kette .27 → .28 → .29 → .30 → .31.

## Datenlücken und nächste fachliche Schritte

- Product-spezifische Fettsäuren für Chipssorten, Müslis, Kornbrot, Erdnussmischungen und Mensagerichte sind ohne detaillierte Rezeptur/Produktetikett oder Laborwerte nicht zuverlässig numerisch zu ermitteln.
- Auch das vorhandene Ernährungstagebuch kann unvollständig sein; daher keine Diagnose, keine rote Ampel aus wenigen Einträgen.
- Spätere Erweiterung: lokal editierbare produktgenaue Omega-/Fettwerte und Scan/Lebensmittelzuordnung nach vollständiger Quellenprüfung.

## Wissenschaftliche Quellen

- DGE/ÖGE Fett/essenzielle Fettsäuren: https://www.dge.de/wissenschaft/referenzwerte/fett-essenzielle-fettsaeuren/
- DGE Erwachsene https://www.dge.de/wissenschaft/referenzwerte-tool/filter/684/635
- Österreichische Ernährungsempfehlungen: https://www.gesundheit.gv.at/leben/ernaehrung/info/oesterreichische-ernaehrungspyramide/ernaehrungspyramide-fette.html
- USDA-Fettsäuren Erdnüsse (SR Legacy 16090): https://vitahoy.ch/de/ndb/pml/us-16090
- USDA Cheddar (SR Legacy 01009): https://vitahoy.ch/en/ndb/pml/us-01009
- Canadian Dairy Commission Cheddar: https://www.cdc-ccl.ca/en/node/780
- USDA generische Butter (Kompilation): https://www.nutritionadvance.com/fatty-acid-profiles-of-common-foods/

- USDA FDC 173423 Spiegelei: https://getfoodfacts.com/food/egg-whole-cooked-fried-173423
