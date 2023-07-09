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
				`${process.env.SERVER_NEST_ACCESS}/drive/upload`,
				formData,
				{
					headers: {
						'Authorization': `Bearer ${cookie}`,
					}
				}
			);
			return {message: "File uploaded successfully."};
		} catch (error) {
			return {message: "Error while uploading file."};
		}
	}
};

export default FileUpload;