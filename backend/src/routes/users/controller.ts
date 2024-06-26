import {db} from "../../lib/db";
import {User} from "../../types/user";

export class UserController {
    async getUser (userId: string): Promise<Omit<User, 'password'> | null> {
        const { rows }  = await db.query(`select id, name, email from users where id = $1`, [userId])
        return rows?.[0] ?? null
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
