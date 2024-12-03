import { useState, useEffect } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import useBotonSelect from "../../assets/botonSelect";
import { validarActualizarUsuario } from "../../assets/validarPublicar";
import titleCase from "../../assets/toTitleCase";
import renderProfilePhoto from "../../assets/renderProfilePhoto"
import { cropImageToAspectRatio } from "../../assets/cropImageToAspectRatio";
export default function EditarUsuario() {
    const [user, setUser] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [correo, setCorreo] = useState('');
    const [estadoCuenta, setEstadoCuenta] = useState('');
    const [filtros, setFiltros] = useState({});
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState([]);


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
            
            setFotoPerfil(renderProfilePhoto({ user }));

        }
    }, [user, correo]);

    const agregarAQuery = (formas, forma) => {
        if (forma) {
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

    const estadoCuentaInfo = ['Estado cuenta', 'Inactivo', 'Activo', 'Vacaciones']

    const estadoCuentaProps = {
        formas: estadoCuentaInfo,
        valorInicial: user && estadoCuentaInfo.find((val)=>val === titleCase(user.estadoCuenta)),
        ...configuracionFiltros("15vw"),
    };

    const botonSelect = useBotonSelect(estadoCuentaProps);

    const handleSetForm = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
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

        async function urlToBlob(blobUrl) {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return blob;
          }
        if (Object.keys(croppedImage).length !== 0) {
            const blob = await urlToBlob(croppedImage.url)
            formData.append('images', blob, 'imagenPerfil.png'); // Append new image
        }
        if (form) {
            for (let [key, value] of Object.entries(form || {})) {
                formData.append(key, value);
            }
        }

        formData.append("actualizadoEn", new Date().toISOString());
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
            }
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
    function handleProfilePhotoClick(e) {
        e.preventDefault()
        document.getElementById('inputFotoPerfil').click()
    }

    const [croppedImage, setCroppedImage] = useState({})
    async function handleImageChange(e) {
        
            const file = e.target.files[0];
            const crop = async () => {
              const croppedURL = await cropImageToAspectRatio(file, 1 / 1);
              return { url: croppedURL, type: file.type };  // Guardar URL y tipo de archivo
            }
            const croppedFile = await crop()
          
            setCroppedImage(croppedFile);  // Añadir imágenes recortadas con su tipo
        
    }
    return (
        <>
            <Header />
            {user && (
                <form onSubmit={handleSubmit} noValidate onChange={handleSetForm}>
                    <div className="editarUsuario">
                        <div className="editarFotoContainer">
                            <img src={croppedImage.url || fotoPerfil} alt="Profile" />
                            <input id='inputFotoPerfil'
                            type="file" name="fotoPerfil" 
                            accept="image/*"
                            onChange={handleImageChange} style={{ display: 'none' }}/>

                        </div>
                        
                        <button onClick={handleProfilePhotoClick}>Cambiar Foto</button>
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
