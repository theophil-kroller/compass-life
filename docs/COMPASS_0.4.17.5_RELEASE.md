# Compass 0.4.17.5 – Health & Body Insights UX (nach 0.5.17.1)

Dieser punktuelle Health-Build folgt bewusst der vom Nutzer gewünschten Versionsbezeichnung **0.4.17.5**, verwendet aber **0.5.17.1** als technische Ausgangsbasis. Bitte nur auf einem Repository mit bereits eingespieltem 0.5.17.1 installieren. **Kein Downgrade des Worker-Backends**.

## Neu

- **Stress:** Tages- oder Wochenansicht, farbige Garmin-Stressklassen, Erklärung der Klassen und rollende tägliche Medianlinie mit dynamischem 20.–80.-Perzentilband (trailing 14 Kalendertage). Kein Konfidenzintervall und keine psychologische Diagnose.
- **Body Battery:** getrennte Markerfarben für beobachtetes Tageshoch und -tief; keine erfundenen Messwerte.
- **Messtage & Schlafnächte:** vor/zurück-Pfeile führen zwischen tatsächlich importierten Messdaten; die Datenkategorien bleiben unangetastet.
- **Schlafphasen:** dunkle Detailkarte mit stärker kontrastierenden Farben und Pfeilnavigation.
- **HRV:** dynamischer rollender Referenzkorridor und rollender Median aus vorhandenen Nächten; bei zu wenigen Messpunkten kein künstliches Band.
- **Fitdays:** eine kombinierte Ansicht aus Gesamtgewicht und nicht gestapelten Fett-/Muskel- oder Wasserwerten in Kilogramm, Jahr auf der x-Achse, gesondertes rollendes Gewichtsband. Fett, Muskel und Körperwasser überlappen physiologisch, also nicht addieren.
- **Finanzen / Buchungen:** pro Zeile ein dezentes, semantisches SVG-Symbol aus der bestätigten Buchungskategorie: z. B. Geldschein für Einnahmen, Einkaufswagen für Supermarkt, Haus für Wohnen, Flugzeug für Reisen. Keine neue Klassifikation.

## Sicherheit und Grenzen

Die Berechnungen laufen lokal aus bereits in Compass importierten Daten. Kein externer Kartendienst, keine neue Worker-Schnittstelle und keine Datenbankmigration. Fehlende Messungen werden nicht zu 0 ergänzt. Die angezeigten rollenden Bereiche sind empirische Streubereiche und **keine klinischen Normbereiche oder formal kalibrierten Konfidenzintervalle**. Einzelne Garmin-Stresspunkte liefern keine Aussage über psychischen Stress.

## Abnahme

1. Bei **Insights → Stress** Tages- und Wochenmodus testen; zwischen Messtagen mit Pfeilen wechseln.
2. Bei **Insights → Body Battery** Hoch- und Tiefmarker vergleichen und mit Pfeilen navigieren.
3. Bei **Insights → Schlaf** Schlafphase-Nacht mit Pfeilen wechseln; dunklen Stil prüfen.
4. Bei **Insights → Körper** zwischen Fett/Muskel und Körperwasser wechseln, bei 1 Jahr / Alles auf Jahresmarken achten.
5. Bei **Finanzen → Buchungen** die Symbole bei Supermarkt, Einkommen und Transfer prüfen.
6. Nach dem GitHub-Actions-Build PWA neu laden; wenn noch alte Dateien gecacht sind, einmal vollständigen Reload durchführen.

Prüflauf: node --test tests/*.test.mjs. Für den produktiven Vite-Build müssen die npm-Abhängigkeiten verfügbar sein.
