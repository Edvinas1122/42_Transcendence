"use client"; // This is a client component 👈🏽

import React, { useState, useEffect, useContext } from 'react';
import { UserProfile } from '@/app/dtos/AppData';
import FileUpload from './Upload/UploadFile';
import { AuthorizedFetchContext } from '@/app/context/authContext';

const PersonalProfile = () => {

	const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);
	const [ProfileData, setProfileData] = useState<UserProfile>({} as UserProfile);


	useEffect(() => {
		if (!token) return;
		const fetchProfileData = async () => {
			const personalProfileData = await fetchWithToken(`/users/profile/${token.id}`, {});
			const personalProfile = await personalProfileData.json();
			setProfileData(personalProfile);
		}
		fetchProfileData();
	}, [fetchWithToken, token]);

	if (loading)
		return (<p>Loading...</p>);
	return (
		<div>
			<h1>{ProfileData.name}</h1>

			<FileUpload />
		</div>
	);
}

export default PersonalProfile;
