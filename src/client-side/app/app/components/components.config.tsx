import AvailableChats from "./Chat/Chat";
import PersonalProfile from "./UserProfile/Profiles";
import Chats from "./Chat/Chat";
import { User, GroupChat } from '@/app/dtos/AppData';

const View3 = () => <div>View 3</div>;


const AppDisplays = [
	{
		component: Chats,
		name: "Chats",
		props: [],
		propsFetchAPI: "/chat/available",
		subscibe: "chat"
	},
	{
		component: PersonalProfile,
		name: "Personal Profile",
		props: {},
		propsFetchAPI: "/users/me",
		subscibe: "profile"
	},
	{
		component: View3,
		name: "View 3",
		props: {},
		subscibe: ""

	},
];

export default AppDisplays;