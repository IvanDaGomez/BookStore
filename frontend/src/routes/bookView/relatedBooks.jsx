/* eslint-disable react/prop-types */
import axios from "axios"
import { useEffect, useState } from "react"
import { MakeCard } from "../../assets/makeCard"
import { cambiarEspacioAGuiones } from "../../assets/agregarMas"

export default function RelatedBooks({ libro, user }) {
  const [librosRelacionados, setLibrosRelacionados] = useState([])
  useEffect(() => {
    async function fetchLibroRelacionado () {
      if (libro) {
        // Conseguir los libros del usuario
        const urlLibros = `http://localhost:3030/api/books/query?q=${cambiarEspacioAGuiones(libro.titulo)}&l=12`

        const response = await axios.get(urlLibros, { withCredentials: true })
        if (response.data.error) {
          console.error('Error en el servidor:', response.data.error)
          return
        }
        setLibrosRelacionados(response.data)
      }
    }
    fetchLibroRelacionado()
  }, [libro])
  return(<>
  {(librosRelacionados.filter(element => element.id !== libro.id).length !== 0 && libro)
    && (
      <div className='related'>
        <h1>Productos Relacionados</h1>
        <div className='sectionsContainer'>
          {librosRelacionados.filter(element => element.id !== libro.id)
            .map((element, index) => <MakeCard key={index} element={element} index={index} user={user ?? null} />)}
        </div>
      </div>
      )}
  </>)
}