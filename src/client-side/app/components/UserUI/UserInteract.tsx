"use client";
import "./UserProfile.css";
import Link from "next/link";
import GenericButton from '../GeneralUI/GenericButton';
import GenericMultiStateButton from '../GeneralUI/GenericMultiStateButton';
import { faUserPlus, faUserXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react';
import "./UserProfile.css";
import UserEdit from "./EditProfileForm";

const GenericFriendButton = ({userID, userStatus}: {userID: number, userStatus: string}) => {
	switch (userStatus) {
		case 'received':
			return(
				<Link href={'/friends'}>
					<GenericButton
					text="Accept"
					type="button"
					className="userButton"
					endpoint={`/users/manage/approve-friend-request/${userID}`} />
					<GenericButton
					text="Reject"
					type="button"
					className="userButton"
					endpoint={`/users/manage/reject-friend-request/${userID}`} />
				</ Link>
			);
		case 'sent': 
			return (
				<GenericButton
				text="Request Sent"
				className="userButton"
				disabled={true}/>
			);
		case 'approved': 
			return (
				<GenericMultiStateButton
				firstState={{text: "Remove Friend", 
								icon: faUserXmark,
								endpoint: `/users/manage/remove-friend/${userID}`,}}
				secondState={{text: "Add Friend", 
								icon: faUserPlus,
								endpoint: `/users/manage/send-friend-request/${userID}`,}}
				thirdState={{text:"Request Sent", 
								disabled: true,}}
				className="userButton"
				iconClassName="userButtonIcon"
				iconPosition="left"
				toggle={false}/>
			);
		default: 
			return (
				<GenericMultiStateButton 
				firstState={{text: "Add Friend", 
							icon: faUserPlus,
							endpoint: `/users/manage/send-friend-request/${userID}`,}}
				secondState={{text:"Request Sent", 
								disabled: true,}}
				className="userButton"
				iconClassName="userButtonIcon"
				iconPosition="left"
				toggle={false}/>
			);
	}
}

const FriendInteractions = ({userID, userStatus}: {userID: number, userStatus: string}) => {
	return (
		<div className="Component">
			<GenericFriendButton userID={userID} userStatus={userStatus}/>
			<Link href={'/friends'}>
				<GenericButton
					text="Block"
					type="button"
					className="userButton"
					icon={faUserSlash}
					iconPosition="left"
					iconClassName="userButtonIcon"
					endpoint={`/users/manage/block-user/${userID}`} />
			</Link>
		</div>
	);
}

// const UserEdit = ({
// 	user2FA
// }: {
// 	user2FA: boolean
// }) => {
// 	const router = useRouter();
// 	const searchParams = useSearchParams();
// 	const search = searchParams.get("firstTime");

// 	const handleImageUpdate = () => {
// 		// router.replace("/user"); // soft reload
// 		window.location.reload(); // hard reload
// 		console.log("image updated----");
// 	}
// 	// router.reload(window.location.pathname)
// 	return (
// 		<div className={`Component ${search ? "POP": ""}`}>
// 			<GenericForm
// 				endpoint='/users/edit'
// 				method='POST'
// 				fields={[
// 					{
// 						name: "newName", 
// 						value: "",
// 						placeholder: "Update Username...",
// 						type:"text"
// 				},
// 				]}
// 				notify={true}
// 				resetAfterSubmit={true}
// 				effectFunction={handleImageUpdate}
// 			/>
// 			<EditAvatar />
// 			<Set2Fa user2FA={user2FA} />
// 		</div>
// 	);
// }

const UserInteract = ({
	userStatus,
	userID,
	user2FA
}: {
	userStatus: string,
	userID: number,
	user2FA?: boolean
}) => {
	if (userStatus === "user") {
		return <UserEdit user2FA={user2FA? true : false}/>
	} else {
		return <FriendInteractions userID={userID} userStatus={userStatus}/>
	};
}

export default UserInteract;