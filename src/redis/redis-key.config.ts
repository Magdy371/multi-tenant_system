export const USER_AUTH_REDIS_TTL = {
    ACTIVE_TOKEN: 86400, //24 hours in seconds
    USER_AUTH_CACHE: 604800,
} as const;

export const ActiveTokenKeys = {
    /**
   * Get the Redis key for active token
   */
    token: (clientId: number, userId: number): string =>
        `clients:${clientId}:active_token:${userId}`,
    /**
   * Pattern to match all active tokens for a client
   */
    clientPattern: (clientId: number): string =>
        `clients:${clientId || 0}:active_token:*`,

    /**
     * Pattern to match all active tokens globally
     */
    allPattern: (): string => `clients:*:active_token:*`,
} as const;

/**
 * User Auth Cache Keys - Cache user auth data (user, roles, client) for JwtStrategy
 * Pattern: client:{clientId}:user_auth:{userId}
 * Value: JSON string of cached UserWithRoles data
 */
export const UserAuthCacheKeys = {
    /**
     * Get the Redis key for cached user auth data
     */
    auth: (clientId: number, userId: number): string =>
        `clients:${clientId || 0}:user_auth:${userId}`,

    /**
     * Pattern to match all user auth cache keys for a client
     */
    clientPattern: (clientId: number): string =>
        `clients:${clientId || 0}:user_auth:*`,

    /**
     * Pattern to match all user auth cache keys globally
     */
    allPattern: (): string => `clients:*:user_auth:*`,
} as const;