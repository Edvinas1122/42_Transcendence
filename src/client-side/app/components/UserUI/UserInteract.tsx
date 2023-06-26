"use client";
import GenericForm from '../GeneralUI/GenericForm';
import GenericButton from '../GeneralUI/GenericButton';
import { faUserPlus, faUserXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons'

const FriendInteractions = ({user}: {user: string}) => {
	return (
		<div className="Component">
			<GenericButton
				text="Remove Friend"
				type="button"
				icon={faUserXmark}
				endpoint={`users/manage/remove-friend/${user}`}
			/>
			<GenericButton
				text="Block User"
				type="button"
				icon={faUserSlash}
				endpoint={`users/manage/block-user/${user}`}
			/>
		</div>
	);
}

//add friend request sent
const NonFriendInteractions = ({user}: {user: string}) => {
	// conditional user if invited 
    return (
		<div className="Component">
		<GenericButton
				text="Add Friend"
				type="button"
				icon={faUserPlus}
				endpoint={`users/manage/send-friend-request/${user}`}
			/>
			<GenericButton
				text="Block User"
				type="button"
				icon={faUserSlash}
				endpoint={`users/manage/block-user/${user}`}
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
	} else if (userStatus === "friend") {
		return <FriendInteractions user={userID} />
	} else {
		return <NonFriendInteractions user={userID} />
	};
}

export default UserInteract;