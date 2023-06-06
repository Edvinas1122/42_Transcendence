"use client"
import React, { useState, useEffect } from 'react';
import FriendsHeader from './FriendsHeader';
import FriendsList from './FriendsList';
import AddFriendButton from './AddFriendButton';
import User from '../profiles/user.types'
import fetchWithToken from '../auth/fetchWithToken';
import UserProfile, { AllUsers } from '../Profiles'


const FriendsMenu: React.FC = () => {
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
            const response = await fetchWithToken('/users/me');
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    fetchUser();
  }, []);

  const [friends, setFriends] = useState<User[]>([
    {
      _id: '1',
      name: 'User1',
      avatar: 'https://atto.scrolller.com/after-bens-comment-of-garfield-being-the-kirby-of-8a3mih4gkq-512x512.jpg',
      FullName: 'John Doe',
      isOnline: false,
    },
    {
      _id: '2',
      name: 'User2',
      avatar: 'https://atto.scrolller.com/after-bens-comment-of-garfield-being-the-kirby-of-8a3mih4gkq-512x512.jpg',
      FullName: 'Jane Smith',
      isOnline: true,
      isInGame: true,
    },
    {
      _id: '3',
      name: 'User3',
      avatar: 'https://atto.scrolller.com/after-bens-comment-of-garfield-being-the-kirby-of-8a3mih4gkq-512x512.jpg',
      FullName: 'Jane Smith',
      isOnline: true,
    },
    {
      _id: '4',
      name: 'User4',
      avatar: 'https://atto.scrolller.com/after-bens-comment-of-garfield-being-the-kirby-of-8a3mih4gkq-512x512.jpg',
      FullName: 'Jane Smith',
      isOnline: true,
    },
  ]);
  return (
    <div className="friends-menu">
      <FriendsHeader user={user}/>
      <h1>Users</h1>
      <FriendsList friends={friends} />
    </div>
  );
};

export default FriendsMenu;