import { useState, useEffect, useRef } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { reduceText, reduceTextByFirstWord } from "../../assets/reduceText";

export default function Mensajes() {
    const [user, setUser] = useState({});
    const [mensajes, setMensajes] = useState([]);
    const [conversaciones, setConversaciones] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [activeUser, setActiveUser] = useState({})
    const [reducedUsers, setReducedUsers] = useState([]);
    

    const [urlSearchParams] = useSearchParams()
    const newConversationId = urlSearchParams.get('n');

    
    // Nueva Conversación ----
    useEffect(()=>{
        async function fetchNewConversation(){
            if (!user && newConversationId !== '') return
            const url = `http://localhost:3030/api/conversations`
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set JSON header
                },
                body: JSON.stringify({
                    users: [user._id, newConversationId]
                }),
                credentials: 'include',
            })
            if (!response.ok){
                return
            }
            const data = await response.json()
            if (data.error){
                return
            }
            setConversaciones([...conversaciones, data.conversation])
            setActiveConversation(data.conversation)
        }
        fetchNewConversation()
    },[newConversationId, user])
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
        localStorage.setItem('activeConversation', JSON.stringify(activeConversation))
        
        if (reducedUsers && activeConversation){
            setActiveUser(reducedUsers.find(reducedUser => reducedUser._id === activeConversation.users.find(activeUser => activeUser !== user._id)))
        }
    }, [activeConversation, reducedUsers, user._id]);

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
                    window.location.href = 'popUp/noUser';
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                window.location.href = 'popUp/noUser';
            }
        }
        fetchUser();
    }, []);

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
            } catch (error) {
                console.error('Error fetching conversations:', error);
                toast.error('Error fetching conversations');
            }
        }
        fetchConversations();
    }, [user, newConversationId]);

    useEffect(() => {
        async function fetchPhotoAndNameUsers() {
            if (!user || !conversaciones.length) return;

            const fetchedUsers = [];
            for (let conversacion of conversaciones) {
                const userConversationId = conversacion.users.find(c => c !== user._id);
                
                if (!userConversationId) continue;

                try {
                    const url = `http://localhost:3030/api/users/${userConversationId}/photoAndName`;
                    const response = await fetch(url);
                    const userData = await response.json();

                    if (userData.error) {
                        toast.error(userData.error);
                        return;
                    }

                    fetchedUsers.push(userData);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    toast.error('Error fetching user data');
                }
            }
            setReducedUsers(fetchedUsers);
        }
    
        fetchPhotoAndNameUsers();
    }, [user, conversaciones]);
    
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

    async function handleSubmitMessage() {
        const messageInput = document.querySelector('.messageInput');
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
            setMensajes((prevMensajes) => [...prevMensajes, responseData.message])
            
            // Actualiza solo la conversación activa
            setConversaciones((prevConversaciones) => {
                return prevConversaciones.map((conversacion) => {
                    if (conversacion._id === activeConversation._id) {
                        return {
                            ...conversacion,
                            lastMessage: responseData.message, // Actualiza el lastMessage
                        };
                    }
                    return conversacion; // Devuelve la conversación sin cambios
                });
            });

            
            // Set active conversation last message
            messageInput.value = ''; // Clear input
            


        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error al enviar el mensaje');
        }
    }
    // Scroll to the bottom after adding the message
    useEffect(() => {
        if (mensajes){
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    },[mensajes])

    function formatDate(createdIn) {
        if (!createdIn) return ''
        const date = new Date(createdIn);
        const now = new Date();
    
        const isToday = date.toDateString() === now.toDateString();
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();
    
        if (isToday) {
            // If it's today, return hours and minutes in HH:MM format
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else if (isYesterday) {
            // If it's yesterday, return "Yesterday"
            return "Ayer";
        } else {
            // Otherwise, return the date in DD/MM/YYYY format
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
    }
    return (
        <>
            <Header />
            {window.innerWidth > 480 && (
                <>
                    <div className="sectionMessagesContainer">
                        <div className="sectionMessage">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                                <path d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Notificaciones</span>
                        </div>
                        <div className="sectionMessage">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                                <path d="M8.5 14.5H15.5M8.5 9.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            <span>Mensajes</span>
                        </div>
                    </div>
                    {console.log(activeConversation)}
                    <div className="messagesContainerPc">
                        <div className="conversationsContainer">
                {conversaciones
                    .sort((a, b) => {
                        const dateA = a.lastMessage?.createdIn ? new Date(a.lastMessage.createdIn) : 0;
                        const dateB = b.lastMessage?.createdIn ? new Date(b.lastMessage.createdIn) : 0;
                        return dateB - dateA; // Sort in descending order by last message date
                    })
                    .map((conversation, index) => (
                        <div
                            key={conversation._id}
                            className={`conversationSpecific ${activeConversation && activeConversation._id === conversation._id ? 'active' : ''}`}
                            onClick={() => setActiveConversation(conversation)}
                        >
                            <img
                                src={reducedUsers[index]?.fotoPerfil ? `http://localhost:3030/uploads/${reducedUsers[index]?.fotoPerfil}` : "http://localhost:3030/uploads/default.jpg"}
                                alt={`${reducedUsers[index]?.name || 'User'}'s avatar`}
                            />
                            <div className="conversationSpecificTitleAndMessage">
                            <h2>{reducedUsers[index]?.nombre || 'Unknown User'}</h2>
                            <span>
                            {user && reducedUsers && conversation && conversation.lastMessage && conversation.lastMessage.message ? (
                                <>
                                    {conversation.lastMessage.userId === user._id 
                                    ? 'Tu: ' 
                                    : `${reduceTextByFirstWord(reducedUsers[index]?.nombre || '')}: `}
                                    {reduceText(conversation.lastMessage.message, 20)}
                                </>
                                ) : null} 

                            </span>
                            </div>
                            <span>{formatDate(conversation?.lastMessage.createdIn) || ''}</span>
                        </div>
                    ))}
                        </div>
                        <div className="chat">
                            {}
                            
                                {(user && reducedUsers && activeConversation) &&
                                 <div className="headerMessage">
                                    <img src={activeUser.fotoPerfil ? `http://localhost:3030/uploads/${activeUser.fotoPerfil}` : "http://localhost:3030/uploads/default.jpg"} alt={activeUser.nombre} />
                                    <h2>{activeUser.nombre}</h2>
                                  </div> 
                                }
                            
                            <div className="messagesViewContainer" ref={chatContainerRef}>
                                {mensajes.length !== 0 && user && mensajes.map((mensaje, index) => (
                                    <div key={index} className={mensaje.userId === user._id ? 'myMessage' : 'otherMessage'}>
                                        {mensaje.message}
                                    </div>
                                ))}                                
                            </div>
                            {activeConversation ? (
                                <>
                                    <div className="messageInputContainer">
                                        <input type="text" className="messageInput" onKeyDown={(event) => event.key === 'Enter' ? handleSubmitMessage() : ''} />
                                        <div className="send" onClick={handleSubmitMessage}>
                                            <img src='/sendMessage.svg' alt="Send Message" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>No hay nada que mostrar</>
                            )}
                        </div>
                    </div>
                </>
            )}
            {window.innerWidth <= 480 && <div className="messagesContainerPhone"></div>}
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
