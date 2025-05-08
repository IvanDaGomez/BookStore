import { formatDate } from "../../assets/formatDate"
import { reduceText, reduceTextByFirstWord } from "../../assets/reduceText"
import { renderProfilePhoto } from "../../assets/renderProfilePhoto"
import { findUserByConversation } from "./helper"

function renderFilteredConversations(filteredConversations, activeConversation, setActiveConversation, setActiveUser, user, reducedUsers) {
    return <>
        {
        
            filteredConversations
                .sort((a, b) => {
                    const dateA = a?.last_message?.created_in ? new Date(a?.last_message?.created_in) : 0
                    const dateB = b?.last_message?.created_in ? new Date(b?.last_message?.created_in) : 0
                    return dateB - dateA // Sort in descending order by last message date
                })
                .map((conversation, index) => (
                    <div
                        key={index}
                        className={`conversationSpecific ${activeConversation?.id === conversation.id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveConversation(conversation)
                            setActiveUser(findUserByConversation(conversation, user, reducedUsers))
                        }}
                    >
                        <img
                            src={renderProfilePhoto(findUserByConversation(conversation, user, reducedUsers)?.foto_perfil || '')}
                            alt={`${findUserByConversation(conversation, user, reducedUsers).nombre || 'User'}'s avatar`}
                        />
                        <div className='conversationSpecificTitleAndMessage'>
                            <h2>{findUserByConversation(conversation, user, reducedUsers).nombre || ''}</h2>
                            <span>
                                {(user && reducedUsers && conversation && conversation?.lastMessage && conversation?.last_message?.message) && (
                                    <>
                                        {conversation.lastMessage.user_id === user.id
                                            ? 'Tu: '
                                            : `${reduceTextByFirstWord(findUserByConversation(conversation, user, reducedUsers).nombre || '')}: `}
                                        {reduceText(conversation?.last_message?.message, 20)}
                                    </>
                                )}

                            </span>
                        </div>
                        {/* 2024-12-21T17:01:32.197Z */}
                        <span>{formatDate(conversation?.lastMessage?.created_in) || ''}</span>
                    </div>
                ))}</>
}



export {
    renderFilteredConversations
}