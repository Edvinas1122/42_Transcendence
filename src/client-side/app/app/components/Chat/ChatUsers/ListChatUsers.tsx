"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fetchWithToken from '@/app/network/fetchWithToken';

const ListChatUsers = ({chatId}) => {
    const [ userList, setUserList ] = useState([]);

    useEffect(() => {
        fetchChatUsers();
    }, []);

    const fetchChatUsers = async () => {
        try {
            const response = await fetchWithToken(`/chat/roles/${chatId}/any`);
            const chatUserList = await response.json();

            setUserList(chatUserList);
            console.log("Chat users fetched", userList);
        } catch (error) {
            console.error("Error Fetching Chat Users: ", error);
        }
    };

    const chatOwner = userList.filter((user) => user.Role === "Owner");
    const chatAdmins = userList.filter((user) => user.Role === "Admin");
    const chatParticipants = userList.filter((user) => user.Role === "Participant");

    return (
        <div className="chat-user-list">
            <h1>Chat Users</h1>
            <h2>Owner: </h2>
            <Link to={`/users/${chatOwner._id}`}>{chatOwner.name}</Link>
            <h2>Admins:</h2>
            {chatAdmins.map((admin) => (
                <Link key={admin._id} to={`/users/${admin._id}`}>{admin.name}</Link>
            ))}
            <h2>Users:</h2>
            {chatParticipants.map((user) => (
                <Link key={user._id} to={`/users/${user._id}`}>{user.name}</Link>
            ))}
        </div>
    );
};

export default ListChatUsers;