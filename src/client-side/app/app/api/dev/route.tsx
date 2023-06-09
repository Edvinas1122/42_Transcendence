import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { ft_fetch } from '@/lib/fetch.util';
import { redirect } from 'next/navigation'

interface AccessToken {
	accessToken: string | undefined;
	id: string;
}

export async function GET() {

	if (process.env.NEXT_PUBLIC_DEV === "true") {
		let token: AccessToken;
		if (!cookies().get('access_token')) {
			token = await ft_fetch<AccessToken>("/auth/DevToken");
			if (token.accessToken !== undefined) {
				cookies().set('access_token', token.accessToken);
			}
		} else {
			const cookie = cookies().get('access_token');
			token = { accessToken: cookie as unknown as string, id: "0" };
			redirect("/user");
		}
		return NextResponse.json(token);
	}
	return NextResponse.json({ token: { accessToken: "0", id: "0", error: "Not in dev mode" }});
}