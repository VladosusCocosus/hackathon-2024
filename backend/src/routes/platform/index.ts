import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import { PlatformController} from "./controller";
import {platformSchema} from "../../types/platforms";
import {z} from "zod";
import { db } from "../../lib/db";

const platformController = new PlatformController()

export default new Hono()

    .post(
        '/',
        zValidator('json',
            platformSchema.omit({'id': true})),
        async (c) => {
            const body = c.req.valid('json')
            const result = await platformController.createPlatform({platform: body})
            return c.json(result, 200)
        }
    )

    .get(
        '/',
        zValidator('query', z.object({
            offset: z.string(),
            limit: z.string()
        })),
        async (c) => {
            const queries = c.req.query()

            const result = await platformController.getPlatforms(Number(queries.limit), Number(queries.offset))
            return c.json(result, 200)
        }
    )

    .get(
        '/project',
        async (c) => {
            const {id: userId} = c.get('jwtPayload')
            const result = await platformController.refreshProjects(userId)
            return c.json(result, 200)
        }
    )

    .get(
        '/:platformId',
        async (c) => {
            const { platformId } = c.req.param()
            const {id: userId} = c.get('jwtPayload')
            const result = await platformController.getPlatform(platformId)
            const userDataResult = await db.query('select meta from device_platforms where user_id = $1 and platform_id = $2 limit 1', [userId, platformId])
            const userData = userDataResult.rows[0].meta
            return c.json({...result, userData: (userData ?? {})}, 200)
        }
    )


    // сделать по key вместо id
    .get(
        '/:platfromId/all-pipelines',
        async (c) => {
            const { platfromId } = c.req.param()
            const result = await platformController.refreshProjects(platfromId)
            return c.json(result, 200)
        }
    )

    .patch(
        '/:platformId/set-token',
        zValidator('json', z.any()),
        async (c) => {
            const {id: userId} = c.get('jwtPayload')
            const body = c.req.valid('json')
            const { platformId } = c.req.param()

            await db.query(`
                INSERT INTO device_platforms (platform_id, user_id, meta) values ($3, $2, $1)
                    on conflict (platform_id, user_id) do update set meta = $1
                `, [JSON.stringify(body), userId, platformId]
            )

            return c.json({ ok: true }, 200)
        }
    )

    .post(
        '/:platfromId/:projectId/change-status',
        zValidator('json', z.object({ active: z.boolean() })),
        async (c) => {

            const body = c.req.valid('json')
            const { projectId } = c.req.param()
            await db.query(`UPDATE projects SET is_active = $1 WHERE id = $2`, [body.active, projectId])
            return c.json({ ok: true }, 200)
        }
    )
