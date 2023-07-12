"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditAvatar from "../PreferencesUI/EditAvatar";
import GenericForm from '../GeneralUI/GenericForm';
import DisplayPopUp from "../EventsInfoUI/EventsInfo";
import { serverFetch, setToken, serverFetchSerialized } from "@/lib/fetch.util";


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
        <div className="Component TWOFA">
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

interface UserEditProps {
	user2FA: boolean;
}

const UserEdit: React.FC<UserEditProps> = ({
	user2FA
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const search = searchParams.get("firstTime");
	const [fadingOut, setFadingOut] = useState(false);

	const handleImageUpdate = () => {
		// router.replace("/user"); // soft reload
		window.location.reload(); // hard reload
		console.log("image updated----");
	}

	function renderInnerComponents() {
		return (
		  <>
			<GenericForm
			  endpoint='/users/edit'
			  method='POST'
			  fields={[
				{
				  name: "newName", 
				  value: "",
				  placeholder: "Update Username...",
				  type:"text"
				},
			  ]}
			  notify={true}
			  resetAfterSubmit={true}
			  effectFunction={handleImageUpdate}
			/>
			<EditAvatar />
			<Set2Fa user2FA={user2FA} />
		  </>
		);
	}

	function renderWelcome() {
		return (
		  <>
			<h1>Welcome to your profile!</h1>
			<p>Here you can edit your username, avatar, and 2-factor authentication settings</p>
		  </>
		);
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setFadingOut(true);
		setTimeout(() => {
			router.replace("/user");
		}, 450);
	}

	return (
			<>
			{search && <div className="backdrop" />}
			{search ? (
				<div className={`POP ${fadingOut ? "out": "in"}`}>
				<div className="Component">
					{renderWelcome()}
					{renderInnerComponents()}
					{<button onClick={handleClick}>Finish</button>}
				</div>
				</div>
			) : (
				<div className="Component">
				{renderInnerComponents()}
				</div>
			)}
			</>
	);
}

export default UserEdit;