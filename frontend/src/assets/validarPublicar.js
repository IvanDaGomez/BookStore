const validarPublicar1 = ({ titulo = '', descripcion = '', archivos = [] } = {}) => {
  let errors = [];

  // Validación de archivos (campo requerido, menos de 10 archivos y solo imágenes)
  if (archivos.length === 0) {
    errors.push("Debes subir al menos una imagen.");
  } else {
    archivos.forEach((archivo, index) => {
      // Ahora archivo tiene una estructura {url, type}
      if (archivo.type) {
        if (!archivo.type.startsWith('image/')) {
          errors.push(`El archivo ${index + 1} no es una imagen válida.`);
        }
      } else {
        errors.push(`El archivo ${index + 1} no tiene un tipo válido.`);
      }
    });

    if (archivos.length > 10) {
      errors.push("No puedes subir más de 10 imágenes.");
    }
  }

  // Validación de título (campo requerido)
  if (!titulo || typeof titulo !== 'string') {
    errors.push("El título es requerido");
  }

  // Validación de descripción (campo requerido y longitud mínima)
  if (!descripcion || typeof descripcion !== 'string' || descripcion.length < 10) {
    errors.push("La descripción es requerida y debe tener al menos 10 caracteres.");
  }

  return errors;
};

const validarPublicar3 = ({ precio = '', keywords = [], autor = '', oferta = '' } = {}) => {
  let errors = [];

    // Validación de descripción (campo requerido y longitud mínima)
  if (!autor || typeof autor !== 'string') {
    errors.push("El autor es requerido");
  }


  if(keywords.length !== 0){
    keywords.forEach((keyword)=>{
      if (typeof keyword !== 'string'){
        errors.push(`La palabra "${keyword}" debe ser cadena de texto `)
      }
      if (keyword.length > 20){
        errors.push(`Cada palabra clave no puede tener más de 20 caracteres`)
      }
    })
  }
  // Validación de precio (campo requerido)
  
  if (!precio) {

    errors.push("El precio es requerido");
    
  }
  if (precio <= 999){
    errors.push("Introduce un precio válido");
  }
  
    // Validación de precio (campo requerido)
  if (oferta >= precio) {
    errors.push("El precio de oferta debe ser menor al precio original");
  }
  return errors;
};
export { validarPublicar1, validarPublicar3 }