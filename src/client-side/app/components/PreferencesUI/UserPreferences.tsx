"use client";
import React, { useEffect, FormEvent, useRef, useState } from 'react';
import { serverFetch } from "@/lib/fetch.util";
import DisplayPopUp from "../EventsInfoUI/EventsInfo";
import FileUpload from '@/lib/upload.utl';


const SetPreferences = () => {
	const ref = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | undefined>();
	const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [formState, setFormState] = useState({["newName"]: ""});
  
	useEffect(() => {
		if (!selectedFile) {
			setPreview(undefined);
			return;
	}

		const objectUrl = URL.createObjectURL(selectedFile);
		setPreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedFile]);

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			setIsUploaded(false);
		}
	};

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormState({["newName"]: value});
    }

	const onFileUpload = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		if (selectedFile) {
			formData.append('file', selectedFile);
			FileUpload(formData).then((res) => {
				console.log(res);
				if (res.error) {
					DisplayPopUp("Upload failure", res.message, 2000, "danger");
				}
				else {
					DisplayPopUp("Upload", res.message);
				}
				setSelectedFile(null);  // Clear the selected file
				setIsUploaded(true);
			});
		} 
        if (formState) {
            const response = await serverFetch(
				'/users/edit',
				"POST",
				{ 'Content-Type': 'application/json' },
				JSON.stringify(formState)
			);
            if (response.error) {
                DisplayPopUp("Unable to update username", response.message, 2000, "danger");
            }
            setFormState({["newName"]: ""});
            setIsUploaded(true);
        }
	};

	return (
		<div>
			<form onSubmit={onFileUpload}>
			<input type="file" name="file" ref={ref} onChange={onFileChange} />
			{selectedFile && <img src={preview as string} alt="Image preview" style={{maxWidth: '200px', maxHeight: '200px'}} />}
            <input type="text" name="newName" onChange={handleChange}/>
			<button type="submit">Submit</button>
			</form>
			{isUploaded && <p>Preferences Added!</p>}
		</div>
	);
};

export default SetPreferences;