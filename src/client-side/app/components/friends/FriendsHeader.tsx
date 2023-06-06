import React from 'react';
import User from '../profiles/user.types'

const FriendsHeader: React.FC = ( user: User ) => {
  console.log("Friends HEader" + user);
  console.log(user.avatar);
  return (
    <div className="friends-header" >
      <img src={`${user.avatar}`} /> 
      <h1>{`${user.name}`}</h1>
      <p>my profile</p>
    </div>
  );
};

export default FriendsHeader;