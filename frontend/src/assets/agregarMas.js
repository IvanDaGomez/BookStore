// Reemplaza espacios con guiones
function cambiarEspacioAGuiones(input) {
    return input.replace(/\s+/g, '-');
}

// Devuelve guiones a espacios
function cambiarGuionesAEspacio(input) {
    return input.replace(/-/g, ' ');
}

// Exportar las funciones
export { cambiarEspacioAGuiones, cambiarGuionesAEspacio };