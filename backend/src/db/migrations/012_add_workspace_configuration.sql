-- 012_add_workspace_configuration.sql
-- Add workspace configuration, developer credentials, and widget appearance settings.

ALTER TABLE workspaces
    ADD COLUMN IF NOT EXISTS url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS api_key VARCHAR(255) UNIQUE,
    ADD COLUMN IF NOT EXISTS webhook_secret VARCHAR(255),
    ADD COLUMN IF NOT EXISTS widget_settings JSONB NOT NULL DEFAULT '{"theme": "dark", "accentColor": "#FF7442", "mode": "floating"}';
