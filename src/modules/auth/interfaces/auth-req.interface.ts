// ────────────────────────────────────────────────────────────────────
// Authenticated Request Typing
// ────────────────────────────────────────────────────────────────────

export interface AuthenticatedUser {
    id: number;
    clientId?: number;
}

export interface AuthenticatedRequest {
    user: AuthenticatedUser;
}