import { Hono } from "hono";

import { env } from 'hono/adapter'
import { ENV_TYPE } from "./type";

const app = new Hono()

app.get("/", c => c.json({ "message": "Sarmad Practice API" }))

app.get('/user', (c) => {

    const { USER_NAME, USER_EMAIL, USER_ID } = env<ENV_TYPE>(c)
    return c.json({
        "id": USER_ID,
        "name": USER_NAME,
        "email": USER_EMAIL,
        "message": "Hello from Hono API with bun!",
    })
}
)

export default {
    fetch: app.fetch,
    port: 8000,
}