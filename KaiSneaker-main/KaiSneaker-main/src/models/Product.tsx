import { UUID } from "crypto"
import { Brand } from "./Brand"

export interface Product {
    shoesId: UUID,
    shoesName: string,
    shoesPrice: number,
    shoesDescription: string,
    shoesImg: string[],
    brand: Brand
}