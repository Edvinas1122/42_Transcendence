import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComments, faUsers, faGamepad } from '@fortawesome/free-solid-svg-icons'
import "@/public/layout.css"

interface SidebarElementProps {
	name: string;
	link: string;
	icon: any;
}

const SidebarContent: SidebarElementProps[] = [
{
	name: 'Personal Profile',
	link: '/',
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

const SidebarElement = (props: SidebarElementProps) => {
	return (
		<div className="Entity">
		<Link href={props.link}>
			<span><FontAwesomeIcon icon={props.icon} size="1x" /> {props.name}</span>
		</Link>
		</div>
	);
}

const Sidebar = () => {
	return (
		<div className="Sidebar">
			{SidebarContent.map((element, index) => (
				<SidebarElement
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