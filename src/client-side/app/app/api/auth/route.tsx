import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { ft_fetch } from '@/lib/fetch.util';
import { redirect } from 'next/navigation'

interface AccessToken {
	accessToken: string | undefined;
	id: string;
}

export async function GET() {

	let token: AccessToken;
	token = await ft_fetch<AccessToken>("/auth/DevToken");
	if (token.accessToken !== undefined) {
		cookies().set('access_token', token.accessToken);
	}
	return NextResponse.json({ token })
}
