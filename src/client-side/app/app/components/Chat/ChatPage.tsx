import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GroupList from './GroupList';
import ChatInput from './ChatInput';

const chatDummy = {
    name :"chatname",
    _id : 2,
    users : [{
        name: "bob",
        id: 1,
    }, {
        name: "jane",
        id: 2,
    },
    ],
    messages: [
        {id: 1,
        text: "hello", 
        sender: "bob"},
        {id: 2, 
        text: "hi", 
        sender: "jane"},
    ],
};

const ChatPage = () => {
//   const { chatId } = useParams();
  const [chat] = useState(chatDummy);

//   useEffect(() => {
//     fetchChatData(chatId)
//       .then((data) => setChat(data))
//       .catch((error) => console.error(error));
//   }, [chatId]); //this needs to be a call to the API 

    const chatId = 2;
    // const chat = chatDummy;

  if (!chat) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <Link to={`/`}>Back</Link>
        {/* how to just go back to chats?? */}
        <GroupList users={chat.users} /> 
        {/* get users? */}
        <h2>Chat: {chat.name}</h2>
        <div>
            {chat.messages.map((message) => (
            <div key={message.id}>{message.sender}: {message.text}</div> 
            ))}
            {/* placeholder obvs */}
        </div>
            <ChatInput chatId={chat}/>
    </div>
    );
};

export default ChatPage;