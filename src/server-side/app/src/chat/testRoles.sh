# all chats display
curl -X GET http://localhost:3000/chat/all

# create chat
curl -X POST -H "Content-Type: application/json" -d '{"userId": 1}' http://localhost:3000/roles/chats/1/participants

curl -X GET http://localhost:3000/roles/users/1/


curl -X POST -H "Content-Type: application/json" -d '{"userId": 1}' http://localhost:3000/roles/chats/1/participants