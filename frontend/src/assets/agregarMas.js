// Reemplaza espacios con guiones
function cambiarEspacioAGuiones (input) {
  return input.replace(/\s+/g, '-')
}

// Devuelve guiones a espacios
function cambiarGuionesAEspacio (input) {
  if (input === undefined) return ''
  return input.replace(/-/g, ' ')
}

// Exportar las funciones
export { cambiarEspacioAGuiones, cambiarGuionesAEspacio }
