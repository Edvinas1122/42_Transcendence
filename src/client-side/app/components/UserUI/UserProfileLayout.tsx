import { UserProfile, MatchHistory, Achievement, User } from '@/lib/DTO/AppData';
import UIListBox from '../GeneralUI/GenericList';
import UserInteract from './UserInteract';
import "./UserProfile.css"
// import SpinnerLoader, { SpinnerLoader2, SpinnerLoaderSmall } from '../GeneralUI/Loader';
// import { Suspense } from 'react';
import { UserInfoBox } from './UserProfileUI';



const GenericAchievement = ({item}: {item: Achievement}) => {

    return (
        <div className="Entity Achievement">
            <p>
                {/* <span> <FontAwesomeIcon icon={item?.icon} size="sm"/> </span> */}
                <strong>{item?.name}</strong>
                <span>{item?.description}</span>
            </p>
        </div>
    );
}


const MatchHistoryBox = ({ item }: { item: MatchHistory}) => {
	return (
		<div className={"Entity"}>
			<strong>VS: {item.opponent} </strong>
			<span>{item.userScore} | {item.opponentScore} </span>
		</div>
	);
}

const UserStats = ({ user }: { user: UserProfile }) => {

	return (
		<div className="Segment">
			<div className="Component">
				<h1>Rank </h1>
				{!user.rank ? <p>User not ranked</p> : <h1>#{user?.rank}</h1>}
			</div>
			<section>
				<div className="Component">
					<h2>Wins</h2>
					<p>{user.wins}</p>
				</div>
				<div className="Component">
					<h2>Losses</h2>
					<p>{user.losses}</p>
				</div>
			</section>
			<div className="Component">
				<h1>Achievements</h1>
				<UIListBox 
					Items={user.achievements}
					BoxComponent={GenericAchievement}
					emptyMessage="User does not have any achievements yet"
				/>
			</div>
		</div>
	);
}

const DummyLoadingUser: UserProfile = {
	_id: 1,
	name: "Loading...",
	avatar: "/avatar-default.png",
	achievements: [],
	MatchHistory: [],
	rank: 0,
	wins: 0,
	losses: 0
}

const UserProfileUI: Function = ({
	UserInfo,
	isUser,
	loading
}: {
	UserInfo: UserProfile,
	isUser: boolean,
	loading?: boolean
}) => {
	
	const userStatus = isUser ? "user" : UserInfo.friend? UserInfo.friend : "none";

	return (
		<section className="Display UserPage">
			<div className="Segment">
				<UserInfoBox user={UserInfo} loading={loading} />
				<div className="Component UserInteract">
					<UserInteract userStatus={userStatus} userID={UserInfo._id} user2FA={UserInfo.twoFA}/>
				</div>
			</div>
			<div className="Segment">
				<div className="Component UserStats">
					<UserStats user={UserInfo} />
				</div>
				<div className="Component MatchHistory">
					<h1 className="Title">Match History</h1>
					<UIListBox Items={UserInfo.MatchHistory} BoxComponent={MatchHistoryBox} emptyMessage="User has not played any matches"/>
				</div>
			</div>
		</section>
	);
};

export default UserProfileUI;