export interface JwtPayload {
  sub: number;
  email: string;
  clientId?: number;
  agentId?: number;
  sessionId?: string;
  roles: Array<{
    name: string;
    scopeType: string;
  }>;
  businessName?: string;
  type?: string; // 'agent' for agent tokens
  isImpersonation?: boolean;
  impersonatedClientId?: number;
}

export interface JwtRefreshPayload {
  sub: number;
  type: 'refresh';
  businessName: string | null;
}
