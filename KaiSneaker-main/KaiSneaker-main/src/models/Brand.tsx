import { UUID } from "crypto";

export interface Brand {
    idBrand: UUID,
    brandName: string,
    descriptionBrand: string,
    imageBrand: string
}
