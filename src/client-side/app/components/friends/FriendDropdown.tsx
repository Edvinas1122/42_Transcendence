import React from 'react';

interface FriendDropdownProps {
  friend: Friend;
}

const FriendDropdown: React.FC<FriendDropdownProps> = ({ friend }) => {
  // Handle dropdown actions logic
  const handleDropdownClick = (option) => {
    console.log(`Clicked ${option} for ${friend.name}`);
  };  

  return (
    <div className="dropdown-options">
      <li onClick={() => handleDropdownClick('Send Message')}>Send Message</li>
      <li onClick={() => handleOptionClick('Invite to Game')}>Invite to Game</li>
      <li onClick={() => handleOptionClick('See Profile')}>See Profile</li>
      <li onClick={() => handleOptionClick('Block User')}>Block User</li>
    </div>
  );
};

export default FriendDropdown;