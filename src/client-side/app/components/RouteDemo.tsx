import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/HomePage">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/users">Users</Link>
        </li>
        <li>
          <Link href="/auth">Auth</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;