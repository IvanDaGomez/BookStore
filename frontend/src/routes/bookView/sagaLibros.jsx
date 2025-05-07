/* eslint-disable react/prop-types */
import { MakeCard } from "../../assets/makeCard";
import useFetchSaga from "./useFetchSaga";

export default function SagaLibros({ libro, user }) {
  const [sagaLibros, nombreSaga] = useFetchSaga(libro)
  return(<>
  {sagaLibros && sagaLibros.length !== 0 && <div className='related'>
                <h1>Este libro es parte de la colección &quot;{nombreSaga}&quot;</h1>
                <div className='leftScrollContainer'>
                  {sagaLibros.filter(element => element.id !== libro.id)
                    .map((element, index) => <MakeCard key={index} element={element} index={index} user={user ?? ''} />)}
                </div>
              </div> }
  </>)
}