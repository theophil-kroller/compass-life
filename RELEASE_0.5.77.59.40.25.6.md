# Compass Web .40.25.6 · Responsive GTD actions

- Inline progress clicks update only the affected task progress counter and inspector, ahead of encrypted persistence; no whole-app render on each click.
- Task and project moves render once before encrypted persistence, rather than after full-vault cloning and encryption.
- GTD rollback checkpoints copy only task/project records, rather than imported historical health, finance and activity datasets. Hierarchy and order mutations use copy-on-write checkpoints covering each task object.
- Hierarchy descendant lookup runs in linear time over the task graph (visited set guards cycles).
- Full AES-GCM encrypted Vault saving and sync are preserved; failures roll back and report errors as before.
- Settings > Laufzeitmessung adds "GTD Aktion bis Paint" for measuring perceived latency.

Security: The audited GTD-only actions cannot alter mirrored private finance/health data, so the fast path works in source/receiver modes while finance/health mutations retain strict mirror validation. Overlapping quick edits have revision-aware failure handling.
