import { useState, useEffect } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import useBotonSelect from "../../assets/botonSelect";
import { validarActualizarUsuario } from "../../assets/validarPublicar";
import titleCase from "../../assets/toTitleCase";

export default function EditarUsuario() {
    const [user, setUser] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [correo, setCorreo] = useState('');
    const [estadoCuenta, setEstadoCuenta] = useState('');
    const [filtros, setFiltros] = useState({});
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState([]);
    const [newImage, setNewImage] = useState(null); // To track new image upload

    // Fetch user session on mount
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:3030/api/users/userSession', {
                    method: 'POST',
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    setForm()
                    setUser(data.user);
                    setEstadoCuenta(titleCase(data.user.estadoCuenta));
                } else {
                    window.location.href = '/popUp/noUser';
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUser();
    }, []);

    // Fetch user email when user changes
    useEffect(() => {
        if (!user) return;
        async function fetchUserEmail() {
            try {
                const response = await fetch(`http://localhost:3030/api/users/c/${user._id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setCorreo(data.correo);
                    
                }
            } catch (error) {
                console.error('Error fetching user email:', error);
            }
        }

        fetchUserEmail();
    }, [user]);

    useEffect(() => {
        if (user) {
            document.querySelector("#nombre").value = user.nombre || "";
            document.querySelector("#bio").value = user.bio || "";
            document.querySelector("#correo").value = correo || "";
            setFotoPerfil(
                user.fotoPerfil?.trim()
                    ? `http://localhost:3030/uploads/${user.fotoPerfil}`
                    : 'http://localhost:3030/uploads/default.jpg'
            );

        }
    }, [user, correo]);

    const agregarAQuery = (formas, forma) => {
        if (Object.prototype.hasOwnProperty.call(formas, forma)) {
            setEstadoCuenta(forma);
            setForm({ ...form, estadoCuenta: forma });
        } else {
            console.error("La forma seleccionada no existe en el objeto formas.");
        }
    };

    const configuracionFiltros = (ancho) => ({
        results: filtros,
        setResults: setFiltros,
        ancho,
        callback: agregarAQuery,
    });

    const estadoCuentaInfo = {
        "Estado Cuenta": "",
        "Activo": "",
        "Inactivo": "",
        "Vacaciones": "",
    };

    const estadoCuentaProps = {
        formas: estadoCuentaInfo,
        valorInicial: estadoCuenta,
        ...configuracionFiltros("15vw"),
    };

    const botonSelect = useBotonSelect(estadoCuentaProps);

    const handleSetForm = (e) => {
        const { name, value, files } = e.target;
        if (name === "fotoPerfil" && files.length > 0) {
            setNewImage(files[0]); // Store the new image
        } else {
            setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombre, bio, correo, anteriorContraseña, nuevaContraseña } = e.target;
        const fallos = validarActualizarUsuario({
            nombre: nombre.value,
            bio: bio.value,
            correo: correo.value,
            anteriorContraseña: anteriorContraseña.value,
            nuevaContraseña: nuevaContraseña.value,
        }) || [];

        if (fallos.length !== 0) {
            setErrors(fallos);
            return;
        }

        setErrors([]);

        const formData = new FormData();
        setForm({ ...form, contraseña: (nuevaContraseña) ? nuevaContraseña: '' })

        if (newImage) {
            formData.append('images', newImage, newImage.name); // Append new image
        }

        for (let [key, value] of Object.entries(form)) {
            formData.append(key, value);
        }

        formData.append("actualizadoEn", new Date().toISOString());

        try {
            const URL = `http://localhost:3030/api/users/${user._id}`;
            const response = await fetch(URL, {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            if (data.error) {
                setErrors([...errors, data.error])
                console.error(data.error);
                return;
            }

            window.location.href = '/popUp/exitoActualizandoUsuario';
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    };

    return (
        <>
            <Header />
            {user && (
                <form onSubmit={handleSubmit} noValidate onChange={handleSetForm}>
                    <div className="editarUsuario">
                        <div className="editarFotoContainer">
                            <img src={fotoPerfil} alt="Profile" />
                            <input id='inputFotoPerfil'type="file" name="fotoPerfil" />

                        </div>
                        <button onClick={()=> document.querySelector('.inputFotoPerfil').click() }>Cambiar Foto</button>
                        <div className="inputCrear">
                            <label htmlFor="nombre">Nombre</label>
                            <input id="nombre" type="text" name="nombre" placeholder="Tu nombre" />
                        </div>
                        <div className="inputCrear">
                            <label htmlFor="bio">Bio</label>
                            <input id="bio" type="text" name="bio" placeholder="Tu bio" />
                        </div>
                        <div className="inputCrear">
                            <label htmlFor="correo">Correo</label>
                            <input id="correo" type="email" name="correo" placeholder="Tu correo" />
                        </div>
                        <div className="inputCrear">
                            <label htmlFor="anteriorContraseña">Cambiar Contraseña *</label>
                            <input id="anteriorContraseña" type="password" name="anteriorContraseña" placeholder="Anterior Contraseña" />
                            <input id="nuevaContraseña" type="password" name="nuevaContraseña" placeholder="Nueva Contraseña" />
                        </div>
                        <div className="inputCrear">
                            <label>Estado de la cuenta: </label>
                            <div>{botonSelect}</div>
                        </div>
                        {errors.length > 0 && <div className="error">{errors[0]}</div>}
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            )}
            <SideInfo />
            <Footer />
        </>
    );
}
