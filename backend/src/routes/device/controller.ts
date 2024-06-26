import {db} from "../../lib/db";
import {Device, Link} from "../../types/device";

export class DeviceController {
    async getDevice (id: string): Promise<Device | null> {
        const {rows} = await db.query<Device>(`
            select *
            from devices
            where id = $1
            limit 1`
            , [id])

        const device = rows[0]

        return device ?? null
    }

    async createDevice ({ device }: { device: Omit<Device, 'id'> }): Promise<Device | null> {
        const { rows } = await db.query<Device>(`
            insert into devices (device_name, owner) values ($1, $2) returning *
        `, [ device.device_name, device.owner ])

        const newDevice = rows[0]

        return newDevice ?? null
    }

    async linkPlatform (deviceId: string, platformId: string): Promise<Link | null> {
        const { rows } = await db.query<Link>(`insert into device_platforms (device_id, platform_id) values ($1, $2) returning *`, [deviceId, platformId])
        return rows[0] ?? null
    }

    async getLinkedPlatforms (deviceId: string): Promise<Link[]> {
        const { rows } = await db.query<Link>(`select * from device_platforms where device_id = $1`, [deviceId])
        return rows
    }

    async getUserDevices (userId: string): Promise<Device[]> {
        console.log({userId})
        const { rows } = await db.query<Device>(`select * from devices where owner = $1`, [userId])
        return rows
    }
}
