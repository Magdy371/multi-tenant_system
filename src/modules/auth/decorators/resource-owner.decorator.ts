import { SetMetadata } from "@nestjs/common";
import { resources } from "../../../common/database/schema_enums"

export interface ownerConfig {
    resourceType: resources,
    paramName: string, // The route parameter name (e.g., 'id', 'orderId')
    ownerField?: string, //  ownerField?: string; // The field to check ownership (default: 'customerId' for orders)
}
export const RESOURCE_OWNER_KEY = "resourceOwner";
export const resourceOwner = (ownerConfig) => SetMetadata(RESOURCE_OWNER_KEY, ownerConfig);