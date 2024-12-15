const validarPublicar1 = ({ titulo = '', autor = '', descripcion = '', ISBN = '',  images = [] } = {}) => {
  let errors = [];

  // Validación de archivos (campo requerido, menos de 10 archivos y solo imágenes)
  if (images.length === 0) {
    errors.push("Debes subir al menos una imagen.");
  } else {
    images.forEach((archivo, index) => {
      // Ahora archivo tiene una estructura {url, type}
      if (archivo.type) {
        if (!archivo.type.startsWith('image/')) {
          errors.push(`El archivo ${index + 1} no es una imagen válida.`);
        }
      } else {
        errors.push(`El archivo ${index + 1} no tiene un tipo válido.`);
      }
    });

    if (images.length > 10) {
      errors.push("No puedes subir más de 10 imágenes.");
    }
  }

  // Validación de título (campo requerido)
  if (!titulo || typeof titulo !== 'string') {
    errors.push("El título es requerido");
  }

  // Validación de descripción (campo requerido y longitud mínima)
  if (!autor || typeof autor !== 'string') {
    errors.push("El autor es requerido");
  }
  // Validación de descripción (campo requerido y longitud mínima)
  if (!descripcion || typeof descripcion !== 'string' || descripcion.length < 10) {
    errors.push("La descripción es requerida y debe tener al menos 10 caracteres.");
  }
  if (descripcion === 'Creando descripción...') {
    errors.push("Espera a que se genere la descripción")
  }

    // Validación de ISBN
    if (!ISBN || typeof ISBN !== 'string') {
      errors.push("El ISBN es requerido y debe ser un texto.");
    } else if (!esISBNValido(ISBN)) {
      errors.push("El ISBN proporcionado no es válido.");
    }
  return errors;
};

const validarPublicar3 = ({ precio = '', keywords = [], oferta = '' } = {}) => {
  let errors = [];




  if(keywords.length !== 0){
    keywords.forEach((keyword)=>{
      if (typeof keyword !== 'string'){
        errors.push(`La palabra "${keyword}" debe ser cadena de texto `)
      }
      if (keyword.length > 30){
        errors.push(`Cada palabra clave no puede tener más de 30 caracteres`)
      }
    })
  }
  // Validación de precio (campo requerido)
  
  if (!precio) {

    errors.push("El precio es requerido");
    
  }
  if (precio <= 20000){
    errors.push("El precio debe ser mayor a 20000 pesos");
  }
  if (oferta !== 0 && oferta <= 20000) {
    errors.push('El precio de oferta debe ser mayor a 20000 pesos')
  }
    // Validación de precio (campo requerido)
  if (oferta >= precio) {
    errors.push("El precio de oferta debe ser menor al precio original");
  }
  return errors;
};

function validarActualizarUsuario({ nombre, bio, correo, anteriorContraseña, nuevaContraseña }) {
  const errores = [];

  // Validate 'nombre' (optional, but with a length check)
  if (nombre && nombre.length < 3) {
      errores.push("El nombre debe tener al menos 3 caracteres.");
  }

  // Validate 'bio' (optional, max length check)
  if (bio && bio.length > 250) {
      errores.push("La bio no puede exceder 250 caracteres.");
  }

  // Validate 'correo' (optional, but must be valid if provided)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo && !emailRegex.test(correo)) {
      errores.push("El correo no es válido.");
  }

  // Validate 'anteriorContraseña' and 'nuevaContraseña'
  if ((anteriorContraseña && !nuevaContraseña) || (!anteriorContraseña && nuevaContraseña)) {
      errores.push("Debe proporcionar tanto la contraseña anterior como la nueva.");
  } else if (nuevaContraseña && nuevaContraseña.length < 8) {
      errores.push("La nueva contraseña debe tener al menos 8 caracteres.");
  }

  // Return errors (if any), or null if no errors
  return errores.length > 0 ? errores : null;
}
// Función para validar ISBN
const esISBNValido = (ISBN) => {
  const limpio = ISBN.replace(/-/g, ''); // Quitar guiones
  if (limpio.length === 10) {
    return validarISBN10(limpio);
  } else if (limpio.length === 13) {
    return validarISBN13(limpio);
  }
  return false;
};

// Validación para ISBN-10
const validarISBN10 = (isbn) => {
  if (!/^\d{9}[\dX]$/.test(isbn)) return false; // 9 dígitos y un dígito de control
  const suma = isbn.split('').reduce((acc, char, index) => {
    const valor = char === 'X' ? 10 : parseInt(char, 10);
    return acc + valor * (10 - index);
  }, 0);
  return suma % 11 === 0;
};

// Validación para ISBN-13
const validarISBN13 = (isbn) => {
  if (!/^\d{13}$/.test(isbn)) return false; // 13 dígitos
  const suma = isbn.split('').reduce((acc, char, index) => {
    const valor = parseInt(char, 10);
    return acc + (index % 2 === 0 ? valor : valor * 3);
  }, 0);
  return suma % 10 === 0;
};
export { validarPublicar1, validarPublicar3, validarActualizarUsuario }