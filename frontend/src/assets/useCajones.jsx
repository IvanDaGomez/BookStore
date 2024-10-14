/* eslint-disable react/prop-types */
export default function UseCajones({categoria, index, callback }){

//    const handleCategoriaChange = (categoria, valorSeleccionado) => {
    
    const handleSelectCategoría = (item) => {
        
        callback(categoria, item, index)
    }
    return(<>
    {categoria.map((item, index) => (
        <div className="cajonCategoria" key={index} onClick={()=>handleSelectCategoría(item)}>
          {item}             
        </div>
      ))}
                
    
    </>)

}