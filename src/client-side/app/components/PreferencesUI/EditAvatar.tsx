"use client";

import React, { useState, FormEvent, useRef} from 'react';
import FileUpload from '@/lib/upload.utl';

const EditAvatar = () => {
    const ref = useRef<HTMLInputElement>(null);

    const onFileUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const input = ref.current!;
        const formData = new FormData();
        if (input.files && input.files[0]) {
            console.log("yes");
            formData.append('file', input.files[0] as Blob);
            FileUpload(formData);
        } else {
            console.log("File not uploaded");
        }
    };

    return (
        <div>
            <form onSubmit={onFileUpload}>
                <input type="file" name="file" ref={ref} />
                <button type="submit">
                    Upload
                </button>
            </form>
        </div>
    );
};

export default EditAvatar;