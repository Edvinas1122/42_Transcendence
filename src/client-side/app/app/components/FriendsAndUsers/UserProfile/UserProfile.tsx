import React, { useState, useEffect } from 'react';
import fetchWithToken from '@/app/network/fetchWithToken';
import { useParams } from 'react-router-dom';
import sendFriendRequest from '../../Global/SendFriendRequest.module';
import blockUser from '../../Global/BlockUser.module';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    const handleSendFriendRequest = () => {
        try {
            sendFriendRequest(userId);
        } catch (error) {
            console.error("Send Friend request failed: ", error);
        }
    };

    const handleBlockUser = () => {
        try {
            blockUser(userId);
        } catch (error) {
            console.error("Failed to block user: ", error);
        }
    };

    useEffect(() =>{
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetchWithToken(`/users/profile/${userId}`); 
            const userProfile = await response.json();

            setUser(userProfile);
            console.log("user profile fetched");

        } catch (error) {
            console.error("Failed to fetch user profile: ", error);
        }
    };

    if (user) {
        return (
            <div>
                <img src={user.avatar}></img>
                <h1>{user.name}</h1>
                {!user.friend && <button onClick={handleSendFriendRequest}>Add Friend</button>}
                <button onClick={handleBlockUser}>Block User</button>
            </div>
        );
    } else {
        return (
            <h1>Loading user profile...</h1>
        );
    }
};

export default UserProfile;