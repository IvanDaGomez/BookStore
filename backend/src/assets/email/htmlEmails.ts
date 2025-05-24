import dotenv from 'dotenv'

import { BookObjectType } from '../../types/book'
import { UserInfoType } from '../../types/user'
import { TransactionObjectType } from '../../types/transaction'
import { Barcode } from 'mercadopago/dist/clients/payment/commonTypes'
import { ShippingDetailsType } from '../../types/shippingDetails'
import { thankEmailTemplate, bookPublishedTemplate, validationEmailTemplate, changePasswordTemplate, paymentDoneBillTemplate, paymentDoneThankTemplate, bookSoldTemplate, efectyPendingPaymentTemplate, DataType, messageResponseTemplate, messageQuestionTemplate } from './htmlTemplates.js'
dotenv.config()

type emailToSendType =
  | 'thankEmail'
  | 'bookPublished'
  | 'newQuestion'
  | 'validationEmail'
  | 'changePassword'
  | 'paymentDoneBill'
  | 'paymentDoneThank'
  | 'bookSold'
  | 'efectyPendingPayment'
  | 'messageQuestion'
  | 'messageResponse'
function createEmail (
  data: DataType,
  template: emailToSendType
): string {
  switch (template) {
    case 'thankEmail': {
      return thankEmailTemplate(data)
    }
    case 'bookPublished': {
      return bookPublishedTemplate(data)
    }
    case 'validationEmail': {
      return validationEmailTemplate(data)
    }
    case 'changePassword': {
      return changePasswordTemplate(data)
    }
    case 'paymentDoneBill': {
      return paymentDoneBillTemplate(data)
    }
    case 'paymentDoneThank': {
      return paymentDoneThankTemplate(data)
    }
    case 'bookSold': {
      return bookSoldTemplate(data)
    }
    case 'efectyPendingPayment': {
      return efectyPendingPaymentTemplate(data)
    }
    case 'messageQuestion': {
      return messageQuestionTemplate(data)
    }
    case 'messageResponse': {
      return messageResponseTemplate(data)
    }
    default: {
      return ''
    }
  }
}

export { createEmail }
