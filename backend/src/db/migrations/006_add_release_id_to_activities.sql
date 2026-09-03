ALTER TABLE activities
ADD COLUMN release_id BIGINT
REFERENCES releases(id);