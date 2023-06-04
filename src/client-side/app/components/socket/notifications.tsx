"use client";

import React, { useEffect } from 'react';
import socketIOClient from "socket.io-client";
import Cookies from 'js-cookie';
import { rules as defaultRules, Rule } from './notifications.config';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL + "/events";  // Replace with your server URL

const SocketComponent: React.FC<{rules?: Rule[]}> = ({rules = defaultRules})=> {
  const token: string | undefined = Cookies.get('access_token');

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL, { query: { token } });

    // Event listener for socket 'connect' event
    socket.on('connect', () => {
      console.log('Connected to the server');
    });


    socket.on("events", (message: WSMessage) => {
      for (const rule of rules) {
        if (rule.match(message)) {
          const info = message.info;
          if (typeof info !== 'string') {
            for (const handler of rule.handlers) {
              if (handler.match(info)) {
                console.log("WS Received message");
                handler.action(message);
                break;
              }
            }
          }
          break;
        }
      }
    });

    // Cleanup function to remove event listener when component unmounts
    return () => {
      // socket.off("notification");
      socket.off("events");
      socket.off('connect');
    };
  }, []);  // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div>
      {/* ... your component UI ... */}
    </div>
  );
}

export default SocketComponent;