import React, { useState, useEffect } from 'react';
import fetchWithToken from '@/app/network/fetchWithToken';

const FriendRequestCard = ({ friend, onAccept, onDeny }) => {

    const handleAccept = () => {
        onAccept(friend._id);
    };

    const handleDeny = () => {
        onDeny(friend._id);
    };

    return (
        <div>
            {/* <img src={}/> */}
            <h1>request</h1>
            <h1>{friend.name}</h1>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDeny}>Deny</button>
        </div>
    );
};

const FriendRequestsMenu = () => {

    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await fetchWithToken('/users/manage/get-all-pending-friend-request');
            const friendRequestsData = await response.json();

            setFriendRequests(friendRequestsData);
            console.log("freinds request ok");
        } catch (error) {
            console.error('Error fetching friend requests: ', error);
        }
    };

    const handleAcceptRequest = async (friendRequestId) => {
        try {
            const response = await fetchWithToken(`/users/manage/approve-friend-request/${friendRequestId}`, {
              method: 'POST',  
            });
            console.log("Accepted friend request!");
            // handle response and update UI?
            fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request: ', error);
        }
    };

    const handleDenyRequest = async (friendRequestId) => {
        console.log("Friend request denied");
        // Implement
    };

    return (
        <div>
            <h1>Friend Requests</h1>
            {!friendRequests && <h2>No pending friend requests</h2>}
            {friendRequests?.map((friend) => (
                <FriendRequestCard
                    key={friend.id}
                    friend={friend} 
                    onAccept={handleAcceptRequest} 
                    onDeny={handleDenyRequest}
                />
            ))}
        </div>
    );
};

export default FriendRequestsMenu;