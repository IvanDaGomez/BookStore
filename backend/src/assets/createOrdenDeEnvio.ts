/* eslint-disable no-unused-vars */

import { ShippingDetailsType } from "../types/shippingDetails"

async function crearOrdenInterrapidisimo (ordenData:{
  remitenteNombre: string
  remitenteDireccion: string
  remitenteCiudad: string
  remitenteTelefono: string
  destinatarioNombre: string
  destinatarioDireccion: string
  destinatarioCiudad: string
  destinatarioTelefono: string
  peso: number
  dimensiones: number[]
  valorDeclarado: number
  tipoEnvio?: string
}) {
  const url = 'https://api.interrapidisimo.com/ordenes' // Reemplazar por URL real.
  const apiKey = 'TU_API_KEY' // Proporcionada por Interrapidísimo.

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      remitente: {
        nombre: ordenData.remitenteNombre,
        direccion: ordenData.remitenteDireccion,
        ciudad: ordenData.remitenteCiudad,
        telefono: ordenData.remitenteTelefono
      },
      destinatario: {
        nombre: ordenData.destinatarioNombre,
        direccion: ordenData.destinatarioDireccion,
        ciudad: ordenData.destinatarioCiudad,
        telefono: ordenData.destinatarioTelefono
      },
      paquete: {
        peso: ordenData.peso,
        dimensiones: ordenData.dimensiones, // [largo, ancho, alto]
        valorDeclarado: ordenData.valorDeclarado
      },
      tipoEnvio: ordenData.tipoEnvio || 'estandar'
    })
  })
  const data = await response.json()
  console.log('Orden creada:', data)
  return data
}

async function CreateOrdenDeEnvíoEnvía (ordenData: ShippingDetailsType): Promise<any> {
  return {}
  const url = 'https://api.envia.com/v1/create-order' // Reemplazar por URL real.
  const apiToken = 'TU_API_TOKEN' // Proporcionado por Envia.

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
  const data = await response.json()
  console.log('Orden creada:', data)
  return data

}

export { CreateOrdenDeEnvíoEnvía as CreateOrdenDeEnvío }
