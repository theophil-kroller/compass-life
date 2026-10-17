# Compass Focus – fēnix 7S (Monkey C Prototyp)

Achtung: Nicht kompiliert oder am Gerät getestet. Quellen unter `source/CompassApp.mc`.
Bitte `docs/GARMIN_WIDGET_MVP_0.3.0.md` lesen und zuerst Worker-/D1-Teil installieren.

## UI
- In Kategorienliste: UP/DOWN Kategorie, START Aufnahme starten, MENU Pomodoro umschalten.
- Während der Session: START Pause/Fortsetzen, BACK Aufnahme beenden; bei 25-Minuten-Signal DOWN fünfminütige Pause beginnen, UP Pause frühzeitig beenden.
- In Kategorienliste: BACK löst Kopplung bzw. Nachsynchronisierung aus; LAP kann ebenfalls synchronisieren.
- Achtstellige Zifferneingabe beim Pairing: UP/DOWN Ziffer ändern, START nächste Ziffer, bei Ziffer 8 Verbindung versuchen.

## Messwerte
- HR beim aktiven Tracken ungefähr alle 30s (bis 180 Werte), Body Battery alle 300s und am Session-Anfang/-Ende (bis 72 Werte) falls unterstützt. Keine medizinischen Schlussfolgerungen.
- Bei ausbleibender Bluetooth-Verbindung lokal gespeichert; über BACK nachsynchronisieren.
- Maximal 20 Sessions in lokaler Warteschlange. Achtung: Garmin Storage ist kein AES-GCM-Tresor. Aktivität endet bei Verlassen der App und wird lokal gespeichert.
