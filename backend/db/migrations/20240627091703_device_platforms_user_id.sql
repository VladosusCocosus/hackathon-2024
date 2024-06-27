-- migrate:up
create unique index device_platforms_user_id on device_platforms (platform_id, user_id)

-- migrate:down

