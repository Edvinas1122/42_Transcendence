 import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthorizedFetchContext } from '@/app/context/authContext';
import { UsersContext } from '@/app/context/appDataProvider';
import { User } from '@/app/dtos/AppData';
import Image from 'next/image';

interface FriendRequestCardProps {
    friend: User;
    onAccept: (id: string) => Promise<void>;
    onDeny: (id: string) => Promise<void>;
  }

const FriendRequestCard = ({ friend, onAccept, onDeny }: FriendRequestCardProps) => {

    const handleAccept = () => {
        onAccept(friend._id);
    };

    const handleDeny = () => {
        onDeny(friend._id);
    };

    return (
        <div className="friend-request-card">
            {/* <Image src={friend.avatar}/> */}
            <h1>{friend.name}</h1>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDeny}>Deny</button>
            <Link to={`/users/${friend._id}`}>View Profile</Link>
        </div>
    );
};

const FriendRequestsMenu = () => {

    const { fetchWithToken, loading } = useContext(AuthorizedFetchContext);
    const { friendInvites, fetchInvitations } = useContext(UsersContext);

	useEffect(() => {
		fetchInvitations();
	}, [fetchInvitations]);

    const handleAcceptRequest = async (friendRequestId: string) => {
        try {
            const response = await fetchWithToken(`/users/manage/approve-friend-request/${friendRequestId}`, {
              method: 'POST',  
            });
            console.log("Accepted friend request!");
            // handle response and update UI?
            fetchInvitations();
        } catch (error) {
            console.error('Error accepting friend request: ', error);
        }
    };

    const handleDenyRequest = async (friendRequestId: string) => {
        try {
            const response = await fetchWithToken(`/users/manage/reject-friend-request/${friendRequestId}`, {
              method: 'POST',  
            });
            console.log("Rejected friend request!");
            // handle response and update UI?
            fetchInvitations();
        } catch (error) {
            console.error('Error rejecting friend request: ', error);
        }
    };

    if (loading)
        return (<p>Loading...</p>);
    return (
        <div className="friend-requests">
            <h1>Friend Requests</h1>
            {friendInvites.length <= 0 && <p>No pending friend requests</p>}
            {friendInvites?.map((friend: User) => (
                <FriendRequestCard
                    key={friend._id}
                    friend={friend} 
                    onAccept={handleAcceptRequest} 
                    onDeny={handleDenyRequest}
                />
            ))}
        </div>
    );
};

export default FriendRequestsMenu;