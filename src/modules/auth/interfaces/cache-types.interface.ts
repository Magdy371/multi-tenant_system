export interface CachedRefreshToken {
  tokenId: number;
  userId: number;
  expiresAt: string;
  tokenHash: string;
  revokedAt: string | null;
}

export interface CachedSession {
  id: number;
  userId: number;
  refreshTokenId: number;
  lastActivityAt: string;
}
