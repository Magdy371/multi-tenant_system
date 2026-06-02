import {sql, relations} from 'drizzle-orm'
import {
    serial,
    unique,
    timestamp,
    pgTable,
    pgEnum,
    uniqueIndex,
    integer,
    text
} from 'drizzle-orm/pg-core'

export const Users = pgTable(
    "Users",
    {
        id: serial("id").primaryKey(),
        name: text("name"),
        email: text("email"),
        password: text("password"),
        otp: text("otp"),
        created_at: timestamp("created_at"),
        updated_at: timestamp("updated_at"),
        deleted_at: timestamp("deleted_at"),
    }
)
