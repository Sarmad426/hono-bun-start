// import { env } from 'bun'
import { drizzle } from 'drizzle-orm/node-postgres';
import { userTable } from '../drizzle/schema';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL!

const pool = new Pool({
    connectionString: DATABASE_URL,
});

const db = drizzle(pool);

export const getUsers = async () => await db.select().from(userTable).limit(10)