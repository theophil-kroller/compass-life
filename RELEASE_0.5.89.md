# Compass Life 0.5.89 · Six Optional Exercises & 12 AI Personalised Pictures

## Ausgangsstand
GitHub `b38ded1dd2e9a630df790106432f8b59a4d5ebbb` (0.5.88), vom Quellbestand Byte für Byte für Kernmodule verifiziert.

## Neue Funktionen
- Sechs **neue, separat identifizierte Übungen**: one-arm-dumbbell-snatch, dumbbell-front-squat, dumbbell-walking-lunge, sled-push, farmers-walk, dumbbell-bench-press.
- Je eine personalisierte KI-Visualisierung für Start und zweite Phase (`*_start.webp`, `*_end.webp`), insgesamt 12 **eigenständige 768×600 WebP-Dateien** (zusammen ca. 195 KB). Eingefügt in `client/public/strength-visuals-v0589`, keine Originalbilder überschrieben. Fotos sind illustrative Orientierung, keine professionelle Freigabe der Bewegungsmechanik.
- Übungsnamen auf Englisch und Deutsch im **bestehenden Garmin/FIT-Zuordnungseditor**. Neue dokumentierte editoriale Aliasnamen; es werden keine ungesicherten numerischen Garmin-FIT-IDs behauptet.
- Primär-/Sekundärmuskelgruppen bleiben im **kanonischen EXERCISES-Katalog** und gelangen damit in bereits vorhandene Garmin-, Coach- und Muscle-Map-Auswertungen. Kein neues Trainingstagebuch.
- Gesicherte **optionale** Auswahl einer einzigen Zusatzübung beim Coach, als **Ersatz** für einen geplanten Trainingspunkt, ohne das 25-Minuten-Heimprogramm zu überladen. Kein automatisches Hinzufügen in den Standardpool; StrongLifts A/B bleibt unverändert.
- Snatch nur bei ausdrücklich bestätigter Technikprüfung im aktuellen Coach-Dialog und ohne registrierte aktuelle Beschwerden; Sled Push nur im Studio; Dumbbell Bench Press nur bei verfügbarer Trainingsbank im Studio.
- Eigene Übungs-Metadaten: Equipment, Bewegungsmuster, Regenerationshinweise, Progressionsmöglichkeiten, Wiederholungs-/Zeitbereiche, Wechselübungen und Aliase.
- WebP-Dateien über `import.meta.env.BASE_URL` PWA-Pfad und dynamisch nachgeladenem Coach-Führungsdialog, keine Basis-Navigation belastet.

## Qualitätsgrenzen
- Beim Sled Push und Farmer's Carry sind die zweite Phasen aus einem 3×2 AI-Storyboard in individuelle Assets geschnitten. Die Darstellung ist nicht unabhängig biomechanisch validiert und ersetzt keine Technik-Einweisung. Bei zeitbasierten Trage-/Schubübungen bildet das ältere Satzdatenmodell Strecke/Zeit noch nicht strukturiert ab; die Bewegungen sind als Satzbestätigungen dokumentiert, nicht als wissenschaftlich valide Volumenmetriken.
- Alte Bilder und Workouts bleiben unverändert; weitere UI-Visuell-Tests sind nach CI-Deployment auf Android zu empfehlen.
- Kein versprochener Vite-Produktionsbuild ohne installierte npm-Abhängigkeiten; den echten Produktionsbuild via GitHub CI prüfen.
