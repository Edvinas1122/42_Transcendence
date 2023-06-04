"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from 'react';
import fetchWithToken from '../auth/fetchWithToken';
import useSocket from '../socket/useSocket';
import User from '../porfiles/user.types'
import { NotificationDisplay } from './notifications.popup';
import { RelationshipHandler } from '../socket/handlers/Relationship.handler';
import { WSMessage } from '../socket/message.type';


const Notifications = () => {
  const [users, setNotifications] = useState<User[]>([]);

  const fetchNotifications = async () => {
    // Fetch notifications from your endpoint and update state
    const response = await fetchWithToken('/users/manage/get-all-pending-friend-request');
    const data = await response.json();
    setNotifications(data);
  };

  const updateNotifications = async (data :WSMessage) => {
    fetchNotifications();
    RelationshipHandler(data);
    console.log(data);
  };

  // Fetch notifications on page load
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications when a socket event occurs
  useSocket('events', updateNotifications);

  return (
    <div>
      <h2>Notifiactions</h2>
      {users.length > 0 ? 
        users.map(user => <p key={user.id}>{user.name}</p>) 
        : 
        <p>No Updates</p>
      }
    </div>
  );
};

export default Notifications;