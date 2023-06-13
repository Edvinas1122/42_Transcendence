"use client"; // This is a client component 👈🏽

import { UserProfile } from '@/app/dtos/AppData';
import FileUpload from './Upload/UploadFile';
import sendFriendRequest from '../Global/SendFriendRequest.module';

const PersonalProfile = ({props}: UserProfile) => {

    const Profile: UserProfile = props;

    const handleSendFriendRequest = () => {
        try {
            sendFriendRequest(Profile._id);
        } catch (error) {
            console.log("Send Friend request failed: ", error);
        }
    }; //Remove later lmao

    return (
        <div>
            <h1>{Profile.name}</h1>
            <img src={Profile.avatar} alt={`${Profile.name} avatar`} />
            <FileUpload />
            <button onClick={handleSendFriendRequest}>Send friend request</button>
        </div>
    );
}

export default PersonalProfile;
