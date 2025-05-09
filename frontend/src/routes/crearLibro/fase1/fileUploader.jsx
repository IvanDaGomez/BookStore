/* eslint-disable react/prop-types */
import { toast } from "react-toastify"
import { predictInfo } from "../predictTitleAndDescription"
import { cropImageToAspectRatio } from "../../../assets/cropImageToAspectRatio"
import { useState } from "react"

export default function FileUploader ({
  croppedImages,
  setCroppedImages,
  setAdditionalInfo
}) {
  const [selectedFiles, setSelectedFiles] = useState([])
  
  const handleDeleteImage = (index) => {
    // Filtra los archivos y las imágenes recortadas por índice
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setCroppedImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }
  // ---------------------------------Cuando se ingresa archivos
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    const croppedFiles = await Promise.all(files.map(async (file) => {
      const croppedURL = await cropImageToAspectRatio(file, 2 / 3)
      return { url: croppedURL, type: file.type } // Guardar URL y tipo de archivo
    }))

    if (selectedFiles.length + files.length > 5) {
      toast.error('No puedes subir más de 5 fotos.')
      return
    }
    if (croppedImages.length === 0) {
      const predictedInfo = await predictInfo(files[0])
      setAdditionalInfo(predictedInfo)
    }
    
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]) // Añadir archivos originales
    setCroppedImages((prevImages) => [...prevImages, ...croppedFiles]) // Añadir imágenes recortadas con su tipo
  }
  // This is for updating the info of the title, and author

  const handleDrop = async (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const croppedFiles = await Promise.all(files.map((file) => cropImageToAspectRatio(file, 2 / 3)))

    if (selectedFiles.length + files.length > 5) {
      toast.error('No puedes subir más de 5 fotos.')
      return
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]) // Añadir archivos nuevos
    setCroppedImages((prevImages) => [...prevImages, ...croppedFiles]) // Añadir imágenes recortadas
  }

    // Solo previene el comportamiento predeterminado en onDragOver
  const handleDragOver = (e) => {
      e.preventDefault()
    }
  return (<>
  <div className='fileUploaderContainer'>

<input
  type='file'
  id='fileInput'
  multiple
  accept='image/*'
  name='archivos'
  onChange={handleFileChange}
  style={{ display: 'none' }}
/>
{selectedFiles.length === 0
  ? (
    <>
      <div
        className='fileDropZone'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label htmlFor='fileInput' className='fileButton'>

          <div className='iconContainer'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={40} height={40} color='#000000' fill='none'>
              <path d='M7.00018 6.00055C5.77954 6.00421 5.10401 6.03341 4.54891 6.2664C3.77138 6.59275 3.13819 7.19558 2.76829 7.96165C2.46636 8.58693 2.41696 9.38805 2.31814 10.9903L2.1633 13.501C1.91757 17.4854 1.7947 19.4776 2.96387 20.7388C4.13303 22 6.10271 22 10.0421 22H13.9583C17.8977 22 19.8673 22 21.0365 20.7388C22.2057 19.4776 22.0828 17.4854 21.8371 13.501L21.6822 10.9903C21.5834 9.38805 21.534 8.58693 21.2321 7.96165C20.8622 7.19558 20.229 6.59275 19.4515 6.2664C18.8964 6.03341 18.2208 6.00421 17.0002 6.00055' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
              <path d='M17 7L16.1142 4.78543C15.732 3.82996 15.3994 2.7461 14.4166 2.25955C13.8924 2 13.2616 2 12 2C10.7384 2 10.1076 2 9.58335 2.25955C8.6006 2.7461 8.26801 3.82996 7.88583 4.78543L7 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M15.5 14C15.5 15.933 13.933 17.5 12 17.5C10.067 17.5 8.5 15.933 8.5 14C8.5 12.067 10.067 10.5 12 10.5C13.933 10.5 15.5 12.067 15.5 14Z' stroke='currentColor' strokeWidth='1.5' />
              <path d='M11.9998 6H12.0088' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </div>
          <button
            className='selectButton'
            type='button'
            onClick={() => document.getElementById('fileInput').click()}
          >
            Seleccionar fotos
          </button>
          <p>Puedes seleccionar todas las fotos de una vez o arrastrarlas aquí</p>
          <p className='limit'>(Hasta 5 fotos)</p>

        </label>
      </div>

      <div className='fileError'>
        {selectedFiles.length === 0 && <><p>Debes subir mínimo una foto.</p><p>Recuerda publicar fotos reales.</p></>}
      </div>
    </>
    )
  : (
    <>
      <div className='fileUploaded'>
        {croppedImages.map((src, index) => (
          <div key={index}>
            <div className='delete' onClick={() => handleDeleteImage(index)}>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'>
                <path d='M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                <path d='M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                <path d='M9.5 16.5L9.5 10.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                <path d='M14.5 16.5L14.5 10.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
            </div>
            <img src={(src.url) ? src.url : src} alt={`Cropped Preview ${index}`} />
          </div>
        ))}
        {croppedImages.length !== 5 && <div onClick={() => document.getElementById('fileInput').click()}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'>
            <path d='M12 8V16M16 12L8 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z' stroke='currentColor' strokeWidth='1.5' />
          </svg>
        </div>}
      </div>
    </>
    )}
</div>
  </>)
}