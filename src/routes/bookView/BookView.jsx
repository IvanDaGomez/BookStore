import { useParams } from "react-router"
import { useState, useEffect, useRef } from "react"
import Header from "../../components/header"
import SideInfo from "../../components/sideInfo"
import Footer from "../../components/footer"

export default function BookView(){
    const { bookId } = useParams()
    const [libro, setLibro] = useState(null) // Initially null, not undefined

    useEffect(()=>{
        async function fetchLibro(id){
            try {
                const response = await fetch(`${window.location.origin}/api/books/${id}`)
                if (response.ok) {
                    const book = await response.json()
                    return book
                } else {
                    console.error('Failed to fetch book:', response.status)
                    return {}
                }
            } catch (error) {
                console.error('Fetch error:', error)
                return {}
            }
        }
        fetchLibro(bookId).then((book) => setLibro(book)) // Handle the promise
    },[bookId])

    useEffect(()=> {
        // Simulated data for the book
        setLibro({
            name: "Harry Potter y la Cámara Secreta",
            brand: "Warner Bros",
            price: 100000,  // en pesos colombianos
            salePrice: 80000,  // en pesos colombianos
            images: ["https://images.cdn3.buscalibre.com/fit-in/360x360/7c/7f/7c7f5d38d2494aa32cec08859e76eadf.jpg", "https://images.cdn3.buscalibre.com/fit-in/360x360/7c/7f/7c7f5d38d2494aa32cec08859e76eadf.jpg"],
            keywords: ["fantasía", "Harry Potter", "J.K. Rowling"],
            id: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14" // generated UUID
        })
    },[])

    const imagesVariable = useRef(null)

    return (
        <>
        <Header />
        <div className="anuncio"></div>
        <div className="libroContenedor">{/*GRID */}
            <div className="imagesContainer">
                <div className="imagesVariable" ref={imagesVariable}>
                    {libro && libro.images && libro.images.map((image, index) => (
                        <div className="imageElement" key={index}>
                            <img loading="lazy" src={image} alt={libro.name} title={libro.name} />
                        </div>
                    ))}
                </div>
                <div className="actualImage">
                    {libro && libro.images && libro.images[0]}
                </div>
            </div>
        </div>
        <div className="comments">

        </div>

        <div className="related">
                
        </div>
        <SideInfo />
        <Footer />
        </>
    )
}
