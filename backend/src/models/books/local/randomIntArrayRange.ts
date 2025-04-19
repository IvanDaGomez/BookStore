export const randomIntArrayInRange = (min: number, max: number, l: number = 1): number[]=> {
  l = Math.min(l, max - min + 1)
  const uniqueNumbers: Set<number> = new Set()

  while (uniqueNumbers.size < l) {
    uniqueNumbers.add(Math.floor(Math.random() * (max - min + 1)) + min)
  }

  return [...uniqueNumbers]
}
