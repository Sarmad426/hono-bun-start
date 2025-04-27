import { Hono } from 'hono'
import { handle } from 'hono/vercel'
// import { env } from 'hono/adapter'
// import { ENV_TYPE } from './type'
// import { getUsers } from './db'

import { env } from 'bun'
import { drizzle } from 'drizzle-orm/neon-http';
import { user as userTable } from '../drizzle/schema';
// import { Pool } from 'pg';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = env.DATABASE_URL

// const pool = new Pool({
//   connectionString: DATABASE_URL,
// });

// const db = drizzle(pool);

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

export const getUsers = async () => await db.select().from(userTable).limit(10)


const app = new Hono().basePath('/api')

app.get('/', (c) => {
  return c.json({ message: "Hono API from Sarmad Rafique!" })
})

// app.get('/user', (c) => {

//   const { USER_NAME, USER_EMAIL, USER_ID } = env<ENV_TYPE>(c)
//   return c.json({
//     "id": USER_ID,
//     "name": USER_NAME,
//     "email": USER_EMAIL,
//   })
// }
// )

app.get("/users", async (c) => {
  const users = await getUsers();
  console.log("Users: ", users)
  return c.json({
    "message": "Sarmad Practice API",
    "users": users
  })
})


const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;