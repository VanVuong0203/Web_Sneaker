import { UUID } from "crypto";

export interface User {
    idAccount: UUID,
    username: string,
    password: string,
    fullName: string,
    gender: string,
    cccd: string,
    email: string,
    numberPhone: string,
    dateOfBirth: string,
    imageUser: string,
    role: {
        idRole: UUID,
        roleName: string,
    }
}