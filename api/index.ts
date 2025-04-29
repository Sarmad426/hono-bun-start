import { Hono } from "hono";
import { handle } from "hono/vercel";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, uniqueIndex, index, varchar, boolean } from "drizzle-orm/pg-core"

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });


const userTable = pgTable("userTable", {
  id: varchar().primaryKey().notNull(),
  name: varchar().notNull(),
  email: varchar().notNull(),
  hashedPassword: varchar("hashed_password"),
  isGoogleAccount: boolean("is_google_account").notNull(),
  avatar: varchar(),
}, (table) => [
  uniqueIndex("ix_user_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
  index("ix_user_id").using("btree", table.id.asc().nullsLast().op("text_ops")),
]);


export const getUsers = async () => await db.select().from(userTable).limit(10);

const app = new Hono().basePath("/api");

app.get("/", (c) => c.json({ message: "Hono API from Sarmad Rafique!" }));
app.get("/users", async (c) => {
  const users = await getUsers();
  return c.json({ message: "Sarmad Practice API", users });
});

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
