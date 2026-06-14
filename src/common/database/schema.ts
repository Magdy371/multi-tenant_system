import { sql, relations } from 'drizzle-orm'
import {
    serial,
    unique,
    timestamp,
    pgTable,
    pgEnum,
    uniqueIndex,
    integer,
    text,
    boolean
} from 'drizzle-orm/pg-core'

export const Users = pgTable(
    "Users",
    {
        id: serial("id").primaryKey(),
        name: text("name"),
        email: text("email"),
        password: text("password"),
        role_id: integer("role_id").references(() => Roles.id),
        otp: text("otp"),
        created_at: timestamp("created_at"),
        updated_at: timestamp("updated_at"),
        deleted_at: timestamp("deleted_at"),
    }
);

export const Roles = pgTable(
    "Roles",
    {
        id: serial("id").primaryKey(),
        name: text("name"),
        isGlobal: boolean("isGlobal"),
        isActive: boolean("isActive"),
        description: text("description"),
        created_at: timestamp("created_at"),
        updated_at: timestamp("updated_at"),
        deleted_at: timestamp("deleted_at"),
    },
    (table) => ({
        nameIndex: uniqueIndex("Roles_name_unique").on(table.name)
    })
);


//User Relations
export const userRelations = relations(Users, ({ one }) => ({
    role: one(Roles, {
        fields: [Users.role_id],
        references: [Roles.id]
    })
}));

//Role Relations
export const rolesRelations = relations(Roles, ({ many }) => ({
    users: many(Users),
}));
