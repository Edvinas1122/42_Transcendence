"use client"; // This is a client component 👈🏽

import React, { useState, useEffect, useContext } from 'react';
import { UserProfile } from '@/app/dtos/AppData';
import FileUpload from './Upload/UploadFile';
import sendFriendRequest from '../Global/SendFriendRequest.module';
import blockUser from '../Global/BlockUser.module';
import { TokenContext } from '@/app/context/tokenContext';
import fetchWithToken from '@/app/network/fetchWithToken';

const PersonalProfile = () => {

    const [token, setToken] = useContext(TokenContext)
    const [Profile, setProfile] = useState<UserProfile>({
        _id: '',
        name: '',
        avatar: ''
    });

    const fetchProfile = async () => {
        try {
            const response = await fetchWithToken('/users/me', token);
            const profileData = await response.json();

            setProfile(profileData);
            console.log("Fetch profile ok");
        } catch (error) {
            console.error('Error fetching profile: ', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSendFriendRequest = () => {
        try {
            sendFriendRequest(Profile._id);
        } catch (error) {
            console.error("Send Friend request failed: ", error);
        }
    }; 

    const handleBlockUser = () => {
        try {
            blockUser(Profile._id);
        } catch (error) {
            console.error("Failed to block user: ", error);
        }
    }; //Remove later lmao, testing functions 

    return (
        <div>
            <h1>{Profile.name}</h1>
            <img src={Profile.avatar} alt={`${Profile.name} avatar`} />
            <FileUpload />
            <button onClick={handleSendFriendRequest}>Send friend request</button>
            <button onClick={handleBlockUser}>Block User</button>
        </div>
    );
}

export default PersonalProfile;
