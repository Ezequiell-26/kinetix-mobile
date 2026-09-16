-- Push subscriptions use the same String/cuid identity as "User". PostgreSQL
-- must therefore use TEXT here; UUID would make the FK impossible to create.
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT,
    auth TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Optional delivery queue. User IDs are TEXT for the same reason as above.
CREATE TABLE IF NOT EXISTS pending_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    target_user_ids TEXT[] NOT NULL DEFAULT '{}',
    target_role TEXT,
    sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(active);
CREATE INDEX IF NOT EXISTS idx_pending_notifications_sent ON pending_notifications(sent, created_at);
CREATE INDEX IF NOT EXISTS idx_pending_notifications_role ON pending_notifications(target_role);
