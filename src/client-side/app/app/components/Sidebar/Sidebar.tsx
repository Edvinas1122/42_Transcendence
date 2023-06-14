import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import PersonalProfile from "../UserProfile/Profiles";
import FriendsAndUsers from "../FriendsAndUsers/FriendsAndUsers";
import Chats from "../Chat/Chat";

function Sidebar() {
  const { displays, setDisplays } = useContext(SidebarContext);

  const renderComponent = () => {
    switch(displays) {
      case 'profile':
        return <PersonalProfile />;
      case 'friends':
        return <FriendsAndUsers />;
      case 'chat':
        return <Chats />;
      // Add more cases as necessary for different displays
      default:
        return null;
    }
  }

  return (
    <div>
      {/* Update the sidebar display when a link is clicked */}
      <nav>
        <ul>
          <li>
            <button onClick={() => setDisplays('profile')}>Profile</button>
          </li>
          <li>
            <button onClick={() => setDisplays('friends')}>Friends</button>
          </li>
          <li>
            <button onClick={() => setDisplays('chat')}>Chat</button>
          </li>
        </ul>
      </nav>

      {/* Render the component based on the value of displays */}
      {renderComponent()}
    </div>
  );
}

export default Sidebar;