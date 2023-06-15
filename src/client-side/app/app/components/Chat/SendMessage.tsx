"use client"; // This file is client-side only

import React, { useState, FC } from 'react';
import fetchWithToken from '@/app/network/fetchWithToken';
import { SendMessageDto } from '@/app/dtos/PostData';

interface SendMessageProps {
  chatId: string | null;
}

const SendMessage: React.FC<SendMessageProps> = ({chatId}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    const messageData: SendMessage = new SendMessageDto(message, '');
    console.log("in SendMessage: " + messageData.content);
    if (chatId) {
      try {
          await fetchWithToken(`/chat/messages/${chatId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });
        setMessage(''); // Clear the message input after sending
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please select a chat first.');
    }
  };

  if (chatId === 0) {
    return (
      <div className="chat-send-message">
        <p>Select a chat to continue...</p>
      </div>
      
    );
  } else {
    return (
      <div className="chat-send-message">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="message the chat..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        <p>Selected: {chatId}</p>
        </form>
      </div>
    );
  };
};

export default SendMessage;