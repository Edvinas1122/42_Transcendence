import React from 'react';
import { User } from '@/lib/DTO/AppData';

interface UserProfileDisplayProps {
	UserInfo: User;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = (
	{UserInfo}: UserProfileDisplayProps
) => {
	return (
		<div>
			<h1>{UserInfo.name}</h1>
		</div>
	);
};

export default UserProfileDisplay;