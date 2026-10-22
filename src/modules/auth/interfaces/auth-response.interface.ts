export interface AuthResponse {
    user: {
        id: number;
        email: string;
        fullName: string;
        status: string;
        phone: string;
        phoneCode: string;
        createdAt: Date;
        updatedAt: Date;
    };
    role: Array<{
        id: number;
        name: string;
        isSub: boolean;
        description: string | null;
        scopeType: string;
        scopeId: number | null;
    }>;
    client: {
        id: number;
        name: string;
        businessName: string;
        type: string;
        isActive: boolean;
        meta?: unknown;
    } | null;
    scope: {
        type: string;
        id: number | null;
    };
    accessToken: string;
    refreshToken: string;
}