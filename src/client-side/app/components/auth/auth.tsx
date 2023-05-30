"use client"; // This is a client component 👈🏽

import React from 'react';
import Cookies from 'js-cookie';


// const AutoAuthGarant: React.FC = () => {
// 	const token: string | undefined = Cookies.get('access_token');
// 	const url = process.env.NEXT_PUBLIC_INTRA_LINL;

// 	if (!token) {
// 		window.open(url, '_self');
// 	}
// };

const AutoAuthGarant: React.FC = () => {
    const token: string | undefined = Cookies.get('access_token');
    const url = process.env.NEXT_PUBLIC_INTRA_LINL;

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            if (!token) {
                window.open(url, '_self');
            }
        }
    }, [token]); // this useEffect runs after the component mounts
};

export default AutoAuthGarant;
// export {OAuthCallback};
