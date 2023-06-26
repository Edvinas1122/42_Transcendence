import React from 'react';
import { UserProfile, MatchHistory } from '@/lib/DTO/AppData';
import UIListBox from '../GeneralUI/GenericList';
import GenericForm from '../GeneralUI/GenericForm';
import GenericAchievement from './DummyAchievements';
import GenericButton from '../GeneralUI/GenericButton';
import { faUserPlus, faUserXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import UserInteract from './UserInteract';

const MatchHistoryDummy: MatchHistory[] = [
	{
		_id: "1",
		opponent: "bob",
		userScore: 7,
		opponentScore: 8,
		completed: true
	},
	{
		_id: "2",
		opponent: "barry",
		userScore: 65,
		opponentScore: 3,
		completed: true
	},
]

const UserInfoBox = ({ user }: { user: UserProfile }) => {
	return (
		<div className="Component">
			{user.avatar && <img src={user.avatar} alt={`Profile Image for ${user.name}`}/>}
			<h1>{user.name}</h1>
			<p>{user.Online ? user.Ingame ? "In game" : "Idle" : "Offline"}</p>
		</div>
	);
}

const MatchHistoryBox = ({ item, style }: { item: MatchHistory, style?: string }) => {
	return (
		<div className={"Entity " + style}>
			<strong>{item.opponent}</strong>
			<span>{item.userScore} | {item.opponentScore} </span>
		</div>
	);
}

// THIS IS OBVIOUSLY A SHITSHOW OF A FUNCTION, I WILL FIGURE OUT A BETTER WAY LMAO 
const UserStats = ({ user }: { user: UserProfile }) => {
	return (
		<div>
			<div className="Component">
				<h1>Rank #2</h1>
			</div>
			<section>
				<div className="Segment">
					<h2>Wins</h2>
					<p>7</p>
				</div>
				<div className="Segment">
					<h2>Losses</h2>
					<p>8</p>
				</div>
			</section>
			<div className="Component">
				<h1>Achievements</h1>
				<GenericAchievement id='0' />
				<GenericAchievement id='1' />
				<GenericAchievement id='2' />
			</div>
		</div>
	);
}

// const FriendInteractions = ({user}: {user: UserProfile}) => {
// 	return (
// 		<div className="Component">
// 			<GenericButton
// 				text="Remove Friend"
// 				type="button"
// 				icon={faUserXmark}
// 				endpoint={`users/manage/remove-friend/${user._id}`}
// 			/>
// 			<GenericButton
// 				text="Block User"
// 				type="button"
// 				icon={faUserSlash}
// 				endpoint={`users/manage/block-user/${user._id}`}
// 			/>
// 		</div>
// 	);
// }

// const NonFriendInteractions = ({user}: {user: UserProfile}) => {
// 	return (
// 		<div className="Component">
// 		<GenericButton
// 				text="Add Friend"
// 				type="button"
// 				icon={faUserXmark}
// 				endpoint={`users/manage/send-friend-request/${user._id}`}
// 			/>
// 			<GenericButton
// 				text="Block User"
// 				type="button"
// 				icon={faUserSlash}
// 				endpoint={`users/manage/block-user/${user._id}`}
// 			/>
// 		</div>
// 	);
// }

// const UserEdit = () => {
// 	return (
// 		<div className="Component">
// 			<GenericForm
// 			endpoint="/drive/upload"
// 			method="POST"
// 			fields={[
// 				{ name: 'Change Avatar', value: '', type: 'file'}
// 			]}
// 			/>
// 		</div>
// 	);
// }

const UserProfileUI: Function = ({UserInfo, isUser}: {UserInfo: UserProfile, isUser: boolean}) => {
	
	const userStatus = isUser ? "user" : UserInfo.friend ? "friend" : "nonFriend";

	return (
		<section className="Display">
			<div className="Segment">
				<UserInfoBox user={UserInfo} />
				<UserInteract userStatus={userStatus} userID={UserInfo._id}/>
			</div>
			<div className="Segment">
                <UserStats user={UserInfo} />
                <div className="Component">
                    <h1>Match History</h1>
					<UIListBox Items={MatchHistoryDummy} BoxComponent={MatchHistoryBox} />
				</div>
			</div>
		</section>
	);
};

export default UserProfileUI;