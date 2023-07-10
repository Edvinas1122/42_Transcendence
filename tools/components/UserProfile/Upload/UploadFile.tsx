"use client";

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthorizedFetchContext } from '@/app/context/authContext';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const onFileUpload = async () => {
        if (!file || !token) return;
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/drive/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token.accessToken}`,
                }
            });
            console.log('File uploaded successfully. Response:', response);
        } catch (error) {
            console.log('Error while uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>
                Upload
            </button>
        </div>
    );
};

export default FileUpload;