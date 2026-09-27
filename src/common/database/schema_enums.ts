export enum clientType {
  MERCHANT = 'MERCHANT',
  COURIER = 'COURIER',
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
  CLIENT = 'CLIENT',
  // Business Core & Operations
  VENDOR = 'VENDOR',
  BRANCH = 'BRANCH',
}

export enum userStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum scopeType {
  SYSTEM = 'SYSTEM',
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  BRANCH = 'BRANCH',
}
