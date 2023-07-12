"use client";
import React, {useEffect} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { serverFetch } from "@/lib/fetch.util";


const PersonalChatRedirector: React.FC = () => {

	const searchParams = useSearchParams();
	const search = searchParams.get("personal");
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			if (search) {
				const response = await serverFetch(`/chat/personal/${search}`, "GET");
				if (response.status == 200) {
					const chat = await response.json();
					router.replace(`/chat/${chat.id}`);
				} else {
					router.replace("/chat");
				}
			}
		};

		fetchData();
	}, [search, router]);

	return (
		<>{search}</>
	);
};

export default PersonalChatRedirector;