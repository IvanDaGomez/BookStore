import { useEffect } from "react"

export default function Colecciones({ user }) {

    useEffect(()=>{
        async function fetchColecciones() {
            const url = 'http://localhost:3030/api/users/getCollectionsByUser'
            const body = {
                collection: {
                    "nombre": "Aña",
                    "librosIds": [
                      "221f695c-69a3-4dee-98e1-0ab4565a734c",
                      "836e151b-43ae-48a0-8352-17ad309d8068",
                      "e93345c4-ca50-4919-ba85-4dcf00882673"
                    ]
                }
            }
        }
    })
    return (<>
        Colecciones
    </>)
}