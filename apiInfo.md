api fetch endpoints

auth/
	DevToken/
	DevUser/
	redirect/
	validate/

users/
	profile/:id - UserProfile - id owners personal profile
	all/ - get all profiles (except blocked)
	:id/all <-- 
	
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
	edit/ (POST) - {"password":"passHere"} - change password 
	:chatId (DELETE) - Delete a chat room

	roles/
		:chatId/join (POST) - JoinChatDto - Accept pending request and join
		:chatId/leave (POST) -  Accept pending request and join
		:chatId/invite (POST) - {"user":"herename"} - inviUser to chat
		:chatId/(:role)(or Any) - Get chat relatives
		:chatId/invite/ (POST) - Invite to chat
		:chatId/:userId - (DELETE) - delete chat member - Kick
		:chatId/ - (DELETE) - userIds: number[] - delete chat members - Kick many
		:chatId/promote (POST) - {"user":"herename"} - promote user
		:chatId/promote (POST) - {"user":"herename"} - demote user
		:chatId/ban  (POST) - {"user":"herename"} 
		:chatId/unban (POST) - {"user":"herename"} 
		...|analogic| -> mute unmute
	
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
