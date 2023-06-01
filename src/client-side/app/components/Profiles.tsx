"use client"; // This is a client component 👈🏽

import { useState, useEffect } from 'react';
import fetchWithToken from './auth/fetchWithToken';
import sendFriendRequest from './profiles/relationships';

function AllUsers() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithToken('/users/all')
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No profile data</p>;

    return (
        <div>
            {data.map((item) => (
                <div key={item.id}>
                    <h1>{item.name}</h1>
                    <p>{item.FullName}</p>
                    <img src={item.avatar} alt={`${item.name} avatar`} />
                    <button onClick={() => sendFriendRequest(item.id)}>Send Friend Request</button>
                </div>
            ))}
        </div>
    );
}

function UserProfile() {
    const [data, setData] = useState<any>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithToken('/users/me')
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No profile data</p>;


    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No profile data</p>;

    return (
        <div>
            <h1>{data.name}</h1>
            <p>{data.FullName}</p>
            <img src={data.avatar} alt={`${data.name} avatar`} />
        </div>
    );
}

export default UserProfile;
export { AllUsers };