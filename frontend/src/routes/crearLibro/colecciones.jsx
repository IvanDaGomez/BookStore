/* eslint-disable react/prop-types */
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

export default function Colecciones ({ user, book, setForm, form }) {


    const [collections, setCollections] = useState(user?.colecciones || [])
    const [filteredCollections, setFilteredCollections] = useState(user?.colecciones || [])
    const [confirmarCrear, setConfirmarCrear] = useState(false)
    const [newCollectionName, setNewCollectionName] = useState('')
    const [activeCollection, setActiveCollection] = useState([])
    const filterCollections = (e) => {
        e.preventDefault()
        const text = e.target.value
        const filtered = collections.filter((collection)=> collection.nombre.toLowerCase().includes(text.toLowerCase()))
        setFilteredCollections(filtered)
    }
    
    const crearNuevaColeccion = async (e) => {
        e.preventDefault()
        try {
            if (collections.length && collections.map(c=>c.nombre.toLowerCase()).includes(newCollectionName.toLowerCase())) {
                toast.error('No puedes hacer una colección con el mismo nombre ue otra')
                return
            }
            

            const url = 'http://localhost:3030/api/users/newCollection'
            const body = {
                "collectionName": newCollectionName,
                "userId": user._id
            }
            const response = await axios.post(url, body, { withCredentials: true })
            console.log(response)
            if (response.data) {
                console.log(response.data)
                setFilteredCollections(response.data.data.colecciones)
                setCollections(response.data.data.colecciones)
                toast.success('Se creó exitosamente la colección')
                setNewCollectionName('')
            }
        } catch (err){
                console.error('Error en el servidor:', err)
        }
    }
    const element = useRef(null)
    useEffect(()=>{
        
        if (confirmarCrear && element.current) {
            
            element.current.scrollTop = element.current.scrollHeight;
        }
    },[confirmarCrear, element])
    async function setNewCollection(e) {
        setNewCollectionName(e.target.value)
    }
    return (<>
    <div>
        <h2 style={{margin: 'auto', textAlign: 'center'}}>¿Es este libro parte de una colección?</h2>
        <div className="coleccionesContainer">
            <input type="text" className="conversationsFilter" onChange={filterCollections} placeholder="Buscar"/>
            <div className="colecciones" ref={element}>  
                {filteredCollections && filteredCollections.length !== 0 && filteredCollections.map((coleccion, index)=> (
                    <div className="coleccionElemento" 
                    style={{background: (activeCollection.length && activeCollection.map((c)=> c.nombre).includes(coleccion.nombre)) ? 'var(--using4)': ''}}
                    key={index} 
                    onClick={()=> {
                        if (activeCollection.includes(coleccion)) {
                            setActiveCollection(activeCollection.filter((collection)=>collection.nombre !== coleccion.nombre))
                        } else {
                            setActiveCollection([...activeCollection, coleccion])
                        }
                        
                        }}>
                        {coleccion.nombre}
                    </div>
                ))}
                {confirmarCrear && 
                  <div className="coleccionElemento" ><input type="text" 
                  value={newCollectionName}
                  onChange={setNewCollection}
                  onKeyDown={async (e)=>{
                    if (e.key === 'Enter') {
                        await crearNuevaColeccion(e)
                        setConfirmarCrear(false)
                        
                    }
                  }}placeholder="Nombre de la colección" /> <button onClick={crearNuevaColeccion}>Crear</button> </div>
                }
            </div>
            <div className="crearNuevaColeccion" onClick={()=> setConfirmarCrear(!confirmarCrear)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
        <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 8V16M16 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg> Nueva Colección
            </div>
        </div>
    </div>
    </>)
}