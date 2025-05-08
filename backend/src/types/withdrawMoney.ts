import { ID, ISOString } from './objects'

export type WithdrawMoneyType = {
  id: ID
  user_id: ID
  numero_cuenta: number
  phone_number: number
  monto: number
  fecha: ISOString
  bank: string
  status: 'pending' | 'approved' | 'rejected'
}
