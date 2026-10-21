# Compass 0.5.70.6 – Gefühlswolke ohne Tresorentsperrung

## Behoben
- **Gefühlswolke ohne Login/Entsperren zugänglich**: Die lokale Begriffssuche benötigt keine entschlüsselten Tresordaten und darf nicht von einem fehlenden Schnellerfassungsschlüssel blockiert werden.
- **Letzten Modus merken**: Wheel oder „In eigenen Worten“ wird beim nächsten Öffnen erneut verwendet (nur die nicht-sensible Moduspräferenz wird im Browser gespeichert, keine Gefühlsdaten).
- **Sicherer Zustand ohne Erfassungsschlüssel**: Die Begriffssuche ist möglich, die Schaltfläche „Check-in speichern“ bleibt deaktiviert und erklärt die einmalige Einrichtung beim Entsperren.
- **Verschlüsseltes Speichern unverändert**: Nach eingerichteter verschlüsselter Schnellerfassung können freie Texte und gewählte Begriffe bei gesperrtem Tresor über den bestehenden write-only Eingang erfasst werden. Die Übernahme und der Geräteabgleich erfolgen nach dem Entsperren.

## Technisch
- Die UI im gesperrten Zustand verwendet dieselbe Begriffswolke und denselben Wortschatz wie die entsperrte UI.
- Keine Änderung am Gefühlsformat, am Wortschatz oder an bestehenden Check-ins.
- Keine Worker-Änderung und keine D1-Migration.
- 747/747 Node-Tests bestanden (einschließlich 4 neuer Regressionstests).
- Keine Live-Prüfung von Vite-Produktion und Browser/PWA in dieser Umgebung.
