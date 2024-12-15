export function average (array) {
  let sum = 0

  for (const element of array) {
    sum = sum + element
  }
  const average = sum / array.length
  // Promedio
  return Math.round(average) * 1000
}
