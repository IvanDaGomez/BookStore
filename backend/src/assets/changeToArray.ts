export function changeToArray (element: string | string[]): string[] {
  /*
  Converts a string of text or array into an array
  */
  if (typeof element === 'string' && element.trim() !== '') {
    return element.split(' ').filter(Boolean)
  }
  else if (Array.isArray(element)) {
    return element.filter(Boolean)
  }
  return []
}
 