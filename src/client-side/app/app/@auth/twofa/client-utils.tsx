"use client";
import React, { useState, Image} from 'react';
import { AuthCodeDTO } from '@/lib/DTO/AuthData';
import { fetchWith2FAToken } from './server-utils';
import { ft_fetch } from '@/lib/fetch.util';

export const QRCode = ({token}: {token: AuthCodeDTO}) => {

    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const fetchQRCode = async () => {
        const result = await fetchWith2FAToken<string>({token: JSON.stringify(token.accessToken), url: "/2fa/qr", method: "POST"});
        if (result) {
            setQrCode(result);
        }
        console.log(result);
    }

    const handleClick = async () => {
        await fetchQRCode();
        setIsClicked(true);
    }

    return (
        <div>
            {!isClicked && <button onClick={handleClick}>Generate OTP</button>}
            {/* {isClicked && qrCode? <Image src={qrCode} /> : <h1>QR code not found</h1> } */}
        </div>
    )
}
