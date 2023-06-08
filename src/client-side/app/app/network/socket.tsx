"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import Cookies from 'js-cookie';

const SocketContext = React.createContext(null);

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL + "/events";

function SocketProvider({ children }) {
  const token = Cookies.get('access_token');
  const socket = socketIOClient(SOCKET_SERVER_URL, { query: { token } });

  useEffect(() => {
    return () => {
      socket && socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
export { SocketProvider };