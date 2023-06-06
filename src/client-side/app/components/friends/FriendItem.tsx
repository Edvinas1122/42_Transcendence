import React, { useState } from 'react';
import FriendDropdown from './FriendDropdown';
import User from '../profiles/user.types';
import UserProfile from '../Profiles';

interface FriendItemProps {
  friend: User;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);

  const handleMouseEnter = () => {
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownVisible(false);
  };

  let statusText = '';
  if (friend.isOnline) {
    statusText = friend.isInGame ? 'In Game' : 'Idle';
  } else {
    statusText = 'Offline';
  }

  return (
    <div className={`user ${friend.isOnline ? 'online-user' : 'offline-user'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <img className='avatar-thumbnail' src={friend.avatar} alt={`${friend.name} avatar image`} />
      <h3>{friend.name}</h3>
      <p className={friend.isOnline ? 'online-status' : 'offline-status'}>
        {statusText}
      </p>
      <button className="dropdown-button"/>
      { isDropdownVisible && (
        <div className="friend-dropdown-container">
          <FriendDropdown friend={friend} />
        </div>
      )}
    </div>
  );
};

export default FriendItem;