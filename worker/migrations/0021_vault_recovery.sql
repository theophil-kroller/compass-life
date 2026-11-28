-- Encrypted, versioned recovery bundles. The server only stores opaque ciphertext.
-- Fetching requires a 256-bit password-derived capability (locator), not Google OAuth.
CREATE TABLE IF NOT EXISTS vault_recovery_snapshots (
 id TEXT PRIMARY KEY,
 locator TEXT NOT NULL,
 owner_sub TEXT NOT NULL,
 parts INTEGER NOT NULL,
 byte_length INTEGER NOT NULL,
 sha256 TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'staging',
 created_at TEXT NOT NULL,
 completed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_vault_recovery_locator ON vault_recovery_snapshots(locator,status,completed_at);
CREATE TABLE IF NOT EXISTS vault_recovery_parts (
 snapshot_id TEXT NOT NULL REFERENCES vault_recovery_snapshots(id) ON DELETE CASCADE,
 part_index INTEGER NOT NULL,
 part TEXT NOT NULL,
 PRIMARY KEY(snapshot_id,part_index)
);
