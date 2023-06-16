import Link from 'next/link';

const Sidebar = () => {
  return (
    <div>
      <Link href="/">Personal Profile</Link>
      <Link href="/chat">Chats</Link>
      <Link href="/friends">Friends and Users</Link>
    </div>
  );
};

export default Sidebar;