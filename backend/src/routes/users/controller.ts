import {db} from "../../lib/db";

export class UserController {
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
