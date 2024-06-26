import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {loginUserInput, registrationUserInput} from "../../types/user";
import {AuthController} from "./controller";
import {crypto} from "../../lib/crypto";
import { decode, sign, verify } from 'hono/jwt'
import {z} from "zod";
import {UserController} from "../users/controller";

const authController = new AuthController()
const userController = new UserController()

export default new Hono()
    .post('/registration', zValidator('json', registrationUserInput, (result, c) => {
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

        const accessToken = await sign({ ...restUser, exp:  Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, process.env.SECRET ?? '')

        return c.json({accessToken})
    })


    .post('/refresh', zValidator('json', z.object({
        refresh: z.string()
    }), (result, c) => {
        if (!result.success) {
            return c.text('Login info is invalid', 400)
        }
    }), async (c) => {
        const body = c.req.valid('json')
        const { id } = await verify(body.refresh, process.env.SECRET ?? '')

        if (typeof id !== 'string') {
            return c.text('User not found', 404)
        }

        const user =  userController.getUser(id)

        if (!user) {
            return c.text('User not found', 404)
        }

        const {  ...restUser } = user

        const accessToken = await sign({ ...restUser, exp:  Math.floor(Date.now() / 1000) + 60 * 5 }, process.env.SECRET ?? '')

        return c.json({
            accessToken
        })
    })
