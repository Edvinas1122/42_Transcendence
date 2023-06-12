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
		user/:recipientId (Post) - SendMessageDto - Send personal message to user
	

// SSE events points

events/:id (GET) - get unseen events - 
events/sse/ - Subscibable SSE event port

event types - 
	- chat
		- room : (room_id)
			- added -- new chat visible to user
			- invited -- invited to chat a user
			- kicked -- user is kicked from chat
			- joined -- some user joined chat
			- ...
		- message : (room_id)
			- received
			- ...
	- users
		- friends
			- invited
			- ...
		- online
			- 
	- game
		-...
