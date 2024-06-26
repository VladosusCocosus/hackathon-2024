-- migrate:up
alter table device_platforms add column meta jsonb;

-- migrate:down

