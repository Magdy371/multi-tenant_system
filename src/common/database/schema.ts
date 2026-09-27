import { relations } from 'drizzle-orm';
import {
  serial,
  timestamp,
  pgTable,
  integer,
  text,
  boolean,
  index,
  unique,
  json,
} from 'drizzle-orm/pg-core';
import {
  userStatus,
  scopeType,
  clientType,
  permissionAction,
  resources,
} from './schema_enums';

export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  phone: text('phone'),
  password: text('password'),
  roleId: integer('roleId').references(() => roles.id),
  otp: text('otp'),
  status: text('status')
    .$type<userStatus>()
    .notNull()
    .default(userStatus.ACTIVE),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
  deletedAt: timestamp('deletedAt'),
});

export const clients = pgTable(
  'Client',
  {
    id: serial('id').primaryKey(),
    domain: text('domain').notNull().default('tenant'),
    logo: text('logo'),
    name: text('name').notNull().default('tenant'),
    type: text('type').$type<clientType>().default(clientType.COURIER),
    status: text('status').$type<userStatus>().default(userStatus.ACTIVE),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
    deletedAt: timestamp('deletedAt'),
  },
  (table) => ({
    typeIdx: index('Client_type_idx').on(table.type),
    deletedAtIdx: index('Client_deletedAt_idx').on(table.deletedAt),
  }),
);

export const vendors = pgTable(
  'Vendor',
  {
    id: serial('id').primaryKey(),
    clientId: integer('clientId')
      .notNull()
      .references(() => clients.id),
    name: text('name').notNull(),
    userId: integer('userId').references(() => users.id),
    status: text('status')
      .$type<userStatus>()
      .notNull()
      .default(userStatus.ACTIVE),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    deletedAt: timestamp('deletedAt'),
  },
  (table) => ({
    clientIdIdx: index('Vendor_clientId_idx').on(table.clientId),
    userIdIdx: index('Vendor_userId_idx').on(table.userId),

    deletedAtIdx: index('Vendor_deletedAt_idx').on(table.deletedAt),
  }),
);

export const branches = pgTable(
  'Branch',
  {
    id: serial('id').primaryKey(),
    clientId: integer('clientId')
      .notNull()
      .references(() => clients.id),
    vendorId: integer('vendorId').references(() => vendors.id),
    name: text('name').notNull(),
    address: text('address'),
    mobile: text('mobile'),
    phoneCode: text('phoneCode').default('+20').notNull(),
    location: json('location'),
    currentAddressId: integer('currentAddressId'), // Reference to current address
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
    deletedAt: timestamp('deletedAt'),
  },
  (table) => ({
    clientVendorIdx: index('Branch_clientId_vendorId_idx').on(
      table.clientId,
      table.vendorId,
    ),
    deletedAtIdx: index('Branch_deletedAt_idx').on(table.deletedAt),
  }),
);

export const userClients = pgTable(
  'UserClient',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId').references(() => users.id, {
      onDelete: 'cascade',
    }),
    clientId: integer('clientId').references(() => clients.id, {
      onDelete: 'cascade',
    }),
    isOwner: boolean('isOwner').default(false),
    status: text('status').$type<userStatus>(),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
    deletedAt: timestamp('deletedAt'),
  },
  (table) => ({
    userClientUnique: unique().on(table.userId, table.clientId),
    userIdIdx: index('UserClient_userId_idx').on(table.userId),
    clientIdIdx: index('UserClient_clientId_idx').on(table.clientId),
    statusIdx: index('UserClient_status_idx').on(table.status),
    isOwnerIdx: index('UserClient_isOwner_idx').on(table.isOwner),
  }),
);

export const roles = pgTable(
  'Role',
  {
    id: serial('id').primaryKey(),
    name: text('name'),
    isGlobal: boolean('isGlobal'),
    isActive: boolean('isActive').notNull().default(true),
    description: text('description'),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
    deletedAt: timestamp('deletedAt'),
  },
  (table) => ({
    nameIndex: index('Roles_name_unique').on(table.name),
  }),
);

export const permissions = pgTable(
  'Permission',
  {
    id: serial('id').primaryKey(),
    name: text('name'),
    scope: text('scope').$type<scopeType>().notNull().default(scopeType.CLIENT),
    description: text('description'),
    resource: text('resource').$type<resources>(),
    action: text('action').$type<permissionAction>(),
    isActive: boolean('isActive').notNull().default(true),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
  },
  (table) => ({
    resourceActionIdx: index('Permission_resource_action_idx').on(
      table.resource,
      table.action,
    ),
    scopeIdx: index('Permission_scope_idx').on(table.scope),
    isActiveIdx: index('Permission_isActive_idx').on(table.isActive),
  }),
);

export const rolePermissions = pgTable('RolePermission', {
  id: serial('id').primaryKey(),
  roleId: integer('roleId')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: integer('permissionId').references(() => permissions.id, {
    onDelete: 'cascade',
  }),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

export const roleBindings = pgTable(
  'RoleBinding',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: integer('roleId')
      .notNull()
      .references(() => roles.id, { onDelete: 'restrict' }),
    scopeType: text('scopeType').$type<scopeType>().notNull(),
    scopeId: integer('scopeId'), // null for MASTER scope
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
  },
  (table) => ({
    userRoleScopeUnique: unique().on(
      table.userId,
      table.roleId,
      table.scopeType,
      table.scopeId,
    ),
    userIdIdx: index('RoleBinding_userId_idx').on(table.userId),
    scopeTypeScopeIdIdx: index('RoleBinding_scopeType_scopeId_idx').on(
      table.scopeType,
      table.scopeId,
    ),
  }),
);

//User Relations
export const userRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

//Role Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
