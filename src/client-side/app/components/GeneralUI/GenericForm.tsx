"use client";

import React, { useState } from 'react';
import "@/public/layout.css";
import { serverFetch } from '@/lib/fetch.util';
import DisplayPopUp from '../EventsInfoUI/EventsInfo';

interface GenericField {
    name: string;
    value: string | boolean;
    type: string;
    placeholder?: string;
    optional?: boolean; // Optional
    displayName?: string;
    skipName?: boolean; // Optional
}

interface GenericFormProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    fields: GenericField[];
    className?: string; // Optional
	resetAfterSubmit?: boolean; // Optional
	notify?: boolean; // Optional
	effectFunction?: (response: any) => void;
}

const GenericForm = ({
	endpoint,
	method,
	fields,
	className,
	resetAfterSubmit = false,
	notify,
	effectFunction
}: GenericFormProps) => {

	const initialFormState = fields.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});
	const [formState, setFormState] = useState<{ [key: string]: string | number | boolean | undefined }>(
		fields.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})
	);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = event.target;
		setFormState({ ...formState, [name]: type === 'checkbox' ? checked : value });
	};

	const resetForm = () => setFormState(initialFormState);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const requestData = JSON.stringify(formState);
			console.log("Sending request to:", endpoint);
			const response = await serverFetch(
				endpoint,
				method,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(formState)
			);
			if (response?.error) {
				throw new Error(JSON.stringify(response.message));
			}
			effectFunction && effectFunction(response);
			if (notify !== undefined && notify) {
				DisplayPopUp("Success", response?.message, 1500, "success");
			}
			if (resetAfterSubmit) resetForm();
		} catch (error: any) {
			DisplayPopUp("Error", error?.message, 1500, "danger");
		}
	};

	return (
		<div className="Form">
			<form onSubmit={handleSubmit} className={className}>
				{fields.map(({ name, value, type, placeholder, displayName, optional }) => (
					<div key={name} >
						{displayName && <label>{displayName + ": "}</label>}
						<input
							type={type}
							name={name}
							value={type !== 'checkbox' ? formState[name] as string : undefined}
							checked={type === 'checkbox' ? formState[name] as boolean : undefined}
							onChange={handleChange}
							placeholder={placeholder}
							required={!optional} // input will be required if `optional` is not defined or false
						/>
					</div>
				))}
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
};

export default GenericForm;
