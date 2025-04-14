type ID = `${string}-${string}-${string}-${string}-${string}`;
type ImageType = `${string}${'.png' | '.webp'}`;
type ISOString = `${number}-${number}-${number}T${number}:${number}:${number}${'Z' | '+' | '-'}`;
const date = new Date().toISOString();
export {
    ID,
    ISOString,
    ImageType
}