import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

import userRouter from './routes/users'
import deviceRouter from './routes/device'
import platformRouter from './routes/platform'
import authRouter from './routes/auth'
import {User} from "./types/user";
import {cors} from "hono/cors";
import {jwt} from "hono/jwt";

type Variables = {
    user: Omit<User, 'password'>
    jwtPayload: Omit<User, 'password'>
}


const app = new Hono<{ Variables: Variables }>()
    .use('*', cors({
        origin: '*',
        credentials: true
    }))
    .route('/auth', authRouter)
    .use('*',  (c, next) => {
        const jwtMiddleware = jwt({
            secret: process.env?.SECRET ?? '',
        })
        return jwtMiddleware(c, next)
    })
    .route('/users', userRouter)
    .route('/devices', deviceRouter)
    .route('/platforms', platformRouter)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
