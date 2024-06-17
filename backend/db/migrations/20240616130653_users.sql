-- migrate:up
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       name varchar(128) NOT NULL,
                       password TEXT NOT NULL,
                       email varchar(128) NOT NULL
);

CREATE TABLE sessions (
                          id TEXT PRIMARY KEY,
                          expires_at TIMESTAMPTZ NOT NULL,
                          user_id UUID NOT NULL REFERENCES users(id)
);

-- migrate:down
DROP TABLE sessions;
DROP TABLE users;
