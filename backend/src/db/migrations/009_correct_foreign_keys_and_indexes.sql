-- 009_correct_foreign_keys_and_indexes.sql
-- Correct foreign key cascade and set null behaviors, and add query performance indexes.

-- 1. Repositories -> Workspaces (CASCADE on workspace deletion)
ALTER TABLE repositories DROP CONSTRAINT IF EXISTS repositories_workspace_id_fkey;
ALTER TABLE repositories
    ADD CONSTRAINT repositories_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

-- 2. Activities -> Repositories (CASCADE on repository deletion)
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_repository_id_fkey;
ALTER TABLE activities
    ADD CONSTRAINT activities_repository_id_fkey
    FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE;

-- 3. Releases -> Repositories (CASCADE on repository deletion)
ALTER TABLE releases DROP CONSTRAINT IF EXISTS releases_repository_id_fkey;
ALTER TABLE releases
    ADD CONSTRAINT releases_repository_id_fkey
    FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE;

-- 4. Activities -> Releases (SET NULL when a release is deleted so activities return to unreleased queue)
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_release_id_fkey;
ALTER TABLE activities
    ADD CONSTRAINT activities_release_id_fkey
    FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE SET NULL;

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_repositories_workspace_id ON repositories(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activities_repository_id ON activities(repository_id);
CREATE INDEX IF NOT EXISTS idx_activities_release_id ON activities(release_id);
CREATE INDEX IF NOT EXISTS idx_activities_unreleased ON activities(repository_id) WHERE release_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_releases_repo_status ON releases(repository_id, status);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
