# Compass Life 0.5.91.65 → 0.5.91.66

1. Bestehenden Tresor sichern. **Patch ausschließlich auf einen unveränderten Quellcode-Stand 0.5.91.65 anwenden**. Wenn der Stand abweicht, stattdessen das Full-Source-ZIP verwenden.
2. Das Patch-ZIP im **Repository-Stamm** entpacken, die enthaltenen Dateien an ihren relativen Pfaden überschreiben bzw. hinzufügen. Keine Tresor-, lokale Datenbank- oder personenbezogenen Exportdateien überschreiben.
3. Änderungen committen/zu GitHub hochladen. GitHub Actions führt `npm install`, `npm run check:deploy` und `npm run build` aus. Prüfen, ob Build und Pages-Deploy grün sind; dann PWA aktualisieren.
4. Unter **Frühstück** nach `Hirse` suchen: **pur** = 165 g, ca. 209 kcal; **mit Birne** = 265 g, ca. 266 kcal. Fruit zählt nur in Variante 2. Andere Obstsorten separat eintragen.
5. Alle Makros/Mikros sind **Rezeptschätzungen**, da das exakte Rezept der Freundin und das Portionsgewicht noch unbekannt sind. Genaue Rezeptur später aktualisieren. Es wird nichts automatisch für morgen oder einen anderen Tag gebucht.
6. Keine Migration erforderlich. Die komplette Liste der Annahmen und Validierungen steht in `RELEASE_0.5.91.66.md`.
