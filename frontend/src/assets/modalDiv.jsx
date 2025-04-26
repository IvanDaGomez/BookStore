// eslint-disable-next-line react/prop-types
export default function ModalDiv ({ icon, content }) {
  return (<>
  <div className="modalDiv" title='Descripción del modo IA'>
    {icon}
            <div className="modal">
              {content}
            </div>
          </div>
  </>)
}