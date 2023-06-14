api fetch endpoints

users/
	me/ - UserProfile - personal profile of token bearer
	profile/:id - UserProfile - id owners personal profile
	
	manage/
		send-friend-request/:receiverId (POST)
		approve-friend-request/:requesteeId (POST)
		reject-friend-request/:requesterId (POST)
		remove-friend/:friendId (POST)
		block-user/:blockeeId (POST)
		unblock-user/:blockeeId (POST)

		get-all-pending-friend-request/

		friends/ - get token bearers friends

chat/
	available/ - Chat[] - Personal and Group chats available to token bearer
	create/ (POST) - CreateChatRequest - Create a chat room
	:chatId (DELETE) - Delete a chat room

	roles/
		:chatId/join (POST) - JoinChatDto - Accept pending request and join
		:chatId/(:role)(or Any) - Get chat relatives
		:chatId/invite/:userId (POST) - Invite to chat
		:chatId/invite/accept (POST) - Accept an invite to a chat
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
			- approved
			- blocked
			- declined
			- removed
			- unblocked
			- ...
		- online
			- online
			- offline
			- ingame
	- game
		-...
