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
    boolean,
    index
} from 'drizzle-orm/pg-core'

export enum permissionScop {
  SYSTEM = 'SYSTEM',
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  BRANCH = 'BRANCH',
  AGENT = 'AGENT',
  ORDER = 'ORDER',
  SHIFT = 'SHIFT',
}

export enum permissionAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  MANAGE = 'MANAGE',
  ASSIGN = 'ASSIGN',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  REJECT = 'REJECT',
}

const enum permissionResources {
  // Identity & Access Management (IAM)
  USER = 'USER',
  ROLES = 'ROLE',
  PERMISSION = 'PERMISSION',

  // People & CRM (Actors)
  CUSTOMER = 'CUSTOMER',
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  SUPERVISOR = 'SUPERVISOR',

  // Business Core & Operations
  VENDOR = 'VENDOR',
  BRANCH = 'BRANCH',
  ORDER = 'ORDER',
  SHIFT = 'SHIFT',

  // Billing & Financials
  PLAN = 'PLAN',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAYMENT = 'PAYMENT',
  BILLING = 'BILLING',
  CURRENCY = 'CURRENCY',

  // Geographic & Localization
  COUNTRIES = 'COUNTRIES',
  CITY = 'CITY',
  ZONE = 'ZONE',
}

export enum userStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}


export const users = pgTable(
    "User",
    {
        id: serial("id").primaryKey(),
        name: text("name"),
        email: text("email").unique(),
        phone: text("phone"),
        password: text("password"),
        roleId: integer("roleId").references(() => roles.id),
        otp: text("otp"),
        status: text("status").$type<userStatus>().notNull().default(userStatus.ACTIVE),
        created_at: timestamp("created_at"),
        updated_at: timestamp("updated_at"),
        deleted_at: timestamp("deleted_at"),
    }
);

export const roles = pgTable(
    "Role",
    {
        id: serial("id").primaryKey(),
        name: text("name"),
        isGlobal: boolean("isGlobal"),
        isActive: boolean("isActive").notNull().default(true),
        description: text("description"),
        created_at: timestamp("created_at"),
        updated_at: timestamp("updated_at"),
        deleted_at: timestamp("deleted_at"),
    },
    (table) => ({
        nameIndex: index("Roles_name_unique").on(table.name)
    })
);

export const permissions = pgTable(
  "Permission",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    scope: text("scope").$type<permissionScop>(),
    description: text("description"),
    resource: text("resource").$type<permissionResources>(),
    action: text("action").$type<permissionAction>(),
    isActive: boolean("isActive").notNull().default(true),
    created_at: timestamp("created_at"),
    updated_at: timestamp("updated_at"),
  },
  (table) => ({
    resourceActionIdx: index("Permission_resource_action_idx").on(
      table.resource,
      table.action,
    ),
    scopeIdx: index("Permission_scope_idx").on(table.scope),
    isActiveIdx: index("Permission_isActive_idx").on(table.isActive),
  }),
);

export const rolePermissions = pgTable(
  'RolePermission',
  {
    id: serial("id").primaryKey(),
    roleId: integer("roleId").notNull().references(() => roles.id, {onDelete: "cascade"}),
    permissionId: integer("permissionId").references(() => permissions.id, {onDelete: "cascade"}),
    isActive: boolean("isActive").notNull().default(true),
    created_at: timestamp("created_at"),
    updated_at: timestamp("updated_at"),
  }
)


//User Relations
export const userRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id]
    })
}));

//Role Relations
export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));
