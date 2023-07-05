"use server";
import { AuthCodeDTO } from '@/lib/DTO/AuthData';

interface FetchProps {
    token: AuthCodeDTO;
    url: string;
    method: "GET" | "POST";
    body?: any;
}


export async function fetchWith2FAToken<T = any>(fetchProps: FetchProps): Promise<T> {
    "use server";
    const options: RequestInit = {
        headers: {'Authorization': "Bearer " +  fetchProps.token.accessToken},
        method: fetchProps.method,
        body: fetchProps.body,
        cache: 'no-store',
    }
    console.log(options);
    const response = await fetch(
        "http://nest-app:3000" + fetchProps.url,
        options
    ) 
    if (!response.ok) {
        console.log("Error:", response.status);
    }
    return response.json();
}



