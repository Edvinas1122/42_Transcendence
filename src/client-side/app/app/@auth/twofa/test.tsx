// import { ft_fetch } from "@/lib/fetch.util";
// import { redirect } from 'next/navigation'
// import set2faCookie from "@/components/Auth/2fa.utils";
// import React from 'react';

// interface TempCode{
// 	accessToken: string;
// 	id: string;
// }

// const TwoFACheck = () => {
//     const [qrCode, setQrCode] = React.useState<string | null>(null);
//     // const [formState, setFormState] = React.useState()
//     const getToken = async () => {
//         let code: TempCode;
//         try {
//             const res = await fetch(`/api/TwoFA`);
//             code = await res.json();
//             localStorage.getItem(code.id);
//             return(code);
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     const [tempToken, setTempToken] = React.useState(getToken());

//     const fetchQR = async () => {
//         try{ 
//             const qrurl = await ft_fetch<string>("/2fa/qr");
//             setQrCode(qrurl);
//         } catch (error) {
//             console.log()
//         }
//     };

//     // async function fetchValidate<T>(id: any): Promise<T> {
//     //     const options: RequestInit = {
//     //         method: "POST",
//     //         body: JSON.stringify({
//     //             code: id,
//     //             tempCode: tempToken,
//     //         }),
//     //     }
//     //     const response = await fetch(
//     //         "http://nest-app:3000/2fa/authenticate",
//     //         options
//     //     )
//     //     return response.json();
//     // }

//     const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         // const token = await fetchValidate<TempCode>(event.currentTarget.value);
//         // if (token.accessToken !== undefined) {
//         //     cookies().set('access_token', token.accessToken);
//         // }
//         set2faCookie(event.currentTarget.value);
//         redirect('/user');
//     }

//     return(
//         <div>
//             {qrCode && <img src={qrCode} />}
//             {qrCode ? <h1>Scan QR Code for One-Time-Password</h1> :
//                 <h1>Failed to Load QR Code</h1> }
//             {!qrCode && <button onClick={fetchQR}>Retry</button>}
//             <form>
//                 <input 
//                 type="text"
//                 name="code"
//                 placeholder="type OTP here..."
//                 />
//             </form>
//         </div>
//     );
// }

// export default TwoFACheck;