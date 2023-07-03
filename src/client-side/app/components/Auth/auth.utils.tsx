import { serverFetch } from "@/lib/fetch.util"
import { cookies } from 'next/headers';

const validateUser: Function = async (endpoint: string): Promise<boolean> => {

	const cookieStore = cookies();
	if (cookieStore === undefined) return false;
	const token = cookieStore.get('access_token');
	if (!token) return false;
	try {
		console.log("Validating user...");
		const validity = await serverFetch(endpoint);
		if (validity.error) throw new Error(validity.message);
		return true;
	} catch (error) {
		return false;
	}
}

export default validateUser;