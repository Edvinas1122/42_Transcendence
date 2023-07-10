"use client";

import React, { useState, FormEvent, useRef, useEffect} from 'react';
import FileUpload from '@/lib/upload.utl';
import DisplayPopUp from '../EventsInfoUI/EventsInfo';


const EditAvatar = () => {
	const ref = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | undefined>();
	const [isUploaded, setIsUploaded] = useState<boolean>(false);
  
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
		} else {
			console.log("File not uploaded");
		}
	};

	return (
		<div>
			<form onSubmit={onFileUpload}>
			<input type="file" name="file" ref={ref} onChange={onFileChange} />
			{selectedFile && <img src={preview as string} alt="Image preview" style={{maxWidth: '200px', maxHeight: '200px'}} />}
			<button type="submit">Upload</button>
			</form>
			{isUploaded && <p>File uploaded successfully!</p>}
		</div>
	);
};
  
  
  
export default EditAvatar;