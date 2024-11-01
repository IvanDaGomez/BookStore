import { useState, useEffect, useRef } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function Mensajes() {
    const [user, setUser] = useState({});
    const [mensajes, setMensajes] = useState([]);
    const [conversaciones, setConversaciones] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [reducedUsers, setReducedUsers] = useState([]);


    const [urlSearchParams] = useSearchParams()
    const n = urlSearchParams.get('n');
    // Nueva Conversación ----
    
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
        
    }, [activeConversation]);

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
                    toast.error(conversations.error);
                    return;
                }
                setConversaciones(conversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                toast.error('Error fetching conversations');
            }
        }
        fetchConversations();
    }, [user]);

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
    return (
        <>
            <Header />
            {window.innerWidth > 480 && (
                <>
                    <div className="sectionMessagesContainer">
                        {/* Notifications and Messages Icons */}
                    </div>
                    <div className="messagesContainerPc">
                        <div className="conversationsContainer">
                            {/*<div className="activeConversation">
                                {console.log(activeConversation)}
                                {activeConversation && 
                                <>
                                <img src={activeConversation.fotoPerfil} alt="" />
                                <h2>{activeConversation.nombre}</h2></>}
                            </div>*/}
                            {conversaciones.map((conversation, index) => (
                                <div
                                    key={conversation._id}
                                    className={`conversationSpecific ${activeConversation && activeConversation._id === conversation._id ? 'active' : ''}`}
                                    onClick={() => setActiveConversation(conversation)}
                                >
                                    <img src={reducedUsers[index]?.fotoPerfil || "http://localhost:3030/uploads/default.jpg"} alt={`${reducedUsers[index]?.name || 'User'}'s avatar`} />
                                    <span>{reducedUsers[index]?.nombre || 'Unknown User'}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chat">
                            {/*{console.log(activeConversation)}
                            <div className="headerMessage">
                                {user && reducedUsers && activeConversation && reducedUsers.find(reducedUser => reducedUser._id === activeConversation.users.find(activeUser => activeUser !== user._id))}
                            </div>*/}
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
