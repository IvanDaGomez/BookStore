export default function titleCase (str) {
  if (typeof str !== 'string') {
    return ''
  }
  if (str.split(' ').length === 1) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
