-- 010_create_release_changes.sql
-- Normalized categorized customer-facing update lines for Release Studio.

CREATE TABLE IF NOT EXISTS release_changes (
    id BIGSERIAL PRIMARY KEY,
    release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL CHECK (category IN ('new', 'improved', 'fixed')),
    title VARCHAR(255) NOT NULL,
    body TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_release_changes_release_order ON release_changes(release_id, display_order);
