import React from 'react';
import { User } from '@/lib/DTO/AppData';
import UserProfileUI from './UserProfileLayout';

interface UserProfileDisplayProps {
	UserInfo: User;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = (
	{UserInfo}: UserProfileDisplayProps
) => {
	return (
		<UserProfileUI userInfo={UserInfo} isUser={true} />
	);
};

export default UserProfileDisplay;