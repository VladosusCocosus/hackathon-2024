-- migrate:up
alter table device_platforms add column user_id uuid references users(id);

-- migrate:down

