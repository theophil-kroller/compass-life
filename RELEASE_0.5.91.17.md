# Compass Life 0.5.91.17 – Makko-Ho, Nachstempeln, Sichuan-Kartoffeln & schwarzer Reis

## Ausgangslage

Version 0.5.91.16, Repository `theophil-kroller/compass-life`, Commit `a8d4951347a4da13424834ed9455b5d56fb2fe40`.

## 1. Makko-Ho Tagwechsel

Die gesperrte Habit-Schnellansicht hatte `doneToday` ohne Datumsstempel gespeichert. Ein gestern abgeschlossenes Makko-Ho konnte so am nächsten Kalendertag fälschlich als bereits erledigt erscheinen. Neu: `doneDay` in der lokalen öffentlichen (nur UI) Schnellerfassungsprojektion. Ungültige oder undatierte ältere Completion-Caches werden für die aktuelle Tagesansicht ignoriert. Im verschlüsselten Journal bleiben alle historischen Datensätze unverändert. Der Makko-Ho-Abschluss trägt den tatsächlichen lokalen Abschlusstag mit `done=true` ein und toggelt keine vorhandene Bestätigung zurück. Das 6-Stufen-Programm bleibt jederzeit erneut startbar.

## 2. Arbeitszeit vergessen

- In **Zeit → Zeit erfassen**: aufklappbar **Vergessen einzustempeln? Arbeitszeit nachtragen** mit Datum, Beginn und optional Ende.
- Beginn ohne Ende: ein offener, rückwirkend beginnender Timer. Dieser kann danach regulär ausgestempelt werden; es wird nicht vorzeitig ein Ende erfunden.
- Beginn und Ende: ein abgeschlossener, manuell korrigierbarer Eintrag im vorhandenen Zeitjournal. Keine doppelte Quick-Session.
- Prüfung auf plausible Datums-/Zeitangaben, künftige Zeiten, Beginn vor Ende, maximal 16 Stunden für einen manuellen Tagesblock und Überschneidungen mit protokollierten Intervallen. Kein Überschreiben eines bereits laufenden Timers.
- Nur im entsperrten verschlüsselten Tresor schreibbar. Die ursprüngliche Excel-Importbilanz/Urlaubskonten bleiben unverändert. Unter **Insights → Arbeitszeit** gibt es den direkten Einstieg.

## 3. Wiederverwendbares Mittagessen

`steamed-potatoes-sichuan-veg-personal`: Gedämpfte Kartoffeln mit Knoblauch, Ingwer, frischer Chili, 1 TL Ahornsirup, Sojasauce, Chiliflocken, Sichuanpfeffer, 1 Stange Sellerie und 3 kleinen Karotten.

**Annahmen einer Portion, editierbar:** 300 g Kartoffeln (Rohgewicht), 8 g Knoblauch, 10 g Ingwer, 5 g frische Chili, 7 g Ahornsirup, 15 g Sojasauce, 0,5 g Chiliflocken, 1 g Sichuanpfeffer, 40 g Sellerie, 150 g Karotten. Kein Öl angenommen. **Ca. 351 kcal, 10 g Protein, 79,16 g Kohlenhydrate, 1 g Fett, 12,3 g Ballaststoffe**; alle Werte nur generische Rezeptschätzungen und wegen Portionsgewicht/Garverlust teilweise unsicher. Besonders Sojasauce mit ca. 2,1 g Salz/Portion (bei 15 g normaler Sauce) und die Stückgewichte prüfen. Makro- und Mikronährstoffschätzungen (u. a. Kalium, Magnesium, Eisen, B6, Beta-Carotin-Äquivalent) sind erfasst, nicht als Laborwerte.

**Daily Dozen:** Karotten/Sellerie → andere Gemüse; Ingwer, Chili, Pfeffer/Knoblauch → Gewürze in grobem Trockenäquivalent; Kartoffeln weder Vollkorn noch automatisch andere Gemüse, Ahornsirup zählt nicht als Obst. **Anti-Aging Eight:** Dokumentierte Ballaststoff-/Pflanzenzufuhr kann als indirekte Information erscheinen, aber kein Mikrobiom- oder Langlebigkeitsnachweis.

## 4. Schwarzer Reis

`black-rice-cooked-personal`: 180 g **gekochter** schwarzer Vollkornreis, ohne Öl oder Sauce. Vorläufig generisch **ca. 238 kcal, 6,3 g Protein, 50,4 g Kohlenhydrate, 1,6 g Fett, 3,6 g Ballaststoffe**. Eisen, Magnesium, Mangan, Zink und weitere verfügbare Mikronährstoffe sind gekennzeichnete Schätzungen. Anthocyane sind qualitativ vermerkt, Konzentration unbekannt. Im **Daily Dozen** ca. 1,8 Vollkornportionen aus 180 g gegartem schwarzen Naturreis, sofern der tatsächlich gekaufte Reis unpoliert ist. Herkömmlicher weißer Basmatireis darf nicht so gebucht werden. Die genannten Produkte wurden nicht im Originaletikett nachgewiesen.

## Persistenz / Prüfungen

Kein automatisches Speichern einer nicht gegessenen Mahlzeit; nur Eintrag bei bewusstem Klick. Änderungen an Vorhandenem sind nicht erforderlich. Nur die aktuellen Versionstrings werden angepasst, alte Historie unverändert.

**Gezielte neue Tests 10/10.** Baseline-Vergleich (identische Umgebung): alte Version 0.5.91.16 37 historische Fehler / 2041 Tests; neue Version 0.5.91.17 **35 Fehler / 2051 Tests (2016 bestanden)**, keine neuen Fehlertests, zwei bisherige Tests erfolgreich. `npm run check:deploy`: 33/33. Ein kompiliertes Vite-Produktionsartefakt liegt lokal ohne installierte Vite-Abhängigkeiten nicht vor; GitHub Actions muss den echten Bundling-/Deployment-Erfolg bestätigen.
