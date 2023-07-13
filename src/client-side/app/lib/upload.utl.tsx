// import { getToken } from './token.util';
// import axios from 'axios';

// const FileUpload = async (formData: FormData): Promise<any> => {
	// 	let cookie = getToken();
	// 	if (!cookie) {
		// 		console.error("Unauthorised!");
		// 	} else {
			// 		try {
				// 			const response = await axios.post(
					// 				`${process.env.SERVER_NEST_ACCESS}/drive/upload`,
					// 				formData,
					// 				{
						// 					headers: {
							// 						'Authorization': `Bearer ${cookie}`,
							// 						'Content-Type': 'multipart/form-data'
							// 					}
							// 				}
							// 			);
							
							// 			return {message: "File uploaded successfully."};
							// 		} catch (error) {
								// 			console.error(error);
								// 			return {error: true, message: "Error while uploading file."};
								// 		}
								// 	}
								// };
								
"use client";
// export default FileUpload;
const FileUpload = async (formData: FormData): Promise<any> => {
	// let cookie = getToken();
	// if (!cookie) {
	// 	console.error("Unauthorised!");
	// } else {
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
			console.log("COOKIE:fwfwqfwq");
			const cookie = await fetch('/api/file', {cache: 'no-store'});
			const cookieData = await cookie.json();
			console.log("COOKIE: ", cookieData.token.accessToken);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/drive/upload`,
				{
					method: "POST",
					headers: {
						'Authorization': `Bearer ${cookieData.token.accessToken}`,
					},
					body: formData,
					cache: 'no-store',
				}, 
			);
			const data = await response.json();
			console.log("DATA: ", data);
			return data;
		} catch (error) {
			console.error(error);
			return {error: true, message: "Error while uploading file."};
		}
	// }
};

export default FileUpload;