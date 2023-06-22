"use client";
import React, { useContext } from "react";
import { AuthorizedFetchContext } from "@/components/ContextProviders/authContext";

export	const getTokensId = (token: string): number => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace('-', '+').replace('_', '/');
	const decodedToken = JSON.parse(window.atob(base64));
	return decodedToken['id'];
}

const GetDevToken: Function = (): string | null => {
	const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);
	if (!token) return null;
	return token.accessToken;
}

const CurrentUserId: Function = (): number | null => {
	const { fetchWithToken, loading, token } = useContext(AuthorizedFetchContext);
	if (!token) return null;
	const id: number = getTokensId(token.accessToken);
	return id;
}

export default CurrentUserId;
export { GetDevToken };