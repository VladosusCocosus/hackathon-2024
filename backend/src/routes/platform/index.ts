import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import { PlatformController} from "./controller";
import {platformSchema} from "../../types/platforms";
import {z} from "zod";

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
        '/:id',
        async (c) => {
            const { id } = c.req.param()
            const result = await platformController.getPlatform(id)
            return c.json(result, 200)
        }
    )
