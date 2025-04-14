function prepareCreateBookData (data, req) {
  if (data.oferta) data.oferta = parseInt(data.oferta)
  data.precio = parseInt(data.precio)
  if (data.keywords && typeof data.keywords === 'string') {
    data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
  } else {
    data.keywords = []
  }

  if (req.files) data.images = req.files.map(file => `${file.filename}`)
  return data
}

function prepareUpdateBookData (data, req, existingBook) {
  if (data.oferta) data.oferta = parseInt(data.oferta)
  if (data.precio) data.precio = parseInt(data.precio)

  if (data.keywords && typeof data.keywords === 'string') {
    data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
  }

  if (req.files) {
    data.images = req.files.map(file => `${file.filename}`)
  }
  if (data.mensaje && data.tipo) {
    const messagesArray = existingBook.mensajes || []
    if (data.tipo === 'pregunta') {
      const questionIndex = messagesArray.findIndex(item => item[0] === data.mensaje)

      if (questionIndex === -1) {
        messagesArray.push([data.mensaje, '', data.senderId])
      }
    } else if (data.tipo === 'respuesta' && data.pregunta) {
      const questionIndex = messagesArray.findIndex(
        item => item[0] === data.pregunta
      )
      if (questionIndex !== -1) {
        messagesArray[questionIndex][1] = data.mensaje
      }
    }

    data.mensajes = messagesArray
  }
  return data
}

function filterData (data) {
  const allowedFields = [
    'titulo', 'autor', 'precio', 'oferta', 'formato', 'images', 'keywords', 'descripcion',
    'estado', 'genero', 'vendedor', 'idVendedor', 'edicion', 'idioma',
    'ubicacion', 'tapa', 'edad', 'fechaPublicacion', 'actualizadoEn', 'disponibilidad', 'mensajes', 'isbn'
  ]

  const filteredData = {}
  Object.keys(data).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredData[key] = data[key]
    }
  })
}
export {
  prepareCreateBookData,
  prepareUpdateBookData,
  filterData
}
