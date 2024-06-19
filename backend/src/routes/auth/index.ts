import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {loginUserInput, registrationUserInput} from "../../types/user";
import {AuthController} from "./controller";
import {crypto} from "../../lib/crypto";
import {lucia} from "../../lib/lucia";
import {setCookie} from "hono/cookie";

const authController = new AuthController()

export default new Hono()
    .post('/', zValidator('json', registrationUserInput, (result, c) => {
        if (!result.success) {
            return c.text('User is invalid', 400)
        }
    }), async (c) => {
        const body = c.req.valid('json')

        const user = await authController.createUser(body)

        return c.json(user, 200)
    })

    .post('/login', zValidator('json', loginUserInput, (result, c) => {
        if (!result.success) {
            return c.text('Login info is invalid', 400)
        }
    }), async (c) => {
        const body = c.req.valid('json')

        const user = await authController.getUserByEmail(body.email)

        if (!user) {
            return c.text('User not found', 401)
        }

        const { password, ...restUser } = user

        const passwordIsCorrect = await crypto.compare(body.password, password)

        if (!passwordIsCorrect) {
            return c.text('Password is not correct', 401)
        }

        const session = await lucia.createSession(user.id, {})

        const cookieSession = lucia.createSessionCookie(session.id)

        setCookie(c, cookieSession.name, cookieSession.value, {
            secure: cookieSession.attributes.secure,
            httpOnly: cookieSession.attributes.httpOnly,
            path: cookieSession.attributes.path
        })

        return c.json(restUser)
    })
