# Compass Web 0.5.77.59.40.13

Base: Compass Web Watch Bridge 0.5.12.5 Colleagues. Garmin stays at 0.5.12.6.

## Änderungen

- `Heute`: pin/context cycle pushed to far right of Today header (desktop and mobile).
- `Freizeit & Erholung`: ongoing multi-day events grouped under the current date, while preserving event identities and original dates; expired, not saved/not conflicted imports pruned without grace and uploaded as sync tombstones.
- `Ernährung`: SPAR flaxseed (1 teaspoon, about 3 g) is readily available under Snacks as chewed food; explicit chew note stored for standard quick capture, including sealed local capture.
- Retroactive flaxseed logging for yesterday asks for the *actual* HH:MM; no invented timestamp.
- Daily Dozen: chewed 3 g are visible as a fractional 3/7 serving (~43%), not a complete checkbox; the seed product's cook/bake-only labeling stays visible.

### Tests & caveats

1580 Node tests pass. All 60 build-time source transforms applied successfully. Vite production build / browser E2E not verified in this environment.

Note: Recording raw, chewed consumption does not override the manufacturer's "not for raw consumption" safety labeling. Nor does it establish equivalence to milled and cooked flaxseed.
