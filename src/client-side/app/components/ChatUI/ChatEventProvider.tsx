"use client";
import React, { useState, useContext, useEffect } from 'react';
import { ChatSourceContext, ChatEventType } from '@/components/ContextProviders/eventContext';
import { AuthContext, AuthContextType } from '@/components/ContextProviders/authContext';
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
	
	const { token, id } = useContext<AuthContextType>(AuthContext);

	const chatEvent: ChatEventType | null = useContext<ChatEventType | null>(ChatSourceContext);

	const [newMessage, setNewMessage] = useState<Message | null>(null);
	const [chatRoomEvent, setChatRoomEvent] = useState<ChatSourceContextType>(null);
	const [participantEvent, setParticipantEvent] = useState<ChatSourceContextType>(null);
	const pathname = usePathname();

	useEffect(() => {
		if (chatEvent && id) {
			console.log(chatEvent);
			switch (chatEvent.event) {
				case 'room':
					switch (chatEvent.subType) {
						case 'new-available':
							setChatRoomEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							if (chatEvent.subType == 'new-available')
								DisplayPopUp("New ChatRoom Available", "ChatRoom " + chatEvent.roomId + " is now available");
							break;
						case 'join':
							setParticipantEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							DisplayPopUp("User Joined", "Chat room " + chatEvent.roomId);
							break;
						case 'leave':
							setParticipantEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							DisplayPopUp("User Left", "Chat room " + chatEvent.roomId);
							break;
						case 'kicked':
							setChatRoomEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							setParticipantEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							DisplayPopUp("User Kicked", "Chat room " + chatEvent.roomId);
							break;
						case 'invited':
							setChatRoomEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							setParticipantEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							break;
						case "promoted":
							setParticipantEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							break;
						case "demoted":
							setParticipantEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							break;
						default:
							setChatRoomEvent({
								roomID: chatEvent.roomId,
								subtype: chatEvent.subType,
								data: chatEvent.data,
							});
							break;
						}
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
					newMessage.me = (newMessage.user._id == id) ? true : false;
					setNewMessage(newMessage);
					if (pathname.split('/')[2] != chatEvent.roomId.toString())
						DisplayPopUp("Message from " + newMessage.user.name, "ChatRoom " + newMessage.chatID + " " + newMessage.content);
					break;
				default:
					break;
			}
		}
	}, [chatEvent, id]);

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
