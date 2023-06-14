import fetchWithToken from '@/app/network/fetchWithToken';
import React, { useEffect, useState } from 'react';

const MessageBubble = ({message}) => {
    return (
        <div>
            <h1>{message.content}</h1>
            <p>{message.user.name}</p>
        </div>
    );
};

const Messages = ({chatId}) => {
    const [messages, setMessages] = useState([]);

    // Add event listener 

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetchWithToken(`/chat/messages/${chatId}`);
            const messageArray = await response.json();

            setMessages(messageArray);
            console.log("messages fetched")
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }
    };

    return (
        <div>
            {messages.length <= 0 && <p>No messages to display</p>}
            {messages.map((message) => {
                <MessageBubble
                    key={message._id}
                    message={message}/>
            })}
        </div>
    );
};

export default Messages;