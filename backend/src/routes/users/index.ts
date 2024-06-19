import {Hono} from "hono";
import {deleteCookie, getCookie} from "hono/cookie";
import {lucia} from "../../lib/lucia";
import {UserController} from "./controller";

const userController = new UserController()

const app = new Hono()
    .get('/me', async (c) => {
        const cookie = getCookie(c)

        const authSession = cookie["auth_session"]

        const {user} = await lucia.validateSession(authSession)

        if (!user) {
            return c.json({message: "Not found"}, 404)
        }

        return c.json(user, 200)
    })

    .post('/logout', async (c) => {
        deleteCookie(c, 'auth_session')
        return c.json({success: true})
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
