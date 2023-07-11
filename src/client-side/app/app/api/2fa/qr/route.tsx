import { getToken } from '@/lib/token.util';
import { NextResponse } from 'next/server';

export async function POST() {
		"use server";
	
		let cookie;
		if (process.env.DEV === 'true') {
			cookie = getToken();
		} else {
			cookie = getToken();
		}

		if (!cookie) {
			console.log("No cookie found");
			throw new Error('Unauthorized');
		}
		const options: RequestInit = 
		{
			method: "POST",
			headers: {'Authorization': `Bearer ${cookie}`,
			'Content-Type' : "application/json"},
		}
		try {
			const response = await fetch(
				"http://nest-app:3000/2fa/qr",
				options
			)
			return response;
		} catch (error) {
			console.log("QR ERROR: ", error);
		}
}

// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// export async function POST() {
// 	"use server";
	
// 	const cookie = cookies().get('access_token');

// 	if (!cookie) {
// 		return NextResponse.json({message: "Auth Error"});
// 	}
// 	const options: RequestInit = 
// 	{
// 		method: "POST",
// 		headers: {'Authorization': `Bearer ${cookie}`,
// 		'Content-Type' : "application/json"},
// 	}
// 	try {
// 		const response = await fetch(
// 			"http://nest-app:3000/2fa/qr",
// 			options
// 		);
// 		// const info = await response;
// 		console.log("QR INFO: ", response);
// 		return NextResponse.json(response);
// 	} catch (error) {
// 		console.log("QR ERROR: ", error);
// 		return NextResponse.json({message: "Error while fetching QR code."});
// 	}
// }
