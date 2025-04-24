import { formatDate } from "../../assets/formatDate"
import { reduceText, reduceTextByFirstWord } from "../../assets/reduceText"
import { renderProfilePhoto } from "../../assets/renderProfilePhoto"
import { findUserByConversation } from "./helper"

function renderFilteredConversations(filteredConversations, activeConversation, setActiveConversation, setActiveUser, user, reducedUsers) {
    return <>
        {
        
            filteredConversations
                .sort((a, b) => {
                    const dateA = a?.lastMessage?.createdIn ? new Date(a?.lastMessage?.createdIn) : 0
                    const dateB = b?.lastMessage?.createdIn ? new Date(b?.lastMessage?.createdIn) : 0
                    return dateB - dateA // Sort in descending order by last message date
                })
                .map((conversation, index) => (
                    <div
                        key={index}
                        className={`conversationSpecific ${activeConversation?._id === conversation._id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveConversation(conversation)
                            setActiveUser(findUserByConversation(conversation, user, reducedUsers))
                        }}
                    >
                        <img
                            src={renderProfilePhoto(findUserByConversation(conversation, user, reducedUsers)?.fotoPerfil || '')}
                            alt={`${findUserByConversation(conversation, user, reducedUsers).nombre || 'User'}'s avatar`}
                        />
                        <div className='conversationSpecificTitleAndMessage'>
                            <h2>{findUserByConversation(conversation, user, reducedUsers).nombre || ''}</h2>
                            <span>
                                {(user && reducedUsers && conversation && conversation?.lastMessage && conversation?.lastMessage?.message) && (
                                    <>
                                        {conversation.lastMessage.userId === user._id
                                            ? 'Tu: '
                                            : `${reduceTextByFirstWord(findUserByConversation(conversation, user, reducedUsers).nombre || '')}: `}
                                        {reduceText(conversation?.lastMessage?.message, 20)}
                                    </>
                                )}

                            </span>
                        </div>
                        {/* 2024-12-21T17:01:32.197Z */}
                        <span>{formatDate(conversation?.lastMessage?.createdIn) || ''}</span>
                    </div>
                ))}</>
}



export {
    renderFilteredConversations
}