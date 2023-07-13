import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

export async function GET(request: Request) {
		console.log("TOKEN: ", request);

		const cookieStore = cookies();
		const token = cookieStore.get('access_token');
		console.log("TOKEN: ", token);
		if (!token) return NextResponse.json({error: true, message: "Auth Error"});
		return NextResponse.json({ token: { accessToken: token.value, id: "0" }});

}