export function changeToArray(element) {
    /*
    Converts a string of text or array into an array
    */
    if (typeof element === 'string' && element.trim() !== '') {
        return element.split(' ').filter(Boolean);
    }
    else if (Array.isArray(element)) {
        return element.filter(Boolean);
    }
    return [];
}
