CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id),
    type VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    title TEXT,
    description TEXT,
    url TEXT,
    author_name VARCHAR(255),
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (repository_id, type, external_id)
);