// "use client";

// import React, { useEffect } from 'react';

// const OAuthCallback: React.FC = () => {
//   useEffect(() => {
//     const url = new URL(window.location.href);
//     const authCode = url.searchParams.get('code');

//     console.log(authCode);
//   //   if (authCode) {
//   //     fetch('http://your-backend.com/authenticate', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ code: authCode }),
//   //     })
//   //     .then(res => res.json())
//   //     .then(data => {
//   //       // Handle your token here...
//   //       console.log(data.token);
//   //     });
//   //   }
//   }, []);

//   // return <div>Processing...</div>;
// };

// export default OAuthCallback;