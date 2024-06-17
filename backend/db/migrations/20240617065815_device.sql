-- migrate:up
create table if not exists user_devices (
    user_id uuid references users(id) not null ,
    device_id uuid references users(id) not null
);

create unique index user_devices_user_id_device_id_unique_idx on user_devices (user_id, device_id);
create index user_devices_user_id_idx on user_devices (user_id);
create unique index user_devices_device_id_idx on user_devices (device_id);

-- migrate:down
drop index user_devices_device_id_idx;
drop index user_devices_user_id_idx;
drop index user_devices_user_id_device_id_unique_idx;
drop table if exists user_devices
