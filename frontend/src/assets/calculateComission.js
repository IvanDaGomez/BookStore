export function calculateComission (price) {
  return Math.ceil(price * 0.0799 + 3999)
}
//7.99% + $3.999