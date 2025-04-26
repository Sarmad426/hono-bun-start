import { Hono } from 'hono'
import { env } from 'hono/adapter'



const app = new Hono()

app.get('/', (c) => {
  return c.json({
    message: 'Sarmad hono project!',
  })
})

app.get('/user', (c) => {
  const { USER_NAME } = env<{ USER_NAME: string }>(c)
  return c.json({
    name: USER_NAME,
  })
})

app.get('/user/:id', (c) => c.json({ name: env(c).USER_NAME, id: c.req.param('id') }))



export default {
  fetch: app.fetch,
  port: 8000,
}
