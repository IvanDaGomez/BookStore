import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch related books from a seller.
 * @param {Object} libro - The book object that contains the seller's ID.
 * @returns {Array} - The list of related books.
 */
function useRelatedBooksBySeller(libro, loading) {
  const [librosRelacionadosVendedor, setLibrosRelacionadosVendedor] = useState([]);

  useEffect(() => {
    async function fetchLibroRelacionadoVendedor() {
      const libros = [];
      console.log('Fetching related books for seller:', libro);
      if (libro || !loading) {
        const url = `http://localhost:3030/api/users/${libro.idVendedor}`;
        try {
          const response = await axios.get(url, { withCredentials: true });
          const librosIds = response.data.librosIds;

          // Fetch the books of the user
          const urlLibros = 'http://localhost:3030/api/books/';
          for (let i = 0; i < librosIds.length; i++) {
            const bookResponse = await axios.get(urlLibros + librosIds[i], { withCredentials: true });
            libros.push(bookResponse.data);
          }

          setLibrosRelacionadosVendedor(libros);
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