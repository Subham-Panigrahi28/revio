-- 011_add_activity_metadata.sql
-- Add noise filtering, trust scoring, and git branch/commit metadata to activities.

ALTER TABLE activities
    ADD COLUMN IF NOT EXISTS is_ignored BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS ignore_reason TEXT,
    ADD COLUMN IF NOT EXISTS trust_badge VARCHAR(50) DEFAULT 'High confidence',
    ADD COLUMN IF NOT EXISTS branch VARCHAR(255),
    ADD COLUMN IF NOT EXISTS commits_count INT NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_activities_ignored ON activities(repository_id, is_ignored);
