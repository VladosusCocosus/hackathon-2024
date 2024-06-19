-- migrate:up
alter table platforms add column image text;

-- migrate:down
alter table platforms drop column image;
