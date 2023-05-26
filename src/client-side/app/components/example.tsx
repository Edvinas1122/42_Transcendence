// import React, { useEffect, useState } from 'react';

// type User = {
//   id: number;
//   name: string;
//   email: string;
// };

// const OnlineUsers: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:3000/users')
//       .then(response => response.json())
//       .then(data => {
//         setUsers(data);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Online Users</h1>
//       {users.map(user => (
//         <div key={user.id}>
//           <h2>{user.name}</h2>
//           <p>{user.email}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OnlineUsers;

import useSWR from 'swr';
 
const fetcher = (...args) => fetch(...args).then((res) => res.json());
 
function Profile() {
  const { data, error } = useSWR('http://localhost:3000/users', fetcher);
 
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
 
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  );
}