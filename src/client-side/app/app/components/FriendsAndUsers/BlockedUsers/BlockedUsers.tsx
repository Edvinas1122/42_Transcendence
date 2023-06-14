import React, { useState, useEffect } from 'react';
import fetchWithToken from '@/app/network/fetchWithToken';

const BlockedUsers = () => {
    const [blockedUsers, setBlockedUsers] = useState([]);

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    const fetchBlockedUsers = async () => {
        try {
            const response = await fetchWithToken('/users/manage/get-blocked-users');
            const blockedData = await response.json();

            setBlockedUsers(blockedData);
            console.log("blocked users fetch ok");
        } catch (error) {
            console.error("Error fetching blocked users: ", error);
        }
    };

    const handleUnblock = () => {
        const blockOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blockeeId: blockeeId })
        };
    
        return fetchWithToken(`users/manage/unblock-user/${blockeeId}`, blockOptions)
            .then(data => console.log(data))
            .catch(error => console.error('Error: ', error));
    };

    return (
        <div className="blocked-users">
            <h2>Blocked Users</h2>
            {blockedUsers.length <= 0 && <p>No blocked users</p>}
            <ul>
                {blockedUsers.map((user) => (
                    <li key={user._id}>
                        {user.name}
                        <button onClick={() => handleUnblock(user._id)}>Unblock</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlockedUsers;