import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { ft_fetch } from '@/lib/fetch.util';
import { redirect } from 'next/navigation'
import crypto from 'crypto';

interface IntraInfo { // partial user info just what we need
	id: number;
	login: string;
	first_name: string;
	last_name: string;
	image: { 
		link: string,
		versions: {
			medium: string,
			micro: string,
		}
	};
}

export async function GET(request: Request) {

	const { searchParams } = new URL(request.url);
	const code = searchParams.get('code');

	const intra_request = {
		grant_type: 'authorization_code',
		client_id: process.env.INTRA_UID,
		client_secret: process.env.INTRA_SECRET,
		code: code,
		redirect_uri: process.env.INTRA_REDIRECT_URI,
	}

	const options: RequestInit =
	{
		method: "POST",
		headers: { 'Content-Type': "application/json" },
		body: JSON.stringify(intra_request),
	}

	const response = await fetch(
		"https://api.intra.42.fr/oauth/token",
		options
	);

	const intra_token = await response.json();
	if (intra_token.access_token === undefined) {
		return NextResponse.json({ 
			sucess: false,
			error: "validation failure"
		});
	}

	const userInfoResponse = await fetch(
		"https://api.intra.42.fr/v2/me",
		{
			method: "GET",
			headers: {
				'Authorization': `Bearer ${intra_token.access_token}`,
				'Content-Type': "application/json"
			},
		}
	);

	const userInfo: IntraInfo = await userInfoResponse.json();

	console.log("userInfo: ", userInfo.image);
	const random_secret = crypto.randomBytes(32).toString('hex');

	const registerLogin = await fetch("http://nest-app:3000/auth/register", {
		method: "POST",
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			user: userInfo.login,
			fullName: userInfo.first_name + " " + userInfo.last_name,
			secret: random_secret,
			server_secret: process.env.SERVER_SECRET,
		})
	});

	const registerLoginResponse = await registerLogin.json();

	console.log("registerLoginResponse: ", registerLoginResponse);

	if (registerLoginResponse.HAS_2_FA === false) {
		cookies().set('access_token', registerLoginResponse.retrieve);
	}

	const respondWithConfiramation = {
		sucess: true,
		user: userInfo.login,
		name: userInfo.first_name + " " + userInfo.last_name,
		image: userInfo.image.link,
		micro_image: userInfo.image.versions.micro,
		retrieve: registerLoginResponse.retrieve + "-" + random_secret,
		two_fa: registerLoginResponse.HAS_2_FA,
		id: registerLoginResponse.id,
	}

	return NextResponse.json(respondWithConfiramation);
}