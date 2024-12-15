import { Link } from 'react-router-dom'
export default function ErrorPage () {
  return (
    <>
      <div className='errorContainer'>
        <h1>Oops, parece que andas perdido</h1>
        <Link to='/'><p>Volver a inicio</p></Link>
      </div>
    </>
  )
}
