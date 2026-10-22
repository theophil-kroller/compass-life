# Compass 0.5.75 – Personalized Energy Goal

Baseline: **0.5.74**.

- Optionaler täglicher Energiezielrechner aus Fitdays-Gewicht/Körperfettanteil, Geburtsmonat/-jahr, Körpergröße und physiologischem Formelparameter.
- Mifflin–St. Jeor als Standard bei vollständigem Profil; alternativ fettfreie Masse (413 + 19,7 × FFM) wenn vorhanden.
- Automatische grobe Aktivitätseinstufung aus 28 Tagen Garmin-Schritten oder Training, nicht doppelt gezählt; immer manuelle Alternative.
- Persönlicher Gesamtbedarf (Ruheumsatz × Aktivitätsfaktor), individuell wählbares moderates Defizit 200/300/400/500 kcal.
- Heute-Karten mit geschätztem kcal-Bereich aus tatsächlich protokollierten Produkten; Warnung bei möglicher/definitiver Überschreitung des Orientierungsziels, ausdrücklich unvollständige Bilanz.
- Aktivierung nur nach Opt-in. Einstellungen bleiben im verschlüsselten nutritionJournal und werden über vorhandenen Journal-Geräteabgleich synchronisiert.
- Keine D1-Migration; keine Worker-Änderung.
- Kein Tracking oder automatische Anhebung/Absenkung des Energiebudgets beim Menüwechsel.

## Grenzen und Nachprüfen
- Fitdays-Körperfett, Garmin-Aktivität und Nahrungskalorien sind Schätzwerte; keine Messung der tatsächlichen Energieaufnahme oder des individuellen Gesamtverbrauchs.
- Bei >90 Tage alten Fitdays-Messungen oder zu wenigen Aktivitäten wird keine automatische Zielberechnung freigegeben.
- Fehlende Mahlzeiten werden nicht als 0 kcal interpretiert. Bei gesperrtem Tresor nur lokale verschlüsselte Vormerkung, keine Klartext-Warnung.
- **785/785 Node-Tests** erfolgreich; JavaScript-Syntax geprüft. Vollständiger Vite-Produktionsbuild war hier mangels installierter Frontend-Abhängigkeiten nicht ausführbar (`vite: not found`). Reale Zwei-Geräte- und PWA-Abnahme steht aus.

## Quellen
- Mifflin et al. (1990), *A new predictive equation for resting energy expenditure in healthy individuals*, AJCN 51(2), 241–247, DOI: 10.1093/ajcn/51.2.241.
- NIDDK Body Weight Planner: https://www.niddk.nih.gov/bwp
