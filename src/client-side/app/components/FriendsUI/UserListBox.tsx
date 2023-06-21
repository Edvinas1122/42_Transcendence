import { User } from '@/lib/DTO/AppData';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

interface UsersDisplayProps {
  Users: User[];
}

interface UserListProps {
	Users: User[];
	BoxComponent: Function;
	Title: string;
	ListStyle?: string;
	BoxStyle?: string;
}

export const LinkUserBox: Function = ({ user }: { user: User }) => {
  return (
    <Link href={`/user/${user._id}`}>
      <UserBox user={user} />
    </Link>
  );
}

export const UserBox: Function = ({ user }: { user: User }) => {
	return (
	  <div className="Entity">
		  <strong>{user.name}</strong>
		  <span>{user.name}</span>
		  <div className="status"></div>
	  </div>
	);
  }

const UserListBox: Function = ({ Users, BoxComponent, ListStyle, BoxStyle }: { Users: User[], BoxComponent: Function, ListStyle?: string, BoxStyle?: string}) => {
//   const pathname = usePathname();
  
  return (
    <div>
      {Users.map((user: User) => {
        // const isActive = pathname.startsWith(`/user/${user._id}`);
        return (
          <BoxComponent key={user._id} user={user} />
        );
      })}
    </div>
  );
}

const UsersListDisplay: Function = ({ Users, BoxComponent, Title, ListStyle, BoxStyle }: UserListProps) => {
  return (
	<div>
		<div>
			<h1>{Title}</h1>
		</div>
		<div>
			<UserListBox Users={Users} BoxComponent={BoxComponent} ListStyle={ListStyle} BoxStyle={BoxStyle} />
		</div>
	</div>
  );
}

export default UsersListDisplay;