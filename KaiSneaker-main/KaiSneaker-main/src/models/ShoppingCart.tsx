import { UUID } from "crypto"
import { Size } from "./Size";

export interface ShoppingCart {
    idAccount: UUID;
    idCartItem: UUID;
    product: {
        shoesId: UUID,
        shoesName: string,
        shoesPrice: number,
        shoesDescription: string,
        shoesImg: string,
        brandName: string;
    };
    quantity: number;
    size: Size;

}