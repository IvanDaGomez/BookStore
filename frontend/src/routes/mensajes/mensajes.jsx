/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { reduceText, reduceTextByFirstWord } from "../../assets/reduceText";
import { formatDate } from "../../assets/formatDate";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Mensajes() {

    const navigate = useNavigate()
    const [activeConversation, setActiveConversation] = useState(null);

//--------------------------------------LOGICA DE MENSAJES-------------------------------------------
    const [user, setUser] = useState({});
    const [mensajes, setMensajes] = useState([]);
    const [conversaciones, setConversaciones] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([])

    const [activeUser, setActiveUser] = useState({})
    const [reducedUsers, setReducedUsers] = useState([]);
//-------------------------------------------------------------------------


    const [urlSearchParams] = useSearchParams()
    const newConversationId = urlSearchParams.get('n');

    useEffect(()=>{
        if (newConversationId && conversaciones && reducedUsers) {
            console.log(conversaciones.map(conversacion=> findUserByConversation(conversacion)._id))
            setActiveConversation(conversaciones.find(conversacion=> findUserByConversation(conversacion)._id === newConversationId))
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


    // Create a reference for scrolling
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const storedActiveConversation = localStorage.getItem('activeConversation');
        
        if (storedActiveConversation) {
            const parsedConversation = JSON.parse(storedActiveConversation);
            setActiveConversation(parsedConversation);
        }
    }, []);

    useEffect(() => {
        if (reducedUsers.length && activeConversation) {
            const otherUserId = activeConversation.users.find(u => u !== user._id);
            const userMatch = reducedUsers.find(u => u._id === otherUserId);
            if (userMatch) {
                setActiveUser(userMatch);
            }
        }
    }, [reducedUsers, activeConversation, user._id]);


//-------------------------------------LOGICA DE CONVERSACIONES-----------------------------------------//
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

    useEffect(() => {
        let isLoading = false
        async function fetchNewConversation() {
            if (isLoading) return
            // Ensure user, user._id, and newConversationId are defined
            
            if (!user || !user._id || !newConversationId || !conversaciones) return;
            
            // Check if the conversation already exists to avoid redundant requests
            if (conversaciones.some(c => c._id === newConversationId)) return;
            
            
            const body = JSON.stringify({ users: [user._id, newConversationId] })
            isLoading = true
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
                    return
                }
                const data = await response.json();
                if (data.error){
                    return
                }
                
                setConversaciones((prev) => [...(prev || []), data.conversation]);
                navigate(window.location.path)
                
            } catch (error) {
                console.error('Error creating a new conversation:', error);
                toast.error('Error creating a new conversation');
            }
        }
    
        fetchNewConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, newConversationId, conversaciones]);

    useEffect(()=>{
        if (conversaciones && user && newConversationId && 
            activeConversation && 
            findUserByConversation(activeConversation)._id === newConversationId){

            setActiveConversation(conversaciones.find(conversacion => conversacion.users.find(u => u !== user._id) === newConversationId))

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newConversationId, conversaciones, user, activeConversation])

    // slide when a conversation is active or not
    useEffect(()=>{
        if (activeConversation && window.innerWidth <= 600) {
            document.querySelector('.messagesContainer').style.transform = 'translateX(-100vw)'
        }
        else if (!activeConversation && window.innerWidth <= 600){
            document.querySelector('.messagesContainer').style.transform = 'translateX(0)'
        }
    },[activeConversation])
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
            if (!activeConversation) return;
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
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set JSON header
                },
                body: JSON.stringify({
                    userId: user._id,
                    conversationId: activeConversation._id,
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
    
            // Set active conversation last message, ensure it's correctly set
            setActiveConversation(prevActiveConversation => ({
                ...prevActiveConversation,
                lastMessage: responseData.message
            }));
    
            // Clear input field
            messageInput.value = '';
    
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



    const [libroAPreguntar, setLibroAPreguntar] = useState({})
    const idLibro = urlSearchParams.get('q')


    useEffect(()=>{
        async function fetchLibro(id) {
            if (!idLibro) return
            const url = `http://localhost:3030/api/books/${id}`
            console.log(url)
            try {
                const response = await axios.get(url, { withCredentials: true });
                const book = response.data
                console.log(book)
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
    useEffect(()=>{
        if (Object.keys(libroAPreguntar).length !== 0 && inputMessage && activeConversation && libroAPreguntar.idVendedor === findUserByConversation(activeConversation)._id){
            
           inputMessage.value = 'Hola me gustaría saber más del libro ' + libroAPreguntar.titulo + '\n' + 'http://localhost:5173/libros/' + libroAPreguntar._id
        }
        else if (inputMessage){
            inputMessage.value = ''
        }
    },[libroAPreguntar, inputMessage, activeConversation])
    return (
        <>
            <Header />
{/*----------------------------------------SELECCION DE NOTIFICACION----------------------------------------------- */}

            <div className="sectionMessagesContainer">
                    <Link to='/notificaciones'>
                        <div className={`sectionMessage`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                                <path d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Notificaciones</span>
                        </div>
                    </Link>
                    <Link to='/mensajes'>
                        <div className={`sectionMessage sectionMessageActive`}  >
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                                <path d="M8.5 14.5H15.5M8.5 9.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            <span>Mensajes</span>
                        </div>
                    </Link>
                    </div>
                    
{/*----------------------------------------MENSAJES EN PC----------------------------------------------- */}
            {<>
            {window.innerWidth > 480 && (
                <>
                    
                    <div className="messagesContainer">
                        <div className="conversationsContainer">
                            <input type="text" className="conversationsFilter" onChange={(event)=>filterConversations(event)} placeholder="Buscar"/>

{/*----------------------------------------CADA CONVERSACIÓN----------------------------------------------- */}
                {filteredConversations
                    .sort((a, b) => {
                        const dateA = a.lastMessage?.createdIn ? new Date(a.lastMessage.createdIn) : 0;
                        const dateB = b.lastMessage?.createdIn ? new Date(b.lastMessage.createdIn) : 0;
                        return dateB - dateA; // Sort in descending order by last message date
                    })
                    .map((conversation) => (
                        <div
                            key={conversation._id}
                            className={`conversationSpecific ${activeConversation && activeConversation._id === conversation._id ? 'active' : ''}`}
                            onClick={() => setActiveConversation(conversation)}
                        >
                            <img
                                src={
                                    findUserByConversation(conversation).fotoPerfil && findUserByConversation(conversation).login === 'default' ? 
                                    `http://localhost:3030/uploads/${findUserByConversation(conversation).fotoPerfil}` 
                                    : findUserByConversation(conversation).login === 'Google' || 
                                    findUserByConversation(conversation).login === 'Facebook'
                                    && findUserByConversation(conversation).fotoPerfil
                                    ? findUserByConversation(conversation).fotoPerfil 
                                    : "http://localhost:3030/uploads/default.jpg"}
                                    
                                alt={`${findUserByConversation(conversation).name || 'User'}'s avatar`}
                            />
                            <div className="conversationSpecificTitleAndMessage">
                            <h2>{findUserByConversation(conversation).nombre || ''}</h2>
                            <span>
                            {user && reducedUsers && conversation && conversation.lastMessage && conversation.lastMessage.message ? (
                                <>
                                    {conversation.lastMessage.userId === user._id 
                                    ? 'Tu: ' 
                                    : `${reduceTextByFirstWord(findUserByConversation(conversation).nombre || '')}: `}
                                    {reduceText(conversation.lastMessage.message, 20)}
                                </>
                                ) : null} 

                            </span>
                            </div>
                            {/* 2024-12-21T17:01:32.197Z*/}
                            {/*2024-11-03T01:25:13.080Z */}
                            
                            <span>{formatDate(conversation?.lastMessage.createdIn) || ''}</span>
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
                                    }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={25} height={25} color={"#000000"} fill={"none"}>
    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
                                    <img src={activeUser.fotoPerfil ? `http://localhost:3030/uploads/${activeUser.fotoPerfil}` : "http://localhost:3030/uploads/default.jpg"} alt={activeUser.nombre} />
                                    <h2>{activeUser.nombre}</h2>
                                  </div> 
                                }
{/*----------------------------------------MENSAJES----------------------------------------------- */}
                            <div className="messagesViewContainer" ref={chatContainerRef}>
                                {mensajes.length !== 0 && user && mensajes.map((mensaje, index) => (
                                    <div key={index} className={mensaje.userId === user._id ? 'myMessage' : 'otherMessage'}>
                                        {mensaje.message}
                                    </div>
                                ))}                                
                            </div>
{/*----------------------------------------CONTENEDOR DE ENVIAR MENSAJE----------------------------------------------- */}
                            {activeConversation ? (
                                <>
                                    <div className="messageInputContainer">
                                        <textarea type="text" id="messageInput" onKeyDown={(event) => {
                                            if (event.key === 'Enter' && event.shiftKey) {
                                            event.preventDefault(); // Evita que el evento por defecto de Enter ocurra
                                            const textarea = event.target;
                                            const start = textarea.selectionStart;
                                            const end = textarea.selectionEnd;

                                            // Inserta un salto de línea en la posición actual del cursor
                                            const newValue =
                                                textarea.value.substring(0, start) +
                                                '\n' +
                                                textarea.value.substring(end);
                                            textarea.value = newValue;

                                            // Mueve el cursor al lugar correcto después del salto de línea
                                            textarea.selectionStart = textarea.selectionEnd = start + 1;
                                            textarea.scrollTop = textarea.scrollHeight;
                                            } else if (event.key === 'Enter') {
                                            event.preventDefault(); // Aquí puedes llamar tu función de envío
                                            handleSubmitMessage(event);
                                            }
                                        }} >
                                            </textarea>
                                        <div className="send" onClick={(event) => handleSubmitMessage(event)}>
                                            <img src='/sendMessage.svg' alt="Send Message" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </>
            )}
            
            </>
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
