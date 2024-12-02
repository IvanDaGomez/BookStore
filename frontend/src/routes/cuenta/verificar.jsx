// eslint-disable-next-line react/prop-types
export default function Verificar({ verified }) {
    return (<>
    <h1>Verificar</h1>
    <div className="genericContainer">
        {verified ? <>
        Ya estás verificado, puedes acceder a todas las funciones disponibles
        </>:
        <>
        No estás verificado, por favor click <a href="/verificar">aquí</a> para verificar tu dirección de correo y credenciales
        </>}
    </div>
    </>)
}