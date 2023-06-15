"use client";
import { Link } from 'react-router-dom';
import { AuthorizedFetchContext } from '@/app/context/authContext';

function Sidebar() {

	return (
		<div>
		{/* Update the sidebar display when a link is clicked */}
		<nav>
			<ul>
			<li>
				<Link to="/user">Profile</Link>
			</li>
			<li>
				<Link to="/friends">Friends</Link>
			</li>
			<li>
				<Link to="/chat">Chat</Link>
			</li>
			</ul>
		</nav>
		</div>
	);
}

export default Sidebar;