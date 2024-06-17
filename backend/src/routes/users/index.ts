import {Hono} from "hono";
import {db} from "../../lib/db";
import {zValidator} from "@hono/zod-validator";
import {loginUserInput, registrationUserInput, User} from "../../types/user";
import {crypto} from "../../lib/crypto";
import {deleteCookie, getCookie, setCookie} from "hono/cookie";
import {lucia} from "../../lib/lucia";
import {UserController} from "./controller";

const userController = new UserController()

const app = new Hono()


    .post('/', zValidator('json', registrationUserInput, (result, c) => {
        if (!result.success) {
            return c.text('User is invalid', 400)
        }
    }), async (c) => {
        const body = c.req.valid('json')

        const user = await userController.createUser(body)

        return c.json(user, 200)
    })


    .post('/login', zValidator('json', loginUserInput, (result, c) => {
        if (!result.success) {
            return c.text('Login info is invalid', 400)
        }
    }), async (c) => {
        const body = c.req.valid('json')

        const userResponse = await db.query<User>('select * from users where email = $1', [body.email])

        if (!userResponse.rows[0]) {
            return c.text('User not found', 401)
        }

        const user = userResponse.rows[0]

        const passwordIsCorrect = await crypto.compare(body.password, user.password)

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
        return c.json({success: true})
    })



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

export default app
