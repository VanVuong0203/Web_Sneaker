import { UUID } from "crypto";

export interface ShippingInfo {
    shoppingInfoId: UUID;
    shoppingInfoName: string;
    shoppingInfoPhone: string;
    address: string;
    idAccount: UUID;
}