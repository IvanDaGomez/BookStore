// Reemplaza espacios con guiones
function cambiarEspacioAGuiones(input: string | undefined): string {
  if (input === undefined) return ''
  return input.replace(/\s+/g, '-')
}

// Devuelve guiones a espacios
function cambiarGuionesAEspacio (input: string | undefined): string {
  if (input === undefined) return ''
  return input.replace(/-/g, ' ')
}

// Exportar las funciones
export { cambiarEspacioAGuiones, cambiarGuionesAEspacio }
