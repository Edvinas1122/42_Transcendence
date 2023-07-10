import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComments, faUsers, faGamepad } from '@fortawesome/free-solid-svg-icons'
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

const SidebarElement = (props: SidebarElementProps) => {
	// const router = useRouter();
	// const pathname = usePathname();


	const firstLink = SidebarContent[0].link; // first link of sidebar
	// const handleLinkClick = pathname !== firstLink ? () => router.replace(props.link) : () => router.push(props.link);
	// const replace = pathname !== firstLink ? true : false;
	const replace = false;
	// const ActiveStyle = "/" + pathname.split('/')[1] === props.link ? 'Active' : '';

	return (
		<Link href={props.link} replace={replace}>
		<div className={`Entity`} style={{ cursor: 'pointer' }} >
			<span><FontAwesomeIcon icon={props.icon} size="1x" /> {props.name}</span>
		</div>
		</Link>
	);
}

const Sidebar = ({ params }: { params: { id: string } }) => {
	console.log("log here params", params);
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