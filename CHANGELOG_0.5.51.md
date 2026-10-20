# Compass 0.5.51 · Sleep UX & Health Intelligence

Ausgangsversion: **0.5.50**. Keine neue Datenbankmigration, keine neue Cloudflare-Worker-API. Import-Hub und übrige Compass-Funktionen bleiben unverändert.

## Schlafansicht (im tatsächlichen Quellcode)
- Eigenes SVG mit **abgerundeten quadratischen Bézier-Übergängen** statt eckigen vertikalen Linien. Phasenfarben, Zeitstempel und echte Messlücken bleiben erhalten.
- Kreisförmige **Schlafeffizienz** aus plausiblen Schlaf-/Bettzeiten; bei nicht berechenbarer Effizienz steht „–“ statt einer erfundenen Prozentzahl.
- Datum mit **Pfeilen zum vorherigen/nächsten tatsächlich gemessenen Tag**; die Auswahl reicht auch über die 28-Tage-Ansicht hinaus. Fehlende Nächte werden übersprungen.
- Kompakteres Nacht-Metrikenraster, mobile Darstellung geprüft. Vorhandene Wochen-, Monats-, Jahres- und Boxplot-Auswertungen bleiben erhalten.

## Health Intelligence
- Neue **lokal berechnete, erklärbare Beobachtungen** zu 7-vs-30-Tage-Schlaf, nächtlicher HRV, Garmin-Stress/Body-Battery und (nur bei ausreichender Stichprobe) Aktivitäten innerhalb von vier Stunden vor Schlafbeginn.
- Beobachtung, Stichprobengröße, **mögliche Erklärungen** und „Was bedeutet das für mich?“ – ergebnisabhängig und bewusst ohne kausale oder medizinische Behauptungen.
- Fehlende Nächte sind keine Nullwerte; es gibt Mindeststichproben für Vergleiche; nie eine „Critical Health Warning“ aus Wearable-Daten.
- **LM Studio optional:** Nur nach expliziter Bestätigung werden gekürzte aggregierte Beobachtungen an `127.0.0.1:1234` übertragen. Das lokale Modell darf ausschließlich **bereits vorliegende Fakten anhand ihrer IDs priorisieren**. Freie medizinische Modellbehauptungen werden nicht angezeigt. Ohne laufenden lokalen Server arbeitet die regelbasierte Auswertung weiter. LM Studio braucht ein geladenes Modell und Browser-CORS-Zugriff.
- Kleine, eingeklappte Erklärungen statt großer neuer Dashboard-Ansichten.

## Verifikation
- 549 automatisierte Node-Tests erfolgreich, inklusive neuer Tests für echte Datenlücken, Nachtpfeile, Kreisanzeige, Zusammenhangs-Mindeststichproben, optionale lokale Modell-ID-Validierung, Stress, Body Battery und bestehende Finanz-/Importmodule.
- Worker-Syntaxprüfung erfolgreich.
- Browser-Stichprobe mit Chromium gegen gerenderte Testdaten auf Desktop und Mobil erfolgreich; 390 px Mobilansicht ohne horizontalen Seitenüberlauf.
- **Kein vollständiger Vite-Produktionsbuild**, da in dieser Quellumgebung die NPM-Frontend-Abhängigkeiten nicht installiert sind; das installierte Live-Produkt bleibt für eine echte Integration/Browserabnahme noch zu prüfen.
