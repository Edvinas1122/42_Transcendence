"use server";
import { getToken } from './token.util';
import axios from 'axios';

const FileUpload = async (formData: FormData) => {
    let cookie = getToken();
    if (!cookie) {
        console.error("Unauthorised!");
    } else {
        try {
            const response = await axios.post('http://nest-app:3000/drive/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${cookie}`,
                }
            });
            console.log('File uploaded successfully.');
        } catch (error) {
            console.log('Error while uploading file:', error);
        }
    }
};

export default FileUpload;