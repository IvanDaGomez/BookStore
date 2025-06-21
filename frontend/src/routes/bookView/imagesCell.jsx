import { useRef, useState } from "react"
import { renderProfilePhoto } from "../../assets/renderProfilePhoto"

/* eslint-disable react/prop-types */
export default function ImagesCell({ libro, setActualImage, actualImage }) {
    const zoomConst = 3 // Aumento del zoom
    const actualImageRef = useRef(null)
    const [isZoomed, setIsZoomed] = useState(false)
    const handleZoom = () => {
      const imagenDentro = actualImageRef.current.querySelector('img')
      if (isZoomed) {
        setIsZoomed(false)
        imagenDentro.style.transform = 'none'
      } else {
        setIsZoomed(true)
        imagenDentro.style.transform = `scale(${zoomConst})`
      }
    }
  
    const moverMouse = (e, amountOfZoom = zoomConst) => {
      if (!isZoomed) return
  
      const rect = actualImageRef.current.getBoundingClientRect()
      const imagenDentro = actualImageRef.current.querySelector('img')
  
      // Obtener el tamaño original y zoomf
      const originalWidth = imagenDentro.offsetWidth
      const originalHeight = imagenDentro.offsetHeight
      const imgWidth = originalWidth * amountOfZoom
      const imgHeight = originalHeight * amountOfZoom
  
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
  
      // Porcentajes relativos al contenedor
      const porcentajeX = x / rect.width
      const porcentajeY = y / rect.height
  
      // Movimiento máximo permitido
      const maxMoveX = Math.max(0, imgWidth - rect.width)
      const maxMoveY = Math.max(0, imgHeight - rect.height)
  
      // Calcular desplazamiento manteniendo la imagen dentro del contenedor
      const moverX = Math.min(Math.max(porcentajeX * maxMoveX, 0), maxMoveX)
      const moverY = Math.min(Math.max(porcentajeY * maxMoveY, 0), maxMoveY)
  
      imagenDentro.style.transformOrigin = `${porcentajeX * 100}% ${porcentajeY * 100}%`
      imagenDentro.style.transform = `scale(${amountOfZoom}) translate(-${moverX / Math.pow(amountOfZoom, 9)}px, -${moverY / Math.pow(amountOfZoom, 9)}px)`
    }
  
  
  return (
    <>
    <div className='imagesContainer'>
          <div className='imagesVariable'>
            {libro.images &&
              libro.images.map((image, index) => (
                <div
                  className='imageElement'
                  key={index}
                  onClick={() => {
                    setActualImage(renderProfilePhoto(image)) // Establecer la URL de la imagen actual
                  }}
                >
                  <img
                    loading='lazy'
                    src={renderProfilePhoto(image)} // Usar la URL completa para mostrar la imagen
                    alt={libro.title}
                    title={libro.title}
                  />
                </div>
              ))}
          </div>

          <div
            className='actualImage'
            ref={actualImageRef}
            style={{ cursor: !isZoomed ? 'zoom-in' : 'zoom-out' }}
          >
            {libro.images && libro.images.length > 0 && (
              <img
                src={renderProfilePhoto(actualImage)}
                alt={libro.titulo}
                title={libro.titulo}
                onMouseMove={moverMouse}
                onClick={handleZoom}
              />
            )}
          </div>
        </div>
    </>
  )
}