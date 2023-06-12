import React from 'react';
import { Link } from 'react-router-dom';

const ChatList = ({ chats }) => {
  return (
    <div>
      {chats ? <h2>Chats</h2> : <h2>No Chats Available</h2>}
      <ul>
        {chats.map((chat) => (
          <li key={chat._id}>
            <Link to={`/chat/${chat._id}`}>{chat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;