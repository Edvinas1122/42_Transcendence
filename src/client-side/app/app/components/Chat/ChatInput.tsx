import React, { useState } from 'react';

const ChatInput = ({chatId}) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // sendMessage(message, chatId); //backend
    // setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={handleInputChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;