import React from 'react';
import { Chat } from '@/lib/DTO/AppData';
import Link from 'next/link';

interface ChatBoxProps {
	info: Chat;
}


const ChatInfoBox: React.FC<ChatBoxProps> = (
	{info}: ChatBoxProps
) => {
	return (
		<div>
			<Link href={`/chat/${info._id}`}> 
				<h1>Chat Box</h1>
				<h2>{info.name}</h2>
				<p>{info.personal}</p>
			</Link>
		</div>
	);
}

export default ChatInfoBox;