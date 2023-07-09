"use client";
import React from 'react';
import {  User } from '@/lib/DTO/AppData';
import Image from 'next/image';
import { OnlineStatus } from './OnlineStatus';
import "./UserProfile.css"


export const UserInfoBox = ({
	user,
	scale,
	loading,
}: {
	user: User
	scale?: number
	loading?: boolean
}) => {

	return (
		<div className="Component UserInfo">
			<div>
			<h1>{user.name}</h1>
				<OnlineStatus
					id={user._id} 
					loading={loading}
				/>
			</div>
			<div className="ImageDisplay">
				<div className="ImageFrame" style={{ width: scale || 300, height: scale || 300 }}>
				{user.avatar && 
					<Image src={user.avatar}
						alt={`Profile Image for ${user.name}`}
						width={scale? scale :300}
						height={scale? scale :300}
					/>
				}
				</div>
			</div>
		</div>
	);
}
