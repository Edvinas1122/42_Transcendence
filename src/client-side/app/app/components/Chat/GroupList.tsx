const GroupList = ({ users }) => {
    return (
      <div>
        {users ? <h2>Group Members</h2> : <h2>No Group Members</h2>}
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {/* <Link to={`/user/${user._id}`}>{user.name}</Link> */}
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
export default GroupList;