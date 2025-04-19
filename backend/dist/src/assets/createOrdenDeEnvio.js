/* eslint-disable no-unused-vars */
async function crearOrdenInterrapidisimo(ordenData) {
    const url = 'https://api.interrapidisimo.com/ordenes'; // Reemplazar por URL real.
    const apiKey = 'TU_API_KEY'; // Proporcionada por Interrapidísimo.
    try {
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
        });
        console.log('Orden creada:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error al crear la orden:', error.response?.data || error.message);
        throw error;
    }
}
async function CreateOrdenDeEnvíoEnvía(ordenData) {
    const url = 'https://api.envia.com/v1/create-order'; // Reemplazar por URL real.
    const apiToken = 'TU_API_TOKEN'; // Proporcionado por Envia.
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: ordenData.remitenteNombre,
                    address: ordenData.remitenteDireccion,
                    city: ordenData.remitenteCiudad,
                    phone: ordenData.remitenteTelefono
                },
                receiver: {
                    name: ordenData.destinatarioNombre,
                    address: ordenData.destinatarioDireccion,
                    city: ordenData.destinatarioCiudad,
                    phone: ordenData.destinatarioTelefono
                },
                parcel: {
                    weight: ordenData.peso,
                    dimensions: ordenData.dimensiones, // [largo, ancho, alto]
                    declaredValue: ordenData.valorDeclarado
                },
                shipmentType: ordenData.tipoEnvio || 'standard'
            })
        });
        const data = await response.json();
        console.log('Orden creada:', data);
        return data;
    }
    catch (error) {
        console.error('Error al crear la orden:', error.message);
        throw error;
    }
}
export { CreateOrdenDeEnvíoEnvía as CreateOrdenDeEnvío };
