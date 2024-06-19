import {Hono} from "hono";
import {UserController} from "./controller";

const userController = new UserController()

const app = new Hono()
    .get('/me', async (c) => {
        const payload = c.get('jwtPayload')

        if (!payload) {
            return c.json({message: "Not found"}, 404)
        }

        return c.json(payload, 200)
    })

    .post('/device/:id', async (c) => {
        const { id } = c.req.param()

        const user = c.get('user')

        if (!user) {
            return c.json({message: "Not authenticated"}, 404)
        }

        const newLink = await userController.linkDevice(id, user?.id)
        return c.json(newLink)
    })

export default app
