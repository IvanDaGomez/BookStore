/* eslint-disable react/prop-types */
export default function CustomDesigns ({ plantillas }) {
  return (
    <>
      <div className='customDesignsContainer'>
        {plantillas.map((plantilla, index) => (
          <div key={index}>
            <img src={plantilla.photo} alt={plantilla.alt} />
          </div>
        ))}
      </div>
    </>
  )
}
