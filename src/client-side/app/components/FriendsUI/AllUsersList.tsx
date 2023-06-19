"use client"

import { User } from '@/lib/DTO/AppData';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

interface AllUsersDisplayProps {
	Users: User[];
}

const AllUsersDisplay: React.FC<AllUsersDisplayProps> = ({ Users }) => {
	const pathname = usePathname();
  
	return (
	  <div>
		<h1>AllUsers</h1>
		<ul>
		  {Users.map((user: User) => {
			const isActive = pathname.startsWith(`/user/${user._id}`);
			console.log(isActive);
			return (
				<li key={user._id}>
					{user.name}
					<Link href={`/user/${user._id}`}>
					View Profile
					</Link>
				</li>
			);
		  })}
		</ul>
	  </div>
	);
  }

export default AllUsersDisplay;