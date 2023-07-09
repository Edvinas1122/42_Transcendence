"use client";
import React, { useState } from "react";
import { SpinnerLoader2 } from "@/components/GeneralUI/Loader";

type FormProps = {
	retrieve: string;
    id: number;
	authorizedRedirect: () => void;
};

const Loading = () => (
	<div className="Loading">
	<div
		className="Buttons"
		style={{
		height: '10em',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		}}
	>
		<h2>Authorizing ...</h2>
		<SpinnerLoader2 />
	</div>
	</div>
);

export const CodeFormComponent: React.FC<FormProps> = ({
	retrieve,
    id,
	authorizedRedirect
}: FormProps
) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setStatus] = useState<boolean>(false);
    const [formState, setFormState] = useState({["code"]: ""});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormState({["code"]: value});
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
			const form = {
				code: formState.code,
				retrieve: retrieve,
                id: id,
			}
			setError(null);
            setLoading(true);
			const response = await fetch("api/2fa/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});
			const data = await response.json();
			if (data.error) {
				setError(data.message);
			} else {
				setStatus(true);
				authorizedRedirect();
			}
            setLoading(false);
			console.log("login: ", data);
        } catch (error) {
            setError("Authentication error");
            console.log(error);
        }
    }

    return (
		<div>
			{loading ? (
				<Loading/>
			) : (
				<>
					{!success ? (
						<form onSubmit={handleSubmit}> 
							<p>2FA required</p>
							<input 
								onChange={handleChange}
								type="password"
								name="code"
								placeholder="Type 6 Digit Code here..."
							/>
							<button type="submit">Submit</button>
						</form>
					): (
						<p>Validated</p>
					)}
					{error && (
						<p>{error}</p>
					)}
				</>
			)}
		</div>
    );
}

export default CodeFormComponent;