"use client";
import React, { useState, useContext, useEffect } from 'react';
import { ChatSourceContext, ChatEventType } from '@/components/ContextProviders/eventContext';
import { AuthorizedFetchContext, AuthorizedFetchContextType } from '@/components/ContextProviders/authContext';
import { Chat, Message } from '@/lib/DTO/AppData';
import { usePathname } from 'next/navigation';
import DisplayPopUp from '../EventsInfoUI/EventsInfo';

export type ChatSourceContextType = {
	roomID: string;
	subtype: string;
	data?: any;
} | null;

export type ParticipantContextType = {
	roomID: string;
	subtype: string;
	data?: any;
} | null;

export type MessageContextType = {
	messages: Message[],
	getMessagesForChat: (chatID: number) => [],
} 

export const MessageSourceContext = React.createContext<Message | null>(null);
export const ChatRoomSourceContext = React.createContext<ChatSourceContextType>(null);
export const ParticipantSourceContext = React.createContext<ParticipantContextType>(null);

export const ChatEventProvider = ({ children }: { children: React.ReactNode }) => {
	
	const { fetchWithToken, loading, token } = useContext<AuthorizedFetchContextType>(AuthorizedFetchContext);

	const chatEvent: ChatEventType | null = useContext<ChatEventType | null>(ChatSourceContext);

	const [newMessage, setNewMessage] = useState<Message | null>(null);
	const [chatRoomEvent, setChatRoomEvent] = useState<ChatSourceContextType>(null);
	const [participantEvent, setParticipantEvent] = useState<ChatSourceContextType>(null);
	const pathname = usePathname();

	useEffect(() => {
		if (chatEvent) {
			switch (chatEvent.event) {
				case 'room':
					setChatRoomEvent({
						roomID: chatEvent.roomId,
						subtype: chatEvent.subType,
						data: chatEvent.data,
					});
					if (chatEvent.subType == 'new-available')
						DisplayPopUp("New ChatRoom Available", "ChatRoom " + chatEvent.roomId + " is now available");
					break;
				case 'participant':
					setParticipantEvent({
						roomID: chatEvent.roomId,
						subtype: chatEvent.subType,
						data: chatEvent.data,
					});
					break;
				case 'message':
					let newMessage: Message = chatEvent.data as unknown as Message;
					newMessage.chatID = parseInt(chatEvent.roomId);
					newMessage.me = (newMessage.user._id == token?.id.toString()) ? true : false;
					setNewMessage(newMessage);
					if (pathname.split('/')[2] != chatEvent.roomId.toString())
						DisplayPopUp("Message from " + newMessage.user.name, "ChatRoom " + newMessage.chatID + " " + newMessage.content);
					break;
				default:
					break;
			}
		}
	}, [chatEvent, token]);

	return (
		<MessageSourceContext.Provider value={newMessage}>
			<ChatRoomSourceContext.Provider value={chatRoomEvent}>
				<ParticipantSourceContext.Provider value={participantEvent}>
				{children}
				</ParticipantSourceContext.Provider>
			</ChatRoomSourceContext.Provider>
		</MessageSourceContext.Provider>
	);
}
