# test CrateChatRoom
curl -X POST -H "Content-Type: application/json" -d '{"name": "My chat room", "private": false, "password": "password123", "deleted": false, "ownersID": [1,2], "participantsID": [1,2,3], "mutedUsersID": [], "bannedUsersID": [], "invitedUsersID": []}' http://localhost:3000/chat/create

# test GetChatRoom
