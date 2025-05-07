import { ID, ISOString } from "./objects"

export type WithdrawMoneyType = {
    id: ID,
    userId: ID,
    numeroCuenta: number,
    phoneNumber: number,
    monto: number,
    fecha: ISOString,
    bank: string,
    status: 'pending' | 'approved' | 'rejected',
}