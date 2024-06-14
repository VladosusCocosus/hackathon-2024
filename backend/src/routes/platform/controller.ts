import {db} from "../../lib/db";
import {Device} from "../../types/device";
import {Platform} from "../../types/platforms";

export class DeviceController {
    async getPlatforms (limit: number = 10, offset: number = 0): Promise<Platform[]> {
        const {rows} = await db.query<Platform>(`
            select *
            from platforms
        
            limit $1 offset $2`
            , [limit, offset])

        return rows
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
}
