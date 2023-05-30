"use client"; // This is a client component 👈🏽

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const fetchWithToken = async (service: string): Promise<any> => {
    const token: string | undefined = Cookies.get('access_token');

    console.log("Fetching with token: " + token);
    if (!token) {
        throw new Error('Token not found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${service}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
}

function Profile() {
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
				const url = process.env.NEXT_PUBLIC_INTRA_LINL;
				window.open(url, '_self');
            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No profile data</p>;

    return (
        <div>
            {data.map((item) => (
                <h1 key={item.id}>{item.name}</h1>
            ))}
        </div>
    );
}

export default Profile;