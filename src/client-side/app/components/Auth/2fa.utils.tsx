// import { cookies } from 'next/headers';
// import { AuthCodeDTO } from '@/lib/DTO/AuthData';

// async function fetchValidate<T>(id: any): Promise<T> {
//     const options: RequestInit = {
//         method: "POST",
//         body: JSON.stringify({
//             code: id,
//             tempCode: tempToken,
//         }),
//     }
//     const response = await fetch(
//         "http://nest-app:3000/2fa/authenticate",
//         options
//     )
//     return response.json();
// }

// const set2faCookie = async (temp: any) => {
//     const token = await fetchValidate<AuthCodeDTO>(temp);
//     if (token.accessToken !== undefined) {
//         cookies().set('access_token', token.accessToken);
//     }
// }

// export default set2faCookie;