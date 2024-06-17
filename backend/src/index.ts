import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

import userRouter from './routes/users'
import deviceRouter from './routes/device'

const app = new Hono()
    .route('/users', userRouter)
    .route('/devices', deviceRouter)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
