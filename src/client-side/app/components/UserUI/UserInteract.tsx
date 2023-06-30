"use client";
import "./UserProfile.css";
import Link from "next/link";
import GenericForm from '../GeneralUI/GenericForm';
import GenericButton from '../GeneralUI/GenericButton';
import GenericMultiStateButton from '../GeneralUI/GenericMultiStateButton';
import { faUserPlus, faUserXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import EditAvatar from "../PreferencesUI/EditAvatar";

const GenericFriendButton = ({userID, userStatus}: {userID: string, userStatus: string}) => {
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

const FriendInteractions = ({userID, userStatus}: {userID: string, userStatus: string}) => {
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

const UserEdit = () => {
	return (
		<div className="Component">
			{/* <GenericForm
			endpoint="/drive/upload"
			method="POST"
			fields={[
				{ name: 'Change Avatar', value: '', type: 'file'}
			]}
			/> */}
			<EditAvatar />
		</div>
	);
}

const UserInteract = ({userStatus, userID}: {userStatus: string, userID: string}) => {
	if (userStatus === "user") {
		return <UserEdit />
	} else {
		return <FriendInteractions userID={userID} userStatus={userStatus}/>
	};
}

export default UserInteract;