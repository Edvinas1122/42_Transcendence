import React from 'react';
import { UserProfile, Achievement, MatchHistory } from '@/lib/DTO/AppData';
import UIListBox from '../GeneralUI/GenericList';
import GenericForm from '../GeneralUI/GenericForm';

const AchievementDummy: Achievement[] = [
	{
		_id: "1",
		name: "Won 69 Games!",
		description: "lmao nice"
	},
	{
		_id: "2",
		name: "Lost a match!",
		description: "too bad!"
	},
]

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


const AchievementBox = ({ item, style }: { item: Achievement, style?: string }) => {
	return (
		<div className={"Entity " + style}>
			<p>
				<strong>{item.name}</strong>
				<span>{item.description}</span>
				<p>{item.achievedOn}</p>
			</p>
		</div>
	);
}

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
			<p>
				<strong>{item.opponent}</strong>
				<span>{item.userScore} | {item.opponentScore} </span>
				<p>{item.created}</p>
			</p>
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
				<UIListBox Items={AchievementDummy} BoxComponent={AchievementBox} />
			</div>
		</div>
	);
}

const PlaceholderClientComponent = () => {
	return (
		<div className="Component">
			<h1>Here is a thing</h1>
		</div>
	);
}

const FriendInteractions = ({user}: {user: UserProfile}) => {

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

const UserProfileUI: Function = ({UserInfo}: {UserInfo: UserProfile}) => {
	return (
		<section className="Display">
			<div className="Segment">
				<UserInfoBox user={UserInfo} />
				<UserEdit />
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