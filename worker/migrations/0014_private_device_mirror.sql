-- Ciphertext-only opt-in mirror. No bank text or Garmin measurements are stored in plaintext.
CREATE TABLE IF NOT EXISTS private_device_mirror (
 owner_sub TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('finance','health')),
 version INTEGER NOT NULL DEFAULT 1,
 salt TEXT NOT NULL,
 iv TEXT NOT NULL,
 ciphertext TEXT NOT NULL,
 compressed INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL,
 PRIMARY KEY(owner_sub,kind)
);
