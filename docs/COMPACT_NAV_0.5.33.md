# Compass 0.5.33 – Interface hierarchy

Principle: prioritize data over navigation/confirmation banners, without hiding errors or verified provenance.

## Desktop
- Sidebar is the primary Insights router; no parallel toolbar needed.
- `Insights → Produktivität` added, so all previously visible top-level insights remain reachable.
- Health subviews (sleep, energy, stress, body) use small buttons beside heading.
- Finance period and data controls share navigation row; wrapping occurs before tabs collide.
- Financial Spending starts with the observed circular transfer network before expense Sankey. The network is compact, edge list is on-demand, selected details are always displayed.

## Phone
- Insights top category bar retained because Sidebar is a dropdown.
- Finance tabs may scroll horizontally.

## Information semantics
An outgoing bank transfer to a broker is not portfolio growth; an account move is not a consumer expense. Charts avoid made-up links.
