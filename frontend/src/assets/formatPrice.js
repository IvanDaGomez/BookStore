export function formatPrice(number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(number);
}