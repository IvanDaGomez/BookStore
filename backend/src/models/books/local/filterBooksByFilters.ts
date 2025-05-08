import { BookObjectType } from '../../../types/book'
import { getBookKeyInfo } from './getBookKeyInfo.js'

export function filterBooksByFilters (
  books: BookObjectType[],
  preparedFilters: any
): BookObjectType[] {
  return books.filter(book => {
    const bookKeyInfo = getBookKeyInfo(book)
    const filterKeys = Object.keys(preparedFilters)
    return filterKeys.every((filterKey: string) => {
      if (filterKey === 'min_precio' || filterKey === 'max_precio') {
        const price = book.precio as number
        const minPrecio = preparedFilters['min_precio'] as number | undefined
        const maxPrecio = preparedFilters['max_precio'] as number | undefined
        if (
          (minPrecio !== undefined && price < minPrecio) ||
          (maxPrecio !== undefined && price > maxPrecio)
        ) {
          return false
        }
      } else if (filterKey === 'ciudad' || filterKey === 'departamento') {
        const location = book.ubicacion?.[filterKey] ?? ''
        const filterValues = preparedFilters[filterKey] as string[] | undefined
        if (filterValues && !filterValues.includes(location)) {
          return false
        }
      } else {
        const filterValues = preparedFilters[filterKey] as string[] | undefined
        if (
          filterValues &&
          !bookKeyInfo.some(key =>
            filterValues.some(
              (value: string) => key.toLowerCase() === value.toLowerCase()
            )
          )
        ) {
          return false
        }
      }
      return true
    })
  })
}
