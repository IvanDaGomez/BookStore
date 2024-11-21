import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'
import { createNotification } from "../../assets/createNotification";
export default function ProtectedReviewBook(){

    const [user, setUser] = useState(null)

    // Fetch del usuario primero que todo
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:3030/api/users/userSession', {
                    method: 'POST',
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.user.rol === 'admin') {
                        setUser(data.user);
                        return
                    }
                } 
                console.log(response)
                // si llega aqui es por que algo no está bien
                //window.location.href = '/';
            } catch (error) {
                console.error('Error fetching user data:', error);
                window.location.href = '/popUp/noUser';
            }
        }
        fetchUser();
    }, []);

    const [books, setBooks] = useState(null)
    const [currentBook, setCurrentBook] = useState(null) 
    const [actualImage, setActualImage] = useState(null)
    useEffect(()=>{
        async function fetchBackStageBooks() {
            if (!user) return
            const url = 'http://localhost:3030/api/books/review'
            const response = await fetch(url)
            if (!response.ok) {
                console.error('Error mostrando los libros')
                return
            }
            const data = await response.json()
            if (data.error) {
                console.error(data.error)
                return
            }
            setBooks(data)
            setCurrentBook(data[0])
            setActualImage(data[0].images[0])
        }
        fetchBackStageBooks()
    },[user])
    async function removeBookFromBackStage(bookId) {
        if (!bookId) return;
        // Add book to the system
        const url = `http://localhost:3030/api/books/review/${bookId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch((error) => {
            console.error('Error aprobando el currentBook:', error);
        });
        if (!response.ok) {
            console.log('Error en la respuesta')
            return
        }
        toast.success('currentBook eliminado')
    }
    async function handleAccept(book) {
        if (!book) return;
        // Add book to the system
        const url = book.method === 'PUT' ? `http://localhost:3030/api/books/${book._id}` :`http://localhost:3030/api/books`;
        const body = {
            ...book,
            oferta: book.oferta !== null ? book.oferta: 0
        }
        
        const response = await fetch(url, {
            method: (book.method === 'PUT') ? 'PUT': 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), // Aquí puedes incluir cualquier dato adicional necesario
        })
        if (!response.ok) {
            console.log('Error aceptando')
            return
        }
        removeBookFromBackStage(book._id)
        const notificationToSend = {
            title: (book.method === 'PUT') ? 'Tu libro ha sido actualizado con éxito':
            'Tu libro ha sido publicado con éxito',
            priority: 'normal',
            type: (book.method === 'PUT') ? 'bookUpdated' :'bookPublished',
            userId: book.idVendedor,
            actionUrl: window.location.origin + `/libros/${book._id}`,
            metadata: {
                photo: book.images[0],
                bookTitle: book.titulo,
                bookId: book._id
            }
        }
        createNotification(notificationToSend)
        moveToNextBook()
    }
    
    function handleReject(book) {
        if (!book) return;
        removeBookFromBackStage(book._id)
        const notificationToSend = {
            title: 'Tu libro ha sido rechazado',
            priority: 'normal',
            input: document.querySelector('.reason').value,
            type: 'bookRejected',
            userId: book.idVendedor,
            actionUrl: window.location.origin + `/libros/${book._id}`,
            metadata: {
                photo: book.images[0],
                bookTitle: book.titulo,
                bookId: book._id
            }
        }
        createNotification(notificationToSend)
        moveToNextBook()
    }
    
    function moveToNextBook() {
        const nextIndex = books.indexOf(currentBook) + 1;
    
        if (nextIndex < books.length) {
            setCurrentBook(books[nextIndex]);
            setActualImage(books[nextIndex].images?.[0] || null);
        } else {
            setCurrentBook(null);
            setBooks([]);
        }
    }
    
    
    return(<>
    <Link to='/'><button>Volver a inicio</button></Link>
        {console.log(currentBook)}
    <h1>Libros a revisar: {books && books.length}</h1>
    {books && (books.length > 0) && currentBook ? (
                <div className="book-review">
                    <h2>{currentBook.titulo}</h2>
{currentBook && [
                        currentBook.autor && `Autor: ${currentBook.autor}`,
                        currentBook.genero && `Género: ${currentBook.genero}`,
                        currentBook.estado && `Estado: ${currentBook.estado}`,
                        currentBook.edicion && `Edición: ${currentBook.edicion}`,
                        currentBook.tapa && `Tapa: ${currentBook.tapa}`,
                        currentBook.idioma && `Idioma: ${currentBook.idioma}`,
                        currentBook.ubicacion && `Ubicación: ${currentBook.ubicacion}`,
                        currentBook.fechaPublicacion && `Publicado: ${new Date(currentBook.fechaPublicacion)
                        .toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}`,
                        currentBook.edad && `Edad recomendada: ${currentBook.edad}`,
                    ]
                        .filter(Boolean)
                        .map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}
                        <div className="keywordWrapper" style={{margin:"5px auto", width:'auto'}}>
                    Palabras clave: {currentBook.keywords.map((keyword, index)=>(
                        <div className="keyword" key={index}>
                            {keyword}
                        </div>
                    ))}
                    </div>
                    <div className="imageWrapper">
                    <img
                        src={`http://localhost:3030/uploads/${actualImage && actualImage || "default.png"}`}
                        alt="Portada del currentBook"   
                    />
                    {(currentBook.images.length > 1) && 
                    <>
                    <div className="beforeButton">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#ffffff"} fill={"none"}>
    <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
                    </div>
                    
                    <div className="afterButton">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#fff"} fill={"none"}>
    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
                    </div>
                    </>}
                    </div>
                    <div className="actions">
                        <button style={{background: 'red'}} onClick={() => handleReject(currentBook)}>
                            Rechazar
                        </button>
                        <button onClick={() => handleAccept(currentBook)}>
                            Aprobar
                        </button>
                                                
                    </div>
                    
                    <input type="text" className="reason" placeholder="Razón de rechazo"/>
                </div>
            ) : (
                <p>{books && books.length === 0 ? "No hay más libros para revisar." : "Cargando libros..."}</p>
            )}
    </>)
}