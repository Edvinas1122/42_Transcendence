import React from 'react';
import { UserProfile, MatchHistory } from '@/lib/DTO/AppData';
import UIListBox from '../GeneralUI/GenericList';
import GenericAchievement from './Placeholders/DummyAchievements';
import UserInteract from './UserInteract';
import Image from 'next/image';
import fetchWithToken from '@/lib/fetch.util';
import "./UserProfile.css"

const MatchHistoryDummy: MatchHistory[] = [
	{
		_id: 1,
		opponent: "bob",
		userScore: 7,
		opponentScore: 8,
		completed: true
	},
	{
		_id: 2,
		opponent: "barry",
		userScore: 65,
		opponentScore: 3,
		completed: true
	},
]

const UserInfoBox = ({ user }: { user: UserProfile }) => {
	return (
		<div className="Component UserInfo">
			<div>
			<h1>{user.name}</h1>
			<p>{user.Online ? user.Ingame ? "In game" : "Idle" : "Offline"}</p>
			</div>
			<div className="ImageFrame">
			{user.avatar && <Image src={"/public/" + user.avatar} alt={`Profile Image for ${user.name}`} width={60} height={60}/>}
			</div>
		</div>
	);
}

const MatchHistoryBox = ({ item }: { item: MatchHistory}) => {
	return (
		<div className={"Entity"}>
			<strong>{item.opponent}</strong>
			<span>{item.userScore} | {item.opponentScore} </span>
		</div>
	);
}

// THIS IS OBVIOUSLY A SHITSHOW OF A FUNCTION, I WILL FIGURE OUT A BETTER WAY LMAO 
const UserStats = ({ user }: { user: UserProfile }) => {



	return (
		<div className="Segment">
			<div className="Component">
				<h1>Rank #2</h1>
			</div>
			<section>
				<div className="Component">
					<h2>Wins</h2>
					<p>7</p>
				</div>
				<div className="Component">
					<h2>Losses</h2>
					<p>8</p>
				</div>
			</section>
			<div className="Component">
				<h1>Achievements</h1>
				<GenericAchievement id={0} />
				<GenericAchievement id={1} />
				<GenericAchievement id={2} />
			</div>
		</div>
	);
}

const UserProfileUI: Function = async ({UserInfo, isUser}: {UserInfo: UserProfile, isUser: boolean}) => {
	
	const userStatus = isUser ? "user" : UserInfo.friend? UserInfo.friend : "none";
	const MachHistory = await fetchWithToken(`/game/match-history/${UserInfo._id}`);

	return (
		<section className="Display UserPage">
			<div className="Segment">
					<UserInfoBox user={UserInfo} />
				<div className="Component UserInteract">
					<UserInteract userStatus={userStatus} userID={UserInfo._id}/>
				</div>
			</div>
			<div className="Segment">
				<div className="Component UserStats">
					<UserStats user={UserInfo} />
				</div>
				<div className="Component MatchHistory">
					<h1 className="Title">Match History</h1>
					<UIListBox Items={MachHistory} BoxComponent={MatchHistoryBox} />
				</div>
			</div>
		</section>
	);
};

export default UserProfileUI;