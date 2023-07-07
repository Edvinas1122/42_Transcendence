"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import GenericForm from '@/components/GeneralUI/GenericForm';


const ButtonWithLink = ({ link }: {link: string}) => {
    const router = useRouter();
  
    return (
      <button onClick={() => router.push(link)}>
          Continue
      </button>
    );
  }

const TwoFaUI = () => {

    const [qrCodeURL, setQrCodeURL] = useState("");
    const [displayQR, setDisplayQR] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [used, setUsed] = useState(false);

    

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event.target;
    //     setFormState({code: value});
    // }
    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     const options: RequestInit = {
    //         method: "POST",
    //         headers: {'Authorization': "Bearer " +  token.accessToken,
    //         'Content-Type' : "application/json"},
    //         body: JSON.stringify(formState),
    //     }
    //     setDisplayQR(false);
    //     URL.revokeObjectURL(qrCodeURL);
    //     setQrCodeURL("");
    //     await fetch(
    //         "api/2fa/authenticate",
    //         options
    //     );
    //     setError("Authentication Error");
    // }

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //         event.preventDefault();
    //         serverFetch(
    //             "/2fa/authenticate",
    //             "POST",

    //         )
    //         setDisplayQR(false);
    //         URL.revokeObjectURL(qrCodeURL);
    //         setQrCodeURL("");
    //         setError("Authentication Error");
    //     }

    const handleClick = async (event : any) => {
        event.preventDefault();
        
        setDisplayQR(true);
    }

    

    useEffect(() => {
        if (qrCodeURL === "" && !used) {
            setUsed(true);
            setLoading(true);
            fetch(
                "api/2fa/qr"
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
            {/* <form onSubmit={handleSubmit}>
                <input
                onChange={handleChange}
                type="text"
                name="Code"
                placeholder="enter Code here"
                />
            </form> */}
            <GenericForm
                endpoint='/2fa/authenticate'
                method='POST'
                fields={[
                    {name: "code",
                    value: "",
                    placeholder: "Enter 6 Digit Code...",
                    type: "text"},
                ]}
                />
            <ButtonWithLink link='/user'/>
            {error !== "" && <h1>{error}</h1>}
        </div>
    )
}

export default TwoFaUI;