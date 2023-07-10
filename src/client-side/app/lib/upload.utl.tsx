"use server";
import { getToken } from './token.util';
import axios from 'axios';

const FileUpload = async (formData: FormData): Promise<any> => {
	let cookie = getToken();
	if (!cookie) {
		console.error("Unauthorised!");
	} else {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/drive/upload`,
				formData,
				{
					headers: {
						'Authorization': `Bearer ${cookie}`,
					}
				}
			);
			return {message: "File uploaded successfully."};
		} catch (error) {
			return {error: true, message: "Error while uploading file."};
		}
	}
};

export default FileUpload;