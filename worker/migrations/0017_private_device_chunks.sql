-- Compass 0.5.52: transactional, end-to-end encrypted transfer of large device mirrors.
-- Only opaque ciphertext slices and unencrypted transport metadata are stored.
ALTER TABLE private_device_mirror ADD COLUMN chunk_id TEXT;
ALTER TABLE private_device_mirror ADD COLUMN chunk_count INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS private_device_mirror_parts (
 owner_sub TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('finance','health')),
 transfer_id TEXT NOT NULL,
 part_index INTEGER NOT NULL,
 part TEXT NOT NULL,
 created_at TEXT NOT NULL,
 PRIMARY KEY(owner_sub,kind,transfer_id,part_index)
);
CREATE INDEX IF NOT EXISTS idx_private_mirror_parts_created ON private_device_mirror_parts(created_at);
