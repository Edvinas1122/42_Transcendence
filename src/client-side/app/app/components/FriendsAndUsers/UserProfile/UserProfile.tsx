"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
// import blockUser from '../../Global/BlockUser.module';
import { AuthorizedFetchContext } from '@/app/context/authContext';
import { User } from '@/app/dtos/AppData';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);

    const handleSendFriendRequest = () => {
        const sendFriendRequest = async () => {
			if (userId) {
				alert("Friend request sent!");
				try {
					console.log("Sending friend request...", userId);
					const response = await fetchWithToken(`/users/manage/send-friend-request/${userId}`, {
						method: 'POST',
					});
	
				} catch (error) {
					console.error("Send Friend request failed: ", error);
				}
			}
        };
    };

    const handleBlockUser = () => {
		const blockUser = async () => {
			if (userId) {
				alert("User blocked!");
				try {
					console.log("Blocking user...", userId);
					const response = await fetchWithToken(`/users/manage/block-user/${userId}`, {
						method: 'POST',
					});
	
				} catch (error) {
					console.error("Block user failed: ", error);
				}
			}
		};
    };

    useEffect(() => {
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
        if (!loading)
            fetchUser();
    }, [loading, fetchWithToken, token, userId]);
    

    if (user && !loading) {
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