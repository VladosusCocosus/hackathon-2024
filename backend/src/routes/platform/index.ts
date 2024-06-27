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
        '/pipeline-status',
        async (c) => {
            // const { platfromId } = c.req.param()
            const {id: userId} = c.get('jwtPayload')
            const result = await platformController.getPipeline(userId)
            return c.json(result, 200)
        }
    )

    .get(
        '/:platfromId',
        async (c) => {
            const { platfromId } = c.req.param()
            const result = await platformController.getPlatform(platfromId)
            return c.json(result, 200)
        }
    )


    // сделать по key вместо id
    .get(
        '/:platfromId/all-pipelines',
        async (c) => {
            console.log('/:platfromId/all-pipelines')
            const { platfromId } = c.req.param()
            const result = await platformController.refreshProjects(platfromId)
            return c.json(result, 200)
        }
    )

    .post(
        '/:platfromId/:projectId/change-status',
        zValidator('json', z.object({ active: z.boolean() })),
        async (c) => {
            const body = c.req.valid('json')
            const { projectId } = c.req.param()
            db.query(`UPDATE projects SET is_active = $1 WHERE id = $2`, [body.active, projectId])
            return c.json({ ok: true }, 200)
        }
    )

    .post(
        '/:platfromId/:projectId/set-token',
        zValidator('json', z.any()),
        async (c) => {
            const body = c.req.valid('json')
            const { projectId } = c.req.param()
            db.query(`UPDATE device_platfroms SET meta = $1 WHERE id = $2`, [JSON.stringify(body), projectId])
            return c.json({ ok: true }, 200)
        }
    )