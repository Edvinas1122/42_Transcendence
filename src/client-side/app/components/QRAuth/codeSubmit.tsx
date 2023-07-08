"use client";
import React, { useState } from "react";

type FormProps = {
	retrieve: string;
    id: number;
};



export const CodeFormComponent: React.FC<FormProps> = ({
	retrieve,
    id,
}: FormProps
) => {
    const [error, setError] = useState<string | null>(null);
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
			const response = await fetch("api/2fa/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});
			const data = await response.json();
			console.log("login: ", data);
        } catch (error) {
            setError("Authentication error");
            console.log(error);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} > 
                <input 
                onChange={handleChange}
                type="text"
                name="code"
                placeholder="Type 6 Digit Code here..."
                />
                <button type="submit">Submit</button>
            </form>
            {error && <h1>{error}</h1>}
        </div>
    );
}

export default CodeFormComponent;