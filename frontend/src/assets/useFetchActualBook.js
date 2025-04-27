import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetchActualBook (bookId, externalSet = null, setActualImage = null) {
  const [libro, setLibro] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!bookId) return; // Ensure bookId is valid before fetching
  
    async function fetchLibro(id) {
      const url = `http://localhost:3030/api/books/${id}`;
      try {
        const response = await axios.get(url, {
          headers: { 'update': id }, 
          withCredentials: true
        });
        const book = response.data || {};
        setLibro(book);
        if (externalSet) {
          externalSet(book);
        }
        if (setActualImage) {
          const imageUrl = book.images && book.images[0] 
            ? `http://localhost:3030/uploads/${book.images[0]}` 
            : '';
          setActualImage(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
        setLibro({});
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  
      fetchLibro(bookId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookId])
    return { libro, loading, error };
  }  