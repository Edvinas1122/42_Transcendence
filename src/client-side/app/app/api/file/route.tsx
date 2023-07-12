import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

// export async function POST(request: Request) {
// 	"use server";
// 	const cookieStore = cookies();
// 	const token = cookieStore.get('access_token');
// 	console.log("TOKEN: ", token);
// 	if (!token) return NextResponse.json({error: true, message: "Auth Error"});
// 	// return NextResponse.json({ token: { accessToken: token.value, id: "0" }});
// 	const res = await fetch(`${process.env.SERVER_NEST_ACCESS}/drive/upload`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: request.body
// 	})
	
// 	const data = await res.json()
	
// 	return NextResponse.json(data)
// }

export async function GET(request: Request) {
		"use server";
		const cookieStore = cookies();
		const token = cookieStore.get('access_token');
		console.log("TOKEN: ", token);
		if (!token) return NextResponse.json({error: true, message: "Auth Error"});
		return NextResponse.json({ token: { accessToken: token.value, id: "0" }});

}