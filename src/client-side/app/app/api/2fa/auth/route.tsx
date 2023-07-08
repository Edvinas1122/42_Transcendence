import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function POST(request: Request) {

	const req = await request.json();

	if (req?.code === undefined ||
		req?.retrieve === undefined ||
		req?.id === undefined
	) {
		return NextResponse.json({
			sucess: false,
			error: "invalid request"
		});
	}

	const serverSecret = process.env.SERVER_SECRET;
	const requestToNest = {
		code: req.code,
		retrieve: req.retrieve,
		id: req.id,
		server_secret: serverSecret,
	}

	console.log(
		"requestToNest: ", requestToNest
	)

	const serverResponse = await fetch(
		"http://nest-app:3000/2fa/login",
		{
			method: "POST",
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify(requestToNest)
		}
	);

	const serverResponseJson = await serverResponse.json();

	console.log("serverResponseJson: ", serverResponseJson);
	if (serverResponseJson?.error !== undefined) {
		return NextResponse.json({
			sucess: false,
			error: serverResponseJson.error,
			message: serverResponseJson.message,
		});
	}

	const cookie = serverResponseJson.accessToken;
	cookies().set('access_token', cookie);
	const respondToUser = {
		sucess: true,
		access_token: cookie
	}
	return NextResponse.json(respondToUser);
}
