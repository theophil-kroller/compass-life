# Compass Life 0.5.91.59 — Teaching Priority & Calm Today

## Änderungen gegenüber 0.5.91.58

- **Lehr- & Event-Vorbereitung:** Direkt in der vorhandenen Vorschlagsliste ein dreistufiger, interaktiver Vorbereitungsaufwand (`🟢 Wenig`, `🟡 Mittel`, `🔴 Hoch`). Veranstaltungen mit hohem Aufwand stehen auch dann zuerst, wenn sie zeitlich später stattfinden; innerhalb derselben Stufe gilt das nächste Veranstaltungsdatum. Die drei sichtbaren Vorschläge auf „Heute“ zeigen somit die größten Vorbereitungsaufwände. Im Forecast bleibt die breitere Liste verfügbar.
- **Aus deinen Beispielen abgeleitete Startwerte:** Marketing und Intro to Entrepreneurship: Rot; Design Thinking, Business Model und Einleitung/Administration: Grün; alle anderen Kurse zunächst Gelb. Jede manuelle Einstufung überschreibt die Vorschlagsstufe und gilt für weitere Kalendertermine mit demselben Fachnamen. Änderungen werden ausschließlich nach Klick verschlüsselt gespeichert und über das vorhandene `teachingRadar`-Journal mit Zeitstempel konfliktbewusst abgeglichen.
- **Überfällige Aufgaben:** Task-Zeilen mit einer *echten*, vor dem heutigen Tag liegenden `dueDate` erhalten einen roten linken Rand, roten Hintergrund und ein unübersehbares Badge `Überfällig`. Nur für noch nicht erledigte, nicht archivierte Aufgaben; ein reines Planungsdatum zählt nicht als Frist.
- **Ruhige Heute-Ansicht:** Obere Hinweiskarten einschließlich Lehr-Vorbereitung, Geburtstag, Family Radar und Mensa mit einem einzigen Button dauerhaft ein- und ausklappbar. Beim ersten Öffnen ist der Bereich aufgeklappt; darunter liegende Tagesaufgaben, Kalender und Protein-Schnellübersicht bleiben in beiden Zuständen sichtbar. Einstellung `uiPreferences.todayTopCollapsed59` ist Teil des lokalen verschlüsselten Tresors. Im eingeklappten Zustand entfällt die unnötige Berechnung von Geburtstagshinweisen und die Family-Radar-Worker-Einplanung.
- Keine stillen Änderungen an Google-Kalenderterminen, angelegten Aufgaben, Messwerten oder Trainingsdaten.

## Qualitätssicherung

- Sechs neue gezielte Tests für Prioritätsreihenfolge, wiederkehrende Fachnamen, verschlüsseltes Zustandsmodell, Sync-Merge, Überfälligkeit und ein-/ausklappbaren Header.
- 33/33 Release-Prüfungen und Importgraph erfolgreich.
- Vollständiger Node-Regressionstest: 2330 bestanden und 66 bereits in 0.5.91.58 nachgewiesene Altfehler; genau identische Fehlschlagnamen, kein neuer Fehler.
- `node --check` für die modifizierten JS-Module und ZIP-Integrität / Patch-vs-Full-Abgleich.

## Einschränkungen

- Kein lokaler Vite-Produktionsbuild ohne installierte Vite-Dependencies; GitHub Actions muss die Produktion bestätigen.
- Vollständiger visueller Mobile-/Desktop-Browsertest nach Deployment bleibt erforderlich.
