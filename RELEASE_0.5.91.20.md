# Compass Life 0.5.91.20 · WHR-Referenzgrafik und dynamische Körperproportionen

## Ausgangsbasis und Installation

- Basierend auf **vollständigem Quellstand 0.5.91.19**, nicht direkt auf aktuellem `main`, falls dort noch 0.5.91.18 liegt.
- Der Patch darf nur auf das unveränderte 0.5.91.19 angewandt werden; alternativ Full Source vollständig verwenden.
- Alle Pfade sind relativ zur GitHub-Repository-Wurzel. Nach Upload tatsächlichen Vite-Build und Deploy in GitHub Actions bestätigen. GitHub wird von dieser Erstellung nicht verändert.

## Neue, sichtbare WHR-Referenzgrafik

- Direkt unter „Weitere Kennzahlen – Waist-to-hip ratio · WHR“ ein stets sichtbarer Referenzstreifen inklusive eigener Positionsmarkierung. **Nicht** im eingeklappten Detailbereich versteckt.
- Der ausgewählte Referenzparameter stammt ausschließlich aus bereits konfigurierten Einstellungen (`nutritionJournal.energyGoal.formulaSex`); wenn unbekannt, markiert die Grafik **beide** populationsbezogenen Orientierungsgrenzen (Frauen 0,85, Männer 0,90) und den unsicheren Zwischenbereich. Kein stillschweigendes Ableiten eines Geschlechts aus Name, Stimme oder Bild.
- Werte stammen weiterhin aus der 0.5.91.19-Brücke zu tatsächlich paarigen Fitdays+-Smart-Tape-Messungen oder aus den dokumentierten Waagenwerten. Keine fiktiven Datumswerte oder Messungen, kein automatischer Import der privaten Chat-Datei.
- Ein Wert oberhalb der Referenz ist ein unspezifischer Risikomarker, **keine Diagnose und keine V-Taper-Norm**. Quelle: WHO, *Waist circumference and waist-hip ratio: report of a WHO expert consultation* (2011).

## Smart Tape: Proportionen und maßstabsorientierte 2D-Näherung

- Aus tatsächlich **gleichzeitig** gemessenen Schulter-, Brust-, Taillen- und Hüftumfängen entsteht eine parametrisierte Silhouette mit Messpunktinteraktion. Kopf, Hals, Arme, Beine und Waden werden – wenn aus derselben Messsitzung vorhanden – berücksichtigt. Keine Kombination einer alten Hüftmessung mit neuer Taille oder einer Teilaufnahme mit altem Torso.
- Vertikaler Maßstab wird nur dann als Körpergröße in cm beschriftet, wenn sie tatsächlich in den persönlichen Einstellungen hinterlegt ist. Breiten werden aus Umfängen mit **explizit angenommenen elliptischen Tiefen-/Breitenverhältnissen** abgeschätzt. Breiten/Tiefen, Knochenstruktur und Gliedmaßenlängen sind nicht direkt gemessen. Der SVG ist deshalb **kein maßstabsgetreuer 3D-Scan**, weder ein reales Körperfoto noch eine anatomische Vermessung. Bildschirmpixel sind keine physikalische 1:N-Abbildung.
- Frontalansicht zeigt links/rechts anatomisch korrekt aus der Sicht der vermessenen Person, d. h. anatomisch links auf Bildrechts.
- Bestehende klickbare Körperregionen und rechte Verlaufsansicht bleiben erhalten. Auf schmalen Bildschirmen werden Silhouette und Kennzahlen gestapelt, ohne Trainings-/RIR-UI zu überlagern.
- Neue Kenngrößen: WHtR (= Taille/Größe, nur mit gültiger Größe), Schulter/Taille, Brust/Taille, Schulter/Hüfte, WHR, optional BMI mit gültigem jüngsten realen Gewicht, Arm-/Oberschenkel-/Waden-Seitenunterschiede. Die *ästhetischen* Ratios haben bewusst keine erfundenen klinischen „Idealwerte“.
- WHtR nach NICE NG246: 0,40–<0,50 Referenzbereich, 0,50–<0,60 erhöht, ≥0,60 hoch. Damit kann eine aktuelle Waist-to-Height-Einordnung direkt aus dem Körpermaß und dokumentierter Größe berechnet werden. Wert <0,40 erhält keine falsche Normalbewertung.
- Kein automatischer Coach-Planwechsel aufgrund von Tape-Umfängen; keine fingierten Muskelwachstumsschätzungen oder Ziele. Eine Messung bleibt eine Baseline.

## Datenschutz

Die persönliche Fitdays+-Exportdatei und ihre tatsächlichen Messwerte sind **nicht** Bestandteil der GitHub-ZIP-Archive. Tests verwenden ausschließlich synthetische Werte. Daten verbleiben in `nutritionJournal.bodyMeasures88` (vorhandener verschlüsselter Speicher). Keine neue Datenbank, keine Migration.

## Prüfungen

- 14 neue Tests plus bisherige WHR-/Smart-Tape-/Fitdays-Karten-Regressionen: **40/40 bestanden**.
- `npm run check:deploy`: **33/33 bestanden**.
- `npm test`: **2046/2080**, 34 historische Altfehler der älteren Vite-/Modul-Ketten; zwei veraltete Tests auf feste Körpergröße/Versionsstand wurden gezielt an die nun dynamische Konfiguration angepasst. Keine neuen unerwarteten Testfehler.
- `node --check`: neue und geänderte JavaScript-Dateien ohne Syntaxfehler.
- `npm run build`: **nicht erfolgreich ausführbar**, da `vite: not found` (lokal fehlende NPM-Abhängigkeiten). Ein GitHub-Produktionsdeploy ist damit noch nicht bestätigt.
- Vollsource und Patch werden nach Erstellung mit ZIP-CRC, bytegenauer Rekonstruktion und Pfadliste geprüft.

## Medizinische Quellen

- NICE NG246 (aktualisierte Leitlinie), Abschnitt 1.9, WHtR: https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity
- WHO (2011), WHR: https://www.who.int/publications-detail-redirect/9789241501491
