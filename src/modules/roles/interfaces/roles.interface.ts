export interface Role {
    id: number | null
    name: string | null;
    isGlobal: boolean | null;
    isActive: boolean | null;
    description?: string | null;
}