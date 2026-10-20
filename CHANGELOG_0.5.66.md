# Compass 0.5.66 – Personal Intelligence: Zusammenhänge & Radar-Datenabdeckung

Basis: Compass 0.5.65. Keine neue D1-Migration. Bestehende Vault-Daten bleiben unverändert.

## Neue Ansicht: Insights → Zusammenhänge

- Deskriptiver Vergleich freiwilliger Feeling-Wheel-Check-ins mit Schlafdauer, Tagesbewegung, dokumentierten Arbeitsstunden und Garmin-Body-Battery-Tagesmaximum.
- Zeitraum 7 / 30 / 90 Tage; Filter nach den sechs Basisemotionen (mit Emojis).
- Es werden ausschließlich Kalendertage mit **sowohl Check-in als auch tatsächlichem Messwert** gegenübergestellt. Tage ohne Check-in gelten **nicht** als Tage ohne ein Gefühl.
- Wiederholte Einträge am selben Tag zählen für die Vergleichsgruppe nur einmal; zur Einordnung wird die höchste dokumentierte Intensität des gewählten Gefühls verwendet.
- Mindestens drei Beobachtungstage **je Gruppe** sind nötig, ehe ein deskriptiver Vergleich angezeigt wird. Keine Kausal-, Statistik- oder Diagnostikbehauptungen.
- Persönliche Kontakte: eigene, ausdrücklich protokollierte Telefonate, Treffen, Nachrichten etc. lassen sich deskriptiv Check-in-Tagen gegenüberstellen. Ein Tag ohne Kontaktdokumentation ist kein nachgewiesener kontaktfreier Tag.
- Einstieg über den Insights-Tab und als optionaler Link beim Weekly Review. Keine automatische Erinnerung, keine externe KI, keine neue Datenübermittlung.

## Korrektur: Life Balance Radar / Finanzen

- Bisher wurde ein Finanz-Score nur angezeigt, wenn das strengere Cashflow-Prognosemodell **mindestens drei vollständige Monatsdatensätze mit klassifizierten Ein- und Ausgängen** vorfand. Viele vorhandene Bankbuchungen waren deshalb im Radar unsichtbar.
- Der Radar erhält eine separate, **rein historische Cashflow-Ermittlung** über bis zu 18 zurückliegende, abgeschlossene Kalendermonate. Drei Monate mit dokumentierten Geld-Ein- und -Ausgängen, keine veraltete Erfassungsbasis und EUR-Buchungen sind für einen indikativ normierten Score erforderlich.
- Noch offene Klassifikationen dürfen eingehen, werden aber deutlich als **vorläufig** gekennzeichnet. Bekannte interne Überträge, Kartenausgleich und Kapitalverschiebungen werden aus dem Cashflow-Indikator ausgeschlossen, um das Ergebnis nicht künstlich zu verzerren.
- Fehlen für einen Score tatsächlich die erforderlichen Beobachtungen, zeigt der Radar die **konkrete Ursache und Datenabdeckung**, statt pauschal „keine auswertbare Bankhistorie“ zu behaupten.
- Die kompakte Radar-Startansicht erhält „Warum fehlen Werte?“ mit einer knappen Erklärung für jede unbewertete Achse.
- Eine historische Cashflow-Deckung ist **kein** aktueller Kontostand und garantiert keine Zahlungsfähigkeit. Die Liquiditätsprognose erfordert weiterhin einen von dir bestätigten Anfangsbestand.

## Unverändert zu beachten

- Körper: Der Fitdays-Körperfettwert wird angezeigt; ein 0–100-Zielnähe-Score benötigt weiterhin einen selbst festgelegten Körperfett- oder Gewichts-Richtwert. BIA-Gerätewerte sind Schätzungen.
- Kontakte: Ein Score setzt definierte Kontaktintervalle **und** dokumentierte Kontaktgeschichte voraus. Pausierte Kontakte werden nicht bewertet.
- Fehlende Gesundheits-/Arbeitszeitmessungen werden nicht ergänzt, als null interpretiert oder rückwirkend fingiert.
- Historische Zeitspuren verwenden keine aktuellen Finanz-/Kontakt-/GTD-Scores als rückwirkende Werte.

## Prüfungen

- 663/663 automatisierte Tests erfolgreich (einschließlich Radar-Finanz-Fallback, Transfer-Ausschlüssen und deskriptiver Zusammenhänge).
- JavaScript-Syntax und Cloudflare-Worker-Checks bestanden.
- Vite-Produktionsbuild in dieser Umgebung **nicht ausführbar**, da `vite` fehlt (`sh: vite: not found`). Bitte im Ziel-Repository nach `npm ci` mit `npm run build` prüfen.
- Live-Browserabnahme mit deinem verschlüsselten Vault und den realen Bankdaten steht aus. Es wurden keine persönlichen Finanzwerte hier ausgelesen.
