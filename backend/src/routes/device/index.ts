import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {deviceSchema} from "../../types/device";
import {DeviceController} from "./controller";

const deviceController = new DeviceController()

export default new Hono()

    .post(
    '/',
        zValidator('json',
        deviceSchema.omit({'id': true})),
async (c) => {
            const body = c.req.valid('json')
            const result = await deviceController.createDevice({device: body})
            return c.json(result, 200)
        }
    )

    .get(
        '/:id',
        async (c) => {
            const { id } = c.req.param()
            const result = await deviceController.getDevice(id)
            return c.json(result, 200)
        }
    )

    .get(
        '/:id',
        async (c) => {
            const { id } = c.req.param()
            const result = await deviceController.getDevice(id)
            return c.json(result, 200)
        }
    )

    .get(
        '/:id/platforms',
        async (c) => {
            const { id: deviceId } = c.req.param()
            const result = await deviceController.getLinkedPlatforms(deviceId)
            return c.json(result, 200)
        }
    )

    .post(
        '/:deviceId/platforms/:platformId',
        async (c) => {
            const { deviceId, platformId } = c.req.param()
            const result = await deviceController.linkPlatform(deviceId, platformId)
            return c.json(result, 200)
        }
    )
