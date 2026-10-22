# Compass 0.5.77.2 — Kinoprogramm: Filmkatalog statt 245 Einzelkarten

**Ausgangsbasis:** Compass 0.5.77.1 (mit dem vorherigen Schlafarchiv-Fix). **Frontend-only, keine Worker-/D1-Migration.**

## Beobachtung und Ursache

Der bestehende JSON-Import enthält Vorführungen, nicht unbedingt unterschiedliche Filme. Die bisherige Freizeit-Liste ordnete Einträge nach Datum und blendete pro Datum alle bis auf die ersten drei Einträge zunächst aus. Bei einer Recherche mit z. B. 245 Einzelvorführungen dominieren daher dieselben Filmnamen die Anzeige; zahlreiche andere Einträge verschwinden hinter „Weitere 120 anzeigen“.

Ein erfolgreicher Import von 245 Terminen belegt **nicht**, dass 245 verschiedene Filmtitel recherchiert wurden. Ohne das ursprüngliche JSON kann Compass nicht wissen, ob andere Filmtitel in der Recherche fehlen.

## Neue Funktion

- Neuer Umschalter „🎬 Kinoprogramm“ / „☷ Termine nach Datum“ auf der Freizeitseite. Der Kino-Recherche-Button und der Filter „Kino & Kabarett“ aktivieren standardmäßig die Kinoansicht.
- Filme erscheinen alphabetisch **einmal pro eindeutigem Filmtitel**. Im Film-Kärtchen bleiben alle einzelnen Vorführungen in den Daten und werden auf Wunsch vollständig angezeigt. Sie sind nach Datum/Uhrzeit/Kino sortiert und können **einzeln** gemerkt werden. Die offiziellen Detail-Links bleiben pro Vorstellung erhalten.
- Suchfeld für Filmtitel, Kino und Stadt sowie Seitenweises Nachladen weiterer **Filmtitel** (statt pro Tag die ersten drei Einträge). Kabarett erscheint als eigenständiger Abschnitt unter den Filmen.
- Leicht unterscheidbare Zeiträume: „7 Tage“, „Kalenderwoche“ (mit Blättersteuerung), „Alle Termine“ (gesamter importierter zukünftiger Bestand). Vorher war „Alle“ technisch nur eine Kalenderwoche.
- Bestandsanzeige nennt **Anzahl unterschiedlicher Filmtitel, Vorführungen und Spielstätten**. Dieselbe Statistik erscheint vor der Importbestätigung für das neue JSON.
- Falls viele Vorführungen auf auffällig wenige Filmtitel entfallen, zeigt Compass einen Hinweis auf potenziell unvollständige Recherche statt fälschlich ein vollständiges Kinoprogramm zu suggerieren.
- Kino-Rechercheprompt priorisiert vollständige **unterschiedliche Filmtitel** der einzelnen Kinos vor der hundertfachen Erfassung derselben wenigen Filme. Nur belegbare Veranstaltungen behalten.
- Reguläre Eventliste bleibt verfügbar; dort werden zunächst acht statt drei Termine pro Tag gezeigt.

## Datenschutz und Datenhaltung

Keine bestehende Veranstaltung, Merkliste, Importhistorie oder ursprüngliche Veranstaltungsschlüssel werden migriert oder überschrieben. Die Filmtitel-Gruppierung ist eine reine Ansicht auf die vorhandenen Termine; keine externe API und keine neuen Berechtigungen.

## Verifikation

**811/811 Node-Tests bestanden**, inkl. neuer Regressionstests zur Filmgruppierung, Vorführungszeiten, Suchfunktion und Hinweis bei 245 Vorführungen mit nur zwei Titeln. Worker-Syntaxprüfung und JavaScript-Syntaxchecks erfolgreich. Ein produktiver Vite-Build war in dieser Umgebung mangels installierter Vite-Abhängigkeiten nicht möglich: GitHub Actions prüfen.

## Grenzen

Fehlen im ursprünglichen JSON Filmvorführungen bzw. Filmtitel, können sie nicht aus dem gespeicherten Import rekonstruiert werden. Für vollständigeres Kinoprogramm den verbesserten Rechercheprompt erneut ausführen und die neue Titeldifferenz in der Importvorschau prüfen. Spielzeiten und Programmänderungen nur über die verlinkten Kinoseiten bestätigen.
