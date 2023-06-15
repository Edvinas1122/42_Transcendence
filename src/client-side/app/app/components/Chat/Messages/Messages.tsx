import fetchWithToken from '@/app/network/fetchWithToken';
import React, { useEffect, useState } from 'react';

const MessageBubble = ({message}) => {
    return (
        <div className="message-bubble">
            <div className="bubble-content">
                <h1>{message.content}</h1>
            </div>
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
            console.log("messages fetched from : ", chatId, messageArray, messages);
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }
    };

    let testmessage = {
        content:"If this message is showing, no messages are available in the chat",
        user:{
            name:"test user",
        },
    };

    return (
        <div className="chat-message-box">
            {/* {messages.length <= 0 && <p>No messages to display</p>} */}
            {messages.length <= 0 && <MessageBubble message={testmessage}/>}
            {messages.map((message) => {
                <MessageBubble
                    key={message._id}
                    message={message}/>
            })}
        </div>
    );
};

export default Messages;