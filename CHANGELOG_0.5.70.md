# Compass 0.5.70 – Miracle Morning · SAVERS

Ausgangsbasis: Compass 0.5.69.2.

## Neue Funktion: Miracle Morning unter Insights → Habits

- Neuer, geführter SAVERS-Player: Silence (Stille), Affirmations, Visualization, Exercise, Reading und Scribing.
- Jeder Schritt mit eigener Zeitvorgabe; **Start/Pause**, **Fertig**, **Überspringen** und **Neue Routine beginnen**.
- Ein optionaler 6-Minuten-Quickstart (1 Minute pro SAVERS-Schritt).
- Timer verwendet absolute Zeitstempel: Beim Verlassen des Browserfensters (z. B. zu Kindle) und Zurückkehren wird die verbleibende Zeit nachgerechnet. Hintergrundaudio/-alarm ist nicht garantiert.
- Laufender Fortschritt und die unkritischen Timermetadaten werden für Wiederaufnahme lokal zwischengespeichert. Private Affirmationen und Journaling-Texte werden niemals in den unverschlüsselten Schnellstatus übernommen.
- Konfiguration bei entsperrtem Tresor: Zeit pro Schritt, eigene Affirmationen, Zielvisualisierung, Verknüpfung mit einem bestehenden Lebensziel, Übungen zu Hause, aktuelles Buch und eine Journaling-Frage.
- Standardübungen: Kurzhantel-Rudern, Schulterdrücken, Bizepscurls und kontrollierte Ab-Wheel-Übung. Keine automatischen Trainingsvorgaben.
- Scribing mit Textfeld: funktioniert mit der systemeigenen oder installierten Diktierfunktion; keine neue Transkriptionsintegration.
- Nach Abschluss: verschlüsselter Routinen-Verlauf (Datum, absolvierte und übersprungene Schritte, erfasste Dauer). Automatische Habit-Erledigung, sofern mindestens ein Schritt als durchgeführt markiert wurde.
- Unter Insights → Habits: Routine konfigurieren, direkt starten, abgeschlossene Morgen ansehen.

## Tresor und Synchronisierung

- Miracle Morning lässt sich bei gesperrtem Tresor über das bereits vorhandene **Habits-Symbol** starten; kein neues Icon in der Titelzeile.
- In gesperrtem Zustand erscheinen keine privaten Affirmationen, Zieltexte oder Buchnamen.
- Abschluss ohne Entsperren: ein verschlüsselter Sealed-Capture-Eintrag wird auf dem jeweiligen Gerät vorgemerkt und nach dem Entsperren in den Vault übernommen.
- Gespeicherte Konfigurationen und abgeschlossene Routinen sind in den bestehenden verschlüsselten **Journal-Geräteabgleich** eingebunden. Diesen Abgleich müssen beide Geräte nach dem Entsperren mit derselben privaten Geräteverbindung durchführen.
- Keine neue D1-Migration und keine Worker-Codeänderung gegenüber 0.5.69.2. Voraussetzung für Cloud-Sync bleibt der Journal-fähige Worker samt D1-Migration 0018.
- Nicht auf mehreren Geräten gleichzeitig den laufenden Player steuern. Es gibt noch keinen Echtzeitabgleich unvollendeter Timer.
- Persönliche Eingaben bei offenem, gesperrtem Player werden erst beim Abschluss verschlüsselt persistiert. Vorher können sie bei einem Absturz/Browserabschluss verloren gehen; Timermetadaten werden dagegen lokal fortgeführt.

## Qualitätsstand

- **713/713 Node-Tests bestanden**, einschließlich 8 neuer Miracle-Morning-Tests.
- JS-Syntax der geänderten Kernmodule geprüft.
- Vite-Produktionskompilierung/echte mobile Browserabnahme nicht lokal bestätigt (keine installierten npm-Dependencies).
