"use client";

import React, { useEffect } from 'react';
import socketIOClient from "socket.io-client";
import Cookies from 'js-cookie';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL + "/events";  // Replace with your server URL

const NotificationComponent: React.FC = () => {
  const token: string | undefined = Cookies.get('access_token');
  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL, { query: { token } });

    // Event listener for socket 'connect' event
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Event listener for "events" (or whatever event name your server is sending the 'Hello world!' message with)
    socket.on("events", (message) => {
      console.log("Received message: ", message);
    });

    // Event listener for "notification" event
    socket.on("notification", (data) => {
      console.log("Received notification: ", data);
      // Process the data as needed. 
      // For instance, you could show a browser notification or update state.
    });

    // Cleanup function to remove event listener when component unmounts
    return () => {
      socket.off("notification");
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

export default NotificationComponent;