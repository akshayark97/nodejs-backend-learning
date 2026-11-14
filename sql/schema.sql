
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL DEFAULT '',

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'completed')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status
ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_tasks_created_at
ON tasks(created_at DESC);
