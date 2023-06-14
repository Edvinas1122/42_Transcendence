import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import fetchWithToken from '@/app/network/fetchWithToken';
import { TokenContext } from '@/app/context/tokenContext';

const FriendRequestCard = ({ friend, onAccept, onDeny }) => {

    const handleAccept = () => {
        onAccept(friend._id);
    };

    const handleDeny = () => {
        onDeny(friend._id);
    };

    return (
        <div className="friend-request-card">
            <img src={friend.avatar}/>
            <h1>{friend.name}</h1>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDeny}>Deny</button>
            <Link to={`/users/${friend._id}`}>View Profile</Link>
        </div>
    );
};

const FriendRequestsMenu = () => {

    const [token, setToken] = useContext(TokenContext);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await fetchWithToken('/users/manage/get-all-pending-friend-request', token);
            const friendRequestsData = await response.json();

            setFriendRequests(friendRequestsData);
            console.log(friendRequestsData);
        } catch (error) {
            console.error('Error fetching friend requests: ', error);
        }
    };

    const handleAcceptRequest = async (friendRequestId) => {
        try {
            const response = await fetchWithToken(`/users/manage/approve-friend-request/${friendRequestId}`, {
              method: 'POST',  
            }, token);
            console.log("Accepted friend request!");
            // handle response and update UI?
            fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request: ', error);
        }
    };

    const handleDenyRequest = async (friendRequestId) => {
        try {
            const response = await fetchWithToken(`/users/manage/reject-friend-request/${friendRequestId}`, {
              method: 'POST',  
            }, token);
            console.log("Rejected friend request!");
            // handle response and update UI?
            fetchFriendRequests();
        } catch (error) {
            console.error('Error rejecting friend request: ', error);
        }
    };

    return (
        <div className="friend-requests">
            <h1>Friend Requests</h1>
            {friendRequests.length <= 0 && <p>No pending friend requests</p>}
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