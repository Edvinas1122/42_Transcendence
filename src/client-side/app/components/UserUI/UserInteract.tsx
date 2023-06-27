"use client";
import GenericForm from '../GeneralUI/GenericForm';
import GenericButton from '../GeneralUI/GenericButton';
import { faUserPlus, faUserXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons'

const GenericFriendButton = ({userID, userStatus}: {userID: string, userStatus: string}) => {
	switch (userStatus) {
		case 'received':
			return(
				<>
					<GenericButton
					text="Accept"
					type="button"
					endpoint={`/users/manage/approve-friend-request/${userID}`} />
					<GenericButton
					text="Reject"
					type="button"
					endpoint={`/users/manage/reject-friend-request/${userID}`} />
				</>);
		case 'sent': 
			return (
				<GenericButton
				text="Request Sent"
				disabled={true}
				/>);
		case 'approved': 
			return (
				<GenericButton
				text="Remove Friend"
				icon={faUserXmark}
				endpoint={`/users/manage/remove-friend/${userID}`}
				/>);
		default: 
			return (
				<GenericButton
				text="Add Friend"
				icon={faUserPlus}
				endpoint={`/users/manage/send-friend-request/${userID}`}
			/>);
	}
}

const FriendInteractions = ({userID, userStatus}: {userID: string, userStatus: string}) => {
	return (
		<div className="Component">
			<GenericFriendButton userID={userID} userStatus={userStatus}/>
			<GenericButton
				text="Block User"
				type="button"
				icon={faUserSlash}
				endpoint={`/users/manage/block-user/${userID}`}
			/>
		</div>
	);
}

const UserEdit = () => {
	return (
		<div className="Component">
			<GenericForm
			endpoint="/drive/upload"
			method="POST"
			fields={[
				{ name: 'Change Avatar', value: '', type: 'file'}
			]}
			/>
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