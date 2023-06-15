"use client"; // This is a client component 👈🏽

import React, { useState, useEffect, useContext } from 'react';
import { UserProfile } from '@/app/dtos/AppData';
import FileUpload from './Upload/UploadFile';
import { AuthorizedFetchContext } from '@/app/context/authContext';

const PersonalProfile = () => {

    const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);
    const [ProfileData, setProfileData] = useState<UserProfile>({} as UserProfile);

    const fetchProfileData = async () => {
        const personalProfileData = await fetchWithToken(`/users/profile/${token.id}`, {});
        const personalProfile = await personalProfileData.json();
        setProfileData(personalProfile);
    }

    useEffect(() => {
        if (!loading)
            fetchProfileData();
    });

    return (
        <div>
            <h1>{ProfileData.name}</h1>
            <img src={ProfileData.avatar} alt={`${ProfileData.name} avatar`} />
            <FileUpload />
        </div>
    );
}

export default PersonalProfile;
