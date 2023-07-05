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
	token = await ft_fetch<AccessToken>("/auth/DevUser2FA/");
	if (token.accessToken !== undefined) {
		localStorage.setItem("currentUser", token.accessToken);
	}
	redirect('/@auth/twofa');
}
