import { ID } from "./objects"

export type WithdrawMoneyType = {
    userId: ID,
    numeroCuenta: number,
    phoneNumber: number,
    monto: number,
    password: string,
    bank: string,
    status: 'pending' | 'approved' | 'rejected',
}