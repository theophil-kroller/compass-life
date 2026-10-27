# Compass Life 0.5.77.59.40.6 — evidence-informed RIR progression & two-icon location switch

**Basis:** Full source **0.5.77.59.40.5** (inclusive all earlier fixes). No schema, cloud, vault or Worker migration.

## V-Taper progression after a finished, confirmed workout

- The Coach uses **the most recent finished session for the exact exercise**, recorded repetitions, weight and **explicitly selected RIR per working set**, without inventing RIR for Garmin workouts or confusing separate sessions.
- **4+ RIR** is conservatively treated as *at least four* possible additional repetitions, not an exact physical measurement. An easy set generally yields **up to +1 repetition for that set** at the same load, subject to the exercise's chosen repetition range, recent performance, fatigue and recovery.
- **RIR ~2** and incomplete repetition range: gradual rep progression. **RIR 0–1**: stabilize performance first; don't automatically increase load. Single RIR observations are not sufficiently reliable for a weight jump.
- **Double progression**: At the top of the prescribed range across all planned confirmed sets, and when the RIR measurements support it, optionally recommend a small load increase **only if the next available increment is <=7.5% of the previous load**. A 2 kg increase from 8 kg is 25% and is **not** suggested. The 7.5% guard is an implementation heuristic, not an evidence-established biological cutoff.
- For home training, the existing 28 kg plate inventory is respected. Bodyweight V-Taper exercises receive repetition targets without fabricated added kilograms.
- During an active deload or a documented recovery caution, the model suggests holding repetitions rather than automatically overloading. Missing measurements do not become fictitious recovery scores.
- All suggestions are **advisory**: no automated alteration to confirmed reps, training loads, muscle volume or appointments. Existing performance-led double progression is the fallback if valid RIR isn't available.
- Per-set repetition targets are displayed in Coach and guided workout **and saved in the encrypted workout snapshot** for reload-safe continuation.
- Lat and side/rear deltoid priority and existing weekly volume heuristics remain intact; no unsupported promises of hypertrophy or RIR threshold certainty.

## Location switch

- **📍** opens GPS, automatic detection, home/work zones and radius configuration.
- A **single adjacent context button** cycles **⌂ Home → 💼 Work → 👤 On the move → ◎ All contexts → ⌂ Home** on each click/tap. No wide menu for ordinary switching.
- Manual "All" reveals all location-bound and location-independent Next Actions; where necessary it displays a reminder to verify whether the place is suitable.
- GPS automation still only checks on the visible app, with browser permission; no geolocation tracking or cloud collection.

## Verification & limitations

- `npm run check`: automated Node tests and Worker syntax checks passed.
- Full Vite transform for main, guided workout, strength coach and lock screen: JavaScript syntax checked. Local `npm run build` could not run because this source package has no installed Vite dependency and the environment could not finish installing it. **Verify the actual GitHub Actions deployment before considering this production-tested.**
- The data model does not know your actual proximity to failure, technique or individual muscle recovery; user RIR is subjective. "Fitdays", Garmin Sleep/HRV are not used to fabricate workout performance.

## References (as checked October 27, 2026)

- Currier et al. (2026), ACSM Position Stand, *Medicine & Science in Sports & Exercise*, DOI: 10.1249/MSS.0000000000003897.
- Robinson et al. (2024), proximity-to-failure meta-regression, *Sports Medicine*, DOI: 10.1007/s40279-024-02069-2.
- Pelland et al. (2026), volume/frequency meta-regressions, *Sports Medicine*, DOI: 10.1007/s40279-025-02344-w.
- Fitbod: https://help.fitbod.me/hc/en-us/articles/43489869175063-How-does-Fitbod-decide-my-sets-reps-and-weight
- RP Hypertrophy App: https://help.rpstrength.com/hc/en-us/articles/32600173777815-How-does-the-app-determine-when-to-add-weight-reps-and-sets

The app's thresholds are **transparent, cautious application heuristics** inspired by the evidence and established apps, not a replica of their proprietary algorithms or a claim of scientifically proven optimal dosing.
