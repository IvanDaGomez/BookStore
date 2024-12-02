import { useEffect, useState } from "react"
import { MakeCard } from "../assets/makeCard";
import { cambiarEspacioAGuiones } from "../assets/agregarMas";
import axios from "axios";

// eslint-disable-next-line react/prop-types
export default function Sections({ filter, backgroundColor }){
    
    /*const [elementSections, setElementSections] = useState()
    useEffect(() => {
        async function fetchData(){
            //www.domainetc/api/filter
            const domainName = "https://localhost:3030"
            const data = await fetch(`${domainName} + /api/filter?filter=${filter}&limit=4`)
            setElementSections(data)
        }
        fetchData()
    }, [filter])*/
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchUser() {
            try {
                const url = 'http://localhost:3030/api/users/userSession'
                const response = await axios.post(url, null, {
                    withCredentials: true
                })
                
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser(); // Llama a la función para obtener el usuario
    }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente


    const [libros, setLibros] = useState([])
    useEffect(()=>{
        const fetchResults = async () => {
            try {
                const url = `http://localhost:3030/api/books/query?q=${cambiarEspacioAGuiones(filter)}&l=6`
                const response = await axios.get(url, { withCredentials: true });
                setLibros(response.data)
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
    
        fetchResults()
        
    },[filter])
    


    return(  <>
        <div style={{backgroundColor: {backgroundColor}, width:"auto", height:"auto"}}>


        <h1 style={{margin:"0 40px", textAlign:"left"}}>{filter}</h1>
        <div className="sectionsContainer">
            
            {libros.slice(0,6).map((element, index) => (
                user ? <MakeCard key={index} element={element} index={index} user={user}/>: 
                <MakeCard key={index} element={element} index={index}/>
            )  
            )}
        </div>
        </div>
        </>)
}