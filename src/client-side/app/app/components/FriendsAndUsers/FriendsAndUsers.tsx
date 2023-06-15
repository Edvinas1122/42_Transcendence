"use client";

import React, { useState, useEffect, useContext } from 'react';
import FriendRequestsMenu from './PendingFriendRequests/FriendRequests';
import UserList from './UserList/UserList';
import BlockedUsers from './BlockedUsers/BlockedUsers';
import './FriendsAndUsers.css'
import { UserProfileContext } from '@/app/context/appDataProvider';
import { AuthorizedFetchContext } from '@/app/context/authContext';

const FriendsAndUsers = () => {
    const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        if (!loading)
            fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetchWithToken('/users/all'); 
            const usersData = await response.json();
            setUserList(usersData);
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