import React from 'react';
import { UserProfile, MatchHistory } from '@/lib/DTO/AppData';
import UIListBox from '../GeneralUI/GenericList';
import GenericForm from '../GeneralUI/GenericForm';
import GenericAchievement from './DummyAchievements';

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
		<div className="Component">
			<div className="Component">
				<h1>Rank #2</h1>
			</div>
			<div className="Component">
				<div className="Segment">
					<h2>Wins</h2>
					<p>7</p>
				</div>
				<div className="Segment">
					<h2>Losses</h2>
					<p>8</p>
				</div>
			</div>
			<div className="Component">
				<h1>Achievements</h1>
				<GenericAchievement id='0' />
				<GenericAchievement id='1' />
				<GenericAchievement id='2' />
			</div>
		</div>
	);
}


// ADD FUNCTIONALITY TO THESE
const FriendInteractions = ({user}: {user: UserProfile}) => {
	return (
		<div className="Component">
			<strong>Remove Friend</strong>
			<strong>Block User</strong>
		</div>
	);
}

const NonFriendInteractions = ({user}: {user: UserProfile}) => {
	return (
		<div className="Component">
		<strong>Add Friend</strong>
		<strong>Block User</strong>
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

const UserProfileUI: Function = ({UserInfo, isUser}: {UserInfo: UserProfile, isUser: boolean}) => {
	var userInteraction;
	const userStatus = isUser ? "user" : UserInfo.friend ? "friend" : "nonFriend";
	if (userStatus === "user") {
		userInteraction = <UserEdit />
	} else if (userStatus === "friend") {
		userInteraction = <FriendInteractions user={UserInfo} />
	} else {
		userInteraction = <NonFriendInteractions user={UserInfo} />
	};

	return (
		<section className="Display">
			<div className="Segment">
				<UserInfoBox user={UserInfo} />
				{userInteraction}
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