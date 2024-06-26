-- migrate:up
alter table projects add column is_active boolean;

-- migrate:down

alter table projects drop column is_active