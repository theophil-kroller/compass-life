# Compass Life 0.5.78 — Focus/Extended, Kontakte, Körpervergleich, Habit-Zeit

**Basis:** Compass Life 0.5.77.59.40.25.25. Der Versionsanzeiger in App und Tresor sowie npm-Paketversionen heißen ab jetzt **0.5.78**. Historische Dateinamen und alte Patches werden nicht umbenannt, um Referenzen und bestehende Importpfade zu erhalten.

## Umsetzung

- **7 Inspiration Levels:** Jedes Level besitzt eine eigene Kennfarbe (1 blau → 7 rot), eine Zahl, Text und ein eindeutiges Piktogramm (⛓, ⚖, ⌛, ◎, ✦, ✧, ♥). Die Level-Farbe wird auch im Reflexionsverlauf gezeigt. Dadurch sind die Werte nicht ausschließlich durch Farbe codiert.
- **Extended Mode:** Warme Amber-/Orangetöne für App-Hintergrund, Seitenleiste, Navigation, aktive Tabs, Schaltflächen und Fokusindikatoren, begrenzt auf `.shell.compass55-extended`. Focus bleibt grün. Medizinische Charts, Bewertungs-Ampeln und andere semantische Signalfarben behalten ihre ursprüngliche Bedeutung.
- **Lockscreen:** „✎ Gedanke“ rechts als kleine, fingerfreundliche Aktion oberhalb des zentralen Entsperrbereichs; die bisherige verschlüsselte Sealed-Capture-Speicherung bleibt unverändert. Es handelt sich um den Compass-internen Sperrbildschirm, keinen Android-Hardware-Lockscreen.
- **Berührung & Nähe → Meeting:** Ein explizit mit einer Person gespeicherter Nähe-Eintrag wird als persönliches Treffen mit tatsächlichem Datum im Kontaktverlauf und für Kontaktimpulse abgeleitet. Mehrere Berührungen am selben Tag ergeben nur **ein** Meeting. Bereits manuell dokumentierte Treffen haben Vorrang. Editieren, Löschen oder Neuzuordnen im Berührungstracker aktualisiert die Projektion automatisch. Keine neuen versteckten Kontakt-Records, keine Kalendervermutungen.
- **Körperfettvergleich:** Sechs **fotorealistische, KI-generierte** illustrative Körpervarianten anhand des Nutzer-Referenzfotos statt der früheren abstrakten Silhouette; Bildlabels sind UI-Text und werden nicht in das Bild hineingeschnitten. Die Bilder enthalten keine verifizierten medizinischen Phänotypen. Die Fitdays-Messung wählt die nächste plausible Bildstufe, statt ein individuelles Foto für jeden Prozentpunkt vorzutäuschen. Alle Kennzahlen kommen weiterhin aus importierten Fitdays-Messwerten, keine fixen Beispielwerte. Keine Diagnose bzw. genaue Vorhersage der persönlichen Fettverteilung.
- **Habit Time:** Vorhandene echte Coach- und Garmin-Krafttrainingsdauern werden aus den bereits importierten Daten in der Habit-Zeitbilanz angezeigt. Doppelte Einträge desselben Workouts werden soweit anhand der Zeitstempel erkennbar zusammengeführt. Ein Coach-Training wird nicht mehr allein ausgeblendet, weil Miracle Morning am selben Tag stattgefunden hat; nur nachweislich überlappende Einheiten werden unterdrückt.
- **Wim-Hof:** Frühere ausdrücklich abgehakte **Abend**-Routinen ohne gemessene Session erhalten rückwirkend eine *angezeigte Schätzung* auf Basis der vorhandenen Abend-Audioaufnahme (~23,36 Min). Kein neues erfundenes Ereignis im Journal. Tatsächlich gemessene / nachgetragene Sessions ersetzen die Schätzung dieses Tags. Ältere Morgen-Häkchen ohne gemessene Minuten werden nicht fälschlich als Abend-Sessions etikettiert.

## Qualitätsstatus

- Neuer Fokus-Test für Motivation und Amber-Oberfläche: **3/3 bestanden**.
- Neue historische Kontakt-/Habit-Tests: **5/5 bestanden**.
- Gezielte Tests aus .25.23–.25.25 inklusive Fitdays/Daily Dozen/Habits bestanden.
- Deploy-Gate `npm run check:deploy` (inklusive Importgraph, Worker-Syntax und Release-Smoketests): **24/24 bestanden**.
- Importgraph: **252 JS-Module**, keine fehlenden relativen Imports.
- Vollständiger historischer Node-Testlauf: **1746/1772 bestanden; 26 fehlgeschlagen**, überwiegend historisch festgehaltene Versions-/Vite-Transform-Annahmen sowie ein fehlender Legacy-Reportpfad. Nicht als vollständig regressionsfrei zu bewerten.
- Vite-Produktionsbuild: **nicht bestätigt**. In dieser Sandbox fehlt das installierte `vite`-Paket; `npm run build` endet mit `vite: not found`. Der GitHub-Actions-Workflow führt `npm install` und danach den echten Build aus.
- ZIP-Archive per CRC geprüft; PATCH-Inhalt rekonstruiert den neuen FULL-SOURCE-Stand nach Überlagerung des .25.25-FULL-SOURCE-Standes bytegenau.

## Installation

1. Eigenes verschlüsseltes Backup aus Compass exportieren; **keine** Browser-/PWA-/IndexedDB-Daten löschen.
2. PATCH nur über den vollständigen Quellstand **.25.25** im Repository entpacken, Pfade erhalten; alternativ FULL SOURCE als vollständigen Quellstand verwenden. Nicht beide gleichzeitig installieren.
3. Auf GitHub committen, Workflow **Deploy Compass Web** überprüfen. Bei npm-/Vite-Fehlern das konkrete GitHub-Actions-Log heranziehen; der lokale Quelltest ersetzt keine erfolgreiche Produktionskompilierung.
4. App neu öffnen: Version **0.5.78** im App-Menü und im Lockscreen, Orange in Extended, grün in Focus. Berührung für eine Person nachtragen und Kontaktverlauf prüfen; alte Abend-Wim-Hof-Häkchen sollten mit „geschätzt“ erscheinen.

**Keine neue D1-Migration, kein Tresor-Reset.** Google Drive wurde für diesen Build nicht verwendet; das GitHub-Repository wurde nicht verändert.
