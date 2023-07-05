import { NextResponse } from 'next/server';

export async function POST(request: Request) {
		"use server";
	
		const token = request.headers.get("Authorization");
		const options: RequestInit = 
		{
			method: "POST",
			headers: {'Authorization': token as string,
			'Content-Type' : "application/json"},
		}
		const response = await fetch(
			"http://nest-app:3000/2fa/qr",
			options
		)
		return response;
}
