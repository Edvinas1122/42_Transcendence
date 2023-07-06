import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

interface AccessToken {
	accessToken: string | undefined;
	id: string;
}

interface bodyParse {
	body: string;
}

export async function POST(request: Request) {
		"use server";
	
		const token = request.headers.get("Authorization");
		// console.log("here");
		const init = await request.json();

		const options: RequestInit = 
		{
			method: "POST",
			headers: {'Authorization': token as string,
			'Content-Type' : "application/json"},
			body: JSON.stringify(init),
		}
		console.log("Options: ", options);
		try {
			const response = await fetch(
			"http://nest-app:3000/2fa/authenticate",
			options
			);
			if (response.ok) {
				const newToken: AccessToken = await response.json();
				if (newToken.accessToken !== undefined) {
					console.log("TOKEN: ", newToken.accessToken);
					cookies().set('access_token', newToken.accessToken);
					redirect(process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL + '/user');
				}
			}
		} catch (error) {
			console.log("Error", error);
		}
}
