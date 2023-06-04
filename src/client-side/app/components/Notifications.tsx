"use client"; // This is a client component 👈🏽

import React, { useState, useEffect, useContext } from 'react';
import fetchWithToken from './auth/fetchWithToken';
import User from './porfiles/user.types'


// Create a new context
const NotificationsContext = React.createContext(null);

// Provide this context in your app
const NotificationsProvider = ({ children }) => {
  const [pendingRequest, setPendingRequest] = useState<User | null>(null);

  // Create a function to fetch notifications
  const fetchNotifications = () => {
    fetchWithToken(`/users/manage/get-last-pending-friend-request`)
      .then(response => response.json())
      .then(pendingRequest => setPendingRequest(pendingRequest))
      .catch(error => console.error('Error:', error));
  }

  // Fetch notifications initially
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationsContext.Provider value={{ pendingRequest, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Create a custom hook to use this context
const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }

  return context;
};

export default NotificationsProvider;
export { useNotifications };