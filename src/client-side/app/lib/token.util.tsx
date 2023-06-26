import { cookies } from 'next/headers';

export const getTokensId = (token: string): number => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace('-', '+').replace('_', '/');
	const decodedToken = JSON.parse(Buffer.from(base64, 'base64').toString());
	return decodedToken['id'];
}

const getToken = (): string | null => {

	const cookieStore = cookies();
	if (cookieStore === undefined) return null;
	const token = cookieStore.get('access_token');
	if (!token) return null;
	return token.value;
}


const CurrentUserId: Function = (): number | null => {
	const token: string | null = getToken();
	if (!token) return null;
	const id: number = getTokensId(token);
	return id;
}

export default CurrentUserId;
export { getToken };