import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFetchLibro(bookId) {
  const [libro, setLibro] = useState({});
  const [actualImage, setActualImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLibro(id) {
      const url = `http://localhost:3030/api/books/${id}`;
      try {
        const response = await axios.get(url, { withCredentials: true });
        const book = response.data;
        setLibro(book || {}); // Asegurar que el libro existe o dejar vacío
        const imageUrl = book.images?.[0]
          ? `http://localhost:3030/uploads/${book.images[0]}` // Ruta completa hacia las imágenes
          : '';
        setActualImage(imageUrl);
      } catch (err) {
        setLibro({});
        setError(err); // Guardar el error en caso de fallo
        console.error('Error fetching book data:', err);
      } finally {
        setLoading(false); // Marcar que la carga ha finalizado
      }
    }

    if (bookId) {
      fetchLibro(bookId);
    }
  }, [bookId]);

  return { libro, actualImage, loading, error };
}