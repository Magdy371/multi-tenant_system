import { Injectable, OnModuleInit } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { roles } from '../database/schema';
import { isNull, and, eq } from 'drizzle-orm';

@Injectable()
export class RoleNameService implements OnModuleInit {
  private roleNames: string[] = [];
  private roleNamesSet: Set<string> = new Set();

  constructor(private readonly drizzle: DrizzleService) {}
  async onModuleInit() {}

  async loadRoleNames(): Promise<void> {
    try {
      const allRoles = await this.drizzle.db
        .select({ name: roles.name })
        .from(roles)
        .where(and(isNull(roles.deletedAt), eq(roles.isActive, true)));

      this.roleNames = allRoles
        .map((role) => role.name)
        .filter((name): name is string => name != null);
      this.roleNamesSet = new Set(this.roleNames);
    } catch (err) {
      console.error('Failed to load Role names, Apply CallBacks');
      // Fallback to default role names if database is not available
      this.roleNames = [
        'MASTER_ADMIN',
        'CLIENT_ADMIN',
        'VENDOR_ADMIN',
        'BRANCH_MANAGER',
      ];
    }
  }
  getRoleNames(): string[] {
    return [...this.roleNames];
  }

  async refreshRoleNames(): Promise<void> {
    await this.loadRoleNames();
  }
}
