"use client"; // This is a client component 👈🏽

import { UserProfile } from '@/app/dtos/AppData';
import FileUpload from './Upload/UploadFile';
import sendFriendRequest from '../Global/SendFriendRequest.module';
import blockUser from '../Global/BlockUser.module';

const PersonalProfile = ({props}: UserProfile) => {

    const Profile: UserProfile = props;

    const handleSendFriendRequest = () => {
        try {
            sendFriendRequest(Profile._id);
        } catch (error) {
            console.error("Send Friend request failed: ", error);
        }
    }; 

    const handleBlockUser = () => {
        try {
            blockUser(Profile._id);
        } catch (error) {
            console.error("Failed to block user: ", error);
        }
    }; //Remove later lmao, testing functions 

    return (
        <div>
            <h1>{Profile.name}</h1>
            <img src={Profile.avatar} alt={`${Profile.name} avatar`} />
            <FileUpload />
            <button onClick={handleSendFriendRequest}>Send friend request</button>
            <button onClick={handleBlockUser}>Block User</button>
        </div>
    );
}

export default PersonalProfile;
