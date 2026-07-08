import { relations } from 'drizzle-orm'
import {
    serial,
    timestamp,
    pgTable,
    integer,
    text,
    boolean,
    index,
    unique
} from 'drizzle-orm/pg-core'


export enum clientType {
  MERCHANT = 'MERCHANT',
  COURIER = 'COURIER',
}
export enum scopType {
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

export const enum resources {
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

export const clients = pgTable(
  'Client',
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    businessName: text("businessName"),
    type: text("tyoe").$type<clientType>().default(clientType.COURIER),
    status: text("status").$type<userStatus>().default(userStatus.ACTIVE),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    deleted_at: timestamp("deleted_at"),
  }
);

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

export const userClients = pgTable(
  'UserClient',
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id, {onDelete: "cascade"}),
    clientId: integer("clientId").references(() => clients.id,{onDelete: "cascade"}),
    isOwner: boolean("isOwner").default(false),
    status: text("status").$type<userStatus>(),
    joined_at: timestamp("joined_at").defaultNow().notNull(),
    left_at:timestamp("left_at").defaultNow().notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    deleted_at: timestamp("deleted_at").defaultNow().notNull(),
  },
  (table) => ({
    userClientUnique: unique().on(table.userId, table.clientId),
    userIdIdx: index("UserClient_userId_idx").on(table.userId),
    clientIdIdx: index("UserClient_clientId_idx").on(table.clientId),
    statusIdx: index("UserClient_status_idx").on(table.status),
    isOwnerIdx: index("UserClient_isOwner_idx").on(table.isOwner),
  }),
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
    scope: text("scope").$type<scopType>(),
    description: text("description"),
    resource: text("resource").$type<resources>(),
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
