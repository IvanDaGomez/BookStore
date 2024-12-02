/* eslint-disable react-hooks/exhaustive-deps */
import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate } from "../../assets/formatDate";
import { reduceText } from "../../assets/reduceText";
import axios from "axios";
import { DetailedNotification } from "../../assets/formatNotificationMessage";
/*
{
    _id: data._id || '',
    theme: data.theme || '',
    title: data.title || '',
    priority: data.priority || '',
    type: data.type || '',
    userId: data.userId || '',
    input: data.input || '',
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false,
    actionUrl: data.actionUrl || '',
    expiresAt: data.expiresAt || new Date().toISOString(),
    metadata: data.metadata || {
      photo: '',
      bookTitle: '',
      bookId: ''
    }
  }
*/
export default function Notificaciones() {
    const navigate = useNavigate()

    const [user, setUser] = useState({})

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
                        navigate('popUp/noUser');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    navigate('popUp/noUser')
                }
            }
            fetchUser();
        }, []);
        const [notifications, setNotifications] = useState([])
        const [activeNotification, setActiveNotification] = useState({})
        const [filteredNotifications, setFilteredNotifications] = useState([])
        useEffect(()=>{
            async function fetchNotifications() {
                if (!user || !user?._id) return; 
                const url = 'http://localhost:3030/api/notifications/getNotificationsByUser/' + user._id
                const response = await axios.get(url)
                setNotifications(response.data)
                setFilteredNotifications(response.data)
            }
            fetchNotifications()
        },[user])
    //----------------------------------------LÓGICA DE NOTIFICACIONES------------------------------------//
    const { notificationId } = useParams()

    useEffect(()=>{
        if (notificationId && notifications.length !== 0) {
            setActiveNotification(notifications.find(notification=> notification._id === notificationId))
        }
    },[notificationId, notifications])


    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

    // slide when a notification is active or not
    useEffect(()=>{
        if (activeNotification && isMobile) {
            document.querySelector('.messagesContainer').style.transform = 'translateX(-100vw)'
        }
        else if (!activeNotification && isMobile){
            document.querySelector('.messagesContainer').style.transform = 'translateX(0)'
        }
    },[activeNotification])
    function filterNotifications(e) {
        const searchTerm = e.target.value.toLowerCase(); // Normalize the search term for case-insensitive comparison
    
        // Filter conversations where the name of the other user contains the search term
        const filtered = notifications.filter((notification) =>
            notification.title.toLowerCase().includes(searchTerm)
        );
    
        // Update the state with the filtered conversations
        setFilteredNotifications(filtered);
    }
    
    const typeMessages = {
        newMessage: "Tienes un nuevo mensaje!",
        newQuestion: "Tienes una nueva pregunta!",
        bookPublished: "Tu libro ha sido publicado!",
        bookSold: `Tu libro "${activeNotification && activeNotification?.metadata?.bookTitle}" ha sido vendido!`,
        orderShipped: "Tu pedido ha sido entregado!",
        reviewReceived: `Tienes una nueva reseña de "${activeNotification && activeNotification?.metadata?.bookTitle}"!`
    };
    // Mark every notification as read

useEffect(() => {
    if (!activeNotification) return;
    async function fetchReadNotification() {
        try {
            const url = `http://localhost:3030/api/notifications/${activeNotification._id}/read`;
            const read = await fetch(url, { method: 'PUT' });
            if (!read.ok) {
                console.error('Error marking notification as read');
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchReadNotification();
}, [activeNotification?._id]); // Only trigger when the active notification changes
    return (
        <>
        <Header />
{/*----------------------------------------NOTIFICACIONES----------------------------------------------- */}
        <div className="sectionMessagesContainer">
                    <Link to='/notificaciones'>
                        <div className={`sectionMessage sectionMessageActive`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                                <path d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Notificaciones</span>
                        </div>
                    </Link>
                    <Link to='/mensajes'>
                        <div className={`sectionMessage `}  >
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                                <path d="M8.5 14.5H15.5M8.5 9.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            <span>Mensajes</span>
                        </div>
                    </Link>
                    </div>
        <div className="messagesContainer">
            <div className="conversationsContainer">
                {/*Notifications by user, make styles for the notification */}
                <input type="text" className="conversationsFilter" onChange={(event)=>filterNotifications(event)} placeholder="Buscar"/>

{/*----------------------------------------CADA CONVERSACIÓN----------------------------------------------- */}
                {(filteredNotifications && filteredNotifications.length !== 0) && filteredNotifications
                    .slice() // Ensure a new array is created to avoid mutating state
                    .reverse()
                    .map((notification) => (
                        <div
                            key={notification._id}
                            className={`conversationSpecific 
                                ${activeNotification && activeNotification._id === notification._id ? 'active' : ''}
                                ${!notification.read && activeNotification._id !== notification._id ? 'notRead': ''}`}
                            onClick={() => setActiveNotification(notification)}
                        >
                            
                            <div className="conversationSpecificTitleAndMessage">
                            <h2>
                            {notification.type ? (
                                <>
                                    {reduceText(typeMessages[notification.type] || notification.title, 40)}
                                </>
                                ) : null} 

                            </h2>
                            </div>
                            <span>{formatDate(notification?.createdIn) || ''}</span>
                            
                        </div>
                    ))}
            </div>
            {console.log(activeNotification)}
            <div className="chat">
                {/*Specific information for each notification */}
                <div className="headerMessage" style={{display: isMobile ? 'flex': 'none'}}>
                                    <svg 
                                    onClick={()=>setActiveNotification(null)}
                                    style={{transform:'rotate(180deg)'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={25} height={25} color={"#000000"} fill={"none"}><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div> 
                {(activeNotification && Object.keys(activeNotification).length !== 0) &&
                            <div className="messagesViewContainer" >
                                <div className="otherMessage" style={{padding: '5px'}}>{DetailedNotification(activeNotification)}</div>                             
                            </div>
                }

                            
                    
                    
            </div>
        </div>
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
        </>)
}