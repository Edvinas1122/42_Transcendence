"use client";

import React, { useState, useEffect } from 'react';
import fetchWithToken from '@/app/network/fetchWithToken';

import FriendRequestsMenu from './PendingFriendRequests/FriendRequests';
import UserList from './UserList/UserList';
import BlockedUsers from './BlockedUsers/BlockedUsers';
import './FriendsAndUsers.css'

const FriendsAndUsers = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetchWithToken('/users/all'); 
            const usersData = await response.json();

            setUserList(usersData);
            console.log("Fetch users ok");
        } catch (error) {
            console.error('Error fetching users: ', error);
        }
    };

    return (
        <div>
            <FriendRequestsMenu />
            <UserList users={userList} />
            <BlockedUsers />
        </div>
    );
};

export default FriendsAndUsers;