import { UUID } from "crypto";

export interface Bill {
    billId: UUID,
    idAccount: UUID,
    imageUser: string,
    fullName: string,
    gender: string,
    status: string,
    totalAmount: number,
    billDate: string,
    billDetail: [{
        quantity: number,
        shoesId: UUID,
        shoesImg: string,
        shoesName: string,
        shoesPrice: number,
        sizeId: UUID,
        sizeVi: string,
        totalPrice: number
    }]
    shoppingInfo: {
        address: string,
        idAccount: UUID,
        shoppingInfoId: UUID,
        shoppingInfoName: string,
        shoppingInfoPhone: string
    }
}