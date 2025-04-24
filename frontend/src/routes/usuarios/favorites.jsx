/* eslint-disable react/prop-types */

import { MakeCard } from '../../assets/makeCard'

import { useFetchFavoriteBooks } from './useFetchFavoriteBooks'
export default function Favorites ({ vendedor, user }) {

  const librosFavoritos = useFetchFavoriteBooks(vendedor)

  return (
    <>
      {librosFavoritos.length !== 0 ? librosFavoritos
        .map((libro, index) => <MakeCard key={index} element={libro} index={index} user={user ?? ''} />)
      : <>No hay libros por aquí</>}
    </>
  )
}
