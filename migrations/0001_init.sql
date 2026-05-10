CREATE TABLE inquiries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id     INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  author_name   TEXT    NOT NULL,
  password_hash TEXT,
  password_salt TEXT,
  phone_enc     TEXT    NOT NULL,
  email_enc     TEXT    NOT NULL,
  title         TEXT    NOT NULL,
  content       TEXT    NOT NULL,
  is_secret     INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at    TEXT    NOT NULL
);
CREATE INDEX idx_inquiries_parent  ON inquiries(parent_id);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_expires ON inquiries(expires_at);

CREATE TABLE rate_limits (
  ip          TEXT NOT NULL,
  bucket      TEXT NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0,
  window_end  TEXT NOT NULL,
  PRIMARY KEY (ip, bucket)
);
