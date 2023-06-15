"use client";
import React from 'react';
import { Chat } from '@/app/dtos/AppData';

const ChatList = ({chat}: {chat: Chat}) => {
  return (
    <div>
		  <h2>{chat.name}</h2>
			{/* <p>{chat.id}</p> */}
      {/* more beautiful things 
        eg group or single chat
        is user online 
        idk */}
    </div>
  );
};

export default ChatList;