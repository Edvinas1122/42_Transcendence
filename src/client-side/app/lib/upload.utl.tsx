"use client";
import { getToken } from './token.util';
// import axios from 'axios';

const FileUpload = async (formData: FormData): Promise<any> => {
	let cookie = getToken();
	if (!cookie) {
		console.error("Unauthorised!");
	} else {
		try {
			// const response = await axios.post(
			// 	`${process.env.SERVER_NEST_ACCESS}/drive/upload`,
			// 	formData,
			// 	{
			// 		headers: {
			// 			'Authorization': `Bearer ${cookie}`,
			// 			'Content-Type': 'multipart/form-data'
			// 		}
			// 	}
			// );

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/drive/upload`,
				{
					method: "POST",
					headers: {
						'Authorization': `Bearer ${cookie}`,
						'Content-Type': 'multipart/form-data'
					},
					body: formData
				}
			);
			console.log(response);

			return {message: "File uploaded successfully."};
		} catch (error) {
			console.error(error);
			return {error: true, message: "Error while uploading file."};
		}
	}
};

export default FileUpload;