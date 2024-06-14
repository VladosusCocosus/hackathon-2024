-- migrate:up
create table if not exists devices (
    id uuid primary key default gen_random_uuid(),
    device_name varchar(64),
    owner varchar(64)
);

create table if not exists platforms (
    id serial primary key,
    name varchar(64)
);

create table if not exists device_platforms (
    id serial,
    device_id uuid references devices(id),
    platform_id serial references platforms(id)
);

create unique index if not exists device_platforms_device_id_platform_id_idx on device_platforms (device_id, platform_id);

create index if not exists device_platforms_device_id on device_platforms(device_id);
-- migrate:down

drop index device_platforms_device_id;
drop index device_platforms_device_id_platform_id_idx;

drop table device_platforms;
drop table platforms;
drop table devices;

