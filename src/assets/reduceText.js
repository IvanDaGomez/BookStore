export function reduceText(texto, maxTexto){
    if (texto.length <= maxTexto) return texto;
    let recortado = texto.substring(0,maxTexto);
    return texto.substring(0, recortado.lastIndexOf(" "))+ "..."
    
}