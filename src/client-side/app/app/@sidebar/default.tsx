import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComments, faUsers, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { SidebarElement } from '@/components/GeneralUI/Sidebar';
import Link from 'next/link';
import "@/public/layout.css"

interface SidebarElementProps {
	name: string;
	link: string;
	icon: any;
}

const SidebarContent: SidebarElementProps[] = [
{
	name: 'Personal Profile',
	link: '/user',
	icon: faUser,
},
{
	name: 'Chats',
	link: '/chat',
	icon: faComments,
},
{
	name: 'Friends and Users',
	link: '/friends',
	icon: faUsers,
},
{
	name: 'Pong',
	link: '/game',
	icon: faGamepad,
}
];

const SidebarElementLink = (props: SidebarElementProps) => {

	return (
		<SidebarElement {...props}/>
	);
}

const Sidebar = ({ params }: { params: { id: string } }) => {

	return (
		<div className="Sidebar">
			{SidebarContent.map((element, index) => (
				<SidebarElementLink
					key={index}
					name={element.name}
					link={element.link}
					icon={element.icon}
				/>
			))}
		</div>
	);
};

export default Sidebar;