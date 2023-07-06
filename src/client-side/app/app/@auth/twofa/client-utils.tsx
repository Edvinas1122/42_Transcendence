"use client";
import React, { useState, useEffect } from 'react';
import { AuthCodeDTO } from '@/lib/DTO/AuthData';


export const QRCode = ({token}: {token: AuthCodeDTO}) => {

    const [qrCodeURL, setQrCodeURL] = useState("");
    const [displayQR, setDisplayQR] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formState, setFormState] = useState({code:""});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormState({code: value});
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options: RequestInit = {
            method: "POST",
            headers: {'Authorization': "Bearer " +  token.accessToken,
            'Content-Type' : "application/json"},
            body: JSON.stringify(formState),
        }
        setDisplayQR(false);
        URL.revokeObjectURL(qrCodeURL);
        setQrCodeURL("");
        await fetch(
            "api/2fa/authenticate",
            options
        );
        setError("Authentication Error");
    }

    const handleClick = (event : any) => {
        event.preventDefault();
        setDisplayQR(true);
    }

    useEffect(() => {
        if (qrCodeURL === "") {
            setLoading(true);

            const options: RequestInit = {
                method: "POST",
                headers: {'Authorization': "Bearer " +  token.accessToken,
                'Content-Type' : "application/json"},
            }
            fetch(
                "api/2fa/qr",
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

    return (
        <div>
            <h1>Two-Factor Authentication is Activated</h1>
            <p>Please download Google Authenticator, then generate a QR Code to scan and enter the code</p>
            <button onClick={handleClick}>
                Generate Code
            </button>
            {displayQR && isLoading ? <h1>Loading...</h1> : displayQR && <img src={qrCodeURL} />}
            <form onSubmit={handleSubmit}>
                <input
                onChange={handleChange}
                type="text"
                name="Code"
                placeholder="enter Code here"
                />
            </form>
            {error !== "" && <h1>{error}</h1>}
        </div>
    )
}
