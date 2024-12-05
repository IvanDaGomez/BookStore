/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Verificar({ user }) {
    const { token } = useParams();
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        async function validateUser() {
            // If no token is provided or the user is already validated, skip validation
            if (!token || user?.validated) {
                setVerifying(false);
                return;
            }

            try {
                const url = `http://localhost:3030/api/users/validateUser/${token}`;
                const response = await axios.get(url);
                console.log(response.data)
                if (response.data.status) {
                    setVerified(true);
                }
            } catch (error) {
                console.error("Error validating user:", error);
            } finally {
                setVerifying(false);
            }
        }

        validateUser();
    }, [token, user?.validated]);

    return (
        <div className="verifyContainer">
            <h1>Verificación de Cuenta</h1>
            {verifying ? (
                <div className="verifying">
                    <p>Verificando tu cuenta... Por favor espera.</p>
                </div>
            ) : (
                <div className="verification-status">
                    <h2>Estado de Verificación:</h2>
                    <p
                        className={verified || user?.validated ? "status-verified" : "status-unverified"}
                    >
                        {verified || user?.validated
                            ? "Cuenta verificada ✅"
                            : "Cuenta no verificada ❌"}
                    </p>
                </div>
            )}
        </div>
    );
}
