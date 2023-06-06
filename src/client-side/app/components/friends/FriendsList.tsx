import React from 'react';
import FriendItem from './FriendItem';
import User from '../profiles/user.types';

interface FriendsListProps {
  friends: User[];
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {

  const onlineFriends = friends.filter((friend) => friend.isOnline);
  const offlineFriends = friends.filter((friend) => !friend.isOnline);
  return (
    <div className="friends-list">
      <h2>Online</h2>
      <div>
          {onlineFriends.map((friend) => (
              <FriendItem key={friend.id} friend={friend} />
          ))}
      </div>
      <h3>Offline</h3>
      <div>
            {offlineFriends.map((friend) => (
                <FriendItem key={friend.id} friend={friend} />
            ))}
      </div>
    </div>
  );
};

export default FriendsList;