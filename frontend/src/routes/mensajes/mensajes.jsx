import { useState, useEffect } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import { toast, ToastContainer } from "react-toastify";

export default function Mensajes() {
    const [user, setUser] = useState({});
    const [mensajes, setMensajes] = useState([]);
    const [conversaciones, setConversaciones] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);

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
                            {conversaciones.map((conversacion, index) => (
                                <div
                                    key={index}
                                    className={`conversationSpecific ${activeConversation && activeConversation._id === conversacion._id ? 'active' : ''}`}
                                    onClick={() => setActiveConversation(conversacion)}
                                >
                                    <img src="http://localhost:3030/uploads/default.jpg" alt="" />
                                    {conversacion.name}
                                </div>
                            ))}
                        </div>
                        <div className="chat">
                            {activeConversation ? (
                                <>
                                    <div className="messagesViewContainer">
                                        {mensajes.map((mensaje, i) => (
                                            <div key={i}>{mensaje.content}</div>
                                        ))}
                                    </div>
                                    <div className="messageInputContainer">
                                        <input type="text" className="messageInput" />
                                        <div className="send">
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
