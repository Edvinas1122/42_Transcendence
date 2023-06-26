"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComments, faUsers, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { useRouter, usePathname } from 'next/navigation';
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

export const SidebarElement = (props: SidebarElementProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const firstLink = SidebarContent[0].link; // first link of sidebar
	const handleLinkClick = pathname !== firstLink ? () => router.replace(props.link) : () => router.push(props.link);
	const ActiveStyle = "/" + pathname.split('/')[1] === props.link ? 'Active' : '';

	return (
		<div className={`Entity ${ActiveStyle}`} style={{ cursor: 'pointer' }} onClick={handleLinkClick}>
			<span><FontAwesomeIcon icon={props.icon} size="1x" /> {props.name}</span>
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