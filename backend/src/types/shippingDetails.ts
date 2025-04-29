export type ShippingDetailsType = {
  additional_info: {
    ip_address: string
  }
  address: {
    city: string
    department: string
    neighborhood: string
    street_name: string
    street_number: string
    zip_code: string
  }
  first_name: string
  last_name: string
  phone: {
    area_code: string
    number: string
  }
}