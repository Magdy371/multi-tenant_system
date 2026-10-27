import { SetMetadata } from "@nestjs/common";
export const IS_OWNER_KEY = "isOwner";

/**
 * Decorator to check if the user is the owner of a resource
 * @param paramName - The parameter name that contains the resource ID to check ownership
 * @example @IsOwner('id') // Checks if user owns the resource with ID from route param 'id'
 * @example @IsOwner('userId') // Checks if user owns the resource with ID from route param 'userId'
 */

export const IsOwner = (paramName: string) =>
    SetMetadata(IS_OWNER_KEY, paramName);