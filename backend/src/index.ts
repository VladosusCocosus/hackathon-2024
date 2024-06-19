import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

import userRouter from './routes/users'
import deviceRouter from './routes/device'
import platformRouter from './routes/platform'
import authRouter from './routes/auth'
import {getUser} from "./lib/user";
import {User} from "./types/user";

type Variables = {
    user: Omit<User, 'password'>
}

const app = new Hono<{ Variables: Variables }>()
    .route('/auth', authRouter)
    .use('/*', async (c, next) => {
      const user = await getUser(c)
      if (!user) {
        return c.json("Unauthorized", 401)
      }

      c.set('user', user)
      await next()
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
