import { ID } from "./objects"

export type WithdrawMoneyType = {
    userId: ID,
    numeroCuenta: number,
    monto: number,
    password: string,
    bank: string
}