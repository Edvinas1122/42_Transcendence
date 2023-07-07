import { getToken } from '@/lib/token.util';
import { NextResponse } from 'next/server';

export async function POST() {
		"use server";
	
		let cookie;
		if (process.env.NEXT_PUBLIC_DEV === 'true') {
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
