"use client";
import "./UserProfile.css";
import Link from "next/link";
import GenericForm from '../GeneralUI/GenericForm';
import GenericButton from '../GeneralUI/GenericButton';
import GenericMultiStateButton from '../GeneralUI/GenericMultiStateButton';
import { faUserPlus, faUserXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import EditAvatar from "../PreferencesUI/EditAvatar";
import React, { useEffect, useState } from 'react';
import { serverFetch, setToken, serverFetchSerialized } from "@/lib/fetch.util";
import "./UserProfile.css";
import DisplayPopUp from "../EventsInfoUI/EventsInfo";

const TwoFaUI = ({user2FA}: {user2FA: boolean}) => {
    const [qrCodeURL, setQrCodeURL] = useState("");
    const [isLoading, setLoading] = useState(false);
	const [qrError, setQrError] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [used, setUsed] = useState(false);
	const [formState, setFormState] = useState({["code"]: ""});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormState({["code"]: value});
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let url;
		if (!user2FA) {
			url = "/2fa/activate";
		} else {
			url = "/2fa/deactivate"
		}
		try {
			serverFetchSerialized({
				uri: url,
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formState),
			}).then((response: any) => {
				if (!response.error) {
					setError(null);
					DisplayPopUp("Updated", response.message);
				} else {
					setError("Authentication error");
					DisplayPopUp("Updated", response.message, 2000, "warning");
				}
			})
			setQrCodeURL("");
			URL.revokeObjectURL(qrCodeURL);
		} catch (error) {
			setError("Authentication error");
			console.log(error);
		}
	}

    useEffect(() => {
        if (qrCodeURL === "" && !used && !user2FA) {  // only fetch QR code if user2FA is false
            setLoading(true);
            setUsed(true);
            const options: RequestInit = 
            {
                method: "POST",
                headers: {
                	'Content-Type' : "application/json"},
            }
            fetch(
                "/api/2fa/qr",
                options
            )
            .then(response => {
                if (!response.ok) {
                    setQrError("Could not generate QR Code");
                }
                return response.blob();
            })
            .then((qrCode) => {
                const imageURL = URL.createObjectURL(qrCode);
                setQrCodeURL(imageURL);
                setLoading(false);
            })
        }
    }, [user2FA, qrCodeURL, used])

    return (
        <div className="Component">
            <h2>{user2FA ? "Enter Code to Activate Two-Factor Authentication" :
						"Enter Code to Deactivate Two-Factor Authentication"}</h2>
            <p>Please download Google Authenticator, then generate a QR Code to scan and enter the code</p>
            {isLoading ? <h2>Loading...</h2> : !qrError && <img src={qrCodeURL !== "" ? qrCodeURL : undefined} />}
			{qrError !== "" && <p>{qrError}</p>}
            <form onSubmit={handleSubmit} > 
				<input 
				onChange={handleChange}
				type="text"
				name="code"
				placeholder="Type 6 Digit Code here..."
				/>
				<button type="submit">Submit</button>
			</form>
            {error && <h2>{error}</h2>}
        </div>
    )
}

const Set2Fa = ({user2FA}: {user2FA: boolean}) => {
	const [clicked, setClicked] = useState(false);

	const handleClick = (event: any) => {
		event.preventDefault();
		setClicked(true);
	}

	return (
		<div>
			<button onClick={handleClick}>{user2FA? "Deactivate 2-Factor Authentication" : "Activate 2-Factor Authentication"}</button>
			{clicked && <TwoFaUI
							user2FA={user2FA}
						/>
			}
		</div>
	)
}

const GenericFriendButton = ({userID, userStatus}: {userID: number, userStatus: string}) => {
	switch (userStatus) {
		case 'received':
			return(
				<Link href={'/friends'}>
					<GenericButton
					text="Accept"
					type="button"
					className="userButton"
					endpoint={`/users/manage/approve-friend-request/${userID}`} />
					<GenericButton
					text="Reject"
					type="button"
					className="userButton"
					endpoint={`/users/manage/reject-friend-request/${userID}`} />
				</ Link>
			);
		case 'sent': 
			return (
				<GenericButton
				text="Request Sent"
				className="userButton"
				disabled={true}/>
			);
		case 'approved': 
			return (
				<GenericMultiStateButton
				firstState={{text: "Remove Friend", 
								icon: faUserXmark,
								endpoint: `/users/manage/remove-friend/${userID}`,}}
				secondState={{text: "Add Friend", 
								icon: faUserPlus,
								endpoint: `/users/manage/send-friend-request/${userID}`,}}
				thirdState={{text:"Request Sent", 
								disabled: true,}}
				className="userButton"
				iconClassName="userButtonIcon"
				iconPosition="left"
				toggle={false}/>
			);
		default: 
			return (
				<GenericMultiStateButton 
				firstState={{text: "Add Friend", 
							icon: faUserPlus,
							endpoint: `/users/manage/send-friend-request/${userID}`,}}
				secondState={{text:"Request Sent", 
								disabled: true,}}
				className="userButton"
				iconClassName="userButtonIcon"
				iconPosition="left"
				toggle={false}/>
			);
	}
}

const FriendInteractions = ({userID, userStatus}: {userID: number, userStatus: string}) => {
	return (
		<div className="Component">
			<GenericFriendButton userID={userID} userStatus={userStatus}/>
			<Link href={'/friends'}>
				<GenericButton
					text="Block"
					type="button"
					className="userButton"
					icon={faUserSlash}
					iconPosition="left"
					iconClassName="userButtonIcon"
					endpoint={`/users/manage/block-user/${userID}`} />
			</Link>
		</div>
	);
}

const UserEdit = ({
	user2FA
}: {
	user2FA: boolean
}) => {
	return (
		<div className="Component">
			<GenericForm
				endpoint='/users/edit'
				method='POST'
				fields={[
					{name: "newName", 
					value: "",
					placeholder: "Update Username...",
					type:"text"},
				]}
				notify={true}
				resetAfterSubmit={true}
			/>
			<EditAvatar />
			<Set2Fa user2FA={user2FA} />
		</div>
	);
}

const UserInteract = ({
	userStatus,
	userID,
	user2FA
}: {
	userStatus: string,
	userID: number,
	user2FA?: boolean
}) => {
	if (userStatus === "user") {
		return <UserEdit user2FA={user2FA? true : false}/>
	} else {
		return <FriendInteractions userID={userID} userStatus={userStatus}/>
	};
}

export default UserInteract;