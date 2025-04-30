export function formatPrice(number) {
  if (number === undefined || number === null) {
    return ''
  }
  if (typeof number !== 'number') {
    number = parseInt(number, 10)
  }
  // Convertir a número y formatear con puntos después de cada tres dígitos
  const formattedValue = new Intl.NumberFormat('es-CO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);

  return '$ ' + formattedValue + ' COP'; // Actualizar con el símbolo de $
}