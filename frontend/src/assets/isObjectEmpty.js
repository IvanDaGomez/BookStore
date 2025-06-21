export function isObjectEmpty(obj) {
  if (obj === null || obj === undefined) {
    return true
  }
  if (typeof obj !== 'object') {
    return false
  }
  if (Array.isArray(obj)) {
    return obj.length === 0
  }
  return Object.keys(obj).length == 0
  }