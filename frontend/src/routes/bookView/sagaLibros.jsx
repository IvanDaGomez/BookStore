/* eslint-disable react/prop-types */

import { MakeCard } from "../../assets/makeCard";
import useFetchSaga from "./useFetchSaga";

export default function SagaLibros({ libro, user }) {
  const [sagaLibros, nombreSaga, sagaId] = useFetchSaga(libro)
  return(<>
  {(sagaLibros && sagaLibros.length !== 0) && <div className='related sagaContainer'>
    <h1>Este libro es parte de la colección 
      &quot;<a 
      className="link"
      href={`/colecciones/${sagaId}`}>{nombreSaga}</a>&quot;</h1>
    <div className='sectionsContainer'>
      {sagaLibros.filter(element => element.id !== libro.id)
        .map((element, index) => (
        user ?
        <MakeCard key={index} element={element} index={index} user={user} />
        :
        <MakeCard key={index} element={element} index={index} />
        )
      )}
    </div>
  </div> }
  </>)
}