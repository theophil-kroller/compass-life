-- Compass 0.5.69.2: allow one additional ciphertext-only journal domain.
-- Existing finance and health ciphertext is copied byte-for-byte; no plaintext conversion.
-- SQLite CHECK constraints cannot be changed in place.
CREATE TABLE private_device_mirror_0018 (
 owner_sub TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('finance','health','journal')),
 version INTEGER NOT NULL DEFAULT 1,
 salt TEXT NOT NULL,
 iv TEXT NOT NULL,
 ciphertext TEXT NOT NULL,
 compressed INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL,
 chunk_id TEXT,
 chunk_count INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(owner_sub,kind)
);
INSERT INTO private_device_mirror_0018(owner_sub,kind,version,salt,iv,ciphertext,compressed,updated_at,chunk_id,chunk_count)
 SELECT owner_sub,kind,version,salt,iv,ciphertext,compressed,updated_at,chunk_id,chunk_count FROM private_device_mirror;
DROP TABLE private_device_mirror;
ALTER TABLE private_device_mirror_0018 RENAME TO private_device_mirror;
CREATE TABLE private_device_mirror_parts_0018 (
 owner_sub TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('finance','health','journal')),
 transfer_id TEXT NOT NULL,
 part_index INTEGER NOT NULL,
 part TEXT NOT NULL,
 created_at TEXT NOT NULL,
 PRIMARY KEY(owner_sub,kind,transfer_id,part_index)
);
INSERT INTO private_device_mirror_parts_0018(owner_sub,kind,transfer_id,part_index,part,created_at)
 SELECT owner_sub,kind,transfer_id,part_index,part,created_at FROM private_device_mirror_parts;
DROP TABLE private_device_mirror_parts;
ALTER TABLE private_device_mirror_parts_0018 RENAME TO private_device_mirror_parts;
CREATE INDEX IF NOT EXISTS idx_private_mirror_parts_created ON private_device_mirror_parts(created_at);
