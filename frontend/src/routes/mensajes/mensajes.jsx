/* eslint-disable no-unused-vars */

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { reduceText, reduceTextByFirstWord } from "../../assets/reduceText";
import { formatDate } from "../../assets/formatDate";
import { Link } from "react-router-dom";
import axios from "axios";
import { renderProfilePhoto } from "../../assets/renderProfilePhoto";

export default function Mensajes() {
    // Estado para navegar con react router
    const navigate = useNavigate()
    const [activeConversation, setActiveConversation] = useState(null);

//--------------------------------------LOGICA DE MENSAJES-------------------------------------------
    const [user, setUser] = useState({});
   // Fetch del usuario primero que todo
   useEffect(() => {
    async function fetchUser() {
        try {
            const response = await fetch('http://localhost:3030/api/users/userSession', {
                method: 'POST',
                credentials: 'include',
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Esto es exclusivo de los que son usuarios
                navigate('popUp/noUser')
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('popUp/noUser')
        }
    }
    fetchUser();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
    const [mensajes, setMensajes] = useState([]);
    const [conversaciones, setConversaciones] = useState([]);
    const [urlSearchParams] = useSearchParams()
    const newConversationId = urlSearchParams.get('n');
    useEffect(() => {
        async function fetchConversations() {
            if (!user || !user._id) return;
            try {
                const url = `http://localhost:3030/api/conversations/getConversationsByUser/${user._id}`;
                const response = await fetch(url);
                const conversations = await response.json();
                if (conversations.error) {
                    return;
                }
                setConversaciones(conversations);
                setFilteredConversations(conversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                toast.error('Error fetching conversations');
            }
        }
        fetchConversations();
    }, [user, newConversationId]);

    const [filteredConversations, setFilteredConversations] = useState([])

    const [activeUser, setActiveUser] = useState({})
    const [reducedUsers, setReducedUsers] = useState([]);
//-------------------------------------------------------------------------




    useEffect(()=>{
        if (newConversationId && conversaciones && reducedUsers) {
            setActiveConversation(conversaciones.find(conversacion => findUserByConversation(conversacion)._id === newConversationId))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newConversationId, conversaciones, reducedUsers])
    function findUserByConversation(conversation){
        const otherUserId = conversation.users.find(u => u !== user._id);
            if (!otherUserId) return {};
            
            // Find the user object for the other user in reducedUsers
            const userMatch = reducedUsers.find(reducedUser => reducedUser._id === otherUserId);

            return userMatch || {}
    }
 


    // Create a reference for scrolling
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const storedActiveConversation = localStorage.getItem('activeConversation');
        
        if (storedActiveConversation) {
            const parsedConversation = JSON.parse(storedActiveConversation);
            setActiveConversation(parsedConversation);
        }
    }, []);
    // TENGO LA TEORIA DE QUE NO ESTÁ HACIENDO NADA
    // useEffect(() => {
    //     if (reducedUsers.length && activeConversation) {
    //         const otherUserId = activeConversation.users.find(u => u !== user._id);
    //         const userMatch = reducedUsers.find(u => u._id === otherUserId);
    //         if (userMatch) {
    //             setActiveUser(userMatch);
    //         }
    //     }
    // }, [reducedUsers, activeConversation, user._id]);

    async function fetchNewConversation() {
        // Ensure user, user._id, and newConversationId are defined
        if (!user || !user._id || !newConversationId || !conversaciones) return;
    
        // Check if the conversation already exists to avoid redundant requests
        if (conversaciones.some((c) => c._id === newConversationId)) return;
    
        const body = JSON.stringify({ users: [user._id, newConversationId] });
    
        try {
            const url = `http://localhost:3030/api/conversations`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                credentials: 'include',
            });
    
            if (!response.ok) {
                console.error("Error in response while creating a new conversation");
                return;
            }
    
            const data = await response.json();
            if (data.error) {
                return;
            }
    
            // Replace the last conversation with the new one
            setConversaciones((prev) => {
                const updatedConversations = [...prev];
                // Remove the last conversation if it exists
                if (updatedConversations.length > 0) {
                    updatedConversations.pop();
                }
                // Add the new conversation
                updatedConversations.push(data.conversation);
                return updatedConversations;
            });
    
            return data.conversation;
        } catch (error) {
            console.error('Error creating a new conversation:', error);
            toast.error('Error creating a new conversation');
        }
    }
    
//-------------------------------------LOGICA DE CONVERSACIONES-----------------------------------------//EDITAR
// Crear una conversación local

    useEffect(() => {

        if (!user || !user._id || !newConversationId) return;
        // Si el ID no es válido y no existe salir
        if (reducedUsers.length && reducedUsers.find((usuario)=> usuario._id === newConversationId) === undefined) return
        // Si hay conversaciones Y si el id de la conversación ya existe volver
        if (conversaciones.length !== 0 && conversaciones.find(conversacion => findUserByConversation(conversacion)._id === newConversationId) !== undefined) return
        setConversaciones((prevConversaciones) => {
            // Prevent duplicate entries
            const alreadyExists = prevConversaciones?.some((c) =>
                c.users.includes(newConversationId)
            );
            if (alreadyExists) return prevConversaciones;

            return [...(prevConversaciones || []), {
                users: [user._id, newConversationId]
            }];
        });

        setFilteredConversations((prevFilteredConversations) => {
            const alreadyExists = prevFilteredConversations?.some((c) =>
                c.users.includes(newConversationId)
            );
            if (alreadyExists) return prevFilteredConversations;

            return [...(prevFilteredConversations || []), {
                users: [user._id, newConversationId]
            }];
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newConversationId, user, conversaciones]);

    useEffect(()=>{
        if (conversaciones && user && newConversationId && 
            activeConversation && 
            findUserByConversation(activeConversation)._id === newConversationId){

            setActiveConversation(conversaciones.find(conversacion => conversacion.users.find(u => u !== user._id) === newConversationId))
            setActiveUser(findUserByConversation(activeConversation))
        }
    },[newConversationId, conversaciones, user, activeConversation])


useEffect(() => {
    async function fetchPhotoAndNameUsers() {
        if (!user._id || !conversaciones.length) return;

        try {
            const fetchedUsers = await Promise.all(conversaciones.map(async conversacion => {
                const userConversationId = conversacion.users.find(id => id !== user._id);
                if (!userConversationId) return null;

                const response = await fetch(`http://localhost:3030/api/users/${userConversationId}/photoAndName`);
                if (response.ok) {
                    return await response.json();
                } else {
                    console.error(`Failed to fetch data for user ${userConversationId}`);
                    return null;
                }
            }));

            setReducedUsers(fetchedUsers.filter(userData => userData));
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Error fetching user data');
        }
    }

    fetchPhotoAndNameUsers();
}, [user._id, conversaciones]);

    
    useEffect(() => {
        async function fetchMessages() {
            if (!activeConversation || Object.keys(activeConversation).length === 0 || !activeConversation._id) return;
            try {
                const url = `http://localhost:3030/api/messages/messageByConversation/${activeConversation._id}`;
                const response = await fetch(url);
                const messages = await response.json();

                if (messages.error) {
                    toast.error(messages.error);
                    return;
                }
                setMensajes(messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
                toast.error('Error fetching messages');
            }
        }
        fetchMessages();
    }, [activeConversation]);

    async function handleSubmitMessage(e) {
        e.preventDefault();
        const messageInput = document.querySelector('#messageInput');
        const value = messageInput.value.trim(); // Trim whitespace
        const url = `http://localhost:3030/api/messages`;
    
        if (!(value && activeConversation && user)) return; // Validate inputs
        let newConversation = false;
      
        // Si hay un ID de conversación Y si el usuario ya está en las conversaciones
        if (newConversationId && conversaciones.find(conversacion => Object.keys(conversacion).length > 1 && findUserByConversation(conversacion)?._id === newConversationId) === undefined) {
            newConversation = await fetchNewConversation()
        } 

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set JSON header
                },
                body: JSON.stringify({
                    userId: user._id,
                    conversationId: newConversation?._id || activeConversation._id,
                    message: value,
                    read: false,
                }),
                credentials: 'include',
            });
    
            if (!response.ok) {
                toast.error('Error en la respuesta');
                return;
            }
        
            const responseData = await response.json(); // Parse JSON response
            
            // Add the new message to messages state
            setMensajes((prevMensajes) => [...prevMensajes, responseData.message]);
    
            // Update conversations and activeConversation lastMessage
            setConversaciones((prevConversaciones) => {
                return prevConversaciones.map((conversacion) => {
                    if (conversacion._id === activeConversation._id) {
                        return {
                            ...conversacion,
                            lastMessage: responseData.message, // Update lastMessage
                        };
                    }
                    return conversacion; // Return the conversation without changes
                });
            });
            // Update conversations and activeConversation lastMessage
            setFilteredConversations((prevConversaciones) => {
                return prevConversaciones.map((conversacion) => {
                    if (conversacion._id === activeConversation._id) {
                        return {
                            ...conversacion,
                            lastMessage: responseData.message, // Update lastMessage
                        };
                    }
                    return conversacion; // Return the conversation without changes
                });
            });
            
            // Set active conversation last message, ensure it's correctly set
            setActiveConversation(prevActiveConversation => ({
                ...prevActiveConversation,
                lastMessage: responseData.message
            }));
    
            // Clear input field
            messageInput.value = '';
            messageInput.style.height = 'auto'
            if (newConversationId) {
                navigate('/mensajes')
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error al enviar el mensaje');
        }
    }
    
    // Scroll to the bottom after adding the message
    useEffect(() => {
        if (chatContainerRef.current && mensajes.length > 0) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [mensajes]);

// -----------------------------------------------------------------FILTRO DEL CHAT----------------------------------------

    function filterConversations(e) {
        const searchTerm = e.target.value.toLowerCase(); // Normalize the search term for case-insensitive comparison
    
        // Filter conversations where the name of the other user contains the search term
        const filtered = conversaciones.filter(conversation => {
            // Find the other user's ID
            const otherUserId = conversation.users.find(u => u !== user._id);
            if (!otherUserId) return null;
            
            // Find the user object for the other user in reducedUsers
            const userMatch = reducedUsers.find(reducedUser => reducedUser._id === otherUserId);

            return userMatch.nombre.toLowerCase().includes(searchTerm);
        });
    
        // Update the state with the filtered conversations
        setFilteredConversations(filtered);
    }

    //-------------------------------------------------------------Lógica para preguntar sobre un libro en específico
    const [libroAPreguntar, setLibroAPreguntar] = useState({})
    const idLibro = urlSearchParams.get('q')
    useEffect(()=>{
        async function fetchLibro(id) {
            if (!idLibro) return
            const url = `http://localhost:3030/api/books/${id}`
            try {
                const response = await axios.get(url, { withCredentials: true });
                const book = response.data

                setLibroAPreguntar(book || {}); // Asegurar que el libro existe o dejar vacío


            } catch (error) {
                setLibroAPreguntar({});
                console.error("Error fetching book data:", error);
            }
        }

        fetchLibro(idLibro);
    },[idLibro])
    const convertToLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => 
          urlRegex.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : part
        );
      };
    const inputMessage = document.querySelector('#messageInput')
    useEffect(() => {
        // Si hay un nuevo usuario (para hacer activa su conversación), y renderizó el input, y si el libro a preguntar coincida con el vendedor
        if (
            newConversationId &&
            Object.keys(libroAPreguntar).length !== 0 &&
            inputMessage &&
            activeConversation &&
            libroAPreguntar.idVendedor === findUserByConversation(activeConversation)._id
        ) {
            const vendedorNombre = findUserByConversation(activeConversation).nombre;
            const libroTitulo = libroAPreguntar.titulo;
            const libroUrl = `http://localhost:5173/libros/${libroAPreguntar._id}`;
            
            inputMessage.value = `
            ¡Hola ${vendedorNombre}! 😊
    
            Me interesa mucho el libro que estás ofreciendo: *${libroTitulo}*. ¿Podrías contarme un poco más al respecto? Aquí está el enlace del libro para que lo tengas a mano: 
            ${libroUrl}
    
            ¡Muchas gracias de antemano! Espero tu respuesta. 😊
            `.trim(); // Elimina espacios adicionales al inicio o final del mensaje
        } else if (inputMessage) {
            inputMessage.value = '';
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newConversationId, libroAPreguntar, inputMessage, activeConversation]);

    //-----------------------------------------------------------Teléfono---------------------------------------
        // slide when a conversation is active or not
        useEffect(()=>{
            if (activeConversation && window.innerWidth <= 600) {
                document.querySelector('.messagesContainer').style.transform = 'translateX(-100vw)'
            }
            else if (!activeConversation && window.innerWidth <= 600){
                document.querySelector('.messagesContainer').style.transform = 'translateX(0)'
            }
        },[activeConversation])


        
        return (
            <>
                <Header />
        {/*----------------------------------------SELECCION DE NOTIFICACION----------------------------------------------- */}
                <div className="sectionMessagesContainer">
                    <Link to='/notificaciones'><div style={{borderTopLeftRadius: '5px'}} className={`sectionMessage`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}><path d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span>Notificaciones</span>
                    </div></Link>
                    <Link to='/mensajes'><div style={{borderTopRightRadius: '5px'}} className={`sectionMessage sectionMessageActive`}  >
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}><path d="M8.5 14.5H15.5M8.5 9.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                        <span>Mensajes</span>
                    </div></Link>
                </div>
                        
        {/*----------------------------------------MENSAJES EN PC----------------------------------------------- */}
         
                {window.innerWidth >= 600 && 
                    <div className="messagesContainer">
                        <div className="conversationsContainer">
                            <input type="text" className="conversationsFilter" onChange={(event)=>filterConversations(event)} placeholder="Buscar"/>
        
        {/*----------------------------------------CADA CONVERSACIÓN----------------------------------------------- */}
                            {filteredConversations
                                .sort((a, b) => {
                                const dateA = a?.lastMessage?.createdIn ? new Date(a?.lastMessage?.createdIn) : 0;
                                const dateB = b?.lastMessage?.createdIn ? new Date(b?.lastMessage?.createdIn) : 0;
                                return dateB - dateA; // Sort in descending order by last message date
                                })
                                .map((conversation, index) => (
                                <div
                                key={index}
                                className={`conversationSpecific ${activeConversation?._id === conversation._id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveConversation(conversation)
                                    setActiveUser(findUserByConversation(conversation))
                                    }}>
                                <img
                                    src={renderProfilePhoto({ user: findUserByConversation(conversation) })}
                                    alt={`${findUserByConversation(conversation).nombre || 'User'}'s avatar`}/>
                                <div className="conversationSpecificTitleAndMessage">
                                <h2>{findUserByConversation(conversation).nombre || ''}</h2>
                                <span>
                                {(user && reducedUsers && conversation && conversation?.lastMessage && conversation?.lastMessage?.message) && (
                                    <>
                                        {conversation.lastMessage.userId === user._id 
                                        ? 'Tu: ' 
                                        : `${reduceTextByFirstWord(findUserByConversation(conversation).nombre || '')}: `}
                                        {reduceText(conversation?.lastMessage?.message, 20)}
                                    </>
                                    )} 
        
                                </span>
                                </div>
                                {/* 2024-12-21T17:01:32.197Z*/}
                                <span>{formatDate(conversation?.lastMessage?.createdIn) || ''}</span>
                            </div>
                        ))}
                            </div>
                            <div className="chat">
        {/*----------------------------------------ENCABEZADO DEL CHAT----------------------------------------------- */}
                                    {(user && reducedUsers && activeConversation) &&
                                     <div className="headerMessage">
                                        <svg 
                                        onClick={()=>setActiveConversation(null)}
                                        style={{display: window.innerWidth <= 600 ? 'block': 'none',
                                            transform:'rotate(180deg)'
                                        }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={25} height={25} color={"#000000"} fill={"none"}><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <img src={activeUser.fotoPerfil ? `http://localhost:3030/uploads/${activeUser.fotoPerfil}` : "http://localhost:3030/uploads/default.jpg"} alt={activeUser.nombre} />
                                        <Link to={`/usuarios/${activeUser._id}`}><h2>{activeUser.nombre}</h2></Link>
                                      </div> 
                                    }
        {/*----------------------------------------MENSAJES----------------------------------------------- */}
                                <div className="messagesViewContainer" ref={chatContainerRef}>
                                    {mensajes.map((mensaje, index) => (
                                        <div key={index} className={`mensaje ${mensaje.userId === user._id ? 'myMessage' : 'otherMessage'}`}>
                                            {mensaje.message}
                                        </div>
                                    ))}                                
                                </div>
        {/*----------------------------------------CONTENEDOR DE ENVIAR MENSAJE----------------------------------------------- */}
                                {activeConversation && 
                                        <div className="messageInputContainer">
                                        <textarea
                                            id="messageInput"
                                            rows="1"
                                            onInput={(event) => {
                                                const textarea = event.target;
                                                textarea.style.height = 'auto'; // Restablece la altura para recalcular
                                                textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`; // Expande hasta 4 líneas (4 * 24px de altura típica por línea)
                                            }}
                                            onKeyDown={(event) => {
                                                const textarea = event.target;
        
                                                // Shift + Enter: Añade un salto de línea
                                                if (event.key === 'Enter' && event.shiftKey) {
                                                    event.preventDefault();
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
        
                                                    textarea.value =
                                                        textarea.value.substring(0, start) +
                                                        '\n' +
                                                        textarea.value.substring(end);
        
                                                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                                                    textarea.style.height = 'auto';
                                                    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`; // Recalcula la altura
                                                } 
                                                // Enter: Envía el mensaje
                                                else if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    handleSubmitMessage(event);
                                                }
                                            }}
                                        ></textarea>
        
                                            <div className="send" onClick={(event) => handleSubmitMessage(event)}>
                                                <img src='/sendMessage.svg' alt="Send Message" />
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                }
        
                            
                <Footer />
                <SideInfo />
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    pauseOnHover={false}
                    closeOnClick
                    theme="light"
                />
            </>
        );
}
