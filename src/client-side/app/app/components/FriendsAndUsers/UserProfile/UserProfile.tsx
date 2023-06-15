import React, { useState, useEffect, useContext } from 'react';
import fetchWithToken from '@/app/network/fetchWithToken';
import { useParams } from 'react-router-dom';
import sendFriendRequest from '../../Global/SendFriendRequest.module';
import blockUser from '../../Global/BlockUser.module';
import { AuthorizedFetchContext } from '@/app/context/authContext';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);

    const handleSendFriendRequest = () => {
        const sendFriendRequest = async () => {
            try {
                const response = await fetchWithToken(`/users/manage/send-friend-request/${user._id}`, {
                    method: 'POST',
                });

            } catch (error) {
                console.error("Send Friend request failed: ", error);
            }
        };
    };

    const handleBlockUser = () => {
        try {
            blockUser(userId);
        } catch (error) {
            console.error("Failed to block user: ", error);
        }
    };

    useEffect(() => {
        if (!loading)
            fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetchWithToken(`/users/profile/${userId}`, token); 
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
                {/* <img src={user.avatar}></img> */}
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