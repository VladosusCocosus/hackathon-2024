import {db} from "../../lib/db";
import {Device} from "../../types/device";
import {Platform} from "../../types/platforms";
import {crypto} from "../../lib/crypto";
import {User} from "../../types/user";

export class UserController {
    async createUser (user: Omit<User, 'id'>): Promise<User> {
        const passwordHash = await crypto.generateHash(user.password)

        const {rows} = await db.query<User>("insert into users (name, password, email) values ($1, $2, $3) returning name, email, id", [user.name, passwordHash, user.email])
        return rows?.[0]
    }
    async getPlatform (id: string): Promise<Platform | null> {
        const {rows} = await db.query<Platform>(`
            select *
            from platforms
            where id = $1
            limit 1`
            , [id])

        return rows[0] ?? null
    }

    async createPlatform ({ platform }: { platform: Omit<Platform, 'id'> }): Promise<Device | null> {
        const { rows } = await db.query<Device>(`
            insert into platforms (name) values ($1) returning *
        `, [ platform.name ])

        const newPlatform = rows[0]

        return newPlatform ?? null
    }

    async linkDevice (deviceId: string, userId: string): Promise<{ deviceId: string, userId: string }> {
        const { rows } = await db.query<{ deviceId: string, userId: string }>(`
        insert into user_devices (device_id, user_id)
        values ($1, $2) 
        on conflict (device_id) do update set device_id = $1
        returning *
        `, [deviceId, userId])

        return rows[0];
    }
}
