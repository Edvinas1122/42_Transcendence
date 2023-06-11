api fetch endpoints

users/
	me/ - UserProfile - personal profile of token bearer
	profile/:id - UserProfile - id owners personal profile
	
	manage/
		send-friend-request/ (POST) body receiverId=:id
		approve-friend-request/ (POST) body requesterId=:id
		get-all-pending-friend-request/
		get-last-pending-friend-request/


chat/
	available/ - Chat[] - Personal and Group chats available to token bearer
	create/ (POST) - CreateChatRequest - Create a chat room
	:chatId (DELETE) - Delete a chat room

	roles/
		:chatId/join (POST) - JoinChatDto - Accept pending request and join
		:chatId/(:role)(or Any) - Get chat relatives 
		:chatId/:userId - (DELETE) - delete chat member - Kick
		:chatId/ - (DELETE) - userIds: number[] - delete chat members - Kick many
	
	messages/
		:chatId - get chat messages
		:chatId (POST) -  SendMessagetDto - Send message to chat
	



