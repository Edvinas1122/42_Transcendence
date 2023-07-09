import SpinnerLoader from "@/components/GeneralUI/Loader"
import UserProfileUI from "@/components/UserUI/UserProfileLayout";
import { UserProfile } from "@/lib/DTO/AppData";
const dummyUser: UserProfile = {
	_id: 1,
	name: "Loading...",
	avatar: "/avatar-default.png",
	achievements: [],
	MatchHistory: [],
	rank: 0,
	wins: 0,
	losses: 0
}


export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	// return <SpinnerLoader />
	return (
		<UserProfileUI
			UserInfo={dummyUser}
			isUser={true}
			loading={true}
		/>
	);
}