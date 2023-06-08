"use client"; // This is a client component 👈🏽

import { User } from '@/app/dtos/AppData';

const PersonalProfile = ({props}: User) => {

    const Profile: User = props;

    return (
        <div>
            <h1>{Profile.name}</h1>
            <img src={Profile.avatar} alt={`${Profile.name} avatar`} />
        </div>
    );
}

export default PersonalProfile;
