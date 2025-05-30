import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../assets/config';

/**
 * Custom hook to fetch related books from a seller.
 * @param {Object} libro - The book object that contains the seller's ID.
 * @returns {Array} - The list of related books.
 */
function useRelatedBooksBySeller(libro, loading) {
  const [librosRelacionadosVendedor, setLibrosRelacionadosVendedor] = useState([]);

  useEffect(() => {
    async function fetchLibroRelacionadoVendedor() {
      if (libro || !loading) {
        const url = `${BACKEND_URL}/api/users/${libro.id_vendedor}`;
        try {
          const response = await axios.get(url, { withCredentials: true });
          const librosIds = response.data.libros_ids;
          // Fetch the books of the user
          const urlLibros = `${BACKEND_URL}/api/books/idList/${librosIds.join(',')}`;
          const bookResponse = await axios.get(urlLibros, { withCredentials: true });


          setLibrosRelacionadosVendedor(bookResponse.data);
        } catch (error) {
          console.error("Error fetching related books:", error);
        }
      }
    }

    fetchLibroRelacionadoVendedor();
  }, [libro, loading]);

  return librosRelacionadosVendedor;
}

export default useRelatedBooksBySeller;