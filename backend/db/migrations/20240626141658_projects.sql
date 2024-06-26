-- migrate:up
create table if not exists projects (
    id uuid primary key default gen_random_uuid(),
    name varchar(64),
    user_id uuid references users(id),
    device_id uuid references devices(id)
 );

 create index projects_device_id_idx on projects (device_id);

-- migrate:down

drop index if exists projects_device_id_idx;

drop table if exists projects;
