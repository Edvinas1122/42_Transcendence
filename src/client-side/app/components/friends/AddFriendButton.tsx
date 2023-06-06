import React from 'react';

const AddFriendButton: React.FC = () => {
  // Handle add friend logic
  const handleAddFriend = () => {
    console.log(`Add friend button clicked`);
  };
  return (
    <button onClick={handleAddFriend} >
      Add Friend
    </button>
  );
};

export default AddFriendButton;