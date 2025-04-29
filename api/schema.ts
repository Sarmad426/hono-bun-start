import { pgTable, uniqueIndex, index, varchar, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const userTable = pgTable("userTable", {
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
