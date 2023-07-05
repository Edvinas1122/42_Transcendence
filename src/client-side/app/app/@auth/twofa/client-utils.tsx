"use client";
import React, { useState, useEffect } from 'react';
import { AuthCodeDTO } from '@/lib/DTO/AuthData';

export const QRCode = ({token}: {token: AuthCodeDTO}) => {

    const [qrCodeURL, setQrCodeURL] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (qrCodeURL === "") {
            setLoading(true);

            const options: RequestInit = {
                method: "POST",
                headers: {'Authorization': "Bearer " +  token.accessToken,
                'Content-Type' : "application/json"},
            }
            fetch(
                "api/TwoFA",
                options
            )
            .then(response => {
                if (!response.ok) {
                    console.log("Error:", response.status);
                }
                return response.blob();
            })
            .then((qrCode) => {
                const imageURL = URL.createObjectURL(qrCode);
                setQrCodeURL(imageURL);
                setLoading(false);
            })
        }
    }, [])

    if (isLoading) return <p>loading...</p>
    if (qrCodeURL.length < 1) return <p>No QR</p>
    return (
        <div>
            <img src={qrCodeURL} />
        </div>
    )
}
