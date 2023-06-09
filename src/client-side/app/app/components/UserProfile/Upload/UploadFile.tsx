"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData(); 
        formData.append('file', file);
        
        try {
            const response = await axios.post('http://localhost:3000/drive/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${Cookie.get('access_token')}`,
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