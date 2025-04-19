export const randomIntArrayInRange = (min, max, l = 1) => {
    l = Math.min(l, max - min + 1);
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < l) {
        uniqueNumbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return [...uniqueNumbers];
};
